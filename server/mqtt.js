import 'dotenv/config'
import process from 'node:process'
import mqtt from 'mqtt'

const MQTT_SERVER = process.env.MQTT_SERVER
const MQTT_USERNAME = process.env.MQTT_USERNAME
const MQTT_PASSWORD = process.env.MQTT_PASSWORD

export default (topics) => {
  const client = mqtt.connect(MQTT_SERVER, {
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
  })

  client.on('connect', () => {
    topics.forEach((topic) => {
      client.subscribe(topic, (err) => {
        if (err) {
          console.error(`subscribe error: ${topic}`)
          console.error(err)
        }
      })
    })
  })

  function publish(topic, message) {
    client.publish(topic, message)
  }

  function onMessage(callback) {
    client.on('message', callback)
  }

  return {
    publish,
    onMessage,
  }
}
