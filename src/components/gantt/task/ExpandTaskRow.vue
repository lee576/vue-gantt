<template>
 <div v-if='showRow'>
    <div style="width: 100%;border-top: 1px solid #cecece;margin:0px 0px -1px -1px;"></div>
    <div class="cell" :style= "{height:rowHeight +'px',width:'100%'}">
      <svg v-tip='unexpandTips' v-if='checkShow(row) && expand' @click="event => expandClick(event,row)" t="1646897393223" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5537" width="25" height="25"><path d="M81.16 412.073333L0 709.653333V138.666667a53.393333 53.393333 0 0 1 53.333333-53.333334h253.413334a52.986667 52.986667 0 0 1 37.713333 15.62l109.253333 109.253334a10.573333 10.573333 0 0 0 7.54 3.126666H842.666667a53.393333 53.393333 0 0 1 53.333333 53.333334v74.666666H173.773333a96.2 96.2 0 0 0-92.613333 70.74z m922-7.113333a52.933333 52.933333 0 0 0-42.386667-20.96H173.773333a53.453333 53.453333 0 0 0-51.453333 39.333333L11.773333 828.666667a53.333333 53.333333 0 0 0 51.453334 67.333333h787a53.453333 53.453333 0 0 0 51.453333-39.333333l110.546667-405.333334a52.953333 52.953333 0 0 0-9.073334-46.373333z" fill="#f4ea2a" p-id="5538"></path></svg>
      <svg v-tip='expandTips' v-if='checkShow(row) && !expand' @click="event => expandClick(event,row)" t="1646897227319" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5395" width="25" height="25"><path d="M970.666667 213.333333H546.586667a10.573333 10.573333 0 0 1-7.54-3.126666L429.793333 100.953333A52.986667 52.986667 0 0 0 392.08 85.333333H96a53.393333 53.393333 0 0 0-53.333333 53.333334v704a53.393333 53.393333 0 0 0 53.333333 53.333333h874.666667a53.393333 53.393333 0 0 0 53.333333-53.333333V266.666667a53.393333 53.393333 0 0 0-53.333333-53.333334z" fill="#f4ea2a" p-id="5396"></path></svg>
    </div>
    <div style="width: 100%;border-top: 1px solid #cecece;margin:0px 0px -1px -1px;"></div>
 </div>
</template>
<script>
import { store, mutations } from '@/components/gantt/store.js'
import tip from '../tip'
export default {
  directives: {
    tip
  },
  props: {
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
      expand: true,
      showRow: true,
      expandTips: '展开',
      unexpandTips: '折叠'
    }
  },
  mounted () {
  },
  computed: {
    mapFields () {
      return store.mapFields
    },
    allTask () {
      return store.tasks
    },
    expandRow () {
      return store.expandRow
    }
  },
  methods: {
    setTasks: mutations.setTasks,
    setExpandRow: mutations.setExpandRow,
    checkShow (item) {
      return this.allTask.some(task => task[this.mapFields['parentId']] === item[this.mapFields['id']])
    },
    expandClick (event, row) {
      this.expand = !this.expand
      this.setExpandRow({ pid: row[this.mapFields['id']], expand: this.expand })
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
