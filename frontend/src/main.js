import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import  store  from "./store";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from './plugins/font-awesome'
import Notifications from '@kyvg/vue3-notification'
// Importing the global css file
import "@/css/style.css"

createApp(App)
  .use(router)
  .use(store)
  .use(Notifications)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
