// eslint-disable-next-line unicorn/prefer-node-protocol
import { EventEmitter } from 'events'

export default function () {
  const ee = new EventEmitter()

  const stream: { start: number, end: number }[] = []
  const frame = () => {
    const now = Date.now()
    while (stream.length && stream[0].start <= now) {
      if (stream[0].start <= now && stream[0].end >= now) {
        ee.emit('fire', stream[0].end)
      }
      stream.shift()
    }
    if (stream.length)
      requestAnimationFrame(frame)
  }

  return {
    on: ee.on.bind(ee),
    off: ee.off.bind(ee),
    add: (start: number, end: number) => {
      const isEmtpy = stream.length === 0
      stream.push({ start, end })
      stream.sort((a, b) => a.start - b.start)
      if (isEmtpy)
        requestAnimationFrame(frame)
    },
  }
}
