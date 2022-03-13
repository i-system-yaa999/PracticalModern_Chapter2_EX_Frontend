<template>
  <div class="logout">
    <h1><img src="./img/logo.png" class="title"></h1>
    <div class="nav">
      <ul>
        <li>
          <NuxtLink class="nav-item" to="/">戻る</NuxtLink>
        </li>
      </ul>
    </div>
    <div class="nav-box">
      <h2>ログアウト</h2>
      {{this.$auth.user.name}}
      <button @click="logout">ログアウト</button>
    </div>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase'
export default {
  methods: {
    logout() {
      firebase.auth().signOut().then(() => {
        // alert('ログアウトが完了しました')
        this.$router.replace('/');
      });
    },
  },
}
</script>


<style scoped>
.nav-box{
  background: white;
  width: 400px;
  height: 300px;
  position: absolute;
  
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  transform: translateY(70%);

  display: grid;
}
.nav-box h2{
  width: 300px;
  margin: 0 auto;
  text-align: center;
}
.nav-box input{
  width: 300px;
  height: 30px;
  margin: 10px auto;
  border-radius:10px;
}
.nav-box button{
  height: 30px;
  width: 100px;
  margin: 20px auto 20px;
  border-radius:10px;
  color: white;
  background-color: blueviolet;
}
</style>