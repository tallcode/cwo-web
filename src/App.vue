<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores/config'
import Spectrum from '@/components/Spectrum/index.vue'

const { mute, channel } = storeToRefs(useConfigStore())
</script>

<template>
  <v-app>
    <v-app-bar :elevation="2">
      <v-app-bar-title>CWO</v-app-bar-title>
      <template #append>
        <v-btn @click="mute = !mute">
          <template v-if="!mute">
            <v-icon>mdi-volume-off</v-icon>
          </template>
          <template v-else>
            <v-icon>mdi-volume-high</v-icon>
          </template>
        </v-btn>
      </template>
    </v-app-bar>
    <v-main>
      <Spectrum />
    </v-main>
    <v-bottom-navigation>
      <v-btn grow :disabled="channel === 7010" @click="channel = channel - 1">
        <v-icon>mdi-skip-previous</v-icon>
      </v-btn>
      <v-btn grow readonly>
        {{ channel }}
      </v-btn>
      <v-btn grow :disabled="channel === 7014" @click="channel = channel + 1">
        <v-icon>mdi-skip-next</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>
