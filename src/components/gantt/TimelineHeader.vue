<template>
  <div class="headerContainer">
    <div v-if="monthHeaders && monthHeaders.length > 0" class="header">
      <template v-for='(item, index) in monthHeaders'>
        <div class="headerCaption" style="border-bottom:0px" :key="index" v-bind:style="{ width: item.width + 'px' }"><span v-bind:style="{ width: item.width + 'px' }">{{item.title}}</span></div>
      </template>
    </div>
    <div v-if="dayHeaders && dayHeaders.length > 0" class="header">
      <template v-for='(item, index) in dayHeaders'>
        <div class="headerCaption" :key="index" v-bind:style="{ width: item.width + 'px' }"><span v-bind:style="{ width: item.width + 'px' }">{{item.title}}</span></div>
      </template>
    </div>
    <div v-if="hourHeaders && hourHeaders.length > 0" class="header">
      <template v-for='(item, index) in hourHeaders'>
        <div class="headerCaption" :key="index" v-bind:style="{ width: item.width + 'px',marginTop: '-2px' }"><span v-bind:style="{ width: item.width + 'px' }">{{item.title}}</span></div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  props : {
    dayHeaders: {
      type: Array,
      default: () => []
    },
    monthHeaders: {
      type: Array,
      default: () => []
    },
    hourHeaders: {
      type: Array,
      default: () => []
    }
  },
	components: {},
	data() {
		return {};
	},
	computed: {},
	watch: {},
	created() {
  },
	mounted() {
	},
	methods: {
  }
}
</script>
<style lang='less' scoped>
.headerContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: flex-start;
  background-color: #F3F4F5;
  margin: 0px 0px -1px 0px;
  font-size: 15px;
  font-weight: bold;
  .header {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    margin: 1px 0px 1px 0px;
    .headerCaption {
      border-top: 1px solid #cecece;
      border-right: 1px solid #cecece;
      border-bottom: 1px solid #cecece;
      margin:0px 1px -1px -1px;
      text-align: center;
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      justify-content: center;
      border-right: 1px solid #cecece;
      color: #6b6b6b;
      font-size: 12px;
      background-color: #F3F4F5;
    }
  }
}
</style>
