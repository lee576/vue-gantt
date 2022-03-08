<template>
 <div>
  <template v-for='(item, index) in tasks'>
    <div :key="index + '_moveToBarRecursionCellTop'" style="width: 100%;border-top: 1px solid #cecece;margin:0px 0px -1px -1px;"></div>
    <div class="cell" :key= "item + index + '_fixCell'" :style= "{height:rowHeight +'px',width:'100%'}">
      <svg @click="event => goBarStart(event,item)" class="btn" width="18" height="20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <path d="M189.741,122.217l-62.317-29.503v15.271H58.716v28.465h68.708v15.271L189.741,122.217z" transform="matrix(-0.102,7.700783E-09,-2.091292E-08,-0.277,22.19743,42.91137)" fill="silver" fill-opacity="0.4" stroke="none" stroke-opacity="0" xmlns="http://www.w3.org/2000/svg" />
      </svg>
      <svg @click="event => goBarEnd(event,item)" class="btn" width="18" height="20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <path d="M189.741,122.217l-62.317-29.503v15.271H58.716v28.465h68.708v15.271L189.741,122.217z" transform="matrix(0.102,0,0,0.277,-3.145,-24.797)" fill="silver" fill-opacity="0.4" stroke="none" stroke-opacity="0" xmlns="http://www.w3.org/2000/svg" />
      </svg>
    </div>
    <div :key="index + '_moveToBarRecursion'" style="width: 100%;border-top: 1px solid #cecece;margin:0px 0px -1px -1px;"></div>
    <MoveToBarRecursion :key="index + '_moveToBarRecursionBottom'" :rowHeight='rowHeight' :tasks='findChildNode(item,allTask)'></MoveToBarRecursion>
  </template>
 </div>
</template>
<script>
import { store } from '@/components/gantt/store.js'
import { EventBus }  from '../EventBus.js'
export default {
  name: 'MoveToBarRecursion',
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
    goBarStart(event,row) {
      if(row && row.id) {
        EventBus.$emit('moveToBarStart',row.id)
      }
    },
    goBarEnd(event,row) {
      if(row && row.id) {
        EventBus.$emit('moveToBarEnd',row.id)
      }
    },
    findChildNode(item,tasks) {
      return tasks.filter(obj => obj[this.mapFields['parentId']] === item[this.mapFields['id']])
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