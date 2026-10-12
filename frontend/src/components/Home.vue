<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">BL</div>
        <div>
          <div class="brand-name">Beauty Lab</div>
          <div class="brand-sub">Clinic management</div>
        </div>
      </div>

      <div class="nav-label">Menu</div>
      <nav class="nav">
        <router-link v-for="item in nav" :key="item.to" :to="item.to">
          <font-awesome-icon :icon="item.icon" /> {{ item.label }}
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="me" v-if="user">
          <div class="avatar" :style="{ background: colorFor(user.email) }">{{ initials(user.name, user.secondName) }}</div>
          <div>
            <div class="me-name">{{ user.name }} {{ user.secondName }}</div>
            <div class="me-mail">{{ user.email }}</div>
          </div>
        </div>
        <nav class="nav">
          <a href="#" @click.prevent="logout"><font-awesome-icon icon="sign-out-alt" /> Sign out</a>
        </nav>
      </div>
    </aside>

    <div class="main">
      <header class="topbar">
        <div>
          <h1>{{ $route.meta.title }}</h1>
          <div class="topbar-sub">{{ $route.meta.subtitle }}</div>
        </div>
        <div class="topbar-right">
          <label class="center-select">
            <font-awesome-icon icon="hospital" />
            <select class="select" v-model="currentId" style="width: 230px">
              <option :value="null">All centers</option>
              <option v-for="c in centers" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </label>
        </div>
      </header>

      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { initials, colorFor } from '../utils';

export default {
  data() {
    return {
      nav: [
        { to: '/dashboard', label: 'Dashboard', icon: 'chart-pie' },
        { to: '/clients', label: 'Clients', icon: 'users' },
        { to: '/services', label: 'Services', icon: 'spa' },
        { to: '/staff', label: 'Staff', icon: 'user-tie' },
        { to: '/centers', label: 'Centers', icon: 'hospital' },
      ],
    };
  },
  computed: {
    user() { return this.$store.state.authentication.user; },
    centers() { return this.$store.state.centers.items; },
    currentId: {
      get() { return this.$store.state.centers.current?.id ?? null; },
      set(id) { this.$store.commit('centers/setCurrent', this.centers.find(c => c.id === id) || null); },
    },
  },
  created() {
    this.$store.dispatch('centers/init');
  },
  methods: {
    initials, colorFor,
    logout() {
      this.$store.dispatch('authentication/logout');
      this.$router.push('/login');
    },
  },
};
</script>
