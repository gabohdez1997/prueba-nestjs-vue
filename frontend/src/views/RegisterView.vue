<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

const handleRegister = async () => {
  error.value = ''
  
  // Validaciones locales
  if (!username.value || !password.value || !confirmPassword.value) {
    error.value = '⚠️ Por favor, completa todos los campos.'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = '⚠️ Las contraseñas no coinciden.'
    return
  }

  if (password.value.length < 6) {
    error.value = '⚠️ La contraseña debe tener al menos 6 caracteres.'
    return
  }

  loading.value = true

  try {
    await api.post('/auth/register', {
      username: username.value,
      password: password.value,
    })

    alert('¡Registro exitoso! Ahora puedes iniciar sesión.')
    router.push('/login')

  } catch (err: any) {
    console.error(err)
    // Manejo de errores del servidor
    error.value = err.response?.data?.message || '❌ Error al registrar usuario'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="register-container">
    <h1>Registro de Usuario</h1>

    <!-- AVISO DE DATOS TEMPORALES -->
    <div class="warning-box">
      ⚠️ <strong>Nota:</strong> Los usuarios se guardan en la memoria del servidor y 
      <strong>se borrarán si este se reinicia.</strong>
    </div>
    
    <form @submit.prevent="handleRegister" class="register-form">
      <div class="form-group">
        <label for="username">Usuario:</label>
        <input
          id="username"
          v-model="username"
          type="text"
          placeholder="Elige un usuario"
          :disabled="loading"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Mínimo 6 caracteres"
          :disabled="loading"
          required
        />
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirmar Contraseña:</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          placeholder="Repite la contraseña"
          :disabled="loading"
          required
        />
      </div>

      <!-- Caja de Error Estilizada -->
      <div v-if="error" class="error-alert">
        {{ error }}
      </div>

      <button type="submit" :disabled="loading" class="btn-register">
        <span v-if="loading">Registrando... ⏳</span>
        <span v-else>Crear Cuenta ➜</span>
      </button>
    </form>

    <p class="login-link">
      ¿Ya tienes cuenta? 
      <router-link to="/login">Inicia sesión aquí</router-link>
    </p>
  </div>
</template>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 0 auto;
}

.register-form {
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
  box-sizing: border-box;
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

/* Estilos para la cajita de aviso amarilla */
.warning-box {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
  padding: 10px;
  border-radius: 5px;
  font-size: 0.9rem;
  margin-bottom: 20px;
  text-align: center;
}

.btn-register {
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

.btn-register:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-register:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  margin-top: 15px;
  font-size: 0.9rem;
}
</style>