import http from 'node:http'
import mqtt from 'mqtt'
import WebSocket from 'ws'
import express from 'express'

const client = mqtt.connect('mqtt://cwo.bg5atv.com:1883', {
  username: 'web',
  password: '1111112',
})

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

client.on('connect', () => {
  const topics = [
    'raw/7010',
    'raw/7011',
    'raw/7012',
    'raw/7013',
    'raw/7014',
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

client.on('message', (topic, message) => {
  const channel = Number.parseInt(topic.split('/')[1])
  const data = message.subarray(-16)
  const values = Array.from({ length: 16 }, (_, i) => {
    return data[i]
  })

  const timestamp = Date.now()
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        timestamp,
        channel,
        data: values,
      }))
    }
  })
})

server.listen(8080, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening on port 8080`)
})
