export default function (container: HTMLDivElement) {
  container.innerHTML = ''
  const width = container.clientWidth
  const height = container.clientHeight

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }

  const offscreenCanvas = new OffscreenCanvas(width, height)
  const offscreenCtx = offscreenCanvas.getContext('2d')
  if (!offscreenCtx) {
    return
  }

  const tempCanvas = new OffscreenCanvas(width, height)
  const tempCtx = tempCanvas.getContext('2d')
  if (!tempCtx) {
    return
  }

  container.appendChild(canvas)
  offscreenCtx.fillStyle = '#FF0000'

  return {
    draw: (current: number, enable: number[]) => {
      const list = [current - 3, current - 2, current - 1, current, current + 1, current + 2, current + 3]
      // 在画布中间平均的取5个点， 不包含头尾
      const gap = Math.floor(width / 8)
      const position = list.map((value) => {
        return gap * (value - current + 4)
      })
      const show = list.map((value) => {
        return enable.includes(value)
      })

      tempCtx.clearRect(0, 0, width, height)
      tempCtx.drawImage(offscreenCanvas, 0, 0, width, height, 0, 1, width, height)
      offscreenCtx.clearRect(0, 0, width, height)
      offscreenCtx.drawImage(tempCanvas, 0, 0, width, height)
      show.forEach((value, index) => {
        if (value) {
          offscreenCtx.fillRect(position[index] - 2, 0, 5, 1)
        }
      })
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(offscreenCanvas, 0, 0, width, height)
    },
  }
}
