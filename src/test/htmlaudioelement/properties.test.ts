import anyTest, {TestInterface} from "ava";
import {createTestingDocument} from "../DocumentCreation";
import {HTMLAudioElement} from "../../worker-thread/dom/HTMLAudioElement";

const test = anyTest as TestInterface<{
    element: HTMLAudioElement;
}>;

test.beforeEach((t) => {
    const document = createTestingDocument();

    t.context = {
        element: document.createElement('media') as HTMLAudioElement,
    };
});

test('currentTime property', (t) => {
    const { element } = t.context;

    const milliSeconds = Date.now();
    element.currentTime = milliSeconds;
    t.is(element.currentTime, milliSeconds);
});

test('loop property', (t) => {
    const { element } = t.context;

    element.loop = false;
    t.is(element.loop, false);

    element.loop = true;
    t.is(element.loop, true);
});

test('pause property', (t) => {
    const { element } = t.context;

    element.pause();
    t.is(element.paused, true);
});

test('playbackRate property', (t) => {
    const { element } = t.context;

    element.playbackRate = 100;
    t.is(element.playbackRate, 100);
});

test('muted property', (t) => {
    const { element } = t.context;

    element.muted = true;
    t.is(element.muted, true);

    element.muted = false;
    t.is(element.muted, false);
});

test('volume property', (t) => {
    const { element } = t.context;

    element.volume = 1;
    t.is(element.volume, 1);

    element.volume = 0;
    t.is(element.volume, 0);
});