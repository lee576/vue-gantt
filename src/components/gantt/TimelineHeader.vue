<template>
  <div class="headerContainer">
    <div v-if="monthHeaders && monthHeaders.length > 0" class="header">
      <template v-for='(item, index) in monthHeaders'>
        <div class="headerCaption" style="border-bottom:0px" :key="index" v-bind:style="{ width: item.width + 'px' }"><span v-bind:style="{ width: item.width + 'px' }">{{item.title}}</span></div>
      </template>
    </div>
    <div v-if="dayHeaders && dayHeaders.length > 0" class="header">
      <template v-for='(item, index) in dayHeaders'>
        <div class="headerCaption" v-if="IsToday(item.title)" :key="index" v-bind:style="{ width: item.width + 'px' }"><span v-bind:style="{ width: item.width + 'px' }">{{item.title}}</span>
          <svg t="1647262391689" class="today" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4965" width="200" height="200"><path d="M753.6 222.4h24c19.2 0 33.6-14.4 33.6-32V57.6c0-19.2-14.4-33.6-33.6-33.6h-24c-19.2 0-33.6 14.4-33.6 33.6v131.2c0 19.2 14.4 33.6 33.6 33.6zM251.2 222.4h24c19.2 0 33.6-14.4 33.6-32V57.6c0-19.2-14.4-33.6-33.6-33.6h-24c-19.2 0-33.6 14.4-33.6 33.6v131.2c0 19.2 14.4 33.6 33.6 33.6z" fill="#707070" p-id="4966"></path><path d="M928 134.4h-68.8v56c0 41.6-33.6 76.8-80 76.8h-24c-43.2 0-80-33.6-80-76.8V134.4h-320v56c0 41.6-33.6 76.8-80 76.8h-24c-43.2 0-80-33.6-80-76.8V134.4H105.6c-38.4 0-68.8 28.8-68.8 67.2v731.2c0 38.4 30.4 67.2 68.8 67.2h820.8c38.4 0 68.8-28.8 70.4-67.2V201.6c0-38.4-30.4-67.2-68.8-67.2zM105.6 932.8V355.2h820.8s0 577.6 1.6 577.6H105.6z" fill="#707070" p-id="4967"></path><path d="M500.8 548.8l-49.6 33.6c14.4 16 33.6 41.6 60.8 75.2l54.4-35.2c-19.2-22.4-40-46.4-65.6-73.6z" fill="#707070" p-id="4968"></path><path d="M553.6 451.2l14.4-14.4v-1.6H480c-51.2 68.8-118.4 121.6-196.8 155.2 11.2 12.8 25.6 28.8 41.6 54.4 80-40 142.4-89.6 188.8-148.8 43.2 59.2 102.4 107.2 180.8 144 14.4-19.2 27.2-35.2 41.6-52.8-76.8-30.4-137.6-76.8-182.4-136zM339.2 716.8h246.4c-30.4 43.2-62.4 81.6-94.4 116.8l60.8 33.6c49.6-56 89.6-108.8 123.2-155.2v-54.4h-336v59.2z" fill="#707070" p-id="4969"></path></svg>
        </div>
        <div class="headerCaption"  v-else :key="index" v-bind:style="{ width: item.width + 'px' }"><span v-bind:style="{ width: item.width + 'px' }">{{item.title}}</span></div>
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
  props: {
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
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {
    IsToday(title) {
      return title === this.$moment().locale('zh-cn').format('MMMM DD日')
    }
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
      position: relative;
      .today {
        position: absolute;
        z-index: 10;
        top: 0px;
        left: 0px;
        position: absolute;
        height: 25px;
        width: 25px;
        :hover {
          fill: #3A8EE6;
        }
      }
    }
  }
}
</style>
