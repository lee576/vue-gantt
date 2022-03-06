<template>
  <div id="app">
    <svg class="draggable" id="svg" width="50px" height="50px"></svg>
    <div class="dropzone" style="width:100%;min-height:50px;border:2px solid #F1F4F5;margin:2px;padding:5px"></div>
    <div class="dropzone" style="width:100%;min-height:50px;border:2px solid #F1F4F5;margin:2px;padding:5px"></div>
  </div>
</template>
<script>
import Snap from 'snapsvg-cjs'
import interact from 'interactjs'
export default {
  name: 'App',
	components: {},
	data() {
		return {};
	},
	computed: {},
	watch: {},
	created: function() {},
	mounted: function() {
    let that = this
    let svg = Snap('.draggable');
    // 定义一个斜条纹的画笔
    let p = svg.path("M10-5-10,15M15,0,0,15M0-5-20,15").attr({
        fill: "none",
        strokeOpacity: '.4',
        stroke: "gray",
        strokeWidth: 5
    }).pattern(0, 0, 10, 10)
    svg.rect(0, 0, 50, 50, 10).attr({fill: p})
    let g = svg.g();
    let innerRect = svg.rect(0, 0, 25, 50, 10)
    // 半透明
    innerRect.attr({fill: 'red',fillOpacity: '.4'})
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

    interact('.draggable').draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of #app
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: '#app', // restriction: 'parent',
                endOnly: true
            })
        ],
        // enable autoScroll
        autoScroll: true,
        listeners: {
            // call this function on every dragmove event
            move: dragMoveListener,
            // call this function on every dragend event
            // end(event) {
            //     //拖拽的距离
            //     let distance = (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
            //             Math.pow(event.pageY - event.y0, 2) | 0))
            //         .toFixed(2)
            //     console.log(distance)
            // }
        }
    })
    
    interact('.draggable').resizable({
      // resize from all edges and corners
      edges: { left: true, right: true, bottom: false, top: false },
      listeners: {
        move (event) {
          let target = event.target
          let x = (parseFloat(target.getAttribute('data-x')) || 0)
          let y = (parseFloat(target.getAttribute('data-y')) || 0)

          // update the element's style
          target.style.width = event.rect.width + 'px'
          target.style.height = event.rect.height + 'px'

          // translate when resizing from top or left edges
          x += event.deltaRect.left
          y += event.deltaRect.top

          target.style.transform = 'translate(' + x + 'px,' + y + 'px)'

          target.setAttribute('data-x', x)
          target.setAttribute('data-y', y)
          target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height)

          let svg = Snap('#svg');
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

          g.add(innerRect)
          g.add(text)
        }
      },
      modifiers: [
        // keep the edges inside the parent
        interact.modifiers.restrictEdges({
          outer: '#app'
        }),

        // minimum size
        interact.modifiers.restrictSize({
          min: { width: 100, height: 50 }
        })
      ],
      inertia: true
    })

    interact('.dropzone').dropzone({
      accept: '.draggable',
      overlap: 'pointer',
      ondrop: function (event) {
        let isExsit = that.isChildOf(event.relatedTarget, event.target)
        if (!isExsit)
        {
          event.target.append(event.relatedTarget)
        }
      }
    })
    // 拖动只改变x轴的坐标
    function dragMoveListener(event) {
        let target = event.target
        // keep the dragged position in the data-x/data-y attributes
        let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
        //let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

        // translate the element
        target.style.webkitTransform =
            target.style.transform =
            'translate(' + x + 'px, 0px)'

        // update the posiion attributes
        target.setAttribute('data-x', x)
        //target.setAttribute('data-y', y)
    }
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
    }
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
  overflow: hidden;
}
</style>

