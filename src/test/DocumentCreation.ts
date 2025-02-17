import { HTMLElement } from '../worker-thread/dom/HTMLElement';
import { SVGElement } from '../worker-thread/dom/SVGElement';
import { HTMLAnchorElement } from '../worker-thread/dom/HTMLAnchorElement';
import { HTMLButtonElement } from '../worker-thread/dom/HTMLButtonElement';
import { HTMLDataElement } from '../worker-thread/dom/HTMLDataElement';
import { HTMLEmbedElement } from '../worker-thread/dom/HTMLEmbedElement';
import { HTMLFieldSetElement } from '../worker-thread/dom/HTMLFieldSetElement';
import { HTMLFormElement } from '../worker-thread/dom/HTMLFormElement';
import { HTMLIFrameElement } from '../worker-thread/dom/HTMLIFrameElement';
import { HTMLImageElement } from '../worker-thread/dom/HTMLImageElement';
import { HTMLInputElement } from '../worker-thread/dom/HTMLInputElement';
import { HTMLLabelElement } from '../worker-thread/dom/HTMLLabelElement';
import { HTMLLinkElement } from '../worker-thread/dom/HTMLLinkElement';
import { HTMLMapElement } from '../worker-thread/dom/HTMLMapElement';
import { HTMLMeterElement } from '../worker-thread/dom/HTMLMeterElement';
import { HTMLModElement } from '../worker-thread/dom/HTMLModElement';
import { HTMLOListElement } from '../worker-thread/dom/HTMLOListElement';
import { HTMLOptionElement } from '../worker-thread/dom/HTMLOptionElement';
import { HTMLProgressElement } from '../worker-thread/dom/HTMLProgressElement';
import { HTMLQuoteElement } from '../worker-thread/dom/HTMLQuoteElement';
import { HTMLScriptElement } from '../worker-thread/dom/HTMLScriptElement';
import { HTMLSelectElement } from '../worker-thread/dom/HTMLSelectElement';
import { HTMLSourceElement } from '../worker-thread/dom/HTMLSourceElement';
import { HTMLStyleElement } from '../worker-thread/dom/HTMLStyleElement';
import { HTMLTableCellElement } from '../worker-thread/dom/HTMLTableCellElement';
import { HTMLTableColElement } from '../worker-thread/dom/HTMLTableColElement';
import { HTMLTableElement } from '../worker-thread/dom/HTMLTableElement';
import { HTMLTableRowElement } from '../worker-thread/dom/HTMLTableRowElement';
import { HTMLTableSectionElement } from '../worker-thread/dom/HTMLTableSectionElement';
import { HTMLTimeElement } from '../worker-thread/dom/HTMLTimeElement';
import { Document } from '../worker-thread/dom/Document';
import { MutationObserver } from '../worker-thread/MutationObserver';
import { GlobalScope } from '../worker-thread/WorkerDOMGlobalScope';
import { HTMLCanvasElement } from '../worker-thread/dom/HTMLCanvasElement';
import { CanvasRenderingContext2D } from '../worker-thread/canvas/CanvasTypes';
import { Event as WorkerDOMEvent, FocusEvent, InputEvent, KeyboardEvent, MouseEvent, TouchEvent, WheelEvent } from '../worker-thread/Event';
import { createStorage } from '../worker-thread/Storage';
import { StorageLocation } from '../transfer/TransferrableStorage';
import { CharacterData } from '../worker-thread/dom/CharacterData';
import { Comment } from '../worker-thread/dom/Comment';
import { DocumentFragment } from '../worker-thread/dom/DocumentFragment';
import { Text } from '../worker-thread/dom/Text';
import { DOMTokenList } from '../worker-thread/dom/DOMTokenList';
import { HTMLDataListElement } from '../worker-thread/dom/HTMLDataListElement';
import { Element } from '../worker-thread/dom/Element';
import { cafPolyfill, rafPolyfill } from '../worker-thread/AnimationFrame';
import { HTMLMediaElement } from '../worker-thread/dom/HTMLMediaElement';
import { HTMLAudioElement } from '../worker-thread/dom/HTMLAudioElement';
import { HTMLVideoElement } from '../worker-thread/dom/HTMLVideoElement';
import { AudioContext } from '../worker-thread/audio/AudioContext';
import { AnalyserNode } from '../worker-thread/audio/node/AnalyserNode';
import { AudioBufferSourceNode } from '../worker-thread/audio/node/AudioBufferSourceNode';
import { BiquadFilterNode } from '../worker-thread/audio/node/BiquadFilterNode';
import { ChannelMergerNode } from '../worker-thread/audio/node/ChannelMergerNode';
import { ChannelSplitterNode } from '../worker-thread/audio/node/ChannelSplitterNode';
import { ConstantSourceNode } from '../worker-thread/audio/node/ConstantSourceNode';
import { ConvolverNode } from '../worker-thread/audio/node/ConvolverNode';
import { DelayNode } from '../worker-thread/audio/node/DelayNode';
import { DynamicsCompressorNode } from '../worker-thread/audio/node/DynamicsCompressorNode';
import { GainNode } from '../worker-thread/audio/node/GainNode';
import { IIRFilterNode } from '../worker-thread/audio/node/IIRFilterNode';
import { OscillatorNode } from '../worker-thread/audio/node/OscillatorNode';
import { PannerNode } from '../worker-thread/audio/node/PannerNode';
import { StereoPannerNode } from '../worker-thread/audio/node/StereoPannerNode';
import { WaveShaperNode } from '../worker-thread/audio/node/WaveShaperNode';
import { AudioBuffer } from '../worker-thread/audio/AudioBuffer';
import { PeriodicWave } from '../worker-thread/audio/PeriodicWave';
import { MediaElementAudioSourceNode } from '../worker-thread/audio/node/MediaElementAudioSourceNode';

Object.defineProperty(global, 'ServiceWorkerContainer', {
  configurable: true,
  value: function () {
    return {};
  },
});

Object.defineProperty(global, 'StorageManager', {
  configurable: true,
  value: function () {
    return {};
  },
});

interface OffscreenCanvas {
  getContext(c: string): CanvasRenderingContext2D;
}

declare var OffscreenCanvas: {
  prototype: OffscreenCanvas;
  new (): OffscreenCanvas;
};

const GlobalScope: GlobalScope = {
  devicePixelRatio: 1,
  innerWidth: 0,
  innerHeight: 0,
  CharacterData,
  Comment,
  Document,
  DocumentFragment,
  DOMTokenList,
  Element,
  HTMLAnchorElement,
  HTMLButtonElement,
  HTMLCanvasElement,
  HTMLDataElement,
  HTMLDataListElement,
  HTMLElement,
  HTMLEmbedElement,
  HTMLFieldSetElement,
  HTMLFormElement,
  HTMLIFrameElement,
  HTMLImageElement,
  HTMLInputElement,
  HTMLLabelElement,
  HTMLLinkElement,
  HTMLMapElement,
  HTMLMeterElement,
  HTMLModElement,
  HTMLOListElement,
  HTMLOptionElement,
  HTMLProgressElement,
  HTMLQuoteElement,
  HTMLScriptElement,
  HTMLSelectElement,
  HTMLSourceElement,
  HTMLStyleElement,
  HTMLTableCellElement,
  HTMLTableColElement,
  HTMLTableElement,
  HTMLTableRowElement,
  HTMLTableSectionElement,
  HTMLTimeElement,
  SVGElement,
  HTMLMediaElement,
  HTMLAudioElement,
  HTMLVideoElement,
  Text,
  Event: WorkerDOMEvent,
  MouseEvent: MouseEvent,
  TouchEvent: TouchEvent,
  FocusEvent: FocusEvent,
  KeyboardEvent: KeyboardEvent,
  WheelEvent: WheelEvent,
  InputEvent: InputEvent,
  MutationObserver,
  requestAnimationFrame: rafPolyfill,
  cancelAnimationFrame: cafPolyfill,
  AudioContext,
  AnalyserNode,
  AudioBufferSourceNode,
  BiquadFilterNode,
  ChannelMergerNode,
  ChannelSplitterNode,
  ConstantSourceNode,
  ConvolverNode,
  DelayNode,
  DynamicsCompressorNode,
  GainNode,
  IIRFilterNode,
  OscillatorNode,
  PannerNode,
  StereoPannerNode,
  WaveShaperNode,
  AudioBuffer,
  PeriodicWave,
  MediaElementAudioSourceNode,
};

/**
 * Creates a Document object for testing environment.
 * @param overrides Can add a new variable to Global or override an existing one.
 */
export function createTestingDocument(overrides: {} | null = null): Document {
  const customGlobal = Object.assign({}, GlobalScope, overrides);
  const document = new Document(customGlobal);
  document.postMessage = () => {};
  document.isConnected = true;
  document.appendChild((document.body = document.createElement('body')));

  customGlobal.localStorage = createStorage(document, StorageLocation.Local, {});
  customGlobal.sessionStorage = createStorage(document, StorageLocation.Session, {});

  AudioContext.document = document;
  AudioBuffer.document = document;

  return document;
}
