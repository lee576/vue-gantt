import Vue from 'vue'
export let store = Vue.observable({ 
  monthHeaders:[], 
  dayHeaders:[], 
  hourHeaders:[], 
  tasks:[], 
  taskHeaders:[], 
  mapFields: {},
  scale: 90,
  timelineCellCount: 0,
  startGanttDate: null,
  endGanttDate: null,
  scrollFlag: true,
  mode: null,
})
export let mutations = {
    //月度表头
    setMonthHeaders(monthHeaders) {
      store.monthHeaders = monthHeaders
    },
    //日表头
    setDayHeaders (dayHeaders) {
      store.dayHeaders = dayHeaders
    },
    //任务
    setTasks (tasks) {
      store.tasks = tasks
    },
    //任务表头
    setTaskHeaders (taskHeaders) {
      store.taskHeaders = taskHeaders
    },
    //小时表头
    setHourHeaders(hourHeaders) {
      store.hourHeaders = hourHeaders
    },
    //时间表头最小单位宽度,所有表头的宽度都是他的倍数
    setScale(scale) {
      store.scale = scale
    },
    //字段映射
    setMapFields(mapFields) {
      store.mapFields = mapFields
    },
    //时间刻度一行有多少个单元格
    setTimelineCellCount(timelineCellCount) {
      store.timelineCellCount = timelineCellCount
    },
    //开始时间
    setStartGanttDate(startGanttDate) {
      store.startGanttDate = startGanttDate
    },
    //结束时间
    setEndGanttDate(endGanttDate) {
      store.endGanttDate = endGanttDate
    },
    //纵向滚动条同步标志位
    setScrollFlag(scrollFlag) {
      store.scrollFlag = scrollFlag
    },
    //时间模式
    setMode(mode) {
      store.mode = mode
    }
} 