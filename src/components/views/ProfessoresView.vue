<template>
  <div>
    <main>
      <div>
        <AsyncTitleComponent :text="'Professores'" />
      </div>
      <div class="professor-content">
        <article>
          <!-- <AsyncAProfessorFormComponent /> -->
        </article>
        <article class="row-span-1">
          <AsyncProfessorTableComponent />
        </article>
        <article v-if="toggle" class="toggle-content">
          <AsyncAlunoTable />
        </article>
      </div>
    </main>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from "vue";

const AsyncTitleComponent = defineAsyncComponent(() =>
  import(
    /* webpackChunkName: 'titleComponent' */ "@/components/_shared/titleComponent.vue"
  )
);

const AsyncProfessorTableComponent = defineAsyncComponent(() =>
  import(
    /* webpackChunkName: 'professorTableComponent' */ "@/components/_shared/professorComponents/professorTableComponent.vue"
  )
);

// const AsyncAlunoProfessorComponent = defineAsyncComponent(() =>
//   import(
//     /* webpackChunkName: 'professorFormComponent' */ "@/components/_shared/professorComponents/professorFormComponent.vue"
//   )
// );

const AsyncAlunoTable = defineAsyncComponent(() =>
  import(
    /* webpackChunkName: 'alunoTable' */ "@/components/_shared/alunoComponents/alunoTableComponent.vue"
  )
);

// const emitter = inject("emitter");

// let toggle = false;

// onMounted(() => {
//   emitter.on("toggleTableProfContent", (press) => {
//     toggle = !toggle;
//     console.log("TOGGLE " + toggle);
//   });
// });
</script>

<style scoped>
.professor-content {
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
  .professor-content {
    display: flex;
    flex-direction: column;
  }
}
</style>
