import { defineStore } from "pinia"

export const useFetchingErrorModal = defineStore('fetching-error-modal', {
  state() {
    return {
      visible: false as boolean,
      contents: "" as string,
      title: "" as string,
    }
  },
})