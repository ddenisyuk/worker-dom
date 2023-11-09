import anyTest, {TestInterface} from "ava";
import {WEBGLDrawBuffers} from "../../../worker-thread/canvas/gl/GLExtension";
import {WebGLRenderingContextPolyfill} from "../../../worker-thread/canvas/WebGLRenderingContextPolyfill";
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

test('should create an instance of TransferrableGLExtension with id and context', (t) => {
    const id = 1;
    const { element } = t.context;
    const context = new WebGLRenderingContextPolyfill('webgl2', id, element, undefined);
    const extension = new WEBGLDrawBuffers(id, context);
    t.deepEqual(extension.id, id);
    // @ts-ignore
    t.deepEqual(extension.context, context);
});