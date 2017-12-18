<template>
  <div class="booking-view">
    <Bhead :titles="title" class="booking-title"></Bhead>
    <ListView :data="data" class="booking-list" @select="select" ></ListView>
  </div>
</template>

<script>
import Bhead from 'base/head/head'
import ListView from 'base/list-view/listview'
import { findMyBespeakInfos } from 'api/mine/api-mine'
import { RESULT_CODE } from 'assets/js/utils'

export default {
  data () {
    return {
      title: '我的预约',
      data: []
    }
  },
  created () {
    this.findMyBespeakInfos()
  },
  methods: {
    select (code) {
      console.log(code)
      this.$router.push({
        path: `/enjoy/enjoydetail?id=${code}`
      })
    },
    findMyBespeakInfos () {
      findMyBespeakInfos(1, 2).then((res) => {
        if (res.resultCode === RESULT_CODE) {
          this.data = res.result.bespeakList
        }
      })
    }
  },
  components: {
    Bhead,
    ListView
  }
}
</script>

<style lang="less">
.booking-view{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #fff;
  z-index: 2;
  .booking-list {
    position: absolute;
    top: .87rem;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
