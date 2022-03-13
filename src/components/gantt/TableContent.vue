<template>
  <div ref='barContent' @scroll="scroll()" @mouseover="mouseover()"
    v-if='tasks' class="content">
    <BarRecursionRow :rowHeight='rowHeight' :tasks='tasks'></BarRecursionRow>
  </div>
</template>
<script>
import { store, mutations } from '@/components/gantt/store.js'
import { EventBus } from './EventBus.js'
import BarRecursionRow from './BarRecursionRow.vue'
export default {
  props: {
    rowHeight: {
      type: Number,
      default: 0
    },
    headers: {
      type: Array,
      default: () => []
    }
  },
  components: {BarRecursionRow},
  data () {
    return {
      scrollFlag: true
    }
  },
  watch: {
    scrollFlag: function (newVal) {
      this.setScrollFlag(newVal)
    }
  },
  computed: {
    tasks () {
      return store.tasks
    },
    timelineCellCount () {
      return store.timelineCellCount
    },
    scale () {
      return store.scale
    },
    startGanttDate () {
      return store.startGanttDate
    },
    endGanttDate () {
      return store.endGanttDate
    },
    mapFields () {
      return store.mapFields
    }
  },
  created () {},
  mounted () {
    EventBus.$on('scroll', (scrollTop) => {
      this.$refs.barContent.scrollTop = scrollTop
    })
  },
  methods: {
    setScrollFlag: mutations.setScrollFlag,
    // 找出根节点
    getRootNode () {
      return this.tasks.filter(obj => obj[this.mapFields['parentId']] === '0')
    },
    scroll () {
      if (this.scrollFlag) {
        EventBus.$emit('scroll', this.$refs.barContent.scrollTop)
      }
    },
    mouseover () {
      this.scrollFlag = true
    }
  }
}
</script>
<style lang='less' scoped>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: flex-start;
  margin: 0px 0px -1px 0px;
  font-size: 20px;
}
</style>
