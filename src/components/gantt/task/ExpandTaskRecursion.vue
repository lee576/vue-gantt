<template>
 <div>
 <template v-for='(item, index) in tasks'>
    <ExpandTaskRow :key="index + 'expandBar'" :rowHeight='rowHeight' :row='item'></ExpandTaskRow>
  </template>
 </div>
</template>
<script>
import { store } from '@/components/gantt/store.js'
import { EventBus }  from '../EventBus.js'
import ExpandTaskRow from './ExpandTaskRow.vue'
export default {
  name: 'ExpandTaskRecursion',
  components:{ExpandTaskRow},
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
  data() {
		return {
      expand: true
    };
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
    checkShow(item) {
      return  this.allTask.some(task => task[this.mapFields['parentId']] === item[this.mapFields['id']]) //item[this.mapFields['parentId']] === '0'
    },
    expandClick(event, row) {
      this.expand = !this.expand
      EventBus.$emit('expandTask',row[this.mapFields['id']],this.expand)
    }
  }
}
</script>
