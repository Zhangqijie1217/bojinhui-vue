<template>
  <div class="global">
    <Bhead :titles="title"></Bhead>
    <div class="tab">
      <span @click.prevent="tab" :class="isHotspotShow ? 'active' : ''">投资热点</span>
      <span @click.prevent="tab" :class="isSettingShow ? 'active' : ''">资产配置</span>
      <p class="slider-bar">
        <span class="slider" ref="slider">
          <b></b>
        </span>
      </p>
    </div>
    <transition name="fade">
      <Scroll class="global-content" ref="scroll" :data="currentList" v-show="isHotspotShow" @pullingUp="pullingUp" :pullUpLoad="true">
        <ul class="hotspot" >
          <li class="border-1px-b" v-for="(item, index) in gloList" @click="getDetail(index, item.code)" >
            <div class="hotspot-img">
              <img v-lazy="item.imageUrl">
            </div>
            <div class="hotspot-toolbar">
              <p class="hotspot-intro">{{item.name}}</p>
              <p class="onfocus" >
                <span v-if="item.attention === 'N'" @click.stop="onfocus($event, index)" :data-id="item.code"><i class="fonticon icon-plus-empty"></i>关注</span>
                <span v-else @click.stop="onfocus($event, index)" :data-id="item.code">已关注</span>
              </p>
            </div>
          </li>
        </ul>
      </Scroll>
    </transition>
    <transition name="fade">
      <Scroll class="global-content" v-show="isSettingShow" :data="currentList" ref="scroll2">
        <div class="setting">
          <div class="router-nav">
            <span class="nav-button" @click="migrateMapFn(0)">移民规划</span>
            <span class="nav-button" @click="enterLifePlan">生命规划</span>
            <span class="nav-button">家族信托</span>
            <span class="nav-button">子女教育</span>
          </div>
          <div class="country-section">
            <h4><span>移民国家</span><i @click="migrateMapFn(0)">查看更多></i></h4>
            <ul class="country-list">
              <li class="country-item" v-for="country in migrateMap" @click="migrateMapFn(country.id)">
                <div class="country-flag" :style="{'background-image': 'url('+country.flagUrl+')'}" v-lazy:background-image="country.flagUrl">
                  <!-- <img :src="country.flagUrl" width="44" height="44"> -->
                </div>
                <p class="country-name">{{country.name}}</p>
              </li>
            </ul>
          </div>
          <div class="selection-section">
            <h4><span>置业精选</span><i @click="choicenessMapFn(0)">查看更多></i></h4>
            <ul class="country-list">
              <li class="country-item" v-for="country in choicenessMap" @click="choicenessMapFn(country.id)">
                <div class="country-flag" :style="{'background-image': 'url('+country.flagUrl+')'}" v-lazy:background-image="country.flagUrl">
                </div>
                <p class="country-name">{{country.name}}</p>
              </li>
            </ul>
          </div>
          <div class="setting-section">
            <h4><span>资产配置</span><i>查看更多></i></h4>
            <ul>
              <li class="file-download"><a :href="propertyReports.url">{{propertyReports.name}}</a></li>
            </ul>
          </div>
        </div>
      </Scroll>
    </transition>
    <transition name="global-slide" mode="in-out">
      <router-view :dataMap="currentFlagMap"></router-view>
    </transition>
    <!-- <footerview></footerview> -->
  </div>
</template>
<script>
import Bhead from 'base/head/head'
import Scroll from 'base/scroll/scroll'
// import footerview from 'base/footer/footer.vue'
import { migrateMap, choicenessMap } from './flag-map'
import { RESULT_CODE, hasUToken } from 'assets/js/utils'
import { findProjectList, attentionOneProject, cancelAttention, findAssetsReports } from 'api/global/api-global.js'

export default {
  data () {
    return {
      title: '全球资产配置',
      isSettingShow: false,
      isHotspotShow: true,
      projectList: [],
      data: [],
      answers: [],
      currentList: [],
      migrateMap: migrateMap,
      choicenessMap: choicenessMap,
      currentFlagMap: [],
      propertyReports: {}
    }
  },
  created () {
    this.getProjectList()
    this.findAssetsReports()
    this.currentPage = 1
    this.list = []
  },
  computed: {
    gloList () {
      return this.$store.getters.gloList
    }
  },
  methods: {
    pullingUp () {
      this.getProjectList(++this.currentPage)
    },
    findAssetsReports () {
      findAssetsReports().then((res) => {
        if (res.resultCode === RESULT_CODE) {
          this.propertyReports = res.result[0]
        }
      })
    },
    enterLifePlan () {
      this.$router.push({
        path: '/global/life'
      })
    },
    getProjectList (pageIndex) {
      findProjectList(pageIndex).then((res) => {
        let result = res
        console.log(res)
        if (result.resultCode === RESULT_CODE) {
          if (pageIndex > result.result.totalPage) {
            return
          }

          this.projectList = this.currentList = this.projectList.concat(result.result.projectlist)
          // 全球
          this.$store.commit('SET_GLO_LIST', this.projectList)

          if (pageIndex > 1) {
            this.$refs.scroll.finishPullUp()
          }
        }
      })
    },
    tab (e) {
      let element = e.target
      let index = [].indexOf.call(element.parentNode.children, element)

      if (index === 1) {
        this.isSettingShow = true
        this.isHotspotShow = false
        this.currentList = []
        this.$refs.scroll2.refresh()
      } else {
        this.isSettingShow = false
        this.isHotspotShow = true
        this.currentList = this.projectList
        this.$refs.scroll.refresh()
      }
      // sliderbar 滑动距离
      this.$refs.slider.style.transform = `translate3D(${window.innerWidth / 2 * index}px, 0, 0)`
    },
    getDetail (index, id) {
      this.$store.commit('SET_GLO_LIST_INDEX', index)
      this.$router.push({
        path: `/global/detail?id=${id}`
      })
    },
    // 移民规划
    migrateMapFn (id) {
      this.currentFlagMap = this.migrateMap

      this.$router.push({
        name: 'migration',
        // path: `/global/migration/${id}`
        params: {
          id: `${id}`,
          type: true,
          title: '移民国家'
        }
      })
    },
    choicenessMapFn (id) {
      this.currentFlagMap = this.choicenessMap

      this.$router.push({
        name: 'migration',
        // path: `/global/migration/${id}`,
        params: {
          id: `${id}`,
          type: false,
          title: '置业精选'
        }
      })
    },
    onfocus (e, index) {
      // 点击关注根据有无utoken进行判断是否登录，如果没登录则提弹出登录页
      if (!this.checkLogin()) {
        return
      }

      let projectId = e.target.getAttribute('data-id')
      let idx = index
      let focusState = this.currentList[idx].attention

      if (focusState === 'Y') {
        this._cancelAttention(projectId, idx)
      } else {
        this._attentionOnProject(projectId, idx)
      }
    },
    checkLogin () {
      if (!hasUToken()) {
        this.$store.commit('SHOW_LOGIN_VIEW', true)
        return false
      }

      return true
    },
    _attentionOnProject (projectId, idx) {
      attentionOneProject(projectId).then((res) => {
        if (res.resultCode === RESULT_CODE) {
          this.$store.dispatch('gloStatusChange', {
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
      cancelAttention(projectId).then((res) => {
        if (res.resultCode === RESULT_CODE) {
          this.$store.dispatch('gloStatusChange', {
            index: idx,
            status: 'N'
          })
          // this.$store.commit('SET_GLO_LIST_INDEX', idx)
          // this.$store.commit('SET_ATTENTION_STATUS', 'N')
          // this.currentList[idx].attention = 'N'
        }
      })
    }
  },
  components: {
    // footerview,
    Bhead,
    Scroll
  }
}
</script>

<style lang="less">
  .global {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 1rem;
    z-index: 2;
    background-color: #fff;
    .tab{
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      content-justify: center;
      height: 0.76rem;
      text-align: center;
      font-size: 0.28rem;
      color: #828282;
      background: #fff;
      &.tab:before{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: #e9e9e9;
        transform: scaleY(.5);
      }
      &.tab:after{
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: #e9e9e9;
        transform: scaleY(.5);
      }
      &.active{
        color: #333;
      }
      .slider-bar{
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 4px;
        .slider{
          display: block;
          width: 50%;
          height: 100%;
          transition: all .3s ease;
          b{
            display: block;
            margin: auto;
            width: 50%;
            height: 100%;
            background-color: #6ba4ea;
          }
        }
      }
      span{
        flex: 1;
        &.active{
          color: #6ba4ea;
        }
      }
    }
    .global-content{
      position: absolute;
      top: 1.64rem;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: hidden;
      .country-section,
      .selection-section,
      .setting-section{
        margin-top: 0.34rem;
        .file-download{
          margin-top: 5px;
          a{
            display: block;
            color: #333;
          }
        }
        h4{
          display: flex;
          font-size: 0.32rem;
          font-weight: 100;
          span{
            flex: 1;
          }
          i{
            font-size: 0.24rem;
            color: #999;
          }
        }
        .country-list{
          // justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          display: flex;
          .country-item{
            margin-top: 0.28rem;
            flex: 0 0 25%;
            // display: inline;
            width: 25%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .country-flag{
              background-position: center;
              background-repeat: no-repeat;
              background-size: cover;
              width: 0.88rem;
              height: 0.88rem;
              border-radius: 50%;
              overflow: hidden;
            }
            .country-name{
              margin-top: 0.3rem;
              font-size: 0.3rem;
              line-height: 0.3rem;
            }
          }
        }
      }
      .setting{
        padding: 0 0.24rem;
        .router-nav{
          padding-top: 0.3rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .nav-button{
            flex: 0 0 1.37rem;
            width: 1.37rem;
            height: 0.53rem;
            font-size: 0.22rem;
            text-align: center;
            line-height: 0.53rem;
            // padding: 0.25rem 0.17rem;
            border-radius: 23px;
            color: #6ba4ea;
            border: 1px solid #6ba4ea;
          }
        }
      }
      .hotspot{
        padding: 0 0.3rem;
        li{
          padding: 0.24rem 0 0.2rem 0;
          .hotspot-img{
            overflow: hidden;
            height: 3.6rem;
            line-height: 3.6rem;
            text-align: center;
            img[lazy=loading], img[lazy=error]{
              margin: auto;
            }
            img[lazy=loaded]{
              width: 100%;
            }
          }
          .hotspot-toolbar{
            display: flex;
            align-items: center;
            margin-top: 0.18rem;
            .hotspot-intro{
              flex: 1;
              font-size: 0.28rem;
            }
            .onfocus{
              margin-left: 0.25rem;
              padding: 2px 0.1rem;
              color: #5aa5f0;
              font-size: 0.2rem;
              text-align: center;
              line-height: 0.4rem;
              border-radius: 5px;
              border: 1px solid #eee;
              .icon-plus-empty{
                height: 16px;
                font-weight: 600;
                font-size: 0.2rem;
                vertical-align: top;
              }
              span{
                display: block;
              }
            }
          }
          &.border-1px-b{
            position: relative;
            &:after{
              content: "";
              position: absolute;
              bottom: 0;
              width: 100%;
              height: 1px;
              background-color: #e9e9e9;
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
  }
</style>
