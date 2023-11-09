import { HTMLCanvasElement } from '../dom/HTMLCanvasElement';
import { GLC } from './gl/GLC';
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

export type CONTEXT_TYPE = 'webgl' | 'webgl2';

export class WebGLRenderingContextPolyfill extends GLC implements WebGL2RenderingContext, TransferrableObject {
  public readonly type: CONTEXT_TYPE;
  public readonly id: number;
  public readonly canvas: HTMLCanvasElement | any;
  public readonly drawingBufferHeight: GLsizei;
  public readonly drawingBufferWidth: GLsizei;

  private readonly _serializedAsTransferrableObject: number[];

  private readonly _supportedExtensions: string[] = [];
  private readonly _extensions: {
    [key: string]: any;
  } = {};
  readonly _parameters: {
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
  };
  private readonly _boundTextures: {
    [key: GLenum]: {
      [key: GLenum]: vGLTexture | null;
      sampler: vGLSampler | null;
    };
  } = {
    [GLC.TEXTURE0]: {
      sampler: null,
    },
  };

  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/isEnabled
  // By default, all capabilities except gl.DITHER are disabled.
  private readonly _capabilities: {
    [key: GLenum]: boolean;
  } = {
    [GLC.DITHER]: true,
    [GLC.BLEND]: false,
    [GLC.CULL_FACE]: false,
    [GLC.DEPTH_TEST]: false,
    [GLC.POLYGON_OFFSET_FILL]: false,
    [GLC.SAMPLE_ALPHA_TO_COVERAGE]: false,
    [GLC.SAMPLE_COVERAGE]: false,
    [GLC.SCISSOR_TEST]: false,
    [GLC.STENCIL_TEST]: false,
    [GLC.RASTERIZER_DISCARD]: false,
  };

  private readonly _shaderPrecisionFormat: { [key: number]: { [key: number]: WebGLShaderPrecisionFormat | null } } = {};
  private readonly _internalformatParameter: { [key: number]: number[] } = {};

  // @ts-ignore
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/unpackColorSpace
  private _unpackColorSpace: PredefinedColorSpace = 'srgb';
  private _drawingBufferColorSpace: PredefinedColorSpace = 'srgb';

  private _contextAttributes: WebGLContextAttributes | null = null;
  private _activeTexture: GLenum = GLC.TEXTURE0;
  private _error: GLenum = GLC.NO_ERROR;
  private _contextLost: boolean = false;

  constructor(type: CONTEXT_TYPE, id: number, canvas: HTMLCanvasElement, contextAttributes: WebGLContextAttributes | undefined, options?: WebGLOptions | null) {
    super();
    options = options || ({} as WebGLOptions);

    this.type = type;
    this.id = id;
    this._serializedAsTransferrableObject = [TransferrableObjectType.TransferObject, this.id];

    this.canvas = canvas;
    this.drawingBufferHeight = canvas.height;
    this.drawingBufferWidth = canvas.width;

    this._supportedExtensions = options.extensions || [];
    this._parameters = options.parameters || {};
    this._shaderPrecisionFormat = options.shaderPrecisionFormat;
    this._drawingBufferColorSpace = options.drawingBufferColorSpace;
    this._unpackColorSpace = options.unpackColorSpace;
    this._internalformatParameter = options.internalformatParameter;

    this.initializeContextLostHandlers();
    this.initializeContextAttributes(contextAttributes);
    this.initializeSupportedExtensions();
    this.initializeParameters(type);

    this._indexedBuffers = {
      [GLC.TRANSFORM_FEEDBACK_BUFFER]: new Array(this._parameters[GLC.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS] || 12),
      [GLC.UNIFORM_BUFFER]: new Array(this._parameters[GLC.MAX_UNIFORM_BUFFER_BINDINGS] || 12),
    };
  }

  get drawingBufferColorSpace(): PredefinedColorSpace {
    return this._drawingBufferColorSpace;
  }

  set drawingBufferColorSpace(value: PredefinedColorSpace) {
    if (this._drawingBufferColorSpace != value) {
      this._drawingBufferColorSpace = value;
      transfer(this.canvas.ownerDocument as Document, [TransferrableMutationType.PROPERTIES, this, 'drawingBufferColorSpace', value]);
    }
  }

  get unpackColorSpace(): PredefinedColorSpace {
    return this._unpackColorSpace;
  }

  set unpackColorSpace(value: PredefinedColorSpace) {
    if (this._unpackColorSpace != value) {
      this._unpackColorSpace = value;
      transfer(this.canvas.ownerDocument as Document, [TransferrableMutationType.PROPERTIES, this, 'unpackColorSpace', value]);
    }
  }

  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/activeTexture
   * @param texture The texture unit to make active. The value is a gl.TEXTUREI where I is within the range from 0 to gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS - 1.
   * @throws If texture is not one of gl.TEXTUREI, where I is within the range from 0 to gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS - 1, a gl.INVALID_ENUM error is thrown.
   */
  activeTexture(texture: GLenum): void {
    if (texture - GLC.TEXTURE0 >= this.getParameter(GLC.MAX_COMBINED_TEXTURE_IMAGE_UNITS)) {
      this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'activeTexture', 'texture unit out of range');
      return;
    }

    this[TransferrableKeys.mutated]('activeTexture', arguments);
    this._activeTexture = texture;
    if (!this._boundTextures[this._activeTexture]) {
      this._boundTextures[this._activeTexture] = {
        sampler: null,
      };
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
    this._parameters[GLC.TRANSFORM_FEEDBACK_ACTIVE] = true;
    this._parameters[GLC.TRANSFORM_FEEDBACK_PAUSED] = false;
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
      case GLC.ELEMENT_ARRAY_BUFFER:
      case GLC.COPY_READ_BUFFER:
      case GLC.COPY_WRITE_BUFFER:
      case GLC.TRANSFORM_FEEDBACK_BUFFER:
      case GLC.UNIFORM_BUFFER:
      case GLC.PIXEL_PACK_BUFFER:
      case GLC.PIXEL_UNPACK_BUFFER:
      case GLC.ARRAY_BUFFER: {
        this[TransferrableKeys.mutated]('bindBuffer', arguments);
        this._bindBuffer(target, buffer);
        break;
      }
      default: {
        // WebGL: INVALID_ENUM: bindBuffer: invalid target - xxx
        this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'bindBuffer', 'invalid target - ' + target);
      }
    }
  }

  bindBufferBase(target: GLenum, index: GLuint, buffer: vGLBuffer | null): void {
    if (!this._validateBinding(buffer, this.isBuffer, 'bindBufferBase', 'WebGLBuffer', 3)) {
      return;
    }
    // https://registry.khronos.org/OpenGL-Refpages/es3.0/html/glBindBufferBase.xhtml
    switch (target) {
      case GLC.TRANSFORM_FEEDBACK_BUFFER: {
        if (index >= this.getParameter(GLC.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS)) {
          // WebGL: INVALID_VALUE: bindBufferBase: index out of range
          this._webglError(GLC.INVALID_VALUE, 'INVALID_VALUE', 'bindBufferBase', 'index out of range');
          return;
        }
        break;
      }
      case GLC.UNIFORM_BUFFER: {
        if (index >= this.getParameter(GLC.MAX_UNIFORM_BUFFER_BINDINGS)) {
          // WebGL: INVALID_VALUE: bindBufferBase: index out of range
          this._webglError(GLC.INVALID_VALUE, 'INVALID_VALUE', 'bindBufferBase', 'index out of range');
          return;
        }
        break;
      }
      default: {
        // WebGL: INVALID_ENUM: bindBufferBase: invalid target - xxx
        this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'bindBufferBase', 'invalid target - ' + target);
        return;
      }
    }

    this[TransferrableKeys.mutated]('bindBufferBase', arguments);
    this._bindBuffer(target, buffer);
    this._indexedBuffers[target][index] = { size: 0, offset: 0, buffer };
  }

  bindBufferRange(target: GLenum, index: GLuint, buffer: vGLBuffer | null, offset: GLintptr, size: GLsizeiptr): void {
    if (!this._validateBinding(buffer, this.isBuffer, 'bindBufferRange', 'WebGLBuffer', 3)) {
      return;
    }

    if (buffer != null && size <= 0) {
      // WebGL: INVALID_VALUE: bindBufferRange: size out of range
      this._webglError(GLC.INVALID_VALUE, 'INVALID_VALUE', 'bindBufferRange', 'size out of range');
      return;
    }

    switch (target) {
      case GLC.TRANSFORM_FEEDBACK_BUFFER: {
        if (index >= this.getParameter(GLC.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS)) {
          // WebGL: INVALID_VALUE: bindBufferRange: index out of range
          this._webglError(GLC.INVALID_VALUE, 'INVALID_VALUE', 'bindBufferRange', 'index out of range');
          return;
        }

        if (offset % 4 !== 0 || size % 4 !== 0) {
          // WebGL: INVALID_VALUE: bindBufferRange: size or offset are not multiples of 4
          this._webglError(GLC.INVALID_VALUE, 'INVALID_VALUE', 'bindBufferRange', 'size or offset are not multiples of 4');
          return;
        }

        break;
      }
      case GLC.UNIFORM_BUFFER: {
        if (index >= this.getParameter(GLC.MAX_UNIFORM_BUFFER_BINDINGS)) {
          // WebGL: INVALID_VALUE: bindBufferRange: index out of range
          this._webglError(GLC.INVALID_VALUE, 'INVALID_VALUE', 'bindBufferRange', 'index out of range');
          return;
        }
        if (offset % this.getParameter(GLC.UNIFORM_BUFFER_OFFSET_ALIGNMENT) !== 0) {
          // WebGL: INVALID_VALUE: bindBufferRange: index out of range
          this._webglError(GLC.INVALID_VALUE, 'INVALID_VALUE', 'bindBufferRange', 'offset are not multiples of UNIFORM_BUFFER_OFFSET_ALIGNMENT');
          return;
        }
        break;
      }
      default: {
        // WebGL: INVALID_ENUM: bindBufferRange: invalid target - xxx
        this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'bindBufferRange', 'invalid target - ' + target);
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
      case GLC.FRAMEBUFFER:
      case GLC.DRAW_FRAMEBUFFER:
      case GLC.READ_FRAMEBUFFER: {
        this[TransferrableKeys.mutated]('bindFramebuffer', arguments);
        this._bindBuffer(target, framebuffer);
        break;
      }
      default: {
        // WebGL: INVALID_ENUM: bindFramebuffer: invalid target - xxx
        this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'bindFramebuffer', 'invalid target - ' + target);
      }
    }
  }

  bindRenderbuffer(target: GLenum, renderbuffer: vGLRenderbuffer | null): void {
    if (!this._validateBinding(renderbuffer, this.isRenderbuffer, 'bindRenderbuffer', 'WebGLRenderbuffer', 2)) {
      return;
    }

    switch (target) {
      case GLC.RENDERBUFFER: {
        this[TransferrableKeys.mutated]('bindRenderbuffer', arguments);
        this._bindBuffer(target, renderbuffer);
        break;
      }
      default: {
        // WebGL: INVALID_ENUM: bindRenderbuffer: invalid target - xxx
        this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'bindRenderbuffer', 'invalid target - ' + target);
      }
    }
  }

  bindSampler(unit: GLuint, sampler: vGLSampler | null): void {
    if (!this._validateBinding(sampler, this.isSampler, 'bindSampler', 'WebGLSampler', 2)) {
      return;
    }

    this[TransferrableKeys.mutated]('bindSampler', arguments);

    type ObjectKey = keyof typeof this; // TODO: is this OK?

    const activeTextureKey = this['TEXTURE' + unit as ObjectKey] as GLenum;
    if (!this._boundTextures[activeTextureKey]) {
      this._boundTextures[activeTextureKey] = {
        sampler,
      };
    } else {
      this._boundTextures[activeTextureKey].sampler = sampler;
    }
  }

  bindTexture(target: GLenum, texture: vGLTexture | null): void {
    if (!this._validateBinding(texture, this.isTexture, 'bindTexture', 'WebGLTexture', 2)) {
      return;
    }

    switch (target) {
      case GLC.TEXTURE_2D:
      case GLC.TEXTURE_CUBE_MAP:
      case GLC.TEXTURE_2D_ARRAY:
      case GLC.TEXTURE_3D: {
        if (texture != null) {
          if (texture.boundTarget != null && texture.boundTarget != target) {
            // WebGL: INVALID_OPERATION: bindTexture: textures can not be used with multiple targets
            this._webglError(GLC.INVALID_OPERATION, 'INVALID_OPERATION', 'bindTexture', 'textures can not be used with multiple targets');
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
        this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'bindTexture', 'invalid target - ' + target);
      }
    }
  }

  bindTransformFeedback(target: GLenum, tf: vGLTransformFeedback | null): void {
    if (!this._validateBinding(tf, this.isTransformFeedback, 'bindTransformFeedback', 'WebGLTransformFeedback', 2)) {
      return;
    }

    switch (target) {
      case GLC.TRANSFORM_FEEDBACK: {
        this[TransferrableKeys.mutated]('bindTransformFeedback', arguments);
        this._bindings.transformFeedback = tf;
        break;
      }
      default: {
        // WebGL: INVALID_ENUM: bindRenderbuffer: invalid target - xxx
        this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'bindTransformFeedback', 'invalid target - ' + target);
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
    this._parameters[GLC.BLEND_COLOR] = [red, green, blue, alpha];
  }

  blendEquation(mode: GLenum): void {
    this[TransferrableKeys.mutated]('blendEquation', arguments);
    this._parameters[GLC.BLEND_EQUATION] = mode;
    this._parameters[GLC.BLEND_EQUATION_ALPHA] = mode;
    this._parameters[GLC.BLEND_EQUATION_RGB] = mode;
  }

  blendEquationSeparate(modeRGB: GLenum, modeAlpha: GLenum): void {
    this[TransferrableKeys.mutated]('blendEquationSeparate', arguments);
    this._parameters[GLC.BLEND_EQUATION] = modeRGB;
    this._parameters[GLC.BLEND_EQUATION_ALPHA] = modeAlpha;
    this._parameters[GLC.BLEND_EQUATION_RGB] = modeRGB;
  }

  blendFunc(sfactor: GLenum, dfactor: GLenum): void {
    this[TransferrableKeys.mutated]('blendFunc', arguments);
    this._parameters[GLC.BLEND_SRC_RGB] = sfactor;
    this._parameters[GLC.BLEND_SRC_ALPHA] = sfactor;
    this._parameters[GLC.BLEND_DST_RGB] = dfactor;
    this._parameters[GLC.BLEND_DST_ALPHA] = dfactor;
  }

  blendFuncSeparate(srcRGB: GLenum, dstRGB: GLenum, srcAlpha: GLenum, dstAlpha: GLenum): void {
    this[TransferrableKeys.mutated]('blendFuncSeparate', arguments);
    this._parameters[GLC.BLEND_SRC_RGB] = srcRGB;
    this._parameters[GLC.BLEND_SRC_ALPHA] = srcAlpha;
    this._parameters[GLC.BLEND_DST_RGB] = dstRGB;
    this._parameters[GLC.BLEND_DST_ALPHA] = dstAlpha;
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
    return GLC.FRAMEBUFFER_COMPLETE; // hope
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
    this._parameters[GLC.COLOR_CLEAR_VALUE] = [red, green, blue, alpha];
  }

  clearDepth(depth: GLclampf): void {
    this[TransferrableKeys.mutated]('clearDepth', arguments);
    this._parameters[GLC.DEPTH_CLEAR_VALUE] = depth;
  }

  clearStencil(s: GLint): void {
    this[TransferrableKeys.mutated]('clearStencil', arguments);
    this._parameters[GLC.STENCIL_CLEAR_VALUE] = s;
  }

  clientWaitSync(sync: vGLSync, flags: GLbitfield, timeout: GLuint64): GLenum {
    throw new Error('NOT IMPLEMENTED');
  }

  colorMask(red: GLboolean, green: GLboolean, blue: GLboolean, alpha: GLboolean): void {
    this[TransferrableKeys.mutated]('colorMask', arguments);
    this._parameters[GLC.COLOR_WRITEMASK] = [red, green, blue, alpha];
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
    this._parameters[GLC.TRANSFORM_FEEDBACK_ACTIVE] = false;
    this._parameters[GLC.TRANSFORM_FEEDBACK_PAUSED] = false;
    return this.createObjectReference('createTransformFeedback', [], (id) => new vGLTransformFeedback(id));
  }

  createVertexArray(): vGLVertexArrayObject | null {
    return this.createObjectReference('createVertexArray', [], (id) => new vGLVertexArrayObject(id));
  }

  cullFace(mode: GLenum): void {
    if (mode != GLC.BACK && mode != GLC.FRONT && mode != GLC.FRONT_AND_BACK) {
      this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'cullFace', 'invalid mode ' + mode);
      return;
    }

    if (this.getParameter(GLC.CULL_FACE_MODE) != mode) {
      this[TransferrableKeys.mutated]('cullFace', arguments);
      this._parameters[GLC.CULL_FACE_MODE] = mode;
    }
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

    for (const boundTexturesKey in this._boundTextures) {
      if (this._boundTextures[boundTexturesKey].sampler === sampler) {
        this._boundTextures[boundTexturesKey].sampler = null;
      }
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
    this._parameters[GLC.DEPTH_FUNC] = func;
  }

  depthMask(flag: GLboolean): void {
    this[TransferrableKeys.mutated]('depthMask', arguments);
    this._parameters[GLC.DEPTH_WRITEMASK] = flag;
  }

  depthRange(zNear: GLclampf, zFar: GLclampf): void {
    this[TransferrableKeys.mutated]('depthRange', arguments);
    this._parameters[GLC.DEPTH_RANGE] = [zNear, zFar];
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

    // // https://registry.khronos.org/OpenGL-Refpages/gl4/html/glDrawBuffers.xhtml
    // const buffer = this._getBoundBuffer(this.DRAW_FRAMEBUFFER) || this._getBoundBuffer(this.FRAMEBUFFER);
    // if (buffer) {
    //   buffer.buffers = [...buffers];
    // } else {
    //   console.warn('No DRAW_FRAMEBUFFER or FRAMEBUFFER bound.');
    // }
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
    this._parameters[GLC.TRANSFORM_FEEDBACK_ACTIVE] = false;
    this._parameters[GLC.TRANSFORM_FEEDBACK_PAUSED] = false;
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
    if (mode != GLC.CW && mode != GLC.CCW) {
      this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'frontFace', 'invalid mode ' + mode);
      return;
    }

    if (this.getParameter(GLC.FRONT_FACE) != mode) {
      this[TransferrableKeys.mutated]('frontFace', arguments);
      this._parameters[GLC.FRONT_FACE] = mode;
    }
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
    // program.uniformsByLocation[uniformBlockIndex].name ??
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
      this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'getBufferParameter', 'invalid target ' + target);
      return null;
    }
    // see #bufferData
    switch (pname) {
      case GLC.BUFFER_SIZE: {
        //Returns a GLint indicating the size of the buffer in bytes.
        return buffer.size;
      }
      case GLC.BUFFER_USAGE: {
        return buffer.usage;
      }
      default: {
        this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'getBufferParameter', 'invalid pname ' + pname);
        return null;
      }
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
    this._error = GLC.NO_ERROR;
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
        case 'OES_standard_derivatives': {
          this.fetchParameterWithDefaultValue(GLC.FRAGMENT_SHADER_DERIVATIVE_HINT_OES, null);
          return new GenericExtension();
        }
        case 'WEBGL_compressed_texture_astc':
          return new WEBGLCompressedTextureAstc();
        case 'WEBGL_debug_shaders':
          return new WEBGLDebugShaders();
        case 'ANGLE_instanced_arrays':
          return new ANGLEInstancedArrays(id, this);
        case 'EXT_disjoint_timer_query':
        case 'EXT_disjoint_timer_query_webgl2': // TODO: should be validated per context type
          return new EXTDisjointTimerQuery(id, this);
        case 'OES_draw_buffers_indexed':
          return new OESDrawBuffersIndexed(id, this);
        case 'OES_vertex_array_object':
          return new OESVertexArrayObject(id, this);
        case 'OVR_multiview2': {
          this.fetchParameterWithDefaultValue(GLC.MAX_VIEWS_OVR, 2);
          return new OVRMultiview2(id, this);
        }
        case 'WEBGL_draw_buffers': {
          this.fetchParameterWithDefaultValue(GLC.MAX_COLOR_ATTACHMENTS_WEBGL, 2);
          this.fetchParameterWithDefaultValue(GLC.MAX_DRAW_BUFFERS_WEBGL, 2);
          return new WEBGLDrawBuffers(id, this);
        }
        case 'WEBGL_lose_context':
          return new WEBGLLoseContext(id, this);
        case 'WEBGL_multi_draw':
          return new WEBGLMultiDraw(id, this);
        case 'EXT_texture_filter_anisotropic': {
          this.fetchParameterWithDefaultValue(GLC.MAX_TEXTURE_MAX_ANISOTROPY_EXT, 2);
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
      case GLC.TRANSFORM_FEEDBACK_BUFFER_BINDING: {
        const buffer = this._indexedBuffers[GLC.TRANSFORM_FEEDBACK_BUFFER][index];
        if (buffer) {
          return buffer.buffer;
        }
        return null;
      }
      case GLC.TRANSFORM_FEEDBACK_BUFFER_SIZE: {
        const buffer = this._indexedBuffers[GLC.TRANSFORM_FEEDBACK_BUFFER][index];
        if (buffer) {
          return buffer.size;
        }
        return 0;
      }
      case GLC.TRANSFORM_FEEDBACK_BUFFER_START: {
        const buffer = this._indexedBuffers[GLC.TRANSFORM_FEEDBACK_BUFFER][index];
        if (buffer) {
          return buffer.offset;
        }
        return 0;
      }
      case GLC.UNIFORM_BUFFER_BINDING: {
        const buffer = this._indexedBuffers[GLC.UNIFORM_BUFFER][index];
        if (buffer) {
          return buffer.buffer;
        }
        return null;
      }
      case GLC.UNIFORM_BUFFER_SIZE: {
        const buffer = this._indexedBuffers[GLC.UNIFORM_BUFFER][index];
        if (buffer) {
          return buffer.size;
        }
        return 0;
      }
      case GLC.UNIFORM_BUFFER_START: {
        const buffer = this._indexedBuffers[GLC.UNIFORM_BUFFER][index];
        if (buffer) {
          return buffer.offset;
        }
        return 0;
      }
      case GLC.BLEND_EQUATION_RGB:
      case GLC.BLEND_EQUATION_ALPHA:
      case GLC.BLEND_SRC_RGB:
      case GLC.BLEND_SRC_ALPHA:
      case GLC.BLEND_DST_RGB:
      case GLC.BLEND_DST_ALPHA:
      case GLC.COLOR_WRITEMASK: {
        if ('OES_draw_buffers_indexed' in this._extensions) {
          const ext = this._extensions['OES_draw_buffers_indexed'] as OESDrawBuffersIndexed;
          return ext.getIndexedParameter(target, index);
        }
        return null;
      }

      default: {
        this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'getIndexedParameter', 'invalid target ' + target);
        return null;
      }
    }
  }

  getInternalformatParameter(target: GLenum, internalformat: GLenum, pname: GLenum): any {
    if (target != GLC.RENDERBUFFER) {
      this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'getInternalformatParameter', 'invalid target ' + target);
      return null;
    }

    if (pname != GLC.SAMPLES) {
      this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'getInternalformatParameter', 'invalid pname ' + pname);
      return null;
    }

    const param = this._internalformatParameter[internalformat];
    if (param) {
      return new Int32Array(param);
    }

    return new Int32Array(0);
  }

  // TODO: implement:
  // - SAMPLE_BUFFERS
  // - DRAW_BUFFER(i)
  // - WEBGL_draw_buffers: ext.DRAW_BUFFER(i)_WEBGL
  getParameter(pname: GLenum): any {
    if (this._parameters && pname in this._parameters) return this._parameters[pname];

    switch (pname) {
      case GLC.ACTIVE_TEXTURE: {
        return this._activeTexture;
      }
      case GLC.TEXTURE_BINDING_2D: {
        return this._boundTextures[this._activeTexture][GLC.TEXTURE_2D];
      }
      case GLC.TEXTURE_BINDING_2D_ARRAY: {
        return this._boundTextures[this._activeTexture][GLC.TEXTURE_2D_ARRAY];
      }
      case GLC.TEXTURE_BINDING_3D: {
        return this._boundTextures[this._activeTexture][GLC.TEXTURE_3D];
      }
      case GLC.TEXTURE_BINDING_CUBE_MAP: {
        return this._boundTextures[this._activeTexture][GLC.TEXTURE_CUBE_MAP];
      }
      case GLC.SAMPLER_BINDING: {
        return this._boundTextures[this._activeTexture].sampler || null;
      }
      case GLC.CURRENT_PROGRAM: {
        return this._bindings.program;
      }
      case GLC.VERTEX_ARRAY_BINDING: {
        return this._bindings.vertexArray;
      }
      case GLC.TRANSFORM_FEEDBACK_BINDING: {
        return this._bindings.transformFeedback;
      }
      case GLC.ARRAY_BUFFER_BINDING: {
        return this._getBoundBuffer(GLC.ARRAY_BUFFER);
      }
      case GLC.ELEMENT_ARRAY_BUFFER_BINDING: {
        return this._getBoundBuffer(GLC.ELEMENT_ARRAY_BUFFER);
      }
      case GLC.COPY_READ_BUFFER_BINDING: {
        return this._getBoundBuffer(GLC.COPY_READ_BUFFER);
      }
      case GLC.COPY_WRITE_BUFFER_BINDING: {
        return this._getBoundBuffer(GLC.COPY_WRITE_BUFFER);
      }
      case GLC.TRANSFORM_FEEDBACK_BUFFER_BINDING: {
        return this._getBoundBuffer(GLC.TRANSFORM_FEEDBACK_BUFFER);
      }
      case GLC.UNIFORM_BUFFER_BINDING: {
        return this._getBoundBuffer(GLC.UNIFORM_BUFFER);
      }
      case GLC.PIXEL_PACK_BUFFER_BINDING: {
        return this._getBoundBuffer(GLC.PIXEL_PACK_BUFFER);
      }
      case GLC.PIXEL_UNPACK_BUFFER_BINDING: {
        return this._getBoundBuffer(GLC.PIXEL_UNPACK_BUFFER);
      }
      case GLC.FRAMEBUFFER_BINDING: {
        return this._getBoundBuffer(GLC.FRAMEBUFFER);
      }
      case GLC.RENDERBUFFER_BINDING: {
        return this._getBoundBuffer(GLC.RENDERBUFFER);
      }
      case GLC.DRAW_FRAMEBUFFER_BINDING: {
        return this._getBoundBuffer(GLC.DRAW_FRAMEBUFFER);
      }
      case GLC.READ_FRAMEBUFFER_BINDING: {
        return this._getBoundBuffer(GLC.READ_FRAMEBUFFER);
      }
      case GLC.BLEND:
      case GLC.CULL_FACE:
      case GLC.DEPTH_TEST:
      case GLC.DITHER:
      case GLC.POLYGON_OFFSET_FILL:
      case GLC.SCISSOR_TEST:
      case GLC.STENCIL_TEST:
      case GLC.SAMPLE_ALPHA_TO_COVERAGE:
      case GLC.SAMPLE_COVERAGE:
      case GLC.RASTERIZER_DISCARD: {
        return this.isEnabled(pname);
      }
      case GLC.COMPRESSED_TEXTURE_FORMATS: {
        const formats = [];
        if ('WEBGL_compressed_texture_s3tc' in this._extensions) {
          formats.push(GLC.COMPRESSED_RGB_S3TC_DXT1_EXT,
            GLC.COMPRESSED_RGBA_S3TC_DXT1_EXT,
            GLC.COMPRESSED_RGBA_S3TC_DXT3_EXT,
            GLC.COMPRESSED_RGBA_S3TC_DXT5_EXT);
        }
        if ('WEBGL_compressed_texture_s3tc_srgb' in this._extensions) {
          formats.push(GLC.COMPRESSED_SRGB_S3TC_DXT1_EXT,
            GLC.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT,
            GLC.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT,
            GLC.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT);
        }
        if ('WEBGL_compressed_texture_etc' in this._extensions) {
          formats.push(GLC.COMPRESSED_R11_EAC,
            GLC.COMPRESSED_SIGNED_R11_EAC,
            GLC.COMPRESSED_RG11_EAC,
            GLC.COMPRESSED_SIGNED_RG11_EAC,
            GLC.COMPRESSED_RGB8_ETC2,
            GLC.COMPRESSED_RGBA8_ETC2_EAC,
            GLC.COMPRESSED_SRGB8_ETC2,
            GLC.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC,
            GLC.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2,
            GLC.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2);
        }
        if ('WEBGL_compressed_texture_pvrtc' in this._extensions) {
          formats.push(GLC.COMPRESSED_RGB_PVRTC_4BPPV1_IMG,
            GLC.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG,
            GLC.COMPRESSED_RGB_PVRTC_2BPPV1_IMG,
            GLC.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG);
        }
        if ('WEBGL_compressed_texture_etc1' in this._extensions) {
          formats.push(GLC.COMPRESSED_RGB_ETC1_WEBGL);
        }
        if ('WEBGL_compressed_texture_astc' in this._extensions) {
          formats.push(GLC.COMPRESSED_RGBA_ASTC_4x4_KHR,
            GLC.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR,
            GLC.COMPRESSED_RGBA_ASTC_5x4_KHR,
            GLC.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR,
            GLC.COMPRESSED_RGBA_ASTC_5x5_KHR,
            GLC.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR,
            GLC.COMPRESSED_RGBA_ASTC_6x5_KHR,
            GLC.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR,
            GLC.COMPRESSED_RGBA_ASTC_6x6_KHR,
            GLC.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR,
            GLC.COMPRESSED_RGBA_ASTC_8x5_KHR,
            GLC.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR,
            GLC.COMPRESSED_RGBA_ASTC_8x6_KHR,
            GLC.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR,
            GLC.COMPRESSED_RGBA_ASTC_8x8_KHR,
            GLC.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR,
            GLC.COMPRESSED_RGBA_ASTC_10x5_KHR,
            GLC.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR,
            GLC.COMPRESSED_RGBA_ASTC_10x6_KHR,
            GLC.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR,
            GLC.COMPRESSED_RGBA_ASTC_10x6_KHR,
            GLC.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR,
            GLC.COMPRESSED_RGBA_ASTC_10x10_KHR,
            GLC.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR,
            GLC.COMPRESSED_RGBA_ASTC_12x10_KHR,
            GLC.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR,
            GLC.COMPRESSED_RGBA_ASTC_12x12_KHR,
            GLC.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR);
        }
        if ('EXT_texture_compression_bptc' in this._extensions) {
          formats.push(GLC.COMPRESSED_RGBA_BPTC_UNORM_EXT,
            GLC.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT,
            GLC.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT,
            GLC.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT);
        }
        return formats;
      }
      case GLC.MAX_TEXTURE_MAX_ANISOTROPY_EXT: {
        if (!('EXT_texture_filter_anisotropic' in this._extensions)) {
          // WebGL: INVALID_ENUM: getParameter: invalid parameter name, EXT_texture_filter_anisotropic not enabled
          this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'getParameter', 'invalid parameter name, EXT_texture_filter_anisotropic not enabled');
        }
        return null;
      }
      case GLC.MAX_COLOR_ATTACHMENTS_WEBGL:
      case GLC.MAX_DRAW_BUFFERS_WEBGL: {
        if (!('WEBGL_draw_buffers' in this._extensions)) {
          this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'getParameter', 'invalid parameter name, WEBGL_draw_buffers not enabled');
        }
        return null;
      }
      case GLC.FRAGMENT_SHADER_DERIVATIVE_HINT_OES: {
        if (!('OES_standard_derivatives' in this._extensions)) {
          this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'getParameter', 'invalid parameter name, OES_standard_derivatives not enabled');
        }
        return null;
      }
      case GLC.MAX_VIEWS_OVR: {
        if (!('OVR_multiview2' in this._extensions)) {
          this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'getParameter', 'invalid parameter name, OVR_multiview2 not enabled');
        }
        return null;
      }
      case GLC.VERTEX_ARRAY_BINDING_OES: { // See: GLExtension OESVertexArrayObject#bindVertexArrayOES
        if (!('OES_vertex_array_object' in this._extensions)) {
          this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'getParameter', 'invalid parameter name, OES_vertex_array_object not enabled');
        }
        return null;
      }
      case GLC.TIMESTAMP_EXT:
      case GLC.GPU_DISJOINT_EXT: {
        if (!('EXT_disjoint_timer_query' in this._extensions) && !('EXT_disjoint_timer_query_webgl2' in this._extensions)) {
          this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'getParameter', 'invalid parameter name, EXT_disjoint_timer_query / EXT_disjoint_timer_query_webgl2 not enabled');
        }
        return null;
      }
      default:
        if (!Object.values(this).includes(pname)) {
          // WebGL: INVALID_ENUM: getParameter: invalid parameter name
          this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'getParameter', 'invalid parameter name');
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
      case GLC.ACTIVE_UNIFORMS: // Returns a GLint indicating the number of active uniform variables to a program.
        return program.activeUniforms;
      case GLC.ACTIVE_ATTRIBUTES: // Returns a GLint indicating the number of active attribute variables to a program.
        return program.activeAttributes;
      case GLC.DELETE_STATUS: // Returns a GLboolean indicating whether or not the program is flagged for deletion.
        return program.isDeleted(); // See #deleteProgram
      case GLC.ATTACHED_SHADERS: // Returns a GLint indicating the number of attached shaders to a program.
        return program.shaders.length;
      case GLC.TRANSFORM_FEEDBACK_BUFFER_MODE: // Returns a GLenum indicating the buffer mode when transform feedback is active. May be gl.SEPARATE_ATTRIBS or gl.INTERLEAVED_ATTRIBS.
      case GLC.TRANSFORM_FEEDBACK_VARYINGS: // Returns a GLint indicating the number of varying variables to capture in transform feedback mode.
      case GLC.ACTIVE_UNIFORM_BLOCKS: // Returns a GLint indicating the number of uniform blocks containing active uniforms.
        throw new Error(`NOT YET IMPLEMENTED: ${pname}`);
      case GLC.VALIDATE_STATUS: // Returns a GLboolean indicating whether or not the last validation operation was successful.
      case GLC.LINK_STATUS: // Returns a GLboolean indicating whether or not the last link operation was successful.
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
    if (!sampler || sampler.isDeleted()) {
      this._webglError(GLC.INVALID_OPERATION, 'INVALID_OPERATION', 'getSamplerParameter', 'invalid or deleted sampler');
      return null;
    }

    if (!(pname in sampler.parameters)) {
      this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'getSamplerParameter', 'invalid pname - ' + pname);
      return null;
    }

    return sampler.parameters[pname].value;
  }

  getShaderInfoLog(shader: GLShader): string | null {
    return '';
  }

  getShaderParameter(shader: GLShader, pname: GLenum): any {
    if (!shader) {
      this._webglError(GLC.INVALID_OPERATION, 'INVALID_OPERATION', 'getShaderParameter', 'invalid shader');
      return null;
    }

    switch (pname) {
      case GLC.SHADER_TYPE:
        return shader.type;
      case GLC.DELETE_STATUS:
        return shader.isDeleted(); // See deleteShader
      case GLC.COMPILE_STATUS: {
        // optimistically return success; client will abort on an actual error. we assume an error-free async workflow
        return true;
      }
      default: {
        this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'getShaderParameter', 'invalid pname - ' + pname);
        return null;
      }
    }
  }

  getShaderPrecisionFormat(shadertype: GLenum, precisiontype: GLenum): WebGLShaderPrecisionFormat | null {
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getShaderPrecisionFormat
    if (shadertype != GLC.FRAGMENT_SHADER && shadertype != GLC.VERTEX_SHADER) {
      // WebGL: INVALID_ENUM: getShaderPrecisionFormat: invalid shadertype
      this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'getShaderPrecisionFormat', 'invalid shadertype - ' + shadertype);
      return null;
    }

    if (
      GLC.LOW_FLOAT != precisiontype &&
      GLC.MEDIUM_FLOAT != precisiontype &&
      GLC.HIGH_FLOAT != precisiontype &&
      GLC.LOW_INT != precisiontype &&
      GLC.MEDIUM_INT != precisiontype &&
      GLC.HIGH_INT != precisiontype
    ) {
      // WebGL: INVALID_ENUM: getShaderPrecisionFormat: invalid precisiontype
      this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'getShaderPrecisionFormat', 'invalid precisiontype - ' + precisiontype);
      return null;
    }

    if (this._shaderPrecisionFormat[shadertype]) {
      const format = this._shaderPrecisionFormat[shadertype][precisiontype];
      if (format) {
        return format;
      }
    }

    this._webglError(GLC.INVALID_OPERATION, 'INVALID_OPERATION', 'getShaderPrecisionFormat', 'shader compiler is not supported');
    return null;
  }

  getShaderSource(shader: GLShader): string | null {
    return shader.source;
  }

  getSupportedExtensions(): string[] | null {
    return this._supportedExtensions;
  }

  getSyncParameter(sync: vGLSync, pname: GLenum): any {
    throw new Error('NOT YET IMPLEMENTED');
  }

  getTexParameter(target: GLenum, pname: GLenum): any {
    const texture = this._boundTextures[this._activeTexture][target];
    if (!texture) {
      // WebGL: INVALID_OPERATION: getTexParameter: no texture bound to target
      this._webglError(GLC.INVALID_OPERATION, 'INVALID_OPERATION', 'getTexParameter', 'no texture bound to target ' + target);
      return null;
    }
    if (pname in texture.parameters) {
      if (pname === GLC.TEXTURE_MAX_ANISOTROPY_EXT && !('EXT_texture_filter_anisotropic' in this._extensions)) {
        // WebGL: INVALID_ENUM: getTexParameter: invalid parameter name, EXT_texture_filter_anisotropic not enabled
        this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'getTexParameter', 'invalid parameter name, EXT_texture_filter_anisotropic not enabled');
        return null;
      }
      return texture.parameters[pname];
    } else {
      // WebGL: INVALID_ENUM: getTexParameter: invalid parameter name
      this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'getTexParameter', 'invalid parameter name ' + pname);
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
    this._parameters[target] = mode;
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
    return this._contextLost;
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
    if (this._parameters[GLC.LINE_WIDTH] != width) {
      this[TransferrableKeys.mutated]('lineWidth', arguments);
      this._parameters[GLC.LINE_WIDTH] = width;
    }
  }

  linkProgram(program: GLProgram): void {
    this[TransferrableKeys.mutated]('linkProgram', arguments);
    program.link(this);
  }

  pauseTransformFeedback(): void {
    this[TransferrableKeys.mutated]('pauseTransformFeedback', []);
    this._parameters[GLC.TRANSFORM_FEEDBACK_PAUSED] = true;
  }

  pixelStorei(pname: GLenum, param: GLint | GLboolean): void {
    if (this._parameters[pname] != param) {
      this[TransferrableKeys.mutated]('pixelStorei', arguments);
      this._parameters[pname] = param;
    }
  }

  polygonOffset(factor: GLfloat, units: GLfloat): void {
    this[TransferrableKeys.mutated]('polygonOffset', arguments);
    this._parameters[GLC.POLYGON_OFFSET_FACTOR] = factor;
    this._parameters[GLC.POLYGON_OFFSET_UNITS] = units;
  }

  readBuffer(src: GLenum): void {
    this[TransferrableKeys.mutated]('readBuffer', arguments);
    this._parameters[GLC.READ_BUFFER] = src;
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
    this._parameters[GLC.TRANSFORM_FEEDBACK_PAUSED] = false;
  }

  sampleCoverage(value: GLclampf, invert: GLboolean): void {
    this[TransferrableKeys.mutated]('sampleCoverage', arguments);
    this._parameters[GLC.SAMPLE_COVERAGE_VALUE] = value;
    this._parameters[GLC.SAMPLE_COVERAGE_INVERT] = invert;
  }

  samplerParameterf(sampler: vGLSampler, pname: GLenum, param: GLfloat): void {
    if (this._samplerParameter(sampler, pname, param, 'samplerParameterf')) {
      this[TransferrableKeys.mutated]('samplerParameterf', arguments);
    }
  }

  samplerParameteri(sampler: vGLSampler, pname: GLenum, param: GLint): void {
    if (this._samplerParameter(sampler, pname, param, 'samplerParameteri')) {
      this[TransferrableKeys.mutated]('samplerParameteri', arguments);
    }
  }

  scissor(x: GLint, y: GLint, width: GLsizei, height: GLsizei): void {
    this[TransferrableKeys.mutated]('scissor', arguments);
    this._parameters[GLC.SCISSOR_BOX] = [x, y, width, height];
  }

  shaderSource(shader: GLShader, source: string): void {
    this[TransferrableKeys.mutated]('shaderSource', arguments);
    shader.compile(this, source);
  }

  stencilFunc(func: GLenum, ref: GLint, mask: GLuint): void {
    this[TransferrableKeys.mutated]('stencilFunc', arguments);
    this._parameters[GLC.STENCIL_FUNC] = func;
    this._parameters[GLC.STENCIL_REF] = ref;
    this._parameters[GLC.STENCIL_VALUE_MASK] = mask;

    this._parameters[GLC.STENCIL_BACK_FUNC] = func;
    this._parameters[GLC.STENCIL_BACK_REF] = ref;
    this._parameters[GLC.STENCIL_BACK_VALUE_MASK] = mask;
  }

  stencilFuncSeparate(face: GLenum, func: GLenum, ref: GLint, mask: GLuint): void {
    if (face != GLC.FRONT && face != GLC.BACK && face != GLC.FRONT_AND_BACK) {
      this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'stencilFuncSeparate', 'invalid face ' + face);
      return;
    }

    this[TransferrableKeys.mutated]('stencilFuncSeparate', arguments);

    switch (face) {
      case GLC.FRONT: {
        this._parameters[GLC.STENCIL_FUNC] = func;
        this._parameters[GLC.STENCIL_REF] = ref;
        this._parameters[GLC.STENCIL_VALUE_MASK] = mask;
        break;
      }
      case GLC.BACK: {
        this._parameters[GLC.STENCIL_BACK_FUNC] = func;
        this._parameters[GLC.STENCIL_BACK_REF] = ref;
        this._parameters[GLC.STENCIL_BACK_VALUE_MASK] = mask;
        break;
      }
      case GLC.FRONT_AND_BACK: {
        this._parameters[GLC.STENCIL_FUNC] = func;
        this._parameters[GLC.STENCIL_REF] = ref;
        this._parameters[GLC.STENCIL_VALUE_MASK] = mask;

        this._parameters[GLC.STENCIL_BACK_FUNC] = func;
        this._parameters[GLC.STENCIL_BACK_REF] = ref;
        this._parameters[GLC.STENCIL_BACK_VALUE_MASK] = mask;
        break;
      }
    }
  }

  stencilMask(mask: GLuint): void {
    this[TransferrableKeys.mutated]('stencilMask', arguments);
    this._parameters[GLC.STENCIL_BACK_WRITEMASK] = mask;
    this._parameters[GLC.STENCIL_WRITEMASK] = mask;
  }

  stencilMaskSeparate(face: GLenum, mask: GLuint): void {
    if (face != GLC.FRONT && face != GLC.BACK && face != GLC.FRONT_AND_BACK) {
      this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'stencilMaskSeparate', 'invalid face ' + face);
      return;
    }

    this[TransferrableKeys.mutated]('stencilMaskSeparate', arguments);

    switch (face) {
      case GLC.FRONT: {
        this._parameters[GLC.STENCIL_WRITEMASK] = mask;
        break;
      }
      case GLC.BACK: {
        this._parameters[GLC.STENCIL_BACK_WRITEMASK] = mask;
        break;
      }
      case GLC.FRONT_AND_BACK: {
        this._parameters[GLC.STENCIL_BACK_WRITEMASK] = mask;
        this._parameters[GLC.STENCIL_WRITEMASK] = mask;
        break;
      }
    }
  }

  stencilOp(fail: GLenum, zfail: GLenum, zpass: GLenum): void {
    this[TransferrableKeys.mutated]('stencilOp', arguments);

    this._parameters[GLC.STENCIL_FAIL] = fail;
    this._parameters[GLC.STENCIL_PASS_DEPTH_FAIL] = zfail;
    this._parameters[GLC.STENCIL_PASS_DEPTH_PASS] = zpass;

    this._parameters[GLC.STENCIL_BACK_FAIL] = fail;
    this._parameters[GLC.STENCIL_BACK_PASS_DEPTH_FAIL] = zfail;
    this._parameters[GLC.STENCIL_BACK_PASS_DEPTH_PASS] = zpass;
  }

  stencilOpSeparate(face: GLenum, fail: GLenum, zfail: GLenum, zpass: GLenum): void {
    if (face != GLC.FRONT && face != GLC.BACK && face != GLC.FRONT_AND_BACK) {
      this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', 'stencilOpSeparate', 'invalid face ' + face);
      return;
    }

    this[TransferrableKeys.mutated]('stencilOpSeparate', arguments);

    switch (face) {
      case GLC.FRONT: {
        this._parameters[GLC.STENCIL_FAIL] = fail;
        this._parameters[GLC.STENCIL_PASS_DEPTH_FAIL] = zfail;
        this._parameters[GLC.STENCIL_PASS_DEPTH_PASS] = zpass;
        break;
      }
      case GLC.BACK: {
        this._parameters[GLC.STENCIL_BACK_FAIL] = fail;
        this._parameters[GLC.STENCIL_BACK_PASS_DEPTH_FAIL] = zfail;
        this._parameters[GLC.STENCIL_BACK_PASS_DEPTH_PASS] = zpass;
        break;
      }
      case GLC.FRONT_AND_BACK: {
        this._parameters[GLC.STENCIL_FAIL] = fail;
        this._parameters[GLC.STENCIL_PASS_DEPTH_FAIL] = zfail;
        this._parameters[GLC.STENCIL_PASS_DEPTH_PASS] = zpass;

        this._parameters[GLC.STENCIL_BACK_FAIL] = fail;
        this._parameters[GLC.STENCIL_BACK_PASS_DEPTH_FAIL] = zfail;
        this._parameters[GLC.STENCIL_BACK_PASS_DEPTH_PASS] = zpass;
        break;
      }
    }
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
    this._parameters[GLC.VIEWPORT] = [x, y, width, height];
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
    parameterIndex: number,
  ): boolean {
    if (candidate != null) {
      if (!validator(candidate)) {
        throw new Error(`Failed to execute '${operation}' on 'WebGL2RenderingContext': parameter ${parameterIndex} is not of type '${expectedType}'.`);
      }

      if (candidate.isDeleted()) {
        // WebGL: INVALID_OPERATION: bindBuffer: attempt to use a deleted object
        this._webglError(GLC.INVALID_OPERATION, 'INVALID_OPERATION', operation, 'attempt to use a deleted object');
        return false;
      }
    }
    return true;
  }

  private _getBoundBuffer(target: GLenum): vGLBuffer | null {
    switch (target) {
      case GLC.ARRAY_BUFFER:
      case GLC.ELEMENT_ARRAY_BUFFER:
      case GLC.COPY_READ_BUFFER:
      case GLC.COPY_WRITE_BUFFER:
      case GLC.TRANSFORM_FEEDBACK_BUFFER:
      case GLC.UNIFORM_BUFFER:
      case GLC.PIXEL_PACK_BUFFER:
      case GLC.PIXEL_UNPACK_BUFFER:
      case GLC.FRAMEBUFFER:
      case GLC.RENDERBUFFER:
      case GLC.DRAW_FRAMEBUFFER:
      case GLC.READ_FRAMEBUFFER:
        return this._buffers[target] || null;
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

    for (const indexedBuffersKey in this._indexedBuffers) {
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
      this._webglError(GLC.INVALID_OPERATION, 'INVALID_OPERATION', operation, 'no texture bound to target ' + target);
      return false;
    }

    const parameter = texture.parameters[pname];

    if (!parameter) {
      // WebGL: INVALID_ENUM: texParameterf: invalid parameter name
      this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', operation, 'invalid parameter name ' + pname);
      return false;
    }

    if (parameter.readonly) {
      return false; // Parameter marked as read only, skip
    }

    switch (pname) {
      case GLC.TEXTURE_MAG_FILTER:
      case GLC.TEXTURE_MIN_FILTER:
      case GLC.TEXTURE_WRAP_S:
      case GLC.TEXTURE_WRAP_T:
      case GLC.TEXTURE_WRAP_R:
      case GLC.TEXTURE_COMPARE_FUNC:
      case GLC.TEXTURE_COMPARE_MODE: {
        if (!parameter.allowed.includes(param)) {
          this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', operation, 'Texture param not recognized. Invalid parameter ' + param);
          return false;
        }
        break;
      }
      case GLC.TEXTURE_BASE_LEVEL:
      case GLC.TEXTURE_MAX_LEVEL: {
        if (param < 0) {
          // GL_INVALID_VALUE: Level of detail outside of range.
          // GL_INVALID_VALUE: Base level must be at least 0.
          this._webglError(GLC.INVALID_VALUE, 'INVALID_VALUE', operation, 'Level must be at least 0. Value: ' + param);
          return false;
        }
        break;
      }
      case GLC.TEXTURE_MAX_ANISOTROPY_EXT: {
        if (!('EXT_texture_filter_anisotropic' in this._extensions)) {
          // WebGL: INVALID_ENUM: texParameter: invalid parameter, EXT_texture_filter_anisotropic not enabled
          this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', operation, 'invalid parameter, EXT_texture_filter_anisotropic not enabled');
          return false;
        }
        if (param <= 0) {
          // GL_INVALID_VALUE: Parameter outside of bounds.
          this._webglError(GLC.INVALID_VALUE, 'INVALID_VALUE', operation, 'Parameter outside of bounds. Value: ' + param);
          return false;
        }
        break;
      }
    }

    parameter.value = param;
    return true;
  }

  private _samplerParameter(sampler: vGLSampler, pname: GLenum, param: GLfloat | GLint, operation: string): boolean {
    if (!sampler || sampler.isDeleted()) {
      this._webglError(GLC.INVALID_OPERATION, 'INVALID_OPERATION', operation, 'invalid or deleted sampler');
      return false;
    }

    const parameter = sampler.parameters[pname];
    if (!parameter) {
      this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', operation, 'invalid parameter name ' + pname);
      return false;
    }

    if (parameter.allowed && !parameter.allowed.includes(param)) {
      this._webglError(GLC.INVALID_ENUM, 'INVALID_ENUM', operation, 'Sampler param not recognized. Invalid parameter ' + param);
      return false;
    }

    parameter.value = param;
    return true;
  }

  private initializeContextLostHandlers() {
    const context = this;
    this.canvas.addEventListener('webglcontextlost', () => {
      // TODO: Should polyfill ignore all operations in case context is lost?
      context._contextLost = true;
      context._webglError(GLC.CONTEXT_LOST_WEBGL, 'CONTEXT_LOST_WEBGL', '', 'CONTEXT_LOST_WEBGL');
    });

    this.canvas.addEventListener('webglcontextrestored', () => {
      context._contextLost = false;
      if (context._error == GLC.CONTEXT_LOST_WEBGL) {
        context._error = GLC.NO_ERROR;
      }
    });
  }

  private initializeParameters(type: CONTEXT_TYPE) {
    const required = type == 'webgl' ? WebGLRenderingContextPolyfill.WEBGL_REQUIRED_PARAMS : WebGLRenderingContextPolyfill.WEBGL2_REQUIRED_PARAMS;

    required
      .filter((value) => !(value in this._parameters))
      .forEach((parameter) => {
        callFunction(this.canvas.ownerDocument as Document, this, 'getParameter', [parameter])
          .then((result) => {
            this._parameters[parameter] = result;
          })
          .catch((reason) => {
            console.warn(`Failed to get WebGL parameter ${parameter}`, reason);
          });
      });
  }

  private initializeSupportedExtensions() {
    if (this._supportedExtensions.length == 0) {
      callFunction(this.canvas.ownerDocument as Document, this, 'getSupportedExtensions', [])
        .then((result) => this._supportedExtensions.push(...result))
        .catch((reason) => {
          console.warn('Failed to get WebGL supported extensions', reason);
        });
    }
  }

  private initializeContextAttributes(contextAttributes: WebGLContextAttributes | undefined) {
    if (!contextAttributes) {
      callFunction(this.canvas.ownerDocument as Document, this, 'getContextAttributes', [])
        .then((result) => (this._contextAttributes = result))
        .catch((reason) => {
          console.warn('Failed to get WebGL context attributes', reason);
        });
    } else {
      this._contextAttributes = contextAttributes;
    }
  }

  private fetchParameterWithDefaultValue(param: number, defaultValue: any) {
    this._parameters[param] = defaultValue; // default value
    callFunction(this.canvas.ownerDocument as Document, this, 'getParameter', [param])
      .then((result) => {
        this._parameters[param] = result;
      })
      .catch((reason) => {
        console.warn(`Failed to get WebGL parameter ${param}`, reason);
      });
  }

  private static readonly WEBGL_REQUIRED_PARAMS: number[] = [
    GLC.VIEWPORT,
    GLC.VERSION,
    GLC.RENDERER,
    GLC.VENDOR,
    GLC.SHADING_LANGUAGE_VERSION,
    GLC.RED_BITS,
    GLC.GREEN_BITS,
    GLC.BLUE_BITS,
    GLC.ALPHA_BITS,
    GLC.DEPTH_BITS,
    GLC.STENCIL_BITS,
    GLC.SUBPIXEL_BITS,
    GLC.LINE_WIDTH,
    GLC.FRONT_FACE,
    GLC.CULL_FACE_MODE,
    GLC.IMPLEMENTATION_COLOR_READ_FORMAT,
    GLC.IMPLEMENTATION_COLOR_READ_TYPE,
    GLC.PACK_ALIGNMENT,
    GLC.UNPACK_ALIGNMENT,
    GLC.UNPACK_FLIP_Y_WEBGL,
    GLC.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
    GLC.UNPACK_COLORSPACE_CONVERSION_WEBGL,
    GLC.GENERATE_MIPMAP_HINT,
    GLC.SCISSOR_BOX,
    GLC.SAMPLE_COVERAGE_VALUE,
    GLC.SAMPLE_COVERAGE_INVERT,
    GLC.SAMPLES,
    GLC.DEPTH_WRITEMASK,
    GLC.DEPTH_CLEAR_VALUE,
    GLC.DEPTH_FUNC,
    GLC.DEPTH_RANGE,
    GLC.POLYGON_OFFSET_FACTOR,
    GLC.POLYGON_OFFSET_UNITS,
    GLC.COLOR_CLEAR_VALUE,
    GLC.COLOR_WRITEMASK,
    GLC.BLEND_COLOR,
    GLC.BLEND_DST_ALPHA,
    GLC.BLEND_DST_RGB,
    GLC.BLEND_EQUATION,
    GLC.BLEND_EQUATION_ALPHA,
    GLC.BLEND_EQUATION_RGB,
    GLC.BLEND_SRC_ALPHA,
    GLC.BLEND_SRC_RGB,

    GLC.STENCIL_WRITEMASK,
    GLC.STENCIL_BACK_WRITEMASK,

    GLC.STENCIL_FUNC,
    GLC.STENCIL_VALUE_MASK,
    GLC.STENCIL_REF,
    GLC.STENCIL_BACK_FUNC,
    GLC.STENCIL_BACK_VALUE_MASK,
    GLC.STENCIL_BACK_REF,

    GLC.STENCIL_CLEAR_VALUE,

    GLC.STENCIL_FAIL,
    GLC.STENCIL_PASS_DEPTH_FAIL,
    GLC.STENCIL_PASS_DEPTH_PASS,
    GLC.STENCIL_BACK_FAIL,
    GLC.STENCIL_BACK_PASS_DEPTH_FAIL,
    GLC.STENCIL_BACK_PASS_DEPTH_PASS,

    GLC.MAX_RENDERBUFFER_SIZE,
    GLC.MAX_COMBINED_TEXTURE_IMAGE_UNITS,
    GLC.MAX_CUBE_MAP_TEXTURE_SIZE,
    GLC.MAX_FRAGMENT_UNIFORM_VECTORS,
    GLC.MAX_TEXTURE_IMAGE_UNITS,
    GLC.MAX_TEXTURE_SIZE,
    GLC.MAX_VARYING_VECTORS,
    GLC.MAX_VERTEX_ATTRIBS,
    GLC.MAX_VERTEX_TEXTURE_IMAGE_UNITS,
    GLC.MAX_VERTEX_UNIFORM_VECTORS,
    GLC.ALIASED_LINE_WIDTH_RANGE,
    GLC.ALIASED_POINT_SIZE_RANGE,
    GLC.MAX_VIEWPORT_DIMS,
  ];

  private static readonly WEBGL2_REQUIRED_PARAMS: number[] = [
    ...WebGLRenderingContextPolyfill.WEBGL_REQUIRED_PARAMS,
    GLC.PACK_ROW_LENGTH,
    GLC.PACK_SKIP_PIXELS,
    GLC.PACK_SKIP_ROWS,
    GLC.UNPACK_ROW_LENGTH,
    GLC.UNPACK_IMAGE_HEIGHT,
    GLC.UNPACK_SKIP_PIXELS,
    GLC.UNPACK_SKIP_ROWS,
    GLC.UNPACK_SKIP_IMAGES,
    GLC.FRAGMENT_SHADER_DERIVATIVE_HINT,
    GLC.READ_BUFFER,

    GLC.MAX_VERTEX_UNIFORM_COMPONENTS,
    GLC.MAX_VERTEX_UNIFORM_BLOCKS,
    GLC.MAX_VERTEX_OUTPUT_COMPONENTS,
    GLC.MAX_VARYING_COMPONENTS,
    GLC.MAX_FRAGMENT_UNIFORM_COMPONENTS,
    GLC.MAX_FRAGMENT_UNIFORM_BLOCKS,
    GLC.MAX_FRAGMENT_INPUT_COMPONENTS,
    GLC.MIN_PROGRAM_TEXEL_OFFSET,
    GLC.MAX_PROGRAM_TEXEL_OFFSET,
    GLC.MAX_DRAW_BUFFERS,
    GLC.MAX_COLOR_ATTACHMENTS,
    GLC.MAX_SAMPLES,
    GLC.MAX_3D_TEXTURE_SIZE,
    GLC.MAX_ARRAY_TEXTURE_LAYERS,
    GLC.MAX_CLIENT_WAIT_TIMEOUT_WEBGL,
    GLC.MAX_TEXTURE_LOD_BIAS,
    GLC.MAX_UNIFORM_BUFFER_BINDINGS,
    GLC.MAX_UNIFORM_BLOCK_SIZE,
    GLC.UNIFORM_BUFFER_OFFSET_ALIGNMENT,
    GLC.MAX_COMBINED_UNIFORM_BLOCKS,
    GLC.MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS,
    GLC.MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS,
    GLC.MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS,
    GLC.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS,
    GLC.MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS,
    GLC.MAX_ELEMENT_INDEX,
    GLC.MAX_ELEMENTS_INDICES,
    GLC.MAX_ELEMENTS_VERTICES,
    GLC.MAX_SERVER_WAIT_TIMEOUT,
  ];
}
