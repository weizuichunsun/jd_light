# jd_light
京东微联-灯具H5开发

使用html，css，JavaScript知识个人原生构建

在index.html尽可能的只使用父节点。例如：
  亮度
  
 div class="m-bright in-margin" id="id-bright"></div
 
 
 在 app.js中组件化模式传入属性 例如： 亮度
 
		var bright_temp=new hyDA.slideDA("id-bright",{
			uiTitle:"亮度设置",
			value:"50",
			min:1,
			max:100,
			unit:"%",
			change:function(event,value){
				// console.log(event,value);
				var val=parseInt(value).toString();
				var command = {
					"command": [{
						"stream_id": "brightness",
						"current_value": val
					}]
				};
				// 控制设备接口
				JDSMART.io.controlDevice(command,
					function(suc) {
						console.log(suc);
					},
					function(error) {
						JDSMART.app.toast({message:error}, null);
				});
			}
		})

 hyDA.js放置我开发的组件位置，包含该组件的基本属性，相当于创建一个产品标准的属性，如有其他新的属性，可到main.js例外自行添加


(function(){
	var slideDA=function(el,pro){
		var node=document.getElementById(el),
			uiTitle=pro.uiTitle,
			value=parseInt(pro.value),
			min=parseInt(pro.min),
			max=parseInt(pro.max),
			unit=pro.unit,
			change=pro.change;
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

		node.innerHTML=html;
		var output=node.querySelector(".output");
		var mover=node.querySelector(".mover"),  
			cover=node.querySelector(".cover"),
			show=node.querySelector(".show");	

		var showWidth=parseInt(window.getComputedStyle(show)["width"]),
			coverWidth=parseInt(window.getComputedStyle(cover)["width"]);		
		var min_max=function(){
	
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
		var coverWidth=parseFloat(window.getComputedStyle(data.cover)["width"]),  
			shopWidth=parseFloat(window.getComputedStyle(data.show)["width"]),    	
			maxWidth=shopWidth-coverWidth;
		var changeValue;
		var touchStartHandler=function(event){
			var e=event||window.event;
			e.preventDefault();
			var coverLeft=parseInt(window.getComputedStyle(data.cover)["left"]);
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
	
			nowValue=((max-min)*nowValue)+min;
			changeValue=parseInt(nowValue);


			data.output.innerHTML=changeValue+data.unit;
		}
		var touchEndHandler=function(event){
			var e=event||window.event;
			e.preventDefault();	
			moving=!1;

			data.output.innerHTML=changeValue+data.unit;
			return data.change(event,changeValue);
		}
		var clickHandler=function(event){	
			var e=event||window.event;
			e.preventDefault();
			
		var pageX=event.offsetX-parseInt(coverWidth)/2;  
			pageX=Math.min(maxWidth, Math.max(0,pageX));
			data.mover.style.width=pageX+"px";
			data.cover.style.left=pageX+"px";


			var max=parseInt(data.max),
				min=parseInt(data.min);

			var nowValue=(pageX)/(maxWidth);

			nowValue=((max-min)*nowValue)+min;
			changeValue=parseInt(nowValue);


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


然后通过main.js通过云端数据去遍历

myColorTemperature:function(data){
		// 色温
		// var color_temperature_temp=new hyDA.slideDA("id-color-temperature",{
		// 	uiTitle:"色温设置",
		// 	value:"20",
		// 	min:0,
		// 	max:100,
		// 	unit:"%",
		// 	change:function(event,value){
		// 		console.log(event,value);
		// 	}
		// });
		var node=document.getElementById('id-color-temperature');
		var value=parseInt(data.colortemp);
		var output=node.querySelector(".output");
		var mover=node.querySelector(".mover"),  //覆盖节点
			cover=node.querySelector(".cover"),	 //滑动触点	
			show=node.querySelector(".show");	// 整条形状（灰色）	
		var min=0,
			max=100,
			unit="k";

		var showWidth=parseFloat(window.getComputedStyle(show)["width"]),
			coverWidth=parseFloat(window.getComputedStyle(cover)["width"]);	
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
		var moverWidth=parseInt(mover.style.width);	
		var slide_number=Math.abs(parseInt(slideLeft)-moverWidth);

		if(slide_number>5){
			mover.style.width=Math.abs(slideLeft)+"px";
			cover.style.left=Math.abs(slideLeft)+"px";
		}
		else{
			mover.style.width=mover.style.width+"px";
			cover.style.left=mover.style.width+"px";	
		}
		
		output.innerHTML=value+unit;


	},
