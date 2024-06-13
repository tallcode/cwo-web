import 'dotenv/config'
import process from 'node:process'
import got from 'got'

const client = got.extend({
  prefixUrl: `${process.env.EMQX_API}/api/v5`,
  username: process.env.EMQX_API_KEY,
  password: process.env.EMQX_API_SECRET,
  responseType: 'json',
})

export async function clients() {
  const result = await client.get('clients', {
    searchParams: {
      conn_state: 'connected',
    },
  })
  return result.body.data
    .map(client => client.clientid)
    .filter(clientid => clientid.startsWith('CWO-'))
    .map(clientid => clientid.split('-')[2])
    .filter(clientid => !!clientid)
}

export async function count() {
  const result = await client.get('session_count')
  return result.body
}
