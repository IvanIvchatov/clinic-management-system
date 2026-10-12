import { createApp } from "vue";
import App from "./App.vue";
import axios from "axios";
import router from "./router";
import  store  from "./store";
import { FontAwesomeIcon } from './plugins/font-awesome'
import Notifications from '@kyvg/vue3-notification'
// Global styles (design tokens + components)
import "@/css/app.css"

// Attach the JWT from the logged-in user to every API request
axios.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Expired or invalid token -> back to the login page
axios.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401 && router.currentRoute.value.path !== '/login') {
      store.dispatch('authentication/logout');
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

createApp(App)
  .use(router)
  .use(store)
  .use(Notifications)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
