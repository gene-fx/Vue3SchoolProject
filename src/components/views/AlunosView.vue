<template>
  <div>
    <main>
      <div>
        <AsyncTitleComponent :text="'Alunos'" />
      </div>
      <div class="aluno-content">
        <div class="left-content">
          <article>
            <AsyncAlunoFormComponent />
          </article>
          <article v-if="toggle" class="toggle-content">
            <AsyncProfessorTable :showBtn="false" />
          </article>
        </div>
        <div class="right-content">
          <article class="row-span-1">
            <AsyncAlunoTableComponent :showBtn="true" />
          </article>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { defineAsyncComponent, onMounted, inject, ref } from "vue";

const AsyncTitleComponent = defineAsyncComponent(() =>
  import(
    /* webpackChunkName: 'titleComponent' */ "@/components/_shared/titleComponent.vue"
  )
);

const AsyncAlunoTableComponent = defineAsyncComponent(() =>
  import(
    /* webpackChunkName: 'alunoTableComponent' */ "@/components/_shared/alunoComponents/alunoTableComponent.vue"
  )
);

const AsyncAlunoFormComponent = defineAsyncComponent(() =>
  import(
    /* webpackChunkName: 'alunoFormComponent' */ "@/components/_shared/alunoComponents/alunoFormComponent.vue"
  )
);

const AsyncProfessorTable = defineAsyncComponent(() =>
  import(
    /* webpackChunkName: 'professorsTable' */ "@/components/_shared/professorComponents/professorTableComponent.vue"
  )
);

const emitter = inject("emitter");

let toggle = ref(false);

onMounted(() => {
  emitter.on("toggleTableProfContent", () => {
    toggle.value = !toggle.value;
  });
});
</script>

<style scoped>
.aluno-content {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.row-span-1 {
  grid-row: 1 / span 2;
}

.toggle-content {
  width: 90%;
  grid-row: 2;
  grid-column: 1;
}

@media only screen and (max-width: 768px) {
  .aluno-content {
    display: flex;
    flex-direction: column;
  }
}
</style>
