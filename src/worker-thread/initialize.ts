import { store as storeString } from './strings';
import { Document } from './dom/Document';
import { HydrateableNode } from '../transfer/TransferrableNodes';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { appendKeys as addCssKeys } from './css/CSSStyleDeclaration';
import { appendGlobalEventProperties } from './dom/HTMLElement';
import { initializeStorage, WorkerStorageInit } from './initialize-storage';
import { HTMLCanvasElement } from './dom/HTMLCanvasElement';

export function initialize(
  document: Document,
  strings: Array<string>,
  hydrateableNode: HydrateableNode,
  cssKeys: Array<string>,
  globalEventHandlerKeys: Array<string>,
  [innerWidth, innerHeight]: [number, number],
  localStorageInit: WorkerStorageInit,
  sessionStorageInit: WorkerStorageInit,
  webGLInfo: {
    [type: string]: {
      extensions: string[] | null;
      attributes: WebGLContextAttributes | null;
      parameters: { [key: number]: any } | null;
    } | null;
  },
): void {
  addCssKeys(cssKeys);
  appendGlobalEventProperties(globalEventHandlerKeys);
  strings.forEach(storeString);
  (hydrateableNode[TransferrableKeys.childNodes] || []).forEach((child) =>
    document.body.appendChild(document[TransferrableKeys.hydrateNode](strings, child)),
  );
  const window = document.defaultView;
  window.innerWidth = innerWidth;
  window.innerHeight = innerHeight;
  initializeStorage(document, localStorageInit, sessionStorageInit);

  HTMLCanvasElement.webGLInfo = webGLInfo;
}
