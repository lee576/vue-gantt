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
      <SplitPane direction="row" :min="10" :max="80" :triggerLength="10" :paneLengthPercent.sync="paneLengthPercent">
        <template v-slot:one>
          <task-table :headersHeight='headersHeight' :rowHeight='rowHeight'></task-table>      
        </template>
        <template v-slot:two>
          <gantt-table ref='barContent' :headersHeight='headersHeight' :rowHeight='rowHeight'></gantt-table>
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
import { mutations } from '@/components/gantt/store.js'
import Vue from 'vue'
export default {
  props : {
    headersHeight : {
      type: Number,
      default: 50
    },
    rowHeight: {
      type: Number,
      default: 0
    },
    tasks: {
      type: Array,
      default: () => []
    },
    mapFields: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // 任务表头
      taskHeaders : [      
        {title: 'ID', width: 20, property:'id',show: false},
        {title: '任务名称', width: 190, property:'task',show: true},
        {title: '优先级', width: 90, property: 'priority',show: true},
        {title: '开始时间', width: 150, property: 'startdate',show: true},
        {title: '结束时间', width: 150, property: 'enddate',show: true},
        {title: '耗时', width: 90, property: 'takestime',show: true}
      ],
      paneLengthPercent: 35,
      buttonClass: ["button is-active","button","button"],
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
      dayHeaders : [],
      // 小时表头
      hourHeaders : [],
      // 表头最小单位宽度
      scale : 0,
      // 时间刻度一行有多少个单元格
      timelineCellCount: 0,
      // 甘特图开始时间
      startGanttDate: null,
      // 甘特图结束时间
      endGanttDate: null
    }
  },
	components: { GanttTable, TaskTable, SplitPane, DatePicker },
	watch: {
    // 时间表头最小单位宽度,所有表头的宽度都是他的倍数
    scale: function (newVal, oldVal) {
      if (newVal != oldVal) {
        this.setScale(newVal)
      }
    },
    // 任务表头
    taskHeaders: function (newVal, oldVal) {
      if (newVal != oldVal) {
        this.setTaskHeaders(newVal)
      }
    },
    // 月度表头
    monthHeaders: function (newVal, oldVal) {
      if (newVal != oldVal) {
        this.setMonthHeaders(newVal)
      }
    },
    // 日表头
    dayHeaders: function (newVal, oldVal) {
      if (newVal != oldVal) {
        this.setDayHeaders(newVal)
      }
    },
    // 小时表头
    hourHeaders: function (newVal, oldVal) {
      if (newVal != oldVal) {
        this.setHourHeaders(newVal)
      }
    },
    // 选择开始日期
    selectedStartDate: function () {
       this.setTimeLineHeaders(this.mode)
    },
    // 选择结束日期
    selectedEndDate: function () {
       this.setTimeLineHeaders(this.mode)
    },
    // 切换缩放单位(月/日/时)
    mode: function (newVal) {
      this.setMode(newVal)
      this.setTimeLineHeaders(newVal)
    },
    // 任务
    tasks: function (newVal) {
      this.setTasks(newVal)
    },
    // 字段映射
    mapFields: function (newVal) {
      this.setMapFields(newVal)
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
    }
  },
	created() {
    this.setMonthHeaders(this.monthHeaders)
    this.setDayHeaders(this.dayHeaders)
    this.setHourHeaders(this.hourHeaders)
    this.setTaskHeaders(this.taskHeaders)
    this.setTasks(this.tasks)
    this.setMapFields(this.mapFields)
    this.setTimelineCellCount(this.timelineCellCount)
    this.setMode(this.mode)
  },
	mounted() {
    this.monthHeaders = []
    this.dayHeaders = []
    this.hourHeaders = []
    this.mode = '月'
	},
  methods:{
    setDayHeaders: mutations.setDayHeaders,
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
    // 修改按钮样式
    timeMode (mode) {
      this.$refs.barContent.scrollLeft = 0
      for(let button of this.buttonClass){
        Vue.set(this.buttonClass,this.buttonClass.indexOf(button),'button')
      }
      switch (mode)
      {
        case '月': {
          Vue.set(this.buttonClass,0,'button is-active')
          break;       
        }
        case '日': {
          Vue.set(this.buttonClass,1,'button is-active')
          break;
        }
        case '时': {
          Vue.set(this.buttonClass,2,'button is-active')
          break;
        }
      }
      this.mode = mode
    },
    setTimeLineHeaders(newVal) {
      // 开始时间格式是否合法
      if(!this.$moment(this.selectedStartDate, 'YYYY-MM-DD', true).isValid())
        return
      // 结束时间格式是否合法
      if(!this.$moment(this.selectedEndDate, 'YYYY-MM-DD', true).isValid())
        return
      // 检验开始时间结束时间范围的合法性
      let days = this.$moment(this.selectedEndDate).diff(this.$moment(this.selectedStartDate),'days')
      if(days < 0)
        return
      this.startGanttDate = this.selectedStartDate + ' 00:00:00'
      this.endGanttDate = this.selectedEndDate + ' 23:59:59'
      this.dayHeaders = []
      this.monthHeaders = []
      this.hourHeaders = []
      switch (newVal)
      {
        case '月': {
          this.scale = 80
          let recurrence = this.$moment().recur(this.selectedStartDate, this.selectedEndDate).every(1).months();
          let months = recurrence.all("L").map(x => this.$moment(x).locale('zh-cn').format('YYYY-MM-DD'))

          let findIndex = months.findIndex((item) => { 
            return this.$moment(item).locale('zh-cn').format('YYYY-MM') === this.$moment(this.selectedEndDate).locale('zh-cn').format('YYYY-MM') 
          })
          if(findIndex === -1) {
            months.push(this.$moment(this.selectedEndDate).locale('zh-cn').format('YYYY-MM-DD'))
          }
          // 时间跨度只有一个月
          if(months.length == 1) {
            let days = this.$moment(this.selectedEndDate).diff(this.$moment(this.selectedStartDate), 'days') + 1
            this.monthHeaders.push({title: this.$moment(months[0]).locale('zh-cn').format('MMMM'), width: days * this.scale})
          }
          else {
            for(let month of months) {
              let index = months.indexOf(month)
              // 第一月
              if(index === 0) {
                let endOfMonth = this.$moment(this.selectedStartDate).endOf('month').format("YYYY-MM-DD")
                let days = this.$moment(endOfMonth).diff(this.$moment(this.selectedStartDate), 'days') + 1
                this.monthHeaders.push({title: this.$moment(month).locale('zh-cn').format('MMMM'), width: days * this.scale})
              }
              // 最后一个月
              else if(index === months.length - 1) {
                let startOfMonth = this.$moment(this.selectedEndDate).startOf('month').format("YYYY-MM-DD")
                let days = this.$moment(this.selectedEndDate).diff(this.$moment(startOfMonth), 'days') + 1
                this.monthHeaders.push({title: this.$moment(month).locale('zh-cn').format('MMMM'), width: days * this.scale})
              }
              // 中间的月
              else {
                let days = this.$moment(month, "YYYY-MM").daysInMonth()
                this.monthHeaders.push({title: this.$moment(month).locale('zh-cn').format('MMMM'), width: days * this.scale})
              }
            }
          }

          recurrence = this.$moment().recur(this.selectedStartDate, this.selectedEndDate).every(1).days();
          let captions = recurrence.all("L").map(x => this.$moment(x).locale('zh-cn').format('DD日'))
          for(let caption of captions) {
            this.dayHeaders.push({title: caption, width: this.scale})
          }
          this.timelineCellCount = this.dayHeaders.length
          break;       
        }
        case '日': {
          this.scale = 80
          let recurrence = this.$moment().recur(this.selectedStartDate, this.selectedEndDate).every(1).days();
          let captions = recurrence.all("L").map(x => this.$moment(x).locale('zh-cn').format('MMMM DD日'))
          for(let caption of captions) {
            this.dayHeaders.push({title: caption, width: this.scale})
          }
          this.timelineCellCount = this.dayHeaders.length
          break;
        }
        case '时': {
          this.scale = 30
          let recurrence = this.$moment().recur(this.selectedStartDate, this.selectedEndDate).every(1).days();
          let captions = recurrence.all("L").map(x => this.$moment(x).locale('zh-cn').format('MMMM DD日'))
          for(let caption of captions) {
            this.dayHeaders.push({title: caption, width: 24 * this.scale})
            for(let i= 0;i <= 23;i++){
              this.hourHeaders.push({title: i + '点', width: this.scale})
            }
          }
          this.timelineCellCount = this.hourHeaders.length
          break;
        }
      }
    },
    openEndDatePicker() {
      this.showEndDatePicker = true;
    },
    openStartDatePicker() {
      this.showStartDatePicker = true;
    },
    confirmEnd(value) {
      let days = this.$moment(value.date).diff(this.$moment(this.startDate),'days')
      if(days < 0) {
        this.selectedStartDate = value.date;
        this.startDate = value.date;
      }
      this.showEndDatePicker = false;
      this.selectedEndDate = value.date;
      this.endDate = value.date;
    },
    confirmStart(value) {
      let days = this.$moment(this.endDate).diff(this.$moment(value.date),'days')
      if(days < 0) {
        this.selectedEndDate = value.date;
        this.endDate = value.date;
      }
      this.showStartDatePicker = false;
      this.selectedStartDate = value.date;
      this.startDate = value.date;
    },
    cancelEnd() {
      this.showEndDatePicker = false;
    },
    cancelStart() {
      this.showStartDatePicker = false;
    },
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