import { ref, watch, readonly } from 'vue'
import { useStomp } from './useStomp'
import { useApi } from './useApi'
import { useRobotId } from './useRobotId'

const navStatus = ref('idle')
const goalX = ref(0)
const goalY = ref(0)
const feedbackDistance = ref(0)

let subscribedFor = null

function teardown(rid) {
  const { unsubscribe } = useStomp()
  unsubscribe(`${rid}/nav_status`)
}

function setup(rid) {
  const { subscribe } = useStomp()

  subscribe(`${rid}/nav_status`, (data) => {
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
  const { isConnected } = useStomp()
  const { robotId } = useRobotId()

  watch([isConnected, robotId], ([connected, rid]) => {
    if (subscribedFor) {
      teardown(subscribedFor)
      subscribedFor = null
    }
    if (connected && rid) {
      navStatus.value = 'idle'
      goalX.value = 0
      goalY.value = 0
      feedbackDistance.value = 0
      setup(rid)
      subscribedFor = rid
    }
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
