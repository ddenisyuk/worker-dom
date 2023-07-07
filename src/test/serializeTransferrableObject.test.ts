import anyTest, { TestInterface } from 'ava';
import * as sinon from 'sinon';
import { estimateSizeInBytes, serializeTransferableMessage } from '../worker-thread/serializeTransferrableObject';
import { TransferrableObjectType } from '../transfer/TransferrableMutation';
import { store } from '../worker-thread/strings';
import { CanvasGradient } from '../worker-thread/canvas/CanvasGradient';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { BytesStream } from '../transfer/BytesStream';

const test = anyTest as TestInterface<{}>;

test('Serializes Integers', (t) => {
  const serialized = serializeTransferableMessage([1]);

  const expected = new BytesStream(estimateSizeInBytes([1]));
  expected.appendUint32(1); // parameters count
  expected.appendUint8(TransferrableObjectType.SmallInt);
  expected.appendInt32(1);

  t.deepEqual(serialized.internal, expected.internal);
});

test('Serializes Floats', (t) => {
  const serialized = serializeTransferableMessage([1.23]);

  const expected = new BytesStream(estimateSizeInBytes([1.23]));
  expected.appendUint32(1); // parameters count
  expected.appendUint8(TransferrableObjectType.Float);
  expected.appendFloat32(1.23);

  t.deepEqual(serialized.internal, expected.internal);
});

test('Serializes Strings', (t) => {
  const serialized = serializeTransferableMessage(['hello']);

  const expected = new BytesStream(estimateSizeInBytes(['hello']));
  expected.appendUint32(1); // parameters count
  expected.appendUint8(TransferrableObjectType.String);
  expected.appendUint16(store('hello'));

  t.deepEqual(serialized.internal, expected.internal);
});

test('Serializes Arrays', (t) => {
  const serialized = serializeTransferableMessage([[1, 2, 3]]);

  const expected = new BytesStream(estimateSizeInBytes([[1, 2, 3]]));
  expected.appendUint32(1); // parameters count
  expected.appendUint8(TransferrableObjectType.Array);
  expected.appendUint32(3); // array length

  expected.appendUint8(TransferrableObjectType.SmallInt);
  expected.appendInt32(1);
  expected.appendUint8(TransferrableObjectType.SmallInt);
  expected.appendInt32(2);
  expected.appendUint8(TransferrableObjectType.SmallInt);
  expected.appendInt32(3);

  t.deepEqual(serialized.internal, expected.internal);
});

test('Serializes Transferable Objects', (t) => {
  // use a CanvasGradient as an example
  const gradient = {} as CanvasGradient;

  // property must exist before sinon lets us stub it
  gradient[TransferrableKeys.serializeAsTransferrableObject] = () => [];

  // stub must return a value, otherwise object-creation processor will thow when attempting to store
  const fakeSerializedObject = [1, 2, 3, 4] as number[];
  const objectSerializeStub = sinon.stub(gradient, TransferrableKeys.serializeAsTransferrableObject).returns(fakeSerializedObject);
  const serialized = serializeTransferableMessage([gradient]);

  const expected = new BytesStream(estimateSizeInBytes([gradient]));
  expected.appendUint32(1); // parameters count
  expected.appendUint8(fakeSerializedObject[0]); // type
  expected.appendUint16(fakeSerializedObject[1]); // id

  t.true(objectSerializeStub.calledOnce);
  t.deepEqual(serialized.internal, expected.internal);
});
