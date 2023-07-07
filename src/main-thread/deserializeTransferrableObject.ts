import { StringContext } from './strings';
import { TransferrableObjectType } from '../transfer/TransferrableMutation';
import { NodeContext } from './nodes';
import { ObjectContext } from './object-context';
import { BytesStream } from '../transfer/BytesStream';

export function deserializeTransferableMessage(
  buffer: BytesStream,
  stringContext: StringContext,
  nodeContext: NodeContext,
  objectContext: ObjectContext,
): any[] {
  const count = buffer.readUint32();
  const args: any[] = new Array(count);

  for (let i = 0; i < count; i++) {
    const type = buffer.readUint8() as TransferrableObjectType;
    switch (type) {
      case TransferrableObjectType.Undefined:
        args[i] = undefined;
        break;
      case TransferrableObjectType.Null:
        args[i] = null;
        break;
      case TransferrableObjectType.SmallInt:
        args[i] = buffer.readInt32();
        break;
      case TransferrableObjectType.Float:
        args[i] = buffer.readFloat32();
        break;
      case TransferrableObjectType.String:
        args[i] = stringContext.get(buffer.readUint16());
        break;
      case TransferrableObjectType.Boolean:
        args[i] = buffer.readUint8() === 1;
        break;
      case TransferrableObjectType.Array:
        args[i] = deserializeTransferableMessage(buffer, stringContext, nodeContext, objectContext);
        break;
      case TransferrableObjectType.TransferObject:
        args[i] = objectContext.get(buffer.readUint16());
        break;
      case TransferrableObjectType.CanvasRenderingContext2D:
        const canvas = nodeContext.getNode(buffer.readUint16()) as HTMLCanvasElement;
        args[i] = canvas.getContext('2d');
        break;
      case TransferrableObjectType.HTMLElement:
        args[i] = nodeContext.getNode(buffer.readUint16());
        break;
      case TransferrableObjectType.Window:
        args[i] = window;
        buffer.readUint16(); // TODO: fix
        break;
      case TransferrableObjectType.Int8Array:
      case TransferrableObjectType.Int16Array:
      case TransferrableObjectType.Int32Array:
      case TransferrableObjectType.Uint8ClampedArray:
      case TransferrableObjectType.Uint8Array:
      case TransferrableObjectType.Uint16Array:
      case TransferrableObjectType.Uint32Array:
      case TransferrableObjectType.Float32Array:
      case TransferrableObjectType.Float64Array:
        args[i] = buffer.readTypedArray(type);
        break;

      default:
        throw new Error('Cannot deserialize argument.');
    }
  }
  return args;
}
