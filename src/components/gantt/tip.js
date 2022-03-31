export default {
    // 被插入
    inserted:function(el, binding){
        mousEnter(el,binding)
    },
    // 更新值
    update:function(el, binding){
        if(binding.value != binding.oldValue) {
            mousEnter(el,binding)
        }
    },
    unbind:function(el) {
        el.removeEventListener('mouseenter',mousEnter)
        el.removeEventListener('mouseout',mousEnter)
    }
}
// 添加鼠标事件
function mousEnter(el,binding) {
	// 划入
	el.addEventListener('mouseenter',viewEnter,false)
	// 离开
	el.addEventListener('mouseout',viewLeve,false)
	// 获取 当前节点 距离屏幕顶部距离
	let bottom = el.getBoundingClientRect().bottom
	let span = document.getElementsByClassName('mose-view')[0]
	if(!span){
		span = document.createElement('span')
		span.style.visibility = 'hidden'
		span.setAttribute('class','mose-view')
		document.body.appendChild(span)
	}
	function viewEnter(e) {
		span.innerHTML = binding.value
		let x = e.offsetX
		//let y = e.offsetY
		
		span.style.top = bottom + 2 + 'px'
		span.style.left = x + 'px'
		span.style.display  = 'block'
		span.style.opacity = '1'
	}
	
	function viewLeve() {
		span.style.display  = 'none'
		span.style.opacity = '0'
	}
}