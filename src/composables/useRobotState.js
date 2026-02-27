import { ref, watch, readonly } from 'vue'
import { useMqtt } from './useMqtt'

const ROBOT_ID = 'ugv01'

const battery = ref(0)
const position = ref({ x: 0, y: 0 })
const orientation = ref(0)
const linearVel = ref(0)
const angularVel = ref(0)
const imuYaw = ref(0)
const jointPositions = ref({})
const mapPosition = ref({ x: 0, y: 0 })
const mapOrientation = ref(0)
const mapPoseValid = ref(false)

let subscribed = false

function setupSubscriptions() {
  if (subscribed) return
  subscribed = true

  const { subscribe } = useMqtt()

  subscribe(`${ROBOT_ID}/pose`, (data) => {
    position.value = { x: data.x, y: data.y }
    orientation.value = data.yaw
    linearVel.value = data.linear_vel
    angularVel.value = data.angular_vel
  })

  subscribe(`${ROBOT_ID}/voltage`, (data) => {
    battery.value = data.voltage
  })

  subscribe(`${ROBOT_ID}/joint_states`, (data) => {
    jointPositions.value = data.joints || {}
  })

  subscribe(`${ROBOT_ID}/map_pose`, (data) => {
    mapPosition.value = { x: data.x, y: data.y }
    mapOrientation.value = data.yaw
    mapPoseValid.value = !!data.valid
  })
}

export function useRobotState() {
  const { isConnected } = useMqtt()

  watch(isConnected, (connected) => {
    if (connected) {
      setupSubscriptions()
    }
  }, { immediate: true })

  return {
    battery: readonly(battery),
    position: readonly(position),
    orientation: readonly(orientation),
    linearVel: readonly(linearVel),
    angularVel: readonly(angularVel),
    imuYaw: readonly(imuYaw),
    jointPositions: readonly(jointPositions),
    mapPosition: readonly(mapPosition),
    mapOrientation: readonly(mapOrientation),
    mapPoseValid: readonly(mapPoseValid),
  }
}
