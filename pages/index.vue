<template>
  <div class="container">
    <h1><img src="./img/logo.png" class="title"></h1>
    <div class="nav">
      <ul>
        <!-- <li v-if="!$auth.loggedIn"> -->
        <!-- <li v-if="!loggedIn"> -->
          <NuxtLink class="nav-item" to="/register">新規登録</NuxtLink>
        <!-- </li> -->
        <!-- <li v-if="!$auth.loggedIn"> -->
        <!-- <li v-if="!loggedIn"> -->
          <NuxtLink class="nav-item" to="/login">ログイン</NuxtLink>
        <!-- </li> -->
        <!-- <li v-if="$auth.loggedIn"> -->
        <!-- <li v-if="loggedIn"> -->
          <!-- <NuxtLink class="nav-item" to="/logout">ログアウト</NuxtLink> -->
        <!-- </li> -->
      </ul>
    </div>
  </div>
</template>


<script>
import firebase from '~/plugins/firebase'
export default {
  data(){
    return{
      loggedIn:false,
    };
  },
  // created:function(){
  //   firebase.auth().onAuthStateChanged((loginuser) => {
  //     if (!loginuser) {
  //       loggedIn=false;
  //       alert('ログインしていません')
  //     }else{
  //       loggedIn=true;
  //     }
  //   });
  // },
}
</script>

<style>
body{
  background: black;
  /* color: white; */
}
.title{
  width: 150px;
  /* height: 100px; */
}
ul{
  list-style: none;
}

.container,.register,.login,.logout{
  display: flex;
  justify-content: space-between;
  line-height: 60px;
  position: relative;
}
.nav-item{
  text-decoration: none;
  color: white;
  line-height: 40px;
  margin-right: 20px;
  font-size: 16px;
}
button:hover{
  cursor: pointer;
}
</style>

<style scoped>
</style>