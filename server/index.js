import 'dotenv/config'
import process from 'node:process'
import path from 'node:path'
import http from 'node:http'
import https from 'node:https'
import fs from 'node:fs'
import WebSocket from 'ws'
import express from 'express'
import compression from 'compression'
import * as emqx from './emqx.js'
import MQTT from './mqtt.js'

const SECURE = process.env.SECURE === 'TRUE'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

const app = express()
app.disable('x-powered-by')
app.use(compression())
app.get('/api/client', async (req, res) => {
  const clients = await emqx.clients()
  res.json(clients)
})
app.get('/api/count', async (req, res) => {
  const count = await emqx.count()
  res.json({ count })
})
app.use(express.static('dist'))
app.use((req, res) => res.sendFile(path.join(__dirname, 'dist/index.html')))

const server = SECURE
  ? https.createServer({
    key: fs.readFileSync(path.join(__dirname, `cert/cwo.bg5atv.com.key`)),
    cert: fs.readFileSync(path.join(__dirname, `cert/cwo.bg5atv.com.pem`)),
  }, app)
  : http.createServer(app)
const wss = new WebSocket.Server({ server })

const mqtt = MQTT([
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
])

mqtt.onMessage((topic, message) => {
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

const port = SECURE ? 8043 : 8080
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening on port ${port}`)
})

if (SECURE) {
  http.createServer((req, res) => {
    res.writeHead(301, {
      Location: `https://${req.headers.host}${req.url}`,
    })
    res.end()
  }).listen(8080, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on port 8080`)
  })
}
