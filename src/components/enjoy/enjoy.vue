<template>
  <div class="enjoy">
  <headerview :titles='titles'>{{titles}}</headerview>
    <div class="enjoy-options">
      <ul>
        <li @click="showCityMemu($event)"><span :class="{ 'class-a': isA, 'class-b': isB}">{{cityName}}</span></li>
        <li @click="showCationMemu"><span :class="{ 'class-c': isC, 'class-d': isD}">{{cationName}}</span></li>
        <li @click="showCingMemu"><span :class="{ 'class-e': isE, 'class-f': isF}">{{cingName}}</span></li>
      </ul>
    </div>
    <Scroll class="enjoy-content"
            :data="currentList"
            @pullingUp="pullingUp"
            :pullUpLoad="true">
      <section>
        <div class="enjoy-swiper">
          <swiper loop auto :height="demo06_height" 
                            :list="bannerList" 
                            :index="demo06_index" 
                            @on-index-change="demo06_onIndexChange">
          </swiper>
        </div>
        <div class="enjoy-lize">
          <p>乐享推荐</p>
          <p>品质生活从这一刻开始</p>
        </div>
        <!-- <div class="enjoy-line"></div> -->
        <div class="enjoy-detail">
          <dl class="enjoy-nav" v-for="(item, index) in enjoyLifeList" 
                                :data-id="item.code" 
                                @click="getEnjoyDetail(index, item.code)"
                                :key="index">
            <dt>
               <img class="fig-img" v-lazy="item.imageUrl">
            </dt>
            <dd class="nav-title">
              {{item.name}}
            </dd>
            <dd class="nav-text">
              <i>{{item.cityName}}</i>
              <i>{{item.startDate}} {{item.startHour}}</i>
              <i>预约人数：{{item.countNum}}</i>
            </dd>
            <dd>
              <span v-if="item.attention === 'N'" @click.stop="onfocus($event, index)" :data-id="item.code">
                <i class="fonticon icon-plus-empty"></i>关注
              </span>
              <span v-else @click.stop="onfocus($event, index)" :data-id="item.code">
                已关注
              </span>
            </dd>
          </dl>
        </div>
        <p v-if="currentList.length === 0" class="no-more">没有更多了~</p>
      </section>
    </Scroll>
    <transition name="global-slide"><router-view></router-view></transition>
    <footerview></footerview>
    <transition name="city-slide">
      <cityview v-show="toggleCity" :docTypeIndex="docTypeIndex" @hideSelect="hideCity"></cityview>
    </transition>
    <transition name="city-slide">
      <cationview v-show="toggleCation" :cationIndex="cationIndex" @hideSelect="hideCation">
      </cationview>
    </transition>
    <transition name="city-slide">
    <cingview v-show="toggleCing" :cingIndex="cingIndex" @hideSelect="hideCing"></cingview>
    </transition>
  </div>
</template>

<script>
import footerview from 'base/footer/footer.vue'
import headerview from 'base/head/head.vue'
import cityview from './check-city.vue'
import cationview from './check-cation.vue'
import cingview from './check-cing.vue'
import Scroll from 'base/scroll/scroll'
import { Swiper, GroupTitle, SwiperItem } from 'vux'
import {findActivityInfos, findActivityBanners} from 'api/enjoy/api-enjoy'
import { attentionOneProject, cancelAttention } from 'api/global/api-global.js'
import { RESULT_CODE, hasUToken } from 'assets/js/utils'

export default {
  data () {
    return {
      titles: '乐享生活',
      bannerList: [],
      enjoyList: [],
      currentList: [],
      pageNum: 1,
      cityId: '',
      sortBy: '',
      typeId: '',

      toggleCity: false,
      toggleCation: false,
      toggleCing: false,
      docTypeIndex: 0,
      cationIndex: 0,
      cingIndex: 0,

      demo06_index: 0,
      demo06_height: '3.6rem',
      cityName: '' || '城市',
      cationName: '' || '分类',
      cingName: '' || '排序',
      isA: true,
      isB: false,
      isC: true,
      isD: false,
      isE: true,
      isF: false,

      isRrue: true,
      isLogin: false
    }
  },
  created () {
    this._findActivityInfos()
    this._findActivityBanners()
  },
  computed: {
    enjoyLifeList () {
      return this.$store.getters.enjoyList
    }
  },
  methods: {
    _findActivityInfos () {
      let obj = {
        cityId: this.cityId,
        pageNum: this.pageNum,
        sortBy: this.sortBy,
        typeId: this.typeId
      }

      findActivityInfos(obj).then((res) => {
        if (res.resultCode === RESULT_CODE) {
          this.enjoyList = this.currentList = res.result.activitylist
          this.$store.commit('SET_ENJOY_LIST', this.enjoyList)
          // console.log(res)
          // console.log(this.data)
        }
      })
    },
    _findActivityBanners () {
      findActivityBanners().then((res) => {
        if (res.resultCode === RESULT_CODE) {
          this.bannerList = res.result.ativityBannerList
          console.log(this.bannerList)
          // console.log(res)
        }
      })
    },
    pullingUp () {
      this._findActivityInfos()
    },
    showCityMemu (e) {
      this.toggleCity = !this.toggleCity
      this.toggleCation = false
      this.toggleCing = false
      this.isA = !this.isA
      this.isB = !this.isB
      this.isC = true
      this.isD = false
      this.isF = false
      this.isE = true
    },
    showCationMemu () {
      this.toggleCation = !this.toggleCation
      this.toggleCity = false
      this.toggleCing = false
      this.isC = !this.isC
      this.isD = !this.isD
      this.isA = true
      this.isB = false
      this.isF = false
      this.isE = true
    },
    showCingMemu () {
      this.toggleCing = !this.toggleCing
      this.toggleCity = false
      this.toggleCation = false
      this.isE = !this.isE
      this.isF = !this.isF
      this.isA = true
      this.isB = false
      this.isC = true
      this.isD = false
    },
    // 城市排序
    hideCity (docTypeIndex, cityName, val) {
      // 设置城市id
      this.cityId = val

      if (docTypeIndex !== -1) {
        this.docTypeIndex = cityName[docTypeIndex].ENTR_VAL
        this.cityName = cityName[docTypeIndex].ENTR_DESC
        this.isA = true
        this.isB = false
      }
      this.toggleCity = false
    },
    // 分类排序
    hideCation (cationIndex, cationName, val) {
      // 设置分类id
      this.typeId = val
      if (cationIndex !== -1) {
        this.cationIndex = cationName[cationIndex].ENTR_VAL
        this.cationName = cationName[cationIndex].ENTR_DESC
        this.isC = true
        this.isD = false
      }
      this.toggleCation = false
    },
    // 人气 时间 排序
    hideCing (cingIndex, cingName, val) {
      // 设置排序方式
      this.typeId = val
      if (cingIndex !== -1) {
        this.cingIndex = cingName[cingIndex].ENTR_VAL
        this.cingName = cingName[cingIndex].ENTR_DESC
        this.isE = true
        this.isF = false
      }
      this.toggleCing = false
    },
    demo06_onIndexChange (index) {
      this.demo06_index = index
      // this.$nextTick(() => {
      //   this.$refs.swiper.xheight = '100px'
      // })
    },
    getEnjoyDetail (index, id) {
      this.$store.commit('SET_ENJOY_LIST_INDEX', index)
      this.$router.push({
        path: `/enjoy/enjoydetail?id=${id}`
      })
    },
    checkLogin () {
      if (!hasUToken()) {
        this.$store.commit('SHOW_LOGIN_VIEW', true)
        return false
      }

      return true
    },
    onfocus (e, index) {
      // 点击关注根据有无utoken进行判断是否登录，如果没登录则提弹出登录页
      if (!this.checkLogin()) {
        return
      }

      let projectId = e.target.getAttribute('data-id')
      let idx = index
      let focusState = this.currentList[idx].attention
      console.log(focusState)
      if (focusState === 'Y') {
        this._cancelAttention(projectId, idx)
      } else {
        this._attentionOnProject(projectId, idx)
      }
    },
    _attentionOnProject (projectId, idx) {
      attentionOneProject(projectId, '', '', 2).then((res) => {
        console.log(res)
        if (res.resultCode === RESULT_CODE) {
          this.$store.dispatch('enjoyStatusChange', {
            index: idx,
            status: 'Y'
          })
          // this.$store.commit('SET_GLO_LIST_INDEX', idx)
          // this.$store.commit('SET_ATTENTION_STATUS', 'Y')
          // this.currentList[idx].attention = 'Y'
        }
      })
    },
    _cancelAttention (projectId, idx) {
      cancelAttention(projectId, 2).then((res) => {
        console.log(res)
        if (res.resultCode === RESULT_CODE) {
          this.$store.dispatch('enjoyStatusChange', {
            index: idx,
            status: 'N'
          })
        }
      })
    }
  },
  components: {
    footerview,
    headerview,
    cityview,
    cationview,
    cingview,
    Swiper,
    SwiperItem,
    GroupTitle,
    Scroll
  },
  watch: {
    cityId () {
      this._findActivityInfos()
    },
    sortBy () {
      this._findActivityInfos()
    },
    typeId () {
      this._findActivityInfos()
    }
  }
}
</script>

<style lang="less">
html,body{
  background:#fff;
  position: relative;
}
.enjoy{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 1rem;
  z-index: 2;
  .enjoy-content{
    position: absolute;
    top: 1.88rem;
    bottom: 0;
    left: 0;
    right: 0;
    // z-index: 1;
    .enjoy-lize{
    width: 100%;
    height: 1.1rem;
    text-align: center;
      p{
        color:#707070;
      }
      p:first-child{
        font-style: normal;
        font-size: 0.32rem;
        line-height: 0.5rem;
        font-weight: bold;
        color: #333;
      }
    }
  }

  .enjoy-options{
    position: relative;
    width: 100%;
    height: 1rem;
    border-top:0.01rem solid #e9e9e9;
    background:#fff;
    z-index: 2;
    ul{
      width: 100%;
      height: 0.5rem;
      line-height: 0.5rem;
      font-size: 0.28rem;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 0.2rem;
      li{
        flex: 1;
        position: relative;
        text-align: center;
        &:not(:last-child) {
          &:before{
            content: '';
            position: absolute;
            right: 0;
            top: 0;
            width: 1px;
            height: 100%;
            background-color: #e9e9e9;
            transform: scaleX(.5)
          }
        }
        span{
          padding-right: 0.3rem;
        }
        span.class-a,span.class-c,span.class-e{
          background: url('../../assets/img/down.png') no-repeat right 59%;
          background-size:0.2rem 0.12rem;
        }
        span.class-b,span.class-d,span.class-f{
          background: url('../../assets/img/up.png') no-repeat right 59%;
          background-size:0.2rem 0.12rem;
        }
      }


      li:last-child{
        border: none;
      }
      li.checkedel{
        color: red;
      }
    }
  }
  .enjoy-swiper{
    width: 90%;
    margin: 0 auto;
  }
  .no-more {
    text-align: center;
    margin-top: 1rem;
    color: #ccc;
  }
  .enjoy-line{
    width: 100%;
    height: 0.2rem;
    background:#fbf9fe;
  }
  .enjoy-detail{
    .enjoy-nav{
      position: relative;
      width: 90%;
      margin: 0 auto;
      border-bottom: 1px solid #e9e9e9;
      dt{
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 3.6rem;
        // line-height: 3.6rem;
        text-align: center;
        overflow: hidden;
        img[lazy="loaded"]{
          width: 100%;
        }
        // img[lazy="error"]{

        // }
      }
      dd.nav-title{
        font-weight: bold;
        font-size:0.3rem;
        color: #414141;
        line-height: 0.58rem;
      }
      dd.nav-text{
        font-size:0.28rem;
        color: #adadad;
        margin-bottom: 0.3rem;
        i:nth-child(2){
          margin:0 0.2rem;
        }
      }
      dd:last-child{
        font-size: 0.24rem;
        color: #70b1f2;
        border:1px solid #eeeeee;
        border-radius: 0.12rem;
        position: absolute;
        right: 0.08rem;
        bottom:0.5rem;
        line-height: 0.44rem;
        span{
          padding: 2px 0.1rem;
          display: block;
          .icon-plus-empty{
            font-weight: 600;
            vertical-align: top;
          }
        }
      }
    }
  }
}
.global-slide-enter-active, .global-slide-leave-active{
  transition: all 0.5s ease;
}
.global-slide-enter, .global-slide-leave-active{
  transform: translate3d(100%, 0, 0);
}
.city-slide-enter-active, .city-slide-leave-active {
  transition: opacity .5s
}
.city-slide-enter, .city-slide-leave-to  {
  opacity: 0
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
