// Legacy compatibility shim — delegates to useMqtt
import { useMqtt } from './useMqtt'
import { useApi } from './useApi'

export function useRos() {
  const { brokerUrl, isConnected, logs, connect, disconnect, addLog } = useMqtt()

  return {
    url: brokerUrl,
    isConnected,
    logs,
    connect,
    disconnect,
    addLog
  }
}
