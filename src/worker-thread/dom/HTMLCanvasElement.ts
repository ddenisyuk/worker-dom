import { HTMLElement } from './HTMLElement';
import { registerSubclass } from './Element';
import { reflectProperties } from './enhanceElement';
import { CanvasRenderingContext2DShim } from '../canvas/CanvasRenderingContext2D';
import { WebGLRenderingContextPolyfill } from "../canvas/WebGLRenderingContextPolyfill";
import { transfer } from "../MutationTransfer";
import { Document } from "./Document";
import { TransferrableMutationType } from "../../transfer/TransferrableMutation";
import { store } from "../strings";
import { TransferrableKeys } from "../../transfer/TransferrableKeys";
import { serializeTransferrableObject } from "../serializeTransferrableObject";

export class HTMLCanvasElement extends HTMLElement {
  private context2d: CanvasRenderingContext2DShim<HTMLCanvasElement>;
  private contextWebGL: WebGLRenderingContextPolyfill;

  private _clientWidth: number = 0;
  private _clientHeight: number = 0;
  private _boundingClientRect: DOMRect;

  getContext(contextType: string, contextAttributes?: {}): CanvasRenderingContext2DShim<HTMLCanvasElement> | WebGLRenderingContextPolyfill {
    switch (contextType.toLowerCase()) {
      case '2d':
        if (!this.context2d) {
          this.context2d = new CanvasRenderingContext2DShim<HTMLCanvasElement>(this);
        }
        return this.context2d;

      case 'webgl':
      case 'experimental-webgl':
      case 'webgl2':
        if (!this.contextWebGL) {
          this.contextWebGL = new WebGLRenderingContextPolyfill(this, {
            contextAttributes: contextAttributes,
            parameters: {
              7938: "WebGL 2.0",
              7937: 'WebKit WebGL',
              7936: 'WebKit',
              34930: 16,
              3379: 16384,
              36348: 15,
              33308: null,
            }
          });

          // TODO: pass contextAttributes to main thread
          this.createObjectReference(this.contextWebGL.id, "getContext", [contextType]);
        }
        return this.contextWebGL;
      default:
        throw new Error(`Context type "${contextType}" not supported.`);
    }
  }

  getBoundingClientRect(): DOMRect {
    return this._boundingClientRect || new DOMRect(0,0, this.width, this.height);
  }

  get clientWidth() {
    return Math.max(this.width, this._clientWidth);
  }

  set clientWidth(clientWidth: number) {
    this._clientWidth = clientWidth;
  }

  get clientHeight() {
    return Math.max(this.height, this._clientHeight);
  }

  set clientHeight(clientHeight: number) {
    this._clientHeight = clientHeight;
  }

  private createObjectReference(objectId: number, creationMethod: string, creationArgs: any[]) {
    transfer(this.ownerDocument as Document, [
      TransferrableMutationType.OBJECT_CREATION,
      store(creationMethod),
      objectId,
      creationArgs.length,
      ...this[TransferrableKeys.serializeAsTransferrableObject](),
      ...serializeTransferrableObject(creationArgs),
    ]);
  }
}
registerSubclass('canvas', HTMLCanvasElement);

// Reflected Properties
// HTMLCanvasElement.height => number, reflected attribute
// HTMLCanvasElement.width => number, reflected attribute
reflectProperties([{ height: [0] }, { width: [0] }], HTMLCanvasElement);

// Unimplemented Properties
// HTMLCanvasElement.mozOpaque => boolean
// HTMLCanvasElement.mozPrintCallback => function

// Unimplemented Methods
// HTMLCanvasElement.captureStream()
// HTMLCanvasElement.toDataURL()
// HTMLCanvasElement.toBlob()
// HTMLCanvasElement.transferControlToOffscreen()
// HTMLCanvasElement.mozGetAsFile()
