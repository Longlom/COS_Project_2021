const BYTES_PER_UNIT = Uint16Array.BYTES_PER_ELEMENT;

const BYTES_PER_SAMPLE = Float32Array.BYTES_PER_ELEMENT;

const MAX_CHANNEL_COUNT = 32;

const RENDER_QUANTUM_FRAMES = 128;
class HeapAudioBuffer {
  constructor(wasmModule, length, channelCount, maxChannelCount) {
    this._isInitialized = false;
    this._module = wasmModule;
    this._length = length;
    this._maxChannelCount = maxChannelCount
      ? Math.min(maxChannelCount, MAX_CHANNEL_COUNT)
      : channelCount;
    this._channelCount = channelCount;
    this._allocateHeap();
    this._isInitialized = true;
  }

  _allocateHeap() {
    const channelByteSize = this._length * BYTES_PER_SAMPLE;
    const dataByteSize = this._channelCount * channelByteSize;
    this._dataPtr = this._module._malloc(dataByteSize);
    this._channelData = [];
    for (let i = 0; i < this._channelCount; ++i) {
      let startByteOffset = this._dataPtr + i * channelByteSize;
      let endByteOffset = startByteOffset + channelByteSize;
      this._channelData[i] = this._module.HEAPF32.subarray(
        startByteOffset >> BYTES_PER_UNIT,
        endByteOffset >> BYTES_PER_UNIT
      );
    }
  }

  adaptChannel(newChannelCount) {
    if (newChannelCount < this._maxChannelCount) {
      this._channelCount = newChannelCount;
    }
  }

  get length() {
    return this._isInitialized ? this._length : null;
  }

  get numberOfChannels() {
    return this._isInitialized ? this._channelCount : null;
  }

  get maxChannelCount() {
    return this._isInitialized ? this._maxChannelCount : null;
  }

  getChannelData(channelIndex) {
    if (channelIndex >= this._channelCount) {
      return null;
    }

    return typeof channelIndex === "undefined"
      ? this._channelData
      : this._channelData[channelIndex];
  }

  getHeapAddress() {
    return this._dataPtr;
  }

  free() {
    this._isInitialized = false;
    this._module._free(this._dataPtr);
    this._module._free(this._pointerArrayPtr);
    this._channelData = null;
  }
}
class RingBuffer {
  constructor(length, channelCount) {
    this._readIndex = 0;
    this._writeIndex = 0;
    this._framesAvailable = 0;

    this._channelCount = channelCount;
    this._length = length;
    this._channelData = [];
    for (let i = 0; i < this._channelCount; ++i) {
      this._channelData[i] = new Float32Array(length);
    }
  }

  get framesAvailable() {
    return this._framesAvailable;
  }

  push(arraySequence) {
    if (arraySequence.length === 0 || arraySequence === undefined) return;
    let sourceLength = arraySequence[0].length;
    for (let i = 0; i < sourceLength; ++i) {
      let writeIndex = (this._writeIndex + i) % this._length;
      for (let channel = 0; channel < arraySequence.length; ++channel) {
        this._channelData[channel][writeIndex] = arraySequence[channel][i];
      }
    }

    this._writeIndex += sourceLength;
    if (this._writeIndex >= this._length) {
      this._writeIndex = 0;
    }

    this._framesAvailable += sourceLength;
    if (this._framesAvailable > this._length) {
      this._framesAvailable = this._length;
    }
  }

  pull(arraySequence) {
    if (this._framesAvailable === 0) {
      return;
    }

    let destinationLength = arraySequence[0].length;
    for (let i = 0; i < destinationLength; ++i) {
      let readIndex = (this._readIndex + i) % this._length;
      for (let channel = 0; channel < arraySequence.length; ++channel) {
        arraySequence[channel][i] = this._channelData[channel][readIndex];
      }
    }

    this._readIndex += destinationLength;
    if (this._readIndex >= this._length) {
      this._readIndex = 0;
    }

    this._framesAvailable -= destinationLength;
    if (this._framesAvailable < 0) {
      this._framesAvailable = 0;
    }
  }
}

export {
  MAX_CHANNEL_COUNT,
  RENDER_QUANTUM_FRAMES,
  HeapAudioBuffer,
  RingBuffer,
};
