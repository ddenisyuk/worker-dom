import { TransferrableGLObject, vGLQuery } from './TransferrableGLObjectTypes';
import { WebGLRenderingContextPolyfill } from '../WebGLRenderingContextPolyfill';
import { TransferrableKeys } from '../../../transfer/TransferrableKeys';
import { transfer } from '../../MutationTransfer';
import { Document } from '../../dom/Document';
import { TransferrableMutationType } from '../../../transfer/TransferrableMutation';
import { GLConstants } from './GLConstants';
import { GLShader } from './GLShader';
import { createObjectReference, deleteObjectReference } from '../../object-reference';

export abstract class TransferrableGLExtension extends TransferrableGLObject {
  protected readonly context: WebGLRenderingContextPolyfill;

  public constructor(id: number, context: WebGLRenderingContextPolyfill) {
    super(id);
    this.context = context;
  }

  protected [TransferrableKeys.mutated](fnName: string, args: any[] | IArguments) {
    transfer(this.context.canvas.ownerDocument as Document, [TransferrableMutationType.OBJECT_MUTATION, fnName, this, args]);
  }

  protected createObjectReference<T>(creationMethod: string, creationArgs: any[], instanceCreationFn: (id: number) => T): T {
    return createObjectReference(this.context.canvas.ownerDocument as Document, this, creationMethod, creationArgs, instanceCreationFn);
  }

  protected deleteObjectReference(objectId: number) {
    deleteObjectReference(this.context.canvas.ownerDocument as Document, objectId);
  }
}

export class GenericExtension
  extends GLConstants
  implements
    EXT_blend_minmax,
    EXT_sRGB,
    EXT_texture_filter_anisotropic,
    KHR_parallel_shader_compile,
    OES_standard_derivatives,
    OES_texture_half_float,
    EXT_color_buffer_half_float,
    EXT_texture_compression_rgtc,
    WEBGL_color_buffer_float,
    WEBGL_compressed_texture_etc,
    WEBGL_compressed_texture_etc1,
    WEBGL_compressed_texture_pvrtc,
    WEBGL_compressed_texture_s3tc,
    WEBGL_compressed_texture_s3tc_srgb,
    WEBGL_debug_renderer_info,
    WEBGL_depth_texture,
    EXT_texture_norm16,
    EXT_texture_compression_bptc {}

export class GLVertexArrayObjectOES extends TransferrableGLObject implements WebGLVertexArrayObjectOES {}

export class WEBGLDebugShaders implements WEBGL_debug_shaders {
  getTranslatedShaderSource(shader: GLShader): string {
    return shader.compiled && shader.source != null ? shader.source : '';
  }
}

export class WEBGLCompressedTextureAstc extends GLConstants implements WEBGL_compressed_texture_astc {
  getSupportedProfiles(): string[] {
    return ['ldr']; // HDR?
  }
}

export class WEBGLDrawBuffers extends TransferrableGLExtension implements WEBGL_draw_buffers {
  readonly COLOR_ATTACHMENT0_WEBGL = GLConstants.COLOR_ATTACHMENT0_WEBGL;
  readonly COLOR_ATTACHMENT10_WEBGL = GLConstants.COLOR_ATTACHMENT10_WEBGL;
  readonly COLOR_ATTACHMENT11_WEBGL = GLConstants.COLOR_ATTACHMENT11_WEBGL;
  readonly COLOR_ATTACHMENT12_WEBGL = GLConstants.COLOR_ATTACHMENT12_WEBGL;
  readonly COLOR_ATTACHMENT13_WEBGL = GLConstants.COLOR_ATTACHMENT13_WEBGL;
  readonly COLOR_ATTACHMENT14_WEBGL = GLConstants.COLOR_ATTACHMENT14_WEBGL;
  readonly COLOR_ATTACHMENT15_WEBGL = GLConstants.COLOR_ATTACHMENT15_WEBGL;
  readonly COLOR_ATTACHMENT1_WEBGL = GLConstants.COLOR_ATTACHMENT1_WEBGL;
  readonly COLOR_ATTACHMENT2_WEBGL = GLConstants.COLOR_ATTACHMENT2_WEBGL;
  readonly COLOR_ATTACHMENT3_WEBGL = GLConstants.COLOR_ATTACHMENT3_WEBGL;
  readonly COLOR_ATTACHMENT4_WEBGL = GLConstants.COLOR_ATTACHMENT4_WEBGL;
  readonly COLOR_ATTACHMENT5_WEBGL = GLConstants.COLOR_ATTACHMENT5_WEBGL;
  readonly COLOR_ATTACHMENT6_WEBGL = GLConstants.COLOR_ATTACHMENT6_WEBGL;
  readonly COLOR_ATTACHMENT7_WEBGL = GLConstants.COLOR_ATTACHMENT7_WEBGL;
  readonly COLOR_ATTACHMENT8_WEBGL = GLConstants.COLOR_ATTACHMENT8_WEBGL;
  readonly COLOR_ATTACHMENT9_WEBGL = GLConstants.COLOR_ATTACHMENT9_WEBGL;
  readonly DRAW_BUFFER0_WEBGL = GLConstants.DRAW_BUFFER0_WEBGL;
  readonly DRAW_BUFFER10_WEBGL = GLConstants.DRAW_BUFFER10_WEBGL;
  readonly DRAW_BUFFER11_WEBGL = GLConstants.DRAW_BUFFER11_WEBGL;
  readonly DRAW_BUFFER12_WEBGL = GLConstants.DRAW_BUFFER12_WEBGL;
  readonly DRAW_BUFFER13_WEBGL = GLConstants.DRAW_BUFFER13_WEBGL;
  readonly DRAW_BUFFER14_WEBGL = GLConstants.DRAW_BUFFER14_WEBGL;
  readonly DRAW_BUFFER15_WEBGL = GLConstants.DRAW_BUFFER15_WEBGL;
  readonly DRAW_BUFFER1_WEBGL = GLConstants.DRAW_BUFFER1_WEBGL;
  readonly DRAW_BUFFER2_WEBGL = GLConstants.DRAW_BUFFER2_WEBGL;
  readonly DRAW_BUFFER3_WEBGL = GLConstants.DRAW_BUFFER3_WEBGL;
  readonly DRAW_BUFFER4_WEBGL = GLConstants.DRAW_BUFFER4_WEBGL;
  readonly DRAW_BUFFER5_WEBGL = GLConstants.DRAW_BUFFER5_WEBGL;
  readonly DRAW_BUFFER6_WEBGL = GLConstants.DRAW_BUFFER6_WEBGL;
  readonly DRAW_BUFFER7_WEBGL = GLConstants.DRAW_BUFFER7_WEBGL;
  readonly DRAW_BUFFER8_WEBGL = GLConstants.DRAW_BUFFER8_WEBGL;
  readonly DRAW_BUFFER9_WEBGL = GLConstants.DRAW_BUFFER9_WEBGL;
  readonly MAX_COLOR_ATTACHMENTS_WEBGL = GLConstants.MAX_COLOR_ATTACHMENTS_WEBGL;
  readonly MAX_DRAW_BUFFERS_WEBGL = GLConstants.MAX_DRAW_BUFFERS_WEBGL;

  public constructor(id: number, context: WebGLRenderingContextPolyfill) {
    super(id, context);
  }

  drawBuffersWEBGL(buffers: GLenum[]): void {
    this[TransferrableKeys.mutated]('drawBuffersWEBGL', arguments);
  }
}

export class ANGLEInstancedArrays extends TransferrableGLExtension implements ANGLE_instanced_arrays {
  public readonly VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE = GLConstants.VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE;

  public constructor(id: number, context: WebGLRenderingContextPolyfill) {
    super(id, context);
  }

  drawArraysInstancedANGLE(mode: GLenum, first: GLint, count: GLsizei, primcount: GLsizei): void {
    this[TransferrableKeys.mutated]('drawArraysInstancedANGLE', arguments);
  }

  drawElementsInstancedANGLE(mode: GLenum, count: GLsizei, type: GLenum, offset: GLintptr, primcount: GLsizei): void {
    this[TransferrableKeys.mutated]('drawElementsInstancedANGLE', arguments);
  }

  vertexAttribDivisorANGLE(index: GLuint, divisor: GLuint): void {
    this[TransferrableKeys.mutated]('vertexAttribDivisorANGLE', arguments);
  }
}

export class OVRMultiview2 extends TransferrableGLExtension implements OVR_multiview2 {
  readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_NUM_VIEWS_OVR = GLConstants.FRAMEBUFFER_ATTACHMENT_TEXTURE_NUM_VIEWS_OVR;
  readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_BASE_VIEW_INDEX_OVR = GLConstants.FRAMEBUFFER_ATTACHMENT_TEXTURE_BASE_VIEW_INDEX_OVR;
  readonly MAX_VIEWS_OVR = GLConstants.MAX_VIEWS_OVR;
  readonly FRAMEBUFFER_INCOMPLETE_VIEW_TARGETS_OVR = GLConstants.FRAMEBUFFER_INCOMPLETE_VIEW_TARGETS_OVR;

  public constructor(id: number, context: WebGLRenderingContextPolyfill) {
    super(id, context);
  }

  framebufferTextureMultiviewOVR(
    target: GLenum,
    attachment: GLenum,
    texture: WebGLTexture | null,
    level: GLint,
    baseViewIndex: GLint,
    numViews: GLsizei,
  ): void {
    this[TransferrableKeys.mutated]('framebufferTextureMultiviewOVR', arguments);
  }
}

export class OESVertexArrayObject extends TransferrableGLExtension implements OES_vertex_array_object {
  readonly VERTEX_ARRAY_BINDING_OES = GLConstants.VERTEX_ARRAY_BINDING_OES;

  public constructor(id: number, context: WebGLRenderingContextPolyfill) {
    super(id, context);
  }

  bindVertexArrayOES(arrayObject: GLVertexArrayObjectOES | null): void {
    this[TransferrableKeys.mutated]('bindVertexArrayOES', arguments);
  }

  createVertexArrayOES(): GLVertexArrayObjectOES | null {
    return this.createObjectReference('createVertexArrayOES', [], (id) => new GLVertexArrayObjectOES(id));
  }

  deleteVertexArrayOES(arrayObject: GLVertexArrayObjectOES | null): void {
    if (!arrayObject || arrayObject.isDeleted()) return;
    this[TransferrableKeys.mutated]('deleteVertexArrayOES', arguments);
    this.deleteObjectReference(arrayObject.id);

    arrayObject.delete();
  }

  isVertexArrayOES(arrayObject: GLVertexArrayObjectOES | null): GLboolean {
    return arrayObject != null && arrayObject instanceof GLVertexArrayObjectOES && !arrayObject.isDeleted();
  }
}

export class WEBGLLoseContext extends TransferrableGLExtension implements WEBGL_lose_context {
  loseContext(): void {
    this[TransferrableKeys.mutated]('loseContext', []);
  }

  restoreContext(): void {
    this[TransferrableKeys.mutated]('restoreContext', []);
  }
}

export class EXTDisjointTimerQuery extends TransferrableGLExtension /* implements EXT_disjoint_timer_query */ {
  readonly GPU_DISJOINT_EXT = GLConstants.GPU_DISJOINT_EXT;
  readonly QUERY_COUNTER_BITS_EXT = GLConstants.QUERY_COUNTER_BITS_EXT;
  readonly QUERY_RESULT_AVAILABLE_EXT = GLConstants.QUERY_RESULT_AVAILABLE_EXT;
  readonly QUERY_RESULT_EXT = GLConstants.QUERY_RESULT_EXT;
  readonly TIMESTAMP_EXT = GLConstants.TIMESTAMP_EXT;
  readonly TIME_ELAPSED_EXT = GLConstants.TIME_ELAPSED_EXT;

  public constructor(id: number, context: WebGLRenderingContextPolyfill) {
    super(id, context);
  }

  beginQueryEXT(target: number, query: vGLQuery): void {
    this[TransferrableKeys.mutated]('beginQueryEXT', arguments);
  }

  createQueryEXT(): vGLQuery {
    return this.createObjectReference('createQueryEXT', [], (id) => new vGLQuery(id));
  }

  deleteQueryEXT(query: vGLQuery): void {
    if (!query || query.isDeleted()) return;

    this[TransferrableKeys.mutated]('deleteQueryEXT', arguments);
    this.deleteObjectReference(query.id);

    query.delete();
  }

  endQueryEXT(target: number): void {
    this[TransferrableKeys.mutated]('endQueryEXT', arguments);
  }

  getQueryEXT(target: number, pname: number): any {
    throw new Error('NOT IMPLEMENTED');
  }

  getQueryObjectEXT(query: vGLQuery, target: number): any {
    throw new Error('NOT IMPLEMENTED');
  }

  queryCounterEXT(query: vGLQuery, target: number): void {
    this[TransferrableKeys.mutated]('queryCounterEXT', arguments);
  }

  isQueryEXT(query: vGLQuery): boolean {
    return query != null && query instanceof vGLQuery && !query.isDeleted();
  }
}

export class WEBGLMultiDraw extends TransferrableGLExtension implements WEBGL_multi_draw {
  multiDrawArraysInstancedWEBGL(
    mode: GLenum,
    firstsList: Int32Array | GLint[],
    firstsOffset: GLuint,
    countsList: Int32Array | GLsizei[],
    countsOffset: GLuint,
    instanceCountsList: Int32Array | GLsizei[],
    instanceCountsOffset: GLuint,
    drawcount: GLsizei,
  ): void {
    this[TransferrableKeys.mutated]('multiDrawArraysInstancedWEBGL', arguments);
  }

  multiDrawArraysWEBGL(
    mode: GLenum,
    firstsList: Int32Array | GLint[],
    firstsOffset: GLuint,
    countsList: Int32Array | GLsizei[],
    countsOffset: GLuint,
    drawcount: GLsizei,
  ): void {
    this[TransferrableKeys.mutated]('multiDrawArraysWEBGL', arguments);
  }

  multiDrawElementsInstancedWEBGL(
    mode: GLenum,
    countsList: Int32Array | GLint[],
    countsOffset: GLuint,
    type: GLenum,
    offsetsList: Int32Array | GLsizei[],
    offsetsOffset: GLuint,
    instanceCountsList: Int32Array | GLsizei[],
    instanceCountsOffset: GLuint,
    drawcount: GLsizei,
  ): void {
    this[TransferrableKeys.mutated]('multiDrawElementsInstancedWEBGL', arguments);
  }

  multiDrawElementsWEBGL(
    mode: GLenum,
    countsList: Int32Array | GLint[],
    countsOffset: GLuint,
    type: GLenum,
    offsetsList: Int32Array | GLsizei[],
    offsetsOffset: GLuint,
    drawcount: GLsizei,
  ): void {
    this[TransferrableKeys.mutated]('multiDrawElementsWEBGL', arguments);
  }
}

export class OESDrawBuffersIndexed extends TransferrableGLExtension implements OES_draw_buffers_indexed {
  blendEquationSeparateiOES(buf: GLuint, modeRGB: GLenum, modeAlpha: GLenum): void {
    this[TransferrableKeys.mutated]('multiDrawElementsInstancedWEBGL', arguments);
  }

  blendEquationiOES(buf: GLuint, mode: GLenum): void {
    this[TransferrableKeys.mutated]('blendEquationiOES', arguments);
  }

  blendFuncSeparateiOES(buf: GLuint, srcRGB: GLenum, dstRGB: GLenum, srcAlpha: GLenum, dstAlpha: GLenum): void {
    this[TransferrableKeys.mutated]('blendFuncSeparateiOES', arguments);
  }

  blendFunciOES(buf: GLuint, src: GLenum, dst: GLenum): void {
    this[TransferrableKeys.mutated]('blendFunciOES', arguments);
  }

  colorMaskiOES(buf: GLuint, r: GLboolean, g: GLboolean, b: GLboolean, a: GLboolean): void {
    this[TransferrableKeys.mutated]('colorMaskiOES', arguments);
  }

  disableiOES(target: GLenum, index: GLuint): void {
    this[TransferrableKeys.mutated]('disableiOES', arguments);
  }

  enableiOES(target: GLenum, index: GLuint): void {
    this[TransferrableKeys.mutated]('enableiOES', arguments);
  }
}
