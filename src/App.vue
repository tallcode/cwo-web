<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores/config'
import Spectrum from '@/components/Spectrum/index.vue'

const { mute } = storeToRefs(useConfigStore())
</script>

<template>
  <v-app>
    <v-app-bar :elevation="2">
      <v-app-bar-title>CWO</v-app-bar-title>
    </v-app-bar>
    <v-main>
      <Spectrum />
    </v-main>
    <v-bottom-navigation>
      <v-btn @click="mute = !mute">
        <template v-if="!mute">
          <v-icon>mdi-volume-off</v-icon>
          <span>Mute</span>
        </template>
        <template v-else>
          <v-icon>mdi-volume-high</v-icon>
          <span>Unmute</span>
        </template>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>
