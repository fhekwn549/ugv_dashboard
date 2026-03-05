import { computed } from 'vue'
import api from '@/plugins/axios'
import { useStomp } from './useStomp'
import { useRobotId } from './useRobotId'

const apiPort = import.meta.env.VITE_API_PORT || '8081'

function baseUrl() {
  const { connectedHost } = useStomp()
  return `http://${connectedHost.value}:${apiPort}`
}

export function useApi() {
  const { connectedHost } = useStomp()
  const { robotId } = useRobotId()
  const apiBase = computed(() => `http://${connectedHost.value}:${apiPort}`)

  return {
    apiBase,
    robotId,
    get: (path) => api.get(`${baseUrl()}${path}`).then((r) => r.data).catch(() => ({ error: 'request_failed' })),
    post: (path, body) => api.post(`${baseUrl()}${path}`, body).then((r) => r.data).catch(() => ({ error: 'request_failed' })),
  }
}
