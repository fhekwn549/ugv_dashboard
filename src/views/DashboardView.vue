<template>
  <div class="dashboard-layout">
    <div class="dashboard-grid">
      <div class="left-panel">
        <StatusPanel />
        <DriveControl />
        <ArmControl />
      </div>
      <v-card class="right-panel">
        <v-tabs v-model="activeViz" density="compact" color="primary">
          <v-tab value="lidar">LiDAR</v-tab>
          <v-tab value="map">Map</v-tab>
        </v-tabs>
        <v-divider />
        <LidarView v-if="activeViz === 'lidar'" />
        <MapView v-if="activeViz === 'map'" />
      </v-card>
    </div>
    <LogPanel />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StatusPanel from '@/components/StatusPanel.vue'
import DriveControl from '@/components/DriveControl.vue'
import ArmControl from '@/components/ArmControl.vue'
import LidarView from '@/components/LidarView.vue'
import MapView from '@/components/MapView.vue'
import LogPanel from '@/components/LogPanel.vue'

const activeViz = ref('lidar')
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 48px);
  overflow: hidden;
}
.dashboard-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 8px;
  padding: 8px;
  flex: 1;
  min-height: 0;
}
.left-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
  overflow-y: auto;
}
.right-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
@media (max-width: 900px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }
}
</style>
