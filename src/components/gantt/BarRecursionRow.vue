<template>
 <div>
    <template v-for='(item, index) in tasks'>
      <div :key="index + '_task'" style="border-top: 1px solid #cecece;margin:-2px 0px -1px -1px;"></div>
        <div v-if='tasks' class="barRow" v-bind:style="{ height: rowHeight + 'px'}" :key="'task_' + index + '_' + scale + '_' + timelineCellCount">
          <bar :key= "'row_' + index + '_' + scale" v-if='startGanttDate && endGanttDate' :startGanttDate='startGanttDate' :endGanttDate='endGanttDate' :row='item' :rowHeight='rowHeight'></bar>
          <template v-for='count in timelineCellCount'>
            <div class="cell" :key= "'row_' + index + '_cell_' + count" v-bind:style="{ minWidth: scale + 'px', maxWidth: scale + 'px',height: rowHeight + 'px' }"></div>
          </template>
        </div>
      <div :key="index" style="border-top: 1px solid #cecece;margin:0px 0px 1px -1px;"></div>
      <BarRecursionRow :rowHeight='rowHeight' :key="index + '_BarRecursionRow'" :tasks='findChildNode(item,allTask)'></BarRecursionRow>
    </template>
 </div>
</template>
<script>
import { store } from '@/components/gantt/store.js'
import Bar from '../gantt/Bar.vue'
export default {
  name: 'BarRecursionRow',
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
    allTask (){
      return store.tasks
    },
    timelineCellCount (){
      return store.timelineCellCount
    },
    scale (){
      return store.scale
    },
    startGanttDate(){
      return store.startGanttDate
    },
    endGanttDate(){
      return store.endGanttDate
    },
    mapFields(){
      return store.mapFields
    }
  },
  components: {Bar},
  methods: {
    findChildNode(item,tasks) {
      return tasks.filter(obj => obj[this.mapFields['parentId']] === item[this.mapFields['id']])
    }
  }
}
</script>
<style lang='less' scoped>
  .barRow {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: flex-start;
    border-top: 1px solid #cecece;
    border-right: 0px solid #cecece;
    border-bottom: 1px solid #cecece;
    margin:0px 1px -1px -1px;
    width: fit-content;
    position: relative;
    .cell {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      border-top: 1px solid #cecece;
      border-right: 1px solid #cecece;
      border-bottom: 1px solid #cecece;
      margin:-1px 0px 0px 0px;
    }
  }
</style>