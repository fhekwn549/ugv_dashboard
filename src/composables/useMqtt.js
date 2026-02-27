import { ref, readonly } from 'vue'
import mqtt from 'mqtt'

const robotHost = import.meta.env.VITE_ROBOT_HOST || 'localhost'
const brokerUrl = ref(`ws://${robotHost}:1884`)
const isConnected = ref(false)
const logs = ref([])

let client = null
const topicHandlers = new Map()

function addLog(level, message) {
  const entry = {
    time: new Date().toLocaleTimeString(),
    level,
    message
  }
  logs.value = [entry, ...logs.value].slice(0, 200)
}

function connect(url) {
  if (url) brokerUrl.value = url
  disconnect()

  client = mqtt.connect(brokerUrl.value, {
    reconnectPeriod: 3000,
    connectTimeout: 5000
  })

  client.on('connect', () => {
    isConnected.value = true
    addLog('info', `MQTT connected to ${brokerUrl.value}`)
    // Re-subscribe all registered topics
    for (const topic of topicHandlers.keys()) {
      client.subscribe(topic)
    }
  })

  client.on('error', (err) => {
    addLog('error', `MQTT error: ${err.message || err}`)
  })

  client.on('close', () => {
    isConnected.value = false
    addLog('warn', 'MQTT disconnected')
  })

  client.on('offline', () => {
    addLog('warn', 'MQTT offline')
  })

  client.on('message', (topic, payload) => {
    const handler = topicHandlers.get(topic)
    if (handler) {
      try {
        const data = JSON.parse(payload.toString())
        handler(data)
      } catch {
        // ignore parse errors
      }
    }
  })
}

function disconnect() {
  if (client) {
    try { client.end(true) } catch { /* ignore */ }
    client = null
    isConnected.value = false
  }
}

function subscribe(topic, handler) {
  topicHandlers.set(topic, handler)
  if (client && client.connected) {
    client.subscribe(topic)
  }
}

function unsubscribe(topic) {
  topicHandlers.delete(topic)
  if (client && client.connected) {
    client.unsubscribe(topic)
  }
}

function publish(topic, data, qos = 0) {
  if (client && client.connected) {
    const payload = typeof data === 'string' ? data : JSON.stringify(data)
    client.publish(topic, payload, { qos })
  }
}

export function useMqtt() {
  return {
    brokerUrl,
    isConnected: readonly(isConnected),
    logs: readonly(logs),
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    publish,
    addLog
  }
}
