<template>

  <div class="bottom-menu">

    <div @click="add" class="for-popup-service"><i class="fas fa-puzzle-piece"></i>добавить</div>
    <div @click="edit" class="for-popup-service" :class="{ disabled: !isEdit }"><i class="fas fa-puzzle-piece"></i>редактировать</div>
    <div class="delete-service" @click="remove"><i class="fas fa-trash-alt"></i>удалить</div>
  </div>




 
  <div class="left left-li scroll">
    <table class="service-list">
      <tr  @click="setCurrentService(service)" v-for="(service, index) in $store.state.services.services"
           :key="index"><td><i class="far fa-bookmark"></i> {{service.name}}</td> <td>{{service.during}}</td> <td>{{service.cost}}</td> <td><i class="fas fa-pencil-alt"></i></td></tr>

    </table>
  </div>
  <div class="right service-right" v-show="currentService.show">
    <h3>{{ h3 }}</h3>
    <div class="form-red service-form">
      <form id="service-form">
        <div class="mb-3">
          <label for="l1" class="form-label">название услуги</label>
          <input :disabled="mode == 'see'" type="text" class="form-control name-service" id="l1" aria-describedby="emailHelp" placeholder="название услуги" v-model="currentService.name">
        </div>
        <div class="mb-3">
          <label for="l2" class="form-label">Длительность услуги</label>
          <input :disabled="mode == 'see'" type="number" class="form-control time-service" id="l2" placeholder="Длительность услуги" v-model="currentService.during">
        </div>
        <div class="mb-3">
          <label for="l3" class="form-label">Стоимость услуги</label>
          <input :disabled="mode == 'see'" type="text" class="form-control price-service" id="l3" placeholder="Стоимость услуги" v-model="currentService.cost">
        </div>
        <div class="mb-3">
          <label for="exampleColorInput" class="form-label">Выберите цвет услуги</label>
          <input :disabled="mode == 'see'" type="color" class="form-control form-control-color color-edit" id="exampleColorInput" v-model="currentService.color" title="Выберите цвет услуги">
        </div>
         <button @click="saveOrEditService" v-show="mode == 'edit' || mode == 'add'">
          {{ mode == "edit" ? "Сохранить" : "Добавить" }}
        </button>

      </form>

    </div>

  </div>

</template>

<script>
import Service from "../../models/service";

// <---------дописать сервис сервис remove -------->

export default {
    data () {
        return {
          currentService:new Service({}),
          mode: "see",
          isEdit:false,
        }
    },
    computed:{
      h3() {
        let h3 = "";
        if (this.mode == "see") h3 = "Просмотр";
        if (this.mode == "add") h3 = "Добавление";
        if (this.mode == "edit") h3 = "Редактирование";
        return h3;
      }
    },
    async created () {
      await this.$store.dispatch("services/initServices");
    },
    methods: {
      setCurrentService(service){
        this.currentService.init(service);
        this.mode = "see";
        this.currentService.setShow(true);
        this.isEdit = true
      },
      edit() {
        this.mode = "edit";
        this.currentService.setShow(true);
      },
      add() {
        this.mode = "add";
        this.currentService.clear();
        this.currentService.setShow(true);
        this.isEdit = false
      },
      async remove() {
        this.mode = "remove";
        this.currentService.setShow(false);
        this.isEdit = false
        await this.$store.dispatch("services/remove",this.currentService);
      },
      async saveOrEditService(){
        debugger
        if(this.mode == 'edit')
          await this.$store.dispatch("services/edit",this.currentService);

        if(this.mode == 'add')
          await this.$store.dispatch("services/add",this.currentService);
        this.currentService.clear();
        this.currentService.setShow(false);
        this.isEdit = false
        this.mode = "see";
      }

    }
};
</script>

<style>
  .disabled {
    opacity: 0.5;
    pointer-events: none;
  }
</style>