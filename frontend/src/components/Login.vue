<template>
  <div class="auth">
    <section class="auth-hero">
      <div class="brand">
        <div class="brand-mark">BL</div>
        <div>
          <div class="brand-name">Beauty Lab</div>
          <div class="brand-sub">Clinic management</div>
        </div>
      </div>

      <div class="hero-copy">
        <h1>Everything your clinic network needs, in one place.</h1>
        <p>Clients, services, staff and locations — managed from a single admin panel.</p>
        <ul>
          <li><font-awesome-icon icon="users" /> Client records with contacts and addresses</li>
          <li><font-awesome-icon icon="spa" /> Service catalog with prices and durations</li>
          <li><font-awesome-icon icon="hospital" /> Multiple centers, one dashboard</li>
        </ul>
      </div>

      <div class="hero-foot">Laravel REST API · Vue 3 SPA · JWT</div>
    </section>

    <section class="auth-form">
      <form @submit.prevent="handleSubmit" class="form-box">
        <h2>Welcome back</h2>
        <p class="muted">Sign in to your admin account</p>

        <label class="field">
          <span>Email</span>
          <input class="input" type="email" v-model="username" placeholder="you@clinic.com" autocomplete="username" />
        </label>
        <div v-if="submitted && !username" class="err">Email is required</div>

        <label class="field">
          <span>Password</span>
          <input class="input" type="password" v-model="password" placeholder="••••••••" autocomplete="current-password" />
        </label>
        <div v-if="submitted && !password" class="err">Password is required</div>

        <button class="btn btn-primary btn-block" :disabled="loggingIn">
          {{ loggingIn ? 'Signing in…' : 'Sign in' }}
          <font-awesome-icon v-if="!loggingIn" icon="arrow-right" />
        </button>

        <div class="demo">
          <font-awesome-icon icon="lock" />
          <span>Demo account: <b>admin@clinic.test</b> / <b>password</b></span>
        </div>
      </form>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return { username: '', password: '', submitted: false };
  },
  computed: {
    loggingIn() {
      return this.$store.state.authentication.status.loggingIn;
    }
  },
  created() {
    this.$store.dispatch('authentication/logout');
  },
  methods: {
    handleSubmit() {
      this.submitted = true;
      const { username, password } = this;
      if (username && password) {
        this.$store.dispatch('authentication/login', { username, password });
      }
    }
  }
};
</script>

<style scoped>
.auth { display: grid; grid-template-columns: 1.1fr 1fr; min-height: 100vh; }
.auth-hero {
  background:
    radial-gradient(circle at 85% 15%, rgba(94, 234, 212, .22), transparent 40%),
    radial-gradient(circle at 10% 90%, rgba(20, 184, 166, .28), transparent 45%),
    linear-gradient(160deg, #0b1f24 0%, #0f3b3a 100%);
  color: #e2f2f0; padding: 44px 56px; display: flex; flex-direction: column;
}
.auth-hero .brand { padding: 0; }
.hero-copy { margin: auto 0; max-width: 470px; }
.hero-copy h1 { font-size: 36px; line-height: 1.15; color: #fff; letter-spacing: -.02em; }
.hero-copy p { color: #9fc1bc; font-size: 16px; margin: 16px 0 28px; }
.hero-copy ul { list-style: none; padding: 0; margin: 0; }
.hero-copy li { display: flex; align-items: center; gap: 12px; padding: 9px 0; color: #cfe6e2; }
.hero-copy li svg { color: #5eead4; width: 16px; }
.hero-foot { color: #6f9690; font-size: 13px; }

.auth-form { display: grid; place-items: center; padding: 40px; background: var(--surface); }
.form-box { width: 100%; max-width: 380px; }
.form-box h2 { font-size: 26px; }
.form-box .muted { margin: 6px 0 28px; }
.btn-block { width: 100%; justify-content: center; height: 44px; margin-top: 8px; }
.err { color: var(--danger); font-size: 12.5px; margin: -8px 0 12px; }
.demo {
  margin-top: 22px; padding: 12px 14px; border-radius: 10px; background: var(--surface-2);
  border: 1px dashed var(--border); color: var(--text-2); font-size: 13px; display: flex; gap: 8px; align-items: center;
}
.demo svg { color: var(--text-3); }
@media (max-width: 900px) { .auth { grid-template-columns: 1fr; } .auth-hero { display: none; } }
</style>
