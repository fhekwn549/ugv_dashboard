<template>
  <v-app>
    <ConnectionBar />
    <AlarmBanner />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import ConnectionBar from '@/components/ConnectionBar.vue'
import AlarmBanner from '@/components/factory/AlarmBanner.vue'
</script>
