import { authService } from '../services';
import  router  from '../router';
import { notify } from "@kyvg/vue3-notification";

const user = JSON.parse(localStorage.getItem('user'));

const initialState = user
    ? { status: { loggedIn: true }, user }
    : { status: {loggedIn: false }, user: null };

export const authentication = {
    namespaced: true,
    state: initialState,
    actions: {
        login({commit }, { username, password }) {
            authService.login(username, password)
                .then(
                    user => {
                        commit('loginSuccess', user);
                        router.push('/');
                        notify({
                            title: "Authorization",
                            text: "you are logged in",
                            type: "success",
                        });
                    },
                    error => {
                        commit('loginFailure', error);
                        notify({
                            title: "Authorization",
                            text: error.response.data.message,
                            type: "error",
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
        loginSuccess(state, user) {
            state.status = { loggedIn: true };
            state.user = user;
        },
        loginFailure(state) {
            state.status = {};
            state.user = null;
        },
        logout(state) {
            state.status = {};
            state.user = null;
        }
    }
}
