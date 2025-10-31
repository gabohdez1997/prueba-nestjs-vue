<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <button
          @click="handleLogout"
          class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- User Info Card -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">Información del Usuario</h2>
        <div v-if="authStore.user" class="space-y-2">
          <p class="text-gray-700"><strong>ID:</strong> {{ authStore.user.id }}</p>
          <p class="text-gray-700"><strong>Usuario:</strong> {{ authStore.user.username }}</p>
        </div>
        <div v-else class="text-gray-500">Cargando información...</div>
      </div>

      <!-- Pokemon Sprites Section -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">Galería de Pokémon</h2>
          <button
            @click="getRandomSprite"
            :disabled="!isSocketConnected || isLoadingSprite"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span v-if="!isLoadingSprite">🎲 Obtener Sprite</span>
            <span v-else>⏳ Cargando...</span>
          </button>
        </div>

        <!-- Connection Status -->
        <div class="mb-4">
          <span
            :class="[
              'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm',
              isSocketConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
            ]"
          >
            <span
              class="w-2 h-2 rounded-full"
              :class="isSocketConnected ? 'bg-green-600' : 'bg-red-600'"
            ></span>
            {{ isSocketConnected ? 'Conectado' : 'Desconectado' }}
          </span>
        </div>

        <!-- Sprites Grid -->
        <div
          v-if="sprites.length > 0"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          <div
            v-for="sprite in sprites"
            :key="sprite.id"
            class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-lg transition group relative"
          >
            <img :src="sprite.spriteUrl" :alt="sprite.name" class="w-full h-24 object-contain" />
            <p class="text-center text-sm font-medium text-gray-700 mt-2 capitalize">
              {{ sprite.name }}
            </p>
            <p class="text-center text-xs text-gray-500">#{{ sprite.pokemonId }}</p>
            <button
              @click="deleteSprite(sprite.id)"
              class="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full hover:bg-red-600 transition opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        </div>

        <div v-else class="text-center py-12 text-gray-500">
          <p class="text-lg">No tienes sprites aún</p>
          <p class="text-sm">Haz clic en "Obtener Sprite" para comenzar</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import socketService from '../services/socket'

interface Sprite {
  id: number
  pokemonId: number
  name: string
  spriteUrl: string
}

const router = useRouter()
const authStore = useAuthStore()

const sprites = ref<Sprite[]>([])
const isSocketConnected = ref(false)
const isLoadingSprite = ref(false)

const handleLogout = () => {
  socketService.disconnect()
  authStore.logout()
  router.push('/login')
}

const getRandomSprite = () => {
  const socket = socketService.getSocket()
  if (socket && isSocketConnected.value) {
    isLoadingSprite.value = true
    socket.emit('get-pokemon-sprite')
  }
}

const deleteSprite = (spriteId: number) => {
  const socket = socketService.getSocket()
  if (socket && isSocketConnected.value) {
    socket.emit('delete-sprite', { spriteId })
  }
}

onMounted(async () => {
  // Fetch user info
  if (!authStore.user) {
    await authStore.fetchUser()
  }

  // Connect WebSocket
  if (authStore.token) {
    const socket = socketService.connect(authStore.token)

    socket.on('connect', () => {
      isSocketConnected.value = true
      socket.emit('get-user-sprites')
    })

    socket.on('disconnect', () => {
      isSocketConnected.value = false
    })

    socket.on('user-sprites', (data: Sprite[]) => {
      sprites.value = data
    })

    socket.on('pokemon-sprite', (sprite: Sprite) => {
      sprites.value.unshift(sprite)
      isLoadingSprite.value = false
    })

    socket.on('sprite-deleted', (data: { id: number }) => {
      sprites.value = sprites.value.filter((s) => s.id !== data.id)
    })

    socket.on('error', (error: { message: string }) => {
      console.error('Socket error:', error.message)
      isLoadingSprite.value = false
      alert(error.message)
    })
  }
})

onUnmounted(() => {
  socketService.disconnect()
})
</script>
