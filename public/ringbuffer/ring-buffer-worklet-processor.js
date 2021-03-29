import Module from "./variable-buffer-kernel.wasmmodule.js";
import { HeapAudioBuffer, RingBuffer } from "../lib/wasm-audio-helper.js";

class RingBufferWorkletProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this._kernelBufferSize = options.processorOptions.kernelBufferSize;
    this._channelCount = options.processorOptions.channelCount;
    this._inputRingBuffer = new RingBuffer(
      this._kernelBufferSize,
      this._channelCount
    );
    this._outputRingBuffer = new RingBuffer(
      this._kernelBufferSize,
      this._channelCount
    );
    this._heapInputBuffer = new HeapAudioBuffer(
      Module,
      this._kernelBufferSize,
      this._channelCount
    );
    this._heapOutputBuffer = new HeapAudioBuffer(
      Module,
      this._kernelBufferSize,
      this._channelCount
    );
    this._kernel = new Module.VariableBufferKernel(this._kernelBufferSize);
  }

  process(inputs, outputs, parameters) {
    let input = inputs[0];
    let output = outputs[0];
    if (input.length * output.length === 0) return false;
    this._inputRingBuffer.push(input);

    if (this._inputRingBuffer.framesAvailable >= this._kernelBufferSize) {
      this._inputRingBuffer.pull(this._heapInputBuffer.getChannelData());
      this._kernel.process(
        this._heapInputBuffer.getHeapAddress(),
        this._heapOutputBuffer.getHeapAddress(),
        this._channelCount
      );
      this._outputRingBuffer.push(this._heapOutputBuffer.getChannelData());
    }
    this._outputRingBuffer.pull(output);

    return true;
  }
}

registerProcessor("ring-buffer-worklet-processor", RingBufferWorkletProcessor);
