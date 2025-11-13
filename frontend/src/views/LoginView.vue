<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = 'Por favor, completa todos los campos'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      // Guardar token en localStorage
      localStorage.setItem('accessToken', data.accessToken)
      
      // Redirigir a página protegida
      router.push('/dashboard')
    } else {
      error.value = data.message || 'Error al iniciar sesión'
    }
  } catch (err) {
    error.value = 'Error de conexión'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h1>Iniciar Sesión</h1>
    
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">Usuario:</label>
        <input
          id="username"
          v-model="username"
          type="text"
          required
        />
      </div>

      <div>
        <label for="password">Contraseña:</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
        />
      </div>

      <div v-if="error">
        <p style="color: red;">{{ error }}</p>
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
      </button>
    </form>

    <p>
      ¿No tienes cuenta? 
      <router-link to="/register">Regístrate aquí</router-link>
    </p>
  </div>
</template>

<style scoped>
/* Sin estilos como solicitado */
div {
  margin: 10px 0;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 200px;
  padding: 5px;
  margin-bottom: 10px;
}

button {
  padding: 8px 16px;
  margin: 10px 0;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
