// eslint-disable-next-line unicorn/prefer-node-protocol
import { EventEmitter } from 'events'

export default function () {
  const ee = new EventEmitter()
  const stream: number[] = []
  let lastTime: number = 0
  const frame = (time: number) => {
    if (time - lastTime < 20) {
      requestAnimationFrame(frame)
      return
    }
    lastTime = time
    if (stream.length === 0) {
      ee.emit('fire', 0)
    }
    else {
      ee.emit('fire', stream[0])
      stream.shift()
    }
    requestAnimationFrame(frame)
  }

  requestAnimationFrame(frame)

  return {
    on: ee.on.bind(ee),
    off: ee.off.bind(ee),
    add: (data: number[]) => {
      const rest = stream.slice(-2)
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
      stream.push(...test.slice(rest.length))
    },
  }
}
