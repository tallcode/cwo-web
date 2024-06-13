export default function useWebSocket(callback: (channel: number, stream: number[]) => void) {
  const socket = new WebSocket('wss://cwo.bg5atv.com')

  // 当接收到 WebSocket 消息时
  socket.addEventListener('message', (event) => {
    const { channel, data } = JSON.parse(event.data)

    const frame = data.reduce((acc: number[], value: number) => {
      const bits = value.toString(2).padStart(8, '0')
      return [...acc, ...bits.split('').map(Number)]
    }, [])

    const stream = frame.reduce((acc: number[], value: number, index: number) => {
      if (index % 4 === 0) {
        const merged = [
          frame[index],
          frame[index + 1],
          frame[index + 2],
          frame[index + 3],
        ].filter(Boolean).length > 1
          ? 1
          : 0
        return [...acc, merged]
      }
      return acc
    }, [])
    callback(channel, stream)
  })

  socket.addEventListener('close', () => {
    location.reload()
  })

  socket.addEventListener('error', () => {
    location.reload()
  })
}
