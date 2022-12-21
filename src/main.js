import { createApp } from "vue";
import App from "./App.vue";
import axios from "axios";
import VueAxios from "vue-axios";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import SvgIcon from "vue3-icon";
import router from "@/components/router/index";
import titleComponent from "@/components/_shared/titleComponent.vue";
import navBarComponent from "@/components/_shared/navBarComponent.vue";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import mitt from "mitt";

//--------- FontAwesome imports

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";
/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
/* import specific icons */
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { faTrashArrowUp } from "@fortawesome/free-solid-svg-icons";
faTrashArrowUp;
/* add icons to the library */
library.add(faTrash);
library.add(faPen);
library.add(faFloppyDisk);
library.add(faTrashArrowUp);

const app = createApp(App);

const emitter = mitt();

axios.defaults.baseURL = 'http://192.168.1.7:3000';

const swalOptions = {
  background: "#1e2a36",
  color: "#fff",
  confirmButtonColor: "#00cc00",
  cancelButtonColor: "#d33",
};

const toastOptions = {
  position: "top-right",
  timeout: 4000,
  closeOnClick: false,
  pauseOnFocusLoss: false,
  pauseOnHover: false,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: false,
  icon: true,
  rtl: false,
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true,
};

app.use(VueAxios, axios);
app.provide("emitter", emitter);
app.provide("axios", app.config.globalProperties.axios);
app.component("navBarComponent", navBarComponent);
app.component("titleComponent", titleComponent);
app.component("svg-icon", SvgIcon);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(Toast, toastOptions);
app.use(router);
app.use(VueSweetalert2, swalOptions);
app.mount("#app");
