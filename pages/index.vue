<template>
  <!--  -->
  <div class="container frame">
    <!--  -->
    <div class="header">
      <!--  -->
      <h1><a href="/"><img src="./img/logo.png" class="title"></a></h1>
      <!--  -->
      <div class="nav">
        <ul>
          <button class="btn"><NuxtLink class="nav-item" to="/register">新規登録</NuxtLink></button>
          <button class="btn"><NuxtLink class="nav-item" to="/login">ログイン</NuxtLink></button>
        </ul>
      </div>
      <!--  -->
    </div>
    <!--  -->
  </div>
  <!--  -->
</template>


<style>
body{
  background: black;
  /* color: white; */
}
.title{
  width: 150px;
  /* height: 100px; */
}
ul,li{
  list-style: none;
}
li{
  word-wrap: break-word;
  overflow: auto;
}
button:hover{
  cursor: pointer;
}



</style>

<style scoped>
.header{
  /* display: flex;
  justify-content: space-between; */
  line-height: 60px;
  position: relative;
}
.nav ul{
  margin: 0;
  padding: 0;
}
.nav-item{
  text-decoration: none;
  color: white;
  /* line-height: 40px; */
  /* margin-right: 20px; */
  font-size: 16px;
}
.btn{
  height: 40px;
  width: 120px;
  background-color: blueviolet;
  border-radius: 40px;
  color: white;
  display: block;
  margin: 20px auto;
}
</style>
