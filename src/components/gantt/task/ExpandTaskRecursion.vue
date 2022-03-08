<template>
 <div>
 <template v-for='(item, index) in tasks'>
    <div :key="index + '_expandBarCellTop'" style="width: 100%;border-top: 1px solid #cecece;margin:0px 0px -1px -1px;"></div>
    <div class="cell" :key= "item + index+ '_expandBarCell'" :style= "{height:rowHeight +'px',width:'100%'}">
      <svg v-if='checkShow(item)' class="btn" width="26" height="25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <ellipse class="btn" cx="15" cy="15.5" rx="10" ry="10.5" fill="#FFFFFF" stroke="silver" transform="matrix(1,0,0,1,-2,-3)" />
        <line class="btn" x1="7" y1="16" x2="23" y2="16" stroke="silver" transform="matrix(1,0,0,1,-2,-3)" xmlns="http://www.w3.org/2000/svg" />
        <line class="btn" x1="15" y1="9" x2="15" y2="23" stroke="silver" transform="matrix(1,0,0,1,-2,-3)" />
      </svg>
    </div>
    <div :key="index + '_expandBarCellBottom'" style="width: 100%;border-top: 1px solid #cecece;margin:0px 0px -1px -1px;"></div>
    <ExpandTaskRecursion :key="index + '_expandBarRecursion'" :rowHeight='rowHeight' :tasks='findChildNode(item,allTask)'></ExpandTaskRecursion>
  </template>
 </div>
</template>
<script>
import { store } from '@/components/gantt/store.js'
// import { EventBus }  from '../EventBus.js'
export default {
  name: 'ExpandTaskRecursion',
  props : {
    rowHeight: {
      type: Number,
      default: 0
    },
    tasks: {
      type: Array,
      default: () => []
    }
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
    findChildNode(item,tasks) {
      return tasks.filter(obj => obj[this.mapFields['parentId']] === item[this.mapFields['id']])
    },
    checkShow(item) {
      return item[this.mapFields['parentId']] === '0'
    }
  }
}
</script>
<style lang='less' scoped>
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
</style>