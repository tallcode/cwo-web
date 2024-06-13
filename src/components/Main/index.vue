<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import Core from '@/libs/core'
import { useConfigStore } from '@/stores/config'

const container = ref<HTMLDivElement>()
const isInit = ref(false)
const { mute, channel } = storeToRefs(useConfigStore())

function init() {
  isInit.value = true
  nextTick(() => {
    if (container.value) {
      const core = Core(container.value)
      watch(mute, (value) => {
        core.mute(value)
      }, {
        immediate: true,
      })
      watch(channel, (value) => {
        core.channel(value)
      }, {
        immediate: true,
      })
    }
  })
}
</script>

<template>
  <div v-if="!isInit" class="h-100 w-100 d-flex justify-center align-center">
    <v-btn prepend-icon="mdi-play" @click="init">
      Connect
    </v-btn>
  </div>
  <div
    v-else
    ref="container"
    class="h-100 w-100"
  />
</template>
