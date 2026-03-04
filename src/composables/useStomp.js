import { ref, readonly } from 'vue'
import { Client } from '@stomp/stompjs'

const robotHost = import.meta.env.VITE_ROBOT_HOST || 'localhost'
const brokerUrl = ref(`ws://${robotHost}:15674/ws`)
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

/** Convert MQTT-style topic to STOMP destination: ugv01/pose → /topic/ugv01.pose */
function mqttToStomp(topic) {
  return '/topic/' + topic.replace(/\//g, '.')
}

/** Convert STOMP destination back to MQTT-style topic: /topic/ugv01.pose → ugv01/pose */
function stompToMqtt(destination) {
  return destination.replace(/^\/topic\//, '').replace(/\./g, '/')
}

function connect(url) {
  if (url) brokerUrl.value = url
  disconnect()

  client = new Client({
    brokerURL: brokerUrl.value,
    reconnectDelay: 3000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,

    onConnect: () => {
      isConnected.value = true
      addLog('info', `STOMP connected to ${brokerUrl.value}`)
      // Re-subscribe all registered topics
      for (const [topic, handler] of topicHandlers.entries()) {
        const dest = mqttToStomp(topic)
        client.subscribe(dest, (msg) => {
          try {
            handler(JSON.parse(msg.body))
          } catch { /* ignore parse errors */ }
        })
      }
    },

    onDisconnect: () => {
      isConnected.value = false
      addLog('warn', 'STOMP disconnected')
    },

    onStompError: (frame) => {
      addLog('error', `STOMP error: ${frame.headers.message || 'unknown'}`)
    },

    onWebSocketClose: () => {
      isConnected.value = false
    }
  })

  client.activate()
}

function disconnect() {
  if (client) {
    try { client.deactivate() } catch { /* ignore */ }
    client = null
    isConnected.value = false
  }
}

function subscribe(topic, handler) {
  topicHandlers.set(topic, handler)
  if (client && client.connected) {
    const dest = mqttToStomp(topic)
    client.subscribe(dest, (msg) => {
      try {
        handler(JSON.parse(msg.body))
      } catch { /* ignore parse errors */ }
    })
  }
}

function unsubscribe(topic) {
  topicHandlers.delete(topic)
  // STOMP.js manages subscriptions internally via IDs;
  // on next reconnect the handler won't be re-registered.
}

function publish(topic, data, _qos = 0) {
  if (client && client.connected) {
    const body = typeof data === 'string' ? data : JSON.stringify(data)
    client.publish({ destination: mqttToStomp(topic), body })
  }
}

export function useStomp() {
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
