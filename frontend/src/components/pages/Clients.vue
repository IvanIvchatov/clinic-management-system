<template>
  <!--    <div style="margin-top:100px">-->
  <!--     	<h1>Страница клиентов</h1>-->
  <!--    </div>-->

  <div class="bottom-menu">
    <div @click="add"><i class="fas fa-user-plus"></i>Новый клиент</div>
    <div :class="{ disabled: !isEdit }" @click="edit">
      <i class="fas fa-user-edit"></i>Редактировать клиента
    </div>
    <div><i class="fas fa-money-check-alt"></i>Продажа</div>
    <div><i class="fas fa-fighter-jet"></i>Быстрая Продажа</div>
    <div><i class="fas fa-users"></i>Сейчас в самотужке</div>
    <div><i class="fas fa-wallet"></i>Положить на счет</div>
    <div><i class="fas fa-hand-holding-usd"></i>Снять со счета</div>
  </div>
  <div class="left">
    <div class="search">
      <input type="text" placeholder="поиск" />
    </div>
    <div class="clients-list">
      <h4 v-if="currentCenter">текущий центр {{currentCenter.name}}</h4>
      <h4>ФИО</h4>
      <ul>
        <li
          @click="setCurrentUser(user)"
          v-for="(user, index) in $store.state.users.users"
          :key="index"
        >
          <i class="far fa-user"></i> {{ user.secondName }} {{ user.name }}
          {{ user.patronymic }}
        </li>
      </ul>
    </div>
  </div>
  <div class="right clients-right">
    <div class="user" v-show="currentUser.show">
      <h3>{{ h3 }} {{mode}}</h3>
      <div class="user-info">
        <div><button class="but-delete">Удалить</button></div>
        <table>
          <tr>
            <td>Фамилия</td>
            <input
              v-if="mode == 'edit' || mode == 'add'"
              v-model="currentUser.secondName"
            />
            <td v-else>{{ currentUser.secondName }}</td>
          </tr>

          <tr>
            <td>Имя</td>
            <input
              v-if="mode == 'edit' || mode == 'add'"
              v-model="currentUser.name"
            />
            <td v-else>{{ currentUser.name }}</td>
          </tr>

          <tr>
            <td>Отчество</td>
            <input
              v-if="mode == 'edit' || mode == 'add'"
              v-model="currentUser.patronymic"
            />
            <td v-else>{{ currentUser.patronymic }}</td>
          </tr>
          <tr>
            <td>email</td>
            <input
              v-if="mode == 'edit' || mode == 'add'"
              v-model="currentUser.email"
            />
            <td v-else>{{ currentUser.email }}</td>
          </tr>
          <tr>
            <td>номер телефона</td>
            <input
              v-if="mode == 'edit' || mode == 'add'"
              v-model="currentUser.phone"
            />
            <td v-else>{{ currentUser.phone }}</td>
          </tr>

           <tr>
            <td>День рождения</td>
            <input type="date"
              v-if="mode == 'edit' || mode == 'add'"
              v-model="currentUser.birthday"
            />
            <td v-else>{{ currentUser.birthday }}</td>
          </tr>

          <tr>
            <td>центры</td>
            <td>
              {{ currentUser.centers.map((center) => center.name).join() }}
            </td>
          </tr>

          <tr>
            <td>город</td>
            <input
              v-if="mode == 'edit' || mode == 'add'"
              v-model="currentUser.address.city"
            />
            <td v-else>{{ currentUser.address.city }}</td>
          </tr>

          <tr>
            <td>улица</td>
            <input
              v-if="mode == 'edit' || mode == 'add'"
              v-model="currentUser.address.street"
            />
            <td v-else>{{ currentUser.address.street }}</td>
          </tr>

          <tr>
            <td>номер</td>
            <input
              v-if="mode == 'edit' || mode == 'add'"
              v-model="currentUser.address.number"
            />
            <td v-else>{{ currentUser.address.number }}</td>
          </tr>

          <tr>
            <td>индекс</td>
            <input
              v-if="mode == 'edit' || mode == 'add'"
              v-model="currentUser.address.zipCode"
            />
            <td v-else>{{ currentUser.address.zipCode }}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- <div class="user-extra">
      <div class="extra-info">
        <h2>Примечания</h2><br>
        <span>Какая то еще инф</span>
      </div><br>
      <div class="last-visits">
        <table>
          <tr>
            <td>19.28.27</td>
            <td>лфк</td>
          </tr>
          <tr>
            <td>17.30.27</td>
            <td>масаж</td>
          </tr>
          <tr>
            <td>19.28.37</td>
            <td>бассейн</td>
          </tr>
          <tr>
            <td>19.28.37</td>
            <td>прыжки в воду с 10 метров</td>
          </tr>
          <tr>
            <td>19.28.37</td>
            <td>литер бол </td>
          </tr>
        </table>
      </div>



    </div> -->
    <button @click="saveOrEditUser" v-show="mode == 'edit' || mode == 'add'">
      {{ mode == "edit" ? "Сохранить" : "Добавить" }}
    </button>
  </div>
</template>

<script>
  import User from "../../models/user";
  export default {
    data() {
      return {
        currentUser: new User({}),
        mode: "see",
        isEdit:false,
      };
    },
    computed: {
      h3() {
        let h3 = "";
        if (this.mode == "see") h3 = "Просмотр";
        if (this.mode == "add") h3 = "Добавление";
        if (this.mode == "edit") h3 = "Редактирование";
        return h3;
      },

      currentCenter(){
        return this.$store.state.centers.currentCenter
      }
    },
    async created() {
      await this.$store.dispatch("users/initUsers");
      this.$store.state.users.users


    },
    methods: {
      setCurrentUser(user) {
        this.mode = "see";
        this.currentUser.init(user);
        this.currentUser.setShow(true);
        this.isEdit = true
      },
      edit() {
        this.mode = "edit";
        this.currentUser.setShow(true);
      },
      add() {
        this.mode = "add";
        this.currentUser.clear();
        this.currentUser.setShow(true);
        this.isEdit = false
      },
      async saveOrEditUser() {
        if(this.mode == 'edit')
         await this.$store.dispatch("users/edit",this.currentUser);
        if(this.mode == 'add')
         await this.$store.dispatch("users/add",this.currentUser);
        this.currentUser.clear();
        this.currentUser.setShow(false);
        this.isEdit = false
        this.mode = "see";
      },
    },
  };
</script>

<style scope>
  .disabled {
    opacity: 0.5;
    pointer-events: none;
  }
  .but-delete{
    position: absolute;
    left:70%;
    top:50%;
    border:none;
    border:1px solid grey;
    border-radius:10px;
    width:200px;
    height:35px;
    background: white;
    color:red;
  }
</style>