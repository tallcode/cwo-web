<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useStatusStore } from './stores/status'
import { useConfigStore } from '@/stores/config'
import Main from '@/components/Main/index.vue'

const { mute, channel } = storeToRefs(useConfigStore())
const { count, clients } = storeToRefs(useStatusStore())
const drawer = ref(false)
</script>

<template>
  <v-app>
    <v-app-bar :elevation="2">
      <v-app-bar-title>
        CWO<span>&nbsp;&nbsp;</span><span class="text-caption">BG5ATV's Server</span>
      </v-app-bar-title>

      <v-btn icon @click="drawer = true">
        <v-badge :content="count" color="red-darken-3">
          <v-icon>mdi-account-multiple-outline</v-icon>
        </v-badge>
      </v-btn>
      <v-btn icon @click="mute = !mute">
        <v-icon v-if="!mute">
          mdi-volume-off
        </v-icon>
        <v-icon v-else>
          mdi-volume-high
        </v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      location="right"
      temporary
    >
      <v-list
        :items="clients"
      />
    </v-navigation-drawer>
    <v-main>
      <Main />
    </v-main>
    <v-bottom-navigation>
      <v-btn grow :disabled="channel === 7010" @click="channel = channel - 1">
        <v-icon>mdi-skip-previous</v-icon>
      </v-btn>
      <v-btn grow readonly>
        {{ channel }}
      </v-btn>
      <v-btn grow :disabled="channel === 7019" @click="channel = channel + 1">
        <v-icon>mdi-skip-next</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>
