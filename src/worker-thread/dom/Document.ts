import { Element, NS_NAME_TO_CLASS } from './Element';
import { HTMLElement } from './HTMLElement';
import './HTMLAnchorElement';
import './HTMLButtonElement';
import './HTMLCanvasElement';
import './HTMLDataElement';
import './HTMLDataListElement';
import './HTMLEmbedElement';
import './HTMLFieldSetElement';
import './HTMLFormElement';
import './HTMLIFrameElement';
import './HTMLImageElement';
import './HTMLInputElement';
import './HTMLLabelElement';
import './HTMLLinkElement';
import './HTMLMapElement';
import './HTMLMeterElement';
import './HTMLModElement';
import './HTMLOListElement';
import './HTMLOptionElement';
import './HTMLProgressElement';
import './HTMLQuoteElement';
import './HTMLScriptElement';
import './HTMLSelectElement';
import './HTMLSourceElement';
import './HTMLStyleElement';
import './HTMLTableCellElement';
import './HTMLTableColElement';
import './HTMLTableElement';
import './HTMLTableRowElement';
import './HTMLTableSectionElement';
import './HTMLTimeElement';
import { matchChildElement } from './matchElements';
import { NamespaceURI, Node } from './Node';
import { Text } from './Text';
import { Comment } from './Comment';
import { toLower } from '../../utils';
import { DocumentFragment } from './DocumentFragment';
import { PostMessage } from '../worker-thread';
import { HTML_NAMESPACE, HydrateableNode, NodeType } from '../../transfer/TransferrableNodes';
import { Phase } from '../../transfer/Phase';
import { propagate as propagateEvents } from '../Event';
import { propagate as propagateSyncValues } from '../SyncValuePropagation';
import { propagate as propagateResize } from '../ResizePropagation';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { GlobalScope, WorkerDOMGlobalScope } from '../WorkerDOMGlobalScope';
import { set as setPhase } from '../phase';
import { callGlobalFunction } from '../function';
import { createObjectReference } from '../object-reference';
import { Range, Selection } from './Selection';
import { Location } from './Location';

const DOCUMENT_NAME = '#document';

export class Document extends Element {
  public readonly creationTime = performance.now();
  public defaultView: WorkerDOMGlobalScope;
  public documentElement: Document;
  public body: Element;
  public _location: Location;

  // Internal variables.
  public postMessage: PostMessage;
  public addGlobalEventListener: Function;
  public removeGlobalEventListener: Function;
  public [TransferrableKeys.allowTransfer]: boolean = true;

  constructor(global: GlobalScope) {
    super(NodeType.DOCUMENT_NODE, DOCUMENT_NAME, HTML_NAMESPACE, null);
    // Element uppercases its nodeName, but Document doesn't.
    this.nodeName = DOCUMENT_NAME;
    this.documentElement = this; // TODO(choumx): Should be the <html> element.

    this.defaultView = Object.assign(global, {
      document: this,
      addEventListener: this.addEventListener.bind(this),
      removeEventListener: this.removeEventListener.bind(this),
      getSelection: this.getSelection.bind(this),
      focus: () => {
        callGlobalFunction(this, 'focus', []).catch((reason) => console.log('Fail to focus window.', reason));
      },
    });
  }

  /**
   * Observing the Document indicates it's attached to a main thread
   * version of the document.
   *
   * Each mutation needs to be transferred, synced values need to propagate.
   */
  public [TransferrableKeys.observe](): void {
    setPhase(Phase.Hydrating);
    propagateEvents(this.defaultView);
    propagateSyncValues(this.defaultView);
    propagateResize(this.defaultView);
  }

  /**
   * Hydrate
   * @param strings
   * @param skeleton
   */
  public [TransferrableKeys.hydrateNode](strings: Array<string>, skeleton: HydrateableNode): Node {
    switch (skeleton[TransferrableKeys.nodeType]) {
      case NodeType.TEXT_NODE:
        return new Text(strings[skeleton[TransferrableKeys.textContent] as number], this, skeleton[TransferrableKeys.index]);
      case NodeType.COMMENT_NODE:
        return new Comment(strings[skeleton[TransferrableKeys.textContent] as number], this, skeleton[TransferrableKeys.index]);
      default:
        const namespaceURI: string = strings[skeleton[TransferrableKeys.namespaceURI] as number] || HTML_NAMESPACE;
        const localName: string = strings[skeleton[TransferrableKeys.localOrNodeName]];
        const constructor = NS_NAME_TO_CLASS[`${namespaceURI}:${localName}`] || HTMLElement;
        const node = new constructor(NodeType.ELEMENT_NODE, localName, namespaceURI, this, skeleton[TransferrableKeys.index]);

        (skeleton[TransferrableKeys.attributes] || []).forEach((attribute) =>
          // AttributeNamespaceURI = strings[attribute[0]] !== 'null' ? strings[attribute[0]] : HTML_NAMESPACE
          node.setAttributeNS(
            strings[attribute[0]] !== 'null' ? strings[attribute[0]] : HTML_NAMESPACE,
            strings[attribute[1]],
            strings[attribute[2]],
          ),
        );
        (skeleton[TransferrableKeys.childNodes] || []).forEach((child) => node.appendChild(this[TransferrableKeys.hydrateNode](strings, child)));
        return node;
    }
  }

  public get location() {
    if (this._location) {
      return this._location;
    }

    this._location = createObjectReference(this, self, 'location', [], (id) => new Location(id, this, this.locationInfo));
    return this._location;
  }

  public createElement(name: string): Element {
    return this.createElementNS(HTML_NAMESPACE, toLower(name));
  }

  public createElementNS(namespaceURI: NamespaceURI, localName: string): Element {
    const constructor = NS_NAME_TO_CLASS[`${namespaceURI}:${localName}`] || HTMLElement;
    return new constructor(NodeType.ELEMENT_NODE, localName, namespaceURI, this);
  }

  /**
   * Note: Unlike DOM, Event subclasses (e.g. MouseEvent) are not instantiated based on `type`.
   * @param type
   */
  public createEvent(type: string): Event {
    return new Event(type, { bubbles: false, cancelable: false });
  }

  public createTextNode(text: string): Text {
    return new Text(text, this);
  }

  public createComment(text: string): Comment {
    return new Comment(text, this);
  }

  public createDocumentFragment(): DocumentFragment {
    return new DocumentFragment(this);
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById
   * @return Element with matching id attribute.
   */
  public getElementById(id: string): Element | null {
    return matchChildElement(this.body, (element) => element.id === id);
  }

  public getSelection(): Selection {
    return createObjectReference(this, this, 'getSelection', [], (id) => new Selection(id, this));
  }

  public createRange() {
    return createObjectReference(this, this, 'createRange', [], (id) => new Range(id, this));
  }
}
