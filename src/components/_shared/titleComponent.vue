<template>
  <div class="title-conteiner">
    <h1>{{ text.content }}</h1>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";

const props = defineProps({
  text: String,
});

let text = ref({
  content: props.text,
});
</script>

<style scoped>
.title-conteiner {
  padding-left: 50px;
  text-align: left;
  background-color: #2c3e50;
  width: 100%;
  height: 50px;
}
</style>
