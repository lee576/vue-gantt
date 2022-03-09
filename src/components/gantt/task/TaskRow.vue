<template>
  <div v-if='showRow'>
    <div style="width: 100%;border-top: 1px solid #cecece;margin:0px 0px -1px -1px;"></div>
    <div class="row" v-bind:style="{ height: rowHeight + 'px' }">
      <template v-for='(header,headerIndex) in headers'>
        <div v-show="header.show" class="cell" :key= "headerIndex" v-bind:style="{ minWidth: header.width + 'px', maxWidth: header.width + 'px',height: rowHeight + 'px' }">{{ checkField(row,header.property)  }}</div>
      </template>
    </div>
    <div style="width: 100%;border-top: 1px solid #cecece;margin:0px 0px -1px -1px;"></div>
  </div>
</template>
<script>
import { store } from '@/components/gantt/store.js'
import { EventBus }  from '../EventBus.js'
export default {
  props : {
    headers: {
      type: Array,
      default: () => []
    },
    rowHeight: {
      type: Number,
      default: 0
    },
    row: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      showRow: true
    }
  },
  computed: {
    mapFields(){
      return store.mapFields
    }
  },
  mounted() {
    EventBus.$on('expandTask',(rowId, expand) => {
       if(this.row[this.mapFields['parentId']] === rowId) {
          this.showRow = expand
          EventBus.$emit('expandTask',this.row[this.mapFields['id']],expand)
       }
    })
	},
  methods: {
    checkField(row, property) {
       if(this.mapFields[property])
         return row[this.mapFields[property]]
       else if(row[property]){
         return row[property]
       }
       else return null
    }
  }
}
</script>
<style lang='less' scoped>
  .row {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: flex-start;
    border-top: 1px solid #cecece;
    border-right: 0px solid #cecece;
    border-bottom: 1px solid #cecece;
    margin:0px 1px -1px -1px;
    width: fit-content;
    .cell {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      border-top: 1px solid #cecece;
      border-right: 1px solid #cecece;
      border-bottom: 1px solid #cecece;
      margin:0px 0px 0px 1px;
    }
  }
</style>
