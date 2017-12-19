<template>
  <transition name="login-fade">
  	<div class="login-container"  v-show="showLoginView">
  		<header>手机号快捷登录</header>
  		<div class="tel-wrapper">
  			<span>+86
  			 <!-- <i class="fonticon icon-arrow-down"></i> -->
  			</span>
        <XInput v-model="tel" placeholder="请输入手机号" :max="11" type="tel"></XInput>
  			<a @click="startTimer">
  			   <i v-if="stop">获取验证码</i>
  			   <i v-else>重新发送({{time}})</i>
  		  </a>
  		</div>
  		<div class="code-wrapper">
  			<span>验证码</span>
  			<XInput placeholder="请输入验证码" v-model="code" :max="6" type="tel"></XInput>
        <a></a>
  		</div>
  		<button @click="login">登录</button>
  		<div class="protocol">
  			登录即表示你同意国商金融
  		    <a> 《用户使用协议》 </a>
  		</div>
      <Alert v-model="showToast" :title="toastTitle" :content="toastText"></Alert>
      <!-- <Toast v-model="showToast" type="text" :time="1000" is-show-mask :text="toastText" position="middle" width="12em"></Toast> -->
  	</div>
  </transition>
</template>

<script>
import { XInput, Toast, Alert } from 'vux'
import { sendSmsCode, loginOrRegister } from 'api/login/api-login'
import { RESULT_CODE, setStorage } from 'assets/js/utils'

export default {
  name: 'login-container',
  data () {
    return {
      time: 59,
      stop: true,
      code: '',
      tel: '',
      showToast: false,
      toastText: '',
      toastTitle: ''
    }
  },
  computed: {
    showLoginView () {
      return this.$store.getters.showLoginView
    }
  },
  methods: {
    startTimer () {
      if (!this.stop || !this.tel) {
        return this.toastShow('输入手机号', '电话号码不能为空')
      }

      sendSmsCode(this.tel).then((res) => {
        if (res.resultCode === RESULT_CODE) {

        }
      })
      this.stop = false
      this.timer = setInterval(() => {
        if (--this.time < 0) {
          this.stop = true
          this.time = 59
          clearInterval(this.timer)
        }
      }, 1000)
    },
    login () {
      if (this.tel === '') {
        return this.toastShow('输入手机号', '电话号码不能为空')
      }

      if (this.code === '') {
        return this.toastShow('输入验证码', '验证码不能为空')
      }

      loginOrRegister(this.tel, this.code).then((res) => {
        if (res.resultCode === RESULT_CODE) {
          console.log(res)
          // 保存utoken到localstorage里
          setStorage('utoken', res.result.utoken)
          // 通知父组件登录成功
          this.$store.commit('SHOW_LOGIN_VIEW', false)
          this.$store.commit('IS_LOGIN', true)
          this.$router.go(0)
          // 用户登录成功后重新请求数据 变更页面状态
        } else {
          this.toastShow(res.msg)
        }
      })
    },
    toastShow (title, text) {
      this.showToast = true
      this.toastTitle = title
      this.toastText = text
    }
  },
  mounted () {

  },
  components: {
    XInput,
    Toast,
    Alert
  }
}
</script>

<style lang="less">
.login-fade-enter-active, .login-fade-leave-active {
  transition: all .3s ease;
}

.login-fade-enter, .login-fade-leave-active {
  transform: scale(2);
  opacity: 0;
}
.login-container{
	position: fixed;
	z-index: 2;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	width: 100%;
  background-color:#fff;
    header{
    	height: 0.88rem;
    	width: 100%;
    	font-size: 0.32rem;
    	font-weight: bold;
    	line-height: 0.88rem;
    	text-align: center;
    	border-bottom: 0.01rem solid #e9e9e9;
    }
    .tel-wrapper, .code-wrapper{
      display: flex;
      // justify-content: center;
      align-items: center;
    	height: 0.88rem;
    	line-height: 0.88rem;
    	border-bottom: 0.01rem solid #e9e9e9;
    	span{
        flex: 0 0 1.28rem;
    		width: 1.28rem;
    		padding-left: 0.3rem;
        box-shadow: 1px 0 0 #e9e9e9;
    		i{
    			position: absolute;
    			right: 30%;
    			top:0;
    			font-size: 0.3rem;
    			color: #767676;
    		}
    	}
      .weui-cell{
        flex: 1;
        padding: 0;
        &:before{
          content: none;
        }
        .weui-cell__primary{
          padding-left: 0.22rem;
          flex: 1;
          // flex: 0 0 2.5rem;
          // width: 2.5rem;
        }
        .weui-cell__ft{
          text-align: center;
          .weui-icon-clear{
            margin-top: -4px;
            padding-left: 0;
          }
          // padding-right: 5px;
        }
      }
    	a{
        flex: 0 0 1.73rem;
        margin: 0 0.28rem;
  			width: 1.73rem;
  			height: 0.6rem;
        font-size: 0.24rem;
  			line-height: 0.6rem;
  			border:1px solid #6ba4ea;
  			color: #6ba4ea;
  			text-align: center;
  			border-radius: 0.1rem;
    	}
    }
    .code-wrapper{
      a{
        border-color: transparent;
      }
    }
    button{
    	width: 70%;
    	height: 0.88rem;
    	line-height: 0.88rem;
    	text-align: center;
    	background:#6ba4ea;
    	color: #fff;
    	border-radius: 0.1rem;
    	margin: 0.5rem 0 0 15%;
    	border:none;
    }
    .protocol{
    	position: absolute;
    	bottom: 3%;
    	left: 15%;
    	text-align: center;
    	color: #cbcbcc;
    	font-size:0.24rem;
    	a{
    		color: #6ba4ea;
    	}
    }
}

</style>
