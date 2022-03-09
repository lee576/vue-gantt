<template>
 <div v-if='showRow'>
    <div style="width: 100%;border-top: 1px solid #cecece;margin:0px 0px -1px -1px;"></div>
    <div class="cell" :style= "{height:rowHeight +'px',width:'100%'}">
      <svg v-if='checkShow(row) && !expand' @click="event => expandClick(event,row)" class="btn" width="26" height="25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <ellipse class="btn" cx="15" cy="15.5" rx="10" ry="10.5" fill="#FFFFFF" stroke="silver" transform="matrix(1,0,0,1,-2,-3)" />
        <line class="btn" x1="7" y1="16" x2="23" y2="16" stroke="silver" transform="matrix(1,0,0,1,-2,-3)" xmlns="http://www.w3.org/2000/svg" />
        <line class="btn" x1="15" y1="9" x2="15" y2="23" stroke="silver" transform="matrix(1,0,0,1,-2,-3)" />
      </svg>
      <svg v-if='checkShow(row) && expand' @click="event => expandClick(event,row)" width="26" height="25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <ellipse class="btn" cx="15" cy="15.5" rx="10" ry="10.5" fill="#FFFFFF" stroke="silver" transform="matrix(1,0,0,1,-2,-3)" />
        <line class="btn" x1="7" y1="16" x2="23" y2="16" stroke="silver" transform="matrix(1,0,0,1,-2,-3)" xmlns="http://www.w3.org/2000/svg" />
      </svg>
    </div>
    <div style="width: 100%;border-top: 1px solid #cecece;margin:0px 0px -1px -1px;"></div>
 </div>
</template>
<script>
import { store } from '@/components/gantt/store.js'
import { mutations } from '@/components/gantt/store.js'
import { EventBus }  from '../EventBus.js'
export default {
  props : {
    rowHeight: {
      type: Number,
      default: 0
    },
    row: {
      type: Object,
      default: () => {}
    }
  },  
  data() {
		return {
      expand: true,
      showRow: true
    };
	},
  mounted() {
    EventBus.$on('expandTask',(rowId, expand) => {
       if(this.row[this.mapFields['parentId']] === rowId) {
          this.showRow = expand
          EventBus.$emit('expandTask',this.row.id,expand)
       }
    })
	},
  computed: {
    mapFields(){
      return store.mapFields
    },
    allTask (){
      return store.tasks
    }
  },
  methods: {
    setTasks: mutations.setTasks,
    checkShow(item) {
      return this.allTask.some(task => task[this.mapFields['parentId']] === item[this.mapFields['id']])
    },
    expandClick(event, row) {
      this.expand = !this.expand
      EventBus.$emit('expandTask',row.id,this.expand)
    },
  }
}
</script>
<style lang='less' scoped>
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