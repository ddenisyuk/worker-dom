import { transfer } from './MutationTransfer';
import { Document } from './dom/Document';
import { TransferrableMutationType } from '../transfer/TransferrableMutation';
import { store } from './strings';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { serializeTransferrableObject } from './serializeTransferrableObject';
import { DocumentStub } from './dom/DocumentStub';
import { TransferrableObject } from './worker-thread';

let objectId = 0;

/**
 * Creates object in the main thread, and associates it with the returned id.
 *
 * @param document Target document.
 * @param target Target object to use for object creation.
 * @param creationMethod Method to use for object creation.
 * @param creationArgs Arguments to pass into the creation method.
 * @return objectId Object reference ID.
 */
export function createObjectReference(
  document: Document | DocumentStub,
  target: TransferrableObject,
  creationMethod: string,
  creationArgs: any[],
): number {
  // Wraparound to 0 in case someone attempts to register over 9 quadrillion objects.
  if (objectId >= Number.MAX_VALUE) {
    objectId = 0;
  }

  const id = ++objectId;
  transfer(document, [
    TransferrableMutationType.OBJECT_CREATION,
    store(creationMethod),
    id,
    creationArgs.length,
    ...target[TransferrableKeys.serializeAsTransferrableObject](),
    ...serializeTransferrableObject(creationArgs),
  ]);

  return id;
}
