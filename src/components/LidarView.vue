<template>
  <div class="lidar-container" ref="containerRef">
    <canvas
      ref="canvasRef"
      @wheel="onWheel"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseUp"
    ></canvas>
    <div class="lidar-info">
      <span>{{ scanPoints.length }} pts</span>
      <span>Zoom: {{ zoom.toFixed(1) }}x</span>
      <span>Rot: {{ rotationDeg }}°</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLidar } from '@/composables/useLidar'

const { scanPoints } = useLidar()

const canvasRef = ref(null)
const containerRef = ref(null)
const zoom = ref(80)
const rotation = ref(0) // radians

const rotationDeg = computed(() => Math.round(rotation.value * 180 / Math.PI))

let animationId = null
let resizeObserver = null

// Drag rotation state
let dragging = false
let dragStartAngle = 0
let rotationStart = 0

function getAngleFromCenter(e) {
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  const cx = rect.width / 2
  const cy = rect.height / 2
  const dx = e.clientX - rect.left - cx
  const dy = e.clientY - rect.top - cy
  return Math.atan2(dy, dx)
}

function onMouseDown(e) {
  if (e.button !== 0) return
  dragging = true
  dragStartAngle = getAngleFromCenter(e)
  rotationStart = rotation.value
  canvasRef.value.style.cursor = 'grabbing'
}

function onMouseMove(e) {
  if (!dragging) return
  const currentAngle = getAngleFromCenter(e)
  rotation.value = rotationStart + (currentAngle - dragStartAngle)
}

function onMouseUp() {
  dragging = false
  if (canvasRef.value) canvasRef.value.style.cursor = 'grab'
}

function resizeCanvas() {
  const canvas = canvasRef.value
  const container = containerRef.value
  if (!canvas || !container) return

  canvas.width = container.clientWidth
  canvas.height = container.clientHeight
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height
  const cx = w / 2
  const cy = h / 2
  const rot = rotation.value

  ctx.fillStyle = '#0f1117'
  ctx.fillRect(0, 0, w, h)

  // Grid (fixed, doesn't rotate)
  ctx.strokeStyle = '#1a1d27'
  ctx.lineWidth = 1
  const gridStep = zoom.value
  for (let r = gridStep; r < Math.max(w, h); r += gridStep) {
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.stroke()
  }

  // Save and apply rotation
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(rot)

  // Axes (rotate with view)
  ctx.strokeStyle = '#2e3348'
  ctx.lineWidth = 1
  const axLen = Math.max(w, h)
  ctx.beginPath()
  ctx.moveTo(-axLen, 0)
  ctx.lineTo(axLen, 0)
  ctx.moveTo(0, -axLen)
  ctx.lineTo(0, axLen)
  ctx.stroke()

  // Robot arrow
  ctx.fillStyle = '#4e8cff'
  ctx.beginPath()
  ctx.moveTo(8, 0)
  ctx.lineTo(-5, -5)
  ctx.lineTo(-5, 5)
  ctx.closePath()
  ctx.fill()

  // Scan points
  const points = scanPoints.value
  ctx.fillStyle = '#34d399'
  for (const pt of points) {
    const px = pt.x * zoom.value
    const py = -pt.y * zoom.value
    ctx.fillRect(px - 1, py - 1, 2, 2)
  }

  ctx.restore()

  animationId = requestAnimationFrame(draw)
}

function onWheel(e) {
  e.preventDefault()
  zoom.value = Math.max(10, Math.min(500, zoom.value - e.deltaY * 0.1))
}

onMounted(() => {
  resizeCanvas()
  resizeObserver = new ResizeObserver(resizeCanvas)
  resizeObserver.observe(containerRef.value)
  canvasRef.value.style.cursor = 'grab'
  animationId = requestAnimationFrame(draw)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (resizeObserver) resizeObserver.disconnect()
})
</script>

<style scoped>
.lidar-container {
  flex: 1;
  position: relative;
  min-height: 200px;
  overflow: hidden;
}

canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.lidar-info {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: var(--color-text-dim);
  font-family: var(--font-mono);
  background: rgba(15, 17, 23, 0.8);
  padding: 2px 8px;
  border-radius: 4px;
}
</style>
