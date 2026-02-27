import { ref, watch, readonly } from 'vue'
import { useMqtt } from './useMqtt'
import { useApi } from './useApi'

const ROBOT_ID = 'ugv01'

const navStatus = ref('idle')
const goalX = ref(0)
const goalY = ref(0)
const feedbackDistance = ref(0)

let subscribed = false

function setupSubscription() {
  if (subscribed) return
  subscribed = true

  const { subscribe } = useMqtt()

  subscribe(`${ROBOT_ID}/nav_status`, (data) => {
    navStatus.value = data.status
    goalX.value = data.goal_x
    goalY.value = data.goal_y
    feedbackDistance.value = data.feedback_distance
  })
}

async function cancelNavigation() {
  const { post, robotId } = useApi()
  return post(`/api/${robotId.value}/cancel`)
}

async function setInitialPose(x, y, yaw) {
  const { post, robotId } = useApi()
  return post(`/api/${robotId.value}/initial_pose`, { x, y, yaw })
}

export function useNavigation() {
  const { isConnected } = useMqtt()

  watch(isConnected, (connected) => {
    if (connected) setupSubscription()
  }, { immediate: true })

  return {
    navStatus: readonly(navStatus),
    goalX: readonly(goalX),
    goalY: readonly(goalY),
    feedbackDistance: readonly(feedbackDistance),
    cancelNavigation,
    setInitialPose
  }
}
