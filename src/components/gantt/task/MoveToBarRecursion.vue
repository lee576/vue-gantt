<template>
 <div>
  <template v-for='item in filterTask'>
    <MoveToBarRow :key="item.id + '_MoveToBarRow'" :rowHeight='rowHeight' :row="item"></MoveToBarRow>
  </template>
 </div>
</template>
<script>
import { store, mutations } from '@/components/gantt/store.js'

import MoveToBarRow from './MoveToBarRow.vue'
export default {
  name: 'MoveToBarRecursion',
  components: {MoveToBarRow},
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
      hiddenTask: []
    }
  },
  computed: {
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
