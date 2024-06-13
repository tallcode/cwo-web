import 'dotenv/config'
import process from 'node:process'
import schedule from 'node-schedule'
import * as emqx from './emqx.js'
import * as mqtt from './mqtt.js'

async function count() {
  const count = await emqx.count()
  mqtt.publish('client/count', count.toString())
}

async function main() {
  process.on('SIGINT', () => {
    schedule.gracefulShutdown()
      .then(() => process.exit(0))
  })

  await count()
  schedule.scheduleJob('*/1 * * * *', count)
}

main()
