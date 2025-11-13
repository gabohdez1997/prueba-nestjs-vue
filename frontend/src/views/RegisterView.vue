<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

const handleRegister = async () => {
  if (!username.value || !password.value || !confirmPassword.value) {
    error.value = 'Por favor, completa todos los campos'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  if (password.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await fetch('/api/auth/register', {
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
      // Registro exitoso, redirigir a login
      router.push('/login')
    } else {
      error.value = data.message || 'Error al registrar usuario'
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
    <h1>Registro de Usuario</h1>
    
    <form @submit.prevent="handleRegister">
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

      <div>
        <label for="confirmPassword">Confirmar Contraseña:</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          required
        />
      </div>

      <div v-if="error">
        <p style="color: red;">{{ error }}</p>
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Registrando...' : 'Registrarse' }}
      </button>
    </form>

    <p>
      ¿Ya tienes cuenta? 
      <router-link to="/login">Inicia sesión aquí</router-link>
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
