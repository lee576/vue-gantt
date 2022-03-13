<template>
  <div class="header">
    <template v-for='(item, index) in headers'>
      <div :property='item.property' :columnindex='index' v-show="item.show" class="headerCaption" :key="index"><span v-bind:style="{ width: item.width + 'px' }">{{item.title}}</span></div>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    headers: {
      type: Array,
      default: () => []
    }
  },
  components: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style lang='less' scoped>
.header {
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  border-left: 1px solid #cecece;
  border-top: 1px solid #cecece;
  border-bottom: 1px solid #cecece;
  width: fit-content;
  .headerCaption {
    text-align: center;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #cecece;
    color: #6b6b6b;
    font-size: 15px;
    font-weight: bold;
  }
}
</style>
