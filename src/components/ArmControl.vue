<template>
  <v-card>
    <v-card-title class="text-overline">Arm Control</v-card-title>
    <v-card-text class="pt-0">
      <div v-for="(joint, idx) in joints" :key="joint.name" class="mb-2">
        <div class="d-flex justify-space-between text-caption">
          <span class="text-medium-emphasis">{{ joint.label }}</span>
          <span class="text-primary font-weight-bold">{{ jointDeg(joint.name) }}°</span>
        </div>
        <v-slider
          v-model="jointValues[idx]"
          :min="joint.min"
          :max="joint.max"
          :step="1"
          color="primary"
          hide-details
          density="compact"
          @update:model-value="sendArm"
        />
      </div>

      <v-divider class="my-2" />

      <div class="d-flex justify-space-between text-caption mb-1">
        <span class="text-medium-emphasis">Gripper</span>
        <span class="text-primary font-weight-bold">
          {{ gripperValue.toFixed(0) }}° ({{ gripperValue === 0 ? 'Closed' : gripperValue >= 120 ? 'Open' : '' }})
        </span>
      </div>
      <v-slider
        v-model="gripperValue"
        :min="0"
        :max="120"
        :step="1"
        color="primary"
        hide-details
        density="compact"
        class="mb-3"
        @update:model-value="sendGripper"
      />

      <v-btn
        variant="outlined"
        size="small"
        block
        @click="goHome"
      >Home Position</v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { useRobotControl } from '@/composables/useRobotControl'
import { useRobotState } from '@/composables/useRobotState'

const { publishArmJoint, publishGripper } = useRobotControl()
const { jointPositions } = useRobotState()

const joints = [
  { name: 'arm_base_link_to_arm_link1', label: 'Base', min: -180, max: 180 },
  { name: 'arm_link1_to_arm_link2', label: 'Shoulder', min: -90, max: 90 },
  { name: 'arm_link2_to_arm_link3', label: 'Elbow', min: -180, max: 180 },
]

const jointValues = ref([0, 45, -45])
const gripperValue = ref(0)

const GRIPPER_GRIP_MAX = (2 * Math.PI) / 3
const GRIPPER_ESP32_SCALE = 1.5
const GRIPPER_SLIDER_SCALE = 80 / 120

function degToRad(deg) {
  return (deg * Math.PI) / 180
}

function jointDeg(name) {
  const rad = jointPositions.value[name]
  if (rad == null) return '--'
  return ((rad * 180) / Math.PI).toFixed(0)
}

function sendArm() {
  const positions = [
    degToRad(jointValues.value[0]),
    degToRad(jointValues.value[1]),
    degToRad(jointValues.value[2]),
  ]
  publishArmJoint(positions)
}

function sendGripper() {
  const gripRad = degToRad(gripperValue.value * GRIPPER_SLIDER_SCALE)
  const esp32Val = (GRIPPER_GRIP_MAX - gripRad) * GRIPPER_ESP32_SCALE
  publishGripper(esp32Val)
}

function goHome() {
  jointValues.value = [0, 0, 0]
  gripperValue.value = 0
  sendArm()
  sendGripper()
}
</script>
