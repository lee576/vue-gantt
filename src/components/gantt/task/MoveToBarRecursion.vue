<template>
 <div>
  <template v-for='item in filterTask'>
    <MoveToBarRow :key="item.id + '_MoveToBarRow'" :rowHeight='rowHeight' :row="item"></MoveToBarRow>
  </template>
 </div>
</template>
<script>
import { store } from '@/components/gantt/store.js'
import { mutations } from '@/components/gantt/store.js'
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
  data() {
		return {
      hiddenTask: [],
    };
	},
  computed: {
    mapFields(){
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
  methods: {
    setExpandRow: mutations.setExpandRow,
  }
}
</script>