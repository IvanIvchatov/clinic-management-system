import { notify } from "@kyvg/vue3-notification";

// Generic Vuex module for a CRUD resource with toast notifications
export function resourceModule(api, label) {
  const toast = (text, type = 'success') => notify({ title: label, text, type });
  const errorText = (e) => {
    const msg = e?.response?.data?.message;
    if (msg && typeof msg === 'object') return Object.values(msg).flat().join(' ');
    return msg || 'Something went wrong';
  };

  return {
    namespaced: true,
    state: () => ({ items: [], loaded: false }),
    actions: {
      async init({ commit }) {
        commit('set', await api.getAll());
      },
      async add({ commit }, item) {
        try {
          const saved = await api.add(item);
          commit('add', saved);
          toast(`${label} created`);
          return saved;
        } catch (e) { toast(errorText(e), 'error'); }
      },
      async edit({ commit }, item) {
        try {
          const saved = await api.edit(item);
          commit('edit', saved);
          toast(`${label} saved`);
          return saved;
        } catch (e) { toast(errorText(e), 'error'); }
      },
      async remove({ commit }, item) {
        try {
          await api.remove(item);
          commit('remove', item);
          toast(`${label} deleted`);
          return true;
        } catch (e) { toast(errorText(e), 'error'); }
      },
    },
    mutations: {
      set(state, items) { state.items = items; state.loaded = true; },
      add(state, item) { state.items.push(item); },
      edit(state, item) {
        const i = state.items.findIndex(x => x.id == item.id);
        if (i >= 0) state.items.splice(i, 1, item);
      },
      remove(state, item) { state.items = state.items.filter(x => x.id != item.id); },
    },
  };
}
