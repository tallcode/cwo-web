// eslint-disable-next-line unicorn/prefer-node-protocol
import type { Listener } from 'events'
import Stream from '@/libs/stream'
import Sound from '@/libs/sound'
import WebSocket from '@/libs/ws'

let stream: ReturnType<typeof Stream>
let sound: ReturnType<typeof Sound>
let currentChannel: number = 7013

export default function () {
  stream = Stream()
  sound = Sound()
  WebSocket((channel: number, data: number[]) => {
    if (currentChannel === channel)
      stream.add(data)
  })
  stream.on('fire', (enable) => {
    if (enable)
      sound.playTone()
    else
      sound.stopTone()
  })

  return {
    add: (data: number[]) => stream?.add(data),
    on: (callback: Listener) => stream.on('fire', callback),
    mute: (enable: boolean) => sound.mute(enable),
    channel: (value: number) => {
      currentChannel = value
    },
  }
}
