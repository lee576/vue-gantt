<template>
  <div id="app">
    <gantt :headersHeight='100' :rowHeight='60' :tasks='tasks' :mapFields='mapFields'></gantt>
  </div>
</template>
<script>
import Gantt from './components/gantt/Gantt.vue'
export default {
  name: 'App',
	components: { Gantt },
	data() {
		return {
      mapFields: {
        task: 'taskNo',
        priority: 'level',
        startdate: 'start_date',
        enddate: 'end_date',
        takestime: 'spend_time'
      },
      tasks: [{
        taskNo: '12345',
        level: '重要',
        start_date: '2022-03-04 00:00:00',
        end_date: '2022-03-04 23:00:00',
        spend_time: '2'
      },
      {
        taskNo: '54321',
        level: '一般',
        start_date: '2022-03-04 00:00:00',
        end_date: '2022-03-08 23:00:00',
        spend_time: '2'
      }]
    }
	},
	watch: {},
	created() {},
	mounted() {
	},	
  computed:{
  },
  methods:{
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}
#app, html, body {
  height: 100%;
  width: 100%;
}
* {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}
</style>

