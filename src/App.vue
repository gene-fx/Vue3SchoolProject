<template>
  <div class="header">
    <navBarComponent />
  </div>

  <div class="content">
    <router-view />
  </div>
</template>

<script></script>

<style>
@import url(https://fonts.googleapis.com/css?family=Urbanist);
#app {
}

body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: "Urbanist";
  font-size: 1.1em;
  background-color: #2c3e50;
  color: white;
  text-align: center;
  justify-content: center;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

*::-webkit-scrollbar {
  width: 6px;
}

*::-webkit-scrollbar-track {
  background: #2c3e50;
}

*::-webkit-scrollbar-thumb {
  background-color: black;
  border-radius: 20px;
}

.header {
  width: 100%;
  display: grid;
  top: 0;
}

.header > * {
  flex: 1;
}

.content {
  position: static;
  margin-left: auto;
  margin-right: auto;
  width: 95%;
}

button,
input,
select {
  border-radius: 5px;
  border: 1px solid black;
}
</style>
