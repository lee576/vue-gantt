<template>
 <div ref="splitPane" class="split-pane" :class="direction" :style="{ flexDirection: direction }">
  <div class="pane pane-one" :style="lengthType + ':' + paneLengthValue">
    <slot name="one"></slot>
  </div>
  <div
    ref="trigger"
    class="pane-trigger"
    v-if="triggerDefaultColor && triggerMoveColor"
    :style="lengthType + ':' + triggerLengthValue + ';' + triggerBackGroud">
      <div @click="handleMouseOver"
        @mouseover="handleMouseOver"
        @mouseleave="handleMouseLeave"
        @mousedown="handleMouseDown"
        class="icon"
        :style="lengthType + ':' + triggerLengthValue">
      </div>
  </div>
  <div class="pane pane-two" :style="lengthType + ':calc(' + (100 - paneLengthPercent) + '% - ' + triggerLength / 2 + 'px)'">
    <slot name="two"></slot>
  </div>
 </div>
</template>
<script>
export default {
  props: {
    direction: {
      type: String,
      default: 'row'
    },
    min: {
      type: Number,
      default: 10
    },
    max: {
      type: Number,
      default: 90
    },
    paneLengthPercent: {
      type: Number,
      default: 50
    },
    triggerLength: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      triggerLeftOffset: 0, // 鼠标距滑动器左(顶)侧偏移量,
      triggerBackGroud: ''
    }
  },
  computed: {
    lengthType () {
      return this.direction === 'row' ? 'width' : 'height'
    },
    // 拖拽条默认颜色
    triggerDefaultColor () {
      return this.direction === 'row' ? '-webkit-gradient(linear,left top,right top,from(white), to(#D7D7D9))' : '-webkit-gradient(linear, 0 0, 0 bottom, from(white), to(#D7D7D9))'
    },
    // 鼠标拖动时拖拽条的颜色
    triggerMoveColor () {
      return this.direction === 'row' ? '-webkit-gradient(linear,left top,right top,from(#A6D4E1), to(#2591C8))' : '-webkit-gradient(linear, 0 0, 0 bottom, from(#A6D4E1), to(#2591C8))'
    },
    paneLengthValue () {
      return `calc(${this.paneLengthPercent}% - ${this.triggerLength / 2 + 'px'})`
    },
    triggerLengthValue () {
      return this.triggerLength + 'px'
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.triggerBackGroud = 'background:' + this.triggerDefaultColor
    })
  },
  methods: {
    handleMouseLeave () {
      this.$nextTick(() => {
        this.triggerBackGroud = 'background:' + this.triggerDefaultColor
      })
    },
    handleMouseOver () {
      this.$nextTick(() => {
        this.triggerBackGroud = 'background:' + this.triggerMoveColor
      })
    },
    // 按下滑动器
    handleMouseDown (e) {
      document.addEventListener('mousemove', this.handleMouseMove)
      document.addEventListener('mouseup', this.handleMouseUp)

      if (this.direction === 'row') {
        this.triggerLeftOffset = e.pageX - e.srcElement.getBoundingClientRect().left
      } else {
        this.triggerLeftOffset = e.pageY - e.srcElement.getBoundingClientRect().top
      }
    },

    // 按下滑动器后移动鼠标
    handleMouseMove (e) {
      this.$nextTick(() => {
        this.triggerBackGroud = 'background:' + this.triggerMoveColor
      })
      const clientRect = this.$refs.splitPane.getBoundingClientRect()
      let paneLengthPercent = 0
      if (this.direction === 'row') {
        const offset = e.pageX - clientRect.left - this.triggerLeftOffset + this.triggerLength / 2
        paneLengthPercent = (offset / clientRect.width) * 100
      } else {
        const offset = e.pageY - clientRect.top - this.triggerLeftOffset + this.triggerLength / 2
        paneLengthPercent = (offset / clientRect.height) * 100
      }
      if (paneLengthPercent < this.min) {
        paneLengthPercent = this.min
      }
      if (paneLengthPercent > this.max) {
        paneLengthPercent = this.max
      }
      this.$emit('update:paneLengthPercent', paneLengthPercent)
    },
    // 松开滑动器
    handleMouseUp () {
      this.$nextTick(() => {
        this.triggerBackGroud = 'background:' + this.triggerDefaultColor
      })
      document.removeEventListener('mousemove', this.handleMouseMove)
    }
  }
}
</script>
<style lang="less" scoped>
@icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAABHNCSVQICAgIfAhkiAAAAIJJREFUKFNjZMANBIBS64E4EIg/YFPGiEdzA1CuHogbgRjExgAgzQeA+D8WOQckMZAanJrxOAC3FD5nEzSQYs0gv2HzM1E2k6URZDLI2cihStA2ZAUU+5kk29BtxpVICBoKS2HYFNojCR7ElcJw2dAAlCCYtnFpBuWqDUAcAMRYcxUAYvURjNoDrtgAAAAASUVORK5CYII=';
@background-size: 10px 10px;
.split-pane {
 background: transparent;
 height: 100%;
 display: flex;
  .pane-one {
    background: transparent;
  }
  .pane-trigger {
    border-radius: 25px;
    user-select: none;
    border-width: 0.1em;
  }
  .pane-two {
    flex: 1;
    background: transparent;
  }
}
.split-pane.row {
  .pane {
    height: 100%;
  }
  .pane-trigger {
    margin-left: 1px ;
    margin-right: 1px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .icon {
      cursor: col-resize;
      height: 10px;
      width: 100%;
      background-image: url(@icon);
      background-repeat:no-repeat;
      background-size : @background-size;
      transform: rotate(90deg);
    }
  }
}
.split-pane.column {
  .pane {
    width: 100%;
  }
  .pane-trigger {
    margin-top: 1px ;
    margin-bottom: 1px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .icon {
      cursor: row-resize;
      height: 100%;
      width: 10px;
      background-image: url(@icon);
      background-repeat:no-repeat;
      background-size : @background-size;
    }
  }
}
</style>
