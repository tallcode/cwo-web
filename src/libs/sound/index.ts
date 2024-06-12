export default function () {
  const audioContext = new AudioContext()
  const frequency = 800 // CW音频的频率（赫兹）

  const gainNode = audioContext.createGain()
  gainNode.connect(audioContext.destination)

  gainNode.gain.setValueAtTime(1, audioContext.currentTime)

  let oscillator: OscillatorNode | null = null

  function playTone() {
    if (oscillator) {
      return
    }
    oscillator = audioContext.createOscillator()
    oscillator.connect(gainNode)
    oscillator.frequency.value = frequency
    oscillator.type = 'square'
    const startTime = audioContext.currentTime
    oscillator.start(startTime)
  }

  function stopTone() {
    if (oscillator) {
      oscillator.stop()
      oscillator = null
    }
  }

  function mute(enable: boolean) {
    if (enable)
      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    else
      gainNode.gain.setValueAtTime(1, audioContext.currentTime)
  }

  return {
    playTone,
    stopTone,
    mute,
  }
}
