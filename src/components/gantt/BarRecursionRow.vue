<template>
 <div>
    <template v-for='item in filterTask'>
      <bar :key= "item.id + scale + startGanttDate + endGanttDate" :startGanttDate='startGanttDate' :endGanttDate='endGanttDate' :row='item' :rowHeight='rowHeight'></bar>
    </template>
 </div>
</template>
<script>
import { store } from '@/components/gantt/store.js'
import { mutations } from '@/components/gantt/store.js'
import Bar from '../gantt/Bar.vue'
export default {
  name: 'BarRecursionRow',
  props: {
    rowHeight: {
      type: Number,
      default: 0
    },
    tasks: {
      type: Array,
      default: () => []
    }
  },
  data() {
		return {
      hiddenTask: [],
    };
	},
  computed: {
    allTask () {
      return store.tasks
    },
    timelineCellCount () {
      return store.timelineCellCount
    },
    scale () {
      return store.scale
    },
    startGanttDate () {
      return store.startGanttDate
    },
    endGanttDate () {
      return store.endGanttDate
    },
    mapFields () {
      return store.mapFields
    },
    filterTask (){
      let innerTask = []
      for(let i = 0;i < store.tasks.length; i++)
      {
         if(!this.hiddenTask.some(obj => obj.id === store.tasks[i].id))
         {
            innerTask.push(store.tasks[i])
         }
      }
      return innerTask
    },
    expandRow : {
      get: () => {
        return store.expandRow
      },
      set: (newValue) => {
        mutations.setExpandRow(newValue)
      }
    },
  },
  watch: {
    filterTask (){
      let innerTask = []
      for(let i = 0;i < store.tasks.length; i++)
      {
         if(!this.hiddenTask.some(obj => obj.id === store.tasks[i].id))
         {
            innerTask.push(store.tasks[i])
         }
      }
      return innerTask
    },
    expandRow : function (newVal) {
      this.hiddenTask = []
      for(let i = 0;i < this.tasks.length;i++) {
        if(this.tasks[i][this.mapFields['parentId']] === newVal.pid && newVal.expand === false) {
          this.hiddenTask.push(this.tasks[i])
        }
      }
    },
  },
  components: {Bar},
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    setExpandRow: mutations.setExpandRow,
  }
}
</script>
