<template>
  <div v-if='showRow' @mouseover="hoverActive()" @mouseleave="hoverInactive()" :class="{ active: hover }">
    <div style="width: 100%;border-top: 1px solid #cecece;margin:0px 0px -1px -1px;"></div>
    <div class="row" @dblclick="setEditTask(row)" v-bind:style="{ height: rowHeight + 'px' }">
      <template v-for='(header,headerIndex) in headers'>
        <div class="cellNo" :key="headerIndex" v-if="header.property === 'no'"
             v-bind:style="{ minWidth: header.width + 'px',
                             maxWidth: header.width + 'px',
                             height: rowHeight + 'px',
                             paddingLeft: '40px'
                           }">{{row.no}}
          <div v-tip='tips' class="toolbar" v-bind:style="{ height: rowHeight + 'px' }">
            <svg @click="setSubTask(row)" class="btn" t="1646898128772" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6933">
              <path class="btn" fill="gray" d="M511.256 0C228.9 0 0 228.9 0 511.256 0 623.8 36.805 727.509 98.429 811.957l38.415-39.993c-51.592-73.945-82.067-163.708-82.067-260.709 0-252.105 204.374-456.479 456.479-456.479 252.089 0 456.466 204.374 456.466 456.479 0 252.101-204.376 456.466-456.466 456.466-96.102 0-185.157-29.847-258.709-80.565l-34.387 42.609c83.032 58.26 183.962 92.734 293.096 92.734 282.351 0 511.245-228.894 511.245-511.244C1022.5 228.9 793.606 0 511.256 0z" p-id="6934"></path>
              <path class="btn" fill="gray" d="M492.979 255.62 492.979 492.986 255.613 492.986 255.613 547.762 492.979 547.762 492.979 785.128 547.756 785.128 547.756 547.762 785.121 547.762 785.121 492.986 547.756 492.986 547.756 255.62Z" p-id="6935"></path>
            </svg>
            <svg @click="setRemoveTask(row)" class="btn" t="1646898833214" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7072">
              <path class="btn" fill="gray" d="M658.276045 767.993958 658.276045 274.295l329.126 0L987.402045 219.44 658.276 219.44l0-18.281c0-80.787046-65.492992-146.284032-146.276045-146.284032-80.790016 0-146.276045 65.496986-146.276045 146.284032l0 18.281L36.597 219.44l0 54.855 109.695 0 0 694.83L877.7 969.125l0-548.55-54.855 0L822.845 914.27l-621.69 0L201.155 274.295l164.569 0 0 493.699 54.848 0L420.572 274.295l182.85 0 0 493.699L658.276 767.994zM420.571034 219.440026l0-18.281c0-50.492006 40.932966-91.420979 91.428966-91.420979 50.489037 0 91.420979 40.928973 91.420979 91.420979l0 18.281L420.571 219.440026z" p-id="7073"></path>
            </svg>
          </div>
        </div>
        <div v-else v-show="header.show" class="cell" :key= "headerIndex" v-bind:style="{ minWidth: header.width + 'px', maxWidth: header.width + 'px',height: rowHeight + 'px' }">{{ checkField(row,header.property)  }}</div>
      </template>
    </div>
    <div style="width: 100%;border-top: 1px solid #cecece;margin:0px 0px -1px -1px;"></div>
  </div>
</template>
<script>
import { store, mutations } from '@/components/gantt/store.js'
import { EventBus } from '../EventBus.js'
import tip from '../tip'
export default {
  directives: {
    tip
  },
  props: {
    headers: {
      type: Array,
      default: () => []
    },
    rowHeight: {
      type: Number,
      default: 0
    },
    row: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      showRow: true,
      hover: false,
      tips:'aaaaaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    }
  },
  computed: {
    mapFields () {
      return store.mapFields
    },
    subTask () {
      return store.subTask
    }
  },
  mounted () {
    // 响应 Task hover 事件
    EventBus.$on('taskHover', (rowId, hover) => {
      if (this.row[this.mapFields['id']] === rowId) {
        this.hover = hover
      }
    })
  },
  methods: {
    setSubTask: mutations.setSubTask,
    setEditTask: mutations.setEditTask,
    setRemoveTask: mutations.setRemoveTask,
    checkField (row, property) {
      if (this.mapFields[property]) { return row[this.mapFields[property]] } else if (row[property]) {
        return row[property]
      } else return null
    },
    hoverActive () {
      this.hover = true
      EventBus.$emit('barHover', this.row[this.mapFields['id']], this.hover)
    },
    hoverInactive () {
      this.hover = false
      EventBus.$emit('barHover', this.row[this.mapFields['id']], this.hover)
    },
    addRootTask () {
      EventBus.$emit('addRootTask', this.row)
    }
  }
}
</script>
<style lang='less' scoped>
  .active {
    background: #FFF3A1;
  }
  .row {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: flex-start;
    border-top: 1px solid #cecece;
    border-right: 0px solid #cecece;
    border-bottom: 1px solid #cecece;
    margin:0px 1px -1px -1px;
    width: fit-content;
    .cellNo {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 10px;
      border-top: 1px solid #cecece;
      border-right: 1px solid #cecece;
      border-bottom: 1px solid #cecece;
      margin:0px 0px 0px 1px;
      position: relative;
      .toolbar {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        position:absolute;
        right: 0px;
        width: 30px;
        .btn {
          width: 15px;
          height: 15px;
          position: relative;
          :hover{
            filter: drop-shadow(0px 0px 0px #2B76B3);
          }
        }
      }
    }
    .cell {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      border-top: 1px solid #cecece;
      border-right: 1px solid #cecece;
      border-bottom: 1px solid #cecece;
      margin:0px 0px 0px 1px;
    }
  }
.balloon{position: absolute;background-color: #FFF;border: 1px solid #a4acb5;padding: 5px 10px;border-radius: 4px;z-index: 100;}
.balloon_top{width: 13px;height: 7px;position: absolute;background: url("~@/components/gantt/images/balloon_up.gif") no-repeat;top: -7px;}
.balloon_meg{padding-left: 25px;background: url("~@/components/gantt/images/balloon_warning.gif") no-repeat;line-height: 20px;overflow: hidden;}
.balloon_txt{font-size:12px;}
</style>
