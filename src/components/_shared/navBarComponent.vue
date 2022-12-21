<template>
  <div>
    <div class="nav-container">
      <router-link to="/">Home</router-link>
      <router-link to="/About">Sobre</router-link>
      <router-link to="/Alunos">Alunos</router-link>
      <router-link to="/Professores">Professores</router-link>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.nav-container {
  display: flex;
  background-color: rgb(39, 39, 39);
  padding: 10px;
}

.nav-container > * {
  color: white;
  text-decoration: none;
  padding: 10px;
  flex: 1;
}

.nav-container > *:hover {
  border: 1px solid white;
  padding: 9px;
}
</style>
