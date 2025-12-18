<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // 1. Importamos la tienda

const router = useRouter()
const authStore = useAuthStore() // 2. La usamos

const handleLogout = () => {
  authStore.logout() // Usamos la acción de la tienda
}
</script>

<template>
  <div id="app">
    <!-- Navegación -->
    <nav>
      <router-link to="/">Inicio</router-link>
      
      <!-- 3. Usamos la propiedad reactiva de la tienda -->
      <template v-if="!authStore.isAuthenticated">
        <router-link to="/login">Login</router-link>
        <router-link to="/register">Registro</router-link>
      </template>
      
      <template v-else>
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link to="/profile">Mi Perfil</router-link>
        <a href="#" @click.prevent="handleLogout">Cerrar Sesión</a>
      </template>
    </nav>

    <!-- Contenido principal -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

nav {
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

nav a {
  margin-right: 15px;
  text-decoration: none;
  color: #007bff;
}

nav a:hover {
  text-decoration: underline;
}

nav a.router-link-active {
  font-weight: bold;
  color: #0056b3;
}

main {
  padding: 20px 0;
}
</style>