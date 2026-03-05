<template>
  <v-container fluid>
    <v-row align="center" class="mb-4">
      <v-col cols="auto">
        <h2 class="text-h6">Log History</h2>
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <v-btn-toggle v-model="activeTab" density="compact" color="primary" mandatory>
          <v-btn v-for="tab in tabs" :key="tab.key" :value="tab.key" size="small" @click="switchTab(tab.key)">
            {{ tab.label }}
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <v-progress-linear v-if="loading" indeterminate color="primary" />

    <!-- Command logs -->
    <v-card v-if="activeTab === 'commands' && !loading">
      <v-data-table
        :headers="commandHeaders"
        :items="commandLogs"
        density="compact"
        :items-per-page="20"
        no-data-text="No command logs"
      >
        <template #item.ts="{ item }">
          <span class="text-caption" style="font-family: monospace">{{ item.ts }}</span>
        </template>
        <template #item.duration_ms="{ item }">
          <span class="text-caption" style="font-family: monospace">{{ item.duration_ms?.toFixed(0) }}ms</span>
        </template>
      </v-data-table>
    </v-card>

    <!-- Navigation logs -->
    <v-card v-if="activeTab === 'navigation' && !loading">
      <v-data-table
        :headers="navHeaders"
        :items="navLogs"
        density="compact"
        :items-per-page="20"
        no-data-text="No navigation logs"
      >
        <template #item.goal="{ item }">
          <span class="text-caption" style="font-family: monospace">
            ({{ item.goal_x?.toFixed(2) }}, {{ item.goal_y?.toFixed(2) }})
          </span>
        </template>
        <template #item.result="{ item }">
          <v-chip
            :color="navResultColor(item.result)"
            size="x-small"
            variant="tonal"
            label
          >{{ item.result || item.status }}</v-chip>
        </template>
      </v-data-table>
    </v-card>

    <!-- Event logs -->
    <v-card v-if="activeTab === 'events' && !loading">
      <v-data-table
        :headers="eventHeaders"
        :items="eventLogs"
        density="compact"
        :items-per-page="20"
        no-data-text="No event logs"
      >
        <template #item.level="{ item }">
          <v-chip
            :color="levelColor(item.level)"
            size="x-small"
            variant="tonal"
            label
            class="text-uppercase font-weight-bold"
          >{{ item.level }}</v-chip>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLogs } from '@/composables/useLogs'

const {
  commandLogs, navLogs, eventLogs, loading,
  fetchCommandLogs, fetchNavLogs, fetchEventLogs,
} = useLogs()

const tabs = [
  { key: 'commands', label: 'Commands' },
  { key: 'navigation', label: 'Navigation' },
  { key: 'events', label: 'Events' },
]

const activeTab = ref('commands')

const commandHeaders = [
  { title: 'Time', key: 'ts', width: 120 },
  { title: 'Endpoint', key: 'endpoint' },
  { title: 'Params', key: 'params' },
  { title: 'Result', key: 'result' },
  { title: 'Duration', key: 'duration_ms', width: 100 },
]

const navHeaders = [
  { title: 'Started', key: 'started_at', width: 160 },
  { title: 'Goal', key: 'goal', width: 160 },
  { title: 'Result', key: 'result', width: 120 },
  { title: 'Ended', key: 'ended_at', width: 160 },
]

const eventHeaders = [
  { title: 'Time', key: 'ts', width: 120 },
  { title: 'Level', key: 'level', width: 100 },
  { title: 'Source', key: 'source', width: 120 },
  { title: 'Message', key: 'message' },
]

function switchTab(tab) {
  activeTab.value = tab
  if (tab === 'commands') fetchCommandLogs()
  else if (tab === 'navigation') fetchNavLogs()
  else if (tab === 'events') fetchEventLogs()
}

function navResultColor(result) {
  if (result === 'succeeded') return 'success'
  if (result === 'canceled') return 'warning'
  return 'error'
}

function levelColor(level) {
  if (level === 'info') return 'info'
  if (level === 'warn') return 'warning'
  return 'error'
}

onMounted(() => fetchCommandLogs())
</script>
