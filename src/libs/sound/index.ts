import type Stream from '@/libs/stream'

export default function (stream: ReturnType<typeof Stream>) {
  const audioContext = new AudioContext()
  const frequency = 600 // CW音频的频率（赫兹）

  const gainNode = audioContext.createGain()
  gainNode.connect(audioContext.destination)

  gainNode.gain.setValueAtTime(1, audioContext.currentTime)

  function playTone(duration: number) {
    const oscillator = audioContext.createOscillator()
    oscillator.connect(gainNode)
    oscillator.frequency.value = frequency
    oscillator.type = 'sine'
    const startTime = audioContext.currentTime
    oscillator.start(startTime)
    oscillator.stop(startTime + duration)
  }

  function mute(enable: boolean) {
    if (enable)
      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    else
      gainNode.gain.setValueAtTime(1, audioContext.currentTime)
  }

  stream.on('fire', (data: number) => {
    const duration = data - Date.now()
    if (duration > 0)
      playTone(duration / 1000)
  })

  return {
    playTone,
    mute,
  }
}
