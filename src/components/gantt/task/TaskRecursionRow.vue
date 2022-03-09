<template>
  <div>
    <template  v-for='(item, index) in tasks'>
      <template v-if='headers'>
        <TaskRow :key="index + '_taskrow' + timelineCellCount" :headers='headers' :rowHeight='rowHeight' :row='item'></TaskRow>
      </template>
    </template>
  </div>
</template>
<script>
import { store } from '@/components/gantt/store.js'
import TaskRow from './TaskRow.vue'
// import { EventBus }  from '../EventBus.js'
export default {
  name: 'TaskRecursionRow',
  components : { TaskRow },
  props : {
    headers: {
      type: Array,
      default: () => []
    },
    rowHeight: {
      type: Number,
      default: 0
    },
  },
  computed: {
    mapFields(){
      return store.mapFields
    },
    tasks() {
      return store.tasks
    },
    timelineCellCount() {
      return store.timelineCellCount
    },
  },
  watch: {
  },
  mounted() {
	},
  methods: {
  }
}
</script>