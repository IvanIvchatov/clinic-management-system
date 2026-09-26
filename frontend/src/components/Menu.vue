<template>
  <div class="menu">
      <div class="row">
        <div class="col-md-1"></div>
        <div class="col-md-10 top-menu">
          <select
            v-model="currentCenter"
            id="top-centers-list"
            class="form-select"
            aria-label="Default select example"
          >
            <option v-for="(center, index) in $store.state.centers.centers"
                    :key="index" :value="center">{{center.name}}</option>

          </select>
         
          <router-link to="/clients">Клиенты</router-link>
          <router-link to="/descriptions">Описание</router-link>
          <router-link to="/services">Услуги</router-link>
          <router-link to="/employers">Сотрудники</router-link>
          <router-link to="/salary">Зарплаты</router-link>
          <router-link to="/cashbox">Касса</router-link>
          <router-link to="/settings">Настройки</router-link>
          <router-link to="/login">ВЫХОД</router-link>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },

  async created() {
     await this.$store.dispatch("centers/initCenters")
     this.currentCenter = this.$store.state.centers.centers[0]
     this.$store.commit("centers/setCurrentCenter",this.currentCenter)
  },

  computed:{
    currentCenter:{
      get: function () {
        return this.$store.state.centers.currentCenter
      },
      set: function (currentCenter) {
        this.$store.commit("centers/setCurrentCenter",currentCenter)
      }
    }
  }
};

</script>

<style scoped>
  .router-link-active {
    background-color: gray !important;
  }

  .current-center{
    background-color: red;
  }
</style>