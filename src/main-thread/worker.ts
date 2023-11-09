import { MessageToWorker } from '../transfer/Messages';
import { WorkerDOMConfiguration } from './configuration';
import { createHydrateableRootNode } from './serialize';
import { readableHydrateableRootNode, readableMessageToWorker } from './debugging';
import { NodeContext } from './nodes';
import { TransferrableKeys } from '../transfer/TransferrableKeys';
import { StorageLocation } from '../transfer/TransferrableStorage';
import { IframeWorker } from './iframe-worker';

// TODO: Sanitizer storage init is likely broken, since the code currently
// attempts to stringify a Promise.
export type StorageInit =
  | {
  storage: Storage | Promise<StorageValue>;
  errorMsg: null
}
  | {
  storage: null;
  errorMsg: string;
};

export class WorkerContext {
  private [TransferrableKeys.worker]: Worker | IframeWorker;
  private nodeContext: NodeContext;
  private config: WorkerDOMConfiguration;

  /**
   * @param baseElement
   * @param nodeContext
   * @param workerDOMScript
   * @param authorScript
   * @param config
   */
  constructor(baseElement: HTMLElement, nodeContext: NodeContext, workerDOMScript: string, authorScript: string, config: WorkerDOMConfiguration) {
    this.nodeContext = nodeContext;
    this.config = config;

    const { skeleton, strings } = createHydrateableRootNode(baseElement, config, this);
    const cssKeys: Array<string> = [];
    const globalEventHandlerKeys: Array<string> = [];
    // TODO(choumx): Sync read of all localStorage and sessionStorage a possible performance bottleneck?
    const localStorageInit = getStorageInit('localStorage');
    const sessionStorageInit = getStorageInit('sessionStorage');

    for (const key in baseElement.style) {
      cssKeys.push(key);
    }
    for (const key in baseElement) {
      if (key.startsWith('on')) {
        globalEventHandlerKeys.push(key);
      }
    }

    const webgl = getWebGLMetaData();

    // We skip assigning the globals for localStorage and sessionStorage because
    // We've already installed them. Also, accessing them can throw in incognito mode.
    const code = `
      'use strict';
      (function(){
        ${workerDOMScript}
        self['window'] = self;
        var workerDOM = WorkerThread.workerDOM;
        WorkerThread.hydrate(
          workerDOM.document,
          ${JSON.stringify(strings)},
          ${JSON.stringify(skeleton)},
          ${JSON.stringify(cssKeys)},
          ${JSON.stringify(globalEventHandlerKeys)},
          [${window.innerWidth}, ${window.innerHeight}, ${window.devicePixelRatio}],
          ${JSON.stringify(localStorageInit)},
          ${JSON.stringify(sessionStorageInit)},
          ${JSON.stringify(webgl)},
          ${JSON.stringify(window.location)},
        );
        workerDOM.document[${TransferrableKeys.observe}](this);
        Object.assign(self, workerDOM);
      }).call(self);
      ${authorScript}
      //# sourceURL=${encodeURI(config.authorURL)}`;
    if (!config.sandbox) {
      this[TransferrableKeys.worker] = new Worker(URL.createObjectURL(new Blob([code])));
    } else if (IS_AMP) {
      this[TransferrableKeys.worker] = new IframeWorker(URL.createObjectURL(new Blob([code])), config.sandbox.iframeUrl);
    }
    if (WORKER_DOM_DEBUG) {
      console.info('debug', 'hydratedNode', readableHydrateableRootNode(baseElement, config, this));
    }
    if (config.onCreateWorker) {
      config.onCreateWorker(baseElement, strings, skeleton, cssKeys);
    }
  }

  /**
   * Returns a Promise that resolves when the Worker is ready to receive messages.
   * @returns {Promise<void>}
   */
  ready() {
    return (this.worker as IframeWorker).readyPromise || Promise.resolve();
  }

  /**
   * Returns the private worker.
   */
  get worker(): Worker | IframeWorker {
    return this[TransferrableKeys.worker];
  }

  /**
   * @param message
   */
  messageToWorker(message: MessageToWorker, transferables?: Transferable[]) {
    if (WORKER_DOM_DEBUG) {
      console.info('debug', 'messageToWorker', readableMessageToWorker(this.nodeContext, message));
    }
    if (this.config.onSendMessage) {
      this.config.onSendMessage(message);
    }
    message = toCloneable(message);
    transferables = transferables || findTransferable(message);
    this.worker.postMessage(message, transferables);
  }
}

function toCloneable(object: any) {
  if (!!object && typeof object === 'object') {
    for (const [key, value] of Object.entries(object)) {
      if (!!value && typeof value === 'object') {
        if (value instanceof AudioBuffer) {
          // extend list of not cloneable objects, in case of error like: 'AudioBuffer object could not be cloned.'
          const { duration, length, numberOfChannels, sampleRate } = value;
          object[key] = { duration, length, numberOfChannels, sampleRate };
        } else {
          object[key] = toCloneable(value);
        }
      }
    }
  }

  return object;
}

function isPotentialTransferable(object: any) {
  return !!object && typeof object === 'object';
}

function findTransferable(object: any): any[] {
  const transferables: any[] = [];

  if (!isPotentialTransferable(object)) {
    return transferables;
  }

  if (ArrayBuffer.isView(object)) {
    transferables.push(object.buffer);
    return transferables;
  }

  if (
    object instanceof ArrayBuffer ||
    object instanceof MessagePort ||
    object instanceof ReadableStream ||
    object instanceof WritableStream ||
    object instanceof TransformStream ||
    object instanceof RTCDataChannel ||
    object instanceof ImageBitmap ||
    object instanceof VideoFrame ||
    object instanceof OffscreenCanvas ||
    // TS unsupported
    // @ts-ignore
    // object instanceof WebTransportReceiveStream ||
    // @ts-ignore
    object instanceof AudioData
  ) {
    transferables.push(object);
    return transferables;
  }

  if (Array.isArray(object)) {
    object
      .filter((o) => isPotentialTransferable(o))
      .forEach((o) => {
        transferables.push(...findTransferable(o));
      });
    return transferables;
  }

  for (const key in object) {
    const value = object[key];
    if (isPotentialTransferable(value)) {
      transferables.push(...findTransferable(value));
    }
  }

  return transferables;
}

function getStorageInit(type: 'localStorage' | 'sessionStorage', sanitizer?: Sanitizer): StorageInit {
  try {
    if (!sanitizer) {
      return { storage: window[type], errorMsg: null };
    }
    return {
      storage: sanitizer.getStorage(type == 'localStorage' ? StorageLocation.Local : StorageLocation.Session),
      errorMsg: null,
    };
  } catch (err) {
    return { errorMsg: err.message, storage: null };
  }
}

function getWebGLMetaData(): any {
  const result: {
    [type: string]: {
      extensions: string[] | null;
      attributes: WebGLContextAttributes | null;
      parameters: {
        [key: number]: any
      } | null;
      shaderPrecisionFormat: {
        [key: number]: {
          [key: number]: WebGLShaderPrecisionFormat | null
        }
      };
      drawingBufferColorSpace: PredefinedColorSpace;
      unpackColorSpace: PredefinedColorSpace;
      internalformatParameter: {
        [key: number]: number[] | null
      };

    } | null;
  } = {};

  ['webgl', 'webgl2'].forEach((type) => {
    const contextMeta: {
      extensions: string[] | null;
      attributes: WebGLContextAttributes | null;
      parameters: {
        [key: number]: any
      } | null;
      shaderPrecisionFormat: {
        [key: number]: {
          [key: number]: WebGLShaderPrecisionFormat | null
        }
      };
      drawingBufferColorSpace: PredefinedColorSpace;
      unpackColorSpace: PredefinedColorSpace;
      internalformatParameter: {
        [key: number]: number[]
      };
    } = {
      extensions: null,
      attributes: null,
      parameters: null,
      shaderPrecisionFormat: {},
      drawingBufferColorSpace: 'srgb',
      unpackColorSpace: 'srgb',
      internalformatParameter: {},
    };

    try {
      const canvas = window.document.createElement('canvas');

      const context = canvas.getContext(type) as any;
      if (context !== null) {
        const requiredParameters = [
          context.VERSION,
          context.RENDERER,
          context.VENDOR,
          context.SHADING_LANGUAGE_VERSION,
          context.RED_BITS,
          context.GREEN_BITS,
          context.BLUE_BITS,
          context.ALPHA_BITS,
          context.DEPTH_BITS,
          context.STENCIL_BITS,
          context.SUBPIXEL_BITS,

          context.MAX_RENDERBUFFER_SIZE,
          context.MAX_COMBINED_TEXTURE_IMAGE_UNITS,
          context.MAX_CUBE_MAP_TEXTURE_SIZE,
          context.MAX_FRAGMENT_UNIFORM_VECTORS,
          context.MAX_TEXTURE_IMAGE_UNITS,
          context.MAX_TEXTURE_SIZE,
          context.MAX_VARYING_VECTORS,
          context.MAX_VERTEX_ATTRIBS,
          context.MAX_VERTEX_TEXTURE_IMAGE_UNITS,
          context.MAX_VERTEX_UNIFORM_VECTORS,
          context.ALIASED_LINE_WIDTH_RANGE,
          context.ALIASED_POINT_SIZE_RANGE,
          context.MAX_VIEWPORT_DIMS,
          context.IMPLEMENTATION_COLOR_READ_FORMAT,
          context.IMPLEMENTATION_COLOR_READ_TYPE,

          //webgl2
          context.MAX_VERTEX_UNIFORM_COMPONENTS,
          context.MAX_VERTEX_UNIFORM_BLOCKS,
          context.MAX_VERTEX_OUTPUT_COMPONENTS,
          context.MAX_VARYING_COMPONENTS,
          context.MAX_FRAGMENT_UNIFORM_COMPONENTS,
          context.MAX_FRAGMENT_UNIFORM_BLOCKS,
          context.MAX_FRAGMENT_INPUT_COMPONENTS,
          context.MIN_PROGRAM_TEXEL_OFFSET,
          context.MAX_PROGRAM_TEXEL_OFFSET,
          context.MAX_DRAW_BUFFERS,
          context.MAX_COLOR_ATTACHMENTS,
          context.MAX_SAMPLES,
          context.MAX_3D_TEXTURE_SIZE,
          context.MAX_ARRAY_TEXTURE_LAYERS,
          context.MAX_TEXTURE_LOD_BIAS,
          context.MAX_UNIFORM_BUFFER_BINDINGS,
          context.MAX_UNIFORM_BLOCK_SIZE,
          context.UNIFORM_BUFFER_OFFSET_ALIGNMENT,
          context.MAX_COMBINED_UNIFORM_BLOCKS,
          context.MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS,
          context.MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS,
          context.MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS,
          context.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS,
          context.MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS,
          context.MAX_ELEMENT_INDEX,
          context.MAX_ELEMENTS_INDICES,
          context.MAX_ELEMENTS_VERTICES,
          context.MAX_SERVER_WAIT_TIMEOUT,
          context.MAX_CLIENT_WAIT_TIMEOUT_WEBGL,
        ];

        contextMeta.drawingBufferColorSpace = context.drawingBufferColorSpace;
        contextMeta.unpackColorSpace = context.unpackColorSpace;

        contextMeta.attributes = context.getContextAttributes();
        contextMeta.extensions = context.getSupportedExtensions();

        if (contextMeta.extensions && contextMeta.extensions.includes('WEBGL_debug_renderer_info')) {
          const extension = context.getExtension('WEBGL_debug_renderer_info');
          requiredParameters.push(extension.UNMASKED_VENDOR_WEBGL, extension.UNMASKED_RENDERER_WEBGL);
        }

        const parameters: {
          [key: number]: any
        } = {};
        requiredParameters
          .filter((value) => !!value) // filter out unsupported parameters
          .forEach((key) => {
            parameters[key] = context.getParameter(key);
          });

        contextMeta.parameters = parameters;

        // shaderPrecisionFormat
        [context.FRAGMENT_SHADER, context.VERTEX_SHADER].forEach((shaderType) => {
          contextMeta.shaderPrecisionFormat[shaderType] = contextMeta.shaderPrecisionFormat[shaderType] || {};
          [context.LOW_FLOAT, context.MEDIUM_FLOAT, context.HIGH_FLOAT, context.LOW_INT, context.MEDIUM_INT, context.HIGH_INT].forEach(
            (precisionType) => {
              contextMeta.shaderPrecisionFormat[shaderType][precisionType] = context.getShaderPrecisionFormat(shaderType, precisionType);
            },
          );
        });


        // internalformatParameter
        if ('getInternalformatParameter' in context) {
          // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/renderbufferStorage
          const internalformats = [
            context.RGBA4,
            context.RGB565,
            context.RGB5_A1,
            context.DEPTH_COMPONENT16,
            context.STENCIL_INDEX8,
            // context.DEPTH_STENCIL,

            context.R8,
            context.R8UI,
            context.R8I,
            context.R16UI,
            context.R16I,
            context.R32UI,
            context.R32I,
            context.RG8,
            context.RG8UI,
            context.RG8I,
            context.RG16UI,
            context.RG16I,
            context.RG32UI,
            context.RG32I,
            context.RGB8,
            context.RGBA8,
            context.SRGB8_ALPHA8,
            context.RGB10_A2,
            context.RGBA8UI,
            context.RGBA8I,
            context.RGB10_A2UI,
            context.RGBA16UI,
            context.RGBA16I,
            context.RGBA32I,
            context.RGBA32UI,
            context.DEPTH_COMPONENT24,
            context.DEPTH_COMPONENT32F,
            context.DEPTH24_STENCIL8,
            context.DEPTH32F_STENCIL8,

            // EXT_color_buffer_float | EXT_color_buffer_half_float
            context.R16F,
            context.RG16F,
            context.RGBA16F,
            context.R32F,
            context.RG32F,
            // context.RGB32F,
            context.RGBA32F,
            context.R11F_G11F_B10F,
          ];

          context.getExtension('EXT_color_buffer_float');
          context.getExtension('EXT_color_buffer_half_float');
          internalformats
            .filter((value) => !!value) // filter out unsupported parameters
            .forEach((key) => {
              // https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/getInternalformatParameter
              const parameter: Int32Array = context.getInternalformatParameter(context.RENDERBUFFER, key, context.SAMPLES);
              if (parameter && parameter.length > 0) {
                contextMeta.internalformatParameter[key] = Array.from(parameter);
              }
            });
        }

        result[type] = contextMeta;
      } else {
        result[type] = null;
      }
    } catch (err) {
      console.warn(`Fail to get ${type} context meta data`, err);
    }
  });

  return result;
}
