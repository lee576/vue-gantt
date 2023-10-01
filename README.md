Vue 下的甘特图组件
进度条是用SVG画的，使用了几个工具库 （interactjs 用来处理拖拽和修改尺寸，snap.svg 用来处理 svg 的dom 操作，moment.js用来处理时间的操作），其他没有依赖任何的UI组件

单击动画可全屏观看

![动画](https://user-images.githubusercontent.com/42806849/159714863-f0e4d026-d349-4ee3-a34e-c0931ec35b1d.gif)
使用示例看 App.vue

```javascript
<template>
  <div class="container">
    <gantt :styleConfig='styleConfig' :dataConfig='dataConfig' :eventConfig='eventConfig'></gantt>
  </div>
</template>
<script>
import Gantt from '@/components/gantt/Gantt.vue'
export default {
  components: { Gantt },
  data () {
    return {
      // 样式配置
      styleConfig: {
        // 表头高度
        headersHeight: 100,
        // 行高
        rowHeight: 60,
        // 设置 Bar的颜色
        setBarColor: this.setBarColor
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
          job_progress: '0.3',
          spend_time: null
        },
        {
          id: '3',
          pid: '0',
          taskNo: '2',
          level: '紧急',
          start_date: '2022-03-05 05:00:00',
          end_date: '2022-03-09 00:00:00',
          job_progress: '0.4',
          spend_time: null
        },
        {
          id: '2',
          pid: '1',
          taskNo: '1_1',
          level: '一般',
          start_date: '2022-03-07 00:00:00',
          end_date: '2022-03-11 22:00:00',
          job_progress: '0.6',
          spend_time: null
        },
        {
          id: '4',
          pid: '3',
          taskNo: '2_1',
          level: '不重要',
          start_date: '2022-03-08 00:00:00',
          end_date: '2022-03-14 22:00:00',
          job_progress: '0.7',
          spend_time: null
        },
        {
          id: '5',
          pid: '2',
          taskNo: '1_1_1',
          level: '一般',
          start_date: '2022-03-05 00:00:00',
          end_date: '2022-03-13 22:00:00',
          job_progress: '0.9',
          spend_time: null
        },
        {
          id: '6',
          pid: '1',
          taskNo: '1_2',
          level: '一般',
          start_date: '2022-03-03 00:00:00',
          end_date: '2022-03-07 22:00:00',
          job_progress: '0.65',
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
          takestime: 'spend_time',
          // 进度
          progress: 'job_progress'
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
        // 添加父任务事件
        addRootTask: this.addRootTask,
        // 添加子任务事件
        addSubTask: this.addSubTask,
        // 删除任务事件
        removeTask: this.removeTask,
        // 编辑任务事件
        editTask: this.editTask,
        // 查询任务事件
        queryTask: this.queryTask,
        // Bar 开始时间结束时间更改
        barDate: this.barDate
      }
    }
  },
  watch: {},
  created () {},
  mounted () {
    // 查询开始时间
    this.dataConfig.queryStartDate = this.$moment().startOf('month').format('YYYY-MM-DD')
    // 查询结束时间
    this.dataConfig.queryEndDate = this.$moment().endOf('month').format('YYYY-MM-DD')
  },
  computed: {
  },
  methods: {
    // bar的日期改变事件(drag或resize产生的日期更改)
    barDate (id, startDate, endDate) {
      console.log(id)
      console.log(startDate)
      console.log(endDate)
    },
    // 查询任务
    queryTask (queryStart, queryEnd) {
      this.dataConfig.queryStartDate = queryStart
      this.dataConfig.queryEndDate = queryEnd
    },
    // 添加父任务
    addRootTask () {
      console.log('root')
    },
    // 添加子任务
    addSubTask (row) {
      console.log(row)
    },
    // 删除任务
    removeTask (row) {
      console.log(row)
    },
    // 编辑任务
    editTask (row) {
      console.log(row)
    },
    // 设置Bar的颜色
    setBarColor (row, callback) {
      if (row.level === '紧急') {
        // eslint-disable-next-line standard/no-callback-literal
        callback('red')
      } else if (row.level === '重要') {
        // eslint-disable-next-line standard/no-callback-literal
        callback('blue')
      } else if (row.level === '一般') {
        // eslint-disable-next-line standard/no-callback-literal
        callback('gray')
      } else if (row.level === '不重要') {
        // eslint-disable-next-line standard/no-callback-literal
        callback('yellow')
      } else {
        // eslint-disable-next-line standard/no-callback-literal
        callback('black')
      }
    }
  }
}
</script>
<style lang='less' scoped>
.container{
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  height: calc(100% - 28px);
  width: 100%;
}
</style>

```

先打个广告
技术栈： 
前端 vue2 vue3
后端 .net winform webapi
老程序员接单，微信
![image](https://github.com/lee576/vue-gantt/assets/42806849/5a401168-ab11-4853-bebd-9cc65f1de3e1)
