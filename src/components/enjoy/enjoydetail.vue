<template>
  <div class="detial-box-cantainer">
    <headerview :titles='titles'>{{titles}}</headerview>
    <Scroll class="enjoy-detail-content" :data="[]">
      <section>
        <div class="detial-box-swiper">
          <swiper loop auto :list="bannerList" :index="demo06_index" @on-index-change="demo06_onIndexChange"></swiper>
        </div>
        <div class="detail-box-text">
          <p>{{activityInfo.name}}</p>
          <p>珍爱时刻Botanica植物餐厅</p>
          <p>{{activityInfo.cityName}}</p>
          <p>{{activityInfo.startTime}}至{{activityInfo.endTime}}</p>
          <p>{{activityInfo.address}}</p>
          <p>{{activityInfo.bespeakCount}}人已预约</p>
        </div>
        <div class="enjoy-recommend">
          <h4>推荐理由</h4>
          <p v-html="activityInfo.context"></p>
        </div>
      </section>
    </Scroll>
    <div class="detail-footer">
      <div class="more-info" @click="booking" >
        预约活动
      </div>
      <div class="add-focus" @click="addFocus">
        <span v-if="isFocus">已关注</span>
        <span v-else><i class="fonticon icon-plus-empty">关注</i></span>
      </div>
    </div>
<!--      <div class="enjoy-box-footer">
       <button @click="goaActivity">预约活动

       </button>
       <p @click='checked'>
        <i v-if="isShow" class="fonticon icon-plus-empty"></i>
        <i v-else class="icon-small">已</i>
         关注
       </p>
     </div> -->
    <Alert v-model="alertShow" :title="alertTitle" :content="alertContent"></Alert>
  </div>
</template>

<script>
/* created by fanling in 20171127 */
import headerview from 'base/head/head.vue'
import { Swiper, GroupTitle, SwiperItem, Alert } from 'vux'
import Scroll from 'base/scroll/scroll'
import { findActivityDetailInfo,
         findActivityBanners } from 'api/enjoy/api-enjoy'
import { attentionOneProject,
         cancelAttention,
         bespeakOneProject }
from 'api/global/api-global.js'
import { RESULT_CODE, hasUToken } from 'assets/js/utils'

const baseList = [{
  url: 'javascript:',
  img: 'https://static.vux.li/demo/1.jpg',
  title: ''
}, {
  url: 'javascript:',
  img: 'https://static.vux.li/demo/2.jpg',
  title: ''
}, {
  url: 'javascript:',
  img: 'https://static.vux.li/demo/3.jpg',
  title: '',
  fallbackImg: 'https://static.vux.li/demo/3.jpg'
}]
const urlList = baseList.map((item, index) => ({
  url: 'http://m.baidu.com',
  img: item.img,
  fallbackImg: item.fallbackImg,
  title: ''
}))
export default {
  data () {
    return {
      titles: '乐享生活详情',
      isFocus: true,
      activityInfo: {},
      data: [],
      alertShow: false,
      alertTitle: '',
      alertContent: '',
      reservation: '',
      bannerList: [],

      demo06_list: urlList,
      demo06_index: 0,
      showModal: false,
      isShow: ''
    }
  },
  created () {
    this.findActivityDetailInfo()
    this._findActivityBanners()
  },
  methods: {
    _findActivityBanners () {
      findActivityBanners().then((res) => {
        if (res.resultCode === RESULT_CODE) {
          console.log(res)
          this.bannerList = res.result.ativityBannerList
        }
      })
    },
    checkLogin () {
      if (!hasUToken()) {
        this.$store.commit('SHOW_LOGIN_VIEW', true)
        return false
      }

      return true
    },
    addFocus () {
      if (!this.checkLogin()) {
        return
      }

      if (!this.isFocus) {
        attentionOneProject(this.code, '', '', 2).then((res) => {
          if (res.resultCode === RESULT_CODE) {
            this.isFocus = true
            console.log(res)
            this.$store.commit('SET_ENJOY_ATTENTION_STATUS', 'Y')
          }
        })
      } else {
        cancelAttention(this.code, 2).then((res) => {
          console.log(res)
          if (res.resultCode === RESULT_CODE) {
            this.isFocus = false
            console.log(res)
            // this.$store.getters.currentStatus.attention = 'N'
            this.$store.commit('SET_ENJOY_ATTENTION_STATUS', 'N')
          }
        })
      }
    },
    booking () {
      if (!this.checkLogin()) {
        return
      }
      console.log(this.reservation)
      if (this.reservation === 'true') {
        this.alertShow = true
        this.alertTitle = '您已预约过'
        this.alertContent = '请耐心等待理财师与您联系'
        return
      }

      bespeakOneProject(this.code, '', '', 2).then((res) => {
        console.log(res)
        if (res.resultCode === RESULT_CODE) {
          this.reservation = 'true'
          this.alertTitle = '您已预约成功'
          this.alertContent = '请耐心等待理财师与您联系'
          this.alertShow = true
        }
      })
    },
    findActivityDetailInfo () {
      this.code = this.$route.query.id

      // console.log(this.$route)
      findActivityDetailInfo(this.code).then((res) => {
        if (res.resultCode === RESULT_CODE) {
          this.data = res.result
          this.activityInfo = res.result.activityInfo
          this.reservation = res.result.reservation === 'N' ? 'false' : 'true'
          res.result.attention === 'N' ? this.isFocus = false : this.isFocus = true
          console.log(this.data)
        }
      })
    },
    demo06_onIndexChange (index) {
      this.demo06_index = index
    },
    goaActivity () {
      this.showModal = true
    },
    checked () {
      if (this.isShow) {
        this.isShow = false
      } else {
        this.isShow = true
      }
    }
  },
  components: {
    headerview,
    Swiper,
    SwiperItem,
    GroupTitle,
    Scroll,
    Alert
  }
}
</script>

<style lang="less">
.detial-box-cantainer{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #fff;
  z-index: 2;
  .detail-footer{
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    height: 0.8rem;
    line-height: 0.8rem;
    text-align: center;
    font-size: 0.3rem;
    width: 100%;
    .more-info{
      flex: 1;
      color: #fff;
      background-color: #6ba4ea;
    }
    .add-focus{
      flex: 0 0 2.1rem;
      width: 2.1rem;
      color: #6ba4ea;
      background: #fff;
      span{
        display: block;
      }
      .icon-plus-empty{
        line-height: 0.3rem;
        font-size: 0.3rem;
      }
    }
  }
  .enjoy-detail-content{
    position: absolute;
    top: 0.88rem;
    bottom: 0.8rem;
    left: 0;
    right: 0;
    .detail-box-text{
    background:#fff;
    p{
      text-align: center;
      color: #333;
    }
    p:nth-child(1){
      line-height: 0.5rem;
    }
    p:nth-child(3){
      line-height: 0.6rem;
      margin-top: 0.2rem;
    }
    p:nth-child(6){
      line-height: 0.86rem;
    }
   }
  }

  .enjoy-recommend{
    background:#fff;
    margin: 0.2rem auto;
    width: 90%;
    overflow:hidden;
    h4{
      font-style: normal;
      font-weight: normal;
      font-size: 0.32rem;
      line-height: 0.78rem;
      text-align: center;
    }
    p{
      margin: 0 auto;
    }
    img{
      height: 3.6rem;
      width: 100%;
      margin: 0.2rem 0;
    }
  }
  .enjoy-box-footer{
    position: fixed;
    left: 0;
    bottom:0;
    width: 100%;
    height: 0.8rem;
    background:#fff;
    button{
      border:0;
      width: 72%;
      height: 100%;
      line-height: 100%;
      color: #fff;
      background:#6ba4ea;
      float: left;
    }
    p{
      width: 27%;
      color:#6ba4ea;
      float: left;
      text-align: center;
      border-top: 1px solid #e9e9e9;
      line-height: 0.8rem;
      position: relative;
      i{
        display: block;
        position: absolute;
        top:0;
        left: 15%;
        color: #6ba4ea;
        font-size: 0.46rem;
        font-weight: bolder;
      }
      i.icon-small{
        display: block;
        font-size: 0.3rem;
        font-weight: normal;
        position: absolute;
        top:1%;
        left: 20%;
      }
    }
  }
}
/* vux style */
.copyright {
  font-size: 12px;
  color: #ccc;
  text-align: center;
}
.text-scroll {
  border: 1px solid #ddd;
  border-left: none;
  border-right: none;
}
.text-scroll p{
  font-size: 12px;
  text-align: center;
  line-height: 30px;
}
.black {
  background-color: #000;
}
.title{
  line-height: 100px;
  text-align: center;
  color: #fff;
}
.animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}
.vux-indicator.custom-bottom {
  bottom: 30px;
}
@-webkit-keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}
.fadeInUp {
  animation-name: fadeInUp;
}
.swiper-demo-img img {
  width: 100%;
}
// .vux-slider > .vux-indicator, .vux-slider .vux-indicator-right{
//   position: absolute;
//   left: 45%;
//   bottom: 0.15rem;
// }
/*.vux-slider > .vux-indicator > a > .vux-icon-dot.active, .vux-slider .vux-indicator-right > a > .vux-icon-dot.active{
  background-color: #fff;
}
.vux-slider > .vux-indicator > a > .vux-icon-dot, .vux-slider .vux-indicator-right > a > .vux-icon-dot{
  background-color: #d6d6d6;
  width: 0.16rem;
  height: 0.17rem;
  border-radius: 0.08rem;
}*/
</style>

