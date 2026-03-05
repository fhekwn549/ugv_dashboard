<template>
  <div class="map-container" ref="containerRef">
    <canvas
      ref="canvasRef"
      @wheel="onWheel"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseUp"
      @contextmenu.prevent
    ></canvas>

    <v-chip
      v-if="navStatus.status === 'navigating'"
      color="primary"
      class="nav-chip"
      size="small"
    >
      Navigating
      <span v-if="navStatus.distance != null"> — {{ navStatus.distance.toFixed(2) }}m</span>
      <v-btn icon="mdi-close" size="x-small" variant="text" class="ml-1" @click="cancelNavigation" />
    </v-chip>
    <v-chip
      v-else-if="showResult && navStatus.status === 'succeeded'"
      color="success"
      class="nav-chip"
      size="small"
    >Arrived</v-chip>
    <v-chip
      v-else-if="showResult && (navStatus.status === 'failed' || navStatus.status === 'canceled')"
      color="error"
      class="nav-chip"
      size="small"
    >{{ navStatus.status === 'failed' ? 'Failed' : 'Canceled' }}</v-chip>

    <div v-if="navGoalDragging" class="nav-hint text-caption">Shift+Drag to set heading</div>

    <v-btn
      :color="showScan ? 'error' : 'default'"
      :variant="showScan ? 'tonal' : 'outlined'"
      size="x-small"
      class="lidar-toggle"
      @click="showScan = !showScan"
    >LiDAR</v-btn>

    <div class="map-info text-caption">
      <span v-if="mapData">{{ mapData.width }}x{{ mapData.height }} | {{ mapData.resolution }}m/px</span>
      <span v-else>No map data</span>
      <span>Zoom: {{ mapZoom.toFixed(1) }}x</span>
      <span>Rot: {{ rotationDeg }}°</span>
      <span v-if="mapPoseValid">TF</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useMap } from '@/composables/useMap'
import { useRobotState } from '@/composables/useRobotState'
import { useLidar } from '@/composables/useLidar'

const { mapData, globalPath, navStatus, publishNavGoal, cancelNavigation } = useMap()
const { scanPoints } = useLidar()

const showResult = ref(false)
let resultTimer = null

watch(() => navStatus.value.status, (s) => {
  if (s === 'succeeded' || s === 'failed' || s === 'canceled') {
    showResult.value = true
    clearTimeout(resultTimer)
    resultTimer = setTimeout(() => { showResult.value = false }, 3000)
  } else {
    showResult.value = false
  }
})

const { position, orientation, mapPosition, mapOrientation, mapPoseValid } = useRobotState()
const showScan = ref(true)

const canvasRef = ref(null)
const containerRef = ref(null)
const mapZoom = ref(1)
const rotation = ref(0)
const panX = ref(0)
const panY = ref(0)

const rotationDeg = computed(() => Math.round(rotation.value * 180 / Math.PI))

let animationId = null
let resizeObserver = null
let mapImage = null

let dragging = false
let dragType = null
let dragStartX = 0
let dragStartY = 0
let dragStartAngle = 0
let panStartX = 0
let panStartY = 0
let rotationStart = 0
const CLICK_THRESHOLD = 4

const navGoalDragging = ref(false)
let navGoalStartWorld = null
let navGoalTheta = 0

function getAngleFromCenter(e) {
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  return Math.atan2(e.clientY - rect.top - rect.height / 2, e.clientX - rect.left - rect.width / 2)
}

function onMouseDown(e) {
  dragStartX = e.clientX
  dragStartY = e.clientY

  if (e.button === 2) {
    dragging = true
    dragType = 'rotate'
    dragStartAngle = getAngleFromCenter(e)
    rotationStart = rotation.value
    canvasRef.value.style.cursor = 'grabbing'
  } else if (e.button === 0 && e.shiftKey) {
    dragging = true
    dragType = 'navgoal'
    navGoalStartWorld = screenToWorld(e)
    navGoalTheta = 0
    navGoalDragging.value = true
    canvasRef.value.style.cursor = 'crosshair'
  } else if (e.button === 0) {
    dragging = true
    dragType = 'pan'
    panStartX = panX.value
    panStartY = panY.value
    canvasRef.value.style.cursor = 'grabbing'
  }
}

function onMouseMove(e) {
  if (!dragging) return
  if (dragType === 'rotate') {
    rotation.value = rotationStart + (getAngleFromCenter(e) - dragStartAngle)
  } else if (dragType === 'pan') {
    panX.value = panStartX + (e.clientX - dragStartX)
    panY.value = panStartY + (e.clientY - dragStartY)
  } else if (dragType === 'navgoal') {
    const dx = e.clientX - dragStartX
    const dy = e.clientY - dragStartY
    const moved = Math.sqrt(dx * dx + dy * dy)
    if (moved > CLICK_THRESHOLD) {
      const cos = Math.cos(-rotation.value)
      const sin = Math.sin(-rotation.value)
      const mx = dx * cos - dy * sin
      const my = -(dx * sin + dy * cos)
      navGoalTheta = Math.atan2(my, mx)
    } else {
      navGoalTheta = 0
    }
  }
}

function onMouseUp(e) {
  if (!dragging) return
  const dx = e.clientX - dragStartX
  const dy = e.clientY - dragStartY
  const moved = Math.sqrt(dx * dx + dy * dy)
  dragging = false

  if (dragType === 'navgoal' && navGoalStartWorld) {
    const theta = moved >= CLICK_THRESHOLD ? navGoalTheta : 0
    publishNavGoal(navGoalStartWorld.x, navGoalStartWorld.y, theta)
    navGoalDragging.value = false
    navGoalStartWorld = null
  }

  dragType = null
  if (canvasRef.value) canvasRef.value.style.cursor = 'crosshair'
}

function resizeCanvas() {
  const canvas = canvasRef.value
  const container = containerRef.value
  if (!canvas || !container) return
  canvas.width = container.clientWidth
  canvas.height = container.clientHeight
}

function buildMapImage() {
  const map = mapData.value
  if (!map || !map.image) { mapImage = null; return }
  const img = new Image()
  img.onload = () => { mapImage = img }
  img.src = `data:image/png;base64,${map.image}`
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height

  ctx.fillStyle = '#121212'
  ctx.fillRect(0, 0, w, h)

  const map = mapData.value
  if (!map || !mapImage) {
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.font = '14px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Waiting for map ...', w / 2, h / 2)
    animationId = requestAnimationFrame(draw)
    return
  }

  const { width, height, resolution, origin } = map
  const baseScale = Math.min(w / width, h / height)
  const scale = mapZoom.value * baseScale

  ctx.save()
  ctx.translate(w / 2 + panX.value, h / 2 + panY.value)
  ctx.rotate(rotation.value)
  ctx.scale(scale, -scale)
  ctx.translate(-width / 2, -height / 2)

  ctx.save()
  ctx.scale(1, -1)
  ctx.drawImage(mapImage, 0, -height)
  ctx.restore()

  const path = globalPath.value
  if (path.length > 1) {
    ctx.strokeStyle = '#4fc3f7'
    ctx.lineWidth = 1 / scale
    ctx.beginPath()
    for (let i = 0; i < path.length; i++) {
      const mx = (path[i].x - origin.position.x) / resolution
      const my = (path[i].y - origin.position.y) / resolution
      if (i === 0) ctx.moveTo(mx, my)
      else ctx.lineTo(mx, my)
    }
    ctx.stroke()
  }

  const ns = navStatus.value
  const showGoal = (ns.status === 'navigating' || ns.status === 'succeeded') && ns.goalX != null
  if (showGoal) {
    const gx = (ns.goalX - origin.position.x) / resolution
    const gy = (ns.goalY - origin.position.y) / resolution
    const gTheta = ns.goalTheta || 0
    const markerSize = 8 / scale
    ctx.save()
    ctx.translate(gx, gy)
    ctx.strokeStyle = '#66bb6a'
    ctx.lineWidth = 2 / scale
    ctx.beginPath()
    ctx.moveTo(-markerSize, 0); ctx.lineTo(markerSize, 0)
    ctx.moveTo(0, -markerSize); ctx.lineTo(0, markerSize)
    ctx.stroke()
    ctx.rotate(gTheta)
    ctx.fillStyle = 'rgba(102, 187, 106, 0.7)'
    ctx.beginPath()
    ctx.moveTo(markerSize * 1.2, 0)
    ctx.lineTo(markerSize * 0.4, -markerSize * 0.5)
    ctx.lineTo(markerSize * 0.4, markerSize * 0.5)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  if (navGoalDragging.value && navGoalStartWorld) {
    const pgx = (navGoalStartWorld.x - origin.position.x) / resolution
    const pgy = (navGoalStartWorld.y - origin.position.y) / resolution
    const previewSize = 8 / scale
    ctx.save()
    ctx.translate(pgx, pgy)
    ctx.strokeStyle = 'rgba(102, 187, 106, 0.5)'
    ctx.lineWidth = 2 / scale
    ctx.beginPath()
    ctx.moveTo(-previewSize, 0); ctx.lineTo(previewSize, 0)
    ctx.moveTo(0, -previewSize); ctx.lineTo(0, previewSize)
    ctx.stroke()
    ctx.rotate(navGoalTheta)
    ctx.fillStyle = 'rgba(102, 187, 106, 0.4)'
    ctx.beginPath()
    ctx.moveTo(previewSize * 1.2, 0)
    ctx.lineTo(previewSize * 0.4, -previewSize * 0.5)
    ctx.lineTo(previewSize * 0.4, previewSize * 0.5)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  const useMapPose = mapPoseValid.value
  const posX = useMapPose ? mapPosition.value.x : position.value.x
  const posY = useMapPose ? mapPosition.value.y : position.value.y
  const posYaw = useMapPose ? mapOrientation.value : orientation.value

  const rx = (posX - origin.position.x) / resolution
  const ry = (posY - origin.position.y) / resolution

  if (showScan.value && scanPoints.value.length > 0) {
    const cosYaw = Math.cos(posYaw)
    const sinYaw = Math.sin(posYaw)
    ctx.fillStyle = 'rgba(255, 60, 60, 0.8)'
    const dotSize = 1.5 / scale
    for (const pt of scanPoints.value) {
      const mx = posX + pt.x * cosYaw - pt.y * sinYaw
      const my = posY + pt.x * sinYaw + pt.y * cosYaw
      const px = (mx - origin.position.x) / resolution
      const py = (my - origin.position.y) / resolution
      ctx.fillRect(px - dotSize / 2, py - dotSize / 2, dotSize, dotSize)
    }
  }

  ctx.save()
  ctx.translate(rx, ry)
  ctx.rotate(posYaw)
  const robotSize = 6 / scale
  ctx.fillStyle = '#ef5350'
  ctx.beginPath()
  ctx.moveTo(robotSize, 0)
  ctx.lineTo(-robotSize * 0.7, -robotSize * 0.7)
  ctx.lineTo(-robotSize * 0.7, robotSize * 0.7)
  ctx.closePath()
  ctx.fill()
  ctx.restore()

  ctx.restore()
  animationId = requestAnimationFrame(draw)
}

function screenToWorld(e) {
  const map = mapData.value
  if (!map || !mapImage) return null
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  const { width, height, resolution, origin } = map
  const baseScale = Math.min(canvas.width / width, canvas.height / height)
  const scale = mapZoom.value * baseScale

  let sx = e.clientX - rect.left - canvas.width / 2 - panX.value
  let sy = e.clientY - rect.top - canvas.height / 2 - panY.value
  const cos = Math.cos(-rotation.value)
  const sin = Math.sin(-rotation.value)
  const rxv = sx * cos - sy * sin
  const ryv = sx * sin + sy * cos
  const px = rxv / scale + width / 2
  const py = -(ryv / scale) + height / 2

  return {
    x: px * resolution + origin.position.x,
    y: py * resolution + origin.position.y,
  }
}

function onWheel(e) {
  e.preventDefault()
  mapZoom.value = Math.max(0.2, Math.min(10, mapZoom.value * (1 - e.deltaY * 0.001)))
}

watch(mapData, buildMapImage)

onMounted(() => {
  resizeCanvas()
  resizeObserver = new ResizeObserver(resizeCanvas)
  resizeObserver.observe(containerRef.value)
  if (mapData.value) buildMapImage()
  animationId = requestAnimationFrame(draw)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (resizeObserver) resizeObserver.disconnect()
})
</script>

<style scoped>
.map-container {
  flex: 1;
  position: relative;
  min-height: 200px;
  overflow: hidden;
}
canvas {
  width: 100%;
  height: 100%;
  display: block;
  cursor: crosshair;
}
.nav-chip {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
}
.nav-hint {
  position: absolute;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
  color: rgb(var(--v-theme-success));
  font-family: 'Consolas', 'Monaco', monospace;
  background: rgba(18, 18, 18, 0.8);
  padding: 2px 10px;
  border-radius: 4px;
  pointer-events: none;
}
.lidar-toggle {
  position: absolute;
  top: 8px;
  right: 8px;
}
.map-info {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: flex;
  gap: 12px;
  font-family: 'Consolas', 'Monaco', monospace;
  background: rgba(18, 18, 18, 0.8);
  padding: 2px 8px;
  border-radius: 4px;
  color: rgba(255,255,255,0.5);
}
</style>
