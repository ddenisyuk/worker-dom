import {HTMLCanvasElement} from "../dom/HTMLCanvasElement";
import {GLConstants} from "./gl/GLConstants";
import {TransferrableKeys} from "../../transfer/TransferrableKeys";
import {TransferrableObject} from "../worker-thread";
import {transfer} from "../MutationTransfer";
import {Document} from "../dom/Document";
import {TransferrableMutationType, TransferrableObjectType} from "../../transfer/TransferrableMutation";
import {vGLShader} from "./gl/vGLShader";
import {vGLProgram} from "./gl/vGLProgram";
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
} from "./gl/TransferrableGLObjectTypes";
import {store} from "../strings";
import {serializeTransferrableObject} from "../serializeTransferrableObject";
import {
  ANGLEInstancedArrays,
  EXTBlendMinmax,
  EXTColorBufferHalfFloat,
  EXTDisjointTimerQuery,
  EXTSRGB,
  EXTTextureCompressionBptc,
  EXTTextureCompressionRgtc,
  EXTTextureFilterAnisotropic,
  EXTTextureNorm16,
  GenericExtension,
  KHRParallelShaderCompile,
  OESDrawBuffersIndexed,
  OESStandardDerivatives,
  OESTextureHalfFloat,
  OESVertexArrayObject,
  OVRMultiview2,
  WEBGLColorBufferFloat,
  WEBGLCompressedTextureAstc,
  WEBGLCompressedTextureEtc,
  WEBGLCompressedTextureEtc1,
  WEBGLCompressedTexturePvrtc,
  WEBGLCompressedTextureS3tc,
  WEBGLCompressedTextureS3tcSrgb,
  WEBGLDebugRendererInfo,
  WEBGLDebugShaders,
  WEBGLDepthTexture,
  WEBGLDrawBuffers,
  WEBGLLoseContext,
  WEBGLMultiDraw
} from "./gl/GLExtension";
import {callFunction} from "../function";

export class WebGLRenderingContextPolyfill extends GLConstants implements WebGL2RenderingContext, TransferrableObject {

  private static _objectIndex = 1000; // TODO: id must be unique across all thread, see OffscreenCanvasRenderingContext2DPolyfill.objectIndex

  public readonly id: number;
  public readonly canvas: HTMLCanvasElement | any;
  public readonly drawingBufferHeight: GLsizei;
  public readonly drawingBufferWidth: GLsizei;
  public readonly drawingBufferColorSpace: PredefinedColorSpace = "srgb";

  private readonly requiredParams: number[] = [this.VERSION, this.RENDERER, this.VENDOR, this.MAX_TEXTURE_IMAGE_UNITS, this.MAX_TEXTURE_SIZE, this.MAX_VARYING_VECTORS];

  private readonly _serializedAsTransferrableObject: number[];

  private _parameters: { [key: number]: any };
  private _extensions: string[] | null = null;
  private _contextAttributes: WebGLContextAttributes | null = null;
  private readonly _buffers: { [key: string]: vGLBuffer | null } = {
    arrayBuffer: null,
    elementArrayBuffer: null,
    copyReadBuffer: null,
    copyWriteBuffer: null,
    transformFeedbackBuffer: null,
    uniformBuffer: null,
    pixelPackBuffer: null,
    pixelUnpackBuffer: null,
    framebuffer: null,
    renderbuffer: null,
    drawFramebuffer: null,
    readFramebuffer: null,
  };
  private readonly _bindings: { [key: string]: TransferrableGLObject | null } = {
    texture2D: null,
    program: null,
    vertexArray: null,
    transformFeedback: null,
    sampler: null
  };
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/isEnabled
  // By default, all capabilities except gl.DITHER are disabled.
  private readonly _capabilities: { [key: GLenum]: boolean } = {
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

  constructor(id: number, canvas: HTMLCanvasElement, contextAttributes?: WebGLContextAttributes | null) {
    super();
    this.id = id;
    this._serializedAsTransferrableObject = [TransferrableObjectType.TransferObject, this.id];
    this.canvas = canvas;

    this.drawingBufferHeight = canvas.height;
    this.drawingBufferWidth = canvas.width;

    this._parameters = {};
    this._extensions = [];
    this._contextAttributes = contextAttributes || null;

    this.requiredParams.forEach(parameter => {
      callFunction(this.canvas.ownerDocument as Document, this, "getParameter", [parameter])
        .then(result => this._parameters[parameter] = result);
    });

    callFunction(this.canvas.ownerDocument as Document, this, "getSupportedExtensions", [])
      .then(result => this._extensions = result);

    callFunction(this.canvas.ownerDocument as Document, this, "getContextAttributes", [])
      .then(result => this._contextAttributes = result);
  }

  activeTexture(texture: GLenum): void {
    this[TransferrableKeys.mutated]('activeTexture', [...arguments]);
  }

  attachShader(program: vGLProgram, shader: vGLShader): void {
    this[TransferrableKeys.mutated]('attachShader', [...arguments]);
    program.attachShader(shader);
  }

  beginQuery(target: GLenum, query: vGLQuery): void {
    this[TransferrableKeys.mutated]('beginQuery', [...arguments]);
  }

  beginTransformFeedback(primitiveMode: GLenum): void {
    this[TransferrableKeys.mutated]('beginTransformFeedback', [...arguments]);
  }

  bindAttribLocation(program: vGLProgram, index: GLuint, name: string): void {
    this[TransferrableKeys.mutated]('bindAttribLocation', [...arguments]);
  }

  bindBuffer(target: GLenum, buffer: vGLBuffer | null): void {
    this[TransferrableKeys.mutated]('bindBuffer', [...arguments]);
    if (buffer) {
      buffer.target = target;
    }
    const currentBinding = this._getBindedBuffer(target);
    if (currentBinding && currentBinding !== buffer) {
      currentBinding.target = 0;
    }
    this._bindBuffer(target, buffer);
  }

  bindBufferBase(target: GLenum, index: GLuint, buffer: vGLBuffer | null): void {
    this[TransferrableKeys.mutated]('bindBufferBase', [...arguments]);
  }

  bindBufferRange(target: GLenum, index: GLuint, buffer: vGLBuffer | null, offset: GLintptr, size: GLsizeiptr): void {
    this[TransferrableKeys.mutated]('bindBufferRange', [...arguments]);
  }

  bindFramebuffer(target: GLenum, framebuffer: vGLFramebuffer | null): void {
    this[TransferrableKeys.mutated]('bindFramebuffer', [...arguments]);

    switch (target) {
      case this.FRAMEBUFFER:
        this._buffers.framebuffer = framebuffer;
        break;
      case this.DRAW_FRAMEBUFFER:
        this._buffers.drawFramebuffer = framebuffer;
        break;
      case this.READ_FRAMEBUFFER:
        this._buffers.readFramebuffer = framebuffer;
        break;
      default:
        throw `Unexpected target: ${target}`;
    }
  }

  bindRenderbuffer(target: GLenum, renderbuffer: vGLRenderbuffer | null): void {
    switch (target) {
      case this.RENDERBUFFER:
        this[TransferrableKeys.mutated]('bindRenderbuffer', [...arguments]);
        this._buffers.renderbuffer = renderbuffer;
        break;
      default:
        throw `Unexpected target: ${target}`;
    }
  }

  bindSampler(unit: GLuint, sampler: vGLSampler | null): void {
    this[TransferrableKeys.mutated]('bindSampler', [...arguments]);
    this._bindings.sampler = sampler;
  }

  bindTexture(target: GLenum, texture: vGLTexture | null): void {
    switch (target) {
      case this.TEXTURE_2D: {
        this[TransferrableKeys.mutated]('bindTexture', [...arguments]);
        this._bindings.texture2D = texture;
        break;
      }
      case this.TEXTURE_CUBE_MAP:
      case this.TEXTURE_2D_ARRAY:
      case this.TEXTURE_3D:
      default:
        throw `Unexpected texture target: ${target}`;
    }
  }

  bindTransformFeedback(target: GLenum, tf: vGLTransformFeedback | null): void {
    switch (target) {
      case this.TRANSFORM_FEEDBACK:
        this[TransferrableKeys.mutated]('bindTransformFeedback', [...arguments]);
        this._bindings.transformFeedback = tf;
        break;
      default:
        throw `Unexpected target: ${target}`;
    }
  }

  bindVertexArray(array: vGLVertexArrayObject | null): void {
    this[TransferrableKeys.mutated]('bindVertexArray', [...arguments]);
    this._bindings.vertexArray = array;
  }

  blendColor(red: GLclampf, green: GLclampf, blue: GLclampf, alpha: GLclampf): void {
    this[TransferrableKeys.mutated]('blendColor', [...arguments]);
  }

  blendEquation(mode: GLenum): void {
    this[TransferrableKeys.mutated]('blendEquation', [...arguments]);
  }

  blendEquationSeparate(modeRGB: GLenum, modeAlpha: GLenum): void {
    this[TransferrableKeys.mutated]('blendEquationSeparate', [...arguments]);
  }

  blendFunc(sfactor: GLenum, dfactor: GLenum): void {
    this[TransferrableKeys.mutated]('blendFunc', [...arguments]);
  }

  blendFuncSeparate(srcRGB: GLenum, dstRGB: GLenum, srcAlpha: GLenum, dstAlpha: GLenum): void {
    this[TransferrableKeys.mutated]('blendFuncSeparate', [...arguments]);
  }

  blitFramebuffer(srcX0: GLint, srcY0: GLint, srcX1: GLint, srcY1: GLint, dstX0: GLint, dstY0: GLint, dstX1: GLint, dstY1: GLint, mask: GLbitfield, filter: GLenum): void {
    this[TransferrableKeys.mutated]('blitFramebuffer', [...arguments]);
  }

  bufferData(target: GLenum, size: GLsizeiptr, usage: GLenum): void;
  bufferData(target: GLenum, srcData: BufferSource | null, usage: GLenum): void;
  bufferData(target: GLenum, srcData: ArrayBufferView, usage: GLenum, srcOffset: GLuint, length?: GLuint): void;
  bufferData(target: GLenum, size: GLsizeiptr | BufferSource | null | ArrayBufferView, usage: GLenum, srcOffset?: GLuint, length?: GLuint): void {
    this[TransferrableKeys.mutated]('bufferData', [...arguments]);

    const buffer = this._getBindedBuffer(target);
    if (buffer) {
      if (size) {
        if (typeof size === 'number') {
          buffer.size = size;
        } else { // BufferSource or ArrayBufferView
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
    this[TransferrableKeys.mutated]('bufferSubData', [...arguments]);
  }

  checkFramebufferStatus(target: GLenum): GLenum {
    return this.FRAMEBUFFER_COMPLETE; // hope
  }

  clear(mask: GLbitfield): void {
    this[TransferrableKeys.mutated]('clear', [...arguments]);
  }

  clearBufferfi(buffer: GLenum, drawbuffer: GLint, depth: GLfloat, stencil: GLint): void {
    this[TransferrableKeys.mutated]('clearBufferfi', [...arguments]);
  }

  clearBufferfv(buffer: GLenum, drawbuffer: GLint, values: Float32List, srcOffset?: GLuint): void;
  clearBufferfv(buffer: GLenum, drawbuffer: GLint, values: Iterable<GLfloat>, srcOffset?: GLuint): void;
  clearBufferfv(buffer: GLenum, drawbuffer: GLint, values: Float32List | Iterable<GLfloat>, srcOffset?: GLuint): void {
    this[TransferrableKeys.mutated]('clearBufferfv', [...arguments]);
  }

  clearBufferiv(buffer: GLenum, drawbuffer: GLint, values: Int32List, srcOffset?: GLuint): void;
  clearBufferiv(buffer: GLenum, drawbuffer: GLint, values: Iterable<GLint>, srcOffset?: GLuint): void;
  clearBufferiv(buffer: GLenum, drawbuffer: GLint, values: Int32List | Iterable<GLint>, srcOffset?: GLuint): void {
    this[TransferrableKeys.mutated]('clearBufferiv', [...arguments]);
  }

  clearBufferuiv(buffer: GLenum, drawbuffer: GLint, values: Uint32List, srcOffset?: GLuint): void;
  clearBufferuiv(buffer: GLenum, drawbuffer: GLint, values: Iterable<GLuint>, srcOffset?: GLuint): void;
  clearBufferuiv(buffer: GLenum, drawbuffer: GLint, values: Uint32List | Iterable<GLuint>, srcOffset?: GLuint): void {
    this[TransferrableKeys.mutated]('clearBufferuiv', [...arguments]);
  }

  clearColor(red: GLclampf, green: GLclampf, blue: GLclampf, alpha: GLclampf): void {
    this[TransferrableKeys.mutated]('clearColor', [...arguments]);
  }

  clearDepth(depth: GLclampf): void {
    this[TransferrableKeys.mutated]('clearDepth', [...arguments]);
  }

  clearStencil(s: GLint): void {
    this[TransferrableKeys.mutated]('clearStencil', [...arguments]);
  }

  clientWaitSync(sync: vGLSync, flags: GLbitfield, timeout: GLuint64): GLenum {
    throw new Error('NOT IMPLEMENTED');
  }

  colorMask(red: GLboolean, green: GLboolean, blue: GLboolean, alpha: GLboolean): void {
    this[TransferrableKeys.mutated]('colorMask', [...arguments]);
  }

  compileShader(shader: vGLShader): void {
    this[TransferrableKeys.mutated]('compileShader', [...arguments]);
    shader.compiled = true;
  }

  compressedTexImage2D(target: GLenum, level: GLint, internalformat: GLenum, width: GLsizei, height: GLsizei, border: GLint, imageSize: GLsizei, offset: GLintptr): void;
  compressedTexImage2D(target: GLenum, level: GLint, internalformat: GLenum, width: GLsizei, height: GLsizei, border: GLint, srcData: ArrayBufferView, srcOffset?: GLuint, srcLengthOverride?: GLuint): void;
  compressedTexImage2D(target: GLenum, level: GLint, internalformat: GLenum, width: GLsizei, height: GLsizei, border: GLint, imageSize: GLsizei | ArrayBufferView, offset?: GLintptr | GLuint, srcLengthOverride?: GLuint): void {
    this[TransferrableKeys.mutated]('compressedTexImage2D', [...arguments]);
  }

  compressedTexImage3D(target: GLenum, level: GLint, internalformat: GLenum, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, imageSize: GLsizei, offset: GLintptr): void;
  compressedTexImage3D(target: GLenum, level: GLint, internalformat: GLenum, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, srcData: ArrayBufferView, srcOffset?: GLuint, srcLengthOverride?: GLuint): void;
  compressedTexImage3D(target: GLenum, level: GLint, internalformat: GLenum, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, imageSize: GLsizei | ArrayBufferView, offset?: GLintptr | GLuint, srcLengthOverride?: GLuint): void {
    this[TransferrableKeys.mutated]('compressedTexImage3D', [...arguments]);
  }


  compressedTexSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, imageSize: GLsizei, offset: GLintptr): void;
  compressedTexSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, srcData: ArrayBufferView, srcOffset?: GLuint, srcLengthOverride?: GLuint): void;
  compressedTexSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, imageSize: GLsizei | ArrayBufferView, offset?: GLintptr | GLuint, srcLengthOverride?: GLuint): void {
    this[TransferrableKeys.mutated]('compressedTexSubImage2D', [...arguments]);
  }

  compressedTexSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, imageSize: GLsizei, offset: GLintptr): void;
  compressedTexSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, srcData: ArrayBufferView, srcOffset?: GLuint, srcLengthOverride?: GLuint): void;
  compressedTexSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, imageSize: GLsizei | ArrayBufferView, offset?: GLintptr | GLuint, srcLengthOverride?: GLuint): void {
    this[TransferrableKeys.mutated]('compressedTexSubImage3D', [...arguments]);
  }

  copyBufferSubData(readTarget: GLenum, writeTarget: GLenum, readOffset: GLintptr, writeOffset: GLintptr, size: GLsizeiptr): void {
    this[TransferrableKeys.mutated]('copyBufferSubData', [...arguments]);
  }

  copyTexImage2D(target: GLenum, level: GLint, internalformat: GLenum, x: GLint, y: GLint, width: GLsizei, height: GLsizei, border: GLint): void {
    this[TransferrableKeys.mutated]('copyTexImage2D', [...arguments]);
  }

  copyTexSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, x: GLint, y: GLint, width: GLsizei, height: GLsizei): void {
    this[TransferrableKeys.mutated]('copyTexSubImage2D', [...arguments]);
  }

  copyTexSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, x: GLint, y: GLint, width: GLsizei, height: GLsizei): void {
    this[TransferrableKeys.mutated]('copyTexSubImage3D', [...arguments]);
  }

  createBuffer(): vGLBuffer | null {
    const bufferId = this.nextObjectId();
    this.createObjectReference(bufferId, 'createBuffer', []);
    return new vGLBuffer(bufferId);
  }

  createFramebuffer(): vGLFramebuffer | null {
    const framebufferId = this.nextObjectId();
    this.createObjectReference(framebufferId, 'createFramebuffer', []);
    return new vGLFramebuffer(framebufferId);
  }

  createProgram(): vGLProgram | null {
    const programId = this.nextObjectId();
    this.createObjectReference(programId, 'createProgram', []);
    return new vGLProgram(programId);
  }

  createQuery(): vGLQuery | null {
    const queryId = this.nextObjectId();
    this.createObjectReference(queryId, 'createQuery', []);
    return new vGLQuery(queryId);
  }

  createRenderbuffer(): vGLRenderbuffer | null {
    const renderbufferId = this.nextObjectId();
    this.createObjectReference(renderbufferId, 'createRenderbuffer', []);
    return new vGLRenderbuffer(renderbufferId);
  }

  createSampler(): vGLSampler | null {
    const samplerId = this.nextObjectId();
    this.createObjectReference(samplerId, 'createSampler', []);
    return new vGLSampler(samplerId);
  }

  createShader(type: GLenum): vGLShader | null {
    const shaderId = this.nextObjectId();
    this.createObjectReference(shaderId, 'createShader', [...arguments]);
    return new vGLShader(shaderId, type);
  }

  createTexture(): vGLTexture | null {
    const textureId = this.nextObjectId();
    this.createObjectReference(textureId, 'createTexture', []);
    return new vGLTexture(textureId);
  }

  createTransformFeedback(): vGLTransformFeedback | null {
    const textureId = this.nextObjectId();
    this.createObjectReference(textureId, 'createTransformFeedback', []);
    return new vGLTransformFeedback(textureId);
  }

  createVertexArray(): vGLVertexArrayObject | null {
    const vertexArrayId = this.nextObjectId();
    this.createObjectReference(vertexArrayId, 'createVertexArray', []);
    return new vGLVertexArrayObject(vertexArrayId);
  }

  cullFace(mode: GLenum): void {
    this[TransferrableKeys.mutated]('cullFace', [...arguments]);
  }

  deleteBuffer(buffer: vGLBuffer | null): void {
    if (!buffer || buffer.isDeleted()) return;
    this[TransferrableKeys.mutated]('deleteBuffer', [...arguments]);
    buffer.delete();

    if (buffer.target > 0 && this._getBindedBuffer(buffer.target) === buffer) {
      this._bindBuffer(buffer.target, null);
      buffer.target = 0;
    }
  }

  deleteFramebuffer(framebuffer: vGLFramebuffer | null): void {
    if (!framebuffer || framebuffer.isDeleted()) return;
    this[TransferrableKeys.mutated]('deleteFramebuffer', [...arguments]);
    framebuffer.delete();
    if (this._buffers.framebuffer === framebuffer) {
      this._buffers.framebuffer = null;
    }
  }

  deleteProgram(program: vGLProgram | null): void {
    if (!program || program.isDeleted()) return;
    this[TransferrableKeys.mutated]('deleteProgram', [...arguments]);
    program.delete();
    if (this._bindings.program === program) {
      this._bindings.program = null;
    }
  }

  deleteQuery(query: vGLQuery | null): void {
    if (!query || query.isDeleted()) return;
    this[TransferrableKeys.mutated]('deleteQuery', [...arguments]);
    query.delete();
  }

  deleteRenderbuffer(renderbuffer: vGLRenderbuffer | null): void {
    if (!renderbuffer || renderbuffer.isDeleted()) return;
    this[TransferrableKeys.mutated]('deleteRenderbuffer', [...arguments]);
    renderbuffer.delete();
    if (this._buffers.renderbuffer === renderbuffer) {
      this._buffers.renderbuffer = null;
    }
  }

  deleteSampler(sampler: vGLSampler | null): void {
    if (!sampler || sampler.isDeleted()) return;
    this[TransferrableKeys.mutated]('deleteSampler', [...arguments]);
    sampler.delete();
    if (this._bindings.sampler === sampler) {
      this._bindings.sampler = null;
    }
  }

  deleteShader(shader: vGLShader | null): void {
    if (!shader || shader.isDeleted()) return;
    this[TransferrableKeys.mutated]('deleteShader', [...arguments]);
    shader.delete();
  }

  deleteSync(sync: vGLSync | null): void {
    if (!sync || sync.isDeleted()) return;
    this[TransferrableKeys.mutated]('deleteSync', [...arguments]);
    sync.delete();
  }

  deleteTexture(texture: vGLTexture | null): void {
    if (!texture || texture.isDeleted()) return;
    this[TransferrableKeys.mutated]('deleteTexture', [...arguments]);
    texture.delete();
    if (this._bindings.texture2D === texture) {
      this._bindings.texture2D = null;
    }
  }

  deleteTransformFeedback(tf: vGLTransformFeedback | null): void {
    if (!tf || tf.isDeleted()) return;
    this[TransferrableKeys.mutated]('deleteTransformFeedback', [...arguments]);
    if (this._bindings.transformFeedback === tf) {
      this._bindings.transformFeedback = null;
    }
  }

  deleteVertexArray(vertexArray: vGLVertexArrayObject | null): void {
    if (!vertexArray || vertexArray.isDeleted()) return;
    this[TransferrableKeys.mutated]('deleteVertexArray', [...arguments]);
    vertexArray.delete();
    if (this._bindings.vertexArray === vertexArray) {
      this._bindings.vertexArray = null;
    }
  }

  depthFunc(func: GLenum): void {
    this[TransferrableKeys.mutated]('depthFunc', [...arguments]);
  }

  depthMask(flag: GLboolean): void {
    this[TransferrableKeys.mutated]('depthMask', [...arguments]);
  }

  depthRange(zNear: GLclampf, zFar: GLclampf): void {
    this[TransferrableKeys.mutated]('depthRange', [...arguments]);
  }

  detachShader(program: vGLProgram, shader: vGLShader): void {
    this[TransferrableKeys.mutated]('detachShader', [...arguments]);
    program.detachShader(shader, this);
  }

  disable(cap: GLenum): void {
    this[TransferrableKeys.mutated]('disable', [...arguments]);
    this._capabilities[cap] = false;
  }

  disableVertexAttribArray(index: GLuint): void {
    this[TransferrableKeys.mutated]('disableVertexAttribArray', [...arguments]);
  }

  drawArrays(mode: GLenum, first: GLint, count: GLsizei): void {
    this[TransferrableKeys.mutated]('drawArrays', [...arguments]);
  }

  drawArraysInstanced(mode: GLenum, first: GLint, count: GLsizei, instanceCount: GLsizei): void {
    this[TransferrableKeys.mutated]('drawArraysInstanced', [...arguments]);
  }

  drawBuffers(buffers: GLenum[]): void;
  drawBuffers(buffers: Iterable<GLenum>): void;
  drawBuffers(buffers: GLenum[] | Iterable<GLenum>): void {
    this[TransferrableKeys.mutated]('drawBuffers', [...arguments]);
  }

  drawElements(mode: GLenum, count: GLsizei, type: GLenum, offset: GLintptr): void {
    this[TransferrableKeys.mutated]('drawElements', [...arguments]);
  }

  drawElementsInstanced(mode: GLenum, count: GLsizei, type: GLenum, offset: GLintptr, instanceCount: GLsizei): void {
    this[TransferrableKeys.mutated]('drawElementsInstanced', [...arguments]);
  }

  drawRangeElements(mode: GLenum, start: GLuint, end: GLuint, count: GLsizei, type: GLenum, offset: GLintptr): void {
    this[TransferrableKeys.mutated]('drawRangeElements', [...arguments]);
  }

  enable(cap: GLenum): void {
    this[TransferrableKeys.mutated]('enable', [...arguments]);
    this._capabilities[cap] = true;
  }

  enableVertexAttribArray(index: GLuint): void {
    this[TransferrableKeys.mutated]('enableVertexAttribArray', [...arguments]);
  }

  endQuery(target: GLenum): void {
    this[TransferrableKeys.mutated]('endQuery', [...arguments]);
  }

  endTransformFeedback(): void {
    this[TransferrableKeys.mutated]('endTransformFeedback', []);
  }

  fenceSync(condition: GLenum, flags: GLbitfield): vGLSync | null {
    const syncId = this.nextObjectId();
    this.createObjectReference(syncId, 'fenceSync', [...arguments]);
    return new vGLSync(syncId);
  }

  finish(): void {
    this[TransferrableKeys.mutated]('finish', []);
  }

  flush(): void {
    this[TransferrableKeys.mutated]('flush', []);
  }

  framebufferRenderbuffer(target: GLenum, attachment: GLenum, renderbuffertarget: GLenum, renderbuffer: vGLRenderbuffer | null): void {
    this[TransferrableKeys.mutated]('framebufferRenderbuffer', [...arguments]);
  }

  framebufferTexture2D(target: GLenum, attachment: GLenum, textarget: GLenum, texture: vGLTexture | null, level: GLint): void {
    this[TransferrableKeys.mutated]('framebufferTexture2D', [...arguments]);
  }

  framebufferTextureLayer(target: GLenum, attachment: GLenum, texture: vGLTexture | null, level: GLint, layer: GLint): void {
    this[TransferrableKeys.mutated]('framebufferTextureLayer', [...arguments]);
  }

  frontFace(mode: GLenum): void {
    this[TransferrableKeys.mutated]('frontFace', [...arguments]);
  }

  generateMipmap(target: GLenum): void {
    this[TransferrableKeys.mutated]('generateMipmap', [...arguments]);
  }

  getActiveAttrib(program: vGLProgram, index: GLuint): vGLActiveInfo | null {
    return program.getActiveAttrib(index);
  }

  getActiveUniform(program: vGLProgram, index: GLuint): vGLActiveInfo | null {
    return program.getActiveUniform(index);
  }

  getActiveUniformBlockName(program: vGLProgram, uniformBlockIndex: GLuint): string | null {
    throw new Error('NOT YET IMPLEMENTED');
  }

  getActiveUniformBlockParameter(program: vGLProgram, uniformBlockIndex: GLuint, pname: GLenum): any {
    throw new Error('NOT YET IMPLEMENTED');
  }

  getActiveUniforms(program: vGLProgram, uniformIndices: GLuint[], pname: GLenum): any;
  getActiveUniforms(program: vGLProgram, uniformIndices: Iterable<GLuint>, pname: GLenum): any;
  getActiveUniforms(program: vGLProgram, uniformIndices: GLuint[] | Iterable<GLuint>, pname: GLenum): any {
    throw new Error('NOT YET IMPLEMENTED');
  }

  getAttachedShaders(program: vGLProgram): vGLShader[] | null {
    return program.shaders;
  }

  getAttribLocation(program: vGLProgram, name: string): number {
    const attr = program.getAttribute(name);
    if (attr) {
      return attr.location;
    }
    return -1;
  }

  getBufferParameter(target: GLenum, pname: GLenum): any {
    const buffer = this._getBindedBuffer(target);
    if (buffer === null) {
      return null;
    }

    switch (pname) { // see #bufferData
      case this.BUFFER_SIZE: { //Returns a GLint indicating the size of the buffer in bytes.
        return buffer.size;
      }
      case this.BUFFER_USAGE: {
        return buffer.usage;
      }
      default:
        throw `Unexpected target: ${pname}`;
    }
  }

  getBufferSubData(target: GLenum, srcByteOffset: GLintptr, dstBuffer: ArrayBufferView, dstOffset?: GLuint, length?: GLuint): void {
    throw new Error('NOT IMPLEMENTED');
  }

  getContextAttributes(): WebGLContextAttributes | null {
    return this._contextAttributes;
  }

  getError(): GLenum {
    return this.NO_ERROR;
  }

  getExtension(name: string): any {
    if (!this._extensions || !this._extensions.includes(name)) {
      return null;
    }
    const id = this.nextObjectId();
    this.createObjectReference(id, 'getExtension', [...arguments]);

    // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API#extensions
    switch (name) {
      case 'ANGLE_instanced_arrays':
        return new ANGLEInstancedArrays(id, this);
      case 'EXT_blend_minmax':
        return new EXTBlendMinmax();
      case 'EXT_color_buffer_half_float':
        return new EXTColorBufferHalfFloat();
      case 'EXT_disjoint_timer_query':
      case 'EXT_disjoint_timer_query_webgl2':
        return new EXTDisjointTimerQuery(id, this);
      case 'EXT_color_buffer_float':
      case 'EXT_float_blend':
      case 'EXT_frag_depth':
      case 'EXT_shader_texture_lod':
      case 'OES_element_index_uint':
      case 'OES_fbo_render_mipmap':
      case 'OES_texture_float':
      case 'OES_texture_float_linear':
      case 'OES_texture_half_float_linear':
        return new GenericExtension(id);
      case 'EXT_sRGB':
        return new EXTSRGB();
      case 'EXT_texture_compression_bptc':
        return new EXTTextureCompressionBptc();
      case 'EXT_texture_compression_rgtc':
        return new EXTTextureCompressionRgtc();
      case 'EXT_texture_filter_anisotropic':
        return new EXTTextureFilterAnisotropic();
      case 'EXT_texture_norm16':
        return new EXTTextureNorm16();
      case 'KHR_parallel_shader_compile':
        return new KHRParallelShaderCompile();
      case 'OES_draw_buffers_indexed':
        return new OESDrawBuffersIndexed(id, this);
      case 'OES_vertex_array_object':
        return new OESVertexArrayObject(id, this);
      case 'OES_standard_derivatives':
        return new OESStandardDerivatives();
      case 'OES_texture_half_float':
        return new OESTextureHalfFloat();
      case 'OVR_multiview2':
        return new OVRMultiview2(id, this);
      case 'WEBGL_color_buffer_float':
        return new WEBGLColorBufferFloat();
      case 'WEBGL_compressed_texture_astc':
        return new WEBGLCompressedTextureAstc();
      case 'WEBGL_compressed_texture_etc':
        return new WEBGLCompressedTextureEtc();
      case 'WEBGL_compressed_texture_etc1':
        return new WEBGLCompressedTextureEtc1();
      case 'WEBGL_compressed_texture_pvrtc':
        return new WEBGLCompressedTexturePvrtc();
      case 'WEBGL_compressed_texture_s3tc':
        return new WEBGLCompressedTextureS3tc();
      case 'WEBGL_compressed_texture_s3tc_srgb':
        return new WEBGLCompressedTextureS3tcSrgb();
      case 'WEBGL_debug_renderer_info':
        return new WEBGLDebugRendererInfo();
      case 'WEBGL_debug_shaders':
        return new WEBGLDebugShaders();
      case 'WEBGL_depth_texture':
        return new WEBGLDepthTexture();
      case 'WEBGL_draw_buffers':
        return new WEBGLDrawBuffers(id, this);
      case 'WEBGL_lose_context':
        return new WEBGLLoseContext(id, this);
      case 'WEBGL_multi_draw':
        return new WEBGLMultiDraw(id, this);
      default:
        return null;
    }
  }

  getFragDataLocation(program: vGLProgram, name: string): GLint {
    throw new Error('NOT IMPLEMENTED');
  }

  getFramebufferAttachmentParameter(target: GLenum, attachment: GLenum, pname: GLenum): any {
    throw new Error('NOT IMPLEMENTED');
  }

  getIndexedParameter(target: GLenum, index: GLuint): any {
    throw new Error('NOT IMPLEMENTED');
  }

  getInternalformatParameter(target: GLenum, internalformat: GLenum, pname: GLenum): any {
    throw new Error('NOT IMPLEMENTED');
  }

  getParameter(pname: GLenum): any {
    if (this._parameters && pname in this._parameters) return this._parameters[pname];

    switch (pname) {
      case this.TEXTURE_BINDING_2D: {
        return this._bindings.texture2D;
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
        return this._getBindedBuffer(this.ARRAY_BUFFER);
      }
      case this.ELEMENT_ARRAY_BUFFER_BINDING: {
        return this._getBindedBuffer(this.ELEMENT_ARRAY_BUFFER);
      }
      case this.COPY_READ_BUFFER_BINDING: {
        return this._getBindedBuffer(this.COPY_READ_BUFFER);
      }
      case this.COPY_WRITE_BUFFER_BINDING: {
        return this._getBindedBuffer(this.COPY_WRITE_BUFFER);
      }
      case this.TRANSFORM_FEEDBACK_BUFFER_BINDING: {
        return this._getBindedBuffer(this.TRANSFORM_FEEDBACK_BUFFER);
      }
      case this.UNIFORM_BUFFER_BINDING: {
        return this._getBindedBuffer(this.UNIFORM_BUFFER);
      }
      case this.PIXEL_PACK_BUFFER_BINDING: {
        return this._getBindedBuffer(this.PIXEL_PACK_BUFFER);
      }
      case this.PIXEL_UNPACK_BUFFER_BINDING: {
        return this._getBindedBuffer(this.PIXEL_UNPACK_BUFFER);
      }
      case this.FRAMEBUFFER_BINDING: {
        return this._getBindedBuffer(this.FRAMEBUFFER);
      }
      case this.RENDERBUFFER_BINDING: {
        return this._getBindedBuffer(this.RENDERBUFFER);
      }
      case this.DRAW_FRAMEBUFFER_BINDING: {
        return this._getBindedBuffer(this.DRAW_FRAMEBUFFER);
      }
      case this.READ_FRAMEBUFFER_BINDING: {
        return this._getBindedBuffer(this.READ_FRAMEBUFFER);
      }
      default:
        throw `Unexpected name: ${pname}`;
    }
  }

  getProgramInfoLog(program: vGLProgram): string | null {
    return "";
  }

  getProgramParameter(program: vGLProgram, pname: GLenum): any {
    switch (pname) {
      case this.ACTIVE_UNIFORMS:     // Returns a GLint indicating the number of active uniform variables to a program.
        return program.activeUniforms;
      case this.ACTIVE_ATTRIBUTES:     // Returns a GLint indicating the number of active attribute variables to a program.
        return program.activeAttributes;
      case this.DELETE_STATUS:    // Returns a GLboolean indicating whether or not the program is flagged for deletion.
        return program.isDeleted(); // See #deleteProgram
      case this.ATTACHED_SHADERS:     // Returns a GLint indicating the number of attached shaders to a program.
        return program.shaders.length;
      case this.TRANSFORM_FEEDBACK_BUFFER_MODE:     // Returns a GLenum indicating the buffer mode when transform feedback is active. May be gl.SEPARATE_ATTRIBS or gl.INTERLEAVED_ATTRIBS.
      case this.TRANSFORM_FEEDBACK_VARYINGS:     // Returns a GLint indicating the number of varying variables to capture in transform feedback mode.
      case this.ACTIVE_UNIFORM_BLOCKS:     // Returns a GLint indicating the number of uniform blocks containing active uniforms.
        throw `NOT YET IMPLEMENTED: ${pname}`;
      case this.VALIDATE_STATUS:     // Returns a GLboolean indicating whether or not the last validation operation was successful.
      case this.LINK_STATUS:    // Returns a GLboolean indicating whether or not the last link operation was successful.
        // optimistically return success; client will abort on an actual error. we assume an error-free async workflow
        return true;
      default:
        throw `Unexpected getProgramParameter: ${pname}`;
    }
  }

  getQuery(target: GLenum, pname: GLenum): vGLQuery | null {
    const queryId = this.nextObjectId();
    this.createObjectReference(queryId, 'getQuery', [...arguments]);
    return new vGLQuery(queryId);
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

  getShaderInfoLog(shader: vGLShader): string | null {
    return "";
  }

  getShaderParameter(shader: vGLShader, pname: GLenum): any {
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
        throw `Unexpected getShaderParameter: ${name}`;
    }
  }

  getShaderPrecisionFormat(shadertype: GLenum, precisiontype: GLenum): WebGLShaderPrecisionFormat | null {
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getShaderPrecisionFormat
    // looks like can be implemented
    throw new Error('NOT YET IMPLEMENTED');
  }

  getShaderSource(shader: vGLShader): string | null {
    return shader.source;
  }

  getSupportedExtensions(): string[] | null {
    return this._extensions;
  }

  getSyncParameter(sync: vGLSync, pname: GLenum): any {
    throw new Error('NOT IMPLEMENTED');
  }

  getTexParameter(target: GLenum, pname: GLenum): any {
    throw new Error('NOT IMPLEMENTED');
  }

  getTransformFeedbackVarying(program: vGLProgram, index: GLuint): vGLActiveInfo | null {
    throw new Error('NOT YET IMPLEMENTED');
  }

  getUniform(program: vGLProgram, location: vGLLocation): any {
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getUniform
    throw new Error('NOT YET IMPLEMENTED');
  }

  getUniformBlockIndex(program: vGLProgram, uniformBlockName: string): GLuint {
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/getUniformBlockIndex
    throw new Error('NOT YET IMPLEMENTED');
  }

  getUniformIndices(program: vGLProgram, uniformNames: string[]): GLuint[] | null;
  getUniformIndices(program: vGLProgram, uniformNames: Iterable<string>): Iterable<GLuint> | null;
  getUniformIndices(program: vGLProgram, uniformNames: string[] | Iterable<string>): GLuint[] | null | Iterable<GLuint> {
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/getUniformIndices
    throw new Error('NOT YET IMPLEMENTED');
  }

  getUniformLocation(program: vGLProgram, name: string): vGLLocation | null {
    const uniform = program.getUniform(name);
    if (uniform) {
      if (uniform.uniformLocations) {
        return uniform.uniformLocations;
      } else {
        const uniformLocationId = this.nextObjectId();
        this.createObjectReference(uniformLocationId, 'getUniformLocation', [...arguments]);
        const uniformLocation = new vGLLocation(uniformLocationId, name);
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
    this[TransferrableKeys.mutated]('hint', [...arguments]);
  }

  invalidateFramebuffer(target: GLenum, attachments: GLenum[]): void;
  invalidateFramebuffer(target: GLenum, attachments: Iterable<GLenum>): void;
  invalidateFramebuffer(target: GLenum, attachments: GLenum[] | Iterable<GLenum>): void {
    this[TransferrableKeys.mutated]('invalidateFramebuffer', [...arguments]);
  }

  invalidateSubFramebuffer(target: GLenum, attachments: GLenum[], x: GLint, y: GLint, width: GLsizei, height: GLsizei): void;
  invalidateSubFramebuffer(target: GLenum, attachments: Iterable<GLenum>, x: GLint, y: GLint, width: GLsizei, height: GLsizei): void;
  invalidateSubFramebuffer(target: GLenum, attachments: GLenum[] | Iterable<GLenum>, x: GLint, y: GLint, width: GLsizei, height: GLsizei): void {
    this[TransferrableKeys.mutated]('invalidateSubFramebuffer', [...arguments]);
  }

  isBuffer(buffer: vGLBuffer | null): GLboolean {
    return buffer != null && buffer instanceof vGLBuffer && !buffer.isDeleted();
  }

  isContextLost(): boolean {
    return false;
  }

  isEnabled(cap: GLenum): GLboolean {
    return this._capabilities[cap] || false;
  }

  isFramebuffer(framebuffer: vGLFramebuffer | null): GLboolean {
    return framebuffer != null && framebuffer instanceof vGLFramebuffer && !framebuffer.isDeleted();
  }

  isProgram(program: vGLProgram | null): GLboolean {
    return program != null && program instanceof vGLProgram && !program.isDeleted();
  }

  isQuery(query: vGLQuery | null): GLboolean {
    return query != null && query instanceof vGLQuery && !query.isDeleted();
  }

  isRenderbuffer(renderbuffer: vGLRenderbuffer | null): GLboolean {
    return renderbuffer != null && renderbuffer instanceof vGLRenderbuffer && !renderbuffer.isDeleted();
  }

  isSampler(sampler: vGLSampler | null): GLboolean {
    return sampler != null && sampler instanceof vGLSampler && !sampler.isDeleted();
  }

  isShader(shader: vGLShader | null): GLboolean {
    return shader != null && shader instanceof vGLShader && !shader.isDeleted();
  }

  isSync(sync: vGLSync | null): GLboolean {
    return sync != null && sync instanceof vGLSync && !sync.isDeleted();
  }

  isTexture(texture: vGLTexture | null): GLboolean {
    return texture != null && texture instanceof vGLTexture && !texture.isDeleted();
  }

  isTransformFeedback(tf: vGLTransformFeedback | null): GLboolean {
    return tf != null && tf instanceof vGLTransformFeedback && !tf.isDeleted();
  }

  isVertexArray(vertexArray: vGLVertexArrayObject | null): GLboolean {
    return vertexArray != null && vertexArray instanceof vGLVertexArrayObject && !vertexArray.isDeleted();
  }

  lineWidth(width: GLfloat): void {
    this[TransferrableKeys.mutated]('lineWidth', [...arguments]);
  }

  linkProgram(program: vGLProgram): void {
    this[TransferrableKeys.mutated]('linkProgram', [...arguments]);
    program.link(this);
  }

  pauseTransformFeedback(): void {
    this[TransferrableKeys.mutated]('pauseTransformFeedback', []);
  }

  pixelStorei(pname: GLenum, param: GLint | GLboolean): void {
    this[TransferrableKeys.mutated]('pixelStorei', [...arguments]);
  }

  polygonOffset(factor: GLfloat, units: GLfloat): void {
    this[TransferrableKeys.mutated]('polygonOffset', [...arguments]);
  }

  readBuffer(src: GLenum): void {
    this[TransferrableKeys.mutated]('readBuffer', [...arguments]);
  }

  readPixels(x: GLint, y: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, dstData: ArrayBufferView | null): void;
  readPixels(x: GLint, y: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, offset: GLintptr): void;
  readPixels(x: GLint, y: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, dstData: ArrayBufferView, dstOffset: GLuint): void;
  readPixels(x: GLint, y: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, dstData: ArrayBufferView | null | GLintptr, dstOffset?: GLuint): void {
    throw new Error('NOT IMPLEMENTED');
  }

  renderbufferStorage(target: GLenum, internalformat: GLenum, width: GLsizei, height: GLsizei): void {
    this[TransferrableKeys.mutated]('renderbufferStorage', [...arguments]);
  }

  renderbufferStorageMultisample(target: GLenum, samples: GLsizei, internalformat: GLenum, width: GLsizei, height: GLsizei): void {
    this[TransferrableKeys.mutated]('renderbufferStorageMultisample', [...arguments]);
  }

  resumeTransformFeedback(): void {
    this[TransferrableKeys.mutated]('resumeTransformFeedback', []);
  }

  sampleCoverage(value: GLclampf, invert: GLboolean): void {
    this[TransferrableKeys.mutated]('sampleCoverage', [...arguments]);
  }

  samplerParameterf(sampler: vGLSampler, pname: GLenum, param: GLfloat): void {
    this[TransferrableKeys.mutated]('samplerParameterf', [...arguments]);
  }

  samplerParameteri(sampler: vGLSampler, pname: GLenum, param: GLint): void {
    this[TransferrableKeys.mutated]('samplerParameteri', [...arguments]);
  }

  scissor(x: GLint, y: GLint, width: GLsizei, height: GLsizei): void {
    this[TransferrableKeys.mutated]('scissor', [...arguments]);
  }

  shaderSource(shader: vGLShader, source: string): void {

    const shaderSource = shader.compile(this, source);

    this[TransferrableKeys.mutated]('shaderSource', [shader, shaderSource]);
  }

  stencilFunc(func: GLenum, ref: GLint, mask: GLuint): void {
    this[TransferrableKeys.mutated]('stencilFunc', [...arguments]);
  }

  stencilFuncSeparate(face: GLenum, func: GLenum, ref: GLint, mask: GLuint): void {
    this[TransferrableKeys.mutated]('stencilFuncSeparate', [...arguments]);
  }

  stencilMask(mask: GLuint): void {
    this[TransferrableKeys.mutated]('stencilMask', [...arguments]);
  }

  stencilMaskSeparate(face: GLenum, mask: GLuint): void {
    this[TransferrableKeys.mutated]('stencilMaskSeparate', [...arguments]);
  }

  stencilOp(fail: GLenum, zfail: GLenum, zpass: GLenum): void {
    this[TransferrableKeys.mutated]('stencilOp', [...arguments]);
  }

  stencilOpSeparate(face: GLenum, fail: GLenum, zfail: GLenum, zpass: GLenum): void {
    this[TransferrableKeys.mutated]('stencilOpSeparate', [...arguments]);
  }

  texImage2D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, border: GLint, format: GLenum, type: GLenum, pixels: ArrayBufferView | null): void;
  texImage2D(target: GLenum, level: GLint, internalformat: GLint, format: GLenum, type: GLenum, source: TexImageSource): void;
  texImage2D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, border: GLint, format: GLenum, type: GLenum, pboOffset: GLintptr): void;
  texImage2D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, border: GLint, format: GLenum, type: GLenum, source: TexImageSource): void;
  texImage2D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, border: GLint, format: GLenum, type: GLenum, srcData: ArrayBufferView, srcOffset: GLuint): void;
  texImage2D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei | GLenum, height: GLsizei | GLenum, border: GLint | TexImageSource, format?: GLenum, type?: GLenum, pixels?: ArrayBufferView | null | GLintptr | TexImageSource, srcOffset?: GLuint): void {
    this[TransferrableKeys.mutated]('texImage2D', [...arguments]);
  }

  texImage3D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, pboOffset: GLintptr): void;
  texImage3D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, source: TexImageSource): void;
  texImage3D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, srcData: ArrayBufferView | null): void;
  texImage3D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, srcData: ArrayBufferView, srcOffset: GLuint): void;
  texImage3D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, pboOffset: GLintptr | TexImageSource | ArrayBufferView | null, srcOffset?: GLuint): void {
    this[TransferrableKeys.mutated]('texImage3D', [...arguments]);
  }

  texParameterf(target: GLenum, pname: GLenum, param: GLfloat): void {
    this[TransferrableKeys.mutated]('texParameterf', [...arguments]);
  }

  texParameteri(target: GLenum, pname: GLenum, param: GLint): void {
    this[TransferrableKeys.mutated]('texParameteri', [...arguments]);
  }

  texStorage2D(target: GLenum, levels: GLsizei, internalformat: GLenum, width: GLsizei, height: GLsizei): void {
    this[TransferrableKeys.mutated]('texStorage2D', [...arguments]);
  }

  texStorage3D(target: GLenum, levels: GLsizei, internalformat: GLenum, width: GLsizei, height: GLsizei, depth: GLsizei): void {
    this[TransferrableKeys.mutated]('texStorage3D', [...arguments]);
  }

  texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, pixels: ArrayBufferView | null): void;
  texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, format: GLenum, type: GLenum, source: TexImageSource): void;
  texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, pboOffset: GLintptr): void;
  texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, source: TexImageSource): void;
  texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, srcData: ArrayBufferView, srcOffset: GLuint): void;
  texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei | GLenum, height: GLsizei | GLenum, format: GLenum | TexImageSource, type?: GLenum, pixels?: ArrayBufferView | null | GLintptr | TexImageSource, srcOffset?: GLuint): void {
    this[TransferrableKeys.mutated]('texSubImage2D', [...arguments]);
  }

  texSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, type: GLenum, pboOffset: GLintptr): void;
  texSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, type: GLenum, source: TexImageSource): void;
  texSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, type: GLenum, srcData: ArrayBufferView | null, srcOffset?: GLuint): void;
  texSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, type: GLenum, pboOffset: GLintptr | TexImageSource | ArrayBufferView | null, srcOffset?: GLuint): void {
    this[TransferrableKeys.mutated]('texSubImage3D', [...arguments]);
  }

  transformFeedbackVaryings(program: vGLProgram, varyings: string[], bufferMode: GLenum): void;
  transformFeedbackVaryings(program: vGLProgram, varyings: Iterable<string>, bufferMode: GLenum): void;
  transformFeedbackVaryings(program: vGLProgram, varyings: string[] | Iterable<string>, bufferMode: GLenum): void {
    this[TransferrableKeys.mutated]('transformFeedbackVaryings', [...arguments]);
  }

  uniform1f(location: vGLLocation | null, x: GLfloat): void {
    this[TransferrableKeys.mutated]('uniform1f', [...arguments]);
  }

  uniform1fv(location: vGLLocation | null, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform1fv(location: vGLLocation | null, data: Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform1fv(location: vGLLocation | null, data: Float32List | Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniform1fv', [...arguments]);
  }

  uniform1i(location: vGLLocation | null, x: GLint): void {
    this[TransferrableKeys.mutated]('uniform1i', [...arguments]);
  }

  uniform1iv(location: vGLLocation | null, data: Int32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform1iv(location: vGLLocation | null, data: Iterable<GLint>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform1iv(location: vGLLocation | null, data: Int32List | Iterable<GLint>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniform1iv', [...arguments]);
  }

  uniform1ui(location: vGLLocation | null, v0: GLuint): void {
    this[TransferrableKeys.mutated]('uniform1ui', [...arguments]);
  }

  uniform1uiv(location: vGLLocation | null, data: Uint32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform1uiv(location: vGLLocation | null, data: Iterable<GLuint>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform1uiv(location: vGLLocation | null, data: Uint32List | Iterable<GLuint>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniform1uiv', [...arguments]);
  }

  uniform2f(location: vGLLocation | null, x: GLfloat, y: GLfloat): void {
    this[TransferrableKeys.mutated]('uniform2f', [...arguments]);
  }

  uniform2fv(location: vGLLocation | null, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform2fv(location: vGLLocation | null, data: Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform2fv(location: vGLLocation | null, data: Float32List | Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniform2fv', [...arguments]);
  }

  uniform2i(location: vGLLocation | null, x: GLint, y: GLint): void {
    this[TransferrableKeys.mutated]('uniform2i', [...arguments]);
  }

  uniform2iv(location: vGLLocation | null, data: Int32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform2iv(location: vGLLocation | null, data: Iterable<GLint>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform2iv(location: vGLLocation | null, data: Int32List | Iterable<GLint>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniform2iv', [...arguments]);
  }

  uniform2ui(location: vGLLocation | null, v0: GLuint, v1: GLuint): void {
    this[TransferrableKeys.mutated]('uniform2ui', [...arguments]);
  }

  uniform2uiv(location: vGLLocation | null, data: Uint32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform2uiv(location: vGLLocation | null, data: Iterable<GLuint>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform2uiv(location: vGLLocation | null, data: Uint32List | Iterable<GLuint>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniform2uiv', [...arguments]);
  }

  uniform3f(location: vGLLocation | null, x: GLfloat, y: GLfloat, z: GLfloat): void {
    this[TransferrableKeys.mutated]('uniform3f', [...arguments]);
  }

  uniform3fv(location: vGLLocation | null, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform3fv(location: vGLLocation | null, data: Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform3fv(location: vGLLocation | null, data: Float32List | Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniform3fv', [...arguments]);
  }

  uniform3i(location: vGLLocation | null, x: GLint, y: GLint, z: GLint): void {
    this[TransferrableKeys.mutated]('uniform3i', [...arguments]);
  }

  uniform3iv(location: vGLLocation | null, data: Int32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform3iv(location: vGLLocation | null, data: Iterable<GLint>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform3iv(location: vGLLocation | null, data: Int32List | Iterable<GLint>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniform3iv', [...arguments]);
  }

  uniform3ui(location: vGLLocation | null, v0: GLuint, v1: GLuint, v2: GLuint): void {
    this[TransferrableKeys.mutated]('uniform3ui', [...arguments]);
  }

  uniform3uiv(location: vGLLocation | null, data: Uint32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform3uiv(location: vGLLocation | null, data: Iterable<GLuint>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform3uiv(location: vGLLocation | null, data: Uint32List | Iterable<GLuint>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniform3uiv', [...arguments]);
  }

  uniform4f(location: vGLLocation | null, x: GLfloat, y: GLfloat, z: GLfloat, w: GLfloat): void {
    this[TransferrableKeys.mutated]('uniform4f', [...arguments]);
  }

  uniform4fv(location: vGLLocation | null, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform4fv(location: vGLLocation | null, data: Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform4fv(location: vGLLocation | null, data: Float32List | Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniform4fv', [...arguments]);
  }

  uniform4i(location: vGLLocation | null, x: GLint, y: GLint, z: GLint, w: GLint): void {
    this[TransferrableKeys.mutated]('uniform4i', [...arguments]);
  }

  uniform4iv(location: vGLLocation | null, data: Int32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform4iv(location: vGLLocation | null, data: Iterable<GLint>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform4iv(location: vGLLocation | null, data: Int32List | Iterable<GLint>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniform4iv', [...arguments]);
  }

  uniform4ui(location: vGLLocation | null, v0: GLuint, v1: GLuint, v2: GLuint, v3: GLuint): void {
    this[TransferrableKeys.mutated]('uniform4ui', [...arguments]);
  }

  uniform4uiv(location: vGLLocation | null, data: Uint32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform4uiv(location: vGLLocation | null, data: Iterable<GLuint>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniform4uiv(location: vGLLocation | null, data: Uint32List | Iterable<GLuint>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniform4uiv', [...arguments]);
  }

  uniformBlockBinding(program: vGLProgram, uniformBlockIndex: GLuint, uniformBlockBinding: GLuint): void {
    this[TransferrableKeys.mutated]('uniformBlockBinding', [...arguments]);
  }

  uniformMatrix2fv(location: vGLLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix2fv(location: vGLLocation | null, transpose: GLboolean, data: Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix2fv(location: vGLLocation | null, transpose: GLboolean, data: Float32List | Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniformMatrix2fv', [...arguments]);
  }

  uniformMatrix2x3fv(location: vGLLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix2x3fv(location: vGLLocation | null, transpose: GLboolean, data: Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix2x3fv(location: vGLLocation | null, transpose: GLboolean, data: Float32List | Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniformMatrix2x3fv', [...arguments]);
  }

  uniformMatrix2x4fv(location: vGLLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix2x4fv(location: vGLLocation | null, transpose: GLboolean, data: Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix2x4fv(location: vGLLocation | null, transpose: GLboolean, data: Float32List | Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniformMatrix2x4fv', [...arguments]);
  }

  uniformMatrix3fv(location: vGLLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix3fv(location: vGLLocation | null, transpose: GLboolean, data: Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix3fv(location: vGLLocation | null, transpose: GLboolean, data: Float32List | Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniformMatrix3fv', [...arguments]);
  }

  uniformMatrix3x2fv(location: vGLLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix3x2fv(location: vGLLocation | null, transpose: GLboolean, data: Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix3x2fv(location: vGLLocation | null, transpose: GLboolean, data: Float32List | Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniformMatrix3x2fv', [...arguments]);
  }

  uniformMatrix3x4fv(location: vGLLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix3x4fv(location: vGLLocation | null, transpose: GLboolean, data: Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix3x4fv(location: vGLLocation | null, transpose: GLboolean, data: Float32List | Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniformMatrix3x4fv', [...arguments]);
  }

  uniformMatrix4fv(location: vGLLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix4fv(location: vGLLocation | null, transpose: GLboolean, data: Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix4fv(location: vGLLocation | null, transpose: GLboolean, data: Float32List | Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniformMatrix4fv', [...arguments]);
  }

  uniformMatrix4x2fv(location: vGLLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix4x2fv(location: vGLLocation | null, transpose: GLboolean, data: Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix4x2fv(location: vGLLocation | null, transpose: GLboolean, data: Float32List | Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniformMatrix4x2fv', [...arguments]);
  }

  uniformMatrix4x3fv(location: vGLLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix4x3fv(location: vGLLocation | null, transpose: GLboolean, data: Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void;
  uniformMatrix4x3fv(location: vGLLocation | null, transpose: GLboolean, data: Float32List | Iterable<GLfloat>, srcOffset?: GLuint, srcLength?: GLuint): void {
    this[TransferrableKeys.mutated]('uniformMatrix4x3fv', [...arguments]);
  }

  useProgram(program: vGLProgram | null): void {
    if (!program || program.isDeleted()) return;
    this._bindings.program = program;
    this[TransferrableKeys.mutated]('useProgram', [...arguments]);
  }

  validateProgram(program: vGLProgram): void {
    this[TransferrableKeys.mutated]('validateProgram', [...arguments]);
  }

  vertexAttrib1f(index: GLuint, x: GLfloat): void {
    this[TransferrableKeys.mutated]('vertexAttrib1f', [...arguments]);
  }

  vertexAttrib1fv(index: GLuint, values: Float32List): void;
  vertexAttrib1fv(index: GLuint, values: Iterable<GLfloat>): void;
  vertexAttrib1fv(index: GLuint, values: Float32List | Iterable<GLfloat>): void {
    this[TransferrableKeys.mutated]('vertexAttrib1fv', [...arguments]);
  }

  vertexAttrib2f(index: GLuint, x: GLfloat, y: GLfloat): void {
    this[TransferrableKeys.mutated]('vertexAttrib2f', [...arguments]);
  }

  vertexAttrib2fv(index: GLuint, values: Float32List): void;
  vertexAttrib2fv(index: GLuint, values: Iterable<GLfloat>): void;
  vertexAttrib2fv(index: GLuint, values: Float32List | Iterable<GLfloat>): void {
    this[TransferrableKeys.mutated]('vertexAttrib2fv', [...arguments]);
  }

  vertexAttrib3f(index: GLuint, x: GLfloat, y: GLfloat, z: GLfloat): void {
    this[TransferrableKeys.mutated]('vertexAttrib3f', [...arguments]);
  }

  vertexAttrib3fv(index: GLuint, values: Float32List): void;
  vertexAttrib3fv(index: GLuint, values: Iterable<GLfloat>): void;
  vertexAttrib3fv(index: GLuint, values: Float32List | Iterable<GLfloat>): void {
    this[TransferrableKeys.mutated]('vertexAttrib3fv', [...arguments]);
  }

  vertexAttrib4f(index: GLuint, x: GLfloat, y: GLfloat, z: GLfloat, w: GLfloat): void {
    this[TransferrableKeys.mutated]('vertexAttrib4f', [...arguments]);
  }

  vertexAttrib4fv(index: GLuint, values: Float32List): void;
  vertexAttrib4fv(index: GLuint, values: Iterable<GLfloat>): void;
  vertexAttrib4fv(index: GLuint, values: Float32List | Iterable<GLfloat>): void {
    this[TransferrableKeys.mutated]('vertexAttrib4fv', [...arguments]);
  }

  vertexAttribDivisor(index: GLuint, divisor: GLuint): void {
    this[TransferrableKeys.mutated]('vertexAttribDivisor', [...arguments]);
  }

  vertexAttribI4i(index: GLuint, x: GLint, y: GLint, z: GLint, w: GLint): void {
    this[TransferrableKeys.mutated]('vertexAttribI4i', [...arguments]);
  }

  vertexAttribI4iv(index: GLuint, values: Int32List): void;
  vertexAttribI4iv(index: GLuint, values: Iterable<GLint>): void;
  vertexAttribI4iv(index: GLuint, values: Int32List | Iterable<GLint>): void {
    this[TransferrableKeys.mutated]('vertexAttribI4iv', [...arguments]);
  }

  vertexAttribI4ui(index: GLuint, x: GLuint, y: GLuint, z: GLuint, w: GLuint): void {
    this[TransferrableKeys.mutated]('vertexAttribI4ui', [...arguments]);
  }

  vertexAttribI4uiv(index: GLuint, values: Uint32List): void;
  vertexAttribI4uiv(index: GLuint, values: Iterable<GLuint>): void;
  vertexAttribI4uiv(index: GLuint, values: Uint32List | Iterable<GLuint>): void {
    this[TransferrableKeys.mutated]('vertexAttribI4uiv', [...arguments]);
  }

  vertexAttribIPointer(index: GLuint, size: GLint, type: GLenum, stride: GLsizei, offset: GLintptr): void {
    this[TransferrableKeys.mutated]('vertexAttribIPointer', [...arguments]);
  }

  vertexAttribPointer(index: GLuint, size: GLint, type: GLenum, normalized: GLboolean, stride: GLsizei, offset: GLintptr): void {
    this[TransferrableKeys.mutated]('vertexAttribPointer', [...arguments]);
  }

  viewport(x: GLint, y: GLint, width: GLsizei, height: GLsizei): void {
    this[TransferrableKeys.mutated]('viewport', [...arguments]);
  }

  waitSync(sync: vGLSync, flags: GLbitfield, timeout: GLint64): void {
    this[TransferrableKeys.mutated]('waitSync', [...arguments]);
  }

  nextObjectId() {
    return WebGLRenderingContextPolyfill.nextObjectId();
  }

  static nextObjectId() {
    return WebGLRenderingContextPolyfill._objectIndex++;
  }

  public [TransferrableKeys.serializeAsTransferrableObject](): number[] {
    return this._serializedAsTransferrableObject;
  }

  /**
   * Creates object in the main thread, and associates it with the id provided.
   * @param objectId ID to associate the created object with.
   * @param creationMethod Method to use for object creation.
   * @param creationArgs Arguments to pass into the creation method.
   */
  private createObjectReference(objectId: number, creationMethod: string, creationArgs: any[]) {
    transfer(this.canvas.ownerDocument as Document, [
      TransferrableMutationType.OBJECT_CREATION,
      store(creationMethod),
      objectId,
      creationArgs.length,
      ...this[TransferrableKeys.serializeAsTransferrableObject](),
      ...serializeTransferrableObject(creationArgs),
    ]);
  }

  private [TransferrableKeys.mutated](fnName: string, args: any[]) {
    transfer(this.canvas.ownerDocument as Document, [
      TransferrableMutationType.OBJECT_MUTATION,
      store(fnName),
      args.length,
      ...this[TransferrableKeys.serializeAsTransferrableObject](),
      ...serializeTransferrableObject(args),
    ]);
  }

  private _bindBuffer(target: GLenum, buffer: vGLBuffer | null): void {
    switch (target) {
      case this.ARRAY_BUFFER: {
        this._buffers.arrayBuffer = buffer;
        break;
      }
      case this.ELEMENT_ARRAY_BUFFER: {
        this._buffers.elementArrayBuffer = buffer;
        break;
      }
      case this.COPY_READ_BUFFER: {
        this._buffers.copyReadBuffer = buffer;
        break;
      }
      case this.COPY_WRITE_BUFFER: {
        this._buffers.copyWriteBuffer = buffer;
        break;
      }
      case this.TRANSFORM_FEEDBACK_BUFFER: {
        this._buffers.transformFeedbackBuffer = buffer;
        break;
      }
      case this.UNIFORM_BUFFER: {
        this._buffers.uniformBuffer = buffer;
        break;
      }
      case this.PIXEL_PACK_BUFFER: {
        this._buffers.pixelPackBuffer = buffer;
        break;
      }
      case this.PIXEL_UNPACK_BUFFER: {
        this._buffers.pixelUnpackBuffer = buffer;
        break;
      }
      default:
        throw `Unexpected target: ${target}`;
    }
  }

  private _getBindedBuffer(target: GLenum): vGLBuffer | null {
    switch (target) {
      case this.ARRAY_BUFFER:
        return this._buffers.arrayBuffer;
      case this.ELEMENT_ARRAY_BUFFER:
        return this._buffers.elementArrayBuffer;
      case this.COPY_READ_BUFFER:
        return this._buffers.copyReadBuffer;
      case this.COPY_WRITE_BUFFER:
        return this._buffers.copyWriteBuffer;
      case this.TRANSFORM_FEEDBACK_BUFFER:
        return this._buffers.transformFeedbackBuffer;
      case this.UNIFORM_BUFFER:
        return this._buffers.uniformBuffer;
      case this.PIXEL_PACK_BUFFER:
        return this._buffers.pixelPackBuffer;
      case this.PIXEL_UNPACK_BUFFER:
        return this._buffers.pixelUnpackBuffer;
      case this.FRAMEBUFFER:
        return this._buffers.framebuffer;
      case this.RENDERBUFFER:
        return this._buffers.renderbuffer;
      case this.DRAW_FRAMEBUFFER:
        return this._buffers.drawFramebuffer;
      case this.READ_FRAMEBUFFER:
        return this._buffers.readFramebuffer;
      default:
        throw `Unexpected target: ${target}`;
    }
  }
}