<script setup lang="ts">
// Página de inicio simple
</script>

<template>
  <div>
    <h1>Bienvenido a la Aplicación</h1>

    <p>Esta es una prueba técnica full-stack que incluye:</p>

    <ul>
      <li>Sistema de autenticación completo</li>
      <li>Rutas protegidas</li>
      <li>Integración con WebSockets</li>
      <li>Gestión de sprites de Pokémon</li>
    </ul>

    <div>
      <h2>Navegar:</h2>
      <router-link to="/login">
        <button>Iniciar Sesión</button>
      </router-link>

      <router-link to="/register">
        <button>Registrarse</button>
      </router-link>

      <router-link to="/dashboard">
        <button>Panel de Usuario (Requiere autenticación)</button>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
/* Sin estilos complejos */
div {
  margin: 10px 0;
}

h1,
h2 {
  margin: 15px 0 10px 0;
}

p {
  margin: 10px 0;
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
  margin: 5px;
}

a {
  text-decoration: none;
}
</style>
