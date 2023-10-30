export interface WebGLOptions {
  extensions: string[] | null;
  parameters: { [key: number]: any } | null;
  shaderPrecisionFormat: { [key: number]: { [key: number]: WebGLShaderPrecisionFormat | null } };
}
