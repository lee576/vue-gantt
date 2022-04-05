<template>
  <div v-if='showRow'>
    <div style="width: 100%;border-top: 1px solid #cecece;margin:0px 0px -1px -1px;"></div>
      <div class="cell" :style= "{height:rowHeight +'px',width:'100%'}">
        <svg v-tip='moveToStartTips' @click="event => goBarStart(event,row)" class="btn" width="18" height="20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <path d="M189.741,122.217l-62.317-29.503v15.271H58.716v28.465h68.708v15.271L189.741,122.217z" transform="matrix(-0.102,7.700783E-09,-2.091292E-08,-0.277,22.19743,42.91137)" fill="silver" fill-opacity="0.4" stroke="none" stroke-opacity="0" xmlns="http://www.w3.org/2000/svg" />
        </svg>
        <svg v-tip='moveToEndTips' @click="event => goBarEnd(event,row)" class="btn" width="18" height="20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <path d="M189.741,122.217l-62.317-29.503v15.271H58.716v28.465h68.708v15.271L189.741,122.217z" transform="matrix(0.102,0,0,0.277,-3.145,-24.797)" fill="silver" fill-opacity="0.4" stroke="none" stroke-opacity="0" xmlns="http://www.w3.org/2000/svg" />
        </svg>
      </div>
    <div style="width: 100%;border-top: 1px solid #cecece;margin:0px 0px -1px -1px;"></div>
  </div>
</template>
<script>
import { store } from '@/components/gantt/store.js'
import { EventBus } from '../EventBus.js'
import tip from '../tip'
export default {
  directives: {
    tip
  },
  props: {
    rowHeight: {
      type: Number,
      default: 0
    },
    row: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      showRow: true,
      moveToStartTips: '定位到任务开始',
      moveToEndTips: '定位到任务结束'
    }
  },
  mounted () {
  },
  computed: {
    mapFields () {
      return store.mapFields
    },
    allTask () {
      return store.tasks
    }
  },
  methods: {
    goBarStart (event, row) {
      if (row && row[this.mapFields['id']]) {
        EventBus.$emit('moveToBarStart', row[this.mapFields['id']])
      }
    },
    goBarEnd (event, row) {
      if (row && row[this.mapFields['id']]) {
        EventBus.$emit('moveToBarEnd', row[this.mapFields['id']])
      }
    }
  }
}
</script>
<style lang='less' scoped>
.btn :hover {
  fill: #3A8EE6;
  fill-opacity: 1;
}
.cell {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #cecece;
  border-right: 0px solid #cecece;
  border-bottom: 1px solid #cecece;
  margin:0px 1px -1px -1px;
  width: fit-content;
  cursor:default;
}
</style>
