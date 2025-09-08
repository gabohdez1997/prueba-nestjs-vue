<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = ref<any>(null)
const loading = ref(true)
const error = ref('')

const fetchUserProfile = async () => {
  const token = localStorage.getItem('accessToken')
  
  if (!token) {
    router.push('/login')
    return
  }

  try {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const userData = await response.json()
      user.value = userData
    } else {
      // Token inválido o expirado
      localStorage.removeItem('accessToken')
      router.push('/login')
    }
  } catch (err) {
    error.value = 'Error al cargar perfil de usuario'
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  localStorage.removeItem('accessToken')
  router.push('/login')
}

onMounted(() => {
  fetchUserProfile()
})
</script>

<template>
  <div>
    <h1>Panel de Usuario</h1>
    
    <div v-if="loading">
      <p>Cargando...</p>
    </div>

    <div v-else-if="error">
      <p style="color: red;">{{ error }}</p>
    </div>

    <div v-else-if="user">
      <h2>Bienvenido, {{ user.username }}!</h2>
      
      <div>
        <h3>Información del Usuario:</h3>
        <p><strong>ID:</strong> {{ user.userId || user.id }}</p>
        <p><strong>Usuario:</strong> {{ user.username }}</p>
      </div>

      <div>
        <h3>Funcionalidades Disponibles:</h3>
        <ul>
          <li>Ver perfil de usuario</li>
          <li>Acceso a rutas protegidas</li>
          <li>Gestión de sprites de Pokémon</li>
        </ul>
      </div>

      <div>
        <h3>Sección de Pokémon Sprites:</h3>
        <p><em>Esta sección estará disponible una vez implementado el sistema de WebSockets</em></p>
        <button disabled>Descargar Sprite de Pokémon</button>
      </div>

      <button @click="handleLogout">
        Cerrar Sesión
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Sin estilos complejos como solicitado */
div {
  margin: 10px 0;
}

h1, h2, h3 {
  margin: 15px 0 10px 0;
}

p {
  margin: 5px 0;
}

ul {
  margin: 10px 0;
  padding-left: 20px;
}

li {
  margin: 5px 0;
}

button {
  padding: 8px 16px;
  margin: 10px 10px 10px 0;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
