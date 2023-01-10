import { defineStore } from 'pinia';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    name: 'John',
    age: '20',
    pageId: null,
  }),
});
