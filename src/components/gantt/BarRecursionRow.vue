<template>
 <div>
    <template v-for='item in filterTask'>
      <bar :key= "item.id + scale + startGanttDate + endGanttDate + componentKey" :startGanttDate='startGanttDate' :endGanttDate='endGanttDate' :row='item' :rowHeight='rowHeight'></bar>
    </template>
 </div>
</template>
<script>
import { store, mutations } from '@/components/gantt/store.js'

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
  data () {
    return {
      hiddenTask: [],
      componentKey: 0
    }
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
    filterTask () {
      let innerTask = []
      for (let i = 0; i < store.tasks.length; i++) {
        if (!this.hiddenTask.some(obj => obj[this.mapFields['id']] === store.tasks[i][this.mapFields['id']])) {
          innerTask.push(store.tasks[i])
        }
      }
      return innerTask
    },
    expandRow: {
      get: () => {
        return store.expandRow
      },
      set: (newValue) => {
        mutations.setExpandRow(newValue)
      }
    }
  },
  watch: {
    filterTask () {
      let innerTask = []
      for (let i = 0; i < store.tasks.length; i++) {
        if (!this.hiddenTask.some(obj => obj[this.mapFields['id']] === store.tasks[i][this.mapFields['id']])) {
          innerTask.push(store.tasks[i])
        }
      }
      return innerTask
    },
    expandRow: function (newVal) {
      this.hiddenTask = []
      this.recursionRow(newVal.pid)
    }
  },
  components: {Bar},
  mounted () {
    this.$nextTick(() => {
    })
  },
  activated () {
    this.componentKey++
  },
  methods: {
    setExpandRow: mutations.setExpandRow,
    recursionRow (id) {
      let findRows = this.tasks.filter(obj => obj[this.mapFields['parentId']] === id)
      if (findRows && findRows.length > 0) {
        for (let i = 0; i < findRows.length; i++) {
          if (this.expandRow.expand === false) {
            this.hiddenTask.push(findRows[i])
          }
          this.recursionRow(findRows[i][this.mapFields['id']])
        }
      }
    }
  }
}
</script>
