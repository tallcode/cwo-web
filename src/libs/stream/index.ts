// eslint-disable-next-line unicorn/prefer-node-protocol
import { EventEmitter } from 'events'

export default function () {
  const ee = new EventEmitter()
  const stream: Record<number, number[]> = {}
  let lastTime: number = 0
  const frame = (time: number) => {
    if (time - lastTime < 20) {
      requestAnimationFrame(frame)
      return
    }
    lastTime = time
    const enable: number[] = []
    Object.keys(stream).forEach((channel) => {
      const _channel = Number.parseInt(channel)
      const _stream = stream[_channel]
      if (_stream && _stream.length) {
        if (_stream[0] === 1) {
          enable.push(_channel)
        }
        _stream.shift()
      }
    })
    ee.emit('fire', enable)
    requestAnimationFrame(frame)
  }

  requestAnimationFrame(frame)

  return {
    on: ee.on.bind(ee),
    off: ee.off.bind(ee),
    add: (channel: number, data: number[]) => {
      if (!stream[channel]) {
        stream[channel] = []
      }
      const _stream = stream[channel]
      const rest = _stream.slice(-2)
      const test = [...rest, ...data]
      if (test.length > 2) {
        for (let i = 2; i < test.length; i++) {
          if (test[i - 2] === 1 && test[i - 1] === 0 && test[i] === 1) {
            test[i - 1] = 1
          }
          if (test[i - 2] === 0 && test[i - 1] === 1 && test[i] === 0) {
            test[i - 1] = 0
          }
        }
      }
      _stream.push(...test.slice(rest.length))
    },
  }
}
