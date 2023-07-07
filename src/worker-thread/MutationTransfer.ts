import { consume as consumeNodes } from './nodes';
import { consume as consumeStrings } from './strings';
import { MessageType, MutationFromWorker } from '../transfer/Messages';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { Node } from './dom/Node';
import { Phase } from '../transfer/Phase';
import { phase, set as setPhase } from './phase';
import { Document } from './dom/Document';
import { DocumentStub } from './dom/DocumentStub';
import { serializeTransferableMessage } from './serializeTransferrableObject';

let pending = false;
let pendingMutations: Array<ArrayBuffer> = [];

export function transfer(document: Document | DocumentStub, mutation: any[]): void {
  if (process.env.SERVER) {
    return;
  }

  if (phase > Phase.Initializing && document[TransferrableKeys.allowTransfer]) {
    pending = true;
    // pendingMutations = pendingMutations.concat(mutation);
    pendingMutations.push(serializeTransferableMessage(mutation).internal);

    Promise.resolve().then((_) => {
      if (pending) {
        const nodes = new Uint16Array(
          consumeNodes().reduce((acc: Array<number>, node: Node) => acc.concat(node[TransferrableKeys.creationFormat]), []),
        ).buffer;

        document.postMessage(
          {
            [TransferrableKeys.phase]: phase,
            [TransferrableKeys.type]: phase === Phase.Mutating ? MessageType.MUTATE : MessageType.HYDRATE,
            [TransferrableKeys.nodes]: nodes,
            [TransferrableKeys.strings]: consumeStrings(),
            [TransferrableKeys.mutations]: pendingMutations,
          } as MutationFromWorker,
          [nodes, ...pendingMutations],
        );

        pendingMutations = [];
        pending = false;
        setPhase(Phase.Mutating);
      }
    });
  }
}
