<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { io, type Socket } from 'socket.io-client'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const user = ref<any>(null)
const loading = ref(true)
const error = ref('')
const debugInfo = ref('')

const socket = ref<Socket | null>(null)
const pokemons = ref<any[]>([])

const fetchUserProfile = async () => {
  const token = localStorage.getItem('accessToken')
  
  if (!token) {
    authStore.logout()
    return
  }

  try {
    const response = await api.get('/auth/me')
    user.value = response.data
    connectWebSocket(token)

  } catch (err: any) {
    console.error('Error fetching profile:', err)
    error.value = 'No se pudo cargar el perfil.'
    debugInfo.value = err.message || 'Error desconocido'
    
    if (err.response && err.response.status === 401) {
        authStore.logout()
    }
  } finally {
    loading.value = false
  }
}

const connectWebSocket = (token: string) => {
  const socketUrl = 'http://localhost:3000'
  
  socket.value = io(socketUrl, {
    extraHeaders: { Authorization: `Bearer ${token}` }
  })

  socket.value.on('connect', () => console.log('✅ Socket conectado'))
  
  socket.value.on('new_pokemon', (pokemonData) => {
    pokemons.value.unshift(pokemonData)
  })
}

const requestPokemon = () => {
  if (socket.value?.connected) {
    socket.value.emit('request_pokemon')
  } else {
    alert('No hay conexión con el servidor de sockets')
  }
}

const removePokemon = (index: number) => {
  pokemons.value.splice(index, 1)
}

const handleLogout = () => {
  if (socket.value) socket.value.disconnect()
  authStore.logout()
}

onMounted(() => {
  fetchUserProfile()
})

onUnmounted(() => {
  if (socket.value) socket.value.disconnect()
})
</script>

<template>
  <div>
    <h1>Panel de Usuario</h1>
    
    <div v-if="loading" class="status">
      <p>Cargando perfil...</p>
    </div>

    <div v-else-if="error" class="status error">
      <h3>⚠️ Ocurrió un error</h3>
      <p>{{ error }}</p>
      <button @click="handleLogout">Volver al Login</button>
    </div>

    <div v-else-if="user">
      <div class="user-info">
        <h2>Bienvenido, {{ user.username }}!</h2>
      </div>

      <hr>

      <div class="pokemon-container">
        <h3>⚡ Pokémon Sprites (WebSockets)</h3>
        <p>Presiona el botón para solicitar un sprite al servidor:</p>
        
        <button class="btn-green" @click="requestPokemon">
          ¡Traer Pokémon! 🎲
        </button>

        <p v-if="pokemons.length === 0" style="color: #888; font-style: italic; margin-top: 15px;">
          La galería está vacía. ¡Pide el primero!
        </p>

        <div class="gallery">
          <div v-for="(poke, index) in pokemons" :key="index" class="poke-card">
            <img :src="poke.sprite" :alt="poke.name">
            <div class="info">
              <span>#{{ poke.id }} <strong>{{ poke.name }}</strong></span>
            </div>
            <button class="btn-red" @click="removePokemon(index)">Eliminar</button>
          </div>
        </div>
      </div>

      <div class="actions">
        <button @click="handleLogout">Cerrar Sesión</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status { padding: 20px; background: #f0f0f0; border-radius: 5px; margin: 10px 0; }
.error { background: #ffe6e6; color: #cc0000; border: 1px solid #cc0000; }
.user-info { margin-bottom: 20px; }
.pokemon-container { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #eee; }
.gallery { display: flex; flex-wrap: wrap; gap: 20px; margin-top: 20px; justify-content: center; }

/* --- AQUI ESTAN LOS CAMBIOS DE TAMAÑO --- */
.poke-card { 
  background: white; 
  border: 1px solid #ddd; 
  border-radius: 12px; /* Bordes más redondeados */
  padding: 15px; 
  width: 200px; /* Hice la tarjeta más ancha (antes 120px) */
  text-align: center; 
  box-shadow: 0 4px 8px rgba(0,0,0,0.1); 
  transition: transform 0.2s;
}

.poke-card:hover {
  transform: translateY(-5px); /* Efecto de levitación al pasar el mouse */
}

.poke-card img { 
  width: 160px;  /* Imagen mucho más grande (antes 80px) */
  height: 160px; 
  object-fit: contain;
  image-rendering: pixelated; /* TRUCO: Hace que los pixeles se vean nítidos al escalar */
}

.poke-card .info { 
  font-size: 1.2em; /* Texto más grande */
  margin-bottom: 10px; 
  text-transform: capitalize; 
}
/* ---------------------------------------- */

.btn-green { background-color: #42b983; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 16px; }
.btn-green:hover { background-color: #3aa876; }
.btn-red { background-color: #ff4444; color: white; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer; font-size: 14px; margin-top: 5px; }
.actions { margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
button { padding: 8px 16px; margin-right: 10px; cursor: pointer; }
</style>