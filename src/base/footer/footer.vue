<template>
	<div class="footer-container">
		<div class="footer-nav">
			<router-link to="/index">
				<i class="fonticon icon-nav-hot"></i>
        <i>热门精选</i>
      </router-link>
      <router-link to="/enjoy">
      	<i class="fonticon icon-nav-life"></i>
        <i>乐享生活</i>
      </router-link>
      <router-link  to="/global">
      	<i class="fonticon icon-nav-assets"></i>
        <i>资产配置</i>
      </router-link>
      <router-link to="/mine">
      	<i class="fonticon icon-my-personal"></i>
        <i>个人中心</i>
      </router-link>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'footer-container',
  methods: {

  },
  computed: {

  }
}
</script>

<style lang="less">

.footer-container{
	width: 100%;
	height: 1.0rem;
	background: #fff;
	position: fixed;
	bottom: 0;
  right: 0;
	left: 0;
  z-index: 1;
  // box-shadow: 0 1px 1px 1px #e9e9e9;
	.footer-nav{
		width: 100%;
		height: 100%;
	  display: flex;
	  a{
			flex:1;
			text-align: center;
			color: #bcbcbc;
			position: relative;
			height: 100%;
			i:first-child{
				font-size: 0.8rem;
				position: absolute;
				bottom: 3%;
				left: 28%;
				text-align: center;
			}
			i:last-child{
				font-size: 0.24rem;
				display: block;
				font-weight: bold;
				padding-top: 0.58rem;
			}
		}
		.router-link-active {
		    color: #90bbef;
		}
	}
}

</style>
