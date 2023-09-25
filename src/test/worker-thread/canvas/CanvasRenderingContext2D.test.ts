import anyTest, {TestInterface} from "ava";
import {CanvasRenderingContext2DShim} from "../../../worker-thread/canvas/CanvasRenderingContext2D";
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

test('should initialize properties and set implementation when OffscreenCanvas is available', (t) => {
    // Arrange
    const { element } = t.context;

    // Act
    const context = new CanvasRenderingContext2DShim(element);

    // Assert
    // @ts-ignore
    t.deepEqual(context.canvasElement, element);
    // @ts-ignore
    t.deepEqual(context.upgraded, false);
    // @ts-ignore
    t.deepEqual(context.polyfillUsed, false);
    // @ts-ignore
    t.deepEqual(context.unresolvedCalls, 1);
});

test('should delegate property assignments to implementation', (t) => {
    // Arrange
    const { element } = t.context;
    const context = new CanvasRenderingContext2DShim(element);

    // Act
    context.lineWidth = 2;
    context.fillStyle = 'red';

    // Assert
    t.deepEqual(context.lineWidth, 2);
    t.deepEqual(context.fillStyle, 'red');
});