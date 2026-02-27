import { ref, readonly } from 'vue'
import { useApi } from './useApi'

const commandLogs = ref([])
const navLogs = ref([])
const eventLogs = ref([])
const loading = ref(false)

async function fetchCommandLogs(limit = 50) {
  loading.value = true
  try {
    const { get, robotId } = useApi()
    const data = await get(`/api/${robotId.value}/logs?type=command&limit=${limit}`)
    commandLogs.value = data.logs || []
  } catch {
    commandLogs.value = []
  } finally {
    loading.value = false
  }
}

async function fetchNavLogs(limit = 20) {
  loading.value = true
  try {
    const { get, robotId } = useApi()
    const data = await get(`/api/${robotId.value}/logs/navigation?limit=${limit}`)
    navLogs.value = data.logs || []
  } catch {
    navLogs.value = []
  } finally {
    loading.value = false
  }
}

async function fetchEventLogs(limit = 100, level = null) {
  loading.value = true
  try {
    const { get, robotId } = useApi()
    let url = `/api/${robotId.value}/logs?type=event&limit=${limit}`
    if (level) url += `&level=${level}`
    const data = await get(url)
    eventLogs.value = data.logs || []
  } catch {
    eventLogs.value = []
  } finally {
    loading.value = false
  }
}

export function useLogs() {
  return {
    commandLogs: readonly(commandLogs),
    navLogs: readonly(navLogs),
    eventLogs: readonly(eventLogs),
    loading: readonly(loading),
    fetchCommandLogs,
    fetchNavLogs,
    fetchEventLogs
  }
}
