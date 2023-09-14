import anyTest, {TestInterface} from "ava";
import {WebGLRenderingContextPolyfill} from "../../../worker-thread/canvas/WebGLRenderingContextPolyfill";
import {WEBGLDrawBuffers} from "../../../worker-thread/canvas/gl/GLExtension";
import {HTMLCanvasElement} from "../../../worker-thread/dom/HTMLCanvasElement";
import {createTestingDocument} from "../../DocumentCreation";
import {CanvasRenderingContext2D} from "../../../worker-thread/canvas/CanvasTypes";

const test = anyTest as TestInterface<{
    element: HTMLCanvasElement;
}>;

test.beforeEach((t) => {
    const document = createTestingDocument({
        OffscreenCanvas: FakeOffscreenCanvas,
    });

    t.context = {
        element: document.createElement('canvas') as HTMLCanvasElement,
    };

    HTMLCanvasElement.webGLInfo = {
        webgl: {},
        webgl2: {},
    } as any;
});

class FakeOffscreenCanvas {
    getContext(c: string): CanvasRenderingContext2D {
        return {} as unknown as CanvasRenderingContext2D;
    }
}

test('should access all properties of WEBGLDrawBuffers', (t) => {
    const { element } = t.context;
    const context = new WebGLRenderingContextPolyfill(1, element, undefined);
    const extension = new WEBGLDrawBuffers(1, context);
    t.deepEqual(extension.COLOR_ATTACHMENT0_WEBGL, context.COLOR_ATTACHMENT0_WEBGL);
    t.deepEqual(extension.COLOR_ATTACHMENT1_WEBGL, context.COLOR_ATTACHMENT1_WEBGL);
    t.deepEqual(extension.COLOR_ATTACHMENT2_WEBGL, context.COLOR_ATTACHMENT2_WEBGL);
    t.deepEqual(extension.COLOR_ATTACHMENT3_WEBGL, context.COLOR_ATTACHMENT3_WEBGL);
    t.deepEqual(extension.COLOR_ATTACHMENT4_WEBGL, context.COLOR_ATTACHMENT4_WEBGL);
    t.deepEqual(extension.COLOR_ATTACHMENT5_WEBGL, context.COLOR_ATTACHMENT5_WEBGL);
    t.deepEqual(extension.COLOR_ATTACHMENT6_WEBGL, context.COLOR_ATTACHMENT6_WEBGL);
    t.deepEqual(extension.COLOR_ATTACHMENT7_WEBGL, context.COLOR_ATTACHMENT7_WEBGL);
    t.deepEqual(extension.COLOR_ATTACHMENT8_WEBGL, context.COLOR_ATTACHMENT8_WEBGL);
    t.deepEqual(extension.COLOR_ATTACHMENT9_WEBGL, context.COLOR_ATTACHMENT9_WEBGL);
    t.deepEqual(extension.COLOR_ATTACHMENT10_WEBGL, context.COLOR_ATTACHMENT10_WEBGL);
    t.deepEqual(extension.COLOR_ATTACHMENT11_WEBGL, context.COLOR_ATTACHMENT11_WEBGL);
    t.deepEqual(extension.COLOR_ATTACHMENT12_WEBGL, context.COLOR_ATTACHMENT12_WEBGL);
    t.deepEqual(extension.COLOR_ATTACHMENT13_WEBGL, context.COLOR_ATTACHMENT13_WEBGL);
    t.deepEqual(extension.COLOR_ATTACHMENT14_WEBGL, context.COLOR_ATTACHMENT14_WEBGL);
    t.deepEqual(extension.COLOR_ATTACHMENT15_WEBGL, context.COLOR_ATTACHMENT15_WEBGL);
    t.deepEqual(extension.DRAW_BUFFER0_WEBGL, context.DRAW_BUFFER0_WEBGL);
    t.deepEqual(extension.DRAW_BUFFER1_WEBGL, context.DRAW_BUFFER1_WEBGL);
    t.deepEqual(extension.DRAW_BUFFER2_WEBGL, context.DRAW_BUFFER2_WEBGL);
    t.deepEqual(extension.DRAW_BUFFER3_WEBGL, context.DRAW_BUFFER3_WEBGL);
    t.deepEqual(extension.DRAW_BUFFER4_WEBGL, context.DRAW_BUFFER4_WEBGL);
    t.deepEqual(extension.DRAW_BUFFER5_WEBGL, context.DRAW_BUFFER5_WEBGL);
    t.deepEqual(extension.DRAW_BUFFER6_WEBGL, context.DRAW_BUFFER6_WEBGL);
    t.deepEqual(extension.DRAW_BUFFER7_WEBGL, context.DRAW_BUFFER7_WEBGL);
    t.deepEqual(extension.DRAW_BUFFER8_WEBGL, context.DRAW_BUFFER8_WEBGL);
    t.deepEqual(extension.DRAW_BUFFER9_WEBGL, context.DRAW_BUFFER9_WEBGL);
    t.deepEqual(extension.DRAW_BUFFER10_WEBGL, context.DRAW_BUFFER10_WEBGL);
    t.deepEqual(extension.DRAW_BUFFER11_WEBGL, context.DRAW_BUFFER11_WEBGL);
    t.deepEqual(extension.DRAW_BUFFER12_WEBGL, context.DRAW_BUFFER12_WEBGL);
    t.deepEqual(extension.DRAW_BUFFER13_WEBGL, context.DRAW_BUFFER13_WEBGL);
    t.deepEqual(extension.DRAW_BUFFER14_WEBGL, context.DRAW_BUFFER14_WEBGL);
    t.deepEqual(extension.DRAW_BUFFER15_WEBGL, context.DRAW_BUFFER15_WEBGL);
    t.deepEqual(extension.MAX_COLOR_ATTACHMENTS_WEBGL, context.MAX_COLOR_ATTACHMENTS_WEBGL);
    t.deepEqual(extension.MAX_DRAW_BUFFERS_WEBGL, context.MAX_DRAW_BUFFERS_WEBGL);
});