import { ref, readonly } from 'vue'
import Stomp from 'stompjs'

const robotHost = import.meta.env.VITE_ROBOT_HOST || 'localhost'
const brokerUrl = ref(`ws://${robotHost}:15674/ws`)
const connectedHost = ref(robotHost)
const isConnected = ref(false)
const logs = ref([])

let stompClient = null
let reconnectTimer = null
const topicHandlers = new Map()
const stompSubs = new Map()  // topic → STOMP subscription object

function addLog(level, message) {
  const entry = {
    time: new Date().toLocaleTimeString(),
    level,
    message,
  }
  logs.value = [entry, ...logs.value].slice(0, 200)
}

/** Convert MQTT-style topic to STOMP destination: ugv01/pose → /topic/ugv01.pose */
function mqttToStomp(topic) {
  return '/topic/' + topic.replace(/\//g, '.')
}

function subscribeAll() {
  if (!stompClient || !stompClient.connected) return
  stompSubs.clear()
  for (const [topic, handler] of topicHandlers.entries()) {
    const dest = mqttToStomp(topic)
    const sub = stompClient.subscribe(dest, (msg) => {
      try {
        handler(JSON.parse(msg.body))
      } catch { /* ignore parse errors */ }
    })
    stompSubs.set(topic, sub)
  }
}

function scheduleReconnect() {
  if (reconnectTimer) return
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    if (!isConnected.value) {
      addLog('info', 'Attempting reconnect...')
      connect()
    }
  }, 3000)
}

function connect(url) {
  if (url) brokerUrl.value = url
  disconnect()

  const ws = new WebSocket(brokerUrl.value)
  stompClient = Stomp.over(ws)
  stompClient.debug = null // suppress debug logs

  stompClient.connect(
    'guest',
    'guest',
    // onConnect
    () => {
      isConnected.value = true
      try {
        const parsed = new URL(brokerUrl.value)
        connectedHost.value = parsed.hostname
      } catch { /* keep previous */ }
      addLog('info', `STOMP connected to ${brokerUrl.value}`)
      subscribeAll()
    },
    // onError
    (error) => {
      isConnected.value = false
      const msg = typeof error === 'string' ? error : error?.headers?.message || 'unknown'
      addLog('error', `STOMP error: ${msg}`)
      scheduleReconnect()
    },
    // vhost
    '/',
  )

  ws.onclose = () => {
    isConnected.value = false
    scheduleReconnect()
  }
}

function disconnect() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  if (stompClient) {
    try { stompClient.disconnect(() => {}) } catch { /* ignore */ }
    stompClient = null
    isConnected.value = false
  }
}

function subscribe(topic, handler) {
  // Unsubscribe existing subscription for this topic first
  const existing = stompSubs.get(topic)
  if (existing) {
    try { existing.unsubscribe() } catch { /* ignore */ }
    stompSubs.delete(topic)
  }
  topicHandlers.set(topic, handler)
  if (stompClient && stompClient.connected) {
    const dest = mqttToStomp(topic)
    const sub = stompClient.subscribe(dest, (msg) => {
      try {
        handler(JSON.parse(msg.body))
      } catch { /* ignore parse errors */ }
    })
    stompSubs.set(topic, sub)
  }
}

function unsubscribe(topic) {
  const sub = stompSubs.get(topic)
  if (sub) {
    try { sub.unsubscribe() } catch { /* ignore */ }
    stompSubs.delete(topic)
  }
  topicHandlers.delete(topic)
}

function publish(topic, data, _qos = 0) {
  if (stompClient && stompClient.connected) {
    const body = typeof data === 'string' ? data : JSON.stringify(data)
    stompClient.send(mqttToStomp(topic), {}, body)
  }
}

export function useStomp() {
  return {
    brokerUrl,
    connectedHost: readonly(connectedHost),
    isConnected: readonly(isConnected),
    logs: readonly(logs),
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    publish,
    addLog,
  }
}
