<template>
  <div class="login">
    <h1><img src="./img/logo.png" class="title"></h1>
    <div class="nav">
      <ul>
        <li>
          <NuxtLink class="nav-item" to="/">戻る</NuxtLink>
        </li>
      </ul>
    </div>
    <div class="nav-box">
      <h2>ログイン</h2>
      <input type="email" v-model="email" required value="メールアドレス">
      <input type="password" v-model="password" required value="パスワード">
      <button @click="login">ログイン</button>
    </div>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase'
export default {
  data() {
    return {
      email: 'メールアドレス',
      password: 'パスワード',
    }
  },
  methods: {
    login() {
      if (!this.email || !this.password) {
        alert('メールアドレスまたはパスワードが入力されていません。');
        return;
      }
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(() => {
        // alert('ログインが完了しました')         
        this.$router.push('/share_home')
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/invalid-email':
            alert('メールアドレスの形式が違います。')
            break
          case 'auth/user-disabled':
            alert('ユーザーが無効になっています。')
            break
          case 'auth/user-not-found':
            alert('ユーザーが存在しません。')
            break
          case 'auth/wrong-password':
            alert('パスワードが間違っております。')
            break
          default:
            alert('エラーが起きました。しばらくしてから再度お試しください。')
            break
        }
      })
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