<template>
  <div>
    <label><h3>Tabela Professores</h3></label>
    <table>
      <thead>
        <tr>
          <td>Nome</td>
          <td>Matricula</td>
          <td v-if="btnShow.value">Opções</td>
        </tr>
      </thead>
      <tbody v-if="!loading">
        <tr v-for="professorObj in professores" :key="professorObj.id">
          <td data-label="Nome">
            {{ professorObj.nome }} {{ professorObj.sobrenome }}
          </td>
          <td data-label="Matricula">{{ professorObj.matricula }}</td>
          <td data-label="Opções" v-if="btnShow.value">
            <button @click="deleteAluno(professorObj)" class="btn-danger">
              <font-awesome-icon icon="fa-solid fa-trash" />
            </button>
            <button @click="editingAluno(professorObj.id)" class="btn-edit">
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

let loading = false;

const props = defineProps({
  showBtn: Boolean,
});

let btnShow = ref({
  value: props.showBtn,
});

let professorObj = ref({
  nome: String,
  sobrenome: String,
  matricula: String,
  editing: Boolean,
});

let professores = ref([
  {
    nome: String,
    sobrenome: String,
    matricula: String,
    editing: Boolean,
  },
]);

/**
 * *-----------------------------------------------------------------------methods
 */

/**
 * *------------------------------life cycle methods
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

/**
 * *------------------------------data methods
 */
async function getAlunoData() {
  //GET
  await axios
    .get("/professores")
    .then((loading = true))
    .then((response) => response.data)
    .then((response) => (professores.value = response))
    .catch((err) => console.log(err.message));
  loading = false;
  return professores.value;
}

async function editingAluno(id) {
  //PATCH
  await axios
    .get(`/professores/${id}`)
    .then((res) => res.data)
    .then((res) => (professorObj.value = res))
    .then(async () => {
      emitter.emit("editingAluno", {
        eventContent: {
          nome: professorObj.value.nome,
          sobrenome: professorObj.value.sobrenome,
          matricula: professorObj.value.matricula,
          id: professorObj.value.id,
          editing: true,
          professorId: professorObj.value.professorId,
        },
      });
    });
}

async function deleteAluno(aluno) {
  //REMOVE
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
        await axios.delete(`/professores/${aluno.id}`).then(() => {
          let index = professores.value.indexOf(aluno);
          console.log(index);
          professores.value.splice(index, 1);
          toast.success("Deleted");

          return { toast };
        });
      }
    });
}
</script>

<style scoped>
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
