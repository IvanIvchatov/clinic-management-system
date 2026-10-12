<template>
  <div>
    <div class="toolbar">
      <div class="toolbar-left"><span class="badge">{{ centers.length }} locations</span></div>
      <div class="toolbar-right">
        <button class="btn btn-primary" @click="startAdd"><font-awesome-icon icon="plus" /> New center</button>
      </div>
    </div>

    <div class="centers-grid">
      <div v-for="c in centers" :key="c.id" class="card center-card">
        <div class="center-cover" :style="{ background: cover(c.name) }">
          <font-awesome-icon icon="hospital" />
        </div>
        <div class="card-pad">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px">
            <div>
              <h3 style="font-size:17px">{{ c.name }}</h3>
              <div class="faint">{{ c.addition || '—' }}</div>
            </div>
            <button class="icon-btn" @click="startEdit(c)" title="Edit"><font-awesome-icon icon="pen" /></button>
          </div>
          <dl class="kv" style="grid-template-columns: 26px 1fr; margin-top:16px; row-gap:10px">
            <dt><font-awesome-icon icon="map-marker-alt" /></dt><dd>{{ address(c) }}</dd>
            <dt><font-awesome-icon icon="phone" /></dt><dd>{{ c.phone }}</dd>
            <dt><font-awesome-icon icon="users" /></dt><dd>{{ clientCount(c) }} clients</dd>
          </dl>
          <button class="btn btn-sm" style="margin-top:16px; width:100%; justify-content:center" @click="openClients(c)">
            Show clients <font-awesome-icon icon="arrow-right" />
          </button>
        </div>
      </div>
    </div>

    <div class="overlay" v-if="mode" @click.self="mode = null">
      <div class="modal">
        <div class="modal-head">
          <h3>{{ mode === 'add' ? 'New center' : 'Edit center' }}</h3>
          <button class="icon-btn" @click="mode = null"><font-awesome-icon icon="times" /></button>
        </div>
        <form class="modal-body" @submit.prevent="save">
          <label class="field"><span>Name *</span><input class="input" v-model="form.name" required /></label>
          <div class="form-grid">
            <label class="field"><span>Phone *</span><input class="input" v-model="form.phone" required /></label>
            <label class="field"><span>Specialization</span><input class="input" v-model="form.addition" /></label>
            <label class="field"><span>City</span><input class="input" v-model="form.address.city" /></label>
            <label class="field"><span>Street</span><input class="input" v-model="form.address.street" /></label>
            <label class="field"><span>Building</span><input class="input" v-model="form.address.number" /></label>
            <label class="field"><span>ZIP code</span><input class="input" v-model="form.address.zipCode" /></label>
          </div>
          <div class="form-actions">
            <button v-if="mode === 'edit'" type="button" class="btn btn-danger" style="margin-right:auto" @click="remove">
              <font-awesome-icon icon="trash-alt" /> {{ confirmDelete ? 'Confirm delete' : 'Delete' }}
            </button>
            <button type="button" class="btn" @click="mode = null">Cancel</button>
            <button class="btn btn-primary">{{ mode === 'add' ? 'Create' : 'Save' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { colorFor } from '../../utils';

const emptyAddress = () => ({ city: '', street: '', number: '', zipCode: '' });

export default {
  data() {
    return { mode: null, form: {}, confirmDelete: false };
  },
  computed: {
    centers() { return this.$store.state.centers.items; },
  },
  created() {
    this.$store.dispatch('users/init');
  },
  methods: {
    cover(name) {
      const c = colorFor(name);
      return `linear-gradient(135deg, ${c}, ${c}cc)`;
    },
    address(c) {
      const a = c.address || {};
      return [a.street && `${a.street} ${a.number || ''}`.trim(), a.city].filter(Boolean).join(', ') || '—';
    },
    clientCount(c) {
      return this.$store.state.users.items.filter(u => u.centers.some(x => x.id === c.id)).length;
    },
    openClients(c) {
      this.$store.commit('centers/setCurrent', c);
      this.$router.push('/clients');
    },
    startAdd() { this.form = { name: '', phone: '', addition: '', address: emptyAddress() }; this.mode = 'add'; this.confirmDelete = false; },
    startEdit(c) { this.form = { ...c, address: { ...emptyAddress(), ...(c.address || {}) } }; this.mode = 'edit'; this.confirmDelete = false; },
    async save() {
      const saved = await this.$store.dispatch(this.mode === 'add' ? 'centers/add' : 'centers/edit', this.form);
      if (saved) this.mode = null;
    },
    async remove() {
      if (!this.confirmDelete) { this.confirmDelete = true; return; }
      if (await this.$store.dispatch('centers/remove', this.form)) {
        if (this.$store.state.centers.current?.id === this.form.id) this.$store.commit('centers/setCurrent', null);
        this.mode = null;
      }
    },
  },
};
</script>

<style scoped>
.centers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 18px; }
.center-card { overflow: hidden; }
.center-cover { height: 92px; display: grid; place-items: center; color: rgba(255,255,255,.9); font-size: 30px; }
</style>
