<template>
  <div ref='tableBar' class="table">
    <div class="header" v-bind:style="{ height: headersHeight + 'px' }">
      <div style="width: 100%;border-top: 1px solid #cecece;margin:0px 0px -1px -1px;"></div>
      <timeline-header :weekHeaders='weekHeaders' :hourHeaders='hourHeaders' :dayHeaders='dayHeaders' :monthHeaders='monthHeaders'></timeline-header>
      <div style="width: 100%;border-top: 1px solid #cecece;margin:0px 0px -1px -1px;"></div>
    </div>
    <div class="content" v-bind:style="{ height: 'calc(100% - ' + headersHeight + 'px)' , width:'fit-content'}">
      <table-content :rowHeight='rowHeight'></table-content>
    </div>
  </div>
</template>
<script>
import TableContent from './TableContent.vue'
import TimelineHeader from './TimelineHeader.vue'
import { EventBus } from './EventBus.js'
import { store } from '@/components/gantt/store.js'
export default {
  props: {
    headersHeight: {
      type: Number,
      default: 50
    },
    rowHeight: {
      type: Number,
      default: 50
    }
  },
  components: { TableContent, TimelineHeader },
  data () {
    return {
    }
  },
  computed: {
    dayHeaders () {
      return store.dayHeaders
    },
    weekHeaders () {
      return store.weekHeaders
    },
    monthHeaders () {
      return store.monthHeaders
    },
    hourHeaders () {
      return store.hourHeaders
    },
    startGanttDate () {
      return store.startGanttDate
    },
    mode () {
      return store.mode
    },
    scale () {
      return store.scale
    }
  },
  watch: {

  },
  created () {},
  mounted () {
    this.$nextTick(() => {
      EventBus.$on('scrollToBar', (left) => {
        if (this.$refs.tableBar) {
          this.$refs.tableBar.scrollLeft = left
        }
      })
      EventBus.$on('scrollToToday', () => {
        this.scrollToToday()
      })
    })
  },
  methods: {
    // 滚动条坐标移动到今天
    scrollToToday () {
      if (this.$refs.tableBar) {
        switch (this.mode) {
          case '月':
          case '日': {
            this.$refs.tableBar.scrollLeft =
          Number(this.$moment(this.$moment().format('YYYY-MM-DD')).diff(this.$moment(this.startGanttDate), 'days')) * Number(this.scale)
            break
          }
          case '时': {
            this.$refs.tableBar.scrollLeft =
          Number(this.$moment(this.$moment().format('YYYY-MM-DD')).diff(this.$moment(this.startGanttDate), 'hours')) * Number(this.scale)
            break
          }
        }
      }
    }
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
  .header {
    width: 100%;
    border: 0px;
  }
  .content {
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
