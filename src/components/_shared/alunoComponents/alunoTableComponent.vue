<template>
  <div>
    <label><h3>Tabela Alunos</h3></label>
    <table>
      <thead>
        <tr>
          <td>Nome</td>
          <td>Matricula</td>
          <td v-if="btnShow.value">Opções</td>
        </tr>
      </thead>
      <tbody v-if="!loading">
        <tr v-for="alunoObj in alunos" :key="alunoObj.id">
          <td data-label="Nome">
            {{ alunoObj.nome }} {{ alunoObj.sobrenome }}
          </td>
          <td data-label="Matricula">{{ alunoObj.matricula }}</td>
          <td data-label="Opções" v-if="btnShow.value">
            <button @click="deleteAluno(alunoObj)" class="btn-danger">
              <font-awesome-icon icon="fa-solid fa-trash" />
            </button>
            <button @click="editingAluno(alunoObj.id)" class="btn-edit">
              <font-awesome-icon icon="fa-solid fa-pen" />
            </button>
          </td>
        </tr>
      </tbody>
      <label v-else>Loading...</label>
    </table>
  </div>
</template>

<script setup>
/**
 * *-----------------------------------------------------------------------variables
 */
import {
  ref,
  onBeforeMount,
  onMounted,
  inject,
  getCurrentInstance,
  defineProps,
} from "vue";
import { useToast } from "vue-toastification";

const axios = inject("axios");
const swal = inject("$swal");
const emitter = inject("emitter");
const _this = getCurrentInstance();

const toast = useToast();

const props = defineProps({
  showBtn: Boolean,
});

let btnShow = ref({
  value: props.showBtn,
  default: true,
});

let loading = false;

let alunoObj = ref({
  nome: String,
  sobrenome: String,
  matricula: String,
  editing: Boolean,
  professorId: String,
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

/**
 * *-----------------------------------------------------------------------methods
 */
onBeforeMount(async () => {
  await getAlunoData();
});

onMounted(async () => {
  emitter.on("addToTable", async function () {
    getAlunoData();
    _this?.proxy?.$forceUpdate();
  });
});

async function getAlunoData() {
  await axios
    .get("/alunos")
    .then((loading = true))
    .then((response) => response.data)
    .then((response) => (alunos.value = response))
    .catch((err) => console.log(err.message));
  loading = false;
  return alunos.value;
}

async function editingAluno(id) {
  await axios
    .get(`/alunos/${id}`)
    .then((res) => res.data)
    .then((res) => (alunoObj.value = res))
    .then(async () => {
      emitter.emit("editingAluno", {
        eventContent: {
          nome: alunoObj.value.nome,
          sobrenome: alunoObj.value.sobrenome,
          matricula: alunoObj.value.matricula,
          id: alunoObj.value.id,
          editing: true,
          professorId: alunoObj.value.professorId,
        },
      });
    })
    .catch((err) => console.log(err.message));
}

async function deleteAluno(aluno) {
  await swal
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        await axios
          .delete(`/alunos/${aluno.id}`)
          .then(() => {
            let index = alunos.value.indexOf(aluno);
            console.log(index);
            alunos.value.splice(index, 1);
            toast.success("Deleted");

            return { toast };
          })
          .catch((err) => console.log(err.message));
      }
    });
}
</script>

<style scoped>
/**
 * *-----------------------------------------------------------------------style
 */
table {
  width: 100%;
  border: none;
  border-radius: 5px;
  border-collapse: collapse;
}

thead {
  font-weight: bold;
  background-color: #1b2733;
  color: rgb(0, 195, 255);
}

tbody tr:nth-child(odd) {
  background-color: #2c3e50;
  font-size: 0.9em;
  text-align: center;
}

tbody tr:nth-child(even) {
  background-color: #22303f;
  font-size: 0.9em;
  text-align: center;
}

.btn-edit {
  color: blue;
  width: 30px;
  height: 30px;
}

.btn-edit:hover {
  background-color: blue;
  color: white;
}

.btn-danger {
  background-color: white;
  color: red;
  width: 30px;
  height: 30px;
}

.btn-danger:hover {
  background-color: red;
  color: white;
}

/*----------------- LOCAL BREAK POINTS */
@media only screen and (max-width: 500px) {
  thead {
    display: none;
  }

  table,
  tbody,
  tr,
  td {
    display: block;
    width: 100%;
  }

  tr {
    padding-top: 10px;
    margin-top: 5px;
  }

  td {
    position: absolute;
    text-align: right;
    position: relative;
    border-collapse: collapse;
    padding-top: 5px;
    right: 0;
  }

  td::before {
    display: block;
    content: attr(data-label);
    left: 0;
    width: 50%;
    padding-left: 15px;
    font-weight: bold;
    text-align: left;
    color: rgb(0, 195, 255);
  }

  td:hover {
    border: 1px solid white;
  }

  .btn-danger,
  .btn-edit {
    display: inline;
    justify-content: center;
    align-items: center;
    height: 30px;
    width: 70px;
    font-size: 10px;
  }
}
</style>
