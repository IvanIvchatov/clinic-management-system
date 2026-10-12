<template>
  <div>
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="search" style="width: 300px">
          <font-awesome-icon icon="search" />
          <input class="input" v-model="query" placeholder="Search staff" />
        </div>
        <span class="badge">{{ filtered.length }} specialists</span>
      </div>
      <div class="toolbar-right">
        <button class="btn btn-primary" @click="startAdd"><font-awesome-icon icon="user-plus" /> Add employee</button>
      </div>
    </div>

    <div class="staff-grid">
      <div v-for="p in filtered" :key="p.id" class="card staff-card" @click="startEdit(p)">
        <div style="display:flex; align-items:center; gap:14px">
          <div class="avatar avatar-lg" :style="{ background: colorFor(p.name + p.id) }">{{ initials(...p.name.split(' ')) }}</div>
          <div style="min-width:0; flex:1">
            <div class="li-title" style="font-size:15.5px">{{ p.name }}</div>
            <span class="chip chip-primary" style="margin-top:6px"><font-awesome-icon icon="user-tie" /> {{ role(p.bio) }}</span>
          </div>
          <span class="icon-btn"><font-awesome-icon icon="pen" /></span>
        </div>
        <p class="bio">{{ details(p.bio) }}</p>
        <div class="staff-foot">
          <span class="faint"><font-awesome-icon icon="birthday-cake" /> {{ formatDate(p.birth) }}</span>
          <span class="badge" v-if="age(p.birth)">{{ age(p.birth) }} y.o.</span>
        </div>
      </div>
      <div v-if="!filtered.length" class="card empty" style="grid-column: 1 / -1">No staff found</div>
    </div>

    <div class="overlay" v-if="mode" @click.self="mode = null">
      <div class="modal">
        <div class="modal-head">
          <h3>{{ mode === 'add' ? 'Add employee' : 'Edit employee' }}</h3>
          <button class="icon-btn" @click="mode = null"><font-awesome-icon icon="times" /></button>
        </div>
        <form class="modal-body" @submit.prevent="save">
          <label class="field"><span>Full name *</span><input class="input" v-model="form.name" required /></label>
          <label class="field"><span>Date of birth *</span><input class="input" type="date" v-model="form.birth" required /></label>
          <label class="field"><span>Position & bio *</span><textarea class="textarea" v-model="form.bio" required placeholder="e.g. Senior hair stylist, 10 years of experience"></textarea></label>
          <div class="form-actions">
            <button v-if="mode === 'edit'" type="button" class="btn btn-danger" style="margin-right:auto" @click="remove">
              <font-awesome-icon icon="trash-alt" /> {{ confirmDelete ? 'Confirm delete' : 'Delete' }}
            </button>
            <button type="button" class="btn" @click="mode = null">Cancel</button>
            <button class="btn btn-primary">{{ mode === 'add' ? 'Add' : 'Save' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { initials, colorFor, age, formatDate } from '../../utils';

export default {
  data() {
    return { query: '', mode: null, form: {}, confirmDelete: false };
  },
  computed: {
    filtered() {
      const q = this.query.trim().toLowerCase();
      const all = this.$store.state.collaborators.items;
      return q ? all.filter(p => `${p.name} ${p.bio}`.toLowerCase().includes(q)) : all;
    },
  },
  created() {
    this.$store.dispatch('collaborators/init');
  },
  methods: {
    initials, colorFor, age, formatDate,
    role(bio = '') { return (bio.split(',')[0] || 'Specialist').trim(); },
    details(bio = '') {
      const rest = bio.split(',').slice(1).join(',').trim();
      return rest ? rest.charAt(0).toUpperCase() + rest.slice(1) : '';
    },
    startAdd() { this.form = { name: '', birth: '', bio: '' }; this.mode = 'add'; this.confirmDelete = false; },
    startEdit(p) { this.form = { ...p }; this.mode = 'edit'; this.confirmDelete = false; },
    async save() {
      const saved = await this.$store.dispatch(this.mode === 'add' ? 'collaborators/add' : 'collaborators/edit', this.form);
      if (saved) this.mode = null;
    },
    async remove() {
      if (!this.confirmDelete) { this.confirmDelete = true; return; }
      if (await this.$store.dispatch('collaborators/remove', this.form)) this.mode = null;
    },
  },
};
</script>

<style scoped>
.bio { color: var(--text-2); margin: 16px 0; min-height: 22px; }
.staff-foot { display: flex; justify-content: space-between; align-items: center; padding-top: 14px; border-top: 1px solid var(--border); font-size: 13px; }
</style>
