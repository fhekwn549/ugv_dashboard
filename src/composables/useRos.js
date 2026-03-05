// Legacy compatibility shim — delegates to useStomp
import { useStomp } from './useStomp'
import { useApi } from './useApi'

export function useRos() {
  const { brokerUrl, isConnected, logs, connect, disconnect, addLog } = useStomp()

  return {
    url: brokerUrl,
    isConnected,
    logs,
    connect,
    disconnect,
    addLog
  }
}
