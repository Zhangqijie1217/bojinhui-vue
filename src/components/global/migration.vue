<template>
  <div class="migration-view">
    <Bhead :titles="title"></Bhead>
    <nav class="flag-nav border-1px-b border-1px-t">
      <h4>热门国家</h4>
      <Slider class="flag-slider" :isSnap="false" :isMomentum="true" ref="flagSlider" >
        <li class="flag-item" v-for="(country, index) in dataMap" @click="selectCountry(country.id)" :class="{'active': currentId == country.id}">
          <div class="flag-bg" :style="{'background-image': 'url('+country.flagUrl+')'}" v-lazy:background-image="country.flagUrl"></div>
          <p class="country-name">{{country.name}}</p>
        </li>
      </Slider>
    </nav>
    <div class="tab-view">
      <nav class="tab-nav border-1px-b" >
        <h4>{{currentShow.name}}</h4>
        <Slider class="policy" :isSnap="false" :isMomentum="true" ref="policySlider">
          <li @click="selectPolicy(index)" v-for="(item, index) in currentShow.policy" :class="{'active' : index === policyIndex}">{{item.name}}</li>
        </Slider>
      </nav>
      <Scroll class="time-line-wrapper" ref="timeLineScroll">
        <div class="time-line">
          <div v-if="migrateShow">
            <div class="section" v-for="(item, index) in currentShow.policy[policyIndex].content">
              <h4>
                <span>
                  <b></b>
                </span>
                {{item.title}}
              </h4>
              <article :class="{'last': index === currentShow.policy[policyIndex].content.length - 1}">
                <section>
                  <p v-html="item.content"></p>
                </section>
              </article>
            </div>
          </div>
          <article class="choiceness"  v-else>
            <section v-html="dataMap[1].policy[0].content"></section>
          </article>
        </div>
      </Scroll>
    </div>
    <div class="assess-online" v-if="isShowAssess">
      <i class="fonticon icon-close-circled" @click="isShowAssess = false"></i>
      <h2>在线评估</h2>
      <h5>为您制定私人方案</h5>
      <p>伯仲会已为{{userCount}}位用户免费评估</p>
      <div class="join-assess" @click="enterAssess"></div>
    </div>
    <DetaiFooter :focusShow="false" @getInfo="getInfo"></DetaiFooter>
    <Alert v-model="alertShow" :title="'您已预约成功'" :content="'请耐心等待理财师与您联系'"></Alert>
<!--     <transition name="alert-fade">
      <Alert alertTop="您已预约成功" alertText='请耐心等待理财师与您联系' alertBar='确定' @fireclose='showgetInfoConfirm=false' v-show="showgetInfoConfirm"></Alert>
    </transition> -->
  </div>
</template>

<script>
import Bhead from 'base/head/head'
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import { Alert } from 'vux'
import DetaiFooter from 'components/detail-footer/detail-footer'
import { MIGRATIONLIST } from './globalData'
import { choicenessMap } from './flag-map'
import { RESULT_CODE } from 'assets/js/utils'
import { findAssessmentCount, PlanningConsultation } from 'api/global/api-global.js'

export default {
  data () {
    return {
      title: '移民规划',
      dataMap: MIGRATIONLIST,
      data: MIGRATIONLIST,
      currentShow: MIGRATIONLIST[0],
      isShowAssess: true,
      alertShow: false,
      policyIndex: 0,
      currentId: 0,
      userCount: 0,
      showgetInfoConfirm: false
    }
  },
  created () {
    this.currentId = this.$route.params.id
    this.migrateShow = this.isShowAssess = this.$route.params.type

    console.log(this.$route.params)
    if (this.$route.params.type) {
      this.dataMap = MIGRATIONLIST
      this.title = '移民规划'
    } else {
      this.dataMap = choicenessMap
      this.title = '精选置业'
    }

    findAssessmentCount().then((res) => {
      if (res.resultCode === RESULT_CODE) {
        this.userCount = res.result.findAssessmentCount * 3
      }
    })
  },
  mounted () {
    this.selectCountry(this.currentId)
  },
  methods: {
    getInfo () {
      let type = this.migrateShow ? 1 : 2
      PlanningConsultation(type).then((res) => {
        console.log(res)
        if (res.resultCode === RESULT_CODE) {
          this.alertShow = true
        }
      })
    },
    enterAssess () {
      this.$router.push({
        path: `/global/assess?count=${this.userCount}`
      })
    },
    selectCountry (currentId) {
      let selectedCountry = this.data.filter((item) => {
        return item.id === +currentId
      })

      this.$router.replace({
        path: `/global/migration/${currentId}`
      })

      this.scrollTo()
      this.policyIndex = 0
      this.currentId = currentId
      this.currentShow = selectedCountry[0]
    },
    // 选择政策
    selectPolicy (index) {
      this.policyIndex = index
      this.scrollTo()
    },
    _selectedIndex (target) {
      return [].indexOf.call(target.parentNode.children, target)
    },
    // 切换国家或者政策的时候滚动到顶部
    scrollTo (x = 0, y = 0, time = 0) {
      this.$refs.timeLineScroll.scrollTo(x, y, time)
    }
    // calculateSlideDistance () {
    //   let f = document.getElementsByClassName('flag-slider')[0]
    //   let target = f.getElementsByClassName('active')[0]
    //   console.log(target)
    // }
  },
  watch: {
    currentShow () {
      setTimeout(() => {
        this.$refs.policySlider.reload()
        this.$refs.timeLineScroll.refresh()
      }, 20)
    },
    policyIndex () {
      setTimeout(() => {
        this.$refs.timeLineScroll.refresh()
      }, 20)
    }
  },
  components: {
    Bhead,
    Slider,
    Scroll,
    Alert,
    DetaiFooter
  }
}
</script>

<style lang="less">
  @import '../../assets/css/variable.less';
  .migration-view {
    display: flex;
    flex-direction: column;
    position: fixed;
    z-index: 6;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #fff;
    overflow: hidden;
    .assess-online{
      position: fixed;
      z-index: 5;
      left: 50%;
      top: 30%;
      width: 4.94rem;
      height: 3.58rem;
      text-align: center;
      transform: translateX(-50%);
      background: url('../../assets/img/assess_bg.png') center/100% no-repeat;
      .icon-close-circled{
        display: block;
        height: 25px;
        width: 25px;
        position: absolute;
        right: 0.3rem;
        top: 0.1rem;
        color: #dcdcdc;
        font-size: 0.3rem;
      }
      h2{
        margin-top: 0.48rem;
        font-size: 0.46rem;
        line-height: 0.46rem;
        color: #60acf7;
      }
      h5{
        margin-top: 0.36rem;
        font-size: 0.34rem;
        line-height: 0.34rem;
      }
      p{
        margin-top: 0.2rem;
        font-size: 0.24rem;
        line-height: 0.24rem;
        color: #666;
      }
      .join-assess{
        position: absolute;
        bottom: 0.2rem;
        left: 0;
        right: 0;
        margin: auto;
        width: 1.05rem;
        height: 1.05rem;
        border-radius: 50%;
      }
    }
    .flag-nav{
      padding: .31rem 0 .37rem;
      background: #fff;
      z-index: 2;
      h4{
        padding-left: .25rem;
        margin-bottom: .2rem;
        font-size: .32rem;
        font-weight: 100;
      }
      .flag-slider{
        // box-shadow: -2px 0 30px #ccc inset;
        .flag-item{
          display: flex;
          float: left;
          flex-direction: column;
          align-items: center;
          padding: 0 .25rem;
          box-sizing: border-box;
          &.active{
            color: #6ba4ea;
            float: left;
          }
          .flag-bg{
            width: .88rem;
            height: .88rem;
            border-radius: 50%;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
          }
          .country-name{
            margin-top: .18rem;
            font-size: .3rem;
          }
        }
      }
    }
    .tab-view{
      flex: 1;
      position: relative;
      .tab-nav{
        padding-top: .31rem;
        background: #fff;
        z-index: 2;
        box-shadow: 2px 2px 10px #ddd;
        h4{
          padding-left: .25rem;
          margin-bottom: .2rem;
          font-size: .32rem;
          font-weight: 100;
        }
        .policy{
          li{
            float: left;
            box-sizing: border-box;
            padding: 0 0.18rem;
            border-bottom: 4px solid transparent;
            &.active{
              color: #6ba4ea;
              border-bottom: 4px solid #6ba4ea;
            }
          }
        }
      }
      .time-line-wrapper{
        padding: .2rem .25rem 0;
        position: absolute;
        // z-index: 1;
        top: 1.6rem;
        bottom: .8rem;
        left: 0;
        right: 0;
        .section{
          padding: 0;
          h4{
            line-height: 16px;
            span{
              display: inline-block;
              vertical-align: middle;
              position: relative;
              margin-right: 5px;
              width: 16px;
              height: 16px;

              border-radius: 50%;
              border: 1px solid #6ba4ea;
              b{
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                display: block;
                margin: auto;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #6ba4ea;
              }
            }
          }
          article{
            margin: 0 8px;
            padding: 0 0.24rem;
            border-left: 1px solid #6ba4ea;
            &.last{
              border-left: 1px solid transparent;
            }
            section{
              padding: 0.11rem 0 0.59rem;
            }
          }
        }
      }
    }
  }
</style>
