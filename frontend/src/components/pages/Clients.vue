<template>
  <div>
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="search" style="width: 320px">
          <font-awesome-icon icon="search" />
          <input class="input" v-model="query" placeholder="Search by name, email or phone" />
        </div>
        <span class="chip" v-if="current"><font-awesome-icon icon="hospital" /> {{ current.name }}</span>
      </div>
      <div class="toolbar-right">
        <button class="btn btn-primary" @click="startAdd"><font-awesome-icon icon="user-plus" /> New client</button>
      </div>
    </div>

    <div class="split">
      <div class="card">
        <div class="card-head">
          <h3>All clients</h3>
          <span class="badge">{{ filtered.length }}</span>
        </div>
        <ul class="list scroll-y">
          <li v-for="u in filtered" :key="u.id" class="list-item" :class="{ active: selected && selected.id === u.id }" @click="select(u)">
            <div class="avatar" :style="{ background: colorFor(u.email) }">{{ initials(u.name, u.secondName) }}</div>
            <div style="min-width:0">
              <div class="li-title">{{ u.secondName }} {{ u.name }}</div>
              <div class="li-sub">{{ u.phone || u.email }}</div>
            </div>
            <font-awesome-icon icon="chevron-right" class="li-right" />
          </li>
          <li v-if="!filtered.length" class="empty">No clients found</li>
        </ul>
      </div>

      <!-- view -->
      <div class="card card-pad" v-if="mode === 'view' && selected">
        <div class="profile-head">
          <div class="avatar avatar-lg" :style="{ background: colorFor(selected.email) }">{{ initials(selected.name, selected.secondName) }}</div>
          <div>
            <h2>{{ selected.secondName }} {{ selected.name }} {{ selected.patronymic }}</h2>
            <div class="muted">Client since {{ selected.created_at }}</div>
          </div>
          <div style="margin-left:auto; display:flex; gap:8px">
            <button class="btn" @click="startEdit"><font-awesome-icon icon="pen" /> Edit</button>
            <button class="btn btn-danger" @click="removeClient">
              <font-awesome-icon icon="trash-alt" /> {{ confirmDelete ? 'Confirm delete' : 'Delete' }}
            </button>
          </div>
        </div>

        <div class="section-title">Contacts</div>
        <dl class="kv">
          <dt><font-awesome-icon icon="envelope" /> Email</dt><dd>{{ selected.email }}</dd>
          <dt><font-awesome-icon icon="phone" /> Phone</dt><dd>{{ selected.phone || '—' }}</dd>
          <dt><font-awesome-icon icon="birthday-cake" /> Birthday</dt>
          <dd>{{ formatDate(selected.birthday) }}<span v-if="age(selected.birthday)" class="faint"> · {{ age(selected.birthday) }} years</span></dd>
          <dt><font-awesome-icon icon="map-marker-alt" /> Address</dt><dd>{{ address(selected) }}</dd>
        </dl>

        <div class="section-title" style="margin-top:24px">Centers</div>
        <div style="display:flex; gap:8px; flex-wrap:wrap">
          <span v-for="c in selected.centers" :key="c.id" class="chip chip-primary"><font-awesome-icon icon="hospital" /> {{ c.name }}</span>
          <span v-if="!selected.centers.length" class="faint">Not assigned</span>
        </div>
      </div>

      <!-- add / edit -->
      <div class="card card-pad" v-else-if="mode !== 'view'">
        <div class="profile-head">
          <h2>{{ mode === 'add' ? 'New client' : 'Edit client' }}</h2>
        </div>
        <form @submit.prevent="save">
          <div class="section-title">Personal</div>
          <div class="form-grid">
            <label class="field"><span>Last name</span><input class="input" v-model="form.secondName" /></label>
            <label class="field"><span>First name *</span><input class="input" v-model="form.name" required /></label>
            <label class="field"><span>Middle name</span><input class="input" v-model="form.patronymic" /></label>
            <label class="field"><span>Birthday</span><input class="input" type="date" v-model="form.birthday" /></label>
            <label class="field"><span>Email *</span><input class="input" type="email" v-model="form.email" required /></label>
            <label class="field"><span>Phone</span><input class="input" v-model="form.phone" placeholder="+380 …" /></label>
          </div>

          <div class="section-title">Address</div>
          <div class="form-grid">
            <label class="field"><span>City</span><input class="input" v-model="form.address.city" /></label>
            <label class="field"><span>Street</span><input class="input" v-model="form.address.street" /></label>
            <label class="field"><span>Building</span><input class="input" v-model="form.address.number" /></label>
            <label class="field"><span>ZIP code</span><input class="input" v-model="form.address.zipCode" /></label>
          </div>

          <div class="section-title">Centers</div>
          <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:18px">
            <label v-for="c in centers" :key="c.id" class="chip" :class="{ 'chip-primary': form.center_ids.includes(c.id) }" style="cursor:pointer">
              <input type="checkbox" :value="c.id" v-model="form.center_ids" style="display:none" />
              <font-awesome-icon icon="hospital" /> {{ c.name }}
            </label>
          </div>

          <div class="form-actions">
            <button type="button" class="btn" @click="cancel">Cancel</button>
            <button class="btn btn-primary">{{ mode === 'add' ? 'Create client' : 'Save changes' }}</button>
          </div>
        </form>
      </div>

      <div class="card empty" v-else>
        <font-awesome-icon icon="user" />
        <div>Select a client to see the details</div>
      </div>
    </div>
  </div>
</template>

<script>
import { initials, colorFor, age, formatDate } from '../../utils';

const blank = () => ({
  name: '', secondName: '', patronymic: '', email: '', phone: '', birthday: '',
  address: { city: '', street: '', number: '', zipCode: '' }, center_ids: [],
});

export default {
  data() {
    return { query: '', selectedId: null, mode: 'view', form: blank(), confirmDelete: false };
  },
  computed: {
    current() { return this.$store.state.centers.current; },
    centers() { return this.$store.state.centers.items; },
    clients() {
      const all = this.$store.state.users.items;
      return this.current ? all.filter(u => u.centers.some(c => c.id === this.current.id)) : all;
    },
    filtered() {
      const q = this.query.trim().toLowerCase();
      if (!q) return this.clients;
      return this.clients.filter(u =>
        [u.name, u.secondName, u.patronymic, u.email, u.phone].filter(Boolean).join(' ').toLowerCase().includes(q));
    },
    selected() { return this.$store.state.users.items.find(u => u.id === this.selectedId) || null; },
  },
  watch: {
    // keep a client selected: first one in the (filtered) list
    filtered: {
      immediate: true,
      handler(list) {
        if (this.mode === 'view' && list.length && !list.some(u => u.id === this.selectedId)) {
          this.selectedId = list[0].id;
        }
      },
    },
  },
  created() {
    this.$store.dispatch('users/init');
  },
  methods: {
    initials, colorFor, age, formatDate,
    address(u) {
      const a = u.address || {};
      return [a.street && `${a.street} ${a.number || ''}`.trim(), a.city, a.zipCode].filter(Boolean).join(', ') || '—';
    },
    select(u) { this.selectedId = u.id; this.mode = 'view'; this.confirmDelete = false; },
    startAdd() {
      this.form = blank();
      if (this.current) this.form.center_ids = [this.current.id];
      this.mode = 'add';
    },
    startEdit() {
      const u = this.selected;
      this.form = {
        ...blank(), ...u,
        address: { ...blank().address, ...(u.address || {}) },
        center_ids: u.centers.map(c => c.id),
      };
      this.mode = 'edit';
    },
    cancel() { this.mode = 'view'; },
    async save() {
      const action = this.mode === 'add' ? 'users/add' : 'users/edit';
      const saved = await this.$store.dispatch(action, this.form);
      if (saved) { this.selectedId = saved.id; this.mode = 'view'; }
    },
    async removeClient() {
      if (!this.confirmDelete) { this.confirmDelete = true; return; }
      const ok = await this.$store.dispatch('users/remove', this.selected);
      if (ok) { this.selectedId = this.filtered[0]?.id ?? null; this.confirmDelete = false; }
    },
  },
};
</script>
