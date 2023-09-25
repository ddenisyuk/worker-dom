import anyTest, {TestInterface} from "ava";
import {parseGLSL} from "../../../worker-thread/canvas/gl/glsl";

const test = anyTest as TestInterface<{}>;

test('parse define glsl', (t) => {
    const parsedDefine = parseGLSL('#define a');
    const defines = parsedDefine.defines["a"];
    t.is(defines, true);
});

test('parse attribute glsl', (t) => {
    const parsedAttribute = parseGLSL('attribute bvec4 a;');
    const attributes = parsedAttribute.attributes["a"];
    t.deepEqual(attributes, {
        "quality": "lowp",
        "type": "bvec4",
        "index": 0
    });
});

test('parse attribute with mediump glsl', (t) => {
    const parsedAttribute = parseGLSL('attribute mediump bvec4 a;');
    const attributes = parsedAttribute.attributes["a"];
    t.deepEqual(attributes, {
        "quality": "mediump",
        "type": "bvec4",
        "index": 0
    });
});

test('parse uniform glsl', (t) => {
    const parsedUniforms = parseGLSL('uniform bvec4 a;');
    const uniforms = parsedUniforms.uniforms["a"];
    t.deepEqual(uniforms, {
        "quality": "lowp",
        "type": "bvec4",
        "index": 0
    });
});

test('parse uniform with mediump glsl', (t) => {
    const parsedUniforms = parseGLSL('uniform mediump bvec4 a;');
    const uniforms = parsedUniforms.uniforms["a"];
    t.deepEqual(uniforms, {
        "quality": "mediump",
        "type": "bvec4",
        "index": 0
    });
});