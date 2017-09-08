/*
	@author_wx:rongyuezhicheng
	@组件采用原生JS设计实现！
*/
window.hyDA={};
// 状态
(function(){
	var stateDA=function(el,pro){
		var node=document.getElementById(el),
			map=pro.map;
		var gridHTML="";
		for(var i=0;i<map.length;i++){
			gridHTML+='<div class="grid">\
                    <p>'+map[i].title+'</p>\
                    <span>'+map[i].value+'</span>\
                    <i></i>\
                </div>';
		}	

		var html='<div class="in-state">\
		            <div class="m-grid">'+gridHTML+'</div>\
		        </div>';
		node.innerHTML=html;
	}
	window.hyDA.stateDA=stateDA;
})();
// 开关
(function(){
	var switchDA=function(el,pro){
		var node=document.getElementById(el),
			onTitle=pro.onTitle,
			offTitle=pro.offTitle,
			value=parseInt(pro.value),
			change=pro.change;
		var fontText=(value==1)?onTitle:offTitle,
			className=(value==1)?"btn-switch":"btn-switch select";
		var html='<div class="m-flex-w">\
			        <div class="l-flex">\
			            <span class="font">'+fontText+'</span>\
			        </div>\
			        <div class="l-w">\
			            <div class="'+className+'"></div>\
			        </div>\
			    </div>';

		node.innerHTML=html;
		if(value==0)
		{	
			document.getElementById('id-mask').style.display="block";
		}
		else
		{
			document.getElementById('id-mask').style.display="none";
		}
		var data={
			node:node,
			onTitle:onTitle,
			offTitle:offTitle,
			value:value,
			change:change
		}
		this.init(data);
	}
	switchDA.prototype.init=function(data){
		var switchBtn=data.node.querySelector(".btn-switch");
		var font=data.node.querySelector(".font");
		var clickHander=function(event){
			var e=event||window.event;
			var maskBlock=document.getElementById('id-mask').style.display;
			if(maskBlock=="block"){
				document.getElementById('id-mask').style.display="none";
				switchBtn.className="btn-switch";
				font.innerHTML=data.onTitle;
				return data.change(e,1);
			}
			else
			{
				document.getElementById('id-mask').style.display="block";
				switchBtn.className="btn-switch select";
				font.innerHTML=data.offTitle;
				return data.change(e,0);
			}
		}
		data.node.addEventListener("click",clickHander);

	}
	window.hyDA.switchDA=switchDA;
})();
// 情景
(function(){
	var sceneDA=function(el,pro){
		var node=document.getElementById(el),
			uiTitle=pro.uiTitle,
			value=pro.value,
			map=pro.map,
			change=pro.change;
	
 		var gridHTML="";
 		var imgLink=[],
 			imgHover=[];
		for(var i=0;i<map.length;i++){
			imgLink.push(map[i].iconlink);
			imgHover.push(map[i].iconhover);

			if(map[i].value==value){
				gridHTML+='<div class="grid select">\
		                    <img src="images/'+map[i].iconhover+'">\
		                    <p>'+map[i].title+'</p>\
		                </div>';
			}
			else
			{
				gridHTML+='<div class="grid">\
		                    <img src="images/'+map[i].iconlink+'">\
		                    <p>'+map[i].title+'</p>\
		                </div>';
			}
		}

		var html='<div class="m-box">\
		            <h3>'+uiTitle+'</h3>\
		            <div class="m-grid-mode">'+gridHTML+'</div>\
		        </div>'
		node.innerHTML=html;
		// 事件
		var data={
			node:node,
			uiTitle:uiTitle,
			value:value,
			map:map,
			imgLink:imgLink,
			imgHover:imgHover,
			change:change
		}
		this.init(data);
	}
	sceneDA.prototype.init=function(data){
		var grid=data.node.querySelectorAll(".grid");  //点击元素
		var clearStyle=function(){
			for(var i=0;i<grid.length;i++){
				if(grid[i].className.indexOf("select")!=-1){
					grid[i].className="grid";
					grid[i].getElementsByTagName('img')[0].src="images/"+data.imgLink[i];
				}
			}
		}
		var clickHander=function(event){
			var e=event||window.event;
			if(this.className.indexOf("select")!=-1){
				return;
			}else{
				clearStyle();
				this.className+=" select";
				this.getElementsByTagName('img')[0].src="images/"+data.imgHover[this.index];
				var changeValue=parseInt(data.map[this.index].value);
				return data.change(event,changeValue);
			}
		}
		for(var i=0;i<grid.length;i++){
			grid[i].index=i;
			grid[i].addEventListener("click",clickHander);
		}
	}
	window.hyDA.sceneDA=sceneDA;
})();
// 亮度/色温/滑动组件
(function(){
	var slideDA=function(el,pro){
		var node=document.getElementById(el),
			uiTitle=pro.uiTitle,
			value=parseInt(pro.value),
			min=parseInt(pro.min),
			max=parseInt(pro.max),
			unit=pro.unit,
			change=pro.change;
		if(el=="id-color-temperature"){
			var html='<div class="m-box">\
		            <h3>'+uiTitle+'<span class="output" style="display:none;">'+value+unit+'</span></h3>\
		            <div class="m-slide-pd">\
		                <div class="m-slide" onselectstart="return false;">\
		                    <div class="slide-box">\
		                        <div class="mover"></div>\
		                        <div class="cover"></div>\
		                        <div class="show"></div>\
		                    </div>\
		                    <div class="slide-value">\
		                        <span class="min">'+"冷"+'</span>\
		                        <span class="max">'+"暖"+'</span>\
		                    </div>\
		                </div>\
		            </div>\
		        </div>';	
		}
		else{
			var html='<div class="m-box">\
		            <h3>'+uiTitle+'<span class="output" style="display:none;">'+value+unit+'</span></h3>\
		            <div class="m-slide-pd">\
		                <div class="m-slide" onselectstart="return false;">\
		                    <div class="slide-box">\
		                        <div class="mover"></div>\
		                        <div class="cover"></div>\
		                        <div class="show"></div>\
		                    </div>\
		                    <div class="slide-value">\
		                        <span class="min">'+min+'</span>\
		                        <span class="max">'+max+'</span>\
		                    </div>\
		                </div>\
		            </div>\
		        </div>';
		}
		node.innerHTML=html;
		var output=node.querySelector(".output");
		var mover=node.querySelector(".mover"),  //覆盖节点
			cover=node.querySelector(".cover"),	 //滑动触点	
			show=node.querySelector(".show");	// 整条形状（灰色）		

		var showWidth=parseInt(window.getComputedStyle(show)["width"]),
			coverWidth=parseInt(window.getComputedStyle(cover)["width"]);		
		var min_max=function(){
			// 顺序不可乱
			var t;
			if(min>max){
				t=max;
				max=min;
				min=t;	
			}
			if(value>=max){
				value=max;
			}
			if(value<=min){
				value=min;
			}
			// 顺序不可乱结束
		}
		min_max();

		var slideLeft=(value-min)*(showWidth-coverWidth)/(max-min);
		mover.style.width=Math.abs(slideLeft)+"px";
		cover.style.left=Math.abs(slideLeft)+"px";

		var data={
			node:node,
			uiTitle:uiTitle,
			value:value,
			min:min,
			max:max,
			unit:unit,
			change:change,
			mover:mover,
			cover:cover,
			show:show,
			output:output
		}
		this.init(data);
		
	}
	slideDA.prototype.init=function(data){
		var clientX,moving;
		var coverWidth=parseFloat(window.getComputedStyle(data.cover)["width"]),   //滑动触点	
			shopWidth=parseFloat(window.getComputedStyle(data.show)["width"]),    // 整条形状（灰色）	
			maxWidth=shopWidth-coverWidth; //最大值
		var changeValue;
		var touchStartHandler=function(event){
			var e=event||window.event;
			e.preventDefault();
			var coverLeft=parseInt(window.getComputedStyle(data.cover)["left"]); //滑动触点,左偏移量; 
			clientX=e.touches[0].pageX-coverLeft;   
			moving=!0;
		}
		var touchMoveHandler=function(event){
			if(!moving) return;
			var e=event||window.event;
			e.preventDefault();
			var	moveX=e.touches[0].pageX-clientX;
			moveX=Math.min(maxWidth, Math.max(0,moveX));
			data.mover.style.width=moveX+"px";
			data.cover.style.left=moveX+"px";

			var max=parseInt(data.max),
				min=parseInt(data.min);

			var nowValue=(moveX)/(maxWidth);
			// 取最小值到最大值下发
			nowValue=((max-min)*nowValue)+min;
			changeValue=parseInt(nowValue);


			data.output.innerHTML=changeValue+data.unit;
		}
		var touchEndHandler=function(event){
			var e=event||window.event;
			e.preventDefault();	
			moving=!1;
			// 返回修改的值
			data.output.innerHTML=changeValue+data.unit;
			return data.change(event,changeValue);
		}
		var clickHandler=function(event){	
			var e=event||window.event;
			e.preventDefault();
			// 根据当前元素去取值
		var pageX=event.offsetX-parseInt(coverWidth)/2;  // 除以2拿中心点，
			pageX=Math.min(maxWidth, Math.max(0,pageX));
			data.mover.style.width=pageX+"px";
			data.cover.style.left=pageX+"px";
			// var maxVal=parseInt(data.max);
			// var nowValue=(pageX)/(maxWidth);
			// 	nowValue=(nowValue*maxVal).toFixed(0);
			// changeValue= parseInt(nowValue);

			var max=parseInt(data.max),
				min=parseInt(data.min);

			var nowValue=(pageX)/(maxWidth);
			// 取最小值到最大值下发
			nowValue=((max-min)*nowValue)+min;
			changeValue=parseInt(nowValue);

			// 返回修改的值
			data.output.innerHTML=changeValue+data.unit;
			return data.change(event,changeValue);
		}
		data.cover.addEventListener("touchstart",touchStartHandler);
		data.cover.addEventListener("touchmove",touchMoveHandler);
		data.cover.addEventListener("touchend",touchEndHandler);
		data.show.addEventListener("click",clickHandler);
		data.mover.addEventListener("click",clickHandler);
	}
	window.hyDA.slideDA=slideDA;
})();

// 设置定时
(function(){
	var alarmClockDA=function(el,pro){
		var node=document.getElementById(el),
			uiTitle=pro.uiTitle,
			fontText=pro.fontText,
			btnText=pro.btnText,
			href=pro.href;

		var html='<div class="m-box">\
		            <h3>'+uiTitle+'</h3>\
		            <div class="m-flex-pd">\
		                <div class="m-flex-w">\
		                    <div class="l-flex">\
		                        <span class="font">'+fontText+'</span>\
		                    </div>\
		                    <div class="l-w">\
		                        <div class="m-btn-txt"><a href="'+href+'">'+btnText+'</a></div>\
		                    </div>\
		                </div>\
		            </div>\
		        </div>';
		node.innerHTML=html;
	}
	window.hyDA.alarmClockDA=alarmClockDA;
})();
