<template>
  <div class="table">
    <div class='header' v-bind:style="{ height: headersHeight + 'px' }">
      <div style="width: 100%;border-top: 1px solid #cecece;margin:0px 0px -1px -1px;"></div>
      <task-header :headers='taskHeaders'></task-header>
      <div style="width: 100%;border-top: 1px solid #cecece;margin:0px 0px -1px -1px;"></div>
    </div>
    <div v-bind:style="{ height: 'calc(100% - ' + headersHeight + 'px)' }">
      <task-content :headers='taskHeaders' :rowHeight='rowHeight' :tasks='tasks'></task-content>
    </div>
  </div>
</template>
<script>
import TaskHeader from './TaskHeader.vue'
import { store } from '@/components/gantt/store.js'
import TaskContent from './TaskContent.vue';
export default {
  props : {
    headersHeight : {
      type: Number,
      default: 50
    },
    rowHeight: {
      type: Number,
      default: 0
    }
  },
	components: { TaskHeader, TaskContent },
	data() {
		return {};
	},
	computed: {
    tasks (){
      return store.tasks
    },
    taskHeaders (){
      return store.taskHeaders
    }
  },
	watch: {},
	created() {},
	mounted() {
	},
	methods: {
  }
}
</script>
<style lang='less' scoped>
.table {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  overflow-x: hidden;
  .header {
    height: 100%;
    margin:0px 1px -1px -1px;
    background-color: #F3F4F5;
  }
}
</style>
