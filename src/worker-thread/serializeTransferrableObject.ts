import { store } from './strings';
import { TransferrableObjectType } from '../transfer/TransferrableMutation';
import { Serializable, TransferrableObject } from './worker-thread';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { BytesStream } from '../transfer/BytesStream';

/**
 * Serializes arguments into a Uint16 compatible format.
 *
 * The serialization format uses a variable length tuple, with the first item
 * being the encoded representation's type and any number of values afterwards.
 *
 * @param args The arguments to serialize
 */
export function serializeTransferableMessage(args: Array<Serializable | undefined>, stream?: BytesStream): BytesStream {
  stream = stream || new BytesStream(estimateSizeInBytes(args));
  stream.appendUint32(args.length);

  for (let i = 0; i < args.length; i++) {
    const arg: any = args[i];

    if (arg === undefined) {
      stream.appendUint8(TransferrableObjectType.Undefined);
      continue;
    }

    if (arg === null) {
      stream.appendUint8(TransferrableObjectType.Null);
      continue;
    }

    if (typeof arg === 'number') {
      if (Number.isInteger(arg)) {
        stream.appendUint8(TransferrableObjectType.SmallInt);
        stream.appendInt32(arg);
      } else {
        stream.appendUint8(TransferrableObjectType.Float);
        stream.appendFloat32(arg);
      }

      continue;
    }

    if (typeof arg === 'string') {
      stream.appendUint8(TransferrableObjectType.String);
      stream.appendUint16(store(arg));
      continue;
    }

    if (typeof arg === 'boolean') {
      stream.appendUint8(TransferrableObjectType.Boolean);
      stream.appendUint8(arg ? 1 : 0);
      continue;
    }

    if (Array.isArray(arg)) {
      stream.appendUint8(TransferrableObjectType.Array);
      stream = serializeTransferableMessage(arg, stream);
      continue;
    }

    if (
      arg instanceof Int8Array ||
      arg instanceof Int16Array ||
      arg instanceof Int32Array ||
      arg instanceof Uint8Array ||
      arg instanceof Uint16Array ||
      arg instanceof Uint32Array ||
      arg instanceof Uint8ClampedArray ||
      arg instanceof Float32Array ||
      arg instanceof Float64Array
    ) {
      stream.appendTypedArray(arg);
      continue;
    }

    if (typeof arg === 'object') {
      const serializedObject = (arg as TransferrableObject)[TransferrableKeys.serializeAsTransferrableObject]();
      stream.appendUint8(serializedObject[0]); // type
      stream.appendUint16(serializedObject[1]); // id
      continue;
    }

    throw new Error('Cannot serialize argument.');
  }

  return stream;
}

export function estimateSizeInBytes(args: any[]) {
  let size = Uint32Array.BYTES_PER_ELEMENT; // args count
  for (let i = 0; i < args.length; i++) {
    const arg: any = args[i];

    size += Uint8Array.BYTES_PER_ELEMENT; // type

    if (arg === undefined) {
      continue;
    }

    if (arg === null) {
      continue;
    }

    if (typeof arg === 'string') {
      size += Uint16Array.BYTES_PER_ELEMENT;
      continue;
    }

    if (typeof arg === 'boolean') {
      size += Uint8Array.BYTES_PER_ELEMENT;
      continue;
    }

    if (typeof arg === 'number') {
      if (Number.isInteger(arg)) {
        size += Int32Array.BYTES_PER_ELEMENT;
      } else {
        size += Float32Array.BYTES_PER_ELEMENT;
      }
      continue;
    }

    if (Array.isArray(arg)) {
      size += estimateSizeInBytes(arg);
      continue;
    }

    if (arg instanceof Int8Array) {
      size += estimateArraySizeInBytes(arg.length, Int8Array.BYTES_PER_ELEMENT);
      continue;
    }
    if (arg instanceof Int16Array) {
      size += estimateArraySizeInBytes(arg.length, Int16Array.BYTES_PER_ELEMENT);
      continue;
    }
    if (arg instanceof Int32Array) {
      size += estimateArraySizeInBytes(arg.length, Int32Array.BYTES_PER_ELEMENT);
      continue;
    }
    if (arg instanceof Uint8Array) {
      size += estimateArraySizeInBytes(arg.length, Uint8Array.BYTES_PER_ELEMENT);
      continue;
    }
    if (arg instanceof Uint8ClampedArray) {
      size += estimateArraySizeInBytes(arg.length, Uint8ClampedArray.BYTES_PER_ELEMENT);
      continue;
    }
    if (arg instanceof Uint16Array) {
      size += estimateArraySizeInBytes(arg.length, Uint16Array.BYTES_PER_ELEMENT);
      continue;
    }
    if (arg instanceof Uint32Array) {
      size += estimateArraySizeInBytes(arg.length, Uint32Array.BYTES_PER_ELEMENT);
      continue;
    }
    if (arg instanceof Float32Array) {
      size += estimateArraySizeInBytes(arg.length, Float32Array.BYTES_PER_ELEMENT);
      continue;
    }
    if (arg instanceof Float64Array) {
      size += estimateArraySizeInBytes(arg.length, Float64Array.BYTES_PER_ELEMENT);
      continue;
    }
    if (arg instanceof BigInt64Array) {
      size += estimateArraySizeInBytes(arg.length, BigInt64Array.BYTES_PER_ELEMENT);
      continue;
    }
    if (arg instanceof BigUint64Array) {
      size += estimateArraySizeInBytes(arg.length, BigUint64Array.BYTES_PER_ELEMENT);
      continue;
    }

    if (typeof arg === 'object') {
      size += Uint16Array.BYTES_PER_ELEMENT;
      continue;
    }
  }
  return size;
}

function estimateArraySizeInBytes(length: number, bytesPerElement: number): number {
  return (
    length * bytesPerElement + // bytes size
    bytesPerElement + // offset buffer
    Uint8Array.BYTES_PER_ELEMENT + // type
    Uint32Array.BYTES_PER_ELEMENT // length
  );
}
