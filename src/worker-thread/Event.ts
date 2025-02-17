/**
 * @fileoverview
 * WorkerDOM's `Event` class. `CustomEvent` is available natively in web worker.
 */

import { Node } from './dom/Node';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { EventToWorker, MessageType } from '../transfer/Messages';
import { TransferrableEvent, TransferrableTouchList } from '../transfer/TransferrableEvent';
import { get } from './nodes';
import { Document } from './dom/Document';
import { WorkerDOMGlobalScope } from './WorkerDOMGlobalScope';
import { EventTarget } from './event-subscription/EventTarget';
import { TransferrableObjectType } from '../transfer/TransferrableMutation';
import { getObjectReference } from './object-reference';

interface EventOptions {
  bubbles?: boolean;
  cancelable?: boolean;
}

interface UIEventOptions extends EventOptions {
  view?: WorkerDOMGlobalScope;
  detail?: number;
}

export type EventHandler = (event: Event) => any;

export interface AddEventListenerOptions {
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
  workerDOMPreventDefault?: boolean;
}

interface Touch {
  readonly identifier: number;
  readonly screenX: number;
  readonly screenY: number;
  readonly clientX: number;
  readonly clientY: number;
  readonly pageX: number;
  readonly pageY: number;
  readonly target: Node | null;
}

interface TouchList {
  [key: number]: Touch;

  length: number;
  item: (index: number) => Touch | null;
}

export class Event {
  public bubbles: boolean;
  public cancelable: boolean;
  public cancelBubble: boolean;
  public currentTarget: EventTarget;
  public defaultPrevented: boolean;
  public eventPhase: number;
  public isTrusted: boolean;
  public returnValue: boolean;
  // public srcElement: Element | null;
  // TODO(KB): Restore srcElement.
  public target: EventTarget | null;
  public timeStamp: number;
  public type: string;
  public scoped: boolean;
  public [TransferrableKeys.stop]: boolean = false;
  public [TransferrableKeys.end]: boolean = false;
  public pageX?: number;
  public pageY?: number;
  public offsetX?: number;
  public offsetY?: number;
  public touches?: TouchList;
  public changedTouches?: TouchList;
  public clientX?: number;
  public clientY?: number;
  public button?: number;
  public buttons?: number;
  public detail?: number;

  constructor(type: string, opts: EventOptions) {
    this.type = type;
    this.bubbles = opts && !!opts.bubbles;
    this.cancelable = opts && !!opts.cancelable;
  }

  public stopPropagation(): void {
    this[TransferrableKeys.stop] = true;
  }

  public stopImmediatePropagation(): void {
    this[TransferrableKeys.end] = this[TransferrableKeys.stop] = true;
  }

  public preventDefault(): void {
    this.defaultPrevented = true;
  }

  /** Event.initEvent() is deprecated but supported here for legacy usage.  */
  public initEvent(type: string, bubbles: boolean, cancelable: boolean) {
    this.type = type;
    this.bubbles = bubbles;
    this.cancelable = cancelable;
  }
}

export class UIEvent extends Event {
  public view: WorkerDOMGlobalScope | null;
  public detail: number;

  constructor(type: string, opts: UIEventOptions) {
    super(type, opts);
    this.view = opts.view || null;
    this.detail = opts.detail || 0;
  }

  public initUIEvent(type: string, canBubble: boolean, cancelable: boolean, view: WorkerDOMGlobalScope, detail: number) {
    super.initEvent(type, canBubble, cancelable);
    this.view = view;
    this.detail = detail;
  }
}

export class MouseEvent extends UIEvent {}

export class TouchEvent extends UIEvent {}

export class FocusEvent extends UIEvent {}

export class KeyboardEvent extends UIEvent {}

export class WheelEvent extends MouseEvent {}

export class InputEvent extends UIEvent {}

const eventType = (type: string, opts: UIEventOptions) => {
  switch (type) {
    case 'click':
    case 'dblclick':
    case 'mouseup':
    case 'mousedown':
      return new MouseEvent(type, opts);
    case 'touchstart':
    case 'touchend':
    case 'touchmove':
    case 'touchcancel':
      return new TouchEvent(type, opts);
    case 'focusout':
    case 'focusin':
    case 'blur':
    case 'focus':
      return new FocusEvent(type, opts);
    case 'keydown':
    case 'keyup':
    case 'keypress':
      return new KeyboardEvent(type, opts);
    case 'wheel':
      return new WheelEvent(type, opts);
    case 'beforeinput':
    case 'input':
      return new InputEvent(type, opts);
    default:
      return new Event(type, opts);
  }
};

/**
 * Determine the target for a TransferrableEvent.
 * @param document Event intended within the scope of this document.
 * @param event
 */
const targetFromTransfer = (document: Document, event: TransferrableEvent): Node | null => {
  if (event[TransferrableKeys.target]) {
    const index = event[TransferrableKeys.target];
    if (event[TransferrableKeys.nodeType] === TransferrableObjectType.HTMLElement) {
      // If the target was sent as index 0, use the current document.
      return get(index !== 0 ? index : document[TransferrableKeys.index]);
    } else {
      return getObjectReference(index);
    }
  }
  return null;
};

/**
 *
 * @param document
 * @param event
 */
const touchListFromTransfer = (
  document: Document,
  event: TransferrableEvent,
  key: TransferrableKeys.touches | TransferrableKeys.changedTouches,
): TouchList | undefined => {
  if (event[key] !== undefined) {
    const touchListKeys = Object.keys(event[key] as TransferrableTouchList);
    const list: TouchList = {
      length: touchListKeys.length,
      item(index: number) {
        return this[index] || null;
      },
    };

    touchListKeys.forEach((touchListKey) => {
      const numericKey = Number(touchListKey);
      const transferredTouch = (event[key] as TransferrableTouchList)[numericKey];
      list[numericKey] = {
        identifier: transferredTouch[0],
        screenX: transferredTouch[1],
        screenY: transferredTouch[2],
        clientX: transferredTouch[3],
        clientY: transferredTouch[4],
        pageX: transferredTouch[5],
        pageY: transferredTouch[6],
        target: get(transferredTouch[7] !== 0 ? transferredTouch[7] : document[TransferrableKeys.index]),
      };
    });

    return list;
  }
  return undefined;
};

/**
 * When an event is dispatched from the main thread, it needs to be propagated in the worker thread.
 * Propagate adds an event listener to the worker global scope and uses the WorkerDOM Node.dispatchEvent
 * method to dispatch the transfered event in the worker thread.
 */
export function propagate(global: WorkerDOMGlobalScope): void {
  const document = global.document;
  if (!document.addGlobalEventListener) {
    return;
  }
  document.addGlobalEventListener('message', ({ data }: { data: EventToWorker }) => {
    if (data[TransferrableKeys.type] !== MessageType.EVENT) {
      return;
    }

    const event = data[TransferrableKeys.event] as TransferrableEvent;
    const node =
      event[TransferrableKeys.nodeType] == TransferrableObjectType.HTMLElement
        ? get(event[TransferrableKeys.index])
        : getObjectReference(event[TransferrableKeys.index]);
    if (node !== null) {
      const propertiesValues = event[TransferrableKeys.listenableProperties] || [];
      if (propertiesValues.length > 0) {
        const propertiesNames = node[TransferrableKeys.listenableProperties] || [];
        for (let i = 0; i < propertiesNames.length; i++) {
          const propertyName = propertiesNames[i];
          if (node[propertyName] != propertiesValues[i]) {
            node[propertyName] = propertiesValues[i];
          }
        }
      }

      if (event[TransferrableKeys.boundingClientRect] && 'boundingClientRect' in node) {
        node.boundingClientRect = event[TransferrableKeys.boundingClientRect];
      }

      node.dispatchEvent(
        Object.assign(
          eventType(event[TransferrableKeys.type], {
            bubbles: event[TransferrableKeys.bubbles] || false,
            cancelable: event[TransferrableKeys.cancelable] || false,
            view: global,
          }),
          {
            cancelBubble: event[TransferrableKeys.cancelBubble] || false,
            defaultPrevented: event[TransferrableKeys.defaultPrevented] || false,
            eventPhase: event[TransferrableKeys.eventPhase],
            isTrusted: event[TransferrableKeys.isTrusted] || false,
            returnValue: event[TransferrableKeys.returnValue] || false,
            target: targetFromTransfer(global.document, event),
            timeStamp: event[TransferrableKeys.timeStamp],
            scoped: event[TransferrableKeys.scoped],
            keyCode: event[TransferrableKeys.keyCode],
            pageX: event[TransferrableKeys.pageX],
            pageY: event[TransferrableKeys.pageY],
            offsetX: event[TransferrableKeys.offsetX],
            offsetY: event[TransferrableKeys.offsetY],
            touches: touchListFromTransfer(global.document, event, TransferrableKeys.touches),
            changedTouches: touchListFromTransfer(global.document, event, TransferrableKeys.changedTouches),
            clientX: event[TransferrableKeys.clientX],
            clientY: event[TransferrableKeys.clientY],
            button: event[TransferrableKeys.button] || 0,
            buttons: event[TransferrableKeys.buttons] || 0,
            detail: event[TransferrableKeys.detail] || 0,
          },
        ),
      );
    }
  });
}
