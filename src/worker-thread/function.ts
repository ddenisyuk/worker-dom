import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { Document } from './dom/Document';
import { CallFunctionResultToWorker, FunctionCallToWorker, MessageToWorker, MessageType, ResolveOrReject } from '../transfer/Messages';
import { transfer } from './MutationTransfer';
import { TransferrableMutationType } from '../transfer/TransferrableMutation';
import { DocumentStub } from './dom/DocumentStub';
import { TransferrableObject } from './worker-thread';

const exportedFunctions: { [fnIdent: string]: Function } = {};

let fnCallCount = 0;

export function callGlobalFunction(document: Document | DocumentStub, functionName: string, args: any[], timeout?: number): Promise<any> {
  return callFunction(document, self, functionName, args, timeout);
}

export function callFunction(
  document: Document | DocumentStub,
  target: TransferrableObject | Document | typeof globalThis,
  functionName: string,
  args: any[],
  timeout?: number,
  isFunctionAsync: boolean = false,
  resultObjectId: number = 0,
): Promise<any> {
  return new Promise((resolve, reject) => {
    // Wraparound to 0 in case someone attempts to register over 9 quadrillion functions.
    if (fnCallCount >= Number.MAX_VALUE) {
      fnCallCount = 0;
    }
    const rid = ++fnCallCount;

    let timeoutObg: any = null;

    const messageHandler = ({ data }: { data: MessageToWorker }) => {
      if (data[TransferrableKeys.type] === MessageType.CALL_FUNCTION_RESULT) {
        const msg: CallFunctionResultToWorker = data as CallFunctionResultToWorker;
        if (msg[TransferrableKeys.index] === rid) {
          clearTimeout(timeoutObg);
          document.removeGlobalEventListener('message', messageHandler);
          const result: any = msg[TransferrableKeys.value];

          if (msg[TransferrableKeys.success]) {
            resolve(result);
          } else {
            reject(new Error(result));
          }
        }
      }
    };

    if (!document.addGlobalEventListener) {
      reject();
    } else {
      document.addGlobalEventListener('message', messageHandler);
      transfer(document, [TransferrableMutationType.CALL_FUNCTION, target, functionName, rid, isFunctionAsync, args, resultObjectId]);

      if (timeout && timeout > 0) {
        timeoutObg = setTimeout(() => {
          document.removeGlobalEventListener('message', messageHandler);
          clearTimeout(timeoutObg);
          reject(new Error('Timeout'));
        }, timeout);
      }
    }
  });
}

export function callFunctionMessageHandler(event: MessageEvent, document: Document | DocumentStub) {
  const msg = event.data as MessageToWorker;
  if (msg[TransferrableKeys.type] !== MessageType.FUNCTION) {
    return;
  }

  const functionMessage = msg as FunctionCallToWorker;
  const fnIdentifier = functionMessage[TransferrableKeys.functionIdentifier];
  const fnArguments = JSON.parse(functionMessage[TransferrableKeys.functionArguments]);
  const index = functionMessage[TransferrableKeys.index];

  const fn = exportedFunctions[fnIdentifier];
  if (!fn) {
    transfer(document, [
      TransferrableMutationType.FUNCTION_CALL,
      ResolveOrReject.REJECT,
      index,
      JSON.stringify(`[worker-dom]: Exported function "${fnIdentifier}" could not be found.`),
    ]);
    return;
  }

  Promise.resolve(fn) // Forcing promise flows allows us to skip a try/catch block.
    .then((f) => f.apply(null, fnArguments))
    .then(
      (value) => {
        transfer(document, [TransferrableMutationType.FUNCTION_CALL, ResolveOrReject.RESOLVE, index, JSON.stringify(value)]);
      },
      (err: Error) => {
        const errorMessage = JSON.stringify(err.message || err);

        transfer(document, [
          TransferrableMutationType.FUNCTION_CALL,
          ResolveOrReject.REJECT,
          index,
          JSON.stringify(`[worker-dom]: Function "${fnIdentifier}" threw: "${errorMessage}"`),
        ]);
      },
    );
}

export function exportFunction(name: string, fn: Function) {
  if (!name || name === '') {
    throw new Error(`[worker-dom]: Attempt to export function was missing an identifier.`);
  }
  if (typeof fn !== 'function') {
    throw new Error(`[worker-dom]: Attempt to export non-function failed: ("${name}", ${typeof fn}).`);
  }
  if (name in exportedFunctions) {
    throw new Error(`[worker-dom]: Attempt to re-export function failed: "${name}".`);
  }
  exportedFunctions[name] = fn;
}

export function resetForTesting() {
  for (const key of Object.keys(exportedFunctions)) {
    delete exportedFunctions[key];
  }
}
