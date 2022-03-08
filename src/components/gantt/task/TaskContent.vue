<template>
  <div ref='taskContent' class="content" @scroll="scroll()" @mouseover="mouseover()">
    <TaskRecursionRow TaskRecursionRow :headers='headers' :rowHeight='rowHeight' :tasks='getRootNode()'></TaskRecursionRow>
    <div class="moveToBar" :style= "{position: 'absolute',top:'0px',right:'0px',width:'40px',zIndex: '30',height : tasks.length * rowHeight + 'px'}">
      <MoveToBarRecursion :rowHeight='rowHeight' :tasks='getRootNode()'></MoveToBarRecursion>
    </div>
    <div class="expandBar" :style= "{position: 'absolute',top:'0px',left:'0px',width:'40px',zIndex: '30',height : tasks.length * rowHeight + 'px'}">
      <!-- <template  v-for='(item, index) in tasks'>
        <div :key="index + '_expandBarCellTop'" style="width: 100%;border-top: 1px solid #cecece;margin:0px 0px -1px -1px;"></div>
        <div class="cell" :key= "item + index+ '_expandBarCell'" :style= "{height:rowHeight +'px',width:'100%'}">
          <svg class="btn" width="26" height="25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <ellipse class="btn" cx="15" cy="15.5" rx="10" ry="10.5" fill="#FFFFFF" stroke="silver" transform="matrix(1,0,0,1,-2,-3)" />
            <line class="btn" x1="7" y1="16" x2="23" y2="16" stroke="silver" transform="matrix(1,0,0,1,-2,-3)" xmlns="http://www.w3.org/2000/svg" />
            <line class="btn" x1="15" y1="9" x2="15" y2="23" stroke="silver" transform="matrix(1,0,0,1,-2,-3)" />
          </svg>
        </div>
        <div :key="index + '_expandBarCellBottom'" style="width: 100%;border-top: 1px solid #cecece;margin:0px 0px -1px -1px;"></div>
      </template> -->
      <ExpandTaskRecursion :rowHeight='rowHeight' :tasks='getRootNode()'></ExpandTaskRecursion>
    </div> 
  </div>
</template>
<script>
import { store } from '@/components/gantt/store.js'
import { EventBus }  from '../EventBus.js'
import { mutations } from '@/components/gantt/store.js'
import TaskRecursionRow from './TaskRecursionRow.vue'
import MoveToBarRecursion from './MoveToBarRecursion.vue'
import ExpandTaskRecursion from './ExpandTaskRecursion.vue'
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
	components: { TaskRecursionRow,MoveToBarRecursion,ExpandTaskRecursion },
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
      if(this.$refs.taskContent) {
        this.$refs.taskContent.scrollTop = scrollTop
      }
    })
	},
	methods: {
    setScrollFlag: mutations.setScrollFlag,
    // 找出根节点
    getRootNode() {
      return this.tasks.filter(obj => obj[this.mapFields['parentId']] === '0')
    },
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
  position: relative;
  .moveToBar {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: flex-start;
  }
  .expandBar {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: flex-start;
    .btn :hover {
      fill: #3A8EE6;
      fill-opacity: 1;
      stroke: white;
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
  }
}
</style>