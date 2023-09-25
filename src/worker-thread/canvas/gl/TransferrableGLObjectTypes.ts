import { TransferrableObject } from '../../worker-thread';
import { TransferrableKeys } from '../../../transfer/TransferrableKeys';
import { TransferrableObjectType } from '../../../transfer/TransferrableMutation';
import { GLConstants } from './GLConstants';

export abstract class TransferrableGLObject implements TransferrableObject {
  public id: number;
  private readonly _serializedAsTransferrableObject: number[];

  constructor(id: number) {
    this.id = id;
    this._serializedAsTransferrableObject = [TransferrableObjectType.TransferObject, this.id];
  }

  public isDeleted() {
    return this.id == -1;
  }

  public delete() {
    this.id = -1;
  }

  public [TransferrableKeys.serializeAsTransferrableObject](): number[] {
    return this._serializedAsTransferrableObject;
  }
}

export class vGLQuery extends TransferrableGLObject implements WebGLQuery {
  public constructor(id: number) {
    super(id);
  }
}

export class vGLSampler extends TransferrableGLObject implements WebGLSampler {
  public constructor(id: number) {
    super(id);
  }
}

export class vGLTransformFeedback extends TransferrableGLObject implements WebGLTransformFeedback {
  public constructor(id: number) {
    super(id);
  }
}

export class vGLSync extends TransferrableGLObject implements WebGLSync {
  public constructor(id: number) {
    super(id);
  }
}

export class vGLLocation extends TransferrableGLObject implements WebGLUniformLocation {
  public name: string;

  public constructor(id: number, name: string) {
    super(id);
    this.name = name;
  }
}

export class vGLActiveInfo implements WebGLActiveInfo {
  public readonly name: string;
  public readonly size: number;
  public readonly type: number;
  public location: number;
  public uniformLocations: vGLLocation;

  public constructor(name: string, size: number, type: number, location: number) {
    this.name = name;
    this.size = size;
    this.type = type;
    this.location = location;
  }
}

export class vGLVertexArrayObject extends TransferrableGLObject implements WebGLVertexArrayObject {
  public constructor(id: number) {
    super(id);
  }
}

export class vGLTexture extends TransferrableGLObject implements WebGLTexture {
  public boundTarget: GLenum | null = null;
  public readonly parameters: {
    [key: number]: {
      value: number | boolean | null;
      readonly: boolean;
      allowed: Array<number | boolean>;
    };
  } = {
    [GLConstants.TEXTURE_MAG_FILTER]: { value: GLConstants.LINEAR, readonly: false, allowed: [GLConstants.LINEAR, GLConstants.NEAREST] },
    [GLConstants.TEXTURE_MIN_FILTER]: {
      value: GLConstants.NEAREST_MIPMAP_LINEAR,
      readonly: false,
      allowed: [
        GLConstants.LINEAR,
        GLConstants.NEAREST,
        GLConstants.NEAREST_MIPMAP_NEAREST,
        GLConstants.LINEAR_MIPMAP_NEAREST,
        GLConstants.NEAREST_MIPMAP_LINEAR,
        GLConstants.LINEAR_MIPMAP_LINEAR,
      ],
    },
    [GLConstants.TEXTURE_WRAP_S]: {
      value: GLConstants.REPEAT,
      readonly: false,
      allowed: [GLConstants.REPEAT, GLConstants.CLAMP_TO_EDGE, GLConstants.MIRRORED_REPEAT],
    },
    [GLConstants.TEXTURE_WRAP_T]: {
      value: GLConstants.REPEAT,
      readonly: false,
      allowed: [GLConstants.REPEAT, GLConstants.CLAMP_TO_EDGE, GLConstants.MIRRORED_REPEAT],
    },
    [GLConstants.TEXTURE_MAX_ANISOTROPY_EXT]: {
      value: 1, // 1 if extension enabled, EXT_texture_filter_anisotropic, null otherwise
      readonly: false,
      allowed: [],
    },
    [GLConstants.TEXTURE_BASE_LEVEL]: {
      value: 0,
      readonly: false,
      allowed: [],
    },
    [GLConstants.TEXTURE_COMPARE_FUNC]: {
      value: GLConstants.LEQUAL,
      readonly: false,
      allowed: [
        GLConstants.LEQUAL,
        GLConstants.GEQUAL,
        GLConstants.LESS,
        GLConstants.GREATER,
        GLConstants.EQUAL,
        GLConstants.NOTEQUAL,
        GLConstants.ALWAYS,
        GLConstants.NEVER,
      ],
    },
    [GLConstants.TEXTURE_COMPARE_MODE]: {
      value: GLConstants.NONE,
      readonly: false,
      allowed: [GLConstants.NONE, GLConstants.COMPARE_REF_TO_TEXTURE],
    },
    [GLConstants.TEXTURE_IMMUTABLE_FORMAT]: { value: false, readonly: true, allowed: [true, false] },
    [GLConstants.TEXTURE_IMMUTABLE_LEVELS]: { value: 0, readonly: true, allowed: [] },
    [GLConstants.TEXTURE_MAX_LEVEL]: { value: 1000, readonly: false, allowed: [] },
    [GLConstants.TEXTURE_MAX_LOD]: { value: 1000, readonly: false, allowed: [] },
    [GLConstants.TEXTURE_MIN_LOD]: { value: -1000, readonly: false, allowed: [] },
    [GLConstants.TEXTURE_WRAP_R]: {
      value: GLConstants.REPEAT,
      readonly: false,
      allowed: [GLConstants.REPEAT, GLConstants.CLAMP_TO_EDGE, GLConstants.MIRRORED_REPEAT],
    },
  };

  public constructor(id: number) {
    super(id);
  }

  public delete() {
    super.delete();
    this.boundTarget = null;
  }
}

export class vGLBuffer extends TransferrableGLObject implements WebGLBuffer {
  public bindings: GLenum[] = [];
  public size: GLsizeiptr;
  public usage: GLenum;

  public constructor(id: number) {
    super(id);
  }

  public delete() {
    super.delete();
    this.size = 0;
    this.usage = 0;
    this.bindings = [];
  }
}

export class vGLFramebuffer extends vGLBuffer implements WebGLFramebuffer {
  public constructor(id: number) {
    super(id);
  }
}

export class vGLRenderbuffer extends vGLBuffer implements WebGLRenderbuffer {
  public constructor(id: number) {
    super(id);
  }
}
