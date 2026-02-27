<template>
  <div class="log-history">
    <div class="log-toolbar">
      <router-link to="/" class="back-btn">← Dashboard</router-link>
      <h2 class="page-title">Log History</h2>
      <div class="tab-group">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab-btn', { active: activeTab === tab.key }]"
          @click="switchTab(tab.key)"
        >{{ tab.label }}</button>
      </div>
    </div>

    <div class="log-content">
      <div v-if="loading" class="loading">Loading...</div>

      <!-- Command logs -->
      <table v-if="activeTab === 'commands' && !loading" class="log-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Endpoint</th>
            <th>Params</th>
            <th>Result</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in commandLogs" :key="log.id">
            <td class="mono">{{ log.ts }}</td>
            <td>{{ log.endpoint }}</td>
            <td class="mono truncate">{{ log.params }}</td>
            <td>{{ log.result }}</td>
            <td class="mono">{{ log.duration_ms?.toFixed(0) }}ms</td>
          </tr>
          <tr v-if="commandLogs.length === 0">
            <td colspan="5" class="empty">No command logs</td>
          </tr>
        </tbody>
      </table>

      <!-- Navigation logs -->
      <table v-if="activeTab === 'navigation' && !loading" class="log-table">
        <thead>
          <tr>
            <th>Started</th>
            <th>Goal</th>
            <th>Result</th>
            <th>Ended</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in navLogs" :key="log.id">
            <td class="mono">{{ log.started_at }}</td>
            <td class="mono">({{ log.goal_x?.toFixed(2) }}, {{ log.goal_y?.toFixed(2) }})</td>
            <td :class="navResultClass(log.result)">{{ log.result || log.status }}</td>
            <td class="mono">{{ log.ended_at || '—' }}</td>
          </tr>
          <tr v-if="navLogs.length === 0">
            <td colspan="4" class="empty">No navigation logs</td>
          </tr>
        </tbody>
      </table>

      <!-- Event logs -->
      <table v-if="activeTab === 'events' && !loading" class="log-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Level</th>
            <th>Source</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in eventLogs" :key="log.id">
            <td class="mono">{{ log.ts }}</td>
            <td :class="'level-' + log.level">{{ log.level.toUpperCase() }}</td>
            <td>{{ log.source }}</td>
            <td>{{ log.message }}</td>
          </tr>
          <tr v-if="eventLogs.length === 0">
            <td colspan="4" class="empty">No event logs</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLogs } from '@/composables/useLogs'

const {
  commandLogs, navLogs, eventLogs, loading,
  fetchCommandLogs, fetchNavLogs, fetchEventLogs
} = useLogs()

const tabs = [
  { key: 'commands', label: 'Commands' },
  { key: 'navigation', label: 'Navigation' },
  { key: 'events', label: 'Events' }
]

const activeTab = ref('commands')

function switchTab(tab) {
  activeTab.value = tab
  if (tab === 'commands') fetchCommandLogs()
  else if (tab === 'navigation') fetchNavLogs()
  else if (tab === 'events') fetchEventLogs()
}

function navResultClass(result) {
  if (result === 'succeeded') return 'result-ok'
  if (result === 'canceled') return 'result-warn'
  return 'result-err'
}

onMounted(() => {
  fetchCommandLogs()
})
</script>

<style scoped>
.log-history {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--color-bg);
}

.log-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.back-btn {
  color: var(--color-accent);
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
}

.page-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.tab-group {
  display: flex;
  gap: 4px;
  margin-left: auto;
}

.tab-btn {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-dim);
  background: transparent;
  transition: all 0.2s;
}

.tab-btn.active {
  color: #fff;
  background: var(--color-accent);
}

.log-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.loading {
  color: var(--color-text-dim);
  text-align: center;
  padding: 40px;
}

.log-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.log-table th {
  text-align: left;
  padding: 8px 12px;
  color: var(--color-text-dim);
  font-weight: 600;
  border-bottom: 1px solid var(--color-border);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.log-table td {
  padding: 6px 12px;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
}

.log-table tr:hover td {
  background: var(--color-surface-alt);
}

.mono {
  font-family: var(--font-mono);
  font-size: 11px;
}

.truncate {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty {
  color: var(--color-text-dim);
  text-align: center;
  padding: 24px;
}

.result-ok { color: var(--color-success); font-weight: 600; }
.result-warn { color: var(--color-warning); font-weight: 600; }
.result-err { color: var(--color-danger); font-weight: 600; }

.level-info { color: var(--color-accent); font-weight: 600; }
.level-warn { color: var(--color-warning); font-weight: 600; }
.level-error { color: var(--color-danger); font-weight: 600; }
</style>
