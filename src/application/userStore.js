import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userName: '',
    userEmail: '',
    userPhoto: '',
    firstName: '',
    lastName: '',
    email: '',
    contact: '',
    position: '',
  }),
  actions: {
    setUserInfo(profile) {
      this.userName = profile.userName || '';
      this.userEmail = profile.userEmail || '';
      this.userPhoto = profile.userPhoto || '';
      this.firstName = profile.firstName || '';
      this.lastName = profile.lastName || '';
      this.email = profile.email || '';
      this.contact = profile.contact || '';
      this.position = profile.position || '';
    },
    updateUserInfo(profile) {
      Object.assign(this, profile);
    }
  }
});
