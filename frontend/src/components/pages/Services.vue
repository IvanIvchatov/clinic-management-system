<template>
  <div>
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="search" style="width: 300px">
          <font-awesome-icon icon="search" />
          <input class="input" v-model="query" placeholder="Search services" />
        </div>
      </div>
      <div class="toolbar-right">
        <button class="btn btn-primary" @click="startAdd"><font-awesome-icon icon="plus" /> New service</button>
      </div>
    </div>

    <div class="layout-svc">
      <div class="card">
        <table class="table">
          <thead>
            <tr><th>Service</th><th>Duration</th><th class="num">Price</th><th style="width:60px"></th></tr>
          </thead>
          <tbody>
            <tr v-for="s in filtered" :key="s.id" :class="{ active: form.id === s.id && mode === 'edit' }" @click="startEdit(s)">
              <td>
                <div style="display:flex; align-items:center; gap:12px">
                  <span class="swatch" :style="{ background: s.color }"></span>
                  <b>{{ s.name }}</b>
                </div>
              </td>
              <td class="muted"><font-awesome-icon icon="clock" class="faint" /> {{ duration(s.during) }}</td>
              <td class="num"><b>{{ money(s.cost) }}</b></td>
              <td><button class="icon-btn" title="Edit"><font-awesome-icon icon="pen" /></button></td>
            </tr>
            <tr v-if="!filtered.length"><td colspan="4" class="empty">No services found</td></tr>
          </tbody>
        </table>
      </div>

      <div class="card card-pad" v-if="mode">
        <div class="profile-head" style="justify-content:space-between">
          <h2>{{ mode === 'add' ? 'New service' : 'Edit service' }}</h2>
          <button class="icon-btn" @click="mode = null"><font-awesome-icon icon="times" /></button>
        </div>
        <form @submit.prevent="save">
          <label class="field"><span>Name *</span><input class="input" v-model="form.name" required /></label>
          <div class="form-grid">
            <label class="field"><span>Duration, min *</span><input class="input" type="number" min="5" step="5" v-model="form.during" required /></label>
            <label class="field"><span>Price, ₴ *</span><input class="input" type="number" min="0" v-model="form.cost" required /></label>
          </div>
          <div class="field">
            <span>Calendar color</span>
            <div class="colors">
              <button v-for="c in colors" :key="c" type="button" class="color" :class="{ on: form.color === c }"
                      :style="{ background: c }" @click="form.color = c"></button>
              <input type="color" v-model="form.color" class="color-input" title="Custom color" />
            </div>
          </div>

          <div class="preview">
            <span class="swatch" :style="{ background: form.color }"></span>
            <div>
              <b>{{ form.name || 'Service name' }}</b>
              <div class="faint">{{ duration(form.during) }} · {{ money(form.cost) }}</div>
            </div>
          </div>

          <div class="form-actions">
            <button v-if="mode === 'edit'" type="button" class="btn btn-danger" style="margin-right:auto" @click="remove">
              <font-awesome-icon icon="trash-alt" /> {{ confirmDelete ? 'Confirm' : 'Delete' }}
            </button>
            <button type="button" class="btn" @click="mode = null">Cancel</button>
            <button class="btn btn-primary">{{ mode === 'add' ? 'Create' : 'Save' }}</button>
          </div>
        </form>
      </div>

      <div class="card empty" v-else>
        <font-awesome-icon icon="spa" />
        <div>Select a service to edit it,<br />or create a new one</div>
      </div>
    </div>
  </div>
</template>

<script>
import { money, duration } from '../../utils';

const colors = ['#e07a5f', '#3d405b', '#81b29a', '#f2cc8f', '#5e60ce', '#48bfe3', '#db2777', '#0f766e'];

export default {
  data() {
    return { query: '', mode: null, form: {}, colors, confirmDelete: false };
  },
  computed: {
    filtered() {
      const q = this.query.trim().toLowerCase();
      const all = this.$store.state.services.items;
      return q ? all.filter(s => s.name.toLowerCase().includes(q)) : all;
    },
  },
  created() {
    this.$store.dispatch('services/init');
  },
  methods: {
    money, duration,
    startAdd() { this.form = { name: '', during: 60, cost: '', color: colors[0] }; this.mode = 'add'; this.confirmDelete = false; },
    startEdit(s) { this.form = { ...s }; this.mode = 'edit'; this.confirmDelete = false; },
    async save() {
      const saved = await this.$store.dispatch(this.mode === 'add' ? 'services/add' : 'services/edit', this.form);
      if (saved) this.mode = null;
    },
    async remove() {
      if (!this.confirmDelete) { this.confirmDelete = true; return; }
      if (await this.$store.dispatch('services/remove', this.form)) this.mode = null;
    },
  },
};
</script>

<style scoped>
.layout-svc { display: grid; grid-template-columns: 1fr 380px; gap: 20px; align-items: start; }
.colors { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.color { width: 28px; height: 28px; border-radius: 8px; border: 2px solid #fff; box-shadow: 0 0 0 1px var(--border); cursor: pointer; }
.color.on { box-shadow: 0 0 0 2px var(--text); }
.color-input { width: 34px; height: 30px; border: none; padding: 0; background: none; cursor: pointer; }
.preview { display: flex; gap: 12px; align-items: center; padding: 14px; border-radius: 12px; background: var(--surface-2); border: 1px solid var(--border); margin: 4px 0 18px; }
@media (max-width: 1200px) { .layout-svc { grid-template-columns: 1fr; } }
</style>
