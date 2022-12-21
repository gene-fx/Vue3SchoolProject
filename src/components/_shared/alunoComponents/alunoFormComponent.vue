<template>
  <main class="content">
    <article class="content-title">
      <label><h3>Formulario Alunos</h3></label>
    </article>

    <article class="content-column-span-3">
      <div>
        <label>NOME</label>
        <input
          type="text"
          placeholder="Nome do aluno"
          v-model="alunoObj.nome"
        />
      </div>
      <div>
        <label>DATA DE NASC.</label>
        <input type="date" />
      </div>
      <div>
        <label>MATRICULA</label>
        <input
          type="text"
          placeholder="matricula"
          v-model="alunoObj.matricula"
        />
      </div>
    </article>

    <article class="checkbox-container">
      <label class="checkbox-title">Materias</label>
      <div v-for="materia in materias" :key="materia.id">
        <input
          class="checkboxes"
          type="checkbox"
          :value="materia.nome"
          v-model="materia.id"
        /><label class="labels">{{ materia.nome }}</label>
      </div>
    </article>

    <article class="content-column-span-3">
      <div>
        <label>SOBRENOME</label>
        <input
          type="text"
          placeholder="Sobrenome"
          v-model="alunoObj.sobrenome"
        />
      </div>
      <div>
        <label>PERIODO</label>
        <select>
          <option selected>---</option>
          <option>Manhã</option>
          <option>Tarde</option>
          <option>Noite</option>
        </select>
      </div>
      <div>
        <label>PROFESSOR</label>
        <select v-model="alunoObj.professorId" id="select">
          <option v-if="alunoObj.editing" selected>
            {{ professor.id }} - {{ professor.nome }}
          </option>
          <option
            v-for="professor in professores"
            :key="professor.id"
            :value="professor.id"
          >
            {{ professor.id }} - {{ professor.nome }}
          </option>
        </select>
      </div>
      <div>
        <input hidden type="text" v-model="alunoObj.id" />
        <input hidden type="text" v-model="alunoObj.editing" />
      </div>
    </article>

    <article class="content-btns">
      <button class="btn-save" @click="addAluno()">
        <font-awesome-icon icon="fa-solid fa-floppy-disk" /> SAVE
      </button>
      <button class="btn-clear" @click="clear()">
        CLEAR <font-awesome-icon icon="fa-solid fa-trash-arrow-up" />
      </button>
    </article>
  </main>
</template>

<script setup>
/**
 * todo: passar novos dados dos aluno para objetos.
 * todo -criar novos objetos de novos dados.
 * todo -tratar entradas em AddAluno()
 * todo -revisar esse codigo pq tem coisa sobrandos
 * todo -materias component
 * todo -mateias view ?
 * todo -professor view design: contera materias?
 * todo                         contera alunos?
 * todo                         split-screen?
 */

/**
 * *-----------------------------------------------------------------------variables
 */
import { ref, onBeforeMount, onMounted, inject, getCurrentInstance } from "vue";
import { useToast } from "vue-toastification";

const axios = inject("axios");

const emitter = inject("emitter");

const _this = getCurrentInstance();

const toast = useToast();

let materias = ref([
  {
    id: Number,
    nome: String,
    professorId: Number,
  },
]);

let alunoObj = ref({
  nome: "",
  sobrenome: "",
  matricula: "",
  editing: "",
  professorId: "",
});

let alunos = ref([
  {
    nome: String,
    sobrenome: String,
    matricula: String,
    editing: Boolean,
    professorId: String,
  },
]);

let professores = ref([
  {
    id: Number,
    nome: String,
    sobrenome: String,
    matricula: Number,
    editing: Boolean,
  },
]);

let professor = ref({
  id: Number,
  nome: String,
  sobrenome: String,
  matricula: Number,
  editing: Boolean,
});

/**
 * *-----------------------------------------------------------------------methods
 */
onBeforeMount(async () => {
  await getAlunoData();
  await getProfData();
  await getMateriaData();
});

onMounted(() => {
  emitter.on("editingAluno", async (evt) => {
    console.log("listner on");
    alunoObj.value = evt.eventContent;
    await axios
      .get(`/professores/${alunoObj.value.professorId}`)
      .then((res) => res.data)
      .then((res) => {
        professor.value = res;
      })
      .catch((err) => console.log(err.message));
  });
  _this?.proxy?.$forceUpdate();
});

async function getProfData() {
  await axios
    .get("/professores")
    .then((response) => response.data)
    .then((response) => (professores.value = response))
    .catch((err) => console.log(err.message));
  return professores.value;
}

async function getAlunoData() {
  await axios
    .get("/alunos")
    .then((response) => response.data)
    .then((response) => (alunos.value = response))
    .catch((err) => console.log(err.message));
  return alunos.value;
}

async function getMateriaData() {
  await axios("/materias")
    .then((res) => res.data)
    .then((res) => (materias.value = res))
    .catch((err) => console.log(err.message));
  return materias.value;
}

function clear() {
  alunoObj.value.nome = "";
  alunoObj.value.sobrenome = "";
  alunoObj.value.matricula = "";
  alunoObj.value.id = "";
  alunoObj.value.professorId = "";
  alunoObj.value.editing = "";
}

async function addAluno() {
  alunos.value = await getAlunoData();

  let reapetedOrEmptyEntry = false;

  if (
    (!alunoObj.value.nome ||
      !alunoObj.value.sobrenome ||
      !alunoObj.value.matricula) &&
    alunoObj.value.editing != true
  ) {
    toast.warning("Missing content");
    reapetedOrEmptyEntry = true;
    return { toast };
  } else {
    alunos.value.forEach((aluno) => {
      if (
        (
          String(alunoObj.value.nome).trim() +
          String(alunoObj.value.sobrenome).trim()
        ).toLowerCase() ==
          (
            String(aluno.nome).trim() + String(aluno.sobrenome).trim()
          ).toLowerCase() &&
        alunoObj.value.editing != true
      ) {
        toast.warning("Name registered already!");
        reapetedOrEmptyEntry = true;
        return { toast };
      }
      if (
        String(alunoObj.value.matricula).trim() ==
          String(aluno.matricula).trim() &&
        alunoObj.value.editing != true
      ) {
        toast.warning("Registration number already registered!");
        reapetedOrEmptyEntry = true;
        return { toast };
      }
    });

    if (!reapetedOrEmptyEntry) {
      if (alunoObj.value.editing == true) {
        if (
          !alunoObj.value.nome ||
          !alunoObj.value.sobrenome ||
          !alunoObj.value.matricula
        ) {
          toast.warning("Missing content");
          return { toast };
        } else {
          alunoObj.value.editing = false;
          await axios
            .patch(`/alunos/${alunoObj.value.id}`, alunoObj.value)
            .then((res) => console.log(res.data))
            .then(() => {
              toast.success("Edited");
              emitter.emit("addToTable");
            })
            .catch((err) => console.log(err.message));
        }
      } else {
        alunoObj.value.editing = false;
        alunoObj.value.professorId = alunoObj.value.professorId.slice(0, 3);
        alunoObj.value.professorId = alunoObj.value.professorId.trim();
        await axios
          .post(`/alunos/`, alunoObj.value)
          .then((res) => console.log(res.data))
          .then(() => {
            toast.success("Created");
            emitter.emit("addToTable");
          })
          .catch((err) => console.log(err.message));
      }
    }
    alunoObj.value.id = "";
    alunoObj.value.nome = "";
    alunoObj.value.sobrenome = "";
    alunoObj.value.matricula = "";
    alunoObj.value.editing = "";
    alunoObj.value.professorId = "";
  }
}
</script>

<style scoped>
.content {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1.5rem;
}

.content-title {
  grid-column: 1 / span 6;
}

.content-column-span-3 {
  grid-column: span 3;
}

.content-btns {
  grid-column: 1 / span 6;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
}

.checkbox-container {
  margin-left: auto;
  margin-right: auto;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(5, 1fr);
  width: 95%;
  grid-row: 3;
  grid-column: 1 / span 6;
  display: grid;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-title {
  grid-column: 1 / span 2;
  justify-content: center;
}

.checkbox-container > * {
  display: flex;
  margin: 0;
  padding: 0;
}

.checkboxes,
.labels {
  flex: 1;
  padding: 2px;
}

.show-table-btn {
  grid-column: 2 / span 4;
}
.show-table-box {
  grid-row: 6;
  grid-column: 1 / span 6;
  display: flex;
}

input,
select,
button {
  padding: 10px;
  width: 100%;
}

.btn-clear {
  width: 45%;
  color: orange;
}

.btn-clear:hover {
  background-color: orange;
  color: white;
}

.btn-save {
  color: rgb(1, 207, 1);
  width: 45%;
}

.btn-save:hover {
  background-color: rgb(1, 207, 1);
  color: white;
}

@media only screen and (max-width: 768px) {
  .content {
    display: flex;
    flex-direction: column;
  }
}
</style>
