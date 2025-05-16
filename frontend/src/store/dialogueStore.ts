import { defineStore } from "pinia";

export const useDialogueStore = defineStore('modal-store', {
  state: () => ({
    isModalVisible: false as boolean,
    modalContents: '' as string,
    modalTitle: '' as string
  }),
})