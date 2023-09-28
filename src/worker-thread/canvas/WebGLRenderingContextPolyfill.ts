import { HTMLCanvasElement } from '../dom/HTMLCanvasElement';
import { GLConstants } from './gl/GLConstants';
import { TransferrableKeys } from '../../transfer/TransferrableKeys';
import { TransferrableObject } from '../worker-thread';
import { transfer } from '../MutationTransfer';
import { Document } from '../dom/Document';
import { TransferrableMutationType, TransferrableObjectType } from '../../transfer/TransferrableMutation';
import { GLShader } from './gl/GLShader';
import { GLProgram } from './gl/GLProgram';
import {
  TransferrableGLObject,
  vGLActiveInfo,
  vGLBuffer,
  vGLFramebuffer,
  vGLLocation,
  vGLQuery,
  vGLRenderbuffer,
  vGLSampler,
  vGLSync,
  vGLTexture,
  vGLTransformFeedback,
  vGLVertexArrayObject,
} from './gl/TransferrableGLObjectTypes';
import {
  ANGLEInstancedArrays,
  EXTDisjointTimerQuery,
  GenericExtension,
  OESDrawBuffersIndexed,
  OESVertexArrayObject,
  OVRMultiview2,
  WEBGLCompressedTextureAstc,
  WEBGLDebugShaders,
  WEBGLDrawBuffers,
  WEBGLLoseContext,
  WEBGLMultiDraw,
} from './gl/GLExtension';
import { callFunction } from '../function';
import { createObjectReference, deleteObjectReference } from '../object-reference';
import { WebGLOptions } from './WebGLOptions';

export class WebGLRenderingContextPolyfill extends GLConstants implements WebGL2RenderingContext, TransferrableObject {
  public readonly id: number;
  public readonly canvas: HTMLCanvasElement | any;
  public readonly drawingBufferHeight: GLsizei;
  public readonly drawingBufferWidth: GLsizei;
  public readonly drawingBufferColorSpace: PredefinedColorSpace = 'srgb';

  private readonly requiredParams: number[] = [
    this.VERSION,
    this.RENDERER,
    this.VENDOR,
    this.SHADING_LANGUAGE_VERSION,
    this.RED_BITS,
    this.GREEN_BITS,
    this.BLUE_BITS,
    this.ALPHA_BITS,
    this.DEPTH_BITS,
    this.STENCIL_BITS,

    this.MAX_RENDERBUFFER_SIZE,
    this.MAX_COMBINED_TEXTURE_IMAGE_UNITS,
    this.MAX_CUBE_MAP_TEXTURE_SIZE,
    this.MAX_FRAGMENT_UNIFORM_VECTORS,
    this.MAX_TEXTURE_IMAGE_UNITS,
    this.MAX_TEXTURE_SIZE,
    this.MAX_VARYING_VECTORS,
    this.MAX_VERTEX_ATTRIBS,
    this.MAX_VERTEX_TEXTURE_IMAGE_UNITS,
    this.MAX_VERTEX_UNIFORM_VECTORS,
    this.ALIASED_LINE_WIDTH_RANGE,
    this.ALIASED_POINT_SIZE_RANGE,
    this.MAX_VIEWPORT_DIMS,

    //webgl2
    this.MAX_VERTEX_UNIFORM_COMPONENTS,
    this.MAX_VERTEX_UNIFORM_BLOCKS,
    this.MAX_VERTEX_OUTPUT_COMPONENTS,
    this.MAX_VARYING_COMPONENTS,
    this.MAX_FRAGMENT_UNIFORM_COMPONENTS,
    this.MAX_FRAGMENT_UNIFORM_BLOCKS,
    this.MAX_FRAGMENT_INPUT_COMPONENTS,
    this.MIN_PROGRAM_TEXEL_OFFSET,
    this.MAX_PROGRAM_TEXEL_OFFSET,
    this.MAX_DRAW_BUFFERS,
    this.MAX_COLOR_ATTACHMENTS,
    this.MAX_SAMPLES,
    this.MAX_3D_TEXTURE_SIZE,
    this.MAX_ARRAY_TEXTURE_LAYERS,
    this.MAX_TEXTURE_LOD_BIAS,
    this.MAX_UNIFORM_BUFFER_BINDINGS,
    this.MAX_UNIFORM_BLOCK_SIZE,
    this.UNIFORM_BUFFER_OFFSET_ALIGNMENT,
    this.MAX_COMBINED_UNIFORM_BLOCKS,
    this.MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS,
    this.MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS,
    this.MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS,
    this.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS,
    this.MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS,
    this.MAX_ELEMENT_INDEX,
    this.MAX_SERVER_WAIT_TIMEOUT,
  ];

  private readonly _serializedAsTransferrableObject: number[];

  private readonly _supportedExtensions: string[] = [];
  private readonly _extensions: {
    [key: string]: any;
  } = {};
  private readonly _parameters: {
    [key: number]: any;
  };
  private readonly _buffers: {
    [key: GLenum]: vGLBuffer | null;
  } = {};
  private readonly _indexedBuffers: {
    [key: GLenum]: Array<{
      size: number;
      offset: number;
      buffer: vGLBuffer | null;
    } | null>;
  };
  private readonly _bindings: {
    [key: string]: TransferrableGLObject | null;
  } = {
    program: null,
    vertexArray: null,
    transformFeedback: null,
    sampler: null,
  };
  private readonly _boundTextures: {
    [key: GLenum]: {
      [key: GLenum]: vGLTexture | null;
    };
  } = {
    [this.TEXTURE0]: {},
  };

  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/isEnabled
  // By default, all capabilities except gl.DITHER are disabled.
  private readonly _capabilities: {
    [key: GLenum]: boolean;
  } = {
    [this.DITHER]: true,
    [this.BLEND]: false,
    [this.CULL_FACE]: false,
    [this.DEPTH_TEST]: false,
    [this.POLYGON_OFFSET_FILL]: false,
    [this.SAMPLE_ALPHA_TO_COVERAGE]: false,
    [this.SAMPLE_COVERAGE]: false,
    [this.SCISSOR_TEST]: false,
    [this.STENCIL_TEST]: false,
    [this.RASTERIZER_DISCARD]: false,
  };

  private _contextAttributes: WebGLContextAttributes | null = null;
  private _activeTexture: GLenum = this.TEXTURE0;
  private _error: GLenum = this.NO_ERROR;

  constructor(id: number, canvas: HTMLCanvasElement, contextAttributes: WebGLContextAttributes | undefined, options?: WebGLOptions | null) {
    super();
    this.id = id;
    this._serializedAsTransferrableObject = [TransferrableObjectType.TransferObject, this.id];
    this.canvas = canvas;

    this.drawingBufferHeight = canvas.height;
    this.drawingBufferWidth = canvas.width;

    if (!contextAttributes) {
      callFunction(this.canvas.ownerDocument as Document, this, 'getContextAttributes', [])
        .then((result) => (this._contextAttributes = result))
        .catch((reason) => {
          console.warn('Failed to get WebGL context attributes', reason);
        });
    } else {
      this._contextAttributes = contextAttributes;
    }

    options = options || ({} as WebGLOptions);
    this._supportedExtensions = options.extensions || [];
    if (this._supportedExtensions.length == 0) {
      callFunction(this.canvas.ownerDocument as Document, this, 'getSupportedExtensions', [])
        .then((result) => this._supportedExtensions.push(...result))
        .catch((reason) => {
          console.warn('Failed to get WebGL supported extensions', reason);
        });
    }

    this._parameters = options.parameters || {};
    this.requiredParams
      .filter((value) => !(value in this._parameters))
      .forEach((parameter) => {
        callFunction(this.canvas.ownerDocument as Document, this, 'getParameter', [parameter])
          .then((result) => (this._parameters[parameter] = result))
          .catch((reason) => {
            console.warn(`Failed to get WebGL parameter ${parameter}`, reason);
          });
      });

    this._indexedBuffers = {
      [this.TRANSFORM_FEEDBACK_BUFFER]: new Array(this.getParameter(this.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS)),
      [this.UNIFORM_BUFFER]: new Array(this.getParameter(this.MAX_UNIFORM_BUFFER_BINDINGS)),
    };
  }

  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/activeTexture
   * @param texture The texture unit to make active. The value is a gl.TEXTUREI where I is within the range from 0 to gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS - 1.
   * @throws If texture is not one of gl.TEXTUREI, where I is within the range from 0 to gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS - 1, a gl.INVALID_ENUM error is thrown.
   */
  activeTexture(texture: GLenum): void {
    if (texture - this.TEXTURE0 >= this.getParameter(this.MAX_COMBINED_TEXTURE_IMAGE_UNITS)) {
      this._webglError(this.INVALID_ENUM, 'INVALID_ENUM', 'activeTexture', 'texture unit out of range');
      return;
    }

    this[TransferrableKeys.mutated]('activeTexture', arguments);
    this._activeTexture = texture;
    if (!this._boundTextures[this._activeTexture]) {
      this._boundTextures[this._activeTexture] = {};
    }
  }

  attachShader(program: GLProgram, shader: GLShader): void {
    this[TransferrableKeys.mutated]('attachShader', arguments);
    program.attachShader(shader, this);
  }

  beginQuery(target: GLenum, query: vGLQuery): void {
    this[TransferrableKeys.mutated]('beginQuery', arguments);
  }

  beginTransformFeedback(primitiveMode: GLenum): void {
    this[TransferrableKeys.mutated]('beginTransformFeedback', arguments);
  }

  bindAttribLocation(program: GLProgram, index: GLuint, name: string): void {
    this[TransferrableKeys.mutated]('bindAttribLocation', arguments);

    const attrib = program.getAttribute(name);
    if (attrib) {
      // TODO: on else throw error?
      attrib.location = index;
    }
  }

  bindBuffer(target: GLenum, buffer: vGLBuffer | null): void {
    if (!this._validateBinding(buffer, this.isBuffer, 'bindBuffer', 'WebGLBuffer', 2)) {
      return;
    }

    switch (target) {
      case this.ELEMENT_ARRAY_BUFFER:
      case this.COPY_READ_BUFFER:
      case this.COPY_WRITE_BUFFER:
      case this.TRANSFORM_FEEDBACK_BUFFER:
      case this.UNIFORM_BUFFER:
      case this.PIXEL_PACK_BUFFER:
      case this.PIXEL_UNPACK_BUFFER:
      case this.ARRAY_BUFFER: {
        this[TransferrableKeys.mutated]('bindBuffer', arguments);
        this._bindBuffer(target, buffer);
        break;
      }
      default: {
        // WebGL: INVALID_ENUM: bindBuffer: invalid target - xxx
        this._webglError(this.INVALID_ENUM, 'INVALID_ENUM', 'bindBuffer', 'invalid target - ' + target);
      }
    }
  }

  bindBufferBase(target: GLenum, index: GLuint, buffer: vGLBuffer | null): void {
    if (!this._validateBinding(buffer, this.isBuffer, 'bindBufferBase', 'WebGLBuffer', 3)) {
      return;
    }
    // https://registry.khronos.org/OpenGL-Refpages/es3.0/html/glBindBufferBase.xhtml
    switch (target) {
      case this.TRANSFORM_FEEDBACK_BUFFER: {
        if (index >= this.getParameter(this.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS)) {
          // WebGL: INVALID_VALUE: bindBufferBase: index out of range
          this._webglError(this.INVALID_VALUE, 'INVALID_VALUE', 'bindBufferBase', 'index out of range');
          return;
        }
        break;
      }
      case this.UNIFORM_BUFFER: {
        if (index >= this.getParameter(this.MAX_UNIFORM_BUFFER_BINDINGS)) {
          // WebGL: INVALID_VALUE: bindBufferBase: index out of range
          this._webglError(this.INVALID_VALUE, 'INVALID_VALUE', 'bindBufferBase', 'index out of range');
          return;
        }
        break;
      }
      default: {
        // WebGL: INVALID_ENUM: bindBufferBase: invalid target - xxx
        this._webglError(this.INVALID_ENUM, 'INVALID_ENUM', 'bindBufferBase', 'invalid target - ' + target);
        return;
      }
    }

    this[TransferrableKeys.mutated]('bindBufferBase', arguments);
    this._bindBuffer(target, buffer);
    this._indexedBuffers[target][index] = { size: 0, offset: 0, buffer: buffer };
  }

  bindBufferRange(target: GLenum, index: GLuint, buffer: vGLBuffer | null, offset: GLintptr, size: GLsizeiptr): void {
    if (!this._validateBinding(buffer, this.isBuffer, 'bindBufferRange', 'WebGLBuffer', 3)) {
      return;
    }

    if (buffer != null && size <= 0) {
      // WebGL: INVALID_VALUE: bindBufferRange: size out of range
      this._webglError(this.INVALID_VALUE, 'INVALID_VALUE', 'bindBufferRange', 'size out of range');
      return;
    }

    switch (target) {
      case this.TRANSFORM_FEEDBACK_BUFFER: {
        if (index >= this.getParameter(this.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS)) {
          // WebGL: INVALID_VALUE: bindBufferRange: index out of range
          this._webglError(this.INVALID_VALUE, 'INVALID_VALUE', 'bindBufferRange', 'index out of range');
          return;
        }

        if (offset % 4 !== 0 || size % 4 !== 0) {
          // WebGL: INVALID_VALUE: bindBufferRange: size or offset are not multiples of 4
          this._webglError(this.INVALID_VALUE, 'INVALID_VALUE', 'bindBufferRange', 'size or offset are not multiples of 4');
          return;
        }

        break;
      }
      case this.UNIFORM_BUFFER: {
        if (index >= this.getParameter(this.MAX_UNIFORM_BUFFER_BINDINGS)) {
          // WebGL: INVALID_VALUE: bindBufferRange: index out of range
          this._webglError(this.INVALID_VALUE, 'INVALID_VALUE', 'bindBufferRange', 'index out of range');
          return;
        }
        if (offset % this.getParameter(this.UNIFORM_BUFFER_OFFSET_ALIGNMENT) !== 0) {
          // WebGL: INVALID_VALUE: bindBufferRange: index out of range
          this._webglError(this.INVALID_VALUE, 'INVALID_VALUE', 'bindBufferRange', 'offset are not multiples of UNIFORM_BUFFER_OFFSET_ALIGNMENT');
          return;
        }
        break;
      }
      default: {
        // WebGL: INVALID_ENUM: bindBufferRange: invalid target - xxx
        this._webglError(this.INVALID_ENUM, 'INVALID_ENUM', 'bindBufferRange', 'invalid target - ' + target);
        return;
      }
    }

    this[TransferrableKeys.mutated]('bindBufferRange', arguments);
    this._bindBuffer(target, buffer);

    this._indexedBuffers[target][index] = { size, offset, buffer };
  }

  bindFramebuffer(target: GLenum, framebuffer: vGLFramebuffer | null): void {
    if (!this._validateBinding(framebuffer, this.isFramebuffer, 'bindFramebuffer', 'WebGLFramebuffer', 2)) {
      return;
    }

    switch (target) {
      case this.FRAMEBUFFER:
      case this.DRAW_FRAMEBUFFER:
      case this.READ_FRAMEBUFFER: {
        this[TransferrableKeys.mutated]('bindFramebuffer', arguments);
        this._bindBuffer(target, framebuffer);
        break;
      }
      default: {
        // WebGL: INVALID_ENUM: bindFramebuffer: invalid target - xxx
        this._webglError(this.INVALID_ENUM, 'INVALID_ENUM', 'bindFramebuffer', 'invalid target - ' + target);
      }
    }
  }

  bindRenderbuffer(target: GLenum, renderbuffer: vGLRenderbuffer | null): void {
    if (!this._validateBinding(renderbuffer, this.isRenderbuffer, 'bindRenderbuffer', 'WebGLRenderbuffer', 2)) {
      return;
    }

    switch (target) {
      case this.RENDERBUFFER: {
        this[TransferrableKeys.mutated]('bindRenderbuffer', arguments);
        this._bindBuffer(target, renderbuffer);
        break;
      }
      default: {
        // WebGL: INVALID_ENUM: bindRenderbuffer: invalid target - xxx
        this._webglError(this.INVALID_ENUM, 'INVALID_ENUM', 'bindRenderbuffer', 'invalid target - ' + target);
      }
    }
  }

  bindSampler(unit: GLuint, sampler: vGLSampler | null): void {
    if (!this._validateBinding(sampler, this.isSampler, 'bindSampler', 'WebGLSampler', 2)) {
      return;
    }

    this[TransferrableKeys.mutated]('bindSampler', arguments);
    this._bindings.sampler = sampler;
  }

  bindTexture(target: GLenum, texture: vGLTexture | null): void {
    if (!this._validateBinding(texture, this.isTexture, 'bindTexture', 'WebGLTexture', 2)) {
      return;
    }

    switch (target) {
      case this.TEXTURE_2D:
      case this.TEXTURE_CUBE_MAP:
      case this.TEXTURE_2D_ARRAY:
      case this.TEXTURE_3D: {
        if (texture != null) {
          if (texture.boundTarget != null && texture.boundTarget != target) {
            // WebGL: INVALID_OPERATION: bindTexture: textures can not be used with multiple targets
            this._webglError(this.INVALID_OPERATION, 'INVALID_OPERATION', 'bindTexture', 'textures can not be used with multiple targets');
            return;
          }
          texture.boundTarget = target;
        }

        const currentTexture = this._boundTextures[this._activeTexture][target];
        this._boundTextures[this._activeTexture][target] = null;

        if (currentTexture && !this._texHasUsage(currentTexture)) {
          currentTexture.boundTarget = null;
        }

        this[TransferrableKeys.mutated]('bindTexture', arguments);
        this._boundTextures[this._activeTexture][target] = texture;
        break;
      }
      default: {
        // WebGL: INVALID_ENUM: bindTexture: invalid target
        this._webglError(this.INVALID_ENUM, 'INVALID_ENUM', 'bindTexture', 'invalid target - ' + target);
      }
    }
  }

  bindTransformFeedback(target: GLenum, tf: vGLTransformFeedback | null): void {
    if (!this._validateBinding(tf, this.isTransformFeedback, 'bindTransformFeedback', 'WebGLTransformFeedback', 2)) {
      return;
    }

    switch (target) {
      case this.TRANSFORM_FEEDBACK: {
        this[TransferrableKeys.mutated]('bindTransformFeedback', arguments);
        this._bindings.transformFeedback = tf;
        break;
      }
      default: {
        // WebGL: INVALID_ENUM: bindRenderbuffer: invalid target - xxx
        this._webglError(this.INVALID_ENUM, 'INVALID_ENUM', 'bindTransformFeedback', 'invalid target - ' + target);
      }
    }
  }

  bindVertexArray(array: vGLVertexArrayObject | null): void {
    if (!this._validateBinding(array, this.isVertexArray, 'bindVertexArray', 'WebGLVertexArrayObject', 2)) {
      return;
    }

    this[TransferrableKeys.mutated]('bindVertexArray', arguments);
    this._bindings.vertexArray = array;
  }

  blendColor(red: GLclampf, green: GLclampf, blue: GLclampf, alpha: GLclampf): void {
    this[TransferrableKeys.mutated]('blendColor', arguments);
  }

  blendEquation(mode: GLenum): void {
    this[TransferrableKeys.mutated]('blendEquation', arguments);
  }

  blendEquationSeparate(modeRGB: GLenum, modeAlpha: GLenum): void {
    this[TransferrableKeys.mutated]('blendEquationSeparate', arguments);
  }

  blendFunc(sfactor: GLenum, dfactor: GLenum): void {
    this[TransferrableKeys.mutated]('blendFunc', arguments);
  }

  blendFuncSeparate(srcRGB: GLenum, dstRGB: GLenum, srcAlpha: GLenum, dstAlpha: GLenum): void {
    this[TransferrableKeys.mutated]('blendFuncSeparate', arguments);
  }

  blitFramebuffer(
    srcX0: GLint,
    srcY0: GLint,
    srcX1: GLint,
    srcY1: GLint,
    dstX0: GLint,
    dstY0: GLint,
    dstX1: GLint,
    dstY1: GLint,
    mask: GLbitfield,
    filter: GLenum,
  ): void {
    this[TransferrableKeys.mutated]('blitFramebuffer', arguments);
  }

  bufferData(target: GLenum, size: GLsizeiptr, usage: GLenum): void;
  bufferData(target: GLenum, srcData: BufferSource | null, usage: GLenum): void;
  bufferData(target: GLenum, srcData: ArrayBufferView, usage: GLenum, srcOffset: GLuint, length?: GLuint): void;
  bufferData(target: GLenum, size: GLsizeiptr | BufferSource | null | ArrayBufferView, usage: GLenum, srcOffset?: GLuint, length?: GLuint): void {
    this[TransferrableKeys.mutated]('bufferData', arguments);

    const buffer = this._getBoundBuffer(target);
    if (buffer) {
      if (size) {
        if (typeof size === 'number') {
          buffer.size = size;
        } else {
          // BufferSource or ArrayBufferView
          buffer.size = size.byteLength;
        }
      } else {
        buffer.size = 0;
      }

      buffer.usage = usage;
    }
  }

  bufferSubData(target: GLenum, dstByteOffset: GLintptr, srcData: BufferSource): void;
  bufferSubData(target: GLenum, dstByteOffset: GLintptr, srcData: ArrayBufferView, srcOffset: GLuint, length?: GLuint): void;
  bufferSubData(target: GLenum, dstByteOffset: GLintptr, srcData: BufferSource | ArrayBufferView, srcOffset?: GLuint, length?: GLuint): void {
    this[TransferrableKeys.mutated]('bufferSubData', arguments);
  }

  checkFramebufferStatus(target: GLenum): GLenum {
    return this.FRAMEBUFFER_COMPLETE; // hope
  }

  clear(mask: GLbitfield): void {
    this[TransferrableKeys.mutated]('clear', arguments);
  }

  clearBufferfi(buffer: GLenum, drawbuffer: GLint, depth: GLfloat, stencil: GLint): void {
    this[TransferrableKeys.mutated]('clearBufferfi', arguments);
  }

  clearBufferfv(buffer: GLenum, drawbuffer: GLint, values: Float32List, srcOffset?: GLuint): void;
  clearBufferfv(buffer: GLenum, drawbuffer: GLint, values: Iterable<GLfloat>, srcOffset?: GLuint): void;
  clearBufferfv(buffer: GLenum, drawbuffer: GLint, values: Float32List | Iterable<GLfloat>, srcOffset?: GLuint): void {
    this[TransferrableKeys.mutated]('clearBufferfv', arguments);
  }

  clearBufferiv(buffer: GLenum, drawbuffer: GLint, values: Int32List, srcOffset?: GLuint): void;
  clearBufferiv(buffer: GLenum, drawbuffer: GLint, values: Iterable<GLint>, srcOffset?: GLuint): void;
  clearBufferiv(buffer: GLenum, drawbuffer: GLint, values: Int32List | Iterable<GLint>, srcOffset?: GLuint): void {
    this[TransferrableKeys.mutated]('clearBufferiv', arguments);
  }

  clearBufferuiv(buffer: GLenum, drawbuffer: GLint, values: Uint32List, srcOffset?: GLuint): void;
  clearBufferuiv(buffer: GLenum, drawbuffer: GLint, values: Iterable<GLuint>, srcOffset?: GLuint): void;
  clearBufferuiv(buffer: GLenum, drawbuffer: GLint, values: Uint32List | Iterable<GLuint>, srcOffset?: GLuint): void {
    this[TransferrableKeys.mutated]('clearBufferuiv', arguments);
  }

  clearColor(red: GLclampf, green: GLclampf, blue: GLclampf, alpha: GLclampf): void {
    this[TransferrableKeys.mutated]('clearColor', arguments);
  }

  clearDepth(depth: GLclampf): void {
    this[TransferrableKeys.mutated]('clearDepth', arguments);
  }

  clearStencil(s: GLint): void {
    this[TransferrableKeys.mutated]('clearStencil', arguments);
  }

  clientWaitSync(sync: vGLSync, flags: GLbitfield, timeout: GLuint64): GLenum {
    throw new Error('NOT IMPLEMENTED');
  }

  colorMask(red: GLboolean, green: GLboolean, blue: GLboolean, alpha: GLboolean): void {
    this[TransferrableKeys.mutated]('colorMask', arguments);
  }

  compileShader(shader: GLShader): void {
    this[TransferrableKeys.mutated]('compileShader', arguments);
    shader.compiled = true;
  }

  compressedTexImage2D(
    target: GLenum,
    level: GLint,
    internalformat: GLenum,
    width: GLsizei,
    height: GLsizei,
    border: GLint,
    imageSize: GLsizei,
    offset: GLintptr,
  ): void;
  compressedTexImage2D(
    target: GLenum,
    level: GLint,
    internalformat: GLenum,
    width: GLsizei,
    height: GLsizei,
    border: GLint,
    srcData: ArrayBufferView,
    srcOffset?: GLuint,
    srcLengthOverride?: GLuint,
  ): void;
  compressedTexImage2D(
    target: GLenum,
    level: GLint,
    internalformat: GLenum,
    width: GLsizei,
    height: GLsizei,
    border: GLint,
    imageSize: GLsizei | ArrayBufferView,
    offset?: GLintptr | GLuint,
    srcLengthOverride?: GLuint,
  ): void {
    this[TransferrableKeys.mutated]('compressedTexImage2D', arguments);
  }

  compressedTexImage3D(
    target: GLenum,
    level: GLint,
    internalformat: GLenum,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
    border: GLint,
    imageSize: GLsizei,
    offset: GLintptr,
  ): void;
  compressedTexImage3D(
    target: GLenum,
    level: GLint,
    internalformat: GLenum,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
    border: GLint,
    srcData: ArrayBufferView,
    srcOffset?: GLuint,
    srcLengthOverride?: GLuint,
  ): void;
  compressedTexImage3D(
    target: GLenum,
    level: GLint,
    internalformat: GLenum,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
    border: GLint,
    imageSize: GLsizei | ArrayBufferView,
    offset?: GLintptr | GLuint,
    srcLengthOverride?: GLuint,
  ): void {
    this[TransferrableKeys.mutated]('compressedTexImage3D', arguments);
  }

  compressedTexSubImage2D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    format: GLenum,
    imageSize: GLsizei,
    offset: GLintptr,
  ): void;
  compressedTexSubImage2D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    format: GLenum,
    srcData: ArrayBufferView,
    srcOffset?: GLuint,
    srcLengthOverride?: GLuint,
  ): void;
  compressedTexSubImage2D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    format: GLenum,
    imageSize: GLsizei | ArrayBufferView,
    offset?: GLintptr | GLuint,
    srcLengthOverride?: GLuint,
  ): void {
    this[TransferrableKeys.mutated]('compressedTexSubImage2D', arguments);
  }

  compressedTexSubImage3D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    zoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
    format: GLenum,
    imageSize: GLsizei,
    offset: GLintptr,
  ): void;
  compressedTexSubImage3D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    zoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
    format: GLenum,
    srcData: ArrayBufferView,
    srcOffset?: GLuint,
    srcLengthOverride?: GLuint,
  ): void;
  compressedTexSubImage3D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    zoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
    format: GLenum,
    imageSize: GLsizei | ArrayBufferView,
    offset?: GLintptr | GLuint,
    srcLengthOverride?: GLuint,
  ): void {
    this[TransferrableKeys.mutated]('compressedTexSubImage3D', arguments);
  }

  copyBufferSubData(readTarget: GLenum, writeTarget: GLenum, readOffset: GLintptr, writeOffset: GLintptr, size: GLsizeiptr): void {
    this[TransferrableKeys.mutated]('copyBufferSubData', arguments);
  }

  copyTexImage2D(target: GLenum, level: GLint, internalformat: GLenum, x: GLint, y: GLint, width: GLsizei, height: GLsizei, border: GLint): void {
    this[TransferrableKeys.mutated]('copyTexImage2D', arguments);
  }

  copyTexSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, x: GLint, y: GLint, width: GLsizei, height: GLsizei): void {
    this[TransferrableKeys.mutated]('copyTexSubImage2D', arguments);
  }

  copyTexSubImage3D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    zoffset: GLint,
    x: GLint,
    y: GLint,
    width: GLsizei,
    height: GLsizei,
  ): void {
    this[TransferrableKeys.mutated]('copyTexSubImage3D', arguments);
  }

  createBuffer(): vGLBuffer | null {
    return this.createObjectReference('createBuffer', [], (id) => new vGLBuffer(id));
  }

  createFramebuffer(): vGLFramebuffer | null {
    return this.createObjectReference('createFramebuffer', [], (id) => new vGLFramebuffer(id));
  }

  createProgram(): GLProgram | null {
    return this.createObjectReference('createProgram', [], (id) => new GLProgram(id));
  }

  createQuery(): vGLQuery | null {
    return this.createObjectReference('createQuery', [], (id) => new vGLQuery(id));
  }

  createRenderbuffer(): vGLRenderbuffer | null {
    return this.createObjectReference('createRenderbuffer', [], (id) => new vGLRenderbuffer(id));
  }

  createSampler(): vGLSampler | null {
    return this.createObjectReference('createSampler', [], (id) => new vGLSampler(id));
  }

  createShader(type: GLenum): GLShader | null {
    return this.createObjectReference('createShader', arguments, (id) => new GLShader(id, type));
  }

  createTexture(): vGLTexture | null {
    return this.createObjectReference('createTexture', [], (id) => new vGLTexture(id));
  }

  createTransformFeedback(): vGLTransformFeedback | null {
    return this.createObjectReference('createTransformFeedback', [], (id) => new vGLTransformFeedback(id));
  }

  createVertexArray(): vGLVertexArrayObject | null {
    return this.createObjectReference('createVertexArray', [], (id) => new vGLVertexArrayObject(id));
  }

  cullFace(mode: GLenum): void {
    this[TransferrableKeys.mutated]('cullFace', arguments);
  }

  deleteBuffer(buffer: vGLBuffer | null): void {
    if (!buffer || buffer.isDeleted()) return;
    this[TransferrableKeys.mutated]('deleteBuffer', arguments);
    this.deleteObjectReference(buffer.id);

    this._deleteBuffer(buffer);
  }

  deleteFramebuffer(framebuffer: vGLFramebuffer | null): void {
    if (!framebuffer || framebuffer.isDeleted()) return;
    this[TransferrableKeys.mutated]('deleteFramebuffer', arguments);
    this.deleteObjectReference(framebuffer.id);

    this._deleteBuffer(framebuffer);
  }

  deleteProgram(program: GLProgram | null): void {
    if (!program || program.isDeleted()) return;
    this[TransferrableKeys.mutated]('deleteProgram', arguments);
    this.deleteObjectReference(program.id);

    if (this._bindings.program === program) {
      this._bindings.program = null;
    }
    program.delete();
  }

  deleteQuery(query: vGLQuery | null): void {
    if (!query || query.isDeleted()) return;
    this[TransferrableKeys.mutated]('deleteQuery', arguments);
    this.deleteObjectReference(query.id);

    query.delete();
  }

  deleteRenderbuffer(renderbuffer: vGLRenderbuffer | null): void {
    if (!renderbuffer || renderbuffer.isDeleted()) return;
    this[TransferrableKeys.mutated]('deleteRenderbuffer', arguments);
    this.deleteObjectReference(renderbuffer.id);

    this._deleteBuffer(renderbuffer);
  }

  deleteSampler(sampler: vGLSampler | null): void {
    if (!sampler || sampler.isDeleted()) return;
    this[TransferrableKeys.mutated]('deleteSampler', arguments);
    this.deleteObjectReference(sampler.id);

    if (this._bindings.sampler === sampler) {
      this._bindings.sampler = null;
    }
    sampler.delete();
  }

  deleteShader(shader: GLShader | null): void {
    if (!shader || shader.isDeleted()) return;
    this[TransferrableKeys.mutated]('deleteShader', arguments);
    this.deleteObjectReference(shader.id);

    shader.delete();
  }

  deleteSync(sync: vGLSync | null): void {
    if (!sync || sync.isDeleted()) return;
    this[TransferrableKeys.mutated]('deleteSync', arguments);
    this.deleteObjectReference(sync.id);

    sync.delete();
  }

  deleteTexture(texture: vGLTexture | null): void {
    if (!texture || texture.isDeleted()) return;
    this[TransferrableKeys.mutated]('deleteTexture', arguments);
    this.deleteObjectReference(texture.id);

    for (const textureUnit in this._boundTextures) {
      const target2Texture = this._boundTextures[textureUnit];
      for (const target in target2Texture) {
        const tex = target2Texture[target];
        if (tex && tex === texture) {
          this._boundTextures[textureUnit][target] = null;
        }
      }
    }

    texture.delete();
  }

  deleteTransformFeedback(tf: vGLTransformFeedback | null): void {
    if (!tf || tf.isDeleted()) return;
    this[TransferrableKeys.mutated]('deleteTransformFeedback', arguments);
    this.deleteObjectReference(tf.id);

    if (this._bindings.transformFeedback === tf) {
      this._bindings.transformFeedback = null;
    }
    tf.delete();
  }

  deleteVertexArray(vertexArray: vGLVertexArrayObject | null): void {
    if (!vertexArray || vertexArray.isDeleted()) return;
    this[TransferrableKeys.mutated]('deleteVertexArray', arguments);
    this.deleteObjectReference(vertexArray.id);

    if (this._bindings.vertexArray === vertexArray) {
      this._bindings.vertexArray = null;
    }
    vertexArray.delete();
  }

  depthFunc(func: GLenum): void {
    this[TransferrableKeys.mutated]('depthFunc', arguments);
  }

  depthMask(flag: GLboolean): void {
    this[TransferrableKeys.mutated]('depthMask', arguments);
  }

  depthRange(zNear: GLclampf, zFar: GLclampf): void {
    this[TransferrableKeys.mutated]('depthRange', arguments);
  }

  detachShader(program: GLProgram, shader: GLShader): void {
    this[TransferrableKeys.mutated]('detachShader', arguments);
    program.detachShader(shader, this);
  }

  disable(cap: GLenum): void {
    this[TransferrableKeys.mutated]('disable', arguments);
    this._capabilities[cap] = false;
  }

  disableVertexAttribArray(index: GLuint): void {
    this[TransferrableKeys.mutated]('disableVertexAttribArray', arguments);
  }

  drawArrays(mode: GLenum, first: GLint, count: GLsizei): void {
    this[TransferrableKeys.mutated]('drawArrays', arguments);
  }

  drawArraysInstanced(mode: GLenum, first: GLint, count: GLsizei, instanceCount: GLsizei): void {
    this[TransferrableKeys.mutated]('drawArraysInstanced', arguments);
  }

  drawBuffers(buffers: GLenum[]): void;
  drawBuffers(buffers: Iterable<GLenum>): void;
  drawBuffers(buffers: GLenum[] | Iterable<GLenum>): void {
    this[TransferrableKeys.mutated]('drawBuffers', arguments);
  }

  drawElements(mode: GLenum, count: GLsizei, type: GLenum, offset: GLintptr): void {
    this[TransferrableKeys.mutated]('drawElements', arguments);
  }

  drawElementsInstanced(mode: GLenum, count: GLsizei, type: GLenum, offset: GLintptr, instanceCount: GLsizei): void {
    this[TransferrableKeys.mutated]('drawElementsInstanced', arguments);
  }

  drawRangeElements(mode: GLenum, start: GLuint, end: GLuint, count: GLsizei, type: GLenum, offset: GLintptr): void {
    this[TransferrableKeys.mutated]('drawRangeElements', arguments);
  }

  enable(cap: GLenum): void {
    this[TransferrableKeys.mutated]('enable', arguments);
    this._capabilities[cap] = true;
  }

  enableVertexAttribArray(index: GLuint): void {
    this[TransferrableKeys.mutated]('enableVertexAttribArray', arguments);
  }

  endQuery(target: GLenum): void {
    this[TransferrableKeys.mutated]('endQuery', arguments);
  }

  endTransformFeedback(): void {
    this[TransferrableKeys.mutated]('endTransformFeedback', []);
  }

  fenceSync(condition: GLenum, flags: GLbitfield): vGLSync | null {
    return this.createObjectReference('fenceSync', arguments, (id) => new vGLSync(id));
  }

  finish(): void {
    this[TransferrableKeys.mutated]('finish', []);
  }

  flush(): void {
    this[TransferrableKeys.mutated]('flush', []);
  }

  framebufferRenderbuffer(target: GLenum, attachment: GLenum, renderbuffertarget: GLenum, renderbuffer: vGLRenderbuffer | null): void {
    this[TransferrableKeys.mutated]('framebufferRenderbuffer', arguments);
  }

  framebufferTexture2D(target: GLenum, attachment: GLenum, textarget: GLenum, texture: vGLTexture | null, level: GLint): void {
    this[TransferrableKeys.mutated]('framebufferTexture2D', arguments);
  }

  framebufferTextureLayer(target: GLenum, attachment: GLenum, texture: vGLTexture | null, level: GLint, layer: GLint): void {
    this[TransferrableKeys.mutated]('framebufferTextureLayer', arguments);
  }

  frontFace(mode: GLenum): void {
    this[TransferrableKeys.mutated]('frontFace', arguments);
  }

  generateMipmap(target: GLenum): void {
    this[TransferrableKeys.mutated]('generateMipmap', arguments);
  }

  getActiveAttrib(program: GLProgram, index: GLuint): vGLActiveInfo | null {
    return program.getActiveAttrib(index);
  }

  getActiveUniform(program: GLProgram, index: GLuint): vGLActiveInfo | null {
    return program.getActiveUniform(index);
  }

  getActiveUniformBlockName(program: GLProgram, uniformBlockIndex: GLuint): string | null {
    throw new Error('NOT YET IMPLEMENTED');
  }

  getActiveUniformBlockParameter(program: GLProgram, uniformBlockIndex: GLuint, pname: GLenum): any {
    throw new Error('NOT YET IMPLEMENTED');
  }

  getActiveUniforms(program: GLProgram, uniformIndices: GLuint[], pname: GLenum): any;
  getActiveUniforms(program: GLProgram, uniformIndices: Iterable<GLuint>, pname: GLenum): any;
  getActiveUniforms(program: GLProgram, uniformIndices: GLuint[] | Iterable<GLuint>, pname: GLenum): any {
    throw new Error('NOT YET IMPLEMENTED');
  }

  getAttachedShaders(program: GLProgram): GLShader[] | null {
    return program.shaders;
  }

  getAttribLocation(program: GLProgram, name: string): number {
    const attr = program.getAttribute(name);
    if (attr) {
      return attr.location;
    }
    return -1; // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getAttribLocation#return_value
  }

  getBufferParameter(target: GLenum, pname: GLenum): any {
    const buffer = this._getBoundBuffer(target);
    if (buffer === null) {
      return null;
    }
    // see #bufferData
    switch (pname) {
      case this.BUFFER_SIZE: {
        //Returns a GLint indicating the size of the buffer in bytes.
        return buffer.size;
      }
      case this.BUFFER_USAGE: {
        return buffer.usage;
      }
      default:
        throw new Error(`Unexpected target: ${pname}`);
    }
  }

  getBufferSubData(target: GLenum, srcByteOffset: GLintptr, dstBuffer: ArrayBufferView, dstOffset?: GLuint, length?: GLuint): void {
    throw new Error('NOT IMPLEMENTED');
  }

  getContextAttributes(): WebGLContextAttributes | null {
    return this._contextAttributes;
  }

  getError(): GLenum {
    const current = this._error;
    this._error = this.NO_ERROR;
    return current;
  }

  getExtension(name: string): any {
    if (!this._supportedExtensions || !this._supportedExtensions.includes(name)) {
      return null;
    }

    if (name in this._extensions) {
      return this._extensions[name];
    }

    this._extensions[name] = this.createObjectReference('getExtension', arguments, (id) => {
      // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API#extensions
      switch (name) {
        case 'EXT_blend_minmax':
        case 'EXT_color_buffer_half_float':
        case 'EXT_color_buffer_float':
        case 'EXT_float_blend':
        case 'EXT_frag_depth':
        case 'EXT_shader_texture_lod':
        case 'OES_element_index_uint':
        case 'OES_fbo_render_mipmap':
        case 'OES_texture_float':
        case 'OES_texture_float_linear':
        case 'OES_texture_half_float_linear':
        case 'EXT_sRGB':
        case 'EXT_texture_compression_bptc':
        case 'EXT_texture_compression_rgtc':
        case 'EXT_texture_norm16':
        case 'KHR_parallel_shader_compile':
        case 'OES_standard_derivatives':
        case 'OES_texture_half_float':
        case 'WEBGL_color_buffer_float':
        case 'WEBGL_compressed_texture_etc':
        case 'WEBGL_compressed_texture_etc1':
        case 'WEBGL_compressed_texture_pvrtc':
        case 'WEBGL_compressed_texture_s3tc':
        case 'WEBGL_compressed_texture_s3tc_srgb':
        case 'WEBGL_debug_renderer_info':
        case 'WEBGL_depth_texture':
          return new GenericExtension();
        case 'WEBGL_compressed_texture_astc':
          return new WEBGLCompressedTextureAstc();
        case 'WEBGL_debug_shaders':
          return new WEBGLDebugShaders();
        case 'ANGLE_instanced_arrays':
          return new ANGLEInstancedArrays(id, this);
        case 'EXT_disjoint_timer_query':
        case 'EXT_disjoint_timer_query_webgl2':
          return new EXTDisjointTimerQuery(id, this);
        case 'OES_draw_buffers_indexed':
          return new OESDrawBuffersIndexed(id, this);
        case 'OES_vertex_array_object':
          return new OESVertexArrayObject(id, this);
        case 'OVR_multiview2':
          return new OVRMultiview2(id, this);
        case 'WEBGL_draw_buffers':
          return new WEBGLDrawBuffers(id, this);
        case 'WEBGL_lose_context':
          return new WEBGLLoseContext(id, this);
        case 'WEBGL_multi_draw':
          return new WEBGLMultiDraw(id, this);
        case 'EXT_texture_filter_anisotropic': {
          this._parameters[this.MAX_TEXTURE_MAX_ANISOTROPY_EXT] = 2; // default value
          callFunction(this.canvas.ownerDocument as Document, this, 'getParameter', [this.MAX_TEXTURE_MAX_ANISOTROPY_EXT])
            .then((result) => (this._parameters[this.MAX_TEXTURE_MAX_ANISOTROPY_EXT] = result))
            .catch((reason) => {
              console.warn(`Failed to get WebGL parameter ${this.MAX_TEXTURE_MAX_ANISOTROPY_EXT}`, reason);
            });
          return new GenericExtension();
        }
        default:
          console.warn(`Unimplemented but supported extension: ${name}, supported: `, this._supportedExtensions);
          return null;
      }
    });

    return this._extensions[name];
  }

  getFragDataLocation(program: GLProgram, name: string): GLint {
    throw new Error('NOT IMPLEMENTED');
  }

  getFramebufferAttachmentParameter(target: GLenum, attachment: GLenum, pname: GLenum): any {
    throw new Error('NOT IMPLEMENTED');
  }

  getIndexedParameter(target: GLenum, index: GLuint): any {
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/getIndexedParameter
    // https://registry.khronos.org/OpenGL-Refpages/es3.0/html/glGet.xhtml for GL_TRANSFORM_FEEDBACK_BUFFER_START

    switch (target) {
      case this.TRANSFORM_FEEDBACK_BUFFER_BINDING: {
        return this._indexedBuffers[this.TRANSFORM_FEEDBACK_BUFFER][index]?.buffer || null;
      }
      case this.TRANSFORM_FEEDBACK_BUFFER_SIZE: {
        return this._indexedBuffers[this.TRANSFORM_FEEDBACK_BUFFER][index]?.size || 0;
      }
      case this.TRANSFORM_FEEDBACK_BUFFER_START: {
        return this._indexedBuffers[this.TRANSFORM_FEEDBACK_BUFFER][index]?.offset || 0;
      }
      case this.UNIFORM_BUFFER_BINDING: {
        return this._indexedBuffers[this.UNIFORM_BUFFER][index]?.buffer || null;
      }
      case this.UNIFORM_BUFFER_SIZE: {
        return this._indexedBuffers[this.UNIFORM_BUFFER][index]?.size || 0;
      }
      case this.UNIFORM_BUFFER_START: {
        return this._indexedBuffers[this.UNIFORM_BUFFER][index]?.offset || 0;
      }
      default: {
        // TODO: not implemented for OES_draw_buffers_indexed
        //     gl.BLEND_EQUATION_RGB: Returns the RGB blend equation for the draw buffer at index.
        //     gl.BLEND_EQUATION_ALPHA: Returns the alpha blend equation for the draw buffer at index.
        //     gl.BLEND_SRC_RGB: Returns the source RGB blend function for the draw buffer at index.
        //     gl.BLEND_SRC_ALPHA: Returns the source alpha blend function for the draw buffer at index.
        //     gl.BLEND_DST_RGB: Returns the destination RGB blend function for the draw buffer at index.
        //     gl.BLEND_DST_ALPHA: Returns the destination alpha blend function for the draw buffer at index.
        //     gl.COLOR_WRITEMASK: Returns an array containing color components are enabled for the draw buffer at index.
        this._webglError(this.INVALID_ENUM, 'INVALID_ENUM', 'getIndexedParameter', 'invalid target ' + target);
        return null;
      }
    }
  }

  getInternalformatParameter(target: GLenum, internalformat: GLenum, pname: GLenum): any {
    throw new Error('NOT IMPLEMENTED');
  }

  getParameter(pname: GLenum): any {
    if (this._parameters && pname in this._parameters) return this._parameters[pname];

    switch (pname) {
      case this.ACTIVE_TEXTURE: {
        return this._activeTexture;
      }
      case this.TEXTURE_BINDING_2D: {
        return this._boundTextures[this._activeTexture][this.TEXTURE_2D];
      }
      case this.TEXTURE_BINDING_2D_ARRAY: {
        return this._boundTextures[this._activeTexture][this.TEXTURE_2D_ARRAY];
      }
      case this.TEXTURE_BINDING_3D: {
        return this._boundTextures[this._activeTexture][this.TEXTURE_3D];
      }
      case this.TEXTURE_BINDING_CUBE_MAP: {
        return this._boundTextures[this._activeTexture][this.TEXTURE_CUBE_MAP];
      }
      case this.CURRENT_PROGRAM: {
        return this._bindings.program;
      }
      case this.VERTEX_ARRAY_BINDING: {
        return this._bindings.vertexArray;
      }
      case this.TRANSFORM_FEEDBACK_BINDING: {
        return this._bindings.transformFeedback;
      }
      case this.ARRAY_BUFFER_BINDING: {
        return this._getBoundBuffer(this.ARRAY_BUFFER);
      }
      case this.ELEMENT_ARRAY_BUFFER_BINDING: {
        return this._getBoundBuffer(this.ELEMENT_ARRAY_BUFFER);
      }
      case this.COPY_READ_BUFFER_BINDING: {
        return this._getBoundBuffer(this.COPY_READ_BUFFER);
      }
      case this.COPY_WRITE_BUFFER_BINDING: {
        return this._getBoundBuffer(this.COPY_WRITE_BUFFER);
      }
      case this.TRANSFORM_FEEDBACK_BUFFER_BINDING: {
        return this._getBoundBuffer(this.TRANSFORM_FEEDBACK_BUFFER);
      }
      case this.UNIFORM_BUFFER_BINDING: {
        return this._getBoundBuffer(this.UNIFORM_BUFFER);
      }
      case this.PIXEL_PACK_BUFFER_BINDING: {
        return this._getBoundBuffer(this.PIXEL_PACK_BUFFER);
      }
      case this.PIXEL_UNPACK_BUFFER_BINDING: {
        return this._getBoundBuffer(this.PIXEL_UNPACK_BUFFER);
      }
      case this.FRAMEBUFFER_BINDING: {
        return this._getBoundBuffer(this.FRAMEBUFFER);
      }
      case this.RENDERBUFFER_BINDING: {
        return this._getBoundBuffer(this.RENDERBUFFER);
      }
      case this.DRAW_FRAMEBUFFER_BINDING: {
        return this._getBoundBuffer(this.DRAW_FRAMEBUFFER);
      }
      case this.READ_FRAMEBUFFER_BINDING: {
        return this._getBoundBuffer(this.READ_FRAMEBUFFER);
      }
      case this.MAX_TEXTURE_MAX_ANISOTROPY_EXT: {
        if (!('EXT_texture_filter_anisotropic' in this._extensions)) {
          // WebGL: INVALID_ENUM: getParameter: invalid parameter name, EXT_texture_filter_anisotropic not enabled
          this._webglError(this.INVALID_ENUM, 'INVALID_ENUM', 'getParameter', 'invalid parameter name, EXT_texture_filter_anisotropic not enabled');
        }
        return null;
      }
      default:
        if (!Object.values(this).includes(pname)) {
          // WebGL: INVALID_ENUM: getParameter: invalid parameter name
          this._webglError(this.INVALID_ENUM, 'INVALID_ENUM', 'getParameter', 'invalid parameter name');
          return null; // unknown parameter
        }
        // known parameter, but not loaded
        throw new Error(`Unexpected pname: ${pname}`);
    }
  }

  getProgramInfoLog(program: GLProgram): string | null {
    return '';
  }

  getProgramParameter(program: GLProgram, pname: GLenum): any {
    switch (pname) {
      case this.ACTIVE_UNIFORMS: // Returns a GLint indicating the number of active uniform variables to a program.
        return program.activeUniforms;
      case this.ACTIVE_ATTRIBUTES: // Returns a GLint indicating the number of active attribute variables to a program.
        return program.activeAttributes;
      case this.DELETE_STATUS: // Returns a GLboolean indicating whether or not the program is flagged for deletion.
        return program.isDeleted(); // See #deleteProgram
      case this.ATTACHED_SHADERS: // Returns a GLint indicating the number of attached shaders to a program.
        return program.shaders.length;
      case this.TRANSFORM_FEEDBACK_BUFFER_MODE: // Returns a GLenum indicating the buffer mode when transform feedback is active. May be gl.SEPARATE_ATTRIBS or gl.INTERLEAVED_ATTRIBS.
      case this.TRANSFORM_FEEDBACK_VARYINGS: // Returns a GLint indicating the number of varying variables to capture in transform feedback mode.
      case this.ACTIVE_UNIFORM_BLOCKS: // Returns a GLint indicating the number of uniform blocks containing active uniforms.
        throw new Error(`NOT YET IMPLEMENTED: ${pname}`);
      case this.VALIDATE_STATUS: // Returns a GLboolean indicating whether or not the last validation operation was successful.
      case this.LINK_STATUS: // Returns a GLboolean indicating whether or not the last link operation was successful.
        // optimistically return success; client will abort on an actual error. we assume an error-free async workflow
        return true;
      default:
        throw new Error(`Unexpected getProgramParameter: ${pname}`);
    }
  }

  getQuery(target: GLenum, pname: GLenum): vGLQuery | null {
    return this.createObjectReference('getQuery', arguments, (id) => new vGLQuery(id));
  }

  getQueryParameter(query: vGLQuery, pname: GLenum): any {
    throw new Error('NOT IMPLEMENTED');
  }

  getRenderbufferParameter(target: GLenum, pname: GLenum): any {
    throw new Error('NOT IMPLEMENTED');
  }

  getSamplerParameter(sampler: vGLSampler, pname: GLenum): any {
    throw new Error('NOT IMPLEMENTED');
  }

  getShaderInfoLog(shader: GLShader): string | null {
    return '';
  }

  getShaderParameter(shader: GLShader, pname: GLenum): any {
    switch (pname) {
      case this.SHADER_TYPE:
        return shader.type;
      case this.DELETE_STATUS:
        return shader.isDeleted(); // See deleteShader
      case this.COMPILE_STATUS: {
        // optimistically return success; client will abort on an actual error. we assume an error-free async workflow
        return true;
      }
      default:
        throw new Error(`Unexpected getShaderParameter: ${pname}`);
    }
  }

  getShaderPrecisionFormat(shadertype: GLenum, precisiontype: GLenum): WebGLShaderPrecisionFormat | null {
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getShaderPrecisionFormat
    // looks like can be implemented
    throw new Error('NOT YET IMPLEMENTED');
  }

  getShaderSource(shader: GLShader): string | null {
    return shader.source;
  }

  getSupportedExtensions(): string[] | null {
    return this._supportedExtensions;
  }

  getSyncParameter(sync: vGLSync, pname: GLenum): any {
    throw new Error('NOT IMPLEMENTED');
  }

  getTexParameter(target: GLenum, pname: GLenum): any {
    const texture = this._boundTextures[this._activeTexture][target];
    if (!texture) {
      // WebGL: INVALID_OPERATION: getTexParameter: no texture bound to target
      this._webglError(this.INVALID_OPERATION, 'INVALID_OPERATION', 'getTexParameter', 'no texture bound to target ' + target);
      return null;
    }
    if (pname in texture.parameters) {
      if (pname === this.TEXTURE_MAX_ANISOTROPY_EXT && !('EXT_texture_filter_anisotropic' in this._extensions)) {
        // WebGL: INVALID_ENUM: getTexParameter: invalid parameter name, EXT_texture_filter_anisotropic not enabled
        this._webglError(this.INVALID_ENUM, 'INVALID_ENUM', 'getTexParameter', 'invalid parameter name, EXT_texture_filter_anisotropic not enabled');
        return null;
      }
      return texture.parameters[pname];
    } else {
      // WebGL: INVALID_ENUM: getTexParameter: invalid parameter name
      this._webglError(this.INVALID_ENUM, 'INVALID_ENUM', 'getTexParameter', 'invalid parameter name ' + pname);
      return null;
    }
  }

  getTransformFeedbackVarying(program: GLProgram, index: GLuint): vGLActiveInfo | null {
    throw new Error('NOT YET IMPLEMENTED');
  }

  getUniform(program: GLProgram, location: vGLLocation): any {
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getUniform
    throw new Error('NOT YET IMPLEMENTED');
  }

  getUniformBlockIndex(program: GLProgram, uniformBlockName: string): GLuint {
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/getUniformBlockIndex
    throw new Error('NOT YET IMPLEMENTED');
  }

  getUniformIndices(program: GLProgram, uniformNames: string[]): GLuint[] | null;
  getUniformIndices(program: GLProgram, uniformNames: Iterable<string>): Iterable<GLuint> | null;
  getUniformIndices(program: GLProgram, uniformNames: string[] | Iterable<string>): GLuint[] | null | Iterable<GLuint> {
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/getUniformIndices
    throw new Error('NOT YET IMPLEMENTED');
  }

  getUniformLocation(program: GLProgram, name: string): vGLLocation | null {
    const uniform = program.getUniform(name);
    if (uniform) {
      if (uniform.uniformLocations) {
        return uniform.uniformLocations;
      } else {
        const uniformLocation = this.createObjectReference('getUniformLocation', arguments, (id) => new vGLLocation(id, name));
        uniform.uniformLocations = uniformLocation;
        return uniformLocation;
      }
    }
    return null;
  }

  getVertexAttrib(index: GLuint, pname: GLenum): any {
    throw new Error('NOT YET IMPLEMENTED');
  }

  getVertexAttribOffset(index: GLuint, pname: GLenum): GLintptr {
    throw new Error('NOT YET IMPLEMENTED');
  }

  hint(target: GLenum, mode: GLenum): void {
    this[TransferrableKeys.mutated]('hint', arguments);
  }

  invalidateFramebuffer(target: GLenum, attachments: GLenum[]): void;
  invalidateFramebuffer(target: GLenum, attachments: Iterable<GLenum>): void;
  invalidateFramebuffer(target: GLenum, attachments: GLenum[] | Iterable<GLenum>): void {
    this[TransferrableKeys.mutated]('invalidateFramebuffer', arguments);
  }

  invalidateSubFramebuffer(target: GLenum, attachments: GLenum[], x: GLint, y: GLint, width: GLsizei, height: GLsizei): void;
  invalidateSubFramebuffer(target: GLenum, attachments: Iterable<GLenum>, x: GLint, y: GLint, width: GLsizei, height: GLsizei): void;
  invalidateSubFramebuffer(target: GLenum, attachments: GLenum[] | Iterable<GLenum>, x: GLint, y: GLint, width: GLsizei, height: GLsizei): void {
    this[TransferrableKeys.mutated]('invalidateSubFramebuffer', arguments);
  }

  isBuffer(buffer: vGLBuffer | null): GLboolean {
    return buffer != null && buffer instanceof vGLBuffer;
  }

  isContextLost(): boolean {
    return false;
  }

  isEnabled(cap: GLenum): GLboolean {
    return this._capabilities[cap] || false;
  }

  isFramebuffer(framebuffer: vGLFramebuffer | null): GLboolean {
    return framebuffer != null && framebuffer instanceof vGLFramebuffer;
  }

  isProgram(program: GLProgram | null): GLboolean {
    return program != null && program instanceof GLProgram;
  }

  isQuery(query: vGLQuery | null): GLboolean {
    return query != null && query instanceof vGLQuery;
  }

  isRenderbuffer(renderbuffer: vGLRenderbuffer | null): GLboolean {
    return renderbuffer != null && renderbuffer instanceof vGLRenderbuffer;
  }

  isSampler(sampler: vGLSampler | null): GLboolean {
    return sampler != null && sampler instanceof vGLSampler;
  }

  isShader(shader: GLShader | null): GLboolean {
    return shader != null && shader instanceof GLShader;
  }

  isSync(sync: vGLSync | null): GLboolean {
    return sync != null && sync instanceof vGLSync;
  }

  isTexture(texture: vGLTexture | null): GLboolean {
    return texture != null && texture instanceof vGLTexture;
  }

  isTransformFeedback(tf: vGLTransformFeedback | null): GLboolean {
    return tf != null && tf instanceof vGLTransformFeedback;
  }

  isVertexArray(vertexArray: vGLVertexArrayObject | null): GLboolean {
    return vertexArray != null && vertexArray instanceof vGLVertexArrayObject;
  }

  lineWidth(width: GLfloat): void {
    this[TransferrableKeys.mutated]('lineWidth', arguments);
  }

  linkProgram(program: GLProgram): void {
    this[TransferrableKeys.mutated]('linkProgram', arguments);
    program.link(this);
  }

  pauseTransformFeedback(): void {
    this[TransferrableKeys.mutated]('pauseTransformFeedback', []);
  }

  pixelStorei(pname: GLenum, param: GLint | GLboolean): void {
    this[TransferrableKeys.mutated]('pixelStorei', arguments);
  }

  polygonOffset(factor: GLfloat, units: GLfloat): void {
    this[TransferrableKeys.mutated]('polygonOffset', arguments);
  }

  readBuffer(src: GLenum): void {
    this[TransferrableKeys.mutated]('readBuffer', arguments);
  }

  readPixels(x: GLint, y: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, dstData: ArrayBufferView | null): void;
  readPixels(x: GLint, y: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, offset: GLintptr): void;
  readPixels(x: GLint, y: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, dstData: ArrayBufferView, dstOffset: GLuint): void;
  readPixels(
    x: GLint,
    y: GLint,
    width: GLsizei,
    height: GLsizei,
    format: GLenum,
    type: GLenum,
    dstData: ArrayBufferView | null | GLintptr,
    dstOffset?: GLuint,
  ): void {
    throw new Error('NOT IMPLEMENTED');
  }

  renderbufferStorage(target: GLenum, internalformat: GLenum, width: GLsizei, height: GLsizei): void {
    this[TransferrableKeys.mutated]('renderbufferStorage', arguments);
  }

  renderbufferStorageMultisample(target: GLenum, samples: GLsizei, internalformat: GLenum, width: GLsizei, height: GLsizei): void {
    this[TransferrableKeys.mutated]('renderbufferStorageMultisample', arguments);
  }

  resumeTransformFeedback(): void {
    this[TransferrableKeys.mutated]('resumeTransformFeedback', []);
  }

  sampleCoverage(value: GLclampf, invert: GLboolean): void {
    this[TransferrableKeys.mutated]('sampleCoverage', arguments);
  }

  samplerParameterf(sampler: vGLSampler, pname: GLenum, param: GLfloat): void {
    this[TransferrableKeys.mutated]('samplerParameterf', arguments);
  }

  samplerParameteri(sampler: vGLSampler, pname: GLenum, param: GLint): void {
    this[TransferrableKeys.mutated]('samplerParameteri', arguments);
  }

  scissor(x: GLint, y: GLint, width: GLsizei, height: GLsizei): void {
    this[TransferrableKeys.mutated]('scissor', arguments);
  }

  shaderSource(shader: GLShader, source: string): void {
    this[TransferrableKeys.mutated]('shaderSource', arguments);
    shader.compile(this, source);
  }

  stencilFunc(func: GLenum, ref: GLint, mask: GLuint): void {
    this[TransferrableKeys.mutated]('stencilFunc', arguments);
  }

  stencilFuncSeparate(face: GLenum, func: GLenum, ref: GLint, mask: GLuint): void {
    this[TransferrableKeys.mutated]('stencilFuncSeparate', arguments);
  }

  stencilMask(mask: GLuint): void {
    this[TransferrableKeys.mutated]('stencilMask', arguments);
  }

  stencilMaskSeparate(face: GLenum, mask: GLuint): void {
    this[TransferrableKeys.mutated]('stencilMaskSeparate', arguments);
  }

  stencilOp(fail: GLenum, zfail: GLenum, zpass: GLenum): void {
    this[TransferrableKeys.mutated]('stencilOp', arguments);
  }

  stencilOpSeparate(face: GLenum, fail: GLenum, zfail: GLenum, zpass: GLenum): void {
    this[TransferrableKeys.mutated]('stencilOpSeparate', arguments);
  }

  texImage2D(
    target: GLenum,
    level: GLint,
    internalformat: GLint,
    width: GLsizei,
    height: GLsizei,
    border: GLint,
    format: GLenum,
    type: GLenum,
    pixels: ArrayBufferView | null,
  ): void;
  texImage2D(target: GLenum, level: GLint, internalformat: GLint, format: GLenum, type: GLenum, source: TexImageSource): void;
  texImage2D(
    target: GLenum,
    level: GLint,
    internalformat: GLint,
    width: GLsizei,
    height: GLsizei,
    border: GLint,
    format: GLenum,
    type: GLenum,
    pboOffset: GLintptr,
  ): void;
  texImage2D(
    target: GLenum,
    level: GLint,
    internalformat: GLint,
    width: GLsizei,
    height: GLsizei,
    border: GLint,
    format: GLenum,
    type: GLenum,
    source: TexImageSource,
  ): void;
  texImage2D(
    target: GLenum,
    level: GLint,
    internalformat: GLint,
    width: GLsizei,
    height: GLsizei,
    border: GLint,
    format: GLenum,
    type: GLenum,
    srcData: ArrayBufferView,
    srcOffset: GLuint,
  ): void;
  texImage2D(
    target: GLenum,
    level: GLint,
    internalformat: GLint,
    width: GLsizei | GLenum,
    height: GLsizei | GLenum,
    border: GLint | TexImageSource,
    format?: GLenum,
    type?: GLenum,
    pixels?: ArrayBufferView | null | GLintptr | TexImageSource,
    srcOffset?: GLuint,
  ): void {
    this[TransferrableKeys.mutated]('texImage2D', arguments);
  }

  texImage3D(
    target: GLenum,
    level: GLint,
    internalformat: GLint,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
    border: GLint,
    format: GLenum,
    type: GLenum,
    pboOffset: GLintptr,
  ): void;
  texImage3D(
    target: GLenum,
    level: GLint,
    internalformat: GLint,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
    border: GLint,
    format: GLenum,
    type: GLenum,
    source: TexImageSource,
  ): void;
  texImage3D(
    target: GLenum,
    level: GLint,
    internalformat: GLint,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
    border: GLint,
    format: GLenum,
    type: GLenum,
    srcData: ArrayBufferView | null,
  ): void;
  texImage3D(
    target: GLenum,
    level: GLint,
    internalformat: GLint,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
    border: GLint,
    format: GLenum,
    type: GLenum,
    srcData: ArrayBufferView,
    srcOffset: GLuint,
  ): void;
  texImage3D(
    target: GLenum,
    level: GLint,
    internalformat: GLint,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
    border: GLint,
    format: GLenum,
    type: GLenum,
    pboOffset: GLintptr | TexImageSource | ArrayBufferView | null,
    srcOffset?: GLuint,
  ): void {
    this[TransferrableKeys.mutated]('texImage3D', arguments);
  }

  texParameterf(target: GLenum, pname: GLenum, param: GLfloat): void {
    if (this._texParameter(target, pname, param, 'texParameterf')) {
      this[TransferrableKeys.mutated]('texParameterf', arguments);
    }
  }

  texParameteri(target: GLenum, pname: GLenum, param: GLint): void {
    if (this._texParameter(target, pname, param, 'texParameteri')) {
      this[TransferrableKeys.mutated]('texParameteri', arguments);
    }
  }

  texStorage2D(target: GLenum, levels: GLsizei, internalformat: GLenum, width: GLsizei, height: GLsizei): void {
    this[TransferrableKeys.mutated]('texStorage2D', arguments);
  }

  texStorage3D(target: GLenum, levels: GLsizei, internalformat: GLenum, width: GLsizei, height: GLsizei, depth: GLsizei): void {
    this[TransferrableKeys.mutated]('texStorage3D', arguments);
  }

  texSubImage2D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    format: GLenum,
    type: GLenum,
    pixels: ArrayBufferView | null,
  ): void;
  texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, format: GLenum, type: GLenum, source: TexImageSource): void;
  texSubImage2D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    format: GLenum,
    type: GLenum,
    pboOffset: GLintptr,
  ): void;
  texSubImage2D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    format: GLenum,
    type: GLenum,
    source: TexImageSource,
  ): void;
  texSubImage2D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    format: GLenum,
    type: GLenum,
    srcData: ArrayBufferView,
    srcOffset: GLuint,
  ): void;
  texSubImage2D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    width: GLsizei | GLenum,
    height: GLsizei | GLenum,
    format: GLenum | TexImageSource,
    type?: GLenum,
    pixels?: ArrayBufferView | null | GLintptr | TexImageSource,
    srcOffset?: GLuint,
  ): void {
    this[TransferrableKeys.mutated]('texSubImage2D', arguments);
  }

  texSubImage3D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    zoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
    format: GLenum,
    type: GLenum,
    pboOffset: GLintptr,
  ): void;
  texSubImage3D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    zoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
    format: GLenum,
    type: GLenum,
    source: TexImageSource,
  ): void;
  texSubImage3D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    zoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
    format: GLenum,
    type: GLenum,
    srcData: ArrayBufferView | null,
    srcOffset?: GLuint,
  ): void;
  texSubImage3D(
    target: GLenum,
    level: GLint,
    xoffset: GLint,
    yoffset: GLint,
    zoffset: GLint,
    width: GLsizei,
    height: GLsizei,
    depth: GLsizei,
    format: GLenum,
    type: GLenum,
    pboOffset: GLintptr | TexImageSource | ArrayBufferView | null,
    srcOffset?: GLuint,
  ): void {
    this[TransferrableKeys.mutated]('texSubImage3D', arguments);
  }

  transformFeedbackVaryings(program: GLProgram, varyings: string[], bufferMode: GLenum): void;
  transformFeedbackVaryings(program: GLProgram, varyings: Iterable<string>, bufferMode: GLenum): void;
  transformFeedbackVaryings(program: GLProgram, varyings: string[] | Iterable<string>, bufferMode: GLenum): void {
    this[TransferrableKeys.mutated]('transformFeedbackVaryings', arguments);
  }

  uniform1f(location: vGLLocation | null, x: GLfloat): void {
    this[TransferrableKeys.mutated]('uniform1f', arguments);
  }

  uniform1fv(location: vGLLocation | null, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform1fv(location: vGLLocation | null, data: Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform1fv(location: vGLLocation | null, data: Float32List | Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniform1fv', arguments);
  }

  uniform1i(location: vGLLocation | null, x: GLint): void {
    this[TransferrableKeys.mutated]('uniform1i', arguments);
  }

  uniform1iv(location: vGLLocation | null, data: Int32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform1iv(location: vGLLocation | null, data: Iterable<GLint>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform1iv(location: vGLLocation | null, data: Int32List | Iterable<GLint>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniform1iv', arguments);
  }

  uniform1ui(location: vGLLocation | null, v0: GLuint): void {
    this[TransferrableKeys.mutated]('uniform1ui', arguments);
  }

  uniform1uiv(location: vGLLocation | null, data: Uint32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform1uiv(location: vGLLocation | null, data: Iterable<GLuint>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform1uiv(location: vGLLocation | null, data: Uint32List | Iterable<GLuint>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniform1uiv', arguments);
  }

  uniform2f(location: vGLLocation | null, x: GLfloat, y: GLfloat): void {
    this[TransferrableKeys.mutated]('uniform2f', arguments);
  }

  uniform2fv(location: vGLLocation | null, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform2fv(location: vGLLocation | null, data: Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform2fv(location: vGLLocation | null, data: Float32List | Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniform2fv', arguments);
  }

  uniform2i(location: vGLLocation | null, x: GLint, y: GLint): void {
    this[TransferrableKeys.mutated]('uniform2i', arguments);
  }

  uniform2iv(location: vGLLocation | null, data: Int32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform2iv(location: vGLLocation | null, data: Iterable<GLint>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform2iv(location: vGLLocation | null, data: Int32List | Iterable<GLint>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniform2iv', arguments);
  }

  uniform2ui(location: vGLLocation | null, v0: GLuint, v1: GLuint): void {
    this[TransferrableKeys.mutated]('uniform2ui', arguments);
  }

  uniform2uiv(location: vGLLocation | null, data: Uint32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform2uiv(location: vGLLocation | null, data: Iterable<GLuint>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform2uiv(location: vGLLocation | null, data: Uint32List | Iterable<GLuint>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniform2uiv', arguments);
  }

  uniform3f(location: vGLLocation | null, x: GLfloat, y: GLfloat, z: GLfloat): void {
    this[TransferrableKeys.mutated]('uniform3f', arguments);
  }

  uniform3fv(location: vGLLocation | null, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform3fv(location: vGLLocation | null, data: Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform3fv(location: vGLLocation | null, data: Float32List | Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniform3fv', arguments);
  }

  uniform3i(location: vGLLocation | null, x: GLint, y: GLint, z: GLint): void {
    this[TransferrableKeys.mutated]('uniform3i', arguments);
  }

  uniform3iv(location: vGLLocation | null, data: Int32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform3iv(location: vGLLocation | null, data: Iterable<GLint>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform3iv(location: vGLLocation | null, data: Int32List | Iterable<GLint>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniform3iv', arguments);
  }

  uniform3ui(location: vGLLocation | null, v0: GLuint, v1: GLuint, v2: GLuint): void {
    this[TransferrableKeys.mutated]('uniform3ui', arguments);
  }

  uniform3uiv(location: vGLLocation | null, data: Uint32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform3uiv(location: vGLLocation | null, data: Iterable<GLuint>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform3uiv(location: vGLLocation | null, data: Uint32List | Iterable<GLuint>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniform3uiv', arguments);
  }

  uniform4f(location: vGLLocation | null, x: GLfloat, y: GLfloat, z: GLfloat, w: GLfloat): void {
    this[TransferrableKeys.mutated]('uniform4f', arguments);
  }

  uniform4fv(location: vGLLocation | null, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform4fv(location: vGLLocation | null, data: Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform4fv(location: vGLLocation | null, data: Float32List | Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniform4fv', arguments);
  }

  uniform4i(location: vGLLocation | null, x: GLint, y: GLint, z: GLint, w: GLint): void {
    this[TransferrableKeys.mutated]('uniform4i', arguments);
  }

  uniform4iv(location: vGLLocation | null, data: Int32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform4iv(location: vGLLocation | null, data: Iterable<GLint>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform4iv(location: vGLLocation | null, data: Int32List | Iterable<GLint>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniform4iv', arguments);
  }

  uniform4ui(location: vGLLocation | null, v0: GLuint, v1: GLuint, v2: GLuint, v3: GLuint): void {
    this[TransferrableKeys.mutated]('uniform4ui', arguments);
  }

  uniform4uiv(location: vGLLocation | null, data: Uint32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform4uiv(location: vGLLocation | null, data: Iterable<GLuint>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform4uiv(location: vGLLocation | null, data: Uint32List | Iterable<GLuint>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniform4uiv', arguments);
  }

  uniformBlockBinding(program: GLProgram, uniformBlockIndex: GLuint, uniformBlockBinding: GLuint): void {
    this[TransferrableKeys.mutated]('uniformBlockBinding', arguments);
  }

  uniformMatrix2fv(location: vGLLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix2fv(location: vGLLocation | null, transpose: GLboolean, data: Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix2fv(
    location: vGLLocation | null,
    transpose: GLboolean,
    data: Float32List | Iterable<GLfloat>,
    srcOffset?: GLuint,
    srcLength?: GLuint,
  ): void {
    this[TransferrableKeys.mutated]('uniformMatrix2fv', arguments);
  }

  uniformMatrix2x3fv(location: vGLLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix2x3fv(location: vGLLocation | null, transpose: GLboolean, data: Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix2x3fv(
    location: vGLLocation | null,
    transpose: GLboolean,
    data: Float32List | Iterable<GLfloat>,
    srcOffset?: GLuint,
    srcLength?: GLuint,
  ): void {
    this[TransferrableKeys.mutated]('uniformMatrix2x3fv', arguments);
  }

  uniformMatrix2x4fv(location: vGLLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix2x4fv(location: vGLLocation | null, transpose: GLboolean, data: Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix2x4fv(
    location: vGLLocation | null,
    transpose: GLboolean,
    data: Float32List | Iterable<GLfloat>,
    srcOffset?: GLuint,
    srcLength?: GLuint,
  ): void {
    this[TransferrableKeys.mutated]('uniformMatrix2x4fv', arguments);
  }

  uniformMatrix3fv(location: vGLLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix3fv(location: vGLLocation | null, transpose: GLboolean, data: Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix3fv(
    location: vGLLocation | null,
    transpose: GLboolean,
    data: Float32List | Iterable<GLfloat>,
    srcOffset?: GLuint,
    srcLength?: GLuint,
  ): void {
    this[TransferrableKeys.mutated]('uniformMatrix3fv', arguments);
  }

  uniformMatrix3x2fv(location: vGLLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix3x2fv(location: vGLLocation | null, transpose: GLboolean, data: Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix3x2fv(
    location: vGLLocation | null,
    transpose: GLboolean,
    data: Float32List | Iterable<GLfloat>,
    srcOffset?: GLuint,
    srcLength?: GLuint,
  ): void {
    this[TransferrableKeys.mutated]('uniformMatrix3x2fv', arguments);
  }

  uniformMatrix3x4fv(location: vGLLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix3x4fv(location: vGLLocation | null, transpose: GLboolean, data: Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix3x4fv(
    location: vGLLocation | null,
    transpose: GLboolean,
    data: Float32List | Iterable<GLfloat>,
    srcOffset?: GLuint,
    srcLength?: GLuint,
  ): void {
    this[TransferrableKeys.mutated]('uniformMatrix3x4fv', arguments);
  }

  uniformMatrix4fv(location: vGLLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix4fv(location: vGLLocation | null, transpose: GLboolean, data: Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix4fv(
    location: vGLLocation | null,
    transpose: GLboolean,
    data: Float32List | Iterable<GLfloat>,
    srcOffset?: GLuint,
    srcLength?: GLuint,
  ): void {
    this[TransferrableKeys.mutated]('uniformMatrix4fv', arguments);
  }

  uniformMatrix4x2fv(location: vGLLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix4x2fv(location: vGLLocation | null, transpose: GLboolean, data: Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix4x2fv(
    location: vGLLocation | null,
    transpose: GLboolean,
    data: Float32List | Iterable<GLfloat>,
    srcOffset?: GLuint,
    srcLength?: GLuint,
  ): void {
    this[TransferrableKeys.mutated]('uniformMatrix4x2fv', arguments);
  }

  uniformMatrix4x3fv(location: vGLLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix4x3fv(location: vGLLocation | null, transpose: GLboolean, data: Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix4x3fv(
    location: vGLLocation | null,
    transpose: GLboolean,
    data: Float32List | Iterable<GLfloat>,
    srcOffset?: GLuint,
    srcLength?: GLuint,
  ): void {
    this[TransferrableKeys.mutated]('uniformMatrix4x3fv', arguments);
  }

  useProgram(program: GLProgram | null): void {
    if (!program || program.isDeleted()) return;
    this._bindings.program = program;
    this[TransferrableKeys.mutated]('useProgram', arguments);
  }

  validateProgram(program: GLProgram): void {
    this[TransferrableKeys.mutated]('validateProgram', arguments);
  }

  vertexAttrib1f(index: GLuint, x: GLfloat): void {
    this[TransferrableKeys.mutated]('vertexAttrib1f', arguments);
  }

  vertexAttrib1fv(index: GLuint, values: Float32List): void;
  vertexAttrib1fv(index: GLuint, values: Iterable<GLfloat>): void;
  vertexAttrib1fv(index: GLuint, values: Float32List | Iterable<GLfloat>): void {
    this[TransferrableKeys.mutated]('vertexAttrib1fv', arguments);
  }

  vertexAttrib2f(index: GLuint, x: GLfloat, y: GLfloat): void {
    this[TransferrableKeys.mutated]('vertexAttrib2f', arguments);
  }

  vertexAttrib2fv(index: GLuint, values: Float32List): void;
  vertexAttrib2fv(index: GLuint, values: Iterable<GLfloat>): void;
  vertexAttrib2fv(index: GLuint, values: Float32List | Iterable<GLfloat>): void {
    this[TransferrableKeys.mutated]('vertexAttrib2fv', arguments);
  }

  vertexAttrib3f(index: GLuint, x: GLfloat, y: GLfloat, z: GLfloat): void {
    this[TransferrableKeys.mutated]('vertexAttrib3f', arguments);
  }

  vertexAttrib3fv(index: GLuint, values: Float32List): void;
  vertexAttrib3fv(index: GLuint, values: Iterable<GLfloat>): void;
  vertexAttrib3fv(index: GLuint, values: Float32List | Iterable<GLfloat>): void {
    this[TransferrableKeys.mutated]('vertexAttrib3fv', arguments);
  }

  vertexAttrib4f(index: GLuint, x: GLfloat, y: GLfloat, z: GLfloat, w: GLfloat): void {
    this[TransferrableKeys.mutated]('vertexAttrib4f', arguments);
  }

  vertexAttrib4fv(index: GLuint, values: Float32List): void;
  vertexAttrib4fv(index: GLuint, values: Iterable<GLfloat>): void;
  vertexAttrib4fv(index: GLuint, values: Float32List | Iterable<GLfloat>): void {
    this[TransferrableKeys.mutated]('vertexAttrib4fv', arguments);
  }

  vertexAttribDivisor(index: GLuint, divisor: GLuint): void {
    this[TransferrableKeys.mutated]('vertexAttribDivisor', arguments);
  }

  vertexAttribI4i(index: GLuint, x: GLint, y: GLint, z: GLint, w: GLint): void {
    this[TransferrableKeys.mutated]('vertexAttribI4i', arguments);
  }

  vertexAttribI4iv(index: GLuint, values: Int32List): void;
  vertexAttribI4iv(index: GLuint, values: Iterable<GLint>): void;
  vertexAttribI4iv(index: GLuint, values: Int32List | Iterable<GLint>): void {
    this[TransferrableKeys.mutated]('vertexAttribI4iv', arguments);
  }

  vertexAttribI4ui(index: GLuint, x: GLuint, y: GLuint, z: GLuint, w: GLuint): void {
    this[TransferrableKeys.mutated]('vertexAttribI4ui', arguments);
  }

  vertexAttribI4uiv(index: GLuint, values: Uint32List): void;
  vertexAttribI4uiv(index: GLuint, values: Iterable<GLuint>): void;
  vertexAttribI4uiv(index: GLuint, values: Uint32List | Iterable<GLuint>): void {
    this[TransferrableKeys.mutated]('vertexAttribI4uiv', arguments);
  }

  vertexAttribIPointer(index: GLuint, size: GLint, type: GLenum, stride: GLsizei, offset: GLintptr): void {
    this[TransferrableKeys.mutated]('vertexAttribIPointer', arguments);
  }

  vertexAttribPointer(index: GLuint, size: GLint, type: GLenum, normalized: GLboolean, stride: GLsizei, offset: GLintptr): void {
    this[TransferrableKeys.mutated]('vertexAttribPointer', arguments);
  }

  viewport(x: GLint, y: GLint, width: GLsizei, height: GLsizei): void {
    this[TransferrableKeys.mutated]('viewport', arguments);
  }

  waitSync(sync: vGLSync, flags: GLbitfield, timeout: GLint64): void {
    this[TransferrableKeys.mutated]('waitSync', arguments);
  }

  public [TransferrableKeys.serializeAsTransferrableObject](): number[] {
    return this._serializedAsTransferrableObject;
  }

  private createObjectReference<T>(creationMethod: string, creationArgs: any[] | IArguments, instanceCreationFn: (id: number) => T) {
    return createObjectReference(this.canvas.ownerDocument as Document, this, creationMethod, creationArgs, instanceCreationFn);
  }

  private deleteObjectReference(objectId: number) {
    deleteObjectReference(this.canvas.ownerDocument as Document, objectId);
  }

  private [TransferrableKeys.mutated](fnName: string, args: any[] | IArguments) {
    transfer(this.canvas.ownerDocument as Document, [TransferrableMutationType.OBJECT_MUTATION, fnName, this, args]);
  }

  private _webglError(errorCode: GLenum, errorName: string, operation: string, message: string): void {
    this._error = errorCode;
    console.warn(`WebGL: ${errorName}(${errorCode}): ${operation}: ${message}`);
  }

  private _validateBinding(
    candidate: TransferrableGLObject | null,
    validator: Function,
    operation: string,
    expectedType: string,
    index: number,
  ): boolean {
    if (candidate != null) {
      if (!validator(candidate)) {
        throw new Error(`Failed to execute '${operation}' on 'WebGL2RenderingContext': parameter ${index} is not of type '${expectedType}'.`);
      }

      if (candidate.isDeleted()) {
        // WebGL: INVALID_OPERATION: bindBuffer: attempt to use a deleted object
        this._webglError(this.INVALID_OPERATION, 'INVALID_OPERATION', operation, 'attempt to use a deleted object');
        return false;
      }
    }
    return true;
  }

  private _getBoundBuffer(target: GLenum): vGLBuffer | null {
    switch (target) {
      case this.ARRAY_BUFFER:
      case this.ELEMENT_ARRAY_BUFFER:
      case this.COPY_READ_BUFFER:
      case this.COPY_WRITE_BUFFER:
      case this.TRANSFORM_FEEDBACK_BUFFER:
      case this.UNIFORM_BUFFER:
      case this.PIXEL_PACK_BUFFER:
      case this.PIXEL_UNPACK_BUFFER:
      case this.FRAMEBUFFER:
      case this.RENDERBUFFER:
      case this.DRAW_FRAMEBUFFER:
      case this.READ_FRAMEBUFFER:
        return this._buffers[target] ?? null;
      default:
        throw new Error(`Unexpected target: ${target}`);
    }
  }

  private _bindBuffer(target: GLenum, buffer: vGLBuffer | null) {
    const currentBinding = this._buffers[target];
    if (currentBinding) {
      if (currentBinding !== buffer) {
        const unitIdx = currentBinding.bindings.indexOf(target);
        if (unitIdx >= 0) {
          currentBinding.bindings.splice(unitIdx, 1);
        }
      } else {
        // TODO: should we handle this case?
        // console.info(`Buffer already bound to target - ${target}`, buffer, currentBinding);
        // return false;
      }
    }

    this._buffers[target] = buffer;
    if (buffer != null && !buffer.bindings.includes(target)) {
      buffer.bindings.push(target);
    }
  }

  private _deleteBuffer(buffer: vGLBuffer): void {
    buffer.bindings.forEach((target) => {
      if (this._buffers[target] === buffer) {
        this._buffers[target] = null;
      }
    });

    for (let indexedBuffersKey in this._indexedBuffers) {
      for (let i = 0; i < this._indexedBuffers[indexedBuffersKey].length; i++) {
        const bdata = this._indexedBuffers[indexedBuffersKey][i];
        if (bdata != null && bdata.buffer === buffer) {
          this._indexedBuffers[indexedBuffersKey][i] = null;
        }
      }
    }

    buffer.delete();
  }

  private _texHasUsage(texture: vGLTexture | null): boolean {
    if (texture) {
      for (const textureUnit in this._boundTextures) {
        const target2Texture = this._boundTextures[textureUnit];
        for (const target in target2Texture) {
          const tex = target2Texture[target];
          if (tex && tex === texture) {
            return true;
          }
        }
      }
    }
    return false;
  }

  private _texParameter(target: GLenum, pname: GLenum, param: GLint | GLfloat, operation: string): boolean {
    const texture = this._boundTextures[this._activeTexture][target];
    if (!texture) {
      // WebGL: INVALID_OPERATION: texParameter: no texture bound to target
      this._webglError(this.INVALID_OPERATION, 'INVALID_OPERATION', operation, 'no texture bound to target ' + target);
      return false;
    }

    const parameter = texture.parameters[pname];

    if (!parameter) {
      // WebGL: INVALID_ENUM: texParameterf: invalid parameter name
      this._webglError(this.INVALID_ENUM, 'INVALID_ENUM', operation, 'invalid parameter name ' + pname);
      return false;
    }

    if (parameter.readonly) {
      return false; // Parameter marked as read only, skip
    }

    switch (pname) {
      case this.TEXTURE_MAG_FILTER:
      case this.TEXTURE_MIN_FILTER:
      case this.TEXTURE_WRAP_S:
      case this.TEXTURE_WRAP_T:
      case this.TEXTURE_WRAP_R:
      case this.TEXTURE_COMPARE_FUNC:
      case this.TEXTURE_COMPARE_MODE: {
        if (!parameter.allowed.includes(param)) {
          this._webglError(this.INVALID_ENUM, 'INVALID_ENUM', operation, 'Texture param not recognized. Invalid parameter ' + param);
          return false;
        }
        break;
      }
      case this.TEXTURE_BASE_LEVEL:
      case this.TEXTURE_MAX_LEVEL: {
        if (param < 0) {
          // GL_INVALID_VALUE: Level of detail outside of range.
          // GL_INVALID_VALUE: Base level must be at least 0.
          this._webglError(this.INVALID_VALUE, 'INVALID_VALUE', operation, 'Level must be at least 0. Value: ' + param);
          return false;
        }
        break;
      }
      case this.TEXTURE_MAX_ANISOTROPY_EXT: {
        if (!('EXT_texture_filter_anisotropic' in this._extensions)) {
          // WebGL: INVALID_ENUM: texParameter: invalid parameter, EXT_texture_filter_anisotropic not enabled
          this._webglError(this.INVALID_ENUM, 'INVALID_ENUM', operation, 'invalid parameter, EXT_texture_filter_anisotropic not enabled');
          return false;
        }
        if (param <= 0) {
          // GL_INVALID_VALUE: Parameter outside of bounds.
          this._webglError(this.INVALID_VALUE, 'INVALID_VALUE', operation, 'Parameter outside of bounds. Value: ' + param);
          return false;
        }
        break;
      }
    }

    parameter.value = param;
    return true;
  }
}
