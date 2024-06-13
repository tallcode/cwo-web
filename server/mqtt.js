import 'dotenv/config'
import process from 'node:process'
import mqtt from 'mqtt'

const MQTT_SERVER = process.env.MQTT_SERVER
const MQTT_USERNAME = process.env.MQTT_USERNAME
const MQTT_PASSWORD = process.env.MQTT_PASSWORD

const client = mqtt.connect(MQTT_SERVER, {
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
})

client.on('connect', () => {
  const topics = [
    'raw/7010',
    'raw/7011',
    'raw/7012',
    'raw/7013',
    'raw/7014',
    'raw/7015',
    'raw/7016',
    'raw/7017',
    'raw/7018',
    'raw/7019',
  ]
  topics.forEach((topic) => {
    client.subscribe(topic, (err) => {
      if (err) {
        console.error(`subscribe error: ${topic}`)
        console.error(err)
      }
    })
  })
})

export function publish(topic, message) {
  client.publish(topic, message)
}

export function onMessage(callback) {
  client.on('message', callback)
}
