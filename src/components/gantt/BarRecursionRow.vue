<template>
 <div>
    <template v-for='(item, index) in tasks'>
      <bar :key= "index + scale + startGanttDate + endGanttDate" :startGanttDate='startGanttDate' :endGanttDate='endGanttDate' :row='item' :rowHeight='rowHeight'></bar>
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
  }
}
</script>