<template>
  <div id="app">
    <gantt :headersHeight='100' :rowHeight='60' :taskHeaders='taskHeaders' :tasks='tasks' :mapFields='mapFields'></gantt>
  </div>
</template>
<script>
import Gantt from './components/gantt/Gantt.vue'
export default {
  name: 'App',
	components: { Gantt },
	data() {
		return {
      mapFields: {
        id: 'id',
        parentId: 'pid',
        task: 'taskNo',
        //优先级
        priority: 'level',
        //工作开始时间
        startdate: 'start_date',
        //工作结束时间
        enddate: 'end_date',
        //耗时
        takestime: 'spend_time'
      },
      // 任务表头
      taskHeaders : [      
        {title: 'ID', width: 20, property:'id',show: false},
        {title: 'PID', width: 20, property:'parentId',show: false},
        {title: '序号', width: 120, property:'no',show: true},
        {title: '任务名称', width: 190, property:'task',show: true},
        {title: '优先级', width: 90, property: 'priority',show: true},
        {title: '开始时间', width: 150, property: 'startdate',show: true},
        {title: '结束时间', width: 150, property: 'enddate',show: true},
        {title: '耗时', width: 90, property: 'takestime',show: true}
      ],
      tasks: [{
        id: '1',
        pid: '0',
        taskNo: '1',
        level: '重要',
        start_date: '2022-03-04 05:00:00',
        end_date: '2022-03-05 00:00:00',
        spend_time: null
      },
      {
        id: '3',
        pid: '0',
        taskNo: '2',
        level: '紧急',
        start_date: '2022-03-05 05:00:00',
        end_date: '2022-03-09 00:00:00',
        spend_time: null
      },
      {
        id: '2',
        pid: '1',
        taskNo: '1_1',
        level: '一般',
        start_date: '2022-03-07 00:00:00',
        end_date: '2022-03-11 22:00:00',
        spend_time: null
      },
      {
        id: '4',
        pid: '3',
        taskNo: '2_1',
        level: '不重要',
        start_date: '2022-03-08 00:00:00',
        end_date: '2022-03-14 22:00:00',
        spend_time: null
      },
      {
        id: '5',
        pid: '2',
        taskNo: '1_1_1',
        level: '一般',
        start_date: '2022-03-05 00:00:00',
        end_date: '2022-03-13 22:00:00',
        spend_time: null
      },
      {
        id: '6',
        pid: '1',
        taskNo: '1_2',
        level: '一般',
        start_date: '2022-03-03 00:00:00',
        end_date: '2022-03-07 22:00:00',
        spend_time: null
      }]
    }
	},
	watch: {},
	created() {},
	mounted() {
	},	
  computed:{
  },
  methods:{
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}
#app, html, body {
  height: 100%;
  width: 100%;
}
* {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}
</style>

