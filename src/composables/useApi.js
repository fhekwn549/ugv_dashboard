import { computed } from 'vue'
import api from '@/plugins/axios'
import { useStomp } from './useStomp'
import { useRobotId } from './useRobotId'

const bridgeHost = import.meta.env.VITE_BRIDGE_HOST || ''
const apiPort = import.meta.env.VITE_API_PORT || '8081'

function getHost() {
  if (bridgeHost) return bridgeHost
  const { connectedHost } = useStomp()
  return connectedHost.value
}

function baseUrl() {
  return `http://${getHost()}:${apiPort}`
}

export function useApi() {
  const { connectedHost } = useStomp()
  const { robotId } = useRobotId()
  const apiBase = computed(() => `http://${bridgeHost || connectedHost.value}:${apiPort}`)

  return {
    apiBase,
    robotId,
    get: (path) => api.get(`${baseUrl()}${path}`).then((r) => r.data).catch(() => ({ error: 'request_failed' })),
    post: (path, body) => api.post(`${baseUrl()}${path}`, body).then((r) => r.data).catch(() => ({ error: 'request_failed' })),
  }
}
