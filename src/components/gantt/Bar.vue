<template>
  <svg @mouseenter.self="mouseenter" ref='bar' class="bar" :width="barWidth + 'px'" :height="barHeight + 'px'"></svg>
</template>
<script>
import Snap from 'snapsvg-cjs'
import interact from 'interactjs'
import { store } from '@/components/gantt/store.js'
export default {
  name: 'Bar',
  props : {
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
	data() {
		return {
      // Bar的高度占容器Row行高的70%, 高度随容器行高变化而变化
      barHeight: this.rowHeight * 0.7,
      barWidth: 0,
      // resize 的拖动方向
      direction: null,
      oldBarDataX: 0
    };
	},
	computed: {
    timelineCellCount (){
      return store.timelineCellCount
    },
    scale (){
      return store.scale
    },
    mode () {
      return store.mode
    }
  },
	created() {},
	mounted() {
    this.$nextTick(() => {
      this.barWidth = this.scale
      // console.log(this.startGanttDate)
      // console.log(this.endGanttDate)

      console.log(this.mode)

      let that = this
      const bar = this.$refs.bar;
      let svg = Snap(bar);
      
      // 定义一个斜条纹的画笔
      let p = svg.path("M10-5-10,15M15,0,0,15M0-5-20,15").attr({
          fill: "none",
          strokeOpacity: '.4',
          stroke: "gray",
          strokeWidth: 5
      }).pattern(0, 0, 10, 10)
      svg.rect(0, 0, this.scale, this.barHeight, 10).attr({fill: p})
      let g = svg.g();
      let innerRect = svg.rect(0, 0, this.scale / 2, this.barHeight, 10)
      // 半透明
      innerRect.attr({fill: 'red',fillOpacity: '.4'})
      innerRect.attr({width: this.scale / 2})
      // 居中显示文字
      let text = svg.text(innerRect.node.width.baseVal.value / 2, '50%', "50%").attr({
          stroke: "white",
          dominantBaseline: 'middle',
          fontSize: '15px'
      });
      // 文本居中
      let xPosition = innerRect.node.width.baseVal.value / 2 - text.getBBox().width / 2
      if( xPosition < 0) {
        text.attr('x', innerRect.node.width.baseVal.value / 2)
      } else {
        text.attr('x', xPosition)
      }
      g.add(innerRect)
      g.add(text)
      
      interact(bar).draggable({
          // enable inertial throwing
          inertia: false,
          // keep the element within the area of #app
          modifiers: [
              interact.modifiers.restrictRect({
                  restriction: 'parent', // restriction: 'parent',
                  endOnly: true
              })
          ],
          // enable autoScroll
          autoScroll: true,
          listeners: {
              // call this function on every dragmove event
              move: dragMoveListener,
              // call this function on every dragend event
              end(event) {
                let target = event.target
                let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
                // 确保 bar 首尾永远落在单元格的边框上
                let multiple = Math.floor(x / that.scale)
                x = multiple * that.scale
                if(x > that.timelineCellCount * that.scale) {
                  x = that.timelineCellCount * that.scale
                }
                // translate the element
                target.style.webkitTransform =
                    target.style.transform =
                    'translate(' + x + 'px, 0px)'
                target.setAttribute('data-x', x)
              }
          },
      })
      
      interact(bar).resizable({
        // resize from all edges and corners
        edges: { left: true, right: true, bottom: false, top: false },
        listeners: {
          end: (event) => {
            // 记住最初 Bar 的宽度
            const _barWidth =  this.barWidth

            // that.row.start_date = '0001-01-01 00:00:00'
            // that.row.end_date = '0001-01-01 23:59:59'
            let target = event.target
            //let x = (parseFloat(target.getAttribute('data-x')) || 0)
            let x = 0
            // 拖动的是 Bar 的右边边缘
            if(event.edges.right) { 
              let remainWidth = event.rect.width % this.scale
              if(remainWidth !== 0) {
                let multiple = Math.floor(event.rect.width / this.scale)
                // 拖到超过比例尺最小单位一半宽度
                if(remainWidth < (this.scale / 2)) {
                  event.rect.width = multiple * this.scale
                } else {
                  // 拖到不足比例尺最小单位一半宽度
                  event.rect.width = (multiple + 1) * this.scale
                }
              }
            }
            
            // 拖动的是 Bar 的左边边缘
            if(event.edges.left) {  
              let offset = (Math.floor(Math.abs(event.rect.width - _barWidth) / this.scale) + 1)* this.scale
              if(offset < this.scale) {
                offset = this.scale
              }
              if (event.deltaRect.left < 0) {
                event.rect.width = _barWidth + offset
              }
              else {
                event.rect.width = _barWidth - offset
              }
              if (event.rect.width < this.scale)
                event.rect.width = this.scale
              if (event.rect.width > this.timelineCellCount * this.scale)
                event.rect.width = this.timelineCellCount * this.scale

              x = Number(this.oldBarDataX) - Number(event.rect.width - _barWidth)
              if(x < 0)
                x = 0
            }
            else {
              x = (parseFloat(target.getAttribute('data-x')) || 0)
            }
            // update the element's style
            target.style.width = event.rect.width + 'px'
            target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, 0px)'
            target.setAttribute('data-x', x)
            target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height)

            let svg = Snap(bar);
            // 定义一个斜条纹的画笔
            let p = svg.path("M10-5-10,15M15,0,0,15M0-5-20,15").attr({
                fill: "none",
                strokeOpacity: '.4',
                stroke: "gray",
                strokeWidth: 5
            }).pattern(0, 0, 10, 10)

            svg.rect(0, 0,event.rect.width, event.rect.height, 10).attr({fill: p})
            let g = svg.g();
            let innerRect = svg.rect(0, 0, event.rect.width / 2, event.rect.height, 10)

            // 半透明
            innerRect.attr({fill: 'red',fillOpacity: '.4'})
            let text = svg.text(innerRect.node.width.baseVal.value / 2, '50%', "50%").attr({
                stroke: "white",	// 蓝色
                dominantBaseline: 'middle',
                fontSize: '15px'
            });

            // 文本居中
            let xPosition = innerRect.node.width.baseVal.value / 2 - text.getBBox().width / 2
            if( xPosition < 0) {
              text.attr('x', innerRect.node.width.baseVal.value / 2)
            } else {
              text.attr('x', xPosition)
            }
            this.barWidth = event.rect.width
            g.add(innerRect)
            g.add(text)
          }
        },
        modifiers: [
          // keep the edges inside the parent
          interact.modifiers.restrictEdges({
            outer: 'parent'
          }),

          // minimum size
          interact.modifiers.restrictSize({
            min: { width: this.scale, height: this.barHeight },
            max: { width: this.scale * this.timelineCellCount, height: this.barHeight }
          })
        ],
        inertia: false,
        hold: 1
      })
      // 拖动只改变x轴的坐标
      function dragMoveListener(event) {
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
    })
	},
	methods: {
    isChildOf(child, parent) {
      if(child && parent) {
          let parentNode = child.parentNode;
          while(parentNode) {
              if(parent === parentNode) {
                  return true;
              }
              parentNode = parentNode.parentNode;
          }
      }
      return false;
    },
    mouseenter(event) {
      // 记录最初的 x轴值
      this.oldBarDataX = event.srcElement.getAttribute('data-x')
      event.stopPropagation()
    }
  }
}
</script>
<style scoped>
.bar {
  position: absolute;
  z-index: 100;
}
</style>

