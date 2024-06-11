// eslint-disable-next-line unicorn/prefer-node-protocol
import type { Listener } from 'events'
import Stream from '@/libs/stream'
import Morse from '@/libs/morse'
import Sound from '@/libs/sound'

const dotDuration = 100
const dashDuration = dotDuration * 3
let stream: ReturnType<typeof Stream>
let sound: ReturnType<typeof Sound>

const key = (() => {
  let start = Date.now()
  return {
    text: (text: string) => {
      const code = Morse(text)
      start = Math.max(start + dotDuration * 2, Date.now())
      code.split('').forEach((char) => {
        if (char === '.') {
          stream?.add(start, start += dotDuration)
        }
        else if (char === '-') {
          stream?.add(start, start += dashDuration)
        }
        else if (char === '/') {
          start += dotDuration * 2
        }
        else if (char === ' ') {
          start += dotDuration
        }
        start += dotDuration
      })
    },
    dot: () => {
      start = Math.max(start, Date.now())
      stream?.add(start, start += dotDuration)
      start += dotDuration
    },
    dash: () => {
      start = Math.max(start, Date.now())
      stream?.add(start, start += dashDuration)
      start += dotDuration
    },
  }
})()

export default function () {
  stream = Stream()
  sound = Sound(stream)
  key.text('CQ CQ CQ DE BG5ATV BG5ATV BG5ATV PSE K')
  document.addEventListener('keypress', (event) => {
    event.preventDefault()
    const _key = event.key
    if (/[a-z0-9 ]/.test(_key)) {
      // eslint-disable-next-line no-console
      console.log(_key)
      key.text(_key.toUpperCase())
    }
    else if (_key === '.') {
      key.dot()
    }
    else if (_key === ',') {
      key.dash()
    }
  })

  return {
    add: (start: number, end: number) => stream?.add(start, end),
    on: (callback: Listener) => stream.on('fire', callback),
    mute: (enable: boolean) => sound.mute(enable),
  }
}
