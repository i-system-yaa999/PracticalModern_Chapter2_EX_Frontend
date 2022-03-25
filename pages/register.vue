<template>
  <!--  -->
  <div class="register frame">
    <!--  -->
    <div class="header">
      <!--  -->
      <h1><a href="/"><img src="./img/logo.png" class="title"></a></h1>
      <!--  -->
      <div class="nav">
        <ul>
          <li>
            <!-- <NuxtLink class="nav-item" to="/">戻る</NuxtLink> -->
          </li>
        </ul>
      </div>
      <!--  -->
    </div>
    <!--  -->
    <validation-observer ref="obs" v-slot="ObserverProps">
      <div class="nav-box">
        <h2>新規登録</h2>
        <validation-provider v-slot="ProviderProps" rules="required|max:20">
          <div class="error">{{ ProviderProps.errors[0] }}</div>
          <input type="text" name="name" v-model="name" required placeholder="ユーザーネーム" >
        </validation-provider>
        <validation-provider v-slot="ProviderProps" rules="email">
          <div class="error">{{ ProviderProps.errors[0] }}</div>
          <input type="email" name="email" v-model="email" required placeholder="メールアドレス">
        </validation-provider>
        <validation-provider v-slot="ProviderProps" rules="required">
          <div class="error">{{ ProviderProps.errors[0] }}</div>
          <input type="password" name="password" v-model="password" required placeholder="パスワード">
        </validation-provider>
        <div>
          <button @click="rethome">戻る</button>
          <button @click="register" :disabled="ObserverProps.invalid || !ObserverProps.validated">新規登録</button>
        </div>
      </div>
    </validation-observer>
    <!--  -->
  </div>
  <!--  -->
</template>

<script>
import firebase from '~/plugins/firebase'
export default {
  data() {
    return {
      name:'',
      email: '',
      password: '',
    }
  },
  methods: {
// ----------------------------------------------------------------------
    rethome(){
        this.$router.replace('/');
    },
// ----------------------------------------------------------------------
    register() {
      if (!this.name){
        alret('名前が入力されていません。');
        return;
      }
      if (!this.email){
        alret('メールアドレスが入力されていません。');
        return;
      }
      if (!this.password) {
        alert('パスワードが入力されていません。')
        return;
      }
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then((data) => {
        // data.user.sendEmailVerification().then(() => {
          data.user.updateProfile({
            displayName: this.name,
            // photoURL: "",
          }).then(() => {
            // alert('Update successful');
            alert('登録が完了しました。')
          }).catch(() => {
            alert('An error occurred');
          });
          this.$router.replace('/login')
        // })
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/invalid-email':
            alert('メールアドレスの形式が違います。')
            break
          case 'auth/email-already-in-use':
            alert('このメールアドレスはすでに使われています。')
            break
          case 'auth/weak-password':
            alert('パスワードは6文字以上で入力してください。')
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
.nav-item{
  text-decoration: none;
  color: white;
  line-height: 40px;
  margin-right: 20px;
  font-size: 16px;
}
.nav-box{
  background: white;
  width: 400px;
  height: auto;
  position: absolute;
  
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  transform: translateY(50%);

  display: grid;
  text-align: center;
}
@media(max-width:401px){
  .nav-box{
  width: 95vw;
  transform: translateY(25%);
  }
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
.error{
  margin: 0;
  padding: 0;
  height: 30px;
}
</style>