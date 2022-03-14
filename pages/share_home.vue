<template>
  <div class="share_home">
    <div class="left_frame">
      <h1><img src="./img/logo.png" class="title"></h1>
      <div class="nav">
        <div class="nav-item">
          <img src="./img/home.png"><button class="nav-item" @click="more_home">ホーム</button>
        </div>
        <div class="nav-item">
          <img src="./img/logout.png"><button class="nav-item" @click="logout">ログアウト</button>
        </div>
      </div>
      <div class="new_tweet_fram">
        <p>シェア</p>
        <textarea v-model="new_tweet" required class="new_inputbox" cols="30" rows="10">ここに</textarea>
        <button class="btn" @click="newtweet">シェアする</button>
      </div>
    </div>
    <div class="right_frame">
      <!--  -->
      <div class="tweet" v-show="!comments_open">
        <!-- <ul> -->
        <h2 v-if="nottweets">新規シェアしてください</h2>
        <ul v-if="!nottweets">
          <h2 class="title">ホーム</h2>
          <li class="list_item" v-for="(tweet_item,index) in tweet_items" :key="index">
              <span>{{tweet_item.tweet_name}} :　</span>
              <button class="pb_nice" @click="countup(index)"><img src="./img/heart.png"></button>　{{tweet_item.nice_count}}　
              <button class="pb_del" @click="destroytweet(index)"><img src="./img/cross.png"></button>{{dummy}}
              <button class="pb_detail" @click="more_commnet(index)"><img src="./img/detail.png"></button>
              <p>{{tweet_item.tweet}}</p>
          </li>
        </ul>
      </div>
      <!--  -->
      <div class="comment" v-show="comments_open">
        <ul>
          <h2 class="title">コメント</h2>
          <li class="list_item">
            <span>{{tweet_items[more_index].tweet_name}} :　</span>
            <button class="pb_nice" @click="countup(more_index)"><img src="./img/heart.png"></button>　{{tweet_items[more_index].nice_count}}　
            <button class="pb_del" @click="destroytweet(more_index)"><img src="./img/cross.png"></button>{{dummy}}
            <p>{{tweet_items[more_index].tweet}}</p>
          </li>
          <li class="list item">コメント</li>
          <li class="list_item" v-for="(comment_item,index) in comment_items" :key="index">
              <span>{{comment_item.comment_name}} :　</span>
              <p>{{comment_item.comment}}</p>
          </li>
          <li>
            <textarea v-model="new_comment" required class="new_inputbox" cols="120" rows="4">ここに</textarea>
            <button class="btn btncomment" @click="addcomment(more_index)">コメント</button>
          </li>
        </ul>
      </div>

    </div>
    
    
  </div>
</template>
<style scoped>

</style>

<script>
import firebase from '~/plugins/firebase'
export default {
  data(){
    return{
      nottweets:true,
      comments_open:false,
      more_index:0,
      dummy:'　　　　',
      loggedIn:false,
      new_tweet:'please tweet',
      tweet_item:[],
      tweet_items:[
          {
            id:0,
            tweet_name: '',
            tweet: '',
            nice_count: 0,
          },
      ],
      new_comment:'',
      comment_item:[],
      comment_items:[
          {
            id:1,
            comment_name: '',
            comment: '',
          },],
    };
  },
// ----------------------------------------------------------------------
  beforeCreate(){
    // alert('beforeCreate');
  },
// ----------------------------------------------------------------------
  created(){
    // alert('created');
    let unsubscribe = firebase.auth().onAuthStateChanged((loginuser) => {
      if (!loginuser) {
        alert('ログインしてください');
        this.$router.replace('/login');
      }else{
        this.loggedIn=true;
      }
      unsubscribe();
    });
    this.gettweet();
  },
// ----------------------------------------------------------------------
  beforeDestroy(){
    // alert('beforeDestroy');
  },
// ----------------------------------------------------------------------
  destroyed(){
    // alert('destroyed');
  },
// ----------------------------------------------------------------------
  methods: {
// ----------------------------------------------------------------------
    logout() {
      firebase.auth().signOut().then(() => {
        alert('ログアウトが完了しました');
        this.loggedIn=false;
        this.$router.replace('/');
      });
    },
// ----------------------------------------------------------------------
    async newtweet() {
      try {
        const user =firebase.auth().currentUser;
        // alert(user.displayName);
        // alert(user.email);
        // alert(this.new_tweet);
        await this.$axios.post("http://localhost:8000/api/newtweet",
          {
            tweet_name: user.displayName,
            tweet: this.new_tweet,
          },
        ).then(response => {
          // alert(response.data.message);
            // alert('書き込み完了');
            this.comments_open=false;
          }
        );
      } catch(error) {
        // alert(error.response);
        alert("書き込みエラー:newtweet");
      };
      this.gettweet();
    },
// ----------------------------------------------------------------------
    async gettweet(){
      // alert('gettweet');
      try{
        await this.$axios.get("http://localhost:8000/api/gettweet",)
          .then(response => {
          // alert(response.data.message);
            // alert("完了:gettweet");
          // console.log(response.data);
            if(!response.data.length==0){
              this.tweet_items=response.data;
              this.nottweets=false;
            }else{
              this.nottweets=true;
            }
          }
        );
      } catch(error) {
        // alert(error.response);
        alert("エラー:gettweet");
      };
      this.comment_items=[];
    },
// ----------------------------------------------------------------------
    async destroytweet(index){
      const user =firebase.auth().currentUser;
      // alert("投稿者："+this.tweet_items[index].tweet_name);
      // alert("消そうとした人："+user.displayName);
      if(this.tweet_items[index].tweet_name!=user.displayName){
        alert('投稿者のみ消せます。');
        return;
      // }else{
      //   alert('消しました。')
      };
      // alert(this.tweet_items[index].id);
      try{
        await this.$axios.post("http://localhost:8000/api/destroytweet",
          {
            id:this.tweet_items[index].id,
          }
        ).then(response => {
          // alert(response.data.message);
          // alert("完了:destroytweet");
          }
        );
      } catch(error) {
        // alert(error.response);
        alert("エラー:destroytweet");
      };
      this.comments_open=false;
      this.gettweet();
    },
// ---------------------------------------------------------------------
    more_home(){
      this.comments_open=false;
      this.gettweet();
      // this.more_index=1;
    },
// ---------------------------------------------------------------------
    more_commnet(index){
      this.more_index=index;
      // alert('more_commnet:'+this.more_index);
      this.getcomment(this.tweet_items[this.more_index].id);
      this.comments_open=true;
    },
// ----------------------------------------------------------------------
    async countup(index){
      // alert(index);
      try{
        const user =firebase.auth().currentUser;
        await this.$axios.post("http://localhost:8000/api/countup",
          {
            tweets_id:this.tweet_items[index].id,
            like_name: user.displayName,
          }
        ).then(response => {
          // alert(response.data.message);
          }
        );
      } catch(error) {
        alert("エラー:countup");
      };
      // if(this.comments_open){
      //   this.more_commnet(this.more_index);
      //   // return;
      // }else{
      //   this.gettweet();
      // };
      this.getcount(index);
    },
// ----------------------------------------------------------------------
    async getcount(index){
      try{
        await this.$axios.post("http://localhost:8000/api/getcount",
          {
            id:this.tweet_items[index].id,
          }
        ).then(response => {
          // alert(response.data.message);
          this.tweet_items[index].nice_count=response.data;
          }
        );
      } catch(error) {
        alert("エラー:countup");
      };
    },
// ----------------------------------------------------------------------
    async getcomment(tweetid){
      // alert('getcomment : '+tweetid);
      try{
        await this.$axios.post("http://localhost:8000/api/getcomment",
          {
            tweets_id:tweetid,
          }
        ).then(response => {
          // alert(response.data.message);
            this.comment_items=response.data;
          }
        );
      } catch(error) {
        // alert(this.tweet_items[index].id);
        alert("エラー:getcomment");
      };
    },
// ----------------------------------------------------------------------
    async addcomment(index){
      try {
        const user =firebase.auth().currentUser;
        // alert(this.tweet_items[index].id);
        // alert(user.displayName);
        // alert(this.new_comment);
        await this.$axios.post("http://localhost:8000/api/addcomment",
          {
            tweets_id:this.tweet_items[index].id,
            comment_name: user.displayName,
            comment: this.new_comment,
          },
        ).then(response => {
          // alert(response.data.message);
            // alert('コメント書き込み完了');
            this.new_comment='';
          }
        );
      } catch(error) {
        // alert(error.response);
        alert("コメ書き込みエラー:addcomment");
      };
      this.getcomment(this.tweet_items[index].id);
    },
// ----------------------------------------------------------------------
  },
};
</script>

<style scoped>
.active{
  display: block;
}
.share_home{
  display: grid;
  grid-template-columns: 18% 80%;
  color: white;
}
.left_frame{
}
.nav-item{
  width: 100%;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding-left: 10px;
  cursor: pointer;
}
.nav img{
  width: 30px;
}


.new_inputbox{
  background: none;
  border: 2px solid white;
  border-radius: 10px;
  color: white;
  padding: 10px;
  font-size: 16px;
}

.btn{
  height: 40px;
  width: 120px;
  background-color: blueviolet;
  border-radius: 40px;
  color: white;
  margin-left: 150px;
}
.btncomment{
  margin-left: 850px;
}

.list_item{
  line-height: 30px;
  border: 1px solid white;
  padding: 20px 30px 0 30px;
}
.list_item img{
  width: 20px;
  vertical-align: middle;
}

.pb_nice,.pb_del,.pb_detail{
  background:none;
  border:0;
  cursor:pointer;
}
</style>