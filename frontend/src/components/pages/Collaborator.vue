<template>

  <div class="bottom-menu">

    <button @click="add" class="button-vue"><i class="fas fa-user-plus"></i>добавить сотрудника</button>
    <button class="button-vue"><i class="fas fa-trash-alt" @click="remove"></i>удалить сотрудника</button>
    <button class="button-vue"><i class="fas fa-trash-alt" @click="edit"></i>редактировать сотрудника </button>
<!--    <a href="/settings/schedule"><i class="fas fa-clipboard-list"></i>график работы</a>-->
  </div>
  <div class="left left-employers scroll">
<!-- <-------------------------------------------------------------------------->
<!--               <ul>-->
<!--                   <li><a href=""><i class="fas fa-user"></i>Ваня</a></li>-->
<!--                   <li><a href=""><i class="fas fa-user"></i>Дима</a></li>-->
<!--                   <li><a href=""><i class="fas fa-user"></i>Коля</a></li>-->
<!--                   <li><a href=""><i class="fas fa-user"></i>Жека</a></li>-->
<!--               </ul>-->

    <!-- <-------------------------------------------------------------------------->

    <ul id="employers-list" @click="setCurrentCollaborator(collaborator)" v-for="(collaborator,index) in $store.state.collaborators.collaborators"
    :key="index">
      <li class="pidor"><button style="width:100%;align-items: center;display: flex;justify-content: left;border:none;background: white;border-radius:10px"><i class="fas fa-user"></i>{{collaborator.name}}</button></li>
    </ul>

  </div>
  {{currentCollaborator.show}}
  <div class="right service-right" v-show="currentCollaborator.show">
    <h3>{{h3}}</h3>
    <div class="form-red">
      <form class="edit-emp-form">
        <div class="mb-3">
          <label for="fio2" class="form-label">ФИО</label>
          <input type="text" class="form-control" id="fio2" aria-describedby="emailHelp" placeholder="ФИО" v-model="currentCollaborator.name">
        </div>

        <div class="mb-3">
          <label for="birthday" class="form-label">Дата рождения</label>
          <input type="text"  class="form-control" id="birthday" placeholder="дата рождения" autocomplete="off" v-model="currentCollaborator.birth">
        </div>



        <div class="mb-3">
          <label for="commit" class="form-label">Биография</label>
          <textarea class="form-control" id="commit" rows="3" v-model="currentCollaborator.bio"></textarea>
        </div>

        <button @click="saveOrEditService" v-show="mode == 'edit' || mode == 'add'">
          {{ mode == "edit" ? "Сохранить" : "Добавить" }}
        </button>

      </form>

    </div>

  </div>
</template>

<script>
import Collaborator from "../../models/collaborator";


// console.log($store.state.collaborators.collaborators)
export default {
  data () {
    return {
      currentCollaborator:new Collaborator({}),
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
    await this.$store.dispatch("collaborators/initCollaborators")
  },
  methods: {
    setCurrentCollaborator(collaborator){
      debugger
      this.currentCollaborator.init(collaborator);
      this.mode = "see";
      this.currentCollaborator.setShow(true);
      this.isEdit = true
    },
    edit() {
      this.mode = "edit";
      this.currentCollaborator.setShow(true);
    },
    add() {
      this.mode = "add";
      this.currentCollaborator.clear();
      this.currentCollaborator.setShow(true);
      this.isEdit = false
      debugger
    },
    remove() {
      this.mode = "remove";
      this.currentCollaborator.setShow(true);
      this.isEdit = false
    },
    async saveOrEditService(){
      if(this.mode == 'edit')
        await this.$store.dispatch("сollaborators/edit",this.currentCollaborator);

      if(this.mode == 'add')
        await this.$store.dispatch("collaborators/add",this.currentCollaborator);
      this.currentCollaborator.clear();
      this.currentCollaborator.setShow(false);
      this.isEdit = false
      this.mode = "see";

      if(this.mode == 'remove')
        await this.$store.dispatch("collaborator/remove",this.currentCollaborator);


    }

  }
};

</script>