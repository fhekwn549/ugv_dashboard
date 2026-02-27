import { useMqtt } from './useMqtt'
import { useApi } from './useApi'

const ROBOT_ID = 'ugv01'
const THROTTLE_MS = 100  // 10Hz max

const ARM_JOINTS = [
  'arm_base_link_to_arm_link1',
  'arm_link1_to_arm_link2',
  'arm_link2_to_arm_link3',
  'arm_link3_to_arm_gripper_link'
]

// Throttle state for arm and gripper
let armPending = false
let armLatest = null
let gripperPending = false
let gripperLatest = null

function publishCmdVel(linear, angular) {
  const { publish } = useMqtt()
  publish(`${ROBOT_ID}/cmd_vel`, { linear, angular })
}

function publishArmJoint(positions) {
  armLatest = positions
  if (armPending) return
  armPending = true
  sendArmNow(positions)
  setTimeout(() => {
    armPending = false
    // If a newer value arrived while waiting, send it
    if (armLatest !== positions) {
      publishArmJoint(armLatest)
    }
  }, THROTTLE_MS)
}

function sendArmNow(positions) {
  const { post, robotId } = useApi()
  post(`/api/${robotId.value}/arm`, { positions })
}

function publishGripper(value) {
  gripperLatest = value
  if (gripperPending) return
  gripperPending = true
  sendGripperNow(value)
  setTimeout(() => {
    gripperPending = false
    if (gripperLatest !== value) {
      publishGripper(gripperLatest)
    }
  }, THROTTLE_MS)
}

function sendGripperNow(value) {
  const { post, robotId } = useApi()
  post(`/api/${robotId.value}/gripper`, { value })
}

function stopAll() {
  publishCmdVel(0, 0)
}

function resetTopics() {
  // No-op: MQTT handles cleanup automatically
}

export function useRobotControl() {
  return {
    publishCmdVel,
    publishArmJoint,
    publishGripper,
    stopAll,
    resetTopics,
    ARM_JOINTS
  }
}
