<template>
  <div class="table">
    <div class='header' v-bind:style="{ height: headersHeight + 'px' }">
      <svg t="1647256642676" @click="scrollToToday()" class="jumpToToday" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2207"><path d="M952.200533 586.709333a228.3008 228.3008 0 0 0-34.8672-121.463466V238.933333a21.333333 21.333333 0 0 0-21.333333-21.333333H85.333333A21.333333 21.333333 0 0 0 64 238.933333v537.6a21.333333 21.333333 0 0 0 21.333333 21.333334h533.333334c3.217067 0 6.229333-0.768 8.968533-2.030934a227.968 227.968 0 0 0 86.997333 20.394667c3.157333 1.834667 6.784 2.9696 10.7008 2.9696 4.113067 0 7.936-1.2288 11.195734-3.242667 120.149333-7.278933 215.671467-107.298133 215.671466-229.248zM863.2064 405.333333h11.460267v9.4976a230.766933 230.766933 0 0 0-11.460267-9.4976zM106.666667 268.8h238.933333v93.866667h-238.933333v-93.866667z m281.6 0h102.4v93.866667h-102.4v-93.866667z m-281.6 486.4v-349.866667h475.136c-54.0928 42.069333-88.9856 107.6992-88.9856 181.376 0 66.525867 28.4416 126.498133 73.7792 168.490667H106.666667z m640 16.938667V686.933333a21.333333 21.333333 0 1 0-42.666667 0v85.896534C617.2672 764.270933 547.805867 696.209067 537.002667 610.133333H627.2a21.333333 21.333333 0 1 0 0-42.666666H536.465067c8.081067-78.7712 65.245867-143.197867 140.3136-162.133334h27.221333v93.866667a21.333333 21.333333 0 1 0 42.666667 0v-93.866667h21.546666c44.066133 11.118933 81.937067 37.9136 107.357867 74.0864 1.211733 4.241067 3.669333 7.9104 6.9888 10.632534a185.659733 185.659733 0 0 1 25.984 77.4144H814.933333a21.333333 21.333333 0 1 0 0 42.666666h93.0816c-10.5728 84.189867-77.2608 151.108267-161.348266 162.005334z" p-id="2208" fill='#bfbfbf'></path></svg>
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
import { EventBus } from '../EventBus.js'
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
    scrollToToday () {
      EventBus.$emit('scrollToToday')
    },
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
    position: relative;
    .jumpToToday {
      position: absolute;
      z-index: 10;
      top: 0px;
      right: 0px;
      position: absolute;
      height: 40px;
      width: 40px;
      :hover {
        fill: #3A8EE6;
      }
    }
  }
}
</style>
