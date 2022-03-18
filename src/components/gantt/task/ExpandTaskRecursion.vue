<template>
 <div>
 <template v-for='item in filterTask'>
    <ExpandTaskRow :key="item.id + 'expandBar'" :rowHeight='rowHeight' :row='item'></ExpandTaskRow>
 </template>
 </div>
</template>
<script>
import { store, mutations } from '@/components/gantt/store.js'

import ExpandTaskRow from './ExpandTaskRow.vue'
export default {
  name: 'ExpandTaskRecursion',
  components: {ExpandTaskRow},
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
      expand: true,
      hiddenTask: []
    }
  },
  watch: {
    expandRow: function (newVal) {
      this.hiddenTask = []
      this.recursionRow(newVal.pid)
    }
  },
  computed: {
    mapFields () {
      return store.mapFields
    },
    filterTask () {
      let innerTask = []
      for (let i = 0; i < this.tasks.length; i++) {
        if (!this.hiddenTask.some(obj => obj.id === this.tasks[i].id)) {
          innerTask.push(this.tasks[i])
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
  methods: {
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
    },
    setExpandRow: mutations.setExpandRow,
    checkShow (item) {
      return this.allTask.some(task => task[this.mapFields['parentId']] === item[this.mapFields['id']]) // item[this.mapFields['parentId']] === '0'
    }
  }
}
</script>
<style lang='less' scoped>
.cell {
  display: flex;
  padding-left: 10px;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-start;
  border-top: 1px solid #cecece;
  border-right: 0px solid #cecece;
  border-bottom: 1px solid #cecece;
  margin:0px 1px -1px -1px;
  width: fit-content;
  cursor:default;
}
</style>
