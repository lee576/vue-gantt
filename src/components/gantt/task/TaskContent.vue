<template>
  <div ref='taskContent' class="content" @scroll="scroll()" @mouseover="mouseover()">
      <TaskRecursionRow :headers='headers' :rowHeight='rowHeight' :tasks='tasks'></TaskRecursionRow>
    <div class="moveToBar" :style= "{position: 'absolute',top:'0px',right:'0px',width:'40px',zIndex: '30',height : tasks.length * rowHeight + 'px'}">
      <MoveToBarRecursion :rowHeight='rowHeight' :tasks='tasks'></MoveToBarRecursion>
    </div>
    <div class="expandBar" :style= "{position: 'absolute',top:'0px',left:'0px',width:'25px',zIndex: '30',height : tasks.length * rowHeight + 'px'}">
      <ExpandTaskRecursion :rowHeight='rowHeight' :tasks='tasks'></ExpandTaskRecursion>
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
        if(this.$refs.taskContent.scrollTop) {
          this.$refs.taskContent.scrollTop = scrollTop
        }  
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
  }
}
</style>