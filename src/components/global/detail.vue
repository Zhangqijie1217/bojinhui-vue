<template>
  <div class="detail-view">
    <Bhead :titles="content.name"></Bhead>
    <Scroll class="detail-content" :data="data">
      <article class="article">
        <section class="overview">
          <img :src="content.imageUrl">
          <div class="overview-text">
            <h3>{{content.name}}</h3>
            <h4>发布时间：<time>{{content.createDate}}</time></h4>
            <p v-html="context"></p>
          </div>
        </section>
<!--         <section class="project" v-for="item in 4">
          <img src="../../assets/img/banner2.png">
          <div class="project-text">
            <h2>【伦敦富人区稀缺项目推荐】</h2>
            <ul>
              <li>项目名称：莎莉文半岛高级公寓</li>
              <li>地址：英国伦敦富姆勒区</li>
            </ul>
            <p></p>
          </div>
        </section> -->
      </article>
    </Scroll>
    <DetaiFooter @getInfo="getInfo" @focus="focus" :isFocus="isFocus"></DetaiFooter>
    <Alert v-model="alertShow" :title="alertTitle" :content="alertContent"></Alert>
    <!-- <Alert alertTop="您已预约成功" alertText='请耐心等待理财师与您联系' alertBar='确定' @fireclose='showgetInfoConfirm=false' v-show="showgetInfoConfirm"></Alert> -->
  </div>
</template>
<script>
import Bhead from 'base/head/head'
import Scroll from 'base/scroll/scroll'
import DetaiFooter from 'components/detail-footer/detail-footer'
import { XDialog, Alert } from 'vux'
import { RESULT_CODE, hasUToken } from 'assets/js/utils'
import { findProjectDetailInfo,
        attentionOneProject,
        cancelAttention,
        bespeakOneProject }
from 'api/global/api-global.js'

export default {
  data () {
    return {
      title: '',
      data: [],
      code: '',
      content: {},
      context: '',
      result: {},
      alertShow: false,
      alertTitle: '',
      alertContent: '',
      reservation: '',
      isFocus: false,
      showgetInfoConfirm: false
    }
  },
  created () {
    this.getDetail()
  },
  methods: {
    checkLogin () {
      if (!hasUToken()) {
        this.$store.commit('SHOW_LOGIN_VIEW', true)
        return false
      }

      return true
    },
    getDetail () {
      let id = this.$route.query.id

      findProjectDetailInfo(id).then((res) => {
        if (res.resultCode === RESULT_CODE) {
          console.log(res)
          this.data = []
          this.content = res.result.projectInfo
          this.context = res.result.projectInfo.context
          this.result = res.result
          this.code = res.result.projectInfo.code
          res.result.attention === 'N' ? this.isFocus = false : this.isFocus = true
          this.reservation = res.result.reservation === 'N' ? 'false' : 'true'
        }
      })
    },
    getInfo () {
      if (!this.checkLogin()) {
        return
      }

      if (this.reservation === 'true') {
        this.alertShow = true
        this.alertTitle = '您已预约过'
        this.alertContent = '请耐心等待理财师与您联系'
        return
      }

      bespeakOneProject(this.code).then((res) => {
        if (res.resultCode === RESULT_CODE) {
          this.reservation = res.reult.reservation === 'N' ? 'false' : 'true'
          this.alertTitle = '您已预约成功'
          this.alertContent = '请耐心等待理财师与您联系'
          this.alertShow = true
        }
      })
    },
    focus () {
      if (!this.checkLogin()) {
        return
      }

      if (!this.isFocus) {
        attentionOneProject(this.code).then((res) => {
          if (res.resultCode === RESULT_CODE) {
            this.isFocus = true
            console.log(this.$store.getters)
            this.$store.commit('SET_ATTENTION_STATUS', 'Y')
          }
        })
      } else {
        cancelAttention(this.code).then((res) => {
          if (res.resultCode === RESULT_CODE) {
            this.isFocus = false
            // this.$store.getters.currentStatus.attention = 'N'
            this.$store.commit('SET_ATTENTION_STATUS', 'N')
          }
        })
      }
    }
  },
  components: {
    Bhead,
    Alert,
    DetaiFooter,
    Scroll,
    XDialog
  }
}
</script>

<style lang="less">
.detail-view{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 2;
  .detail-content {
    position: absolute;
    top: 0.88rem;
    // bottom: 1rem;
    bottom: .8rem;
    left: 0;
    right: 0;
    .article{
      .overview,
      .project{
        img{
          width: 100%;
        }
        .overview-text{
          padding: 0.12rem 0.3rem 0.2rem;
          h3{
            font-size: 0.3rem;
          }
          h4{
            font-size: 0.22rem;
            color: #666;
          }
          p{
            padding-top: 0.3rem;
            font-size: 0.24rem;
          }
        }
      }
      .project{
        .project-text{
          padding: 0.32rem 0.3rem 0.2rem;
          h2{
            padding-bottom: 0.2rem;
          }
        }
      }
    }
  }
  .alert-fade-enter-active, .alert-fade-leave-active {
    transition: all .3s ease;
  }
  .alert-fade-enter, .alert-fade-leave-active {
    opacity: 0;
  }
}
</style>
