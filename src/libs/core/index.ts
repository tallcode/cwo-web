// eslint-disable-next-line unicorn/prefer-node-protocol
import type { Listener } from 'events'
import Stream from '@/libs/stream'
import Sound from '@/libs/sound'
import WebSocket from '@/libs/ws'
import Spectrum from '@/libs/spectrum'

let stream: ReturnType<typeof Stream>
let sound: ReturnType<typeof Sound>
let spectrum: ReturnType<typeof Spectrum>
let currentChannel: number = 7012

export default function (container: HTMLDivElement) {
  stream = Stream()
  sound = Sound()
  spectrum = Spectrum(container)
  WebSocket((channel: number, data: number[]) => {
    stream.add(channel, data)
  })
  stream.on('fire', (enable: number[]) => {
    if (enable.includes(currentChannel))
      sound.playTone()
    else
      sound.stopTone()
    spectrum?.draw(currentChannel, enable)
  })

  return {
    add: (channel: number, data: number[]) => stream?.add(channel, data),
    on: (callback: Listener) => stream.on('fire', callback),
    mute: (enable: boolean) => sound.mute(enable),
    channel: (value: number) => {
      sound.stopTone()
      currentChannel = value
    },
  }
}
