<template>
  <div>
    <template  v-for='item in filterTask'>
      <template v-if='headers'>
        <TaskRow :key="item.id + '_taskrow' + timelineCellCount" :headers='headers' :rowHeight='rowHeight' :row='item'></TaskRow>
      </template>
    </template>
  </div>
</template>
<script>
import { store, mutations } from '@/components/gantt/store.js'
import TaskRow from './TaskRow.vue'
export default {
  name: 'TaskRecursionRow',
  components: { TaskRow },
  props: {
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
  data () {
    return {
      hiddenTask: []
    }
  },
  computed: {
    mapFields () {
      return store.mapFields
    },
    timelineCellCount () {
      return store.timelineCellCount
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
  mounted () {
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
