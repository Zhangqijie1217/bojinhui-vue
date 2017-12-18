<template>
  <div class="assess">
    <Bhead :titles="title"></Bhead>
    <Slider :isSnap="true" class="question-slider" :click="false">
      <div v-for="(question, index) in questions" class="question-wrapper">
        <h3 class="question-count">共<span>{{index + 1}}/</span>{{questions.length}}道题</h3>
        <p class="question"><i>{{index + 1}}</i>{{question.question}}<span v-if="question.des">({{question.des}})</span></p>
        <p class="desc"><span v-if="question.des2">{{question.des2}}</span></p>
        <Checklist class="check-list"
                   :max="1"
                   :options="question.answers"
                   @on-change="checkListChange"
                    v-model="anwser[index]"
                   ref="checklist">
        </Checklist>
      </div>
    </Slider>
    <transition name="fold">
      <div class="start-section" v-show="showStartSection">
        <img src="../../assets/img/assess_start_bg.png">
        <p class="assess-count">伯仲会已为<span> {{assessCount}} </span>用户免费评估</p>
        <div class="start-assess">
          <span @click="showStartSection = false">开始评估</span>
        </div>
      </div>
    </transition>
    <transition name="assess-slide">
      <FillAssess v-show="fillAssessShow" @getResult="confirmAssess"></FillAssess>
    </transition>
    <transition name="result-slide">
      <Result v-show="resultShow" :state="assessResult"></Result>
    </transition>
  </div>
</template>

<script>
import Bhead from 'base/head/head'
import Slider from 'base/slider/slider'
import FillAssess from 'components/global/fill-assess'
import Result from 'components/global/result'
import { Checklist } from 'vux'
import { questions } from './questionList.js'
import { onlineAssessment } from 'api/global/api-global'
import { RESULT_CODE } from 'assets/js/utils'

export default {
  data () {
    return {
      title: '在线评估',
      assessCount: 0,
      showStartSection: true,
      questions: questions,
      fillAssessShow: false,
      resultShow: false,
      assessResult: '',
      anwser: [],
      count: 0,
      isSetAnswers: true
    }
  },
  created () {
    this.assessCount = this.$route.query.count
  },
  methods: {
    checkListChange () {
      this.fillAssessShow = this.anwser.every((item) => {
        return item.length === 1
      })
    },
    confirmAssess (...text) {
      let answers = this.anwser.map((i) => {
        return i[0]
      }).join(',')

      let obj = {
        answers: answers,
        sex: text[1],
        userName: text[0],
        mobile: text[2]
      }

      this._onlineAssessment(obj)
    },
    _onlineAssessment (obj) {
      onlineAssessment(obj).then((res) => {
        if (res.resultCode === RESULT_CODE) {
          this.resultShow = true
          this.assessResult = res.result
        } else {
          this.$vux.toast.show({
            text: res.msg,
            width: '9em',
            type: 'cancel'
          })
        }
      })
    }
  },
  components: {
    Bhead,
    Slider,
    Checklist,
    Result,
    FillAssess
  },
  watch: {
    anwser (newVal) {

    }
  }
}
</script>

<style lang="less">
  .assess{
    position: fixed;
    z-index: 2;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #fff;
    overflow: hidden;
    .question-slider{
      .question-wrapper{
        box-sizing: border-box;
        padding: 0 0.26rem;
      }
      .question-count{
        margin: 0.35rem 0 0.43rem;
        text-align: center;
        font-weight: 100;
        font-size: 0.34rem;
        color: #9e9e9e;
        span{
          display: inline-block;
          color: #6ba4ea;
        }
      }
      .desc{
        margin: 0.2rem 0;
        min-height: 0.19rem;
        font-size: 0.22rem;
        text-align: center;
        color: #999;
      }
      .question{
        height: 1.1rem;
        line-height: 1.1rem;
        border: 1px solid #6ba4ea;
        font-size: 0.34rem;
        border-radius: 5px;
        color: #6ba4ea;
        i{
          margin: -3px 0.32rem 0 0.25rem;
          display: inline-block;
          vertical-align: middle;
          width: 0.38rem;
          height: 0.38rem;
          line-height: .36rem;
          text-align: center;
          border-radius: 50%;
          background: #6ba4ea;
          color: #fff;
          font-size: 0.24rem;
        }
        span{
          margin-left: 0.2rem;
          font-size: 0.24rem;
          color: #999;
        }
      }
      .check-list{
        .weui-cells_checkbox,
        .weui-cell{
          font-size: 0.3rem;
          &:before{
            display: none;
          }
          &:after{
            display: none;
          }
          .vux-checklist-icon-checked{
            margin-top: -3px;
            &:before{
              color: #6ba4ea;
              font-size: 20px;
            }
          }
        }
      }
    }
    .start-section{
      position: absolute;
      top: .88rem;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 3;
      text-align: center;
      background: #fff;
      &.fold-enter-active, &.fold-leave-active {
        transition: all .8s ease;
      }
      &.fold-enter, &.fold-leave-active {
        opacity: 0;
        transform: translate3d(0, 100%, 0);
      }
      img{
        width: 100%;
      }
      .assess-count{
        margin-top: 0.62rem;
        font-size: .3rem;
        span{
          font-size: .36rem;
          color: #6ba4ea;
        }
      }
      .start-assess{
        margin-top: 0.7rem;
        span{
          margin: auto;
          display: block;
          width: 3.45rem;
          height: 0.57rem;
          line-height: 0.57rem;
          border-radius: 5px;
          border: 1px solid #6ba4ea;
          color: #6ba4ea;
        }
      }
    }
    .assess-slide-enter-active, .assess-slide-leave-active {
      transition: all .8s ease;
    }
    .assess-slide-enter, .assess-slide-leave-active {
      transform: translate3d(100%, 0, 0);
    }

    .result-slide-enter-active, .result-slide-leave-active {
      transition: all .8s ease;
    }
    .result-slide-enter, .result-slide-leave-active {
      transform: translate3d(100%, 0, 0);
    }
  }

</style>
