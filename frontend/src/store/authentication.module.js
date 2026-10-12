import { authService } from '../services';
import router from '../router';
import { notify } from "@kyvg/vue3-notification";

const user = JSON.parse(localStorage.getItem('user'));

const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const authentication = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, { username, password }) {
      commit('loginRequest');
      authService.login(username, password).then(
        user => {
          commit('loginSuccess', user);
          router.push('/');
        },
        error => {
          commit('loginFailure');
          notify({
            title: 'Sign in failed',
            text: error?.response?.data?.message || 'Check your email and password',
            type: 'error',
          });
        }
      );
    },
    logout({ commit }) {
      authService.logout();
      commit('logout');
    }
  },
  mutations: {
    loginRequest(state) { state.status = { loggingIn: true }; },
    loginSuccess(state, user) { state.status = { loggedIn: true }; state.user = user; },
    loginFailure(state) { state.status = {}; state.user = null; },
    logout(state) { state.status = {}; state.user = null; }
  }
};
