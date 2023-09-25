export class GLConstants {
  /**
   * The following defined constants and descriptions are directly ported from https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
   *
   * These constants are defined on the WebGLRenderingContext / WebGL2RenderingContext interface
   */

  // Clearing buffers
  // Constants passed to WebGLRenderingContext.clear() to clear buffer masks

  /**
   * Passed to clear to clear the current depth buffer
   * @constant {number}
   */
  public readonly DEPTH_BUFFER_BIT: 0x00000100 = 0x00000100;
  public static readonly DEPTH_BUFFER_BIT: 0x00000100 = 0x00000100;

  /**
   * Passed to clear to clear the current stencil buffer
   * @constant {number}
   */
  public readonly STENCIL_BUFFER_BIT: 0x00000400 = 0x00000400;
  public static readonly STENCIL_BUFFER_BIT: 0x00000400 = 0x00000400;

  /**
   * Passed to clear to clear the current color buffer
   * @constant {number}
   */
  public readonly COLOR_BUFFER_BIT: 0x00004000 = 0x00004000;
  public static readonly COLOR_BUFFER_BIT: 0x00004000 = 0x00004000;

  // Rendering primitives
  // Constants passed to WebGLRenderingContext.drawElements() or WebGLRenderingContext.drawArrays() to specify what kind of primitive to render

  /**
   * Passed to drawElements or drawArrays to draw single points
   * @constant {number}
   */
  public readonly POINTS: 0x0000 = 0x0000;
  public static readonly POINTS: 0x0000 = 0x0000;

  /**
   * Passed to drawElements or drawArrays to draw lines. Each vertex connects to the one after it
   * @constant {number}
   */
  public readonly LINES: 0x0001 = 0x0001;
  public static readonly LINES: 0x0001 = 0x0001;

  /**
   * Passed to drawElements or drawArrays to draw lines. Each set of two vertices is treated as a separate line segment
   * @constant {number}
   */
  public readonly LINE_LOOP: 0x0002 = 0x0002;
  public static readonly LINE_LOOP: 0x0002 = 0x0002;

  /**
   * Passed to drawElements or drawArrays to draw a connected group of line segments from the first vertex to the last
   * @constant {number}
   */
  public readonly LINE_STRIP: 0x0003 = 0x0003;
  public static readonly LINE_STRIP: 0x0003 = 0x0003;

  /**
   * Passed to drawElements or drawArrays to draw triangles. Each set of three vertices creates a separate triangle
   * @constant {number}
   */
  public readonly TRIANGLES: 0x0004 = 0x0004;
  public static readonly TRIANGLES: 0x0004 = 0x0004;

  /**
   * Passed to drawElements or drawArrays to draw a connected group of triangles
   * @constant {number}
   */
  public readonly TRIANGLE_STRIP: 0x0005 = 0x0005;
  public static readonly TRIANGLE_STRIP: 0x0005 = 0x0005;

  /**
   * Passed to drawElements or drawArrays to draw a connected group of triangles. Each vertex connects to the previous and the first vertex in the fan
   * @constant {number}
   */
  public readonly TRIANGLE_FAN: 0x0006 = 0x0006;
  public static readonly TRIANGLE_FAN: 0x0006 = 0x0006;

  // Blending modes
  // Constants passed to WebGLRenderingContext.blendFunc() or WebGLRenderingContext.blendFuncSeparate() to specify the blending mode (for both, RBG and alpha, or separately)

  /**
   * Passed to blendFunc or blendFuncSeparate to turn off a component
   * @constant {number}
   */
  public readonly ZERO: 0 = 0;
  public static readonly ZERO: 0 = 0;

  /**
   * Passed to blendFunc or blendFuncSeparate to turn on a component
   * @constant {number}
   */
  public readonly ONE: 1 = 1;
  public static readonly ONE: 1 = 1;

  /**
   * Passed to blendFunc or blendFuncSeparate to multiply a component by the source elements color
   * @constant {number}
   */
  public readonly SRC_COLOR: 0x0300 = 0x0300;
  public static readonly SRC_COLOR: 0x0300 = 0x0300;

  /**
   * Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the source elements color
   * @constant {number}
   */
  public readonly ONE_MINUS_SRC_COLOR: 0x0301 = 0x0301;
  public static readonly ONE_MINUS_SRC_COLOR: 0x0301 = 0x0301;

  /**
   * Passed to blendFunc or blendFuncSeparate to multiply a component by the source's alpha
   * @constant {number}
   */
  public readonly SRC_ALPHA: 0x0302 = 0x0302;
  public static readonly SRC_ALPHA: 0x0302 = 0x0302;

  /**
   * Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the source's alpha
   * @constant {number}
   */
  public readonly ONE_MINUS_SRC_ALPHA: 0x0303 = 0x0303;
  public static readonly ONE_MINUS_SRC_ALPHA: 0x0303 = 0x0303;

  /**
   * Passed to blendFunc or blendFuncSeparate to multiply a component by the destination's alpha
   * @constant {number}
   */
  public readonly DST_ALPHA: 0x0304 = 0x0304;
  public static readonly DST_ALPHA: 0x0304 = 0x0304;

  /**
   * Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the destination's alpha
   * @constant {number}
   */
  public readonly ONE_MINUS_DST_ALPHA: 0x0305 = 0x0305;
  public static readonly ONE_MINUS_DST_ALPHA: 0x0305 = 0x0305;

  /**
   * Passed to blendFunc or blendFuncSeparate to multiply a component by the destination's color
   * @constant {number}
   */
  public readonly DST_COLOR: 0x0306 = 0x0306;
  public static readonly DST_COLOR: 0x0306 = 0x0306;

  /**
   * Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the destination's color
   * @constant {number}
   */
  public readonly ONE_MINUS_DST_COLOR: 0x0307 = 0x0307;
  public static readonly ONE_MINUS_DST_COLOR: 0x0307 = 0x0307;

  /**
   * Passed to blendFunc or blendFuncSeparate to multiply a component by the minimum of source's alpha or one minus the destination's alpha
   * @constant {number}
   */
  public readonly SRC_ALPHA_SATURATE: 0x0308 = 0x0308;
  public static readonly SRC_ALPHA_SATURATE: 0x0308 = 0x0308;

  /**
   * Passed to blendFunc or blendFuncSeparate to specify a constant color blend function
   * @constant {number}
   */
  public readonly CONSTANT_COLOR: 0x8001 = 0x8001;
  public static readonly CONSTANT_COLOR: 0x8001 = 0x8001;

  /**
   * Passed to blendFunc or blendFuncSeparate to specify one minus a constant color blend function
   * @constant {number}
   */
  public readonly ONE_MINUS_CONSTANT_COLOR: 0x8002 = 0x8002;
  public static readonly ONE_MINUS_CONSTANT_COLOR: 0x8002 = 0x8002;

  /**
   * Passed to blendFunc or blendFuncSeparate to specify a constant alpha blend function
   * @constant {number}
   */
  public readonly CONSTANT_ALPHA: 0x8003 = 0x8003;
  public static readonly CONSTANT_ALPHA: 0x8003 = 0x8003;

  /**
   * Passed to blendFunc or blendFuncSeparate to specify one minus a constant alpha blend function
   * @constant {number}
   */
  public readonly ONE_MINUS_CONSTANT_ALPHA: 0x8004 = 0x8004;
  public static readonly ONE_MINUS_CONSTANT_ALPHA: 0x8004 = 0x8004;

  // Blending equations
  // Constants passed to WebGLRenderingContext.blendEquation() or WebGLRenderingContext.blendEquationSeparate() to control how the blending is calculated (for both, RBG and alpha, or separately)

  /**
   * Passed to blendEquation or blendEquationSeparate to set an addition blend function
   * @constant {number}
   */
  public readonly FUNC_ADD: 0x8006 = 0x8006;
  public static readonly FUNC_ADD: 0x8006 = 0x8006;

  /**
   * Passed to blendEquation or blendEquationSeparate to specify a subtraction blend function (source - destination)
   * @constant {number}
   */
  public readonly FUNC_SUBSTRACT: 0x800a = 0x800a;
  public static readonly FUNC_SUBSTRACT: 0x800a = 0x800a;
  public readonly FUNC_SUBTRACT: 0x800a = 0x800a;
  public static readonly FUNC_SUBTRACT: 0x800a = 0x800a;

  /**
   * Passed to blendEquation or blendEquationSeparate to specify a reverse subtraction blend function (destination - source)
   * @constant {number}
   */
  public readonly FUNC_REVERSE_SUBTRACT: 0x800b = 0x800b;
  public static readonly FUNC_REVERSE_SUBTRACT: 0x800b = 0x800b;

  // Getting GL parameter information
  // Constants passed to WebGLRenderingContext.getParameter() to specify what information to return

  /**
   * Passed to getParameter to get the current RGB blend function
   * @constant {number}
   */
  public readonly BLEND_EQUATION: 0x8009 = 0x8009;
  public static readonly BLEND_EQUATION: 0x8009 = 0x8009;

  /**
   * Passed to getParameter to get the current RGB blend function. Same as BLEND_EQUATION
   * @constant {number}
   */
  public readonly BLEND_EQUATION_RGB: 0x8009 = 0x8009;
  public static readonly BLEND_EQUATION_RGB: 0x8009 = 0x8009;

  /**
   * Passed to getParameter to get the current alpha blend function. Same as BLEND_EQUATION
   * @constant {number}
   */
  public readonly BLEND_EQUATION_ALPHA: 0x883d = 0x883d;
  public static readonly BLEND_EQUATION_ALPHA: 0x883d = 0x883d;

  /**
   * Passed to getParameter to get the current destination RGB blend function
   * @constant {number}
   */
  public readonly BLEND_DST_RGB: 0x80c8 = 0x80c8;
  public static readonly BLEND_DST_RGB: 0x80c8 = 0x80c8;

  /**
   * Passed to getParameter to get the current source RGB blend function
   * @constant {number}
   */
  public readonly BLEND_SRC_RGB: 0x80c9 = 0x80c9;
  public static readonly BLEND_SRC_RGB: 0x80c9 = 0x80c9;

  /**
   * Passed to getParameter to get the current destination alpha blend function
   * @constant {number}
   */
  public readonly BLEND_DST_ALPHA: 0x80ca = 0x80ca;
  public static readonly BLEND_DST_ALPHA: 0x80ca = 0x80ca;

  /**
   * Passed to getParameter to get the current source alpha blend function
   * @constant {number}
   */
  public readonly BLEND_SRC_ALPHA: 0x80cb = 0x80cb;
  public static readonly BLEND_SRC_ALPHA: 0x80cb = 0x80cb;

  /**
   * Passed to getParameter to return a the current blend color
   * @constant {number}
   */
  public readonly BLEND_COLOR: 0x8005 = 0x8005;
  public static readonly BLEND_COLOR: 0x8005 = 0x8005;

  /**
   * Passed to getParameter to get the array buffer binding
   * @constant {number}
   */
  public readonly ARRAY_BUFFER_BINDING: 0x8894 = 0x8894;
  public static readonly ARRAY_BUFFER_BINDING: 0x8894 = 0x8894;

  /**
   * Passed to getParameter to get the current element array buffer
   * @constant {number}
   */
  public readonly ELEMENT_ARRAY_BUFFER_BINDING: 0x8895 = 0x8895;
  public static readonly ELEMENT_ARRAY_BUFFER_BINDING: 0x8895 = 0x8895;

  /**
   * Passed to getParameter to get the current lineWidth (set by the lineWidth method)
   * @constant {number}
   */
  public readonly LINE_WIDTH: 0x0b21 = 0x0b21;
  public static readonly LINE_WIDTH: 0x0b21 = 0x0b21;

  /**
   * Passed to getParameter to get the current size of a point drawn with gl.POINTS
   * @constant {number}
   */
  public readonly ALIASED_POINT_SIZE_RANGE: 0x846d = 0x846d;
  public static readonly ALIASED_POINT_SIZE_RANGE: 0x846d = 0x846d;

  /**
   * Passed to getParameter to get the range of available widths for a line. Returns a length-2 array with the lo value at 0, and hight at 1
   * @constant {number}
   */
  public readonly ALIASED_LINE_WIDTH_RANGE: 0x846e = 0x846e;
  public static readonly ALIASED_LINE_WIDTH_RANGE: 0x846e = 0x846e;

  /**
   * Passed to getParameter to get the current value of cullFace. Should return FRONT, BACK, or FRONT_AND_BACK
   * @constant {number}
   */
  public readonly CULL_FACE_MODE: 0x0b45 = 0x0b45;
  public static readonly CULL_FACE_MODE: 0x0b45 = 0x0b45;

  /**
   * Passed to getParameter to determine the current value of frontFace. Should return CW or CCW
   * @constant {number}
   */
  public readonly FRONT_FACE: 0x0b46 = 0x0b46;
  public static readonly FRONT_FACE: 0x0b46 = 0x0b46;

  /**
   * Passed to getParameter to return a length-2 array of floats giving the current depth range
   * @constant {number}
   */
  public readonly DEPTH_RANGE: 0x0b70 = 0x0b70;
  public static readonly DEPTH_RANGE: 0x0b70 = 0x0b70;

  /**
   * Passed to getParameter to determine if the depth write mask is enabled
   * @constant {number}
   */
  public readonly DEPTH_WRITEMASK: 0x0b72 = 0x0b72;
  public static readonly DEPTH_WRITEMASK: 0x0b72 = 0x0b72;

  /**
   * Passed to getParameter to determine the current depth clear value
   * @constant {number}
   */
  public readonly DEPTH_CLEAR_VALUE: 0x0b73 = 0x0b73;
  public static readonly DEPTH_CLEAR_VALUE: 0x0b73 = 0x0b73;

  /**
   * Passed to getParameter to get the current depth function. Returns NEVER, ALWAYS, LESS, EQUAL, LEQUAL, GREATER, GEQUAL, or NOTEQUAL
   * @constant {number}
   */
  public readonly DEPTH_FUNC: 0x0b74 = 0x0b74;
  public static readonly DEPTH_FUNC: 0x0b74 = 0x0b74;

  /**
   * Passed to getParameter to get the value the stencil will be cleared to
   * @constant {number}
   */
  public readonly STENCIL_CLEAR_VALUE: 0x0b91 = 0x0b91;
  public static readonly STENCIL_CLEAR_VALUE: 0x0b91 = 0x0b91;

  /**
   * Passed to getParameter to get the current stencil function. Returns NEVER, ALWAYS, LESS, EQUAL, LEQUAL, GREATER, GEQUAL, or NOTEQUAL
   * @constant {number}
   */
  public readonly STENCIL_FUNC: 0x0b92 = 0x0b92;
  public static readonly STENCIL_FUNC: 0x0b92 = 0x0b92;

  /**
   * Passed to getParameter to get the current stencil fail function. Should return KEEP, REPLACE, INCR, DECR, INVERT, INCR_WRAP, or DECR_WRAP
   * @constant {number}
   */
  public readonly STENCIL_FAIL: 0x0b94 = 0x0b94;
  public static readonly STENCIL_FAIL: 0x0b94 = 0x0b94;

  /**
   * Passed to getParameter to get the current stencil fail function should the depth buffer test fail. Should return KEEP, REPLACE, INCR, DECR, INVERT, INCR_WRAP, or DECR_WRAP
   * @constant {number}
   */
  public readonly STENCIL_PASS_DEPTH_FAIL: 0x0b95 = 0x0b95;
  public static readonly STENCIL_PASS_DEPTH_FAIL: 0x0b95 = 0x0b95;

  /**
   * Passed to getParameter to get the current stencil fail function should the depth buffer test pass. Should return KEEP, REPLACE, INCR, DECR, INVERT, INCR_WRAP, or DECR_WRAP
   * @constant {number}
   */
  public readonly STENCIL_PASS_DEPTH_PASS: 0x0b96 = 0x0b96;
  public static readonly STENCIL_PASS_DEPTH_PASS: 0x0b96 = 0x0b96;

  /**
   * Passed to getParameter to get the reference value used for stencil tests
   * @constant {number}
   */
  public readonly STENCIL_REF: 0x0b97 = 0x0b97;
  public static readonly STENCIL_REF: 0x0b97 = 0x0b97;

  /**
   * @constant {number}
   */
  public readonly STENCIL_VALUE_MASK: 0x0b93 = 0x0b93;
  public static readonly STENCIL_VALUE_MASK: 0x0b93 = 0x0b93;

  /**
   * @constant {number}
   */
  public readonly STENCIL_WRITEMASK: 0x0b98 = 0x0b98;
  public static readonly STENCIL_WRITEMASK: 0x0b98 = 0x0b98;

  /**
   * @constant {number}
   */
  public readonly STENCIL_BACK_FUNC: 0x8800 = 0x8800;
  public static readonly STENCIL_BACK_FUNC: 0x8800 = 0x8800;

  /**
   * @constant {number}
   */
  public readonly STENCIL_BACK_FAIL: 0x8801 = 0x8801;
  public static readonly STENCIL_BACK_FAIL: 0x8801 = 0x8801;

  /**
   * @constant {number}
   */
  public readonly STENCIL_BACK_PASS_DEPTH_FAIL: 0x8802 = 0x8802;
  public static readonly STENCIL_BACK_PASS_DEPTH_FAIL: 0x8802 = 0x8802;

  /**
   * @constant {number}
   */
  public readonly STENCIL_BACK_PASS_DEPTH_PASS: 0x8803 = 0x8803;
  public static readonly STENCIL_BACK_PASS_DEPTH_PASS: 0x8803 = 0x8803;

  /**
   * @constant {number}
   */
  public readonly STENCIL_BACK_REF: 0x8ca3 = 0x8ca3;
  public static readonly STENCIL_BACK_REF: 0x8ca3 = 0x8ca3;

  /**
   * @constant {number}
   */
  public readonly STENCIL_BACK_VALUE_MASK: 0x8ca4 = 0x8ca4;
  public static readonly STENCIL_BACK_VALUE_MASK: 0x8ca4 = 0x8ca4;

  /**
   * @constant {number}
   */
  public readonly STENCIL_BACK_WRITEMASK: 0x8ca5 = 0x8ca5;
  public static readonly STENCIL_BACK_WRITEMASK: 0x8ca5 = 0x8ca5;

  /**
   * Returns an Int32Array with four elements for the current viewport dimensions
   * @constant {number}
   */
  public readonly VIEWPORT: 0x0ba2 = 0x0ba2;
  public static readonly VIEWPORT: 0x0ba2 = 0x0ba2;

  /**
   * Returns an Int32Array with four elements for the current scissor box dimensions
   * @constant {number}
   */
  public readonly SCISSOR_BOX: 0x0c10 = 0x0c10;
  public static readonly SCISSOR_BOX: 0x0c10 = 0x0c10;

  /**
   * @constant {number}
   */
  public readonly COLOR_CLEAR_VALUE: 0x0c22 = 0x0c22;
  public static readonly COLOR_CLEAR_VALUE: 0x0c22 = 0x0c22;

  /**
   * @constant {number}
   */
  public readonly COLOR_WRITEMASK: 0x0c23 = 0x0c23;
  public static readonly COLOR_WRITEMASK: 0x0c23 = 0x0c23;

  /**
   * @constant {number}
   */
  public readonly UNPACK_ALIGNMENT: 0x0cf5 = 0x0cf5;
  public static readonly UNPACK_ALIGNMENT: 0x0cf5 = 0x0cf5;

  /**
   * @constant {number}
   */
  public readonly PACK_ALIGNMENT: 0x0d05 = 0x0d05;
  public static readonly PACK_ALIGNMENT: 0x0d05 = 0x0d05;

  /**
   * @constant {number}
   */
  public readonly MAX_TEXTURE_SIZE: 0x0d33 = 0x0d33;
  public static readonly MAX_TEXTURE_SIZE: 0x0d33 = 0x0d33;

  /**
   * @constant {number}
   */
  public readonly MAX_VIEWPORT_DIMS: 0x0d3a = 0x0d3a;
  public static readonly MAX_VIEWPORT_DIMS: 0x0d3a = 0x0d3a;

  /**
   * @constant {number}
   */
  public readonly SUBPIXEL_BITS: 0x0d50 = 0x0d50;
  public static readonly SUBPIXEL_BITS: 0x0d50 = 0x0d50;

  /**
   * @constant {number}
   */
  public readonly RED_BITS: 0x0d52 = 0x0d52;
  public static readonly RED_BITS: 0x0d52 = 0x0d52;

  /**
   * @constant {number}
   */
  public readonly GREEN_BITS: 0x0d53 = 0x0d53;
  public static readonly GREEN_BITS: 0x0d53 = 0x0d53;

  /**
   * @constant {number}
   */
  public readonly BLUE_BITS: 0x0d54 = 0x0d54;
  public static readonly BLUE_BITS: 0x0d54 = 0x0d54;

  /**
   * @constant {number}
   */
  public readonly ALPHA_BITS: 0x0d55 = 0x0d55;
  public static readonly ALPHA_BITS: 0x0d55 = 0x0d55;

  /**
   * @constant {number}
   */
  public readonly DEPTH_BITS: 0x0d56 = 0x0d56;
  public static readonly DEPTH_BITS: 0x0d56 = 0x0d56;

  /**
   * @constant {number}
   */
  public readonly STENCIL_BITS: 0x0d57 = 0x0d57;
  public static readonly STENCIL_BITS: 0x0d57 = 0x0d57;

  /**
   * @constant {number}
   */
  public readonly POLYGON_OFFSET_UNITS: 0x2a00 = 0x2a00;
  public static readonly POLYGON_OFFSET_UNITS: 0x2a00 = 0x2a00;

  /**
   * @constant {number}
   */
  public readonly POLYGON_OFFSET_FACTOR: 0x8038 = 0x8038;
  public static readonly POLYGON_OFFSET_FACTOR: 0x8038 = 0x8038;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_BINDING_2D: 0x8069 = 0x8069;
  public static readonly TEXTURE_BINDING_2D: 0x8069 = 0x8069;

  /**
   * @constant {number}
   */
  public readonly SAMPLE_BUFFERS: 0x80a8 = 0x80a8;
  public static readonly SAMPLE_BUFFERS: 0x80a8 = 0x80a8;

  /**
   * @constant {number}
   */
  public readonly SAMPLES: 0x80a9 = 0x80a9;
  public static readonly SAMPLES: 0x80a9 = 0x80a9;

  /**
   * @constant {number}
   */
  public readonly SAMPLE_COVERAGE_VALUE: 0x80aa = 0x80aa;
  public static readonly SAMPLE_COVERAGE_VALUE: 0x80aa = 0x80aa;

  /**
   * @constant {number}
   */
  public readonly SAMPLE_COVERAGE_INVERT: 0x80ab = 0x80ab;
  public static readonly SAMPLE_COVERAGE_INVERT: 0x80ab = 0x80ab;

  /**
   * @constant {number}
   */
  public readonly COMPRESSED_TEXTURE_FORMATS: 0x86a3 = 0x86a3;
  public static readonly COMPRESSED_TEXTURE_FORMATS: 0x86a3 = 0x86a3;

  /**
   * @constant {number}
   */
  public readonly VENDOR: 0x1f00 = 0x1f00;
  public static readonly VENDOR: 0x1f00 = 0x1f00;

  /**
   * @constant {number}
   */
  public readonly RENDERER: 0x1f01 = 0x1f01;
  public static readonly RENDERER: 0x1f01 = 0x1f01;

  /**
   * @constant {number}
   */
  public readonly VERSION: 0x1f02 = 0x1f02;
  public static readonly VERSION: 0x1f02 = 0x1f02;

  /**
   * @constant {number}
   */
  public readonly IMPLEMENTATION_COLOR_READ_TYPE: 0x8b9a = 0x8b9a;
  public static readonly IMPLEMENTATION_COLOR_READ_TYPE: 0x8b9a = 0x8b9a;

  /**
   * @constant {number}
   */
  public readonly IMPLEMENTATION_COLOR_READ_FORMAT: 0x8b9b = 0x8b9b;
  public static readonly IMPLEMENTATION_COLOR_READ_FORMAT: 0x8b9b = 0x8b9b;

  /**
   * @constant {number}
   */
  public readonly BROWSER_DEFAULT_WEBGL: 0x9244 = 0x9244;
  public static readonly BROWSER_DEFAULT_WEBGL: 0x9244 = 0x9244;

  // Buffers
  // Constants passed to WebGLRenderingContext.bufferData(), WebGLRenderingContext.bufferSubData(), WebGLRenderingContext.bindBuffer(), or WebGLRenderingContext.getBufferParameter()

  /**
   * Passed to bufferData as a hint about whether the contents of the buffer are likely to be used often and not change often
   * @constant {number}
   */
  public readonly STATIC_DRAW: 0x88e4 = 0x88e4;
  public static readonly STATIC_DRAW: 0x88e4 = 0x88e4;

  /**
   * Passed to bufferData as a hint about whether the contents of the buffer are likely to not be used often
   * @constant {number}
   */
  public readonly STREAM_DRAW: 0x88e0 = 0x88e0;
  public static readonly STREAM_DRAW: 0x88e0 = 0x88e0;

  /**
   * Passed to bufferData as a hint about whether the contents of the buffer are likely to be used often and change often
   * @constant {number}
   */
  public readonly DYNAMIC_DRAW: 0x88e8 = 0x88e8;
  public static readonly DYNAMIC_DRAW: 0x88e8 = 0x88e8;

  /**
   * Passed to bindBuffer or bufferData to specify the type of buffer being used
   * @constant {number}
   */
  public readonly ARRAY_BUFFER: 0x8892 = 0x8892;
  public static readonly ARRAY_BUFFER: 0x8892 = 0x8892;

  /**
   * Passed to bindBuffer or bufferData to specify the type of buffer being used
   * @constant {number}
   */
  public readonly ELEMENT_ARRAY_BUFFER: 0x8893 = 0x8893;
  public static readonly ELEMENT_ARRAY_BUFFER: 0x8893 = 0x8893;

  /**
   * Passed to getBufferParameter to get a buffer's size
   * @constant {number}
   */
  public readonly BUFFER_SIZE: 0x8764 = 0x8764;
  public static readonly BUFFER_SIZE: 0x8764 = 0x8764;

  /**
   * Passed to getBufferParameter to get the hint for the buffer passed in when it was created
   * @constant {number}
   */
  public readonly BUFFER_USAGE: 0x8765 = 0x8765;
  public static readonly BUFFER_USAGE: 0x8765 = 0x8765;

  // Vertex attributes
  // Constants passed to WebGLRenderingContext.getVertexAttrib()

  /**
   * Passed to getVertexAttrib to read back the current vertex attribute
   * @constant {number}
   */
  public readonly CURRENT_VERTEX_ATTRIB: 0x8626 = 0x8626;
  public static readonly CURRENT_VERTEX_ATTRIB: 0x8626 = 0x8626;

  /**
   * @constant {number}
   */
  public readonly VERTEX_ATTRIB_ARRAY_ENABLED: 0x8622 = 0x8622;
  public static readonly VERTEX_ATTRIB_ARRAY_ENABLED: 0x8622 = 0x8622;

  /**
   * @constant {number}
   */
  public readonly VERTEX_ATTRIB_ARRAY_SIZE: 0x8623 = 0x8623;
  public static readonly VERTEX_ATTRIB_ARRAY_SIZE: 0x8623 = 0x8623;

  /**
   * @constant {number}
   */
  public readonly VERTEX_ATTRIB_ARRAY_STRIDE: 0x8624 = 0x8624;
  public static readonly VERTEX_ATTRIB_ARRAY_STRIDE: 0x8624 = 0x8624;

  /**
   * @constant {number}
   */
  public readonly VERTEX_ATTRIB_ARRAY_TYPE: 0x8625 = 0x8625;
  public static readonly VERTEX_ATTRIB_ARRAY_TYPE: 0x8625 = 0x8625;

  /**
   * @constant {number}
   */
  public readonly VERTEX_ATTRIB_ARRAY_NORMALIZED: 0x886a = 0x886a;
  public static readonly VERTEX_ATTRIB_ARRAY_NORMALIZED: 0x886a = 0x886a;

  /**
   * @constant {number}
   */
  public readonly VERTEX_ATTRIB_ARRAY_POINTER: 0x8645 = 0x8645;
  public static readonly VERTEX_ATTRIB_ARRAY_POINTER: 0x8645 = 0x8645;

  /**
   * @constant {number}
   */
  public readonly VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: 0x889f = 0x889f;
  public static readonly VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: 0x889f = 0x889f;

  // Culling
  // Constants passed to WebGLRenderingContext.cullFace()

  /**
   * Passed to enable/disable to turn on/off culling. Can also be used with getParameter to find the current culling method
   * @constant {number}
   */
  public readonly CULL_FACE: 0x0b44 = 0x0b44;
  public static readonly CULL_FACE: 0x0b44 = 0x0b44;

  /**
   * Passed to cullFace to specify that only front faces should be culled
   * @constant {number}
   */
  public readonly FRONT: 0x0404 = 0x0404;
  public static readonly FRONT: 0x0404 = 0x0404;

  /**
   * Passed to cullFace to specify that only back faces should be culled
   * @constant {number}
   */
  public readonly BACK: 0x0405 = 0x0405;
  public static readonly BACK: 0x0405 = 0x0405;

  /**
   * Passed to cullFace to specify that front and back faces should be culled
   * @constant {number}
   */
  public readonly FRONT_AND_BACK: 0x0408 = 0x0408;
  public static readonly FRONT_AND_BACK: 0x0408 = 0x0408;

  // Enabling and disabling
  // Constants passed to WebGLRenderingContext.enable() or WebGLRenderingContext.disable()

  /**
   * Passed to enable/disable to turn on/off blending. Can also be used with getParameter to find the current blending method
   * @constant {number}
   */
  public readonly BLEND: 0x0be2 = 0x0be2;
  public static readonly BLEND: 0x0be2 = 0x0be2;

  /**
   * Passed to enable/disable to turn on/off the depth test. Can also be used with getParameter to query the depth test
   * @constant {number}
   */
  public readonly DEPTH_TEST: 0x0b71 = 0x0b71;
  public static readonly DEPTH_TEST: 0x0b71 = 0x0b71;

  /**
   * Passed to enable/disable to turn on/off dithering. Can also be used with getParameter to find the current dithering method
   * @constant {number}
   */
  public readonly DITHER: 0x0bd0 = 0x0bd0;
  public static readonly DITHER: 0x0bd0 = 0x0bd0;

  /**
   * Passed to enable/disable to turn on/off the polygon offset. Useful for rendering hidden-line images, decals, and or solids with highlighted edges. Can also be used with getParameter to query the scissor test
   * @constant {number}
   */
  public readonly POLYGON_OFFSET_FILL: 0x8037 = 0x8037;
  public static readonly POLYGON_OFFSET_FILL: 0x8037 = 0x8037;

  /**
   * Passed to enable/disable to turn on/off the alpha to coverage. Used in multi-sampling alpha channels
   * @constant {number}
   */
  public readonly SAMPLE_ALPHA_TO_COVERAGE: 0x809e = 0x809e;
  public static readonly SAMPLE_ALPHA_TO_COVERAGE: 0x809e = 0x809e;

  /**
   * Passed to enable/disable to turn on/off the sample coverage. Used in multi-sampling
   * @constant {number}
   */
  public readonly SAMPLE_COVERAGE: 0x80a0 = 0x80a0;
  public static readonly SAMPLE_COVERAGE: 0x80a0 = 0x80a0;

  /**
   * Passed to enable/disable to turn on/off the scissor test. Can also be used with getParameter to query the scissor test
   * @constant {number}
   */
  public readonly SCISSOR_TEST: 0x0c11 = 0x0c11;
  public static readonly SCISSOR_TEST: 0x0c11 = 0x0c11;

  /**
   * Passed to enable/disable to turn on/off the stencil test. Can also be used with getParameter to query the stencil test
   * @constant {number}
   */
  public readonly STENCIL_TEST: 0x0b90 = 0x0b90;
  public static readonly STENCIL_TEST: 0x0b90 = 0x0b90;

  // Errors
  // Constants returned from WebGLRenderingContext.getError()

  /**
   * Returned from getError
   * @constant {number}
   */
  public readonly NO_ERROR: 0 = 0;
  public static readonly NO_ERROR: 0 = 0;

  /**
   * Returned from getError
   * @constant {number}
   */
  public readonly INVALID_ENUM: 0x0500 = 0x0500;
  public static readonly INVALID_ENUM: 0x0500 = 0x0500;

  /**
   * Returned from getError
   * @constant {number}
   */
  public readonly INVALID_VALUE: 0x0501 = 0x0501;
  public static readonly INVALID_VALUE: 0x0501 = 0x0501;

  /**
   * Returned from getError
   * @constant {number}
   */
  public readonly INVALID_OPERATION: 0x0502 = 0x0502;
  public static readonly INVALID_OPERATION: 0x0502 = 0x0502;

  /**
   * Returned from getError
   * @constant {number}
   */
  public readonly OUT_OF_MEMORY: 0x0505 = 0x0505;
  public static readonly OUT_OF_MEMORY: 0x0505 = 0x0505;

  /**
   * Returned from getError
   * @constant {number}
   */
  public readonly CONTEXT_LOST_WEBGL: 0x9242 = 0x9242;
  public static readonly CONTEXT_LOST_WEBGL: 0x9242 = 0x9242;

  // Front face directions
  // Constants passed to WebGLRenderingContext.frontFace()

  /**
   * Passed to frontFace to specify the front face of a polygon is drawn in the clockwise direction,
   * @constant {number}
   */
  public readonly CW: 0x0900 = 0x0900;
  public static readonly CW: 0x0900 = 0x0900;

  /**
   * Passed to frontFace to specify the front face of a polygon is drawn in the counter clockwise direction
   * @constant {number}
   */
  public readonly CCW: 0x0901 = 0x0901;
  public static readonly CCW: 0x0901 = 0x0901;

  // Hints
  // Constants passed to WebGLRenderingContext.hint()

  /**
   * There is no preference for this behavior
   * @constant {number}
   */
  public readonly DONT_CARE: 0x1100 = 0x1100;
  public static readonly DONT_CARE: 0x1100 = 0x1100;

  /**
   * The most efficient behavior should be used
   * @constant {number}
   */
  public readonly FASTEST: 0x1101 = 0x1101;
  public static readonly FASTEST: 0x1101 = 0x1101;

  /**
   * The most correct or the highest quality option should be used
   * @constant {number}
   */
  public readonly NICEST: 0x1102 = 0x1102;
  public static readonly NICEST: 0x1102 = 0x1102;

  /**
   * Hint for the quality of filtering when generating mipmap images with WebGLRenderingContext.generateMipmap()
   * @constant {number}
   */
  public readonly GENERATE_MIPMAP_HINT: 0x8192 = 0x8192;
  public static readonly GENERATE_MIPMAP_HINT: 0x8192 = 0x8192;

  // Data types

  /**
   * @constant {number}
   */
  public readonly BYTE: 0x1400 = 0x1400;
  public static readonly BYTE: 0x1400 = 0x1400;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_BYTE: 0x1401 = 0x1401;
  public static readonly UNSIGNED_BYTE: 0x1401 = 0x1401;

  /**
   * @constant {number}
   */
  public readonly SHORT: 0x1402 = 0x1402;
  public static readonly SHORT: 0x1402 = 0x1402;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_SHORT: 0x1403 = 0x1403;
  public static readonly UNSIGNED_SHORT: 0x1403 = 0x1403;

  /**
   * @constant {number}
   */
  public readonly INT: 0x1404 = 0x1404;
  public static readonly INT: 0x1404 = 0x1404;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_INT: 0x1405 = 0x1405;
  public static readonly UNSIGNED_INT: 0x1405 = 0x1405;

  /**
   * @constant {number}
   */
  public readonly FLOAT: 0x1406 = 0x1406;
  public static readonly FLOAT: 0x1406 = 0x1406;

  // Pixel formats

  /**
   * @constant {number}
   */
  public readonly DEPTH_COMPONENT: 0x1902 = 0x1902;
  public static readonly DEPTH_COMPONENT: 0x1902 = 0x1902;

  /**
   * @constant {number}
   */
  public readonly ALPHA: 0x1906 = 0x1906;
  public static readonly ALPHA: 0x1906 = 0x1906;

  /**
   * @constant {number}
   */
  public readonly RGB: 0x1907 = 0x1907;
  public static readonly RGB: 0x1907 = 0x1907;

  /**
   * @constant {number}
   */
  public readonly RGBA: 0x1908 = 0x1908;
  public static readonly RGBA: 0x1908 = 0x1908;

  /**
   * @constant {number}
   */
  public readonly LUMINANCE: 0x1909 = 0x1909;
  public static readonly LUMINANCE: 0x1909 = 0x1909;

  /**
   * @constant {number}
   */
  public readonly LUMINANCE_ALPHA: 0x190a = 0x190a;
  public static readonly LUMINANCE_ALPHA: 0x190a = 0x190a;

  // Pixel types

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_SHORT_4_4_4_4: 0x8033 = 0x8033;
  public static readonly UNSIGNED_SHORT_4_4_4_4: 0x8033 = 0x8033;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_SHORT_5_5_5_1: 0x8034 = 0x8034;
  public static readonly UNSIGNED_SHORT_5_5_5_1: 0x8034 = 0x8034;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_SHORT_5_6_5: 0x8363 = 0x8363;
  public static readonly UNSIGNED_SHORT_5_6_5: 0x8363 = 0x8363;

  // Shaders
  // Constants passed to WebGLRenderingContext.getShaderParameter()

  /**
   * Passed to createShader to define a fragment shader
   * @constant {number}
   */
  public readonly FRAGMENT_SHADER: 0x8b30 = 0x8b30;
  public static readonly FRAGMENT_SHADER: 0x8b30 = 0x8b30;

  /**
   * Passed to createShader to define a vertex shader
   * @constant {number}
   */
  public readonly VERTEX_SHADER: 0x8b31 = 0x8b31;
  public static readonly VERTEX_SHADER: 0x8b31 = 0x8b31;

  /**
   * Passed to getShaderParamter to get the status of the compilation. Returns false if the shader was not compiled. You can then query getShaderInfoLog to find the exact error
   * @constant {number}
   */
  public readonly COMPILE_STATUS: 0x8b81 = 0x8b81;
  public static readonly COMPILE_STATUS: 0x8b81 = 0x8b81;

  /**
   * Passed to getShaderParamter to determine if a shader was deleted via deleteShader. Returns true if it was, false otherwise
   * @constant {number}
   */
  public readonly DELETE_STATUS: 0x8b80 = 0x8b80;
  public static readonly DELETE_STATUS: 0x8b80 = 0x8b80;

  /**
   * Passed to getProgramParameter after calling linkProgram to determine if a program was linked correctly. Returns false if there were errors. Use getProgramInfoLog to find the exact error
   * @constant {number}
   */
  public readonly LINK_STATUS: 0x8b82 = 0x8b82;
  public static readonly LINK_STATUS: 0x8b82 = 0x8b82;

  /**
   * Passed to getProgramParameter after calling validateProgram to determine if it is valid. Returns false if errors were found
   * @constant {number}
   */
  public readonly VALIDATE_STATUS: 0x8b83 = 0x8b83;
  public static readonly VALIDATE_STATUS: 0x8b83 = 0x8b83;

  /**
   * Passed to getProgramParameter after calling attachShader to determine if the shader was attached correctly. Returns false if errors occurred
   * @constant {number}
   */
  public readonly ATTACHED_SHADERS: 0x8b85 = 0x8b85;
  public static readonly ATTACHED_SHADERS: 0x8b85 = 0x8b85;

  /**
   * Passed to getProgramParameter to get the number of attributes active in a program
   * @constant {number}
   */
  public readonly ACTIVE_ATTRIBUTES: 0x8b89 = 0x8b89;
  public static readonly ACTIVE_ATTRIBUTES: 0x8b89 = 0x8b89;

  /**
   * Passed to getProgramParamter to get the number of uniforms active in a program
   * @constant {number}
   */
  public readonly ACTIVE_UNIFORMS: 0x8b86 = 0x8b86;
  public static readonly ACTIVE_UNIFORMS: 0x8b86 = 0x8b86;

  /**
   * The maximum number of entries possible in the vertex attribute list
   * @constant {number}
   */
  public readonly MAX_VERTEX_ATTRIBS: 0x8869 = 0x8869;
  public static readonly MAX_VERTEX_ATTRIBS: 0x8869 = 0x8869;

  /**
   * @constant {number}
   */
  public readonly MAX_VERTEX_UNIFORM_VECTORS: 0x8dfb = 0x8dfb;
  public static readonly MAX_VERTEX_UNIFORM_VECTORS: 0x8dfb = 0x8dfb;

  /**
   * @constant {number}
   */
  public readonly MAX_VARYING_VECTORS: 0x8dfc = 0x8dfc;
  public static readonly MAX_VARYING_VECTORS: 0x8dfc = 0x8dfc;

  /**
   * @constant {number}
   */
  public readonly MAX_COMBINED_TEXTURE_IMAGE_UNITS: 0x8b4d = 0x8b4d;
  public static readonly MAX_COMBINED_TEXTURE_IMAGE_UNITS: 0x8b4d = 0x8b4d;

  /**
   * @constant {number}
   */
  public readonly MAX_VERTEX_TEXTURE_IMAGE_UNITS: 0x8b4c = 0x8b4c;
  public static readonly MAX_VERTEX_TEXTURE_IMAGE_UNITS: 0x8b4c = 0x8b4c;

  /**
   * Implementation dependent number of maximum texture units. At least 8
   * @constant {number}
   */
  public readonly MAX_TEXTURE_IMAGE_UNITS: 0x8872 = 0x8872;
  public static readonly MAX_TEXTURE_IMAGE_UNITS: 0x8872 = 0x8872;

  /**
   * @constant {number}
   */
  public readonly MAX_FRAGMENT_UNIFORM_VECTORS: 0x8dfd = 0x8dfd;
  public static readonly MAX_FRAGMENT_UNIFORM_VECTORS: 0x8dfd = 0x8dfd;

  /**
   * @constant {number}
   */
  public readonly SHADER_TYPE: 0x8b4f = 0x8b4f;
  public static readonly SHADER_TYPE: 0x8b4f = 0x8b4f;

  /**
   * @constant {number}
   */
  public readonly SHADING_LANGUAGE_VERSION: 0x8b8c = 0x8b8c;
  public static readonly SHADING_LANGUAGE_VERSION: 0x8b8c = 0x8b8c;

  /**
   * @constant {number}
   */
  public readonly CURRENT_PROGRAM: 0x8b8d = 0x8b8d;
  public static readonly CURRENT_PROGRAM: 0x8b8d = 0x8b8d;

  // Depth or stencil tests
  // Constants passed to WebGLRenderingContext.stencilFunc()

  /**
   * Passed to depthFunction or stencilFunction to specify depth or stencil tests will never pass. i.e. Nothing will be drawn
   * @constant {number}
   */
  public readonly NEVER: 0x0200 = 0x0200;
  public static readonly NEVER: 0x0200 = 0x0200;

  /**
   * Passed to depthFunction or stencilFunction to specify depth or stencil tests will always pass. i.e. Pixels will be drawn in the order they are drawn
   * @constant {number}
   */
  public readonly ALWAYS: 0x0207 = 0x0207;
  public static readonly ALWAYS: 0x0207 = 0x0207;

  /**
   * Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than the stored value
   * @constant {number}
   */
  public readonly LESS: 0x0201 = 0x0201;
  public static readonly LESS: 0x0201 = 0x0201;

  /**
   * Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is equals to the stored value
   * @constant {number}
   */
  public readonly EQUAL: 0x0202 = 0x0202;
  public static readonly EQUAL: 0x0202 = 0x0202;

  /**
   *  Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than or equal to the stored value
   * @constant {number}
   */
  public readonly LEQUAL: 0x0203 = 0x0203;
  public static readonly LEQUAL: 0x0203 = 0x0203;

  /**
   * Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than the stored value
   * @constant {number}
   */
  public readonly GREATER: 0x0204 = 0x0204;
  public static readonly GREATER: 0x0204 = 0x0204;

  /**
   * Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than or equal to the stored value
   * @constant {number}
   */
  public readonly GEQUAL: 0x0206 = 0x0206;
  public static readonly GEQUAL: 0x0206 = 0x0206;

  /**
   * Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is not equal to the stored value
   * @constant {number}
   */
  public readonly NOTEQUAL: 0x0205 = 0x0205;
  public static readonly NOTEQUAL: 0x0205 = 0x0205;

  // Stencil actions
  // Constants passed to WebGLRenderingContext.stencilOp()

  /**
   * @constant {number}
   */
  public readonly KEEP: 0x1e00 = 0x1e00;
  public static readonly KEEP: 0x1e00 = 0x1e00;

  /**
   * @constant {number}
   */
  public readonly REPLACE: 0x1e01 = 0x1e01;
  public static readonly REPLACE: 0x1e01 = 0x1e01;

  /**
   * @constant {number}
   */
  public readonly INCR: 0x1e02 = 0x1e02;
  public static readonly INCR: 0x1e02 = 0x1e02;

  /**
   * @constant {number}
   */
  public readonly DECR: 0x1e03 = 0x1e03;
  public static readonly DECR: 0x1e03 = 0x1e03;

  /**
   * @constant {number}
   */
  public readonly INVERT: 0x150a = 0x150a;
  public static readonly INVERT: 0x150a = 0x150a;

  /**
   * @constant {number}
   */
  public readonly INCR_WRAP: 0x8507 = 0x8507;
  public static readonly INCR_WRAP: 0x8507 = 0x8507;

  /**
   * @constant {number}
   */
  public readonly DECR_WRAP: 0x8508 = 0x8508;
  public static readonly DECR_WRAP: 0x8508 = 0x8508;

  // Textures
  // Constants passed to WebGLRenderingContext.texParameteri(), WebGLRenderingContext.texParameterf(), WebGLRenderingContext.bindTexture(), WebGLRenderingContext.texImage2D(), and others

  /**
   * @constant {number}
   */
  public readonly NEAREST: 0x2600 = 0x2600;
  public static readonly NEAREST: 0x2600 = 0x2600;

  /**
   * @constant {number}
   */
  public readonly LINEAR: 0x2601 = 0x2601;
  public static readonly LINEAR: 0x2601 = 0x2601;

  /**
   * @constant {number}
   */
  public readonly NEAREST_MIPMAP_NEAREST: 0x2700 = 0x2700;
  public static readonly NEAREST_MIPMAP_NEAREST: 0x2700 = 0x2700;

  /**
   * @constant {number}
   */
  public readonly LINEAR_MIPMAP_NEAREST: 0x2701 = 0x2701;
  public static readonly LINEAR_MIPMAP_NEAREST: 0x2701 = 0x2701;

  /**
   * @constant {number}
   */
  public readonly NEAREST_MIPMAP_LINEAR: 0x2702 = 0x2702;
  public static readonly NEAREST_MIPMAP_LINEAR: 0x2702 = 0x2702;

  /**
   * @constant {number}
   */
  public readonly LINEAR_MIPMAP_LINEAR: 0x2703 = 0x2703;
  public static readonly LINEAR_MIPMAP_LINEAR: 0x2703 = 0x2703;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_MAG_FILTER: 0x2800 = 0x2800;
  public static readonly TEXTURE_MAG_FILTER: 0x2800 = 0x2800;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_MIN_FILTER: 0x2801 = 0x2801;
  public static readonly TEXTURE_MIN_FILTER: 0x2801 = 0x2801;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_WRAP_S: 0x2802 = 0x2802;
  public static readonly TEXTURE_WRAP_S: 0x2802 = 0x2802;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_WRAP_T: 0x2803 = 0x2803;
  public static readonly TEXTURE_WRAP_T: 0x2803 = 0x2803;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_2D: 0x0de1 = 0x0de1;
  public static readonly TEXTURE_2D: 0x0de1 = 0x0de1;

  /**
   * @constant {number}
   */
  public readonly TEXTURE: 0x1702 = 0x1702;
  public static readonly TEXTURE: 0x1702 = 0x1702;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_CUBE_MAP: 0x8513 = 0x8513;
  public static readonly TEXTURE_CUBE_MAP: 0x8513 = 0x8513;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_BINDING_CUBE_MAP: 0x8514 = 0x8514;
  public static readonly TEXTURE_BINDING_CUBE_MAP: 0x8514 = 0x8514;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_CUBE_MAP_POSITIVE_X: 0x8515 = 0x8515;
  public static readonly TEXTURE_CUBE_MAP_POSITIVE_X: 0x8515 = 0x8515;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_CUBE_MAP_NEGATIVE_X: 0x8516 = 0x8516;
  public static readonly TEXTURE_CUBE_MAP_NEGATIVE_X: 0x8516 = 0x8516;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_CUBE_MAP_POSITIVE_Y: 0x8517 = 0x8517;
  public static readonly TEXTURE_CUBE_MAP_POSITIVE_Y: 0x8517 = 0x8517;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_CUBE_MAP_NEGATIVE_Y: 0x8518 = 0x8518;
  public static readonly TEXTURE_CUBE_MAP_NEGATIVE_Y: 0x8518 = 0x8518;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_CUBE_MAP_POSITIVE_Z: 0x8519 = 0x8519;
  public static readonly TEXTURE_CUBE_MAP_POSITIVE_Z: 0x8519 = 0x8519;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_CUBE_MAP_NEGATIVE_Z: 0x851a = 0x851a;
  public static readonly TEXTURE_CUBE_MAP_NEGATIVE_Z: 0x851a = 0x851a;

  /**
   * @constant {number}
   */
  public readonly MAX_CUBE_MAP_TEXTURE_SIZE: 0x851c = 0x851c;
  public static readonly MAX_CUBE_MAP_TEXTURE_SIZE: 0x851c = 0x851c;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE0: 0x84c0 = 0x84c0;
  public static readonly TEXTURE0: 0x84c0 = 0x84c0;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE1: 0x84c1 = 0x84c1;
  public static readonly TEXTURE1: 0x84c1 = 0x84c1;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE2: 0x84c2 = 0x84c2;
  public static readonly TEXTURE2: 0x84c2 = 0x84c2;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE3: 0x84c3 = 0x84c3;
  public static readonly TEXTURE3: 0x84c3 = 0x84c3;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE4: 0x84c4 = 0x84c4;
  public static readonly TEXTURE4: 0x84c4 = 0x84c4;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE5: 0x84c5 = 0x84c5;
  public static readonly TEXTURE5: 0x84c5 = 0x84c5;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE6: 0x84c6 = 0x84c6;
  public static readonly TEXTURE6: 0x84c6 = 0x84c6;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE7: 0x84c7 = 0x84c7;
  public static readonly TEXTURE7: 0x84c7 = 0x84c7;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE8: 0x84c8 = 0x84c8;
  public static readonly TEXTURE8: 0x84c8 = 0x84c8;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE9: 0x84c9 = 0x84c9;
  public static readonly TEXTURE9: 0x84c9 = 0x84c9;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE10: 0x84ca = 0x84ca;
  public static readonly TEXTURE10: 0x84ca = 0x84ca;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE11: 0x84cb = 0x84cb;
  public static readonly TEXTURE11: 0x84cb = 0x84cb;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE12: 0x84cc = 0x84cc;
  public static readonly TEXTURE12: 0x84cc = 0x84cc;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE13: 0x84cd = 0x84cd;
  public static readonly TEXTURE13: 0x84cd = 0x84cd;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE14: 0x84ce = 0x84ce;
  public static readonly TEXTURE14: 0x84ce = 0x84ce;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE15: 0x84cf = 0x84cf;
  public static readonly TEXTURE15: 0x84cf = 0x84cf;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE16: 0x84d0 = 0x84d0;
  public static readonly TEXTURE16: 0x84d0 = 0x84d0;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE17: 0x84d1 = 0x84d1;
  public static readonly TEXTURE17: 0x84d1 = 0x84d1;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE18: 0x84d2 = 0x84d2;
  public static readonly TEXTURE18: 0x84d2 = 0x84d2;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE19: 0x84d3 = 0x84d3;
  public static readonly TEXTURE19: 0x84d3 = 0x84d3;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE20: 0x84d4 = 0x84d4;
  public static readonly TEXTURE20: 0x84d4 = 0x84d4;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE21: 0x84d5 = 0x84d5;
  public static readonly TEXTURE21: 0x84d5 = 0x84d5;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE22: 0x84d6 = 0x84d6;
  public static readonly TEXTURE22: 0x84d6 = 0x84d6;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE23: 0x84d7 = 0x84d7;
  public static readonly TEXTURE23: 0x84d7 = 0x84d7;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE24: 0x84d8 = 0x84d8;
  public static readonly TEXTURE24: 0x84d8 = 0x84d8;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE25: 0x84d9 = 0x84d9;
  public static readonly TEXTURE25: 0x84d9 = 0x84d9;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE26: 0x84da = 0x84da;
  public static readonly TEXTURE26: 0x84da = 0x84da;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE27: 0x84db = 0x84db;
  public static readonly TEXTURE27: 0x84db = 0x84db;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE28: 0x84dc = 0x84dc;
  public static readonly TEXTURE28: 0x84dc = 0x84dc;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE29: 0x84dd = 0x84dd;
  public static readonly TEXTURE29: 0x84dd = 0x84dd;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE30: 0x84de = 0x84de;
  public static readonly TEXTURE30: 0x84de = 0x84de;

  /**
   * A texture unit
   * @constant {number}
   */
  public readonly TEXTURE31: 0x84df = 0x84df;
  public static readonly TEXTURE31: 0x84df = 0x84df;

  /**
   * The current active texture unit
   * @constant {number}
   */
  public readonly ACTIVE_TEXTURE: 0x84e0 = 0x84e0;
  public static readonly ACTIVE_TEXTURE: 0x84e0 = 0x84e0;

  /**
   * @constant {number}
   */
  public readonly REPEAT: 0x2901 = 0x2901;
  public static readonly REPEAT: 0x2901 = 0x2901;

  /**
   * @constant {number}
   */
  public readonly CLAMP_TO_EDGE: 0x812f = 0x812f;
  public static readonly CLAMP_TO_EDGE: 0x812f = 0x812f;

  /**
   * @constant {number}
   */
  public readonly MIRRORED_REPEAT: 0x8370 = 0x8370;
  public static readonly MIRRORED_REPEAT: 0x8370 = 0x8370;

  // Uniform types

  /**
   * @constant {number}
   */
  public readonly FLOAT_VEC2: 0x8b50 = 0x8b50;
  public static readonly FLOAT_VEC2: 0x8b50 = 0x8b50;

  /**
   * @constant {number}
   */
  public readonly FLOAT_VEC3: 0x8b51 = 0x8b51;
  public static readonly FLOAT_VEC3: 0x8b51 = 0x8b51;

  /**
   * @constant {number}
   */
  public readonly FLOAT_VEC4: 0x8b52 = 0x8b52;
  public static readonly FLOAT_VEC4: 0x8b52 = 0x8b52;

  /**
   * @constant {number}
   */
  public readonly INT_VEC2: 0x8b53 = 0x8b53;
  public static readonly INT_VEC2: 0x8b53 = 0x8b53;

  /**
   * @constant {number}
   */
  public readonly INT_VEC3: 0x8b54 = 0x8b54;
  public static readonly INT_VEC3: 0x8b54 = 0x8b54;

  /**
   * @constant {number}
   */
  public readonly INT_VEC4: 0x8b55 = 0x8b55;
  public static readonly INT_VEC4: 0x8b55 = 0x8b55;

  /**
   * @constant {number}
   */
  public readonly BOOL: 0x8b56 = 0x8b56;
  public static readonly BOOL: 0x8b56 = 0x8b56;

  /**
   * @constant {number}
   */
  public readonly BOOL_VEC2: 0x8b57 = 0x8b57;
  public static readonly BOOL_VEC2: 0x8b57 = 0x8b57;

  /**
   * @constant {number}
   */
  public readonly BOOL_VEC3: 0x8b58 = 0x8b58;
  public static readonly BOOL_VEC3: 0x8b58 = 0x8b58;

  /**
   * @constant {number}
   */
  public readonly BOOL_VEC4: 0x8b59 = 0x8b59;
  public static readonly BOOL_VEC4: 0x8b59 = 0x8b59;

  /**
   * @constant {number}
   */
  public readonly FLOAT_MAT2: 0x8b5a = 0x8b5a;
  public static readonly FLOAT_MAT2: 0x8b5a = 0x8b5a;

  /**
   * @constant {number}
   */
  public readonly FLOAT_MAT3: 0x8b5b = 0x8b5b;
  public static readonly FLOAT_MAT3: 0x8b5b = 0x8b5b;

  /**
   * @constant {number}
   */
  public readonly FLOAT_MAT4: 0x8b5c = 0x8b5c;
  public static readonly FLOAT_MAT4: 0x8b5c = 0x8b5c;

  /**
   * @constant {number}
   */
  public readonly SAMPLER_2D: 0x8b5e = 0x8b5e;
  public static readonly SAMPLER_2D: 0x8b5e = 0x8b5e;

  /**
   * @constant {number}
   */
  public readonly SAMPLER_CUBE: 0x8b60 = 0x8b60;
  public static readonly SAMPLER_CUBE: 0x8b60 = 0x8b60;

  // Shader precision-specified types

  /**
   * @constant {number}
   */
  public readonly LOW_FLOAT: 0x8df0 = 0x8df0;
  public static readonly LOW_FLOAT: 0x8df0 = 0x8df0;

  /**
   * @constant {number}
   */
  public readonly MEDIUM_FLOAT: 0x8df1 = 0x8df1;
  public static readonly MEDIUM_FLOAT: 0x8df1 = 0x8df1;

  /**
   * @constant {number}
   */
  public readonly HIGH_FLOAT: 0x8df2 = 0x8df2;
  public static readonly HIGH_FLOAT: 0x8df2 = 0x8df2;

  /**
   * @constant {number}
   */
  public readonly LOW_INT: 0x8df3 = 0x8df3;
  public static readonly LOW_INT: 0x8df3 = 0x8df3;

  /**
   * @constant {number}
   */
  public readonly MEDIUM_INT: 0x8df4 = 0x8df4;
  public static readonly MEDIUM_INT: 0x8df4 = 0x8df4;

  /**
   * @constant {number}
   */
  public readonly HIGH_INT: 0x8df5 = 0x8df5;
  public static readonly HIGH_INT: 0x8df5 = 0x8df5;

  // Framebuffers and renderbuffers

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER: 0x8d40 = 0x8d40;
  public static readonly FRAMEBUFFER: 0x8d40 = 0x8d40;

  /**
   * @constant {number}
   */
  public readonly RENDERBUFFER: 0x8d41 = 0x8d41;
  public static readonly RENDERBUFFER: 0x8d41 = 0x8d41;

  /**
   * @constant {number}
   */
  public readonly RGBA4: 0x8056 = 0x8056;
  public static readonly RGBA4: 0x8056 = 0x8056;

  /**
   * @constant {number}
   */
  public readonly RGB5_A1: 0x8057 = 0x8057;
  public static readonly RGB5_A1: 0x8057 = 0x8057;

  /**
   * @constant {number}
   */
  public readonly RGB565: 0x8d62 = 0x8d62;
  public static readonly RGB565: 0x8d62 = 0x8d62;

  /**
   * @constant {number}
   */
  public readonly DEPTH_COMPONENT16: 0x81a5 = 0x81a5;
  public static readonly DEPTH_COMPONENT16: 0x81a5 = 0x81a5;

  /**
   * @constant {number}
   */
  public readonly STENCIL_INDEX: 0x1901 = 0x1901;
  public static readonly STENCIL_INDEX: 0x1901 = 0x1901;

  /**
   * @constant {number}
   */
  public readonly STENCIL_INDEX8: 0x8d48 = 0x8d48;
  public static readonly STENCIL_INDEX8: 0x8d48 = 0x8d48;

  /**
   * @constant {number}
   */
  public readonly DEPTH_STENCIL: 0x84f9 = 0x84f9;
  public static readonly DEPTH_STENCIL: 0x84f9 = 0x84f9;

  /**
   * @constant {number}
   */
  public readonly RENDERBUFFER_WIDTH: 0x8d42 = 0x8d42;
  public static readonly RENDERBUFFER_WIDTH: 0x8d42 = 0x8d42;

  /**
   * @constant {number}
   */
  public readonly RENDERBUFFER_HEIGHT: 0x8d43 = 0x8d43;
  public static readonly RENDERBUFFER_HEIGHT: 0x8d43 = 0x8d43;

  /**
   * @constant {number}
   */
  public readonly RENDERBUFFER_INTERNAL_FORMAT: 0x8d44 = 0x8d44;
  public static readonly RENDERBUFFER_INTERNAL_FORMAT: 0x8d44 = 0x8d44;

  /**
   * @constant {number}
   */
  public readonly RENDERBUFFER_RED_SIZE: 0x8d50 = 0x8d50;
  public static readonly RENDERBUFFER_RED_SIZE: 0x8d50 = 0x8d50;

  /**
   * @constant {number}
   */
  public readonly RENDERBUFFER_GREEN_SIZE: 0x8d51 = 0x8d51;
  public static readonly RENDERBUFFER_GREEN_SIZE: 0x8d51 = 0x8d51;

  /**
   * @constant {number}
   */
  public readonly RENDERBUFFER_BLUE_SIZE: 0x8d52 = 0x8d52;
  public static readonly RENDERBUFFER_BLUE_SIZE: 0x8d52 = 0x8d52;

  /**
   * @constant {number}
   */
  public readonly RENDERBUFFER_ALPHA_SIZE: 0x8d53 = 0x8d53;
  public static readonly RENDERBUFFER_ALPHA_SIZE: 0x8d53 = 0x8d53;

  /**
   * @constant {number}
   */
  public readonly RENDERBUFFER_DEPTH_SIZE: 0x8d54 = 0x8d54;
  public static readonly RENDERBUFFER_DEPTH_SIZE: 0x8d54 = 0x8d54;

  /**
   * @constant {number}
   */
  public readonly RENDERBUFFER_STENCIL_SIZE: 0x8d55 = 0x8d55;
  public static readonly RENDERBUFFER_STENCIL_SIZE: 0x8d55 = 0x8d55;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: 0x8cd0 = 0x8cd0;
  public static readonly FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: 0x8cd0 = 0x8cd0;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: 0x8cd1 = 0x8cd1;
  public static readonly FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: 0x8cd1 = 0x8cd1;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: 0x8cd2 = 0x8cd2;
  public static readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: 0x8cd2 = 0x8cd2;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: 0x8cd3 = 0x8cd3;
  public static readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: 0x8cd3 = 0x8cd3;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT0: 0x8ce0 = 0x8ce0;
  public static readonly COLOR_ATTACHMENT0: 0x8ce0 = 0x8ce0;

  /**
   * @constant {number}
   */
  public readonly DEPTH_ATTACHMENT: 0x8d00 = 0x8d00;
  public static readonly DEPTH_ATTACHMENT: 0x8d00 = 0x8d00;

  /**
   * @constant {number}
   */
  public readonly STENCIL_ATTACHMENT: 0x8d20 = 0x8d20;
  public static readonly STENCIL_ATTACHMENT: 0x8d20 = 0x8d20;

  /**
   * @constant {number}
   */
  public readonly DEPTH_STENCIL_ATTACHMENT: 0x821a = 0x821a;
  public static readonly DEPTH_STENCIL_ATTACHMENT: 0x821a = 0x821a;

  /**
   * @constant {number}
   */
  public readonly NONE: 0 = 0;
  public static readonly NONE: 0 = 0;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_COMPLETE: 0x8cd5 = 0x8cd5;
  public static readonly FRAMEBUFFER_COMPLETE: 0x8cd5 = 0x8cd5;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_INCOMPLETE_ATTACHMENT: 0x8cd6 = 0x8cd6;
  public static readonly FRAMEBUFFER_INCOMPLETE_ATTACHMENT: 0x8cd6 = 0x8cd6;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: 0x8cd7 = 0x8cd7;
  public static readonly FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: 0x8cd7 = 0x8cd7;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_INCOMPLETE_DIMENSIONS: 0x8cd9 = 0x8cd9;
  public static readonly FRAMEBUFFER_INCOMPLETE_DIMENSIONS: 0x8cd9 = 0x8cd9;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_UNSUPPORTED: 0x8cdd = 0x8cdd;
  public static readonly FRAMEBUFFER_UNSUPPORTED: 0x8cdd = 0x8cdd;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_BINDING: 0x8ca6 = 0x8ca6;
  public static readonly FRAMEBUFFER_BINDING: 0x8ca6 = 0x8ca6;

  /**
   * @constant {number}
   */
  public readonly RENDERBUFFER_BINDING: 0x8ca7 = 0x8ca7;
  public static readonly RENDERBUFFER_BINDING: 0x8ca7 = 0x8ca7;

  /**
   * @constant {number}
   */
  public readonly MAX_RENDERBUFFER_SIZE: 0x84e8 = 0x84e8;
  public static readonly MAX_RENDERBUFFER_SIZE: 0x84e8 = 0x84e8;

  /**
   * @constant {number}
   */
  public readonly INVALID_FRAMEBUFFER_OPERATION: 0x0506 = 0x0506;
  public static readonly INVALID_FRAMEBUFFER_OPERATION: 0x0506 = 0x0506;

  // Pixel storage modes
  // Constants passed to WebGLRenderingContext.pixelStorei()

  /**
   * @constant {number}
   */
  public readonly UNPACK_FLIP_Y_WEBGL: 0x9240 = 0x9240;
  public static readonly UNPACK_FLIP_Y_WEBGL: 0x9240 = 0x9240;

  /**
   * @constant {number}
   */
  public readonly UNPACK_PREMULTIPLY_ALPHA_WEBGL: 0x9241 = 0x9241;
  public static readonly UNPACK_PREMULTIPLY_ALPHA_WEBGL: 0x9241 = 0x9241;

  /**
   * @constant {number}
   */
  public readonly UNPACK_COLORSPACE_CONVERSION_WEBGL: 0x9243 = 0x9243;
  public static readonly UNPACK_COLORSPACE_CONVERSION_WEBGL: 0x9243 = 0x9243;

  // Additional constants defined WebGL 2
  // These constants are defined on the WebGL2RenderingContext interface. All WebGL 1 constants are also available in a WebGL 2 context

  // Getting GL parameter information
  // Constants passed to WebGLRenderingContext.getParameter() to specify what information to return

  /**
   * @constant {number}
   */
  public readonly READ_BUFFER: 0x0c02 = 0x0c02;
  public static readonly READ_BUFFER: 0x0c02 = 0x0c02;

  /**
   * @constant {number}
   */
  public readonly UNPACK_ROW_LENGTH: 0x0cf2 = 0x0cf2;
  public static readonly UNPACK_ROW_LENGTH: 0x0cf2 = 0x0cf2;

  /**
   * @constant {number}
   */
  public readonly UNPACK_SKIP_ROWS: 0x0cf3 = 0x0cf3;
  public static readonly UNPACK_SKIP_ROWS: 0x0cf3 = 0x0cf3;

  /**
   * @constant {number}
   */
  public readonly UNPACK_SKIP_PIXELS: 0x0cf4 = 0x0cf4;
  public static readonly UNPACK_SKIP_PIXELS: 0x0cf4 = 0x0cf4;

  /**
   * @constant {number}
   */
  public readonly PACK_ROW_LENGTH: 0x0d02 = 0x0d02;
  public static readonly PACK_ROW_LENGTH: 0x0d02 = 0x0d02;

  /**
   * @constant {number}
   */
  public readonly PACK_SKIP_ROWS: 0x0d03 = 0x0d03;
  public static readonly PACK_SKIP_ROWS: 0x0d03 = 0x0d03;

  /**
   * @constant {number}
   */
  public readonly PACK_SKIP_PIXELS: 0x0d04 = 0x0d04;
  public static readonly PACK_SKIP_PIXELS: 0x0d04 = 0x0d04;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_BINDING_3D: 0x806a = 0x806a;
  public static readonly TEXTURE_BINDING_3D: 0x806a = 0x806a;

  /**
   * @constant {number}
   */
  public readonly UNPACK_SKIP_IMAGES: 0x806d = 0x806d;
  public static readonly UNPACK_SKIP_IMAGES: 0x806d = 0x806d;

  /**
   * @constant {number}
   */
  public readonly UNPACK_IMAGE_HEIGHT: 0x806e = 0x806e;
  public static readonly UNPACK_IMAGE_HEIGHT: 0x806e = 0x806e;

  /**
   * @constant {number}
   */
  public readonly MAX_3D_TEXTURE_SIZE: 0x8073 = 0x8073;
  public static readonly MAX_3D_TEXTURE_SIZE: 0x8073 = 0x8073;

  /**
   * @constant {number}
   */
  public readonly MAX_ELEMENTS_VERTICES: 0x80e8 = 0x80e8;
  public static readonly MAX_ELEMENTS_VERTICES: 0x80e8 = 0x80e8;

  /**
   * @constant {number}
   */
  public readonly MAX_ELEMENTS_INDICES: 0x80e9 = 0x80e9;
  public static readonly MAX_ELEMENTS_INDICES: 0x80e9 = 0x80e9;

  /**
   * @constant {number}
   */
  public readonly MAX_TEXTURE_LOD_BIAS: 0x84fd = 0x84fd;
  public static readonly MAX_TEXTURE_LOD_BIAS: 0x84fd = 0x84fd;

  /**
   * @constant {number}
   */
  public readonly MAX_FRAGMENT_UNIFORM_COMPONENTS: 0x8b49 = 0x8b49;
  public static readonly MAX_FRAGMENT_UNIFORM_COMPONENTS: 0x8b49 = 0x8b49;

  /**
   * @constant {number}
   */
  public readonly MAX_VERTEX_UNIFORM_COMPONENTS: 0x8b4a = 0x8b4a;
  public static readonly MAX_VERTEX_UNIFORM_COMPONENTS: 0x8b4a = 0x8b4a;

  /**
   * @constant {number}
   */
  public readonly MAX_ARRAY_TEXTURE_LAYERS: 0x88ff = 0x88ff;
  public static readonly MAX_ARRAY_TEXTURE_LAYERS: 0x88ff = 0x88ff;

  /**
   * @constant {number}
   */
  public readonly MIN_PROGRAM_TEXEL_OFFSET: 0x8904 = 0x8904;
  public static readonly MIN_PROGRAM_TEXEL_OFFSET: 0x8904 = 0x8904;

  /**
   * @constant {number}
   */
  public readonly MAX_PROGRAM_TEXEL_OFFSET: 0x8905 = 0x8905;
  public static readonly MAX_PROGRAM_TEXEL_OFFSET: 0x8905 = 0x8905;

  /**
   * @constant {number}
   */
  public readonly MAX_VARYING_COMPONENTS: 0x8b4b = 0x8b4b;
  public static readonly MAX_VARYING_COMPONENTS: 0x8b4b = 0x8b4b;

  /**
   * @constant {number}
   */
  public readonly FRAGMENT_SHADER_DERIVATIVE_HINT: 0x8b8b = 0x8b8b;
  public static readonly FRAGMENT_SHADER_DERIVATIVE_HINT: 0x8b8b = 0x8b8b;

  /**
   * @constant {number}
   */
  public readonly RASTERIZER_DISCARD: 0x8c89 = 0x8c89;
  public static readonly RASTERIZER_DISCARD: 0x8c89 = 0x8c89;

  /**
   * @constant {number}
   */
  public readonly VERTEX_ARRAY_BINDING: 0x85b5 = 0x85b5;
  public static readonly VERTEX_ARRAY_BINDING: 0x85b5 = 0x85b5;

  /**
   * @constant {number}
   */
  public readonly MAX_VERTEX_OUTPUT_COMPONENTS: 0x9122 = 0x9122;
  public static readonly MAX_VERTEX_OUTPUT_COMPONENTS: 0x9122 = 0x9122;

  /**
   * @constant {number}
   */
  public readonly MAX_FRAGMENT_INPUT_COMPONENTS: 0x9125 = 0x9125;
  public static readonly MAX_FRAGMENT_INPUT_COMPONENTS: 0x9125 = 0x9125;

  /**
   * @constant {number}
   */
  public readonly MAX_SERVER_WAIT_TIMEOUT: 0x9111 = 0x9111;
  public static readonly MAX_SERVER_WAIT_TIMEOUT: 0x9111 = 0x9111;

  /**
   * @constant {number}
   */
  public readonly MAX_ELEMENT_INDEX: 0x8d6b = 0x8d6b;
  public static readonly MAX_ELEMENT_INDEX: 0x8d6b = 0x8d6b;

  // Textures
  // Constants passed to WebGLRenderingContext.texParameteri(), WebGLRenderingContext.texParameterf(), WebGLRenderingContext.bindTexture(), WebGLRenderingContext.texImage2D(), and others

  /**
   * @constant {number}
   */
  public readonly RED: 0x1903 = 0x1903;
  public static readonly RED: 0x1903 = 0x1903;

  /**
   * @constant {number}
   */
  public readonly RGB8: 0x8051 = 0x8051;
  public static readonly RGB8: 0x8051 = 0x8051;

  /**
   * @constant {number}
   */
  public readonly RGBA8: 0x8058 = 0x8058;
  public static readonly RGBA8: 0x8058 = 0x8058;

  /**
   * @constant {number}
   */
  public readonly RGB10_A2: 0x8059 = 0x8059;
  public static readonly RGB10_A2: 0x8059 = 0x8059;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_3D: 0x806f = 0x806f;
  public static readonly TEXTURE_3D: 0x806f = 0x806f;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_WRAP_R: 0x8072 = 0x8072;
  public static readonly TEXTURE_WRAP_R: 0x8072 = 0x8072;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_MIN_LOD: 0x813a = 0x813a;
  public static readonly TEXTURE_MIN_LOD: 0x813a = 0x813a;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_MAX_LOD: 0x813b = 0x813b;
  public static readonly TEXTURE_MAX_LOD: 0x813b = 0x813b;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_BASE_LEVEL: 0x813c = 0x813c;
  public static readonly TEXTURE_BASE_LEVEL: 0x813c = 0x813c;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_MAX_LEVEL: 0x813d = 0x813d;
  public static readonly TEXTURE_MAX_LEVEL: 0x813d = 0x813d;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_COMPARE_MODE: 0x884c = 0x884c;
  public static readonly TEXTURE_COMPARE_MODE: 0x884c = 0x884c;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_COMPARE_FUNC: 0x884d = 0x884d;
  public static readonly TEXTURE_COMPARE_FUNC: 0x884d = 0x884d;

  /**
   * @constant {number}
   */
  public readonly SRGB: 0x8c40 = 0x8c40;
  public static readonly SRGB: 0x8c40 = 0x8c40;

  /**
   * @constant {number}
   */
  public readonly SRGB8: 0x8c41 = 0x8c41;
  public static readonly SRGB8: 0x8c41 = 0x8c41;

  /**
   * @constant {number}
   */
  public readonly SRGB8_ALPHA8: 0x8c43 = 0x8c43;
  public static readonly SRGB8_ALPHA8: 0x8c43 = 0x8c43;

  /**
   * @constant {number}
   */
  public readonly COMPARE_REF_TO_TEXTURE: 0x884e = 0x884e;
  public static readonly COMPARE_REF_TO_TEXTURE: 0x884e = 0x884e;

  /**
   * @constant {number}
   */
  public readonly RGBA32F: 0x8814 = 0x8814;
  public static readonly RGBA32F: 0x8814 = 0x8814;

  /**
   * @constant {number}
   */
  public readonly RGB32F: 0x8815 = 0x8815;
  public static readonly RGB32F: 0x8815 = 0x8815;

  /**
   * @constant {number}
   */
  public readonly RGBA16F: 0x881a = 0x881a;
  public static readonly RGBA16F: 0x881a = 0x881a;
  public readonly RGBA16F_EXT: 0x881a = this.RGBA16F;
  public static readonly RGBA16F_EXT: 0x881a = this.RGBA16F;

  /**
   * @constant {number}
   */
  public readonly RGB16F: 0x881b = 0x881b;
  public static readonly RGB16F: 0x881b = 0x881b;
  public readonly RGB16F_EXT: 0x881b = this.RGB16F;
  public static readonly RGB16F_EXT: 0x881b = this.RGB16F;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_2D_ARRAY: 0x8c1a = 0x8c1a;
  public static readonly TEXTURE_2D_ARRAY: 0x8c1a = 0x8c1a;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_BINDING_2D_ARRAY: 0x8c1d = 0x8c1d;
  public static readonly TEXTURE_BINDING_2D_ARRAY: 0x8c1d = 0x8c1d;

  /**
   * @constant {number}
   */
  public readonly R11F_G11F_B10F: 0x8c3a = 0x8c3a;
  public static readonly R11F_G11F_B10F: 0x8c3a = 0x8c3a;

  /**
   * @constant {number}
   */
  public readonly RGB9_E5: 0x8c3d = 0x8c3d;
  public static readonly RGB9_E5: 0x8c3d = 0x8c3d;

  /**
   * @constant {number}
   */
  public readonly RGBA32UI: 0x8d70 = 0x8d70;
  public static readonly RGBA32UI: 0x8d70 = 0x8d70;

  /**
   * @constant {number}
   */
  public readonly RGB32UI: 0x8d71 = 0x8d71;
  public static readonly RGB32UI: 0x8d71 = 0x8d71;

  /**
   * @constant {number}
   */
  public readonly RGBA16UI: 0x8d76 = 0x8d76;
  public static readonly RGBA16UI: 0x8d76 = 0x8d76;

  /**
   * @constant {number}
   */
  public readonly RGB16UI: 0x8d77 = 0x8d77;
  public static readonly RGB16UI: 0x8d77 = 0x8d77;

  /**
   * @constant {number}
   */
  public readonly RGBA8UI: 0x8d7c = 0x8d7c;
  public static readonly RGBA8UI: 0x8d7c = 0x8d7c;

  /**
   * @constant {number}
   */
  public readonly RGB8UI: 0x8d7d = 0x8d7d;
  public static readonly RGB8UI: 0x8d7d = 0x8d7d;

  /**
   * @constant {number}
   */
  public readonly RGBA32I: 0x8d82 = 0x8d82;
  public static readonly RGBA32I: 0x8d82 = 0x8d82;

  /**
   * @constant {number}
   */
  public readonly RGB32I: 0x8d83 = 0x8d83;
  public static readonly RGB32I: 0x8d83 = 0x8d83;

  /**
   * @constant {number}
   */
  public readonly RGBA16I: 0x8d88 = 0x8d88;
  public static readonly RGBA16I: 0x8d88 = 0x8d88;

  /**
   * @constant {number}
   */
  public readonly RGB16I: 0x8d89 = 0x8d89;
  public static readonly RGB16I: 0x8d89 = 0x8d89;

  /**
   * @constant {number}
   */
  public readonly RGBA8I: 0x8d8e = 0x8d8e;
  public static readonly RGBA8I: 0x8d8e = 0x8d8e;

  /**
   * @constant {number}
   */
  public readonly RGB8I: 0x8d8f = 0x8d8f;
  public static readonly RGB8I: 0x8d8f = 0x8d8f;

  /**
   * @constant {number}
   */
  public readonly RED_INTEGER: 0x8d94 = 0x8d94;
  public static readonly RED_INTEGER: 0x8d94 = 0x8d94;

  /**
   * @constant {number}
   */
  public readonly RGB_INTEGER: 0x8d98 = 0x8d98;
  public static readonly RGB_INTEGER: 0x8d98 = 0x8d98;

  /**
   * @constant {number}
   */
  public readonly RGBA_INTEGER: 0x8d99 = 0x8d99;
  public static readonly RGBA_INTEGER: 0x8d99 = 0x8d99;

  /**
   * @constant {number}
   */
  public readonly R8: 0x8229 = 0x8229;
  public static readonly R8: 0x8229 = 0x8229;

  /**
   * @constant {number}
   */
  public readonly RG8: 0x822b = 0x822b;
  public static readonly RG8: 0x822b = 0x822b;

  /**
   * @constant {number}
   */
  public readonly R16F: 0x822d = 0x822d;
  public static readonly R16F: 0x822d = 0x822d;

  /**
   * @constant {number}
   */
  public readonly R32F: 0x822e = 0x822e;
  public static readonly R32F: 0x822e = 0x822e;

  /**
   * @constant {number}
   */
  public readonly RG16F: 0x822f = 0x822f;
  public static readonly RG16F: 0x822f = 0x822f;

  /**
   * @constant {number}
   */
  public readonly RG32F: 0x8230 = 0x8230;
  public static readonly RG32F: 0x8230 = 0x8230;

  /**
   * @constant {number}
   */
  public readonly R8I: 0x8231 = 0x8231;
  public static readonly R8I: 0x8231 = 0x8231;

  /**
   * @constant {number}
   */
  public readonly R8UI: 0x8232 = 0x8232;
  public static readonly R8UI: 0x8232 = 0x8232;

  /**
   * @constant {number}
   */
  public readonly R16I: 0x8233 = 0x8233;
  public static readonly R16I: 0x8233 = 0x8233;

  /**
   * @constant {number}
   */
  public readonly R16UI: 0x8234 = 0x8234;
  public static readonly R16UI: 0x8234 = 0x8234;

  /**
   * @constant {number}
   */
  public readonly R32I: 0x8235 = 0x8235;
  public static readonly R32I: 0x8235 = 0x8235;

  /**
   * @constant {number}
   */
  public readonly R32UI: 0x8236 = 0x8236;
  public static readonly R32UI: 0x8236 = 0x8236;

  /**
   * @constant {number}
   */
  public readonly RG8I: 0x8237 = 0x8237;
  public static readonly RG8I: 0x8237 = 0x8237;

  /**
   * @constant {number}
   */
  public readonly RG8UI: 0x8238 = 0x8238;
  public static readonly RG8UI: 0x8238 = 0x8238;

  /**
   * @constant {number}
   */
  public readonly RG16I: 0x8239 = 0x8239;
  public static readonly RG16I: 0x8239 = 0x8239;

  /**
   * @constant {number}
   */
  public readonly RG16UI: 0x823a = 0x823a;
  public static readonly RG16UI: 0x823a = 0x823a;

  /**
   * @constant {number}
   */
  public readonly RG32I: 0x823b = 0x823b;
  public static readonly RG32I: 0x823b = 0x823b;

  /**
   * @constant {number}
   */
  public readonly RG32UI: 0x823c = 0x823c;
  public static readonly RG32UI: 0x823c = 0x823c;

  /**
   * @constant {number}
   */
  public readonly R8_SNORM: 0x8f94 = 0x8f94;
  public static readonly R8_SNORM: 0x8f94 = 0x8f94;

  /**
   * @constant {number}
   */
  public readonly RG8_SNORM: 0x8f95 = 0x8f95;
  public static readonly RG8_SNORM: 0x8f95 = 0x8f95;

  /**
   * @constant {number}
   */
  public readonly RGB8_SNORM: 0x8f96 = 0x8f96;
  public static readonly RGB8_SNORM: 0x8f96 = 0x8f96;

  /**
   * @constant {number}
   */
  public readonly RGBA8_SNORM: 0x8f97 = 0x8f97;
  public static readonly RGBA8_SNORM: 0x8f97 = 0x8f97;

  /**
   * @constant {number}
   */
  public readonly RGB10_A2UI: 0x906f = 0x906f;
  public static readonly RGB10_A2UI: 0x906f = 0x906f;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_IMMUTABLE_FORMAT: 0x912f = 0x912f;
  public static readonly TEXTURE_IMMUTABLE_FORMAT: 0x912f = 0x912f;

  /**
   * @constant {number}
   */
  public readonly TEXTURE_IMMUTABLE_LEVELS: 0x82df = 0x82df;
  public static readonly TEXTURE_IMMUTABLE_LEVELS: 0x82df = 0x82df;

  // Pixel types

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_INT_2_10_10_10_REV: 0x8368 = 0x8368;
  public static readonly UNSIGNED_INT_2_10_10_10_REV: 0x8368 = 0x8368;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_INT_10F_11F_11F_REV: 0x8c3b = 0x8c3b;
  public static readonly UNSIGNED_INT_10F_11F_11F_REV: 0x8c3b = 0x8c3b;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_INT_5_9_9_9_REV: 0x8c3e = 0x8c3e;
  public static readonly UNSIGNED_INT_5_9_9_9_REV: 0x8c3e = 0x8c3e;

  /**
   * @constant {number}
   */
  public readonly FLOAT_32_UNSIGNED_INT_24_8_REV: 0x8dad = 0x8dad;
  public static readonly FLOAT_32_UNSIGNED_INT_24_8_REV: 0x8dad = 0x8dad;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_INT_24_8: 0x84fa = 0x84fa;
  public static readonly UNSIGNED_INT_24_8: 0x84fa = 0x84fa;

  /**
   * @constant {number}
   */
  public readonly HALF_FLOAT: 0x140b = 0x140b;
  public static readonly HALF_FLOAT: 0x140b = 0x140b;

  /**
   * @constant {number}
   */
  public readonly RG: 0x8227 = 0x8227;
  public static readonly RG: 0x8227 = 0x8227;

  /**
   * @constant {number}
   */
  public readonly RG_INTEGER: 0x8228 = 0x8228;
  public static readonly RG_INTEGER: 0x8228 = 0x8228;

  /**
   * @constant {number}
   */
  public readonly INT_2_10_10_10_REV: 0x8d9f = 0x8d9f;
  public static readonly INT_2_10_10_10_REV: 0x8d9f = 0x8d9f;

  // Queries

  /**
   * @constant {number}
   */
  public readonly CURRENT_QUERY: 0x8865 = 0x8865;
  public static readonly CURRENT_QUERY: 0x8865 = 0x8865;

  /**
   * @constant {number}
   */
  public readonly QUERY_RESULT: 0x8866 = 0x8866;
  public static readonly QUERY_RESULT: 0x8866 = 0x8866;

  /**
   * @constant {number}
   */
  public readonly QUERY_RESULT_AVAILABLE: 0x8867 = 0x8867;
  public static readonly QUERY_RESULT_AVAILABLE: 0x8867 = 0x8867;

  /**
   * @constant {number}
   */
  public readonly ANY_SAMPLES_PASSED: 0x8c2f = 0x8c2f;
  public static readonly ANY_SAMPLES_PASSED: 0x8c2f = 0x8c2f;

  /**
   * @constant {number}
   */
  public readonly ANY_SAMPLES_PASSED_CONSERVATIVE: 0x8d6a = 0x8d6a;
  public static readonly ANY_SAMPLES_PASSED_CONSERVATIVE: 0x8d6a = 0x8d6a;

  // Draw buffers

  /**
   * @constant {number}
   */
  public readonly MAX_DRAW_BUFFERS: 0x8824 = 0x8824;
  public static readonly MAX_DRAW_BUFFERS: 0x8824 = 0x8824;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER0: 0x8825 = 0x8825;
  public static readonly DRAW_BUFFER0: 0x8825 = 0x8825;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER1: 0x8826 = 0x8826;
  public static readonly DRAW_BUFFER1: 0x8826 = 0x8826;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER2: 0x8827 = 0x8827;
  public static readonly DRAW_BUFFER2: 0x8827 = 0x8827;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER3: 0x8828 = 0x8828;
  public static readonly DRAW_BUFFER3: 0x8828 = 0x8828;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER4: 0x8829 = 0x8829;
  public static readonly DRAW_BUFFER4: 0x8829 = 0x8829;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER5: 0x882a = 0x882a;
  public static readonly DRAW_BUFFER5: 0x882a = 0x882a;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER6: 0x882b = 0x882b;
  public static readonly DRAW_BUFFER6: 0x882b = 0x882b;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER7: 0x882c = 0x882c;
  public static readonly DRAW_BUFFER7: 0x882c = 0x882c;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER8: 0x882d = 0x882d;
  public static readonly DRAW_BUFFER8: 0x882d = 0x882d;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER9: 0x882e = 0x882e;
  public static readonly DRAW_BUFFER9: 0x882e = 0x882e;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER10: 0x882f = 0x882f;
  public static readonly DRAW_BUFFER10: 0x882f = 0x882f;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER11: 0x8830 = 0x8830;
  public static readonly DRAW_BUFFER11: 0x8830 = 0x8830;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER12: 0x8831 = 0x8831;
  public static readonly DRAW_BUFFER12: 0x8831 = 0x8831;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER13: 0x8832 = 0x8832;
  public static readonly DRAW_BUFFER13: 0x8832 = 0x8832;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER14: 0x8833 = 0x8833;
  public static readonly DRAW_BUFFER14: 0x8833 = 0x8833;

  /**
   * @constant {number}
   */
  public readonly DRAW_BUFFER15: 0x8834 = 0x8834;
  public static readonly DRAW_BUFFER15: 0x8834 = 0x8834;

  /**
   * @constant {number}
   */
  public readonly MAX_COLOR_ATTACHMENTS: 0x8cdf = 0x8cdf;
  public static readonly MAX_COLOR_ATTACHMENTS: 0x8cdf = 0x8cdf;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT1: 0x8ce1 = 0x8ce1;
  public static readonly COLOR_ATTACHMENT1: 0x8ce1 = 0x8ce1;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT2: 0x8ce2 = 0x8ce2;
  public static readonly COLOR_ATTACHMENT2: 0x8ce2 = 0x8ce2;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT3: 0x8ce3 = 0x8ce3;
  public static readonly COLOR_ATTACHMENT3: 0x8ce3 = 0x8ce3;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT4: 0x8ce4 = 0x8ce4;
  public static readonly COLOR_ATTACHMENT4: 0x8ce4 = 0x8ce4;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT5: 0x8ce5 = 0x8ce5;
  public static readonly COLOR_ATTACHMENT5: 0x8ce5 = 0x8ce5;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT6: 0x8ce6 = 0x8ce6;
  public static readonly COLOR_ATTACHMENT6: 0x8ce6 = 0x8ce6;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT7: 0x8ce7 = 0x8ce7;
  public static readonly COLOR_ATTACHMENT7: 0x8ce7 = 0x8ce7;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT8: 0x8ce8 = 0x8ce8;
  public static readonly COLOR_ATTACHMENT8: 0x8ce8 = 0x8ce8;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT9: 0x8ce9 = 0x8ce9;
  public static readonly COLOR_ATTACHMENT9: 0x8ce9 = 0x8ce9;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT10: 0x8cea = 0x8cea;
  public static readonly COLOR_ATTACHMENT10: 0x8cea = 0x8cea;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT11: 0x8ceb = 0x8ceb;
  public static readonly COLOR_ATTACHMENT11: 0x8ceb = 0x8ceb;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT12: 0x8cec = 0x8cec;
  public static readonly COLOR_ATTACHMENT12: 0x8cec = 0x8cec;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT13: 0x8ced = 0x8ced;
  public static readonly COLOR_ATTACHMENT13: 0x8ced = 0x8ced;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT14: 0x8cee = 0x8cee;
  public static readonly COLOR_ATTACHMENT14: 0x8cee = 0x8cee;

  /**
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT15: 0x8cef = 0x8cef;
  public static readonly COLOR_ATTACHMENT15: 0x8cef = 0x8cef;

  // Samplers

  /**
   * @constant {number}
   */
  public readonly SAMPLER_3D: 0x8b5f = 0x8b5f;
  public static readonly SAMPLER_3D: 0x8b5f = 0x8b5f;

  /**
   * @constant {number}
   */
  public readonly SAMPLER_2D_SHADOW: 0x8b62 = 0x8b62;
  public static readonly SAMPLER_2D_SHADOW: 0x8b62 = 0x8b62;

  /**
   * @constant {number}
   */
  public readonly SAMPLER_2D_ARRAY: 0x8dc1 = 0x8dc1;
  public static readonly SAMPLER_2D_ARRAY: 0x8dc1 = 0x8dc1;

  /**
   * @constant {number}
   */
  public readonly SAMPLER_2D_ARRAY_SHADOW: 0x8dc4 = 0x8dc4;
  public static readonly SAMPLER_2D_ARRAY_SHADOW: 0x8dc4 = 0x8dc4;

  /**
   * @constant {number}
   */
  public readonly SAMPLER_CUBE_SHADOW: 0x8dc5 = 0x8dc5;
  public static readonly SAMPLER_CUBE_SHADOW: 0x8dc5 = 0x8dc5;

  /**
   * @constant {number}
   */
  public readonly INT_SAMPLER_2D: 0x8dca = 0x8dca;
  public static readonly INT_SAMPLER_2D: 0x8dca = 0x8dca;

  /**
   * @constant {number}
   */
  public readonly INT_SAMPLER_3D: 0x8dcb = 0x8dcb;
  public static readonly INT_SAMPLER_3D: 0x8dcb = 0x8dcb;

  /**
   * @constant {number}
   */
  public readonly INT_SAMPLER_CUBE: 0x8dcc = 0x8dcc;
  public static readonly INT_SAMPLER_CUBE: 0x8dcc = 0x8dcc;

  /**
   * @constant {number}
   */
  public readonly INT_SAMPLER_2D_ARRAY: 0x8dcf = 0x8dcf;
  public static readonly INT_SAMPLER_2D_ARRAY: 0x8dcf = 0x8dcf;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_INT_SAMPLER_2D: 0x8dd2 = 0x8dd2;
  public static readonly UNSIGNED_INT_SAMPLER_2D: 0x8dd2 = 0x8dd2;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_INT_SAMPLER_3D: 0x8dd3 = 0x8dd3;
  public static readonly UNSIGNED_INT_SAMPLER_3D: 0x8dd3 = 0x8dd3;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_INT_SAMPLER_CUBE: 0x8dd4 = 0x8dd4;
  public static readonly UNSIGNED_INT_SAMPLER_CUBE: 0x8dd4 = 0x8dd4;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_INT_SAMPLER_2D_ARRAY: 0x8dd7 = 0x8dd7;
  public static readonly UNSIGNED_INT_SAMPLER_2D_ARRAY: 0x8dd7 = 0x8dd7;

  /**
   * @constant {number}
   */
  public readonly MAX_SAMPLES: 0x8d57 = 0x8d57;
  public static readonly MAX_SAMPLES: 0x8d57 = 0x8d57;

  /**
   * @constant {number}
   */
  public readonly SAMPLER_BINDING: 0x8919 = 0x8919;
  public static readonly SAMPLER_BINDING: 0x8919 = 0x8919;

  // Buffers

  /**
   * @constant {number}
   */
  public readonly PIXEL_PACK_BUFFER: 0x88eb = 0x88eb;
  public static readonly PIXEL_PACK_BUFFER: 0x88eb = 0x88eb;

  /**
   * @constant {number}
   */
  public readonly PIXEL_UNPACK_BUFFER: 0x88ec = 0x88ec;
  public static readonly PIXEL_UNPACK_BUFFER: 0x88ec = 0x88ec;

  /**
   * @constant {number}
   */
  public readonly PIXEL_PACK_BUFFER_BINDING: 0x88ed = 0x88ed;
  public static readonly PIXEL_PACK_BUFFER_BINDING: 0x88ed = 0x88ed;

  /**
   * @constant {number}
   */
  public readonly PIXEL_UNPACK_BUFFER_BINDING: 0x88ef = 0x88ef;
  public static readonly PIXEL_UNPACK_BUFFER_BINDING: 0x88ef = 0x88ef;

  /**
   * @constant {number}
   */
  public readonly COPY_READ_BUFFER: 0x8f36 = 0x8f36;
  public static readonly COPY_READ_BUFFER: 0x8f36 = 0x8f36;

  /**
   * @constant {number}
   */
  public readonly COPY_WRITE_BUFFER: 0x8f37 = 0x8f37;
  public static readonly COPY_WRITE_BUFFER: 0x8f37 = 0x8f37;

  /**
   * @constant {number}
   */
  public readonly COPY_READ_BUFFER_BINDING: 0x8f36 = 0x8f36;
  public static readonly COPY_READ_BUFFER_BINDING: 0x8f36 = 0x8f36;

  /**
   * @constant {number}
   */
  public readonly COPY_WRITE_BUFFER_BINDING: 0x8f37 = 0x8f37;
  public static readonly COPY_WRITE_BUFFER_BINDING: 0x8f37 = 0x8f37;

  // Data types

  /**
   * @constant {number}
   */
  public readonly FLOAT_MAT2X3: 0x8b65 = 0x8b65;
  public static readonly FLOAT_MAT2X3: 0x8b65 = 0x8b65;
  public readonly FLOAT_MAT2x3: 0x8b65 = 0x8b65;
  public static readonly FLOAT_MAT2x3: 0x8b65 = 0x8b65;

  /**
   * @constant {number}
   */
  public readonly FLOAT_MAT2X4: 0x8b66 = 0x8b66;
  public static readonly FLOAT_MAT2X4: 0x8b66 = 0x8b66;
  public readonly FLOAT_MAT2x4: 0x8b66 = 0x8b66;
  public static readonly FLOAT_MAT2x4: 0x8b66 = 0x8b66;

  /**
   * @constant {number}
   */
  public readonly FLOAT_MAT3X2: 0x8b67 = 0x8b67;
  public static readonly FLOAT_MAT3X2: 0x8b67 = 0x8b67;
  public readonly FLOAT_MAT3x2: 0x8b67 = 0x8b67;
  public static readonly FLOAT_MAT3x2: 0x8b67 = 0x8b67;

  /**
   * @constant {number}
   */
  public readonly FLOAT_MAT3X4: 0x8b68 = 0x8b68;
  public static readonly FLOAT_MAT3X4: 0x8b68 = 0x8b68;
  public readonly FLOAT_MAT3x4: 0x8b68 = 0x8b68;
  public static readonly FLOAT_MAT3x4: 0x8b68 = 0x8b68;

  /**
   * @constant {number}
   */
  public readonly FLOAT_MAT4X2: 0x8b69 = 0x8b69;
  public static readonly FLOAT_MAT4X2: 0x8b69 = 0x8b69;
  public readonly FLOAT_MAT4x2: 0x8b69 = 0x8b69;
  public static readonly FLOAT_MAT4x2: 0x8b69 = 0x8b69;

  /**
   * @constant {number}
   */
  public readonly FLOAT_MAT4X3: 0x8b6a = 0x8b6a;
  public static readonly FLOAT_MAT4X3: 0x8b6a = 0x8b6a;
  public readonly FLOAT_MAT4x3: 0x8b6a = 0x8b6a;
  public static readonly FLOAT_MAT4x3: 0x8b6a = 0x8b6a;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_INT_VEC2: 0x8dc6 = 0x8dc6;
  public static readonly UNSIGNED_INT_VEC2: 0x8dc6 = 0x8dc6;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_INT_VEC3: 0x8dc7 = 0x8dc7;
  public static readonly UNSIGNED_INT_VEC3: 0x8dc7 = 0x8dc7;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_INT_VEC4: 0x8dc8 = 0x8dc8;
  public static readonly UNSIGNED_INT_VEC4: 0x8dc8 = 0x8dc8;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_NORMALIZED: 0x8c17 = 0x8c17;
  public static readonly UNSIGNED_NORMALIZED: 0x8c17 = 0x8c17;

  /**
   * @constant {number}
   */
  public readonly SIGNED_NORMALIZED: 0x8f9c = 0x8f9c;
  public static readonly SIGNED_NORMALIZED: 0x8f9c = 0x8f9c;

  // Vertex attributes

  /**
   * @constant {number}
   */
  public readonly VERTEX_ATTRIB_ARRAY_INTEGER: 0x88fd = 0x88fd;
  public static readonly VERTEX_ATTRIB_ARRAY_INTEGER: 0x88fd = 0x88fd;

  /**
   * @constant {number}
   */
  public readonly VERTEX_ATTRIB_ARRAY_DIVISOR: 0x88fe = 0x88fe;
  public static readonly VERTEX_ATTRIB_ARRAY_DIVISOR: 0x88fe = 0x88fe;

  // Transform feedback

  /**
   * @constant {number}
   */
  public readonly TRANSFORM_FEEDBACK_BUFFER_MODE: 0x8c7f = 0x8c7f;
  public static readonly TRANSFORM_FEEDBACK_BUFFER_MODE: 0x8c7f = 0x8c7f;

  /**
   * @constant {number}
   */
  public readonly MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS: 0x8c80 = 0x8c80;
  public static readonly MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS: 0x8c80 = 0x8c80;

  /**
   * @constant {number}
   */
  public readonly TRANSFORM_FEEDBACK_VARYINGS: 0x8c83 = 0x8c83;
  public static readonly TRANSFORM_FEEDBACK_VARYINGS: 0x8c83 = 0x8c83;

  /**
   * @constant {number}
   */
  public readonly TRANSFORM_FEEDBACK_BUFFER_START: 0x8c84 = 0x8c84;
  public static readonly TRANSFORM_FEEDBACK_BUFFER_START: 0x8c84 = 0x8c84;

  /**
   * @constant {number}
   */
  public readonly TRANSFORM_FEEDBACK_BUFFER_SIZE: 0x8c85 = 0x8c85;
  public static readonly TRANSFORM_FEEDBACK_BUFFER_SIZE: 0x8c85 = 0x8c85;

  /**
   * @constant {number}
   */
  public readonly TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN: 0x8c88 = 0x8c88;
  public static readonly TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN: 0x8c88 = 0x8c88;

  /**
   * @constant {number}
   */
  public readonly MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS: 0x8c8a = 0x8c8a;
  public static readonly MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS: 0x8c8a = 0x8c8a;

  /**
   * @constant {number}
   */
  public readonly MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS: 0x8c8b = 0x8c8b;
  public static readonly MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS: 0x8c8b = 0x8c8b;

  /**
   * @constant {number}
   */
  public readonly INTERLEAVED_ATTRIBS: 0x8c8c = 0x8c8c;
  public static readonly INTERLEAVED_ATTRIBS: 0x8c8c = 0x8c8c;

  /**
   * @constant {number}
   */
  public readonly SEPARATE_ATTRIBS: 0x8c8d = 0x8c8d;
  public static readonly SEPARATE_ATTRIBS: 0x8c8d = 0x8c8d;

  /**
   * @constant {number}
   */
  public readonly TRANSFORM_FEEDBACK_BUFFER: 0x8c8e = 0x8c8e;
  public static readonly TRANSFORM_FEEDBACK_BUFFER: 0x8c8e = 0x8c8e;

  /**
   * @constant {number}
   */
  public readonly TRANSFORM_FEEDBACK_BUFFER_BINDING: 0x8c8f = 0x8c8f;
  public static readonly TRANSFORM_FEEDBACK_BUFFER_BINDING: 0x8c8f = 0x8c8f;

  /**
   * @constant {number}
   */
  public readonly TRANSFORM_FEEDBACK: 0x8e22 = 0x8e22;
  public static readonly TRANSFORM_FEEDBACK: 0x8e22 = 0x8e22;

  /**
   * @constant {number}
   */
  public readonly TRANSFORM_FEEDBACK_PAUSED: 0x8e23 = 0x8e23;
  public static readonly TRANSFORM_FEEDBACK_PAUSED: 0x8e23 = 0x8e23;

  /**
   * @constant {number}
   */
  public readonly TRANSFORM_FEEDBACK_ACTIVE: 0x8e24 = 0x8e24;
  public static readonly TRANSFORM_FEEDBACK_ACTIVE: 0x8e24 = 0x8e24;

  /**
   * @constant {number}
   */
  public readonly TRANSFORM_FEEDBACK_BINDING: 0x8e25 = 0x8e25;
  public static readonly TRANSFORM_FEEDBACK_BINDING: 0x8e25 = 0x8e25;

  // Framebuffers and renderbuffers

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING: 0x8210 = 0x8210;
  public static readonly FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING: 0x8210 = 0x8210;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE: 0x8211 = 0x8211;
  public static readonly FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE: 0x8211 = 0x8211;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_RED_SIZE: 0x8212 = 0x8212;
  public static readonly FRAMEBUFFER_ATTACHMENT_RED_SIZE: 0x8212 = 0x8212;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_GREEN_SIZE: 0x8213 = 0x8213;
  public static readonly FRAMEBUFFER_ATTACHMENT_GREEN_SIZE: 0x8213 = 0x8213;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_BLUE_SIZE: 0x8214 = 0x8214;
  public static readonly FRAMEBUFFER_ATTACHMENT_BLUE_SIZE: 0x8214 = 0x8214;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE: 0x8215 = 0x8215;
  public static readonly FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE: 0x8215 = 0x8215;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE: 0x8216 = 0x8216;
  public static readonly FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE: 0x8216 = 0x8216;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE: 0x8217 = 0x8217;
  public static readonly FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE: 0x8217 = 0x8217;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_DEFAULT: 0x8218 = 0x8218;
  public static readonly FRAMEBUFFER_DEFAULT: 0x8218 = 0x8218;

  /**
   * @constant {number}
   */
  public readonly DEPTH24_STENCIL8: 0x88f0 = 0x88f0;
  public static readonly DEPTH24_STENCIL8: 0x88f0 = 0x88f0;

  /**
   * @constant {number}
   */
  public readonly DRAW_FRAMEBUFFER_BINDING: 0x8ca6 = 0x8ca6;
  public static readonly DRAW_FRAMEBUFFER_BINDING: 0x8ca6 = 0x8ca6;

  /**
   * @constant {number}
   */
  public readonly READ_FRAMEBUFFER: 0x8ca8 = 0x8ca8;
  public static readonly READ_FRAMEBUFFER: 0x8ca8 = 0x8ca8;

  /**
   * @constant {number}
   */
  public readonly DRAW_FRAMEBUFFER: 0x8ca9 = 0x8ca9;
  public static readonly DRAW_FRAMEBUFFER: 0x8ca9 = 0x8ca9;

  /**
   * @constant {number}
   */
  public readonly READ_FRAMEBUFFER_BINDING: 0x8caa = 0x8caa;
  public static readonly READ_FRAMEBUFFER_BINDING: 0x8caa = 0x8caa;

  /**
   * @constant {number}
   */
  public readonly RENDERBUFFER_SAMPLES: 0x8cab = 0x8cab;
  public static readonly RENDERBUFFER_SAMPLES: 0x8cab = 0x8cab;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER: 0x8cd4 = 0x8cd4;
  public static readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER: 0x8cd4 = 0x8cd4;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_INCOMPLETE_MULTISAMPLE: 0x8d56 = 0x8d56;
  public static readonly FRAMEBUFFER_INCOMPLETE_MULTISAMPLE: 0x8d56 = 0x8d56;

  // Uniforms

  /**
   * @constant {number}
   */
  public readonly UNIFORM_BUFFER: 0x8a11 = 0x8a11;
  public static readonly UNIFORM_BUFFER: 0x8a11 = 0x8a11;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_BUFFER_BINDING: 0x8a28 = 0x8a28;
  public static readonly UNIFORM_BUFFER_BINDING: 0x8a28 = 0x8a28;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_BUFFER_START: 0x8a29 = 0x8a29;
  public static readonly UNIFORM_BUFFER_START: 0x8a29 = 0x8a29;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_BUFFER_SIZE: 0x8a2a = 0x8a2a;
  public static readonly UNIFORM_BUFFER_SIZE: 0x8a2a = 0x8a2a;

  /**
   * @constant {number}
   */
  public readonly MAX_VERTEX_UNIFORM_BLOCKS: 0x8a2b = 0x8a2b;
  public static readonly MAX_VERTEX_UNIFORM_BLOCKS: 0x8a2b = 0x8a2b;

  /**
   * @constant {number}
   */
  public readonly MAX_FRAGMENT_UNIFORM_BLOCKS: 0x8a2d = 0x8a2d;
  public static readonly MAX_FRAGMENT_UNIFORM_BLOCKS: 0x8a2d = 0x8a2d;

  /**
   * @constant {number}
   */
  public readonly MAX_COMBINED_UNIFORM_BLOCKS: 0x8a2e = 0x8a2e;
  public static readonly MAX_COMBINED_UNIFORM_BLOCKS: 0x8a2e = 0x8a2e;

  /**
   * @constant {number}
   */
  public readonly MAX_UNIFORM_BUFFER_BINDINGS: 0x8a2f = 0x8a2f;
  public static readonly MAX_UNIFORM_BUFFER_BINDINGS: 0x8a2f = 0x8a2f;

  /**
   * @constant {number}
   */
  public readonly MAX_UNIFORM_BLOCK_SIZE: 0x8a30 = 0x8a30;
  public static readonly MAX_UNIFORM_BLOCK_SIZE: 0x8a30 = 0x8a30;

  /**
   * @constant {number}
   */
  public readonly MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS: 0x8a31 = 0x8a31;
  public static readonly MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS: 0x8a31 = 0x8a31;

  /**
   * @constant {number}
   */
  public readonly MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS: 0x8a33 = 0x8a33;
  public static readonly MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS: 0x8a33 = 0x8a33;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_BUFFER_OFFSET_ALIGNMENT: 0x8a34 = 0x8a34;
  public static readonly UNIFORM_BUFFER_OFFSET_ALIGNMENT: 0x8a34 = 0x8a34;

  /**
   * @constant {number}
   */
  public readonly ACTIVE_UNIFORM_BLOCKS: 0x8a36 = 0x8a36;
  public static readonly ACTIVE_UNIFORM_BLOCKS: 0x8a36 = 0x8a36;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_TYPE: 0x8a37 = 0x8a37;
  public static readonly UNIFORM_TYPE: 0x8a37 = 0x8a37;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_SIZE: 0x8a38 = 0x8a38;
  public static readonly UNIFORM_SIZE: 0x8a38 = 0x8a38;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_BLOCK_INDEX: 0x8a3a = 0x8a3a;
  public static readonly UNIFORM_BLOCK_INDEX: 0x8a3a = 0x8a3a;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_OFFSET: 0x8a3b = 0x8a3b;
  public static readonly UNIFORM_OFFSET: 0x8a3b = 0x8a3b;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_ARRAY_STRIDE: 0x8a3c = 0x8a3c;
  public static readonly UNIFORM_ARRAY_STRIDE: 0x8a3c = 0x8a3c;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_MATRIX_STRIDE: 0x8a3d = 0x8a3d;
  public static readonly UNIFORM_MATRIX_STRIDE: 0x8a3d = 0x8a3d;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_IS_ROW_MAJOR: 0x8a3e = 0x8a3e;
  public static readonly UNIFORM_IS_ROW_MAJOR: 0x8a3e = 0x8a3e;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_BLOCK_BINDING: 0x8a3f = 0x8a3f;
  public static readonly UNIFORM_BLOCK_BINDING: 0x8a3f = 0x8a3f;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_BLOCK_DATA_SIZE: 0x8a40 = 0x8a40;
  public static readonly UNIFORM_BLOCK_DATA_SIZE: 0x8a40 = 0x8a40;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_BLOCK_ACTIVE_UNIFORMS: 0x8a42 = 0x8a42;
  public static readonly UNIFORM_BLOCK_ACTIVE_UNIFORMS: 0x8a42 = 0x8a42;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES: 0x8a43 = 0x8a43;
  public static readonly UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES: 0x8a43 = 0x8a43;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER: 0x8a44 = 0x8a44;
  public static readonly UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER: 0x8a44 = 0x8a44;

  /**
   * @constant {number}
   */
  public readonly UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER: 0x8a46 = 0x8a46;
  public static readonly UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER: 0x8a46 = 0x8a46;

  // Sync objects

  /**
   * @constant {number}
   */
  public readonly OBJECT_TYPE: 0x9112 = 0x9112;
  public static readonly OBJECT_TYPE: 0x9112 = 0x9112;

  /**
   * @constant {number}
   */
  public readonly SYNC_CONDITION: 0x9113 = 0x9113;
  public static readonly SYNC_CONDITION: 0x9113 = 0x9113;

  /**
   * @constant {number}
   */
  public readonly SYNC_STATUS: 0x9114 = 0x9114;
  public static readonly SYNC_STATUS: 0x9114 = 0x9114;

  /**
   * @constant {number}
   */
  public readonly SYNC_FLAGS: 0x9115 = 0x9115;
  public static readonly SYNC_FLAGS: 0x9115 = 0x9115;

  /**
   * @constant {number}
   */
  public readonly SYNC_FENCE: 0x9116 = 0x9116;
  public static readonly SYNC_FENCE: 0x9116 = 0x9116;

  /**
   * @constant {number}
   */
  public readonly SYNC_GPU_COMMANDS_COMPLETE: 0x9117 = 0x9117;
  public static readonly SYNC_GPU_COMMANDS_COMPLETE: 0x9117 = 0x9117;

  /**
   * @constant {number}
   */
  public readonly UNSIGNALED: 0x9118 = 0x9118;
  public static readonly UNSIGNALED: 0x9118 = 0x9118;

  /**
   * @constant {number}
   */
  public readonly SIGNALED: 0x9119 = 0x9119;
  public static readonly SIGNALED: 0x9119 = 0x9119;

  /**
   * @constant {number}
   */
  public readonly ALREADY_SIGNALED: 0x911a = 0x911a;
  public static readonly ALREADY_SIGNALED: 0x911a = 0x911a;

  /**
   * @constant {number}
   */
  public readonly TIMEOUT_EXPIRED: 0x911b = 0x911b;
  public static readonly TIMEOUT_EXPIRED: 0x911b = 0x911b;

  /**
   * @constant {number}
   */
  public readonly CONDITION_SATISFIED: 0x911c = 0x911c;
  public static readonly CONDITION_SATISFIED: 0x911c = 0x911c;

  /**
   * @constant {number}
   */
  public readonly WAIT_FAILED: 0x911d = 0x911d;
  public static readonly WAIT_FAILED: 0x911d = 0x911d;

  /**
   * @constant {number}
   */
  public readonly SYNC_FLUSH_COMMANDS_BIT: 0x00000001 = 0x00000001;
  public static readonly SYNC_FLUSH_COMMANDS_BIT: 0x00000001 = 0x00000001;

  // Miscellaneous constants

  /**
   * @constant {number}
   */
  public readonly COLOR: 0x1800 = 0x1800;
  public static readonly COLOR: 0x1800 = 0x1800;

  /**
   * @constant {number}
   */
  public readonly DEPTH: 0x1801 = 0x1801;
  public static readonly DEPTH: 0x1801 = 0x1801;

  /**
   * @constant {number}
   */
  public readonly STENCIL: 0x1802 = 0x1802;
  public static readonly STENCIL: 0x1802 = 0x1802;

  /**
   * @constant {number}
   */
  public readonly MIN: 0x8007 = 0x8007;
  public static readonly MIN: 0x8007 = 0x8007;

  /**
   * @constant {number}
   */
  public readonly MAX: 0x8008 = 0x8008;
  public static readonly MAX: 0x8008 = 0x8008;

  /**
   * @constant {number}
   */
  public readonly DEPTH_COMPONENT24: 0x81a6 = 0x81a6;
  public static readonly DEPTH_COMPONENT24: 0x81a6 = 0x81a6;

  /**
   * @constant {number}
   */
  public readonly STREAM_READ: 0x88e1 = 0x88e1;
  public static readonly STREAM_READ: 0x88e1 = 0x88e1;

  /**
   * @constant {number}
   */
  public readonly STREAM_COPY: 0x88e2 = 0x88e2;
  public static readonly STREAM_COPY: 0x88e2 = 0x88e2;

  /**
   * @constant {number}
   */
  public readonly STATIC_READ: 0x88e5 = 0x88e5;
  public static readonly STATIC_READ: 0x88e5 = 0x88e5;

  /**
   * @constant {number}
   */
  public readonly STATIC_COPY: 0x88e6 = 0x88e6;
  public static readonly STATIC_COPY: 0x88e6 = 0x88e6;

  /**
   * @constant {number}
   */
  public readonly DYNAMIC_READ: 0x88e9 = 0x88e9;
  public static readonly DYNAMIC_READ: 0x88e9 = 0x88e9;

  /**
   * @constant {number}
   */
  public readonly DYNAMIC_COPY: 0x88ea = 0x88ea;
  public static readonly DYNAMIC_COPY: 0x88ea = 0x88ea;

  /**
   * @constant {number}
   */
  public readonly DEPTH_COMPONENT32F: 0x8cac = 0x8cac;
  public static readonly DEPTH_COMPONENT32F: 0x8cac = 0x8cac;

  /**
   * @constant {number}
   */
  public readonly DEPTH32F_STENCIL8: 0x8cad = 0x8cad;
  public static readonly DEPTH32F_STENCIL8: 0x8cad = 0x8cad;

  /**
   * @constant {number}
   */
  public readonly INVALID_INDEX: 0xffffffff = 0xffffffff;
  public static readonly INVALID_INDEX: 0xffffffff = 0xffffffff;

  /**
   * @constant {number}
   */
  public readonly TIMEOUT_IGNORED: -1 = -1;
  public static readonly TIMEOUT_IGNORED: -1 = -1;

  /**
   * @constant {number}
   */
  public readonly MAX_CLIENT_WAIT_TIMEOUT_WEBGL: 0x9247 = 0x9247;
  public static readonly MAX_CLIENT_WAIT_TIMEOUT_WEBGL: 0x9247 = 0x9247;

  // Constants defined in WebGL extensions

  // ANGLE_instanced_arrays
  // The ANGLE_instanced_arrays extension is part of the WebGL API and allows to draw the same object, or groups of similar objects multiple times, if they share the same vertex data, primitive count and type
  /**
   * Describes the frequency divisor used for instanced rendering
   * @constant {number}
   */
  public readonly VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE: 0x88fe = 0x88fe;
  public static readonly VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE: 0x88fe = 0x88fe;

  // WEBGL_debug_renderer_info
  // The WEBGL_debug_renderer_info extension is part of the WebGL API and exposes two constants with information about the graphics driver for debugging purposes
  /**
   * Passed to getParameter to get the vendor string of the graphics driver
   * @constant {number}
   */
  public readonly UNMASKED_VENDOR_WEBGL: 0x9245 = 0x9245;
  public static readonly UNMASKED_VENDOR_WEBGL: 0x9245 = 0x9245;

  /**
   * Passed to getParameter to get the renderer string of the graphics driver
   * @constant {number}
   */
  public readonly UNMASKED_RENDERER_WEBGL: 0x9246 = 0x9246;
  public static readonly UNMASKED_RENDERER_WEBGL: 0x9246 = 0x9246;

  // EXT_texture_filter_anisotropic
  // The EXT_texture_filter_anisotropic extension is part of the WebGL API and exposes two constants for anisotropic filtering (AF)
  /**
   * Returns the maximum available anisotropy
   * @constant {number}
   */
  public readonly MAX_TEXTURE_MAX_ANISOTROPY_EXT: 0x84ff = 0x84ff;
  public static readonly MAX_TEXTURE_MAX_ANISOTROPY_EXT: 0x84ff = 0x84ff;

  /**
   * Passed to texParameter to set the desired maximum anisotropy for a texture
   * @constant {number}
   */
  public readonly TEXTURE_MAX_ANISOTROPY_EXT: 0x84fe = 0x84fe;
  public static readonly TEXTURE_MAX_ANISOTROPY_EXT: 0x84fe = 0x84fe;

  // WEBGL_compressed_texture_s3tc
  // The WEBGL_compressed_texture_s3tc extension is part of the WebGL API and exposes four S3TC compressed texture formats
  /**
   * A DXT1-compressed image in an RGB image format
   * @constant {number}
   */
  public readonly COMPRESSED_RGB_S3TC_DXT1_EXT: 0x83f0 = 0x83f0;
  public static readonly COMPRESSED_RGB_S3TC_DXT1_EXT: 0x83f0 = 0x83f0;

  /**
   * A DXT1-compressed image in an RGB image format with a simple on/off alpha value
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_S3TC_DXT1_EXT: 0x83f1 = 0x83f1;
  public static readonly COMPRESSED_RGBA_S3TC_DXT1_EXT: 0x83f1 = 0x83f1;

  /**
   * A DXT3-compressed image in an RGBA image format. Compared to a 32-bit RGBA texture, it offers 4:1 compression
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_S3TC_DXT3_EXT: 0x83f2 = 0x83f2;
  public static readonly COMPRESSED_RGBA_S3TC_DXT3_EXT: 0x83f2 = 0x83f2;

  /**
   * A DXT5-compressed image in an RGBA image format. It also provides a 4:1 compression, but differs to the DXT3 compression in how the alpha compression is done
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_S3TC_DXT5_EXT: 0x83f3 = 0x83f3;
  public static readonly COMPRESSED_RGBA_S3TC_DXT5_EXT: 0x83f3 = 0x83f3;

  // WEBGL_compressed_texture_s3tc_srgb
  // The WEBGL_compressed_texture_s3tc_srgb extension is part of the WebGL API and exposes four S3TC compressed texture formats for the sRGB colorspace
  /**
   * A DXT1-compressed image in an sRGB image format
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB_S3TC_DXT1_EXT: 0x8c4c = 0x8c4c;
  public static readonly COMPRESSED_SRGB_S3TC_DXT1_EXT: 0x8c4c = 0x8c4c;

  /**
   * A DXT1-compressed image in an sRGB image format with a simple on/off alpha value
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT: 0x8c4d = 0x8c4d;
  public static readonly COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT: 0x8c4d = 0x8c4d;

  /**
   * A DXT3-compressed image in an sRGBA image format
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT: 0x8c4e = 0x8c4e;
  public static readonly COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT: 0x8c4e = 0x8c4e;

  /**
   * A DXT5-compressed image in an sRGBA image format
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT: 0x8c4f = 0x8c4f;
  public static readonly COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT: 0x8c4f = 0x8c4f;

  // WEBGL_compressed_texture_etc
  // The WEBGL_compressed_texture_etc extension is part of the WebGL API and exposes 10 ETC/EAC compressed texture formats
  /**
   * One-channel (red) unsigned format compression
   * @constant {number}
   */
  public readonly COMPRESSED_R11_EAC: 0x9270 = 0x9270;
  public static readonly COMPRESSED_R11_EAC: 0x9270 = 0x9270;

  /**
   * One-channel (red) signed format compression
   * @constant {number}
   */
  public readonly COMPRESSED_SIGNED_R11_EAC: 0x9271 = 0x9271;
  public static readonly COMPRESSED_SIGNED_R11_EAC: 0x9271 = 0x9271;

  /**
   * Two-channel (red and green) unsigned format compression
   * @constant {number}
   */
  public readonly COMPRESSED_RG11_EAC: 0x9272 = 0x9272;
  public static readonly COMPRESSED_RG11_EAC: 0x9272 = 0x9272;

  /**
   * Two-channel (red and green) signed format compression
   * @constant {number}
   */
  public readonly COMPRESSED_SIGNED_RG11_EAC: 0x9273 = 0x9273;
  public static readonly COMPRESSED_SIGNED_RG11_EAC: 0x9273 = 0x9273;
  /**
   * Compresses RBG8 data with no alpha channel
   * @constant {number}
   */
  public readonly COMPRESSED_RGB8_ETC2: 0x9274 = 0x9274;
  public static readonly COMPRESSED_RGB8_ETC2: 0x9274 = 0x9274;

  /**
   * Compresses RGBA8 data. The RGB part is encoded the same as RGB_ETC2, but the alpha part is encoded separately
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA8_ETC2_EAC: 0x9278 = 0x9278;
  public static readonly COMPRESSED_RGBA8_ETC2_EAC: 0x9278 = 0x9278;

  /**
   * Compresses sRBG8 data with no alpha channel
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ETC2: 0x9275 = 0x9275;
  public static readonly COMPRESSED_SRGB8_ETC2: 0x9275 = 0x9275;

  /**
   * Compresses sRGBA8 data. The sRGB part is encoded the same as SRGB_ETC2, but the alpha part is encoded separately
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ETC2_EAC: 0x9279 = 0x9279;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ETC2_EAC: 0x9279 = 0x9279;

  /**
   * Similar to RGB8_ETC, but with ability to punch through the alpha channel, which means to make it completely opaque or transparent
   * @constant {number}
   */
  public readonly COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2: 0x9276 = 0x9276;
  public static readonly COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2: 0x9276 = 0x9276;

  /**
   * Similar to SRGB8_ETC, but with ability to punch through the alpha channel, which means to make it completely opaque or transparent
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2: 0x9277 = 0x9277;
  public static readonly COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2: 0x9277 = 0x9277;

  // WEBGL_compressed_texture_pvrtc
  // The WEBGL_compressed_texture_pvrtc extension is part of the WebGL API and exposes four PVRTC compressed texture formats
  /**
   * RGB compression in 4-bit mode. One block for each 4×4 pixels
   * @constant {number}
   */
  public readonly COMPRESSED_RGB_PVRTC_4BPPV1_IMG: 0x8c00 = 0x8c00;
  public static readonly COMPRESSED_RGB_PVRTC_4BPPV1_IMG: 0x8c00 = 0x8c00;

  /**
   * RGBA compression in 4-bit mode. One block for each 4×4 pixels
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: 0x8c02 = 0x8c02;
  public static readonly COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: 0x8c02 = 0x8c02;

  /**
   * RGB compression in 2-bit mode. One block for each 8×4 pixels
   * @constant {number}
   */
  public readonly COMPRESSED_RGB_PVRTC_2BPPV1_IMG: 0x8c01 = 0x8c01;
  public static readonly COMPRESSED_RGB_PVRTC_2BPPV1_IMG: 0x8c01 = 0x8c01;

  /**
   * RGBA compression in 2-bit mode. One block for each 8×4 pixels
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: 0x8c03 = 0x8c03;
  public static readonly COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: 0x8c03 = 0x8c03;

  // WEBGL_compressed_texture_etc1
  // The WEBGL_compressed_texture_etc1 extension is part of the WebGL API and exposes the ETC1 compressed texture format
  /**
   * Compresses 24-bit RGB data with no alpha channel
   * @constant {number}
   */
  public readonly COMPRESSED_RGB_ETC1_WEBGL: 0x8d64 = 0x8d64;
  public static readonly COMPRESSED_RGB_ETC1_WEBGL: 0x8d64 = 0x8d64;

  // WEBGL_compressed_texture_atc
  // The WEBGL_compressed_texture_atc extension is part of the WebGL API and exposes 3 ATC compressed texture formats. ATC is a proprietary compression algorithm for compressing textures on handheld devices
  /**
   * Compresses RGB textures with no alpha channel
   * @constant {number}
   */
  public readonly COMPRESSED_RGB_ATC_WEBGL: 0x8c92 = 0x8c92;
  public static readonly COMPRESSED_RGB_ATC_WEBGL: 0x8c92 = 0x8c92;

  /**
   * Compresses RGBA textures using explicit alpha encoding (useful when alpha transitions are sharp)
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL: 0x8c92 = 0x8c92;
  public static readonly COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL: 0x8c92 = 0x8c92;

  /**
   * Compresses RGBA textures using interpolated alpha encoding (useful when alpha transitions are gradient)
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL: 0x87ee = 0x87ee;
  public static readonly COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL: 0x87ee = 0x87ee;

  // WEBGL_compressed_texture_astc
  // The WEBGL_compressed_texture_astc extension is part of the WebGL API and exposes Adaptive Scalable Texture Compression (ASTC) compressed texture formats to WebGL
  // https://www.khronos.org/registry/webgl/extensions/WEBGL_compressed_texture_astc/
  // https://developer.nvidia.com/astc-texture-compression-for-game-assets
  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 4x4
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_4X4_KHR: 0x93b0 = 0x93b0;
  public static readonly COMPRESSED_RGBA_ASTC_4X4_KHR: 0x93b0 = 0x93b0;
  public readonly COMPRESSED_RGBA_ASTC_4x4_KHR: 0x93b0 = 0x93b0;
  public static readonly COMPRESSED_RGBA_ASTC_4x4_KHR: 0x93b0 = 0x93b0;

  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 5x4
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_5X4_KHR: 0x93b1 = 0x93b1;
  public static readonly COMPRESSED_RGBA_ASTC_5X4_KHR: 0x93b1 = 0x93b1;
  public readonly COMPRESSED_RGBA_ASTC_5x4_KHR: 0x93b1 = 0x93b1;
  public static readonly COMPRESSED_RGBA_ASTC_5x4_KHR: 0x93b1 = 0x93b1;

  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 5x5
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_5X5_KHR: 0x93b2 = 0x93b2;
  public static readonly COMPRESSED_RGBA_ASTC_5X5_KHR: 0x93b2 = 0x93b2;
  public readonly COMPRESSED_RGBA_ASTC_5x5_KHR: 0x93b2 = 0x93b2;
  public static readonly COMPRESSED_RGBA_ASTC_5x5_KHR: 0x93b2 = 0x93b2;

  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 6x5
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_6X5_KHR: 0x93b3 = 0x93b3;
  public static readonly COMPRESSED_RGBA_ASTC_6X5_KHR: 0x93b3 = 0x93b3;
  public readonly COMPRESSED_RGBA_ASTC_6x5_KHR: 0x93b3 = 0x93b3;
  public static readonly COMPRESSED_RGBA_ASTC_6x5_KHR: 0x93b3 = 0x93b3;

  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 6x6
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_6X6_KHR: 0x93b4 = 0x93b4;
  public static readonly COMPRESSED_RGBA_ASTC_6X6_KHR: 0x93b4 = 0x93b4;
  public readonly COMPRESSED_RGBA_ASTC_6x6_KHR: 0x93b4 = 0x93b4;
  public static readonly COMPRESSED_RGBA_ASTC_6x6_KHR: 0x93b4 = 0x93b4;

  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 8x5
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_8X5_KHR: 0x93b5 = 0x93b5;
  public static readonly COMPRESSED_RGBA_ASTC_8X5_KHR: 0x93b5 = 0x93b5;
  public readonly COMPRESSED_RGBA_ASTC_8x5_KHR: 0x93b5 = 0x93b5;
  public static readonly COMPRESSED_RGBA_ASTC_8x5_KHR: 0x93b5 = 0x93b5;

  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 8x6
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_8X6_KHR: 0x93b6 = 0x93b6;
  public static readonly COMPRESSED_RGBA_ASTC_8X6_KHR: 0x93b6 = 0x93b6;
  public readonly COMPRESSED_RGBA_ASTC_8x6_KHR: 0x93b6 = 0x93b6;
  public static readonly COMPRESSED_RGBA_ASTC_8x6_KHR: 0x93b6 = 0x93b6;

  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 8x8
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_8X8_KHR: 0x93b7 = 0x93b7;
  public static readonly COMPRESSED_RGBA_ASTC_8X8_KHR: 0x93b7 = 0x93b7;
  public readonly COMPRESSED_RGBA_ASTC_8x8_KHR: 0x93b7 = 0x93b7;
  public static readonly COMPRESSED_RGBA_ASTC_8x8_KHR: 0x93b7 = 0x93b7;

  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 10x5
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_10X5_KHR: 0x93b8 = 0x93b8;
  public static readonly COMPRESSED_RGBA_ASTC_10X5_KHR: 0x93b8 = 0x93b8;
  public readonly COMPRESSED_RGBA_ASTC_10x5_KHR: 0x93b8 = 0x93b8;
  public static readonly COMPRESSED_RGBA_ASTC_10x5_KHR: 0x93b8 = 0x93b8;

  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 10x6
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_10X6_KHR: 0x93b9 = 0x93b9;
  public static readonly COMPRESSED_RGBA_ASTC_10X6_KHR: 0x93b9 = 0x93b9;
  public readonly COMPRESSED_RGBA_ASTC_10x6_KHR: 0x93b9 = 0x93b9;
  public static readonly COMPRESSED_RGBA_ASTC_10x6_KHR: 0x93b9 = 0x93b9;

  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 10x8
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_10X8_KHR: 0x93ba = 0x93ba;
  public static readonly COMPRESSED_RGBA_ASTC_10X8_KHR: 0x93ba = 0x93ba;
  public readonly COMPRESSED_RGBA_ASTC_10x8_KHR: 0x93ba = 0x93ba;
  public static readonly COMPRESSED_RGBA_ASTC_10x8_KHR: 0x93ba = 0x93ba;

  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 10x10
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_10X10_KHR: 0x93bb = 0x93bb;
  public static readonly COMPRESSED_RGBA_ASTC_10X10_KHR: 0x93bb = 0x93bb;
  public readonly COMPRESSED_RGBA_ASTC_10x10_KHR: 0x93bb = 0x93bb;
  public static readonly COMPRESSED_RGBA_ASTC_10x10_KHR: 0x93bb = 0x93bb;

  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 12x10
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_12X10_KHR: 0x93bc = 0x93bc;
  public static readonly COMPRESSED_RGBA_ASTC_12X10_KHR: 0x93bc = 0x93bc;
  public readonly COMPRESSED_RGBA_ASTC_12x10_KHR: 0x93bc = 0x93bc;
  public static readonly COMPRESSED_RGBA_ASTC_12x10_KHR: 0x93bc = 0x93bc;

  /**
   * Compresses RGBA textures using ASTC compression in a blocksize of 12x12
   * @constant {number}
   */
  public readonly COMPRESSED_RGBA_ASTC_12X12_KHR: 0x93bd = 0x93bd;
  public static readonly COMPRESSED_RGBA_ASTC_12X12_KHR: 0x93bd = 0x93bd;
  public readonly COMPRESSED_RGBA_ASTC_12x12_KHR: 0x93bd = 0x93bd;
  public static readonly COMPRESSED_RGBA_ASTC_12x12_KHR: 0x93bd = 0x93bd;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 4x4
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_4X4_KHR: 0x93d0 = 0x93d0;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_4X4_KHR: 0x93d0 = 0x93d0;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR: 0x93d0 = 0x93d0;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR: 0x93d0 = 0x93d0;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 5x4
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_5X4_KHR: 0x93d1 = 0x93d1;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_5X4_KHR: 0x93d1 = 0x93d1;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR: 0x93d1 = 0x93d1;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR: 0x93d1 = 0x93d1;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 5x5
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_5X5_KHR: 0x93d2 = 0x93d2;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_5X5_KHR: 0x93d2 = 0x93d2;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR: 0x93d2 = 0x93d2;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR: 0x93d2 = 0x93d2;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 6x5
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_6X5_KHR: 0x93d3 = 0x93d3;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_6X5_KHR: 0x93d3 = 0x93d3;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR: 0x93d3 = 0x93d3;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR: 0x93d3 = 0x93d3;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 6x6
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_6X6_KHR: 0x93d4 = 0x93d4;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_6X6_KHR: 0x93d4 = 0x93d4;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR: 0x93d4 = 0x93d4;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR: 0x93d4 = 0x93d4;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 8x5
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_8X5_KHR: 0x93d5 = 0x93d5;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_8X5_KHR: 0x93d5 = 0x93d5;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR: 0x93d5 = 0x93d5;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR: 0x93d5 = 0x93d5;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 8x6
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_8X6_KHR: 0x93d6 = 0x93d6;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_8X6_KHR: 0x93d6 = 0x93d6;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR: 0x93d6 = 0x93d6;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR: 0x93d6 = 0x93d6;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 8x8
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_8X8_KHR: 0x93d7 = 0x93d7;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_8X8_KHR: 0x93d7 = 0x93d7;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR: 0x93d7 = 0x93d7;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR: 0x93d7 = 0x93d7;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 10x5
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10X5_KHR: 0x93d8 = 0x93d8;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10X5_KHR: 0x93d8 = 0x93d8;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR: 0x93d8 = 0x93d8;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR: 0x93d8 = 0x93d8;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 10x6
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10X6_KHR: 0x93d9 = 0x93d9;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10X6_KHR: 0x93d9 = 0x93d9;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR: 0x93d9 = 0x93d9;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR: 0x93d9 = 0x93d9;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 10x8
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10X8_KHR: 0x93da = 0x93da;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10X8_KHR: 0x93da = 0x93da;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR: 0x93da = 0x93da;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR: 0x93da = 0x93da;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 10x10
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10X10_KHR: 0x93db = 0x93db;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10X10_KHR: 0x93db = 0x93db;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR: 0x93db = 0x93db;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR: 0x93db = 0x93db;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 12x10
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_12X10_KHR: 0x93dc = 0x93dc;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_12X10_KHR: 0x93dc = 0x93dc;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR: 0x93dc = 0x93dc;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR: 0x93dc = 0x93dc;

  /**
   * Compresses SRGB8 textures using ASTC compression in a blocksize of 12x12
   * @constant {number}
   */
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_12X12_KHR: 0x93dd = 0x93dd;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_12X12_KHR: 0x93dd = 0x93dd;
  public readonly COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR: 0x93dd = 0x93dd;
  public static readonly COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR: 0x93dd = 0x93dd;

  // WEBGL_depth_texture
  // The WEBGL_depth_texture extension is part of the WebGL API and defines 2D depth and depth-stencil textures
  /**
   * Unsigned integer type for 24-bit depth texture data
   * @constant {number}
   */
  public readonly UNSIGNED_INT_24_8_WEBGL: 0x84fa = 0x84fa;
  public static readonly UNSIGNED_INT_24_8_WEBGL: 0x84fa = 0x84fa;

  // OES_texture_half_float
  // The OES_texture_half_float extension is part of the WebGL API and adds texture formats with 16- (aka half float) and 32-bit floating-point components
  /**
   * Half floating-point type (16-bit)
   * @constant {number}
   */
  public readonly HALF_FLOAT_OES: 0x8d61 = 0x8d61;
  public static readonly HALF_FLOAT_OES: 0x8d61 = 0x8d61;

  // WEBGL_color_buffer_float
  // The WEBGL_color_buffer_float extension is part of the WebGL API and adds the ability to render to 32-bit floating-point color buffers
  /**
   * RGBA 32-bit floating-point color-renderable format
   * @constant {number}
   */
  public readonly RGBA32F_EXT: 0x8814 = 0x8814;
  public static readonly RGBA32F_EXT: 0x8814 = 0x8814;

  /**
   * RGB 32-bit floating-point color-renderable format
   * @constant {number}
   */
  public readonly RGB32F_EXT: 0x8815 = 0x8815;
  public static readonly RGB32F_EXT: 0x8815 = 0x8815;

  /**
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT: 0x8211 = 0x8211;
  public static readonly FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT: 0x8211 = 0x8211;

  /**
   * @constant {number}
   */
  public readonly UNSIGNED_NORMALIZED_EXT: 0x8c17 = 0x8c17;
  public static readonly UNSIGNED_NORMALIZED_EXT: 0x8c17 = 0x8c17;

  // EXT_blend_minmax
  // The EXT_blend_minmax extension is part of the WebGL API and extends blending capabilities by adding two new blend equations: the minimum or maximum color components of the source and destination colors
  /**
   * Produces the minimum color components of the source and destination colors
   * @constant {number}
   */
  public readonly MIN_EXT: 0x8007 = 0x8007;
  public static readonly MIN_EXT: 0x8007 = 0x8007;

  /**
   * Produces the maximum color components of the source and destination colors
   * @constant {number}
   */
  public readonly MAX_EXT: 0x8008 = 0x8008;
  public static readonly MAX_EXT: 0x8008 = 0x8008;

  // EXT_sRGB
  // The EXT_sRGB extension is part of the WebGL API and adds sRGB support to textures and framebuffer objects
  /**
   * Unsized sRGB format that leaves the precision up to the driver
   * @constant {number}
   */
  public readonly SRGB_EXT: 0x8c40 = 0x8c40;
  public static readonly SRGB_EXT: 0x8c40 = 0x8c40;

  /**
   * Unsized sRGB format with unsized alpha component
   * @constant {number}
   */
  public readonly SRGB_ALPHA_EXT: 0x8c42 = 0x8c42;
  public static readonly SRGB_ALPHA_EXT: 0x8c42 = 0x8c42;

  /**
   * Sized (8-bit) sRGB and alpha formats
   * @constant {number}
   */
  public readonly SRGB8_ALPHA8_EXT: 0x8c43 = 0x8c43;
  public static readonly SRGB8_ALPHA8_EXT: 0x8c43 = 0x8c43;

  /**
   * Returns the framebuffer color encoding
   * @constant {number}
   */
  public readonly FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT: 0x8210 = 0x8210;
  public static readonly FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT: 0x8210 = 0x8210;

  // OES_standard_derivatives
  // The OES_standard_derivatives extension is part of the WebGL API and adds the GLSL derivative functions dFdx, dFdy, and fwidth
  /**
   * Indicates the accuracy of the derivative calculation for the GLSL built-in functions: dFdx, dFdy, and fwidth
   * @constant {number}
   */
  public readonly FRAGMENT_SHADER_DERIVATIVE_HINT_OES: 0x8b8b = 0x8b8b;
  public static readonly FRAGMENT_SHADER_DERIVATIVE_HINT_OES: 0x8b8b = 0x8b8b;

  // WEBGL_draw_buffers
  // The WEBGL_draw_buffers extension is part of the WebGL API and enables a fragment shader to write to several textures, which is useful for deferred shading, for example
  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT0_WEBGL: 0x8ce0 = 0x8ce0;
  public static readonly COLOR_ATTACHMENT0_WEBGL: 0x8ce0 = 0x8ce0;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT1_WEBGL: 0x8ce1 = 0x8ce1;
  public static readonly COLOR_ATTACHMENT1_WEBGL: 0x8ce1 = 0x8ce1;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT2_WEBGL: 0x8ce2 = 0x8ce2;
  public static readonly COLOR_ATTACHMENT2_WEBGL: 0x8ce2 = 0x8ce2;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT3_WEBGL: 0x8ce3 = 0x8ce3;
  public static readonly COLOR_ATTACHMENT3_WEBGL: 0x8ce3 = 0x8ce3;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT4_WEBGL: 0x8ce4 = 0x8ce4;
  public static readonly COLOR_ATTACHMENT4_WEBGL: 0x8ce4 = 0x8ce4;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT5_WEBGL: 0x8ce5 = 0x8ce5;
  public static readonly COLOR_ATTACHMENT5_WEBGL: 0x8ce5 = 0x8ce5;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT6_WEBGL: 0x8ce6 = 0x8ce6;
  public static readonly COLOR_ATTACHMENT6_WEBGL: 0x8ce6 = 0x8ce6;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT7_WEBGL: 0x8ce7 = 0x8ce7;
  public static readonly COLOR_ATTACHMENT7_WEBGL: 0x8ce7 = 0x8ce7;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT8_WEBGL: 0x8ce8 = 0x8ce8;
  public static readonly COLOR_ATTACHMENT8_WEBGL: 0x8ce8 = 0x8ce8;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT9_WEBGL: 0x8ce9 = 0x8ce9;
  public static readonly COLOR_ATTACHMENT9_WEBGL: 0x8ce9 = 0x8ce9;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT10_WEBGL: 0x8cea = 0x8cea;
  public static readonly COLOR_ATTACHMENT10_WEBGL: 0x8cea = 0x8cea;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT11_WEBGL: 0x8ceb = 0x8ceb;
  public static readonly COLOR_ATTACHMENT11_WEBGL: 0x8ceb = 0x8ceb;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT12_WEBGL: 0x8cec = 0x8cec;
  public static readonly COLOR_ATTACHMENT12_WEBGL: 0x8cec = 0x8cec;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT13_WEBGL: 0x8ced = 0x8ced;
  public static readonly COLOR_ATTACHMENT13_WEBGL: 0x8ced = 0x8ced;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT14_WEBGL: 0x8cee = 0x8cee;
  public static readonly COLOR_ATTACHMENT14_WEBGL: 0x8cee = 0x8cee;

  /**
   * Framebuffer color attachment point
   * @constant {number}
   */
  public readonly COLOR_ATTACHMENT15_WEBGL: 0x8cef = 0x8cef;
  public static readonly COLOR_ATTACHMENT15_WEBGL: 0x8cef = 0x8cef;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER0_WEBGL: 0x8825 = 0x8825;
  public static readonly DRAW_BUFFER0_WEBGL: 0x8825 = 0x8825;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER1_WEBGL: 0x8826 = 0x8826;
  public static readonly DRAW_BUFFER1_WEBGL: 0x8826 = 0x8826;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER2_WEBGL: 0x8827 = 0x8827;
  public static readonly DRAW_BUFFER2_WEBGL: 0x8827 = 0x8827;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER3_WEBGL: 0x8828 = 0x8828;
  public static readonly DRAW_BUFFER3_WEBGL: 0x8828 = 0x8828;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER4_WEBGL: 0x8829 = 0x8829;
  public static readonly DRAW_BUFFER4_WEBGL: 0x8829 = 0x8829;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER5_WEBGL: 0x882a = 0x882a;
  public static readonly DRAW_BUFFER5_WEBGL: 0x882a = 0x882a;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER6_WEBGL: 0x882b = 0x882b;
  public static readonly DRAW_BUFFER6_WEBGL: 0x882b = 0x882b;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER7_WEBGL: 0x882c = 0x882c;
  public static readonly DRAW_BUFFER7_WEBGL: 0x882c = 0x882c;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER8_WEBGL: 0x882d = 0x882d;
  public static readonly DRAW_BUFFER8_WEBGL: 0x882d = 0x882d;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER9_WEBGL: 0x882e = 0x882e;
  public static readonly DRAW_BUFFER9_WEBGL: 0x882e = 0x882e;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER10_WEBGL: 0x882f = 0x882f;
  public static readonly DRAW_BUFFER10_WEBGL: 0x882f = 0x882f;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER11_WEBGL: 0x8830 = 0x8830;
  public static readonly DRAW_BUFFER11_WEBGL: 0x8830 = 0x8830;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER12_WEBGL: 0x8831 = 0x8831;
  public static readonly DRAW_BUFFER12_WEBGL: 0x8831 = 0x8831;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER13_WEBGL: 0x8832 = 0x8832;
  public static readonly DRAW_BUFFER13_WEBGL: 0x8832 = 0x8832;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER14_WEBGL: 0x8833 = 0x8833;
  public static readonly DRAW_BUFFER14_WEBGL: 0x8833 = 0x8833;

  /**
   * Draw buffer
   * @constant {number}
   */
  public readonly DRAW_BUFFER15_WEBGL: 0x8834 = 0x8834;
  public static readonly DRAW_BUFFER15_WEBGL: 0x8834 = 0x8834;

  /**
   * Maximum number of framebuffer color attachment points
   * @constant {number}
   */
  public readonly MAX_COLOR_ATTACHMENTS_WEBGL: 0x8cdf = 0x8cdf;
  public static readonly MAX_COLOR_ATTACHMENTS_WEBGL: 0x8cdf = 0x8cdf;

  /**
   * Maximum number of draw buffers
   * @constant {number}
   */
  public readonly MAX_DRAW_BUFFERS_WEBGL: 0x8824 = 0x8824;
  public static readonly MAX_DRAW_BUFFERS_WEBGL: 0x8824 = 0x8824;

  // OES_vertex_array_object
  // The OES_vertex_array_object extension is part of the WebGL API and provides vertex array objects (VAOs) which encapsulate vertex array states. These objects keep pointers to vertex data and provide names for different sets of vertex data
  /**
   * The bound vertex array object (VAO)
   * @constant {number}
   */
  public readonly VERTEX_ARRAY_BINDING_OES: 0x85b5 = 0x85b5;
  public static readonly VERTEX_ARRAY_BINDING_OES: 0x85b5 = 0x85b5;

  // EXT_disjoint_timer_query
  // The EXT_disjoint_timer_query extension is part of the WebGL API and provides a way to measure the duration of a set of GL commands, without stalling the rendering pipeline
  /**
   * The number of bits used to hold the query result for the given target
   * @constant {number}
   */
  public readonly QUERY_COUNTER_BITS_EXT: 0x8864 = 0x8864;
  public static readonly QUERY_COUNTER_BITS_EXT: 0x8864 = 0x8864;

  /**
   * The currently active query
   * @constant {number}
   */
  public readonly CURRENT_QUERY_EXT: 0x8865 = 0x8865;
  public static readonly CURRENT_QUERY_EXT: 0x8865 = 0x8865;

  /**
   * The query result
   * @constant {number}
   */
  public readonly QUERY_RESULT_EXT: 0x8866 = 0x8866;
  public static readonly QUERY_RESULT_EXT: 0x8866 = 0x8866;

  /**
   * A Boolean indicating whether or not a query result is available
   * @constant {number}
   */
  public readonly QUERY_RESULT_AVAILABLE_EXT: 0x8867 = 0x8867;
  public static readonly QUERY_RESULT_AVAILABLE_EXT: 0x8867 = 0x8867;

  /**
   * Elapsed time (in nanoseconds)
   * @constant {number}
   */
  public readonly TIME_ELAPSED_EXT: 0x88bf = 0x88bf;
  public static readonly TIME_ELAPSED_EXT: 0x88bf = 0x88bf;

  /**
   * The current time
   * @constant {number}
   */
  public readonly TIMESTAMP_EXT: 0x8e28 = 0x8e28;
  public static readonly TIMESTAMP_EXT: 0x8e28 = 0x8e28;

  /**
   * A Boolean indicating whether or not the GPU performed any disjoint operation
   * @constant {number}
   */
  public readonly GPU_DISJOINT_EXT: 0x8fbb = 0x8fbb;
  public static readonly GPU_DISJOINT_EXT: 0x8fbb = 0x8fbb;

  // Constants defined in WebGL draft extensions

  // KHR_parallel_shader_compile
  // The KHR_parallel_shader_compile extension is part of the WebGL draft API and provides multithreaded asynchronous shader compilation
  /**
   * Query to determine if the compilation process is complete
   * @constant {number}
   */
  public readonly COMPLETION_STATUS_KHR: 0x91b1 = 0x91b1;
  public static readonly COMPLETION_STATUS_KHR: 0x91b1 = 0x91b1;

  // EXT_texture_norm16
  public readonly R16_EXT: 0x822a = 0x822a;
  public static readonly R16_EXT: 0x822a = 0x822a;
  public readonly RG16_EXT: 0x822c = 0x822c;
  public static readonly RG16_EXT: 0x822c = 0x822c;
  public readonly RGBA16_EXT: 0x805b = 0x805b;
  public static readonly RGBA16_EXT: 0x805b = 0x805b;

  public readonly RGB16_EXT: 0x8054 = 0x8054;
  public static readonly RGB16_EXT: 0x8054 = 0x8054;

  public readonly R16_SNORM_EXT: 0x8f98 = 0x8f98;
  public static readonly R16_SNORM_EXT: 0x8f98 = 0x8f98;
  public readonly RG16_SNORM_EXT: 0x8f99 = 0x8f99;
  public static readonly RG16_SNORM_EXT: 0x8f99 = 0x8f99;
  public readonly RG16_SNORM__EXT: 0x8f99 = this.RG16_SNORM_EXT;
  public static readonly RG16_SNORM__EXT: 0x8f99 = this.RG16_SNORM_EXT;

  public readonly RGB16_SNORM_EXT: 0x8f9a = 0x8f9a;
  public static readonly RGB16_SNORM_EXT: 0x8f9a = 0x8f9a;
  public readonly RGB16_SNORM__EXT: 0x8f9a = this.RGB16_SNORM_EXT;
  public static readonly RGB16_SNORM__EXT: 0x8f9a = this.RGB16_SNORM_EXT;

  public readonly RGBA16_SNORM_EXT: 0x8f9b = 0x8f9b;
  public static readonly RGBA16_SNORM_EXT: 0x8f9b = 0x8f9b;
  public readonly RGBA16_SNORM__EXT: 0x8f9b = this.RGBA16_SNORM_EXT;
  public static readonly RGBA16_SNORM__EXT: 0x8f9b = this.RGBA16_SNORM_EXT;

  // EXT_texture_compression_rgtc
  public readonly COMPRESSED_RED_RGTC1_EXT: 0x8dbb = 0x8dbb;
  public static readonly COMPRESSED_RED_RGTC1_EXT: 0x8dbb = 0x8dbb;
  public readonly COMPRESSED_SIGNED_RED_RGTC1_EXT: 0x8dbc = 0x8dbc;
  public static readonly COMPRESSED_SIGNED_RED_RGTC1_EXT: 0x8dbc = 0x8dbc;
  public readonly COMPRESSED_RED_GREEN_RGTC2_EXT: 0x8dbd = 0x8dbd;
  public static readonly COMPRESSED_RED_GREEN_RGTC2_EXT: 0x8dbd = 0x8dbd;
  public readonly COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT: 0x8dbe = 0x8dbe;
  public static readonly COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT: 0x8dbe = 0x8dbe;

  // EXT_texture_compression_bptc
  public readonly COMPRESSED_RGBA_BPTC_UNORM_EXT: 0x8e8c = 0x8e8c;
  public static readonly COMPRESSED_RGBA_BPTC_UNORM_EXT: 0x8e8c = 0x8e8c;
  public readonly COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT: 0x8e8d = 0x8e8d;
  public static readonly COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT: 0x8e8d = 0x8e8d;
  public readonly COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT: 0x8e8e = 0x8e8e;
  public static readonly COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT: 0x8e8e = 0x8e8e;
  public readonly COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT: 0x8e8f = 0x8e8f;
  public static readonly COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT: 0x8e8f = 0x8e8f;

  // OVR_multiview2
  public readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_NUM_VIEWS_OVR: 0x9630 = 0x9630;
  public static readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_NUM_VIEWS_OVR: 0x9630 = 0x9630;
  public readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_BASE_VIEW_INDEX_OVR: 0x9632 = 0x9632;
  public static readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_BASE_VIEW_INDEX_OVR: 0x9632 = 0x9632;
  public readonly MAX_VIEWS_OVR: 0x9631 = 0x9631;
  public static readonly MAX_VIEWS_OVR: 0x9631 = 0x9631;
  public readonly FRAMEBUFFER_INCOMPLETE_VIEW_TARGETS_OVR: 0x9633 = 0x9633;
  public static readonly FRAMEBUFFER_INCOMPLETE_VIEW_TARGETS_OVR: 0x9633 = 0x9633;
}
