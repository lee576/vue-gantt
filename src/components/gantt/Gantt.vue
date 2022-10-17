<template>
  <div class="page">
    <div class="toolbar">
      <div class="dateInput">
        <div @click="openStartDatePicker">{{selectedStartDate}}</div>
        <span style="margin-right:20px;margin-left:20px;color:#606266">至</span>
        <div @click="openEndDatePicker">{{selectedEndDate}}</div>
      </div>
      <date-picker
        v-if="showEndDatePicker"
        :date="endDate"
        :min-date="minEndDate"
        :max-date="maxEndDate"
        @confirm="confirmEnd"
        @cancel="cancelEnd">
      </date-picker>
      <date-picker
        v-if="showStartDatePicker"
        :date="startDate"
        :min-date="minStartDate"
        :max-date="maxStartDate"
        @confirm="confirmStart"
        @cancel="cancelStart">
      </date-picker>
      <div class="buttonGroup">
        <div :class="buttonClass[0]" style="border-radius:10px 0 0 10px;" @click="timeMode('月')"><div class="text">月</div></div>
        <div :class="buttonClass[1]" style="border-left:0;border-right:0" @click="timeMode('日')"><div class="text">日</div></div>
        <div :class="buttonClass[2]" style="border-radius:0 10px 10px 0;" @click="timeMode('时')"><div class="text">时</div></div>
      </div>
    </div>
    <div class="gantt">
      <SplitPane direction="row" :min="0" :max="100" :triggerLength="10" :paneLengthPercent.sync="paneLengthPercent">
        <template v-slot:one>
          <task-table :headersHeight='styleConfig.headersHeight' :rowHeight='styleConfig.rowHeight'></task-table>
        </template>
        <template v-slot:two>
          <gantt-table ref='barContent' :headersHeight='styleConfig.headersHeight' :rowHeight='styleConfig.rowHeight'></gantt-table>
        </template>
      </SplitPane>
    </div>
  </div>
</template>
<script>
import DatePicker from './DatePicker.vue'
import SplitPane from './SplitPane.vue'
import GanttTable from './Table.vue'
import TaskTable from './task/TaskTable.vue'
import { store, mutations } from '@/components/gantt/store.js'
import Vue from 'vue'
import { EventBus } from './EventBus'
import _ from "lodash";
export default {
  props: {
    styleConfig: {
      type: Object,
      required: true,
      default: () => ({
        // 表头高度
        headersHeight: 100,
        // 行高
        rowHeight: 60
      }),
      // 验证参数合法性
      validator: (value) => {
        return typeof value.headersHeight === 'number' &&
               typeof value.rowHeight === 'number' &&
               value.headersHeight > 0 && value.rowHeight > 0
      }
    },
    dataConfig: {
      type: Object,
      required: true,
      default: () => ({
        // 任务
        dataSource: () => [],
        // 任务表头
        taskHeaders: () => [],
        // 数据字段映射
        mapFields: () => {}
      }),
      // 验证参数合法性
      validator: (value) => {
        return Array.isArray(value.dataSource) &&
               Array.isArray(value.taskHeaders) &&
               typeof value.mapFields === 'object'
      }
    },
    eventConfig: {
      type: Object,
      required: true,
      // 验证参数合法性
      validator: (value) => {
        return typeof value.addRootTask === 'function' &&
               typeof value.addSubTask === 'function' &&
               typeof value.removeTask === 'function' &&
               typeof value.queryTask === 'function' &&
               typeof value.barDate === 'function'
      }
    }
  },
  data () {
    return {
      initData: [],
      paneLengthPercent: 35,
      buttonClass: ['button is-active', 'button', 'button'],
      mode: '月',
      // 开始日期默认值
      startDate: this.$moment().locale('zh-cn').format('YYYY-MM-DD'),
      minStartDate: this.$moment().locale('zh-cn').add(-5, 'y').format('YYYY-MM-DD'),
      maxStartDate: this.$moment().locale('zh-cn').add(5, 'y').format('YYYY-MM-DD'),
      showStartDatePicker: false,
      selectedStartDate: '点击选择日期',
      // 结束日期默认值
      endDate: this.$moment().locale('zh-cn').format('YYYY-MM-DD'),
      minEndDate: this.startDate,
      maxEndDate: this.$moment(this.startDate).locale('zh-cn').add(5, 'y').format('YYYY-MM-DD'),
      showEndDatePicker: false,
      selectedEndDate: '点击选择日期',
      // 月度表头
      monthHeaders: [],
      // 日表头
      dayHeaders: [],
      // 周表头
      weekHeaders: [],
      // 小时表头
      hourHeaders: [],
      // 表头最小单位宽度
      scale: 0,
      // 时间刻度一行有多少个单元格
      timelineCellCount: 0,
      // 甘特图开始时间
      startGanttDate: null,
      // 甘特图结束时间
      endGanttDate: null,
      result: ''
    }
  },
  components: { GanttTable, TaskTable, SplitPane, DatePicker },
  computed: {
    subTask () {
      return store.subTask
    },
    editTask () {
      return store.editTask
    },
    removeTask () {
      return store.removeTask
    },
    rootTask () {
      return store.rootTask
    },
    barDate () {
      return store.barDate
    }
  },
  watch: {
    barDate: _.debounce(function(newVal){
      this.eventConfig.barDate(newVal.id, newVal.startDate, newVal.endDate)
    }, 500),
    // 时间表头最小单位宽度,所有表头的宽度都是他的倍数
    scale: _.debounce(function(newVal){
      this.setScale(newVal)
    }, 500),
    // 任务表头
    'dataConfig.taskHeaders': _.debounce(function(newVal){
      this.setTaskHeaders(newVal)
    }, 100),
    // 月度表头
    monthHeaders: _.debounce(function(newVal){
      this.setMonthHeaders(newVal)
    }, 100),
    // 日表头
    dayHeaders: _.debounce(function(newVal){
      this.setDayHeaders(newVal)
    }, 100),
    // 星期表头
    weekHeaders: _.debounce(function(newVal){
      this.setWeekHeaders(newVal)
    }, 100),
    // 小时表头
    hourHeaders: _.debounce(function(newVal){
      this.setHourHeaders(newVal)
    }, 100),
    // 选择开始日期
    selectedStartDate:_.debounce(function(){
      this.setTimeLineHeaders(this.mode)
    }, 100),
    // 选择结束日期
    selectedEndDate:_.debounce(function(){
      this.setTimeLineHeaders(this.mode)
    }, 100),
    // 切换缩放单位(月/日/时)
    mode: function (newVal) {
      this.setMode(newVal)
      this.setTimeLineHeaders(newVal)
    },
    // 任务
    'dataConfig.dataSource': function (newVal) {
      this.setTasks(newVal)
    },
    // 字段映射
    'dataConfig.mapFields': function (newVal) {
      this.setMapFields(newVal)
    },
    'dataConfig.queryStartDate': function (newVal) {
      this.dataConfig.dataSource = []
      this.setStartGanttDate(newVal)
      this.startGanttDate = this.dataConfig.queryStartDate
      this.selectedStartDate = this.dataConfig.queryStartDate
      this.startDate = this.dataConfig.queryStartDate
    },
    'dataConfig.queryEndDate': function (newVal) {
      this.dataConfig.dataSource = []
      this.setEndGanttDate(newVal)
      this.endGanttDate = this.dataConfig.queryEndDate
      this.selectedEndDate = this.dataConfig.queryEndDate
      this.endDate = this.dataConfig.queryEndDate
    },
    // 时间刻度一行有多少个单元格
    timelineCellCount: function (newVal) {
      this.setTimelineCellCount(newVal)
    },
    // 甘特图开始时间
    startGanttDate: function (newVal) {
      this.setStartGanttDate(newVal)
    },
    // 甘特图结束时间
    endGanttDate: function (newVal) {
      this.setEndGanttDate(newVal)
    },
    rootTask: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        if (newVal) { this.eventConfig.addRootTask() }
      } else {
        if (oldVal) { this.eventConfig.addRootTask() }
      }
      this.setRootTask(null)
    },
    // 添加任务
    subTask: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        if (newVal) { this.eventConfig.addSubTask(newVal) }
      } else {
        if (oldVal) { this.eventConfig.addSubTask(oldVal) }
      }
      this.setSubTask(null)
    },
    // 编辑任务
    editTask: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        if (newVal) { this.eventConfig.editTask(newVal) }
      } else {
        if (oldVal) { this.eventConfig.editTask(oldVal) }
      }
      this.setEditTask(null)
    },
    // 删除任务
    removeTask: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        if (newVal) { this.eventConfig.removeTask(newVal) }
      } else {
        if (oldVal) { this.eventConfig.removeTask(oldVal) }
      }
      this.setRemoveTask(null)
    }
  },
  created () {
    this.setMonthHeaders(this.monthHeaders)
    this.setWeekHeaders(this.weekHeaders)
    this.setDayHeaders(this.dayHeaders)
    this.setHourHeaders(this.hourHeaders)
    this.setTaskHeaders(this.dataConfig.taskHeaders)
    this.setTasks(this.dataConfig.dataSource)
    this.setMapFields(this.dataConfig.mapFields)
    this.setTimelineCellCount(this.timelineCellCount)
    this.setMode(this.mode)
  },
  mounted () {
    this.monthHeaders = []
    this.weekHeaders = []
    this.dayHeaders = []
    this.hourHeaders = []
    this.timeMode('月')
    let level = 0
    this.RecursionData('0', this.dataConfig.dataSource, level)
    this.setTasks(this.initData)
    this.$nextTick(() => {
      // 添加根任务事件
      EventBus.$on('addRootTask', (row) => {
        this.eventConfig.addRootTask(row)
      })
      // 横向滚动条滚动到今天的位置
      EventBus.$emit('scrollToToday')
      // 设置Bar的颜色
      EventBus.$on('setBarColor', (row) => {
        this.styleConfig.setBarColor(row, (color) => {
          EventBus.$emit('returnBarColor', row[this.dataConfig.mapFields['id']], color)
        })
      })
    })
  },
  methods: {
    // 查找所有父节点id并用.分隔拼接返回
    FindAllParent (targetData, pid) {
      let parent = targetData.filter(obj => obj[this.dataConfig.mapFields['id']] === pid)
      if (parent && parent.length > 0) {
        this.result = parent[0].index + '.' + this.result
        this.FindAllParent(targetData, parent[this.dataConfig.mapFields['parentId']])
      }
    },
    // 对数据进行递归加工
    RecursionData (id, tasks, level) {
      let findResult = tasks.filter(obj => obj[this.dataConfig.mapFields['parentId']] === id)
      if (findResult && findResult.length > 0) {
        level++ // 递归的层级
        for (let i = 0; i < findResult.length; i++) {
          findResult[i].treeLevel = level
          findResult[i].index = i + 1
          let parent = this.initData.filter(obj => obj[this.dataConfig.mapFields['id']] === findResult[i][this.dataConfig.mapFields['parentId']])
          this.result = ''
          if (parent && parent.length > 0) {
            this.result = parent[0].index + '.' + findResult[i].index
            this.FindAllParent(this.initData, parent[0][this.dataConfig.mapFields['parentId']])
            findResult[i].no = this.result
          } else {
            findResult[i].no = i + 1 + ''
          }
          this.initData.push(findResult[i])
          this.RecursionData(findResult[i][this.dataConfig.mapFields['id']], tasks, level)
        }
      }
    },
    setDayHeaders: mutations.setDayHeaders,
    setWeekHeaders: mutations.setWeekHeaders,
    setTaskHeaders: mutations.setTaskHeaders,
    setMonthHeaders: mutations.setMonthHeaders,
    setHourHeaders: mutations.setHourHeaders,
    setScale: mutations.setScale,
    setTasks: mutations.setTasks,
    setMapFields: mutations.setMapFields,
    setTimelineCellCount: mutations.setTimelineCellCount,
    setStartGanttDate: mutations.setStartGanttDate,
    setEndGanttDate: mutations.setEndGanttDate,
    setMode: mutations.setMode,
    setRootTask: mutations.setRootTask,
    setSubTask: mutations.setSubTask,
    setEditTask: mutations.setEditTask,
    setRemoveTask: mutations.setRemoveTask,
    setBarDate: mutations.setBarDate,
    // 修改按钮样式
    timeMode (mode) {
      this.$refs.barContent.scrollLeft = 0
      for (let button of this.buttonClass) {
        Vue.set(this.buttonClass, this.buttonClass.indexOf(button), 'button')
      }
      switch (mode) {
        case '月': {
          Vue.set(this.buttonClass, 0, 'button is-active')
          break
        }
        case '日': {
          Vue.set(this.buttonClass, 1, 'button is-active')
          break
        }
        case '时': {
          Vue.set(this.buttonClass, 2, 'button is-active')
          break
        }
      }
      this.mode = mode
      // this.$forceUpdate()
    },
    setTimeLineHeaders (newVal) {
      // 开始时间格式是否合法
      if (!this.$moment(this.selectedStartDate, 'YYYY-MM-DD', true).isValid()) { return }
      // 结束时间格式是否合法
      if (!this.$moment(this.selectedEndDate, 'YYYY-MM-DD', true).isValid()) { return }
      // 检验开始时间结束时间范围的合法性
      let days = this.$moment(this.selectedEndDate).diff(this.$moment(this.selectedStartDate), 'days')
      if (days < 0) { return }
      this.startGanttDate = this.selectedStartDate + ' 00:00:00'
      this.endGanttDate = this.selectedEndDate + ' 23:59:59'
      this.weekHeaders = []
      this.dayHeaders = []
      this.monthHeaders = []
      this.hourHeaders = []
      switch (newVal) {
        case '月': {
          this.scale = 80
          let recurrence = this.$moment().recur(this.selectedStartDate, this.selectedEndDate).every(1).months()
          let months = recurrence.all('L').map(x => this.$moment(x).locale('zh-cn').format('YYYY-MM-DD'))

          let findIndex = months.findIndex((item) => {
            return this.$moment(item).locale('zh-cn').format('YYYY-MM') === this.$moment(this.selectedEndDate).locale('zh-cn').format('YYYY-MM')
          })
          if (findIndex === -1) {
            months.push(this.$moment(this.selectedEndDate).locale('zh-cn').format('YYYY-MM-DD'))
          }
          // 时间跨度只有一个月
          if (months.length === 1) {
            let days = this.$moment(this.selectedEndDate).diff(this.$moment(this.selectedStartDate), 'days') + 1
            this.monthHeaders.push({title: this.$moment(months[0]).locale('zh-cn').format('MMMM'), width: days * this.scale})
          } else {
            for (let month of months) {
              let index = months.indexOf(month)
              // 第一月
              if (index === 0) {
                let endOfMonth = this.$moment(this.selectedStartDate).endOf('month').format('YYYY-MM-DD')
                let days = this.$moment(endOfMonth).diff(this.$moment(this.selectedStartDate), 'days') + 1
                this.monthHeaders.push({title: this.$moment(month).locale('zh-cn').format('MMMM'), width: days * this.scale})
              }
              // 最后一个月
              else if (index === months.length - 1) {
                let startOfMonth = this.$moment(this.selectedEndDate).startOf('month').format('YYYY-MM-DD')
                let days = this.$moment(this.selectedEndDate).diff(this.$moment(startOfMonth), 'days') + 1
                this.monthHeaders.push({title: this.$moment(month).locale('zh-cn').format('MMMM'), width: days * this.scale})
              }
              // 中间的月
              else {
                let days = this.$moment(month, 'YYYY-MM').daysInMonth()
                this.monthHeaders.push({title: this.$moment(month).locale('zh-cn').format('MMMM'), width: days * this.scale})
              }
            }
          }

          recurrence = this.$moment().recur(this.selectedStartDate, this.selectedEndDate).every(1).days()
          let recurrenceDates = recurrence.all('L').map(x => this.$moment(x).locale('zh-cn'))
          for (let recurrenceDate of recurrenceDates) {
            let caption = recurrenceDate.locale('zh-cn').format('DD日')
            let fulldate = recurrenceDate.locale('zh-cn').format('YYYY-MM-DD')
            let week = recurrenceDate.locale('zh-cn').format('dddd')
            this.weekHeaders.push({title: week, width: this.scale, fulldate: fulldate})
            this.dayHeaders.push({title: caption, width: this.scale, fulldate: fulldate})
          }
          this.timelineCellCount = this.dayHeaders.length
          break
        }
        case '日': {
          this.scale = 80
          let recurrence = this.$moment().recur(this.selectedStartDate, this.selectedEndDate).every(1).days()
          let recurrenceDates = recurrence.all('L').map(x => this.$moment(x).locale('zh-cn'))
          for (let recurrenceDate of recurrenceDates) {
            let caption = recurrenceDate.locale('zh-cn').format('MMMM DD日')
            let fulldate = recurrenceDate.locale('zh-cn').format('YYYY-MM-DD')
            let week = recurrenceDate.locale('zh-cn').format('dddd')
            this.weekHeaders.push({title: week, width: this.scale, fulldate: fulldate})
            this.dayHeaders.push({title: caption, width: this.scale, fulldate: fulldate})
          }
          this.timelineCellCount = this.dayHeaders.length
          break
        }
        case '时': {
          this.scale = 30
          let recurrence = this.$moment().recur(this.selectedStartDate, this.selectedEndDate).every(1).days()
          let recurrenceDates = recurrence.all('L').map(x => this.$moment(x).locale('zh-cn'))
          for (let recurrenceDate of recurrenceDates) {
            let caption = recurrenceDate.locale('zh-cn').format('MMMM DD日')
            let fullDate = recurrenceDate.locale('zh-cn').format('YYYY-MM-DD')
            let week = recurrenceDate.locale('zh-cn').format('dddd')
            this.weekHeaders.push({title: week, width: 24 * this.scale, fulldate: fullDate})
            this.dayHeaders.push({title: caption, width: 24 * this.scale, fulldate: fullDate})
            for (let i = 0; i <= 23; i++) {
              this.hourHeaders.push({title: i + '点', width: this.scale})
            }
          }
          this.timelineCellCount = this.hourHeaders.length
          break
        }
      }
      // 选定日期后重新查询
      this.eventConfig.queryTask(this.selectedStartDate, this.selectedEndDate, this.mode)
    },
    openEndDatePicker () {
      this.showEndDatePicker = true
    },
    openStartDatePicker () {
      this.showStartDatePicker = true
    },
    confirmEnd (value) {
      let days = this.$moment(value.date).diff(this.$moment(this.startDate), 'days')
      if (days < 0) {
        this.selectedStartDate = value.date
        this.startDate = value.date
      }
      this.showEndDatePicker = false
      this.selectedEndDate = value.date
      this.endDate = value.date
    },
    confirmStart (value) {
      let days = this.$moment(this.endDate).diff(this.$moment(value.date), 'days')
      if (days < 0) {
        this.selectedEndDate = value.date
        this.endDate = value.date
      }
      this.showStartDatePicker = false
      this.selectedStartDate = value.date
      this.startDate = value.date
    },
    cancelEnd () {
      this.showEndDatePicker = false
    },
    cancelStart () {
      this.showStartDatePicker = false
    }
  },
  deactivated () {
    // 使用了 keep-alive 注销掉所有事件
    // EventBus.$off()
  },
  beforeDestory () {
    // 组件销毁前注销掉所有事件
    EventBus.$off()
  }
}
</script>
<style lang="less" scoped>
@toolbarHeight: 70px;
.page {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .toolbar {
    height: @toolbarHeight;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-items: flex-start;
    padding: (@toolbarHeight / 2);
    .dateInput {
      cursor: pointer;
      border: 1px solid #dcdfe6;
      height: (@toolbarHeight / 1.5);
      width: 250px;
      display: flex;
      flex-direction: row;
      display: -webkit-flex;
      align-items: center;
      justify-content: center;
      margin-right: 20px;
      border-radius: 5px;
      color:#00BCD4;
      font-size: 14px;
    }
    .buttonGroup {
      height: (@toolbarHeight / 1.5);
      display: flex;
      flex-direction: row;
      margin-right: 20px;
      .is-active:not(.text), :active:not(.text) {
        background:#3a8ee6;
        border-color:#3a8ee6;
        color:#FFF
      }
      :hover:not(.text) {
        background:#66b1ff;
        border-color:#66b1ff;
        color:#FFF
      }
      .button {
        width: 80px;
        font-size: 15px;
        height: (@toolbarHeight / 1.5);
        border: 1px solid #dcdfe6;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        justify-content: center;
        font-weight: 500;
        cursor: pointer;
      }
    }
  }
  .gantt {
    height: calc(100% - @toolbarHeight);
    width: 100%;
  }
}
</style>
