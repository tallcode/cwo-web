import MQTT from './mqtt.js'
import * as emqx from './emqx.js'

const mqtt = MQTT([
  'client/connected',
  'client/disconnected',
])

let timer

mqtt.onMessage(async () => {
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(async () => {
    const count = await emqx.count()
    mqtt.publish('client/count', count.toString())
  }, 2000)
})
