import anyTest, { TestInterface } from 'ava';
import { Document } from '../../worker-thread/dom/Document';
import { MutationFromWorker } from '../../transfer/Messages';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { TransferrableMutationType } from '../../transfer/TransferrableMutation';
import { emitter, Emitter } from '../Emitter';
import { createTestingDocument } from '../DocumentCreation';
import { serializeTransferableMessage } from '../../worker-thread/serializeTransferrableObject';

const test = anyTest as TestInterface<{
  document: Document;
  emitter: Emitter;
}>;

test.beforeEach((t) => {
  const document = createTestingDocument();

  t.context = {
    document,
    emitter: emitter(document),
  };
});

test.serial.cb('Text, set data', (t) => {
  const { document, emitter } = t.context;
  const text = document.createTextNode('original text');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    const expected = serializeTransferableMessage([TransferrableMutationType.CHARACTER_DATA, text, 'new text']);

    t.deepEqual(message[TransferrableKeys.mutations], [expected.buffer], 'mutation is as expected');
    t.end();
  }

  Promise.resolve().then(() => {
    emitter.once(transmitted);
    text.data = 'new text';
  });
});

test.serial.cb('Text, set textContent', (t) => {
  const { document, emitter } = t.context;
  const text = document.createTextNode('original text');

  function transmitted(strings: Array<string>, message: MutationFromWorker, buffers: Array<ArrayBuffer>) {
    const expected = serializeTransferableMessage([TransferrableMutationType.CHARACTER_DATA, text, 'new text']);

    t.deepEqual(message[TransferrableKeys.mutations], [expected.buffer], 'mutation is as expected');
    t.end();
  }

  Promise.resolve().then(() => {
    emitter.once(transmitted);
    text.textContent = 'new text';
  });
});
