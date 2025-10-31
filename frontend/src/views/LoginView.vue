<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 px-4"
  >
    <div class="max-w-md w-full bg-white rounded-lg shadow-2xl p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Bienvenido</h1>
        <p class="text-gray-600">Inicia sesión para continuar</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Username -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
            Usuario
          </label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="Ingresa tu usuario"
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="Ingresa tu contraseña"
          />
        </div>

        <!-- Error Message -->
        <div
          v-if="authStore.error"
          class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
        >
          {{ authStore.error }}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="authStore.isLoading"
          class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <span v-if="!authStore.isLoading">Iniciar Sesión</span>
          <span v-else>Cargando...</span>
        </button>
      </form>

      <!-- Info -->
      <div class="mt-6 p-4 bg-blue-50 rounded-lg">
        <p class="text-sm text-gray-700 text-center">
          <strong>Usuario de prueba:</strong><br />
          Usuario: admin<br />
          Contraseña: admin123
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  username: '',
  password: '',
})

const handleSubmit = async () => {
  const success = await authStore.login(form.username, form.password)

  if (success) {
    router.push('/profile')
  }
}
</script>
