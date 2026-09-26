import { centerService } from '../services';
// import { notify } from "@kyvg/vue3-notification";
export const centers = {
    namespaced: true,
    state: () => ({
        centers: [],
        message:'',
        currentCenter:null,
    }),
    actions:{
        async initCenters({commit}){
            const centers =await centerService.getAllCenters()
            commit("setCenters",centers)
        }
    },
    mutations: {
        setCenters(state,centers){
            state.centers = centers
        },
        setCurrentCenter(state,center){
            state.currentCenter = center
        }
    }
}
