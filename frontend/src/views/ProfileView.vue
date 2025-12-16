<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router'; 
import { useAuthStore } from '@/stores/auth';


const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  if (!authStore.user) {
    authStore.fetchProfile();
  }
});

const logout = () => {
    authStore.logout();
    router.push('/LoginView');
};
</script>

<template>
  <div>
    <h2>Perfil de Usuario</h2>
    <div v-if="authStore.user">
      <p>Bienvenido, <strong>{{ authStore.user.username }}</strong>!</p>
      <p>ID de Usuario (userID): <strong>{{ authStore.user.userId }}</strong></p>
    </div>
    <div v-else>
      <p>Cargando información del perfil...</p>
    </div>
    
    <button @click="logout">Cerrar Sesión</button>
  </div>
</template>