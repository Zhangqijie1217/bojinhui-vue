<template>
<div class="compselect-container" @click="setDocType(-1)">
     <div class="compselectnav">
     	<ul>
     		<li v-for="(dicList,index) in dicLists" :class="{compchecked:cationIndex == dicList.ENTR_VAL}"  @click.stop="setDocType(index, dicList.ENTR_VAL)">{{dicList.ENTR_DESC}}</li>
     	</ul>
    </div>
</div>
</template>
<script>
import dictionary from '../../assets/js/dictionary.js'
export default {
  name: 'compselect-container',
  props: ['cationIndex'],
  data () {
    return {
      dicLists: dictionary.cationName
    }
  },
  methods: {
    setDocType: function (index, val) {
      this.$emit('hideSelect', index, this.dicLists, val)
    }
  }
}
</script>
<style lang="css" scoped>
@import './check.css';

.compselectnav{
	position: absolute;
	z-index: 999;
	top:0;
	left: 33%;
	width: 33%;
	overflow: hidden;
	background: #fff;
}
</style>
