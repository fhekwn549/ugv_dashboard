<template>
  <v-card class="log-panel" rounded="0" flat>
    <v-card-title class="d-flex align-center pa-2">
      <span class="text-overline">Log</span>
      <v-chip size="x-small" class="ml-2" variant="tonal">{{ logs.length }}</v-chip>
    </v-card-title>
    <v-divider />
    <div class="log-list pa-2">
      <div
        v-for="(entry, i) in logs"
        :key="i"
        class="log-entry text-caption d-flex ga-2"
      >
        <span class="text-medium-emphasis">{{ entry.time }}</span>
        <span
          class="font-weight-bold"
          :class="{
            'text-primary': entry.level === 'info',
            'text-warning': entry.level === 'warn',
            'text-error': entry.level === 'error',
          }"
        >{{ entry.level.toUpperCase() }}</span>
        <span>{{ entry.message }}</span>
      </div>
      <div v-if="logs.length === 0" class="text-center text-medium-emphasis text-caption pa-3">
        No logs yet
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { useStomp } from '@/composables/useStomp'

const { logs } = useStomp()
</script>

<style scoped>
.log-panel {
  max-height: 140px;
  display: flex;
  flex-direction: column;
}
.log-list {
  overflow-y: auto;
  flex: 1;
  font-family: 'Consolas', 'Monaco', monospace;
}
.log-entry {
  line-height: 1.4;
}
</style>
