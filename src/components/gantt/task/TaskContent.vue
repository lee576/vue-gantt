<template>
  <div ref='taskContent' class="content" @scroll="scroll()" @mouseover="mouseover()">
    <template  v-for='(item, index) in tasks'>
      <div v-if='headers' :key="index + '_task'" style="width: 100%;border-top: 1px solid #cecece;margin:0px 0px -1px -1px;"></div>
        <div class="row" v-bind:style="{ height: rowHeight + 'px' }" :key="index + '_row'">
          <template v-for='(header,headerIndex) in headers'>
            <div v-show="header.show" class="cell" :key= headerIndex v-bind:style="{ minWidth: header.width + 'px', maxWidth: header.width + 'px',height: rowHeight + 'px' }">{{ item[mapFields[header.property]]  }}</div>
          </template>
        </div>
      <div :key="index" style="width: 100%;border-top: 1px solid #cecece;margin:0px 0px -1px -1px;"></div>
    </template>
  </div>
</template>
<script>
import { store } from '@/components/gantt/store.js'
import { EventBus }  from '../EventBus.js'
import { mutations } from '@/components/gantt/store.js'
export default {
  props : {
    headers: {
      type: Array,
      default: () => []
    },
    rowHeight: {
      type: Number,
      default: 0
    },
    tasks: {
      type: Array,
      default: () => []
    }
  },
	components: {},
	data() {
		return {
      scrollFlag: true
    };
	},
	watch: {
    scrollFlag: function (newVal) {
        this.setScrollFlag(newVal)
    },
  },
  computed: {
    mapFields(){
      return store.mapFields
    }
  },
	created() {
  },
	mounted() {
    EventBus.$on('scroll',(scrollTop) => {
      this.$refs.taskContent.scrollTop = scrollTop
    })
	},
	methods: {
    setScrollFlag: mutations.setScrollFlag,
    scroll() {
      if(!this.scrollFlag) {
        EventBus.$emit('scroll',this.$refs.taskContent.scrollTop)
      }
    },
    mouseover() {
      this.scrollFlag = false
    }
  }
}
</script>
<style lang='less' scoped>
.content {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  .row {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: flex-start;
    border-top: 1px solid #cecece;
    border-right: 0px solid #cecece;
    border-bottom: 1px solid #cecece;
    margin:0px 1px -1px -1px;
    width: fit-content;
    .cell {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      border-top: 1px solid #cecece;
      border-right: 1px solid #cecece;
      border-bottom: 1px solid #cecece;
      margin:0px 0px 0px 1px;
    }
  }
}
</style>