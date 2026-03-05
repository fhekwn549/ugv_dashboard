import { ref, watch, readonly } from 'vue'
import { useStomp } from './useStomp'
import { useRobotId } from './useRobotId'

const scanPoints = ref([])

let subscribedFor = null

function teardown(rid) {
  const { unsubscribe } = useStomp()
  unsubscribe(`${rid}/scan`)
}

function setup(rid) {
  const { subscribe } = useStomp()

  subscribe(`${rid}/scan`, (msg) => {
    const points = []
    const { angle_min, angle_increment, ranges, range_min, range_max } = msg

    for (let i = 0; i < ranges.length; i++) {
      const r = ranges[i]
      if (r == null || r < range_min || r >= range_max || !isFinite(r)) continue

      const angle = angle_min + i * angle_increment + Math.PI / 2
      points.push({
        x: r * Math.cos(angle),
        y: r * Math.sin(angle)
      })
    }

    scanPoints.value = points
  })
}

export function useLidar() {
  const { isConnected } = useStomp()
  const { robotId } = useRobotId()

  watch([isConnected, robotId], ([connected, rid]) => {
    if (subscribedFor) {
      teardown(subscribedFor)
      subscribedFor = null
    }
    if (connected && rid) {
      scanPoints.value = []
      setup(rid)
      subscribedFor = rid
    }
  }, { immediate: true })

  return {
    scanPoints: readonly(scanPoints)
  }
}
