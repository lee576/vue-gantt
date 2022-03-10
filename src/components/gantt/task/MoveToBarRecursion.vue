<template>
 <div>
  <template v-for='(item, index) in tasks'>
    <MoveToBarRow :key="index + '_MoveToBarRow'" :rowHeight='rowHeight' :row="item"></MoveToBarRow>
  </template>
 </div>
</template>
<script>
import { store } from '@/components/gantt/store.js'
import MoveToBarRow from './MoveToBarRow.vue'
export default {
  name: 'MoveToBarRecursion',
  components: {MoveToBarRow},
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
  }
}
</script>