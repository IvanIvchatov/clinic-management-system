<template>
  <div class="stack">
    <div class="grid-4">
      <div class="card card-pad stat" v-for="s in stats" :key="s.label">
        <div class="stat-icon" :class="s.tone"><font-awesome-icon :icon="s.icon" /></div>
        <div>
          <div class="stat-value">{{ s.value }}</div>
          <div class="stat-label">{{ s.label }}</div>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-head">
          <h3>Service price list</h3>
          <router-link to="/services" class="btn btn-sm btn-ghost">View all <font-awesome-icon icon="chevron-right" /></router-link>
        </div>
        <div class="card-pad">
          <div v-for="s in topServices" :key="s.id" class="svc-row">
            <span class="dot" :style="{ background: s.color }"></span>
            <div class="svc-name">{{ s.name }}<div class="faint">{{ duration(s.during) }}</div></div>
            <div class="bar svc-bar"><i :style="{ width: (s.cost / maxCost * 100) + '%', background: s.color }"></i></div>
            <b class="num svc-cost">{{ money(s.cost) }}</b>
          </div>
          <div v-if="!services.length" class="faint">No services yet</div>
        </div>
      </div>

      <div class="card">
        <div class="card-head"><h3>Clients by center</h3></div>
        <div class="card-pad">
          <div v-for="c in byCenter" :key="c.id" class="center-row">
            <div class="center-top">
              <span><font-awesome-icon icon="hospital" class="faint" /> {{ c.name }}</span>
              <b>{{ c.count }}</b>
            </div>
            <div class="bar"><i :style="{ width: (c.count / maxCenter * 100) + '%', background: 'var(--primary)' }"></i></div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-head">
          <h3>Recent clients</h3>
          <router-link to="/clients" class="btn btn-sm btn-ghost">Open clients <font-awesome-icon icon="chevron-right" /></router-link>
        </div>
        <ul class="list">
          <li v-for="u in recent" :key="u.id" class="list-item" @click="$router.push('/clients')">
            <div class="avatar" :style="{ background: colorFor(u.email) }">{{ initials(u.name, u.secondName) }}</div>
            <div>
              <div class="li-title">{{ u.secondName }} {{ u.name }}</div>
              <div class="li-sub">{{ u.email }}</div>
            </div>
            <span class="li-right chip">{{ (u.centers[0] || {}).name || '—' }}</span>
          </li>
        </ul>
      </div>

      <div class="card">
        <div class="card-head"><h3>Upcoming birthdays</h3></div>
        <ul class="list">
          <li v-for="b in birthdays" :key="b.id" class="list-item">
            <div class="stat-icon tone-amber" style="width:38px;height:38px;font-size:15px"><font-awesome-icon icon="birthday-cake" /></div>
            <div>
              <div class="li-title">{{ b.secondName }} {{ b.name }}</div>
              <div class="li-sub">{{ b.label }} · turns {{ b.turns }}</div>
            </div>
            <span class="li-right badge">{{ b.days === 0 ? 'today' : 'in ' + b.days + ' d' }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { initials, colorFor, money, duration, age } from '../../utils';

export default {
  computed: {
    current() { return this.$store.state.centers.current; },
    centers() { return this.$store.state.centers.items; },
    services() { return this.$store.state.services.items; },
    staff() { return this.$store.state.collaborators.items; },
    clients() {
      const all = this.$store.state.users.items;
      return this.current ? all.filter(u => u.centers.some(c => c.id === this.current.id)) : all;
    },
    stats() {
      const avg = this.services.length ? this.services.reduce((s, x) => s + Number(x.cost), 0) / this.services.length : 0;
      return [
        { label: this.current ? 'Clients in this center' : 'Clients', value: this.clients.length, icon: 'users', tone: 'tone-teal' },
        { label: 'Services', value: this.services.length, icon: 'spa', tone: 'tone-violet' },
        { label: 'Staff members', value: this.staff.length, icon: 'user-tie', tone: 'tone-sky' },
        { label: 'Average service price', value: money(Math.round(avg)), icon: 'wallet', tone: 'tone-amber' },
      ];
    },
    topServices() { return [...this.services].sort((a, b) => b.cost - a.cost).slice(0, 6); },
    maxCost() { return Math.max(1, ...this.services.map(s => Number(s.cost))); },
    byCenter() {
      const all = this.$store.state.users.items;
      return this.centers.map(c => ({ ...c, count: all.filter(u => u.centers.some(x => x.id === c.id)).length }));
    },
    maxCenter() { return Math.max(1, ...this.byCenter.map(c => c.count)); },
    recent() { return [...this.clients].sort((a, b) => b.id - a.id).slice(0, 5); },
    birthdays() {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      return this.clients.filter(u => u.birthday).map(u => {
        const d = new Date(u.birthday);
        let next = new Date(today.getFullYear(), d.getMonth(), d.getDate());
        if (next < today) next = new Date(today.getFullYear() + 1, d.getMonth(), d.getDate());
        return {
          ...u,
          days: Math.round((next - today) / 86400000),
          turns: (age(u.birthday) || 0) + (next > today ? 1 : 0),
          label: next.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }),
        };
      }).sort((a, b) => a.days - b.days).slice(0, 5);
    },
  },
  created() {
    this.$store.dispatch('users/init');
    this.$store.dispatch('services/init');
    this.$store.dispatch('collaborators/init');
  },
  methods: { initials, colorFor, money, duration },
};
</script>

<style scoped>
.svc-row { display: grid; grid-template-columns: 12px 1.3fr 1fr 90px; gap: 14px; align-items: center; padding: 9px 0; }
.svc-row + .svc-row { border-top: 1px solid var(--border); }
.svc-name { font-weight: 600; }
.svc-name .faint { font-weight: 400; font-size: 12.5px; }
.svc-cost { text-align: right; }
.center-row { padding: 10px 0; }
.center-top { display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: 500; }
</style>
