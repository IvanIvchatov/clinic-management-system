import { userService } from '../services';
import { notify } from "@kyvg/vue3-notification";

export const users = {
    namespaced: true,
    state: () => ({
        users: []
    }),
    actions: {
        async initUsers({ commit }) {
            const users = await userService.getAll()
            commit('setUsers',users)
        },

        async add({commit},user) {
            try{
                const userData = await userService.add(user)
                commit('add',userData)
                notify({
                    title: "User",
                    text: "Юзер добавлен",
                    type: "success",
                });
            }catch{
                notify({
                    title: "User",
                    text: 'Ошибка добавления',
                    type: "error",
                });
            }
        },
        async edit({commit},user) {
            try{
                const userData = await userService.edit(user)
                commit('edit',userData)
                notify({
                    title: "User",
                    text: "Юзер отредактирован",
                    type: "success",
                });
            }catch{
                notify({
                    title: "User",
                    text: 'Ошибка редактирования',
                    type: "error",
                });
            }
        },
    },
    mutations: {
        setUsers(state,users){
            state.users = users
        },
        add(state,user){
            state.users.push(user)
        },
        edit(state,user){
            state.users[state.users.findIndex(item => item.id == user.id)] = user
        },
        setCenters(state,centers){
            state.centers[state.centers.findIndex(item =>item.id ==centers.id)] =centers
        }
    }
}
