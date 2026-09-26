import { createApp } from "vue";
import App from "./App.vue";
import axios from "axios";
import router from "./router";
import  store  from "./store";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from './plugins/font-awesome'
import Notifications from '@kyvg/vue3-notification'
// Importing the global css file
import "@/css/style.css"

// Attach the JWT from the logged-in user to every API request
axios.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

createApp(App)
  .use(router)
  .use(store)
  .use(Notifications)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
