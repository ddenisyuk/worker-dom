import { HTMLAnchorElement } from './dom/HTMLAnchorElement';
import { HTMLButtonElement } from './dom/HTMLButtonElement';
import { HTMLCanvasElement } from './dom/HTMLCanvasElement';
import { HTMLDataElement } from './dom/HTMLDataElement';
import { HTMLEmbedElement } from './dom/HTMLEmbedElement';
import { HTMLFieldSetElement } from './dom/HTMLFieldSetElement';
import { HTMLFormElement } from './dom/HTMLFormElement';
import { HTMLIFrameElement } from './dom/HTMLIFrameElement';
import { HTMLImageElement } from './dom/HTMLImageElement';
import { HTMLInputElement } from './dom/HTMLInputElement';
import { HTMLLabelElement } from './dom/HTMLLabelElement';
import { HTMLLinkElement } from './dom/HTMLLinkElement';
import { HTMLMapElement } from './dom/HTMLMapElement';
import { HTMLMeterElement } from './dom/HTMLMeterElement';
import { HTMLModElement } from './dom/HTMLModElement';
import { HTMLOListElement } from './dom/HTMLOListElement';
import { HTMLOptionElement } from './dom/HTMLOptionElement';
import { HTMLProgressElement } from './dom/HTMLProgressElement';
import { HTMLQuoteElement } from './dom/HTMLQuoteElement';
import { HTMLScriptElement } from './dom/HTMLScriptElement';
import { HTMLSelectElement } from './dom/HTMLSelectElement';
import { HTMLSourceElement } from './dom/HTMLSourceElement';
import { HTMLStyleElement } from './dom/HTMLStyleElement';
import { HTMLTableCellElement } from './dom/HTMLTableCellElement';
import { HTMLTableColElement } from './dom/HTMLTableColElement';
import { HTMLTableElement } from './dom/HTMLTableElement';
import { HTMLTableRowElement } from './dom/HTMLTableRowElement';
import { HTMLTableSectionElement } from './dom/HTMLTableSectionElement';
import { HTMLTimeElement } from './dom/HTMLTimeElement';
import { Document } from './dom/Document';
import {
  Event as WorkerDOMEvent,
  EventHandler,
  FocusEvent,
  InputEvent,
  KeyboardEvent,
  MouseEvent,
  TouchEvent,
  WheelEvent,
} from './Event';
import { MutationObserver } from './MutationObserver';
import { Storage } from './Storage';
import { SVGElement } from './dom/SVGElement';
import { HTMLElement } from './dom/HTMLElement';
import { HTMLDataListElement } from './dom/HTMLDataListElement';
import { Text } from './dom/Text';
import { Comment } from './dom/Comment';
import { CharacterData } from './dom/CharacterData';
import { DocumentFragment } from './dom/DocumentFragment';
import { DOMTokenList } from './dom/DOMTokenList';
import { Element } from './dom/Element';
import { DocumentStub } from './dom/DocumentStub';
import { OffscreenCanvas } from './canvas/CanvasTypes';
import { HTMLMediaElement } from './dom/HTMLMediaElement';
import { HTMLAudioElement } from './dom/HTMLAudioElement';
import { HTMLVideoElement } from './dom/HTMLVideoElement';
import { Selection } from './dom/Selection';
import { AudioContext } from './audio/AudioContext';
import { AnalyserNode } from './audio/node/AnalyserNode';
import { AudioBufferSourceNode } from './audio/node/AudioBufferSourceNode';
import { BiquadFilterNode } from './audio/node/BiquadFilterNode';
import { ChannelMergerNode } from './audio/node/ChannelMergerNode';
import { ChannelSplitterNode } from './audio/node/ChannelSplitterNode';
import { ConstantSourceNode } from './audio/node/ConstantSourceNode';
import { ConvolverNode } from './audio/node/ConvolverNode';
import { DelayNode } from './audio/node/DelayNode';
import { DynamicsCompressorNode } from './audio/node/DynamicsCompressorNode';
import { GainNode } from './audio/node/GainNode';
import { IIRFilterNode } from './audio/node/IIRFilterNode';
import { MediaElementAudioSourceNode } from './audio/node/MediaElementAudioSourceNode';
import { OscillatorNode } from './audio/node/OscillatorNode';
import { PannerNode } from './audio/node/PannerNode';
import { StereoPannerNode } from './audio/node/StereoPannerNode';
import { WaveShaperNode } from './audio/node/WaveShaperNode';
import { AudioBuffer } from './audio/AudioBuffer';
import { PeriodicWave } from './audio/PeriodicWave';
import { History } from './dom/History';

/**
 * Should only contain properties that exist on Window.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window
 */
export interface GlobalScope {
  devicePixelRatio: number;
  innerWidth: number;
  innerHeight: number;
  localStorage?: Storage;
  sessionStorage?: Storage;
  CharacterData: typeof CharacterData;
  Comment: typeof Comment;
  Document: typeof Document;
  DocumentFragment: typeof DocumentFragment;
  DOMTokenList: typeof DOMTokenList;
  Element: typeof Element;
  HTMLAnchorElement: typeof HTMLAnchorElement;
  HTMLButtonElement: typeof HTMLButtonElement;
  HTMLCanvasElement: typeof HTMLCanvasElement;
  HTMLDataElement: typeof HTMLDataElement;
  HTMLDataListElement: typeof HTMLDataListElement;
  HTMLElement: typeof HTMLElement;
  HTMLEmbedElement: typeof HTMLEmbedElement;
  HTMLFieldSetElement: typeof HTMLFieldSetElement;
  HTMLFormElement: typeof HTMLFormElement;
  HTMLIFrameElement: typeof HTMLIFrameElement;
  HTMLImageElement: typeof HTMLImageElement;
  HTMLInputElement: typeof HTMLInputElement;
  HTMLLabelElement: typeof HTMLLabelElement;
  HTMLLinkElement: typeof HTMLLinkElement;
  HTMLMapElement: typeof HTMLMapElement;
  HTMLMeterElement: typeof HTMLMeterElement;
  HTMLModElement: typeof HTMLModElement;
  HTMLOListElement: typeof HTMLOListElement;
  HTMLOptionElement: typeof HTMLOptionElement;
  HTMLProgressElement: typeof HTMLProgressElement;
  HTMLQuoteElement: typeof HTMLQuoteElement;
  HTMLScriptElement: typeof HTMLScriptElement;
  HTMLSelectElement: typeof HTMLSelectElement;
  HTMLSourceElement: typeof HTMLSourceElement;
  HTMLStyleElement: typeof HTMLStyleElement;
  HTMLTableCellElement: typeof HTMLTableCellElement;
  HTMLTableColElement: typeof HTMLTableColElement;
  HTMLTableElement: typeof HTMLTableElement;
  HTMLTableRowElement: typeof HTMLTableRowElement;
  HTMLTableSectionElement: typeof HTMLTableSectionElement;
  HTMLTimeElement: typeof HTMLTimeElement;
  SVGElement: typeof SVGElement;
  HTMLMediaElement: typeof HTMLMediaElement;
  HTMLAudioElement: typeof HTMLAudioElement;
  HTMLVideoElement: typeof HTMLVideoElement;
  Text: typeof Text;
  // Event exists natively in web workers but override with our synthetic event
  // implementation to enable setting readonly properties like currentTarget.
  Event: typeof WorkerDOMEvent;
  MouseEvent: typeof MouseEvent;
  TouchEvent: typeof TouchEvent;
  FocusEvent: typeof FocusEvent;
  KeyboardEvent: typeof KeyboardEvent;
  WheelEvent: typeof WheelEvent;
  InputEvent: typeof InputEvent;
  MutationObserver: typeof MutationObserver;
  OffscreenCanvas?: OffscreenCanvas;
  ImageBitmap?: typeof ImageBitmap;
  requestAnimationFrame: typeof requestAnimationFrame;
  cancelAnimationFrame: typeof cancelAnimationFrame;
  AudioContext: typeof AudioContext;
  AnalyserNode: typeof AnalyserNode;
  AudioBufferSourceNode: typeof AudioBufferSourceNode;
  BiquadFilterNode: typeof BiquadFilterNode;
  ChannelMergerNode: typeof ChannelMergerNode;
  ChannelSplitterNode: typeof ChannelSplitterNode;
  ConstantSourceNode: typeof ConstantSourceNode;
  ConvolverNode: typeof ConvolverNode;
  DelayNode: typeof DelayNode;
  DynamicsCompressorNode: typeof DynamicsCompressorNode;
  GainNode: typeof GainNode;
  IIRFilterNode: typeof IIRFilterNode;
  OscillatorNode: typeof OscillatorNode;
  PannerNode: typeof PannerNode;
  StereoPannerNode: typeof StereoPannerNode;
  WaveShaperNode: typeof WaveShaperNode;
  AudioBuffer: typeof AudioBuffer;
  PeriodicWave: typeof PeriodicWave;
  MediaElementAudioSourceNode: typeof MediaElementAudioSourceNode;
  history?: History;
}

export interface WorkerDOMGlobalScope extends GlobalScope {
  document: Document;
  addEventListener: (type: string, handler: EventHandler) => void;
  removeEventListener: (type: string, handler: EventHandler) => void;
  focus: () => void;
  getSelection: () => Selection;
}

export interface WorkerNoDOMGlobalScope {
  document: DocumentStub;
  localStorage?: Storage;
  sessionStorage?: Storage;
}
