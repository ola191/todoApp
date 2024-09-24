<template>
  <div class="flex row w-screen h-screen">
    <div class="flex col h-full w-1/4 border-r-2 flex-col items-center">
      <div class="w-full h-14 flex row items-end gap-x-2 px-0 mt-4">
        <div class="flex ">
          <a class="btn-floating btn-medium waves-effect waves-light">
          <img 
            v-if="user && user.photoURL" 
            :src="user.photoURL" 
            alt="Profile Picture" 
            class="rounded-full"
            style="width: 100%; height: 100%; object-fit: cover;"
          />
          <i v-else class="material-icons">person</i>
        </a>
        </div>
        <div class="w-full flex items-start flex-col">
          <div class="flex" v-if="user">{{ user.displayName }}</div>
          <div class="flex" v-else>Not logged in</div>
          <div class="text-wrap text-sm">{{ user ? user.email : 'No email' }}</div>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <ul class="collapsible">
          <li>
            <div class="flex items-center px-4 gap-x-6">
              <i class="material-icons">search</i>
              <input type="search"></div>
          </li>
        </ul>
        <ul class="collapsible">
          <li>
            <div class="collapsible-header">
              <i class="material-icons">today</i>
              Today
              <span class="badge teal white-text">4</span></div>
          </li>
          <li>
            <div class="collapsible-header">
              <i class="material-icons">next_week</i>
              Tomorrow
              <span class="badge teal white-text">1</span></div>
          </li>
          <li>
            <div class="collapsible-header">
              <i class="material-icons">all_inclusive</i>
              All
              <span class="badge teal white-text">5</span></div>
          </li>
        </ul>
        <ul class="collapsible">
          <li>
            <div class="collapsible-header">
              <i class="material-icons">add</i>
              New list
              <span class=""></span></div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';

export default {
  name: 'UserDashboard',
  data() {
    return {
      user: null
    };
  },
  mounted() {
    this.unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
      } else {
        this.$router.push('/login');
      }
    });
  },
  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    async logout() {
      try {
        await signOut(auth);
        this.$router.push('/login');
      } catch (error) {
        console.error('Error while logging out:', error);
      }
    }
  }
};
</script>
