import { computed, ref } from 'vue'
import store from '@/plugins/stores'

const bridgeHost = import.meta.env.VITE_BRIDGE_HOST || ''
const apiPort = import.meta.env.VITE_API_PORT || '8081'
const availableRobots = ref([])

export function useRobotId() {
  const robotId = computed(() => store.state.robotId)

  function setRobotId(id) {
    store.commit('setRobotId', id)
  }

  async function fetchRobots(host) {
    try {
      const targetHost = bridgeHost || host
      const res = await fetch(`http://${targetHost}:${apiPort}/api/health`)
      const data = await res.json()
      if (Array.isArray(data.robots)) {
        availableRobots.value = data.robots
      }
    } catch {
      // ignore fetch errors
    }
  }

  return {
    robotId,
    setRobotId,
    availableRobots,
    fetchRobots,
  }
}
