<template>
  <div id="app">
    <gantt :styleConfig='styleConfig' :dataConfig='dataConfig' :eventConfig='eventConfig'></gantt>
  </div>
</template>
<script>
import Gantt from './components/gantt/Gantt.vue'
export default {
  components: { Gantt },
  data () {
    return {
      // 样式配置
      styleConfig: {
        // 表头高度
        headersHeight: 100,
        // 行高
        rowHeight: 60
      },
      // 数据源配置
      dataConfig: {
        // 甘特图开始时间
        queryStartDate: '',
        // 甘特图结束时间
        queryEndDate: '',
        // 数据源
        dataSource: [{
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
        }],
        // 字段映射
        mapFields: {
          // id
          id: 'id',
          // 父id
          parentId: 'pid',
          // 任务名称
          task: 'taskNo',
          // 优先级
          priority: 'level',
          // 工作开始时间
          startdate: 'start_date',
          // 工作结束时间
          enddate: 'end_date',
          // 耗时
          takestime: 'spend_time'
        },
        // 任务表头配置 标题/宽度/字段名称/是否显示
        taskHeaders: [
          {title: 'id', width: 100, property: 'id', show: false},
          {title: '父id', width: 100, property: 'parentId', show: false},
          {title: '序号', width: 120, property: 'no', show: true},
          {title: '任务名称', width: 190, property: 'task', show: true},
          {title: '优先级', width: 90, property: 'priority', show: true},
          {title: '开始时间', width: 150, property: 'startdate', show: true},
          {title: '结束时间', width: 150, property: 'enddate', show: true},
          {title: '耗时', width: 90, property: 'takestime', show: true}
        ]
      },
      // 事件配置
      eventConfig: {
        addRootTask: this.addRootTask,
        addSubTask: this.addSubTask,
        removeTask: this.removeTask,
        editTask: this.editTask
      }
    }
  },
  watch: {},
  created () {},
  mounted () {
    this.dataConfig.queryStartDate = this.$moment().startOf('month').format('YYYY-MM-DD')
    this.dataConfig.queryEndDate = this.$moment().endOf('month').format('YYYY-MM-DD')
  },
  computed: {
  },
  methods: {
    addRootTask () {
      
    },
    addSubTask (row) {
      console.log(row)
    },
    removeTask (row) {
      console.log(row)
    },
    editTask (row) {
      console.log(row)
    }
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

