import { HTMLElement } from './HTMLElement';
import { registerSubclass } from './Element';
import { reflectProperties } from './enhanceElement';
import { CanvasRenderingContext2DShim } from '../canvas/CanvasRenderingContext2D';
import { WebGLRenderingContextPolyfill } from '../canvas/WebGLRenderingContextPolyfill';
import { Document } from './Document';
import { createObjectReference } from '../object-reference';

export class HTMLCanvasElement extends HTMLElement {
  private context2d: CanvasRenderingContext2DShim<HTMLCanvasElement>;
  private contextWebGL: WebGLRenderingContextPolyfill;

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
          const id = createObjectReference(this.ownerDocument as Document, this, 'getContext', [...arguments]);
          this.contextWebGL = new WebGLRenderingContextPolyfill(id, this, contextAttributes);
        }
        return this.contextWebGL;
      default:
        throw new Error(`Context type "${contextType}" not supported.`);
    }
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
