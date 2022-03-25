<template>
  <!--  -->
  <div class="share_home">
    <!--  -->
    <div class="left_frame">
      <!--  -->
      <h1><a href="/"><img src="./img/logo.png" class="title"></a></h1>
      <!--  -->
      <div class="nav">
        <div class="nav-item">
          <img src="./img/home.png"><button class="nav-item" @click="more_home">ホーム</button>
        </div>
        <div class="nav-item">
          <img src="./img/logout.png"><button class="nav-item" @click="logout">ログアウト</button>
        </div>
      </div>
      <!--  -->
      <validation-observer ref="obs" v-slot="ObserverProps">
        <div class="new_tweet_frame" v-show="!comments_open">
          <p>シェア</p>
          <validation-provider v-slot="ProviderProps" rules="required|max:120">
            <textarea name="tweet" v-model="new_tweet" required class="new_inputbox" placeholder="please tweet"></textarea>
            <!-- <textarea name="tweet" v-model="new_tweet" required class="new_inputbox" cols="27" rows="10">ここに</textarea> -->
            <div class="error">{{ ProviderProps.errors[0] }}</div>
          </validation-provider>
          <button class="btn" @click="newtweet" :disabled="ObserverProps.invalid || !ObserverProps.validated">シェアする</button>
        </div>
      </validation-observer>
      <!--  -->
    </div>
    <!--  -->
    <div class="right_frame">
      <!--  -->
      <div class="tweet" v-show="!comments_open">
        <!--  -->
        <h2 v-if="nottweets">新規シェアしてください</h2>
        <!--  -->
        <ul v-if="!nottweets">
          <h2 class="title">ホーム</h2>
          <li class="list_item" v-for="(tweet_item,index) in sortedItems" :key="index">
              <p>{{tweet_item.tweet_name}} :　{{tweet_item.tweet}}</p>
              <button class="pb_nice tooltip" @click="countup(index)">
                <img src="./img/heart.png">
                <span class="tooltip-text" v-show="tooltip1">いいね</span>
                <span class="tooltip-text" v-show="tooltip2">like</span>
              </button>　{{tweet_item.nice_count}}　
              <button class="pb_del tooltip" @click="destroytweet(index)">
                <img src="./img/cross.png">
                <span class="tooltip-text" v-show="tooltip1">けす</span>
                <span class="tooltip-text" v-show="tooltip2">destroy</span>
              </button>{{dummy}}
              <p class="small_display"></p>
              <span>コメント：{{tweet_item.comment_count}}</span>
              <button class="pb_detail tooltip" @click="more_commnet(index)">
                <img src="./img/detail.png">
                <span class="tooltip-text" v-show="tooltip1">コメントを見る</span>
                <span class="tooltip-text" v-show="tooltip2">commnet</span>
              </button>
              <p>{{cngdate(tweet_item.created_at)}}</p>
          </li>
        </ul>
        <!--  -->
      </div>
      <!--  -->
      <validation-observer ref="obs" v-slot="ObserverProps">
        <div class="comment" v-show="comments_open">
          <ul>
            <h2 class="title">コメント</h2>

            <li class="list_item">
              <p>{{tweet_items[more_index].tweet_name}} :　{{tweet_items[more_index].tweet}}</p>
              <button class="pb_nice tooltip" @click="countup(more_index)">
                <img src="./img/heart.png">
                <span class="tooltip-text" v-show="tooltip1">いいね</span>
                <span class="tooltip-text" v-show="tooltip2">like</span>
              </button>　{{tweet_items[more_index].nice_count}}　
              <button class="pb_del tooltip" @click="destroytweet(more_index)">
                <img src="./img/cross.png">
                <span class="tooltip-text" v-show="tooltip1">けす</span>
                <span class="tooltip-text" v-show="tooltip2">destroy</span>
              </button>{{dummy}}
              <p class="small_display"></p>
              <span>コメント：{{tweet_items[more_index].comment_count}}</span>
              <p>{{cngdate(tweet_items[more_index].created_at)}}</p>
          </li>

            <li class="list item">コメント</li>
            <div class="comment_fram">
              <li class="list_item" v-for="(comment_item,index) in comment_items" :key="index">
                  <p>{{comment_item.comment_name}} :　{{comment_item.comment}}</p>
                  <p>{{cngdate(comment_item.created_at)}}</p>
              </li>
            </div>

            <li class="new_comment_frame">
              <validation-provider v-slot="ProviderProps" rules="required|max:120">
                <textarea name="commnet" v-model="new_comment" required class="new_inputbox" placeholder="please comment"></textarea>
                <!-- <textarea name="commnet" v-model="new_comment" required class="new_inputbox" cols="120" rows="4">ここに</textarea> -->
                <div class="error">{{ ProviderProps.errors[0] }}</div>
              </validation-provider>
              <button class="btn btncomment" @click="addcomment(more_index)" :disabled="ObserverProps.invalid || !ObserverProps.validated">コメント</button>
            </li>
          </ul>
        </div>
      </validation-observer>
      <!--  -->
    </div>
    <!--  -->
  </div>
  <!--  -->
</template>
<style scoped>

</style>


<script>
import firebase from '~/plugins/firebase'
import moment from 'moment'
export default {
  data(){
    return{
      // url:"http://localhost:8000/",
      url:"https://still-savannah-21619.herokuapp.com/",
      small_display:false,
      tooltip1:false,
      tooltip2:true,
      nottweets:true,
      comments_open:false,
      more_index:0,
      dummy:'　　',
      loggedIn:false,
      new_tweet:'',
      tweet_item:[],
      tweet_items:[
          {
            id:0,
            tweet_name: '',
            tweet: '',
            nice_count: 0,
            comment_count:0,
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
  computed: {
    reverseItems() {
      return this.tweet_items.slice().reverse();
    },
    sortedItems(){
        return this.tweet_items.sort((a, b) => {
          //昇順(古い順)
          // return (a.created_at < b.created_at) ? -1 : (a.created_at > b.created_at) ? 1 : 0;
          //降順(新しい順)
          return (a.created_at < b.created_at) ? 1 : (a.created_at > b.created_at) ? -1 : 0;
        });;
    },
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
        await this.$axios.post(this.url+"api/newtweet",
          {
            tweet_name: user.displayName,
            tweet: this.new_tweet,
          },
        ).then(response => {
          // alert(response.data.message);
            // alert('書き込み完了');
            this.comments_open=false;
            this.new_tweet="";
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
        await this.$axios.get(this.url+"api/gettweet",)
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
        await this.$axios.post(this.url+"api/destroytweet",
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
        await this.$axios.post(this.url+"api/countup",
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
        await this.$axios.post(this.url+"api/getcount",
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
        await this.$axios.post(this.url+"api/getcomment",
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
      this.getcommentcount(tweetid);
    },
// ----------------------------------------------------------------------
    async getcommentcount(tweetid){
      // alert('getcommentcount : '+tweetid);
      try{
        await this.$axios.post(this.url+"api/getcommentcount",
          {
            id:tweetid,
          }
        ).then(response => {
          console.log(response.data);
            this.tweet_items[this.more_index].comment_count=response.data;
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
        await this.$axios.post(this.url+"api/addcomment",
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
    cngdate(dateString) {
      return moment(dateString).format('YYYY/MM/DD hh:mm');;
    },
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
.nav-item{
  width: 100%;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding-left: 10px;
  cursor: pointer;
  text-decoration: none;
  color: white;
  line-height: 40px;
  margin-right: 20px;
  font-size: 16px;
}
.nav img{
  width: 30px;
}

.new_tweet_frame,.new_comment_frame{
  text-align: center;
}
.new_inputbox{
  background: none;
  border: 2px solid white;
  border-radius: 10px;
  color: white;
  padding: 10px;
  font-size: 16px;
  width: 97%;
  margin: 0 auto;
}

.btn{
  height: 40px;
  width: 120px;
  background-color: blueviolet;
  border-radius: 40px;
  color: white;
  /* margin-left: 150px; */
  display: block;
  margin: auto;
}
.btncomment{
  /* margin-left: 850px; */
  display: block;
  margin: auto;
}

.list_item{
  line-height: 30px;
  border: 1px solid white;
  border-radius: 5px;
  padding: 0 30px;
  margin: 5px 0;
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
.comment_fram{
}

@media(max-width:1001px){
  .share_home{
    display: block;
  }
  .nav{
    display: flex;
  }
  .new_inputbox{
    width: 85vw;
    height:20px;
    margin: 0 auto;
  }
  ul{
    padding: 10px;
  }
}

@media(min-width:768px){
  .small_display{
    display: none;
  }
}


/* カーソルを重ねる要素 */
.tooltip {
  position: relative; /* ツールチップの位置の基準に */
  cursor: pointer; /* カーソルを当てたときにポインターに */
}
.tooltip-text:before {
	content: '';
	position: absolute;
	top: -13px;
	left: 50%;
	margin-left: -7px;
	border: 7px solid transparent;
	border-bottom: 7px solid #fff;
}
/* ツールチップのテキスト */
.tooltip-text {
  opacity: 0; /* はじめは隠しておく */
  visibility: hidden; /* はじめは隠しておく */
  position: absolute; /* 絶対配置 */
  left: 50%; /* 親に対して中央配置 */
  transform: translateX(-50%); /* 親に対して中央配置 */
  bottom: -40px; /* 親要素下からの位置 */
  display: inline-block;
  padding: 5px; /* 余白 */
  white-space: nowrap; /* テキストを折り返さない */
  font-size: 0.8rem; /* フォントサイズ */
  line-height: 1.3; /* 行間 */
  background: #fff; /* 背景色 */
  color: #000; /* 文字色 */
  border-radius: 3px; /* 角丸 */
  transition: 0.3s ease-in; /* アニメーション */
}
/* ホバー時にツールチップの非表示を解除 */
.tooltip:hover .tooltip-text {
  opacity: 1;
  visibility: visible;
}



</style>