import type Core from '@/libs/core'

export default function (container: HTMLDivElement, core: ReturnType<typeof Core>) {
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

  const center = width / 2

  const draw = (enable: boolean) => {
    tempCtx.clearRect(0, 0, width, height)
    tempCtx.drawImage(offscreenCanvas, 0, 0, width, height, 0, 1, width, height)
    offscreenCtx.clearRect(0, 0, width, height)
    offscreenCtx.drawImage(tempCanvas, 0, 0, width, height)
    if (enable) {
      offscreenCtx.fillStyle = '#FF0000'
      offscreenCtx.fillRect(center - 2, 0, 5, 1)
    }
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(offscreenCanvas, 0, 0, width, height)
  }

  core.on((enable) => {
    draw(!!enable)
  })
}
