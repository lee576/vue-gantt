<template>
  <div ref='tableBar' class="table">
    <div class="header" v-bind:style="{ height: headersHeight + 'px' }">
      <div style="width: 100%;border-top: 1px solid #cecece;margin:0px 0px -1px -1px;"></div>
      <timeline-header :hourHeaders='hourHeaders' :dayHeaders='dayHeaders' :monthHeaders='monthHeaders'></timeline-header>
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
    monthHeaders () {
      return store.monthHeaders
    },
    hourHeaders () {
      return store.hourHeaders
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
    })
  },
  methods: {

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
