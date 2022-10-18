<template>
  <div v-if='showRow' @mouseover="hoverActive()" @mouseleave="hoverInactive()" :class="{ active: hover }">
    <div style="border-top: 0px solid #cecece;margin:-2px 0px -1px -1px;"></div>
      <div class="barRow" v-bind:style="{ height: rowHeight + 'px'}">
        <svg key="row.no" v-if='showRow' ref='bar' class="bar" :height="barHeight + 'px'" :class="{ active: hover }"></svg>
        <template v-for='(count) in timelineCellCount'>
          <div class="cell" :key= "count + row.id + timelineCellCount + showRow + '_cell'" v-bind:style="{ 
            minWidth: scale + 'px', 
            maxWidth: scale + 'px',
            height: rowHeight + 'px',
            background: WeekEndColor(count),
            opacity: 0.4
            }"></div>
        </template>
      </div>
    <div style="border-top: 0px solid #cecece;margin:0px 0px 1px -1px;"></div>
  </div>
</template>
<script>
import Snap from 'snapsvg-cjs'
import interact from 'interactjs'
import { EventBus } from './EventBus.js'
import { store, mutations } from '@/components/gantt/store.js'
export default {
  name: 'Bar',
  props: {
    rowHeight: {
      type: Number,
      default: 0
    },
    row: {
      type: Object,
      default: () => {}
    },
    startGanttDate: {
      type: String
    },
    endGanttDate: {
      type: String
    }
  },
  data () {
    return {
      // Bar的高度占容器Row行高的70%, 高度随容器行高变化而变化
      barHeight: this.rowHeight * 0.7,
      // resize 的拖动方向
      direction: null,
      oldBarDataX: 0,
      oldBarWidth: 0,
      showRow: true,
      hover: false,
      barColor: ''
    }
  },
  computed: {
    timelineCellCount () {
      return store.timelineCellCount
    },
    scale () {
      return store.scale
    },
    mode () {
      return store.mode
    },
    mapFields () {
      return store.mapFields
    }
  },
  created () {
    // 设置Bar的颜色 侦听事件接收配置返回的方法
    EventBus.$on('returnBarColor', (rowId, color) => {
      if (this.row[this.mapFields['id']] === rowId) {
        this.barColor = color
      }
    })
  },
  mounted () {
    this.$nextTick(() => {
      // 响应 Task hover 事件
      EventBus.$on('barHover', (rowId, hover) => {
        if (this.row[this.mapFields['id']] === rowId) {
          this.hover = hover
        }
      })

      // 滚动条定位到 Bar 的开始位置
      EventBus.$on('moveToBarStart', (rowId) => {
        if (this.row[this.mapFields['id']] === rowId) {
          this.$nextTick(() => {
            if (this.$refs.bar) {
              EventBus.$emit('scrollToBar', this.$refs.bar.getAttribute('data-x'))
            }
          })
        }
      })

      // 设置Bar的颜色 传递事件调用配置的方法
      EventBus.$emit('setBarColor', this.row)

      if (this.$refs.bar) {
        this.drowBar(this.$refs.bar)
      }

      // 滚动条定位到 Bar 的结束位置
      EventBus.$on('moveToBarEnd', (rowId) => {
        if (this.row[this.mapFields['id']] === rowId) {
          this.$nextTick(() => {
            if (this.$refs.bar) {
              EventBus.$emit('scrollToBar', Number(this.$refs.bar.getAttribute('data-x')) +
                Number(this.$refs.bar.width.baseVal.value) - Number(this.scale))
            }
          })
        }
      })
    })
  },
  methods: {
    setBarDate: mutations.setBarDate,
    setAllowChangeTaskDate : mutations.setAllowChangeTaskDate,
    isChildOf (child, parent) {
      if (child && parent) {
        let parentNode = child.parentNode
        while (parentNode) {
          if (parent === parentNode) {
            return true
          }
          parentNode = parentNode.parentNode
        }
      }
      return false
    },
    drowBar (bar) {
      bar.innerHTML = ''
      const that = this
      let dataX = 0
      switch (this.mode) {
        case '月':
        case '日': {
          let fromPlanStartDays = this.$moment(this.row[this.mapFields.startdate]).diff(this.$moment(this.startGanttDate), 'days')
          // 计算Bar起始x轴坐标
          dataX = this.scale * fromPlanStartDays
          // 计算Bar的长度
          let spendDays = this.$moment(this.row[this.mapFields.enddate]).diff(this.$moment(this.row[this.mapFields.startdate]), 'days') + 1
          this.oldBarWidth = spendDays * this.scale
          this.row[this.mapFields.takestime] = spendDays + '天'
          break
        }
        case '时': {
          let fromPlanStartHours = this.$moment(this.row[this.mapFields.startdate]).diff(this.$moment(this.startGanttDate), 'hours')
          // 计算Bar起始x轴坐标
          dataX = this.scale * fromPlanStartHours
          // 计算Bar的长度
          let spendHours = this.$moment(this.row[this.mapFields.enddate]).diff(this.$moment(this.row[this.mapFields.startdate]), 'hours') + 1
          this.oldBarWidth = spendHours * this.scale
          this.row[this.mapFields.takestime] = spendHours + '小时'
          break
        }
      }
      this.oldBarDataX = dataX
      let svg = Snap(bar)
      // 设置Bar起始x轴坐标
      bar.setAttribute('data-x', dataX)
      bar.setAttribute('width', this.oldBarWidth)
      bar.setAttribute('stroke', '#cecece')
      bar.setAttribute('stroke-width', '1px')
      bar.style.webkitTransform =
                    bar.style.transform =
                    'translate(' + dataX + 'px, 0px)'
      // 定义一个斜条纹的画笔
      let p = svg.path('M10-5-10,15M15,0,0,15M0-5-20,15').attr({
        fill: 'none',
        strokeOpacity: '.4',
        stroke: 'gray',
        strokeWidth: 5
      }).pattern(0, 0, 10, 10)

      let g = svg.g()
      let innerRectWidth = 0
      if (this.row[this.mapFields.progress]) {
        innerRectWidth = Number(this.oldBarWidth) * Number(this.row[this.mapFields.progress])
      } else {
        innerRectWidth = Number(this.oldBarWidth)
      }

      let innerRect = svg.rect(0, 0, innerRectWidth, this.barHeight, 10)
      innerRect.attr({class: 'innerRect'})

      // 半透明
      innerRect.attr({fill: this.barColor, fillOpacity: '.4'})
      innerRect.attr({width: innerRectWidth})
      g.add(innerRect)
      let outerRect = svg.rect(0, 0, this.oldBarWidth, this.barHeight, 10).attr({fill: p, stroke: '#cecece', strokeWidth: '1px'})
      outerRect.hover(function () {
        // 移入
        this.animate({
          stroke: '#0066ff',
          strokeWidth: '5px',
          strokeOpacity: '.4'
        }, 200)
      }, function () {
        // 移出
        this.animate({
          stroke: 'none',
          strokeWidth: '0px'
        }, 200)
      })
      // 居中显示文字
      let text = svg.text(innerRect.node.width.baseVal.value / 2, '50%', this.row[this.mapFields.progress]).attr({
        stroke: '#faf7ec',
        dominantBaseline: 'middle',
        fontSize: '15px',
        fillOpacity: '1'
      })
      // 文本居中
      let xPosition = innerRect.node.width.baseVal.value / 2 - text.getBBox().width / 2
      if (xPosition < 0) {
        text.attr('x', innerRect.node.width.baseVal.value / 2)
      } else {
        text.attr('x', xPosition)
      }

      // 重置事件的挂载
      if (interact.isSet(bar)) {
        interact(bar).unset()
      }

      interact(bar).draggable({
        inertia: false,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: 'parent', // 只能在父元素内拖动
            endOnly: true
          })
        ],
        autoScroll: true,
        listeners: {
          start: (event) => {
            // 记录拖动前的x轴坐标
            this.oldBarDataX = event.target.getAttribute('data-x')
            // 记录拖动前Bar的宽度
            this.oldBarWidth = event.target.width.baseVal.value
          },
          move: dragMoveListener,
          end: (event) => {
            let target = event.target
            let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
            // 确保 bar 首尾永远落在单元格的边框上
            let multiple = Math.floor(x / that.scale)
            x = multiple * that.scale
            if (x > that.timelineCellCount * that.scale) {
              x = that.timelineCellCount * that.scale
            }
            target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, 0px)'
            target.setAttribute('data-x', x)

            // 计算x轴拖动的偏移量
            let offsetX = Number(x) - Number(this.oldBarDataX)
            switch (this.mode) {
              case '月':
              case '日': {
                let offsetStartHours = (offsetX / this.scale) * 24
                this.row[this.mapFields.startdate] = this.$moment(this.row[this.mapFields.startdate]).locale('zh-cn').add(offsetStartHours, 'hours').format('YYYY-MM-DD HH:mm:ss')
                this.row[this.mapFields.enddate] = this.$moment(this.row[this.mapFields.enddate]).locale('zh-cn').add(offsetStartHours, 'hours').format('YYYY-MM-DD HH:mm:ss')
                break
              }
              case '时': {
                let offsetStartHours = (offsetX / this.scale)
                this.row[this.mapFields.startdate] = this.$moment(this.row[this.mapFields.startdate]).locale('zh-cn').add(offsetStartHours, 'hours').format('YYYY-MM-DD HH:mm:ss')
                this.row[this.mapFields.enddate] = this.$moment(this.row[this.mapFields.enddate]).locale('zh-cn').add(offsetStartHours, 'hours').format('YYYY-MM-DD HH:mm:ss')
                break
              }
            }
            this.setBarDate({
              id: this.row[this.mapFields.id],
              startDate: this.row[this.mapFields.startdate],
              endDate: this.row[this.mapFields.enddate]
            })
          }
        }
      })
      interact(bar).resizable({
        // 调整大小的时候确定哪些边可以拖动
        edges: { left: true, right: true, bottom: false, top: false },
        listeners: {
          start: (event) => {
            // 记录调整大小前的x轴坐标
            this.oldBarDataX = event.target.getAttribute('data-x')
            // 记录调整大小前Bar的宽度
            this.oldBarWidth = event.target.getAttribute('width')
          },
          end: (event) => {
            // 检测Bar是否能拖动
            this.setAllowChangeTaskDate(this.row)
            let target = event.target
            let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx

            let remainWidth = event.rect.width % this.scale
            if (remainWidth !== 0) {
              let multiple = Math.floor(event.rect.width / this.scale)
              // 拖到超过比例尺最小单位一半宽度
              if (remainWidth < (this.scale / 2)) {
                event.rect.width = multiple * this.scale
              } else {
                // 拖到不足比例尺最小单位一半宽度
                event.rect.width = (multiple + 1) * this.scale
              }
            }
            let offsetWidth = this.oldBarWidth - event.rect.width
            // 拖动的是 Bar 的左边边缘
            if (event.edges.left) {
              x += offsetWidth
            }
            target.setAttribute('width', event.rect.width)
            target.style.width = event.rect.width + 'px'
            target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, 0px)'
            target.setAttribute('data-x', x)
            target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height)

            let svg = Snap(bar)
            let p = svg.path('M10-5-10,15M15,0,0,15M0-5-20,15').attr({
              fill: 'none',
              strokeOpacity: '.4',
              stroke: 'gray',
              strokeWidth: 5
            }).pattern(0, 0, 10, 10)

            let innerRectWidth = 0
            if (this.row[this.mapFields.progress]) {
              innerRectWidth = Number(event.rect.width) * Number(this.row[this.mapFields.progress])
            } else {
              innerRectWidth = Number(event.rect.width)
            }

            let g = svg.g()
            innerRect.attr({class: 'innerRect'})
            // 半透明
            innerRect.attr({fill: this.barColor, fillOpacity: '.4'})
            innerRect.attr({width: innerRectWidth})
            g.add(innerRect)
            let outerRect = svg.rect(0, 0, event.rect.width, this.barHeight, 10).attr({fill: p, stroke: '#cecece', strokeWidth: '1px'})
            outerRect.hover(function () {
              // 移入
              this.animate({
                stroke: '#0066ff',
                strokeWidth: '5px',
                strokeOpacity: '.4'
              }, 200)
            }, function () {
              // 移出
              this.animate({
                stroke: 'none',
                strokeWidth: '0px',
                strokeOpacity: '.4'
              }, 200)
            })
            // 居中显示文字
            let text = svg.text(innerRect.node.width.baseVal.value / 2, '50%', this.row[this.mapFields.progress]).attr({
              stroke: '#faf7ec',
              dominantBaseline: 'middle',
              fontSize: '15px',
              fillOpacity: '1'
            })
            // 文本居中
            let xPosition = innerRect.node.width.baseVal.value / 2 - text.getBBox().width / 2
            if (xPosition < 0) {
              text.attr('x', innerRect.node.width.baseVal.value / 2)
            } else {
              text.attr('x', xPosition)
            }

            // 设置拖动后的日期
            switch (this.mode) {
              case '月':
              case '日': {
                // 拖动的是 Bar 的左边边缘
                if (event.edges.left) {
                  let offsetStart = ((this.oldBarDataX - x) / this.scale) * 24
                  this.row[this.mapFields.startdate] = this.$moment(this.row[this.mapFields.startdate]).locale('zh-cn').add(-offsetStart, 'hours').format('YYYY-MM-DD HH:mm:ss')
                }
                // 拖动的是 Bar 的右边边缘
                else {
                  let offsetEnd = (offsetWidth / this.scale) * 24
                  this.row[this.mapFields.enddate] = this.$moment(this.row[this.mapFields.enddate]).locale('zh-cn').add(-offsetEnd, 'hours').format('YYYY-MM-DD HH:mm:ss')
                }
                this.row[this.mapFields.takestime] = this.$moment(this.row[this.mapFields.enddate]).diff(this.$moment(this.row[this.mapFields.startdate]), 'days') + 1 + '天'
                break
              }
              case '时': {
                // 拖动的是 Bar 的左边边缘
                if (event.edges.left) {
                  let offsetStart = (this.oldBarDataX - x) / this.scale
                  this.row[this.mapFields.startdate] = this.$moment(this.row[this.mapFields.startdate]).locale('zh-cn').add(-offsetStart, 'hours').format('YYYY-MM-DD HH:mm:ss')
                }
                // 拖动的是 Bar 的右边边缘
                else {
                  let offsetEnd = offsetWidth / this.scale
                  this.row[this.mapFields.enddate] = this.$moment(this.row[this.mapFields.enddate]).locale('zh-cn').add(-offsetEnd, 'hours').format('YYYY-MM-DD HH:mm:ss')
                }
                this.row[this.mapFields.takestime] = this.$moment(this.row[this.mapFields.enddate]).diff(this.$moment(this.row[this.mapFields.startdate]), 'hours') + 1 + '小时'
                break
              }
            }
            this.setBarDate({
              id: this.row[this.mapFields.id],
              startDate: this.row[this.mapFields.startdate],
              endDate: this.row[this.mapFields.enddate]
            })
          }
        },
        modifiers: [
          // 拖拽时边缘只能在父容器里面
          interact.modifiers.restrictEdges({
            outer: 'parent'
          }),
          // 最小宽高
          interact.modifiers.restrictSize({
            min: { width: this.scale, height: this.barHeight }
          })
        ],
        inertia: false,
        hold: 1
      })
      
      
     // 拖动只改变x轴的坐标
      function dragMoveListener (event) {
        let {x} = event.target.dataset
        x = (parseFloat(event.target.getAttribute('data-x')) || 0) + event.dx
        Object.assign(event.target.style, {
          width: `${event.rect.width}px`,
          height: `${event.rect.height}px`,
          transform: `translate(${x}px, 0px)`
        })
        event.target.setAttribute('data-x', x)
        event.target.setAttribute('data-y', 0)
      }
    },
    hoverActive () {
      this.hover = true
      EventBus.$emit('taskHover', this.row[this.mapFields['id']], this.hover)
    },
    hoverInactive () {
      this.hover = false
      EventBus.$emit('taskHover', this.row[this.mapFields['id']], this.hover)
    },
    WeekEndColor(count) {
      switch (this.mode) {
        case '月':
        case '日':
           {
             let currentDate = this.$moment(this.startGanttDate).add(Number(count), 'days'); 
             if(this.$moment(currentDate).isoWeekday() === 7 || this.$moment(currentDate).isoWeekday() === 1) 
             {
               return '#F3F4F5'
             }
             break
           }
      }
    }
  },
  deactivated () {
    // 使用了 keep-alive 时注销掉所有事件
    if (this.$refs.bar) {
      if (interact.isSet(this.$refs.bar)) { interact(this.$refs.bar).unset() }
      this.showRow = false
    }
  },
  beforeDestory () {
    // 组件销毁前注销掉所有事件
    if (this.$refs.bar) {
      if (interact.isSet(this.$refs.bar)) { interact(this.$refs.bar).unset() }
      this.showRow = false
    }
  }
}
</script>
<style lang='less' scoped>
  .active {
    background: #FFF3A1;
  }
  .barRow {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: flex-start;
    border-top: 1px solid #cecece;
    border-right: 0px solid #cecece;
    border-bottom: 0px solid #cecece;
    margin:0px 1px -1px -1px;
    width: fit-content;
    position: relative;
    .bar {
      position: absolute;
      z-index: 100;
      /* 给Bar设置一个背景色 */
      background-color: #faf7ec;
      border-radius: 10px;
    }
    .cell {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      border-top: 1px solid #cecece;
      border-right: 1px solid #cecece;
      border-bottom: 1px solid #cecece;
      margin:-1px 0px 0px 0px;
    }
  }
</style>
