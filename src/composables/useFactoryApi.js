import { computed } from 'vue'
import api from '@/plugins/axios'

const factoryHost = import.meta.env.VITE_ROBOT_HOST || 'localhost'
const factoryPort = import.meta.env.VITE_FACTORY_API_PORT || '8082'
const factoryBaseUrl = `http://${factoryHost}:${factoryPort}`

export function useFactoryApi() {
  const apiBase = computed(() => factoryBaseUrl)

  return {
    apiBase,
    get: (path) => api.get(`${factoryBaseUrl}${path}`).then((r) => r.data).catch(() => ({ error: 'request_failed' })),
    post: (path, body) => api.post(`${factoryBaseUrl}${path}`, body).then((r) => r.data).catch(() => ({ error: 'request_failed' })),
    patch: (path, body) => api.patch(`${factoryBaseUrl}${path}`, body).then((r) => r.data).catch(() => ({ error: 'request_failed' })),
    del: (path) => api.delete(`${factoryBaseUrl}${path}`).then((r) => r.data).catch(() => null),
  }
}
