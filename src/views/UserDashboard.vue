<template>
  <div>
    <h1>Dashboard</h1>
    <p v-if="user">hey, {{ user.displayName }}!</p>
    <p v-else>You are not logged.</p>
    <p>Email: {{ user ? user.email : 'None' }}</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default {
  name: 'UserDashboard',
  data() {
    return {
      user: null
    };
  },
  mounted() {
  this.user = auth.currentUser;
  if (!this.user) {
    this.$router.push('/login');
  }
},
  methods: {
    async logout() {
      try {
        await signOut(auth);
        this.$router.push('/login');
      } catch (error) {
        console.error('error while logout:', error);
      }
    }
  }
};
</script>
