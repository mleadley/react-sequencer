const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

export const playAudioBuffer = (audioBuffer) => {
  const audioBufferSource = audioCtx.createBufferSource()
  audioBufferSource.buffer = audioBuffer
  audioBufferSource.connect(audioCtx.destination)
  audioBufferSource.start()
}

export const fetchSample = (sample, callback) => {
  fetch(sample).then(
    response => response.arrayBuffer()
  ).then(
    buffer => audioCtx.decodeAudioData(buffer)
  ).then(
    audioBuffer => callback(audioBuffer)
  )
}