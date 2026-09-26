import {serviceCollaborator} from "../services"
import {notify} from "@kyvg/vue3-notification";
// import {notify} from "@kyvg/vue3-notification";

export const collaborators = {
    namespaced: true,
    state: () => ({
        collaborators :[]
    }),
    actions: {
        async initCollaborators ({commit}) {
            const collaborators  = await serviceCollaborator.getAll()
            debugger
            commit('setCollaborators',collaborators )
        },

        async add({commit},collaborator) {
            try{
                debugger
                const collaboratorData = await serviceCollaborator.add(collaborator)
                commit('add',collaboratorData)
                notify({
                    title: "collaborator",
                    text: "collaborator добавлен",
                    type: "success",
                });
            }catch{
                debugger
                notify({
                    title: "collaborator",
                    text: 'Ошибка добавления',
                    type: "error",
                });
            }
        },

        async remove({commit},collaborator) {
            try{
                console.log(collaborator)
                const collaboratorData = await serviceCollaborator.remove(collaborator)
                commit('remove',collaboratorData)
                notify({
                    title: "collaborator",
                    text: "collaborator удален",
                    type: "success",
                });
            }catch{
                notify({
                    title: "collaborator",
                    text: 'Ошибка удаления',
                    type: "error",
                });
            }
        },

        async edit({commit},collaborator) {
            try{
                const collaboratorData = await serviceCollaborator.edit(collaborator)
                commit('edit',collaboratorData)
                notify({
                    title: "collaborator",
                    text: "collaborator отредактирована",
                    type: "success",
                });
            }catch{
                notify({
                    title: "collaborator",
                    text: 'Ошибка редактирования',
                    type: "error",
                });
            }
        },

    },
    mutations: {
        setCollaborators(state,collaborator){
            state.collaborators= collaborator
        },
        add(state,collaborator){
            state.collaborators.push(collaborator)
        },
        edit(state,collaborator){
            state.collaborators[state.collaborators.findIndex(item => item.id ==collaborator.id)] = collaborator
        },
        remove(state,collaborator){
            state.collaborators[state.collaborators.findIndex(item => item.id == collaborator.id)] = collaborator
        },
    }
}