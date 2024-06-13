import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const key = 'cwo_web_channel'
const storage = (() => {
  const store = window.localStorage
  return {
    get() {
      try {
        const result = Number.parseInt(store.getItem(key) || '')
        if (Number.isNaN(result))
          return 7015
        else
          return result
      }
      catch (e) {
        return 7015
      }
    },
    set(value: number) {
      try {
        store.setItem(key, value.toString())
      }
      catch (e) {

      }
    },
  }
})()

export const useConfigStore = defineStore('config', () => {
  const mute = ref(false)
  const channel = ref(storage.get())
  watch(channel, storage.set)

  return {
    mute,
    channel,
  }
})
