<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const user = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    // Cumpliendo el requisito: Hacemos GET a /auth/me
    const response = await api.get('/auth/me')
    user.value = response.data
  } catch (error) {
    console.error(error)
    // Si falla (token vencido), sacamos al usuario
    authStore.logout()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="profile-container">
    <h1>Mi Perfil</h1>

    <div v-if="loading">Cargando datos...</div>

    <div v-else-if="user" class="card">
      <div class="avatar-placeholder">
        {{ user.username.charAt(0).toUpperCase() }}
      </div>
      
      <div class="info">
        <p class="label">Nombre de Usuario:</p>
        <p class="value">{{ user.username }}</p>
        
        <p class="label">ID de Usuario:</p>
        <p class="value">#{{ user.userId || user.id }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 500px;
  margin: 0 auto;
}

.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-top: 20px;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  background-color: #007bff;
  color: white;
  border-radius: 50%;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px auto;
  font-weight: bold;
}

.label {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.value {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>