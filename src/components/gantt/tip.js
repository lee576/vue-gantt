let balloon = function(element, id, message, left, top, timeout, scroll)
{
	// Init value
	this.timeout = -1;	// ms
	this.message = "";
	this.element = undefined;	
	this.id = "";
	this.left = 0;
	this.top = 6;
	this.scroll = false;
	
	if(!isNaN(timeout) && timeout == timeout)	this.timeout = parseInt(timeout);
	this.message = message;
	this.element = element;
	this.id = id;
	if(!isNaN(left) && left == left) this.left = parseInt(left);
	if(!isNaN(top) && top == top) this.top = parseInt(top);
	if(scroll != null && scroll != undefined) this.scroll = scroll;
};
balloon.prototype = {
	constructor : balloon,
	_timeouter : -1,
	_timerScroll : -1,
	Show : function(bRemove)
	{
		if(!this.element) return false;
		// if(this.element.ball)
		// 	this.element.ball.Remove(true);
		
		var balloon = document.getElementById("balloon_" + this.id)
		if(bRemove != undefined && !bRemove && balloon) return false;
		
		// 移除相同Id气泡
		if(balloon && balloon.element && balloon.element.ball)
			balloon.element.ball.Remove(true);
		else if(balloon)
			balloon.parentNode.removeChild(balloon);
		
		// 生成气泡
		balloon = document.createElement("div");
		balloon.className = "balloon";
		balloon.id = "balloon_" + this.id;
		var balloon_top = document.createElement("div");
		balloon_top.className = "balloon_top";
		var balloon_meg = document.createElement("div");
		balloon_meg.className = "balloon_meg";
		var balloon_txt = document.createElement("div");
		balloon_txt.className = "balloon_txt";
		var megs = document.createTextNode(this.message);
		
		balloon.appendChild(balloon_top);
		balloon.appendChild(balloon_meg);
		balloon_meg.appendChild(balloon_txt);
		balloon_txt.appendChild(megs);
		this.element.ball = this;
		balloon.element = this.element;
		
		document.getElementsByTagName("body")[0].appendChild(balloon);
		//document.getElementById("app").appendChild(balloon);
		
		var node_view = document.getElementView(this.element);
		var node_top = document.getElementTop(this.element);
		var node_left = document.getElementLeft(this.element);
		
		// 设置气泡位置
		balloon.style.top = (node_top + node_view.height + this.top) + "px";
		balloon.style.left = (node_left) + "px";
		
		var mball = this;
		// 设置滚动到焦点
		if(this.scroll){
            this._timerScroll = setInterval(function(){
                var top =  node_top - 30 - document.getScrollXY().top;
                var left = node_left - 30 - document.getScrollXY().left;
                if(Math.abs(top) < 5 || Math.abs(left) < 5)
                {
                    clearInterval(mball._timerScroll);
					mball._timeouter = -1;
					mball.element.focus();
                }
                else
                {
                    top = document.getScrollXY().top + top / 5.0;
                    left = document.getScrollXY().left + left / 5.0;
                    scrollTo(left, top);
                }
            }, 10);
		}
		
		// 设置超时消失
		if(this.timeout > 0)
		{
			this._timeouter = setTimeout(function(){
				mball.Remove();
				if(mball._timerScroll > 0)
				{
					clearInterval(mball._timerScroll);
					mball._timerScroll = -1;
				}
				mball._timeouter = -1;
			}, this.timeout);
		}
		
		return true;
	},

	Remove : function(unanimated)
	{
		var id = this.id;
		var node = document.getElementById("balloon_" + id);
		
		// 清除移除倒计时
		if(this._timeouter > 0)
		{
			clearTimeout(this._timeouter);
			this._timeouter = -1;
		}
		
		// 清除滚动到焦点动作
		if(this._timerScroll > 0)
		{
			clearInterval(this._timerScroll);
			this._timerScroll = -1;
		}
		
		// 无动画清除气泡
		if(node && unanimated) 
		{
			node.parentNode.removeChild(node);
			return true;
		}
		// 动画清除气泡
		else if(node)
		{
			var h = document.getElementView(node.getElementsByTagName("div")[1]).height * 1.00;
			var w = document.getElementView(node.getElementsByTagName("div")[1]).width * 1.00;
			var timer = setInterval(function(){
				h = h - 1;
				w = w - 1;
				if(h > 0)node.getElementsByTagName("div")[1].style.height = h + "px";
				if(w > 0)node.getElementsByTagName("div")[1].style.width = w + "px";
				if(h <= 0 || w <= 0) {
					if(node.parentNode) {node.parentNode.removeChild(node);}
					clearInterval(timer);
				}
			}, 10);
			return true;
		}
		return false;
	},
	
	toString : function(){ return this.id + ", " + this.message; }
};

document.getElementView = function (element)
{
	if(element != document)
		return {
			width: element.getBoundingClientRect().width,
			height: element.getBoundingClientRect().height
		}
	if (document.compatMode == "BackCompat"){
		return {
			width: document.body.clientWidth,
			height: document.body.clientHeight
		}
	} else {
		return {
			width: document.documentElement.clientWidth,
			height: document.documentElement.clientHeight
		}
	}
};

document.getElementLeft = function (element)
{
	// var actualLeft = element.getBoundingClientRect().left;
	// var current = element.parentNode;
	// while (current !== null && current && !isNaN(current.offsetLeft)){
	// 	actualLeft += current.offsetLeft;
	// 	current = current.offsetParent;
	// }
	return element.getBoundingClientRect().left;
};

document.getElementTop = function (element)
{
	// var actualTop = element.getBoundingClientRect().top;
	// var current = element.parentNode;
	// while (current !== null && current && !isNaN(current.offsetTop)){
	// 	actualTop += current.offsetTop;
	// 	current = current.parentNode;
	// }
	// return actualTop;
	return element.getBoundingClientRect().top
};

document.getScrollXY = function() 
{ 
	var scrOfX = 0, scrOfY = 0; 
	if(typeof( window.pageYOffset ) == 'number' ) { 
		//Netscape compliant 
		scrOfY = window.pageYOffset; 
		scrOfX = window.pageXOffset; 
	} else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) { 
		//DOM compliant 
		scrOfY = document.body.scrollTop; 
		scrOfX = document.body.scrollLeft; 
	} else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) { 
		//IE6 standards compliant mode 
		scrOfY = document.documentElement.scrollTop; 
		scrOfX = document.documentElement.scrollLeft; 
	} 
	return {top:scrOfY, left:scrOfX};
};
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
	// el.addEventListener('mouseout',viewLeve,false)
	let ball = new balloon(el, 1, binding.value, 50, 10, 5000, true);
	function viewEnter() {
		ball.Show();
	}
	// function viewLeve() {
	// 	if(ball instanceof balloon) setTimeout(ball.Remove(), 5000) ;
	// }
}