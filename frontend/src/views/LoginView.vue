<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  // Limpiamos errores previos
  error.value = ''

  // 1. Validaciones locales (Frontend)
  if (!username.value || !password.value) {
    error.value = '⚠️ Por favor, completa todos los campos.'
    return
  }

  loading.value = true

  try {
    // Intentamos loguear
    await authStore.login({
      username: username.value,
      password: password.value,
    })

    // Si no lanza error, redirigimos
    router.push('/dashboard')

  } catch (err: any) {
    console.error("Error de login:", err)

    // 2. Manejo inteligente de errores
    if (authStore.loginError) {
        // Si el Store capturó un mensaje del backend (ej: "Credenciales Invalidas")
        error.value = `❌ ${authStore.loginError}`
    } else if (err.message === 'Network Error' || !err.response) {
        // Si no hubo respuesta del servidor (Backend apagado)
        error.value = '🔌 No se pudo conectar con el servidor. Intenta más tarde.'
    } else {
        // Cualquier otro error
        error.value = '❌ Ocurrió un error inesperado al iniciar sesión.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <h1>Iniciar Sesión</h1>
    
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="username">Usuario:</label>
        <input
          id="username"
          v-model="username"
          type="text"
          placeholder="Ej: sofia"
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="******"
          :disabled="loading"
        />
      </div>

      <!-- Caja de Error Mejorada -->
      <div v-if="error" class="error-alert">
        {{ error }}
      </div>

      <button type="submit" :disabled="loading" class="btn-login">
        <span v-if="loading">Verificando... ⏳</span>
        <span v-else>Entrar ➜</span>
      </button>
    </form>

    <p class="register-link">
      ¿No tienes cuenta? 
      <router-link to="/register">Regístrate aquí</router-link>
    </p>
  </div>
</template>

<style scoped>
/* Estilos un poco más limpios para que se vea mejor la validación */
.login-container {
  max-width: 400px;
  margin: 0 auto;
}

.login-form {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #eee;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; /* Para que el padding no rompa el ancho */
}

input:focus {
  border-color: #007bff;
  outline: none;
}

/* Estilo para la alerta de error */
.error-alert {
  background-color: #ffe6e6;
  color: #d8000c;
  border: 1px solid #cc0000;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.btn-login {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-login:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-login:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.register-link {
  text-align: center;
  margin-top: 15px;
  font-size: 0.9rem;
}
</style>