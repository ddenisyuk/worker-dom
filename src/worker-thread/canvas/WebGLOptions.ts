export interface WebGLOptions {
  attributes: WebGLContextAttributes | null;
  extensions: string[] | null;
  parameters: { [key: number]: any } | null;
  shaderPrecisionFormat: { [key: number]: { [key: number]: WebGLShaderPrecisionFormat | null } };
  drawingBufferColorSpace: PredefinedColorSpace;
  unpackColorSpace: PredefinedColorSpace;
}
