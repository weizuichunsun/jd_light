/*
	@author:weizuichunsun
	@组件采用原生JS设计实现！
*/
var apiData={
	brightness:"",
	colortemp:"",
	mode:"",
	power:"",
	feedid:""
}
function bar_close(){
	JDSMART.util.closeWindow();  
}
//初始化…
var main={
	init:function(){
		var self=this;
		//初始化…
		JDSMART.ready(function(){  
			// APP头部设置
			self.showButton(true);
			// 网络状态
			 self.getNetworkType();
			// 初始化设备数据
			self.initDeviceData();
			// 获取设备快照接口
			setInterval(function(){
            	self.getSnapshot();
    		},5400);
		});
	},
	showButton:function(flag){
		// console.log(bar_close)
		var param = {
			"what": ["button1", "button4"],
			"display": ["drawable_back", "drawable_setting"],
			"callBackName": ["bar_close", "setting"]
		};
		JDSMART.util.configActionBar(param);
		
		JDSMART.app.config( //配置导航按钮隐藏显示
		{
			showBack: flag,
			// 返回按钮，false是隐藏，true是显示
			showShare: flag,
			showMore: flag,
			titletext:""
		});
	},
	getNetworkType:function(){
		// 获取 APP 的网络状态   
		JDSMART.app.getNetworkType(
			function (suc) {    
				var networkType = suc.TypeName; // 返回网络类型 MOBILE，WIFI
				if(networkType=="MOBILE"||networkType=="mobile"){
					JDSMART.app.toast({message:"当前网络非wifi模式"}, null);
				}
		});  	
	},
	initDeviceData:function(){
		var self=this;
		JDSMART.io.initDeviceData(function (res) {
	        apiData.feedid = res.device.feed_id; //getSnapshot的错
	        // console.log(apiData.feedid)
	         // 执行初始化的回调
	        self.getData(res);
	    });
	},
	getSnapshot:function(){
		var self=this;
		JDSMART.io.getSnapshot(	// 获取设备快照接口
			function (suc) { 
				// 执行成功的回调
				self.getData(suc);
			},
			function (error) { 
				// JDSMART.app.toast({message:error}, null);
				 // 执行失败的回调
			}
		);
	},
	getData:function(res){
		var self=this;
		if (typeof(res) == "string") {
			res = JSON.parse(res);
		}
		if(res){
			var dataArray=res["streams"];
			var dataEach=function(item,index,array){
				// 获取数据
				var api_stream_id=item.stream_id;
				// 组件值判断
				switch (api_stream_id) {
					case 'brightness':
						apiData.brightness=item["current_value"];
						break;
					case 'colortemp':
						apiData.colortemp=item["current_value"];
						break;
					case 'mode':
						apiData.mode=item["current_value"];
						break;
					case 'power':
						apiData.power=item["current_value"];
						break;
				}
			}	
			dataArray.forEach(dataEach);
			self.initData(apiData);
		}
	},
	initData:function(data){
		// 拿到数据后一步步往上爬
		var self=this;
		// 状态栏
		self.myState(data);
		// 开关
		self.mySwitch(data);
		// 模式情景
		self.myScene(data);
		// 亮度设置
		self.myBright(data);
		// 色温设置
		self.myColorTemperature(data);
		// 定时设置
		self.myAlarmClock(data);

	},
	myState:function(data){
		// 状态栏
		var node=document.getElementById('id-state');
		var span=node.getElementsByTagName('span');
		var mode=app.modeTxt(data.mode);
		var brightness_value=parseInt(data.brightness),
			colortemp_value=parseInt(data.colortemp);
		var colorTempStr="";
		if(data.colortemp>60){
            colorTempStr="偏暖";
        }
        else if(data.colortemp>=40&&data.colortemp<=60)
        {
            colorTempStr="偏中性";
        }
        else
        {
            colorTempStr="偏冷";
        }

		span[0].innerHTML=colorTempStr;
		span[1].innerHTML=data.brightness;
		span[2].innerHTML=mode;
		
	},
	mySwitch:function(data){
		var node=document.getElementById('id-switch'),
			switchBtn=node.querySelector(".btn-switch"),
			font=node.querySelector(".font");
			
		var value=parseInt(data.power);
		if(value==1){
			document.getElementById('id-mask').style.display="none";
			switchBtn.className="btn-switch";
			font.innerHTML="已开启";
		}
		else
		{
			document.getElementById('id-mask').style.display="block";
			switchBtn.className="btn-switch select";
			font.innerHTML="已关闭";
		}
	},
	myScene:function(data){
    	var node=document.getElementById('id-scene'),
    		grid=node.querySelectorAll(".grid");  //点击元素

    	var value=parseInt(data.mode);

		var brightness_value=parseInt(data.brightness),
			colortemp_value=parseInt(data.colortemp);
    	var map=[
				{
					iconlink:"ico1_a.png",
					iconhover:"ico1_b.png",
					title:"小夜灯",
					value:"1"
				},
				{
					iconlink:"ico2_a.png",
					iconhover:"ico2_b.png",
					title:"电影",
					value:"2"
				},
				{

					iconlink:"ico3_a.png",
					iconhover:"ico3_b.png",
					title:"阅读",
					value:"3"
				},
				{
					iconlink:"ico4_a.png",
					iconhover:"ico4_b.png",
					title:"会客",
					value:"4"
				}
			];
    	var clearStyle=function(){
			for(var i=0;i<grid.length;i++){
				if(grid[i].className.indexOf("select")!=-1){
					grid[i].className="grid";
					grid[i].getElementsByTagName('img')[0].src="images/"+map[i].iconlink;
				}
			}
		}
	    clearStyle();
		var selectStyle=function(index){
			grid[index].className="grid select";
			grid[index].getElementsByTagName('img')[0].src="images/"+map[index].iconhover;
		}
		  

		var val=value-1;
		switch(val){
			case 0:
				selectStyle(0);
				break;
			case 1:
				selectStyle(1);
				break;
			case 2:
				selectStyle(2);
				break;
			case 3:
				selectStyle(3);
				break;
		}
	},
	myBright:function(data){	
		// 亮度
		// var bright_temp=new hyDA.slideDA("id-bright",{
		// 	uiTitle:"亮度设置",
		// 	value:"50",
		// 	min:1,
		// 	max:100,
		// 	unit:"%",
		// 	change:function(event,value){
		// 		console.log(event,value);
		// 	}
		// })
		var node=document.getElementById('id-bright');
		var value=parseInt(data.brightness);
		var output=node.querySelector(".output");
		var mover=node.querySelector(".mover"),  //覆盖节点
			cover=node.querySelector(".cover"),	 //滑动触点	
			show=node.querySelector(".show");	// 整条形状（灰色）	
		var min=1,
			max=100,
			unit="%";

		var showWidth=parseFloat(window.getComputedStyle(show)["width"]),
			coverWidth=parseFloat(window.getComputedStyle(cover)["width"]),
			moverLeft=parseFloat(window.getComputedStyle(cover)["left"]);

			// console.log(moverLeft);
		
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
	myAlarmClock:function(data){
		var feedid = data.feedid;
		var node=document.getElementById('id-alarm-clock');
		var font=node.querySelector(".font"),
			btn_href=node.getElementsByTagName('a')[0];
	
		var getUrl="timing.html?feedid="+feedid;
		btn_href.href=getUrl;

		//获取定时信息

		var str_stask = "";
		var nowDate = new Date();
		var objMin;
		var feed_ids = { feed_ids: "[" + feedid + "]" };
		// document.getElementById('id-alarm-clock').getElementsByTagName('h3')[0].innerHTML=feedid;

		JDSMART.util.post("service/getTimedTaskByFeedIds", feed_ids,
		function(res) {
			var taskList = res.result;
			if (taskList.length > 0) {
				objMin = {
					"next_left_minutes": "1440"
				};
				for (var i = 0; i < taskList.length; i++) {
					var passd = taskList[i];

					if (parseInt(passd.task_status) > 0) {
						if (passd.next_left_minutes != "") {
							var tim_hiw = nowDate.getMonth() + 1;
							var tim_hiw_str = "" + tim_hiw;
							if (parseInt(tim_hiw) < 10) {
								tim_hiw_str = "0" + tim_hiw;
							}

							var tim_min = nowDate.getDate();
							var tim_min_str = "" + tim_min;
							if (parseInt(tim_min) < 10) {
								tim_min_str = "0" + tim_min;
							}
							var nd = tim_hiw_str + "_" + tim_min_str;

							var getdt = passd.next_excute_time;
							var td = getdt.substring(5, 7) + "_" + getdt.substring(8, 10);
							
							if (nd == td) {
								if (parseInt(objMin.next_left_minutes) > parseInt(passd.next_left_minutes)) {
									objMin = passd;
								}
							}
						}
					}
				}
				if(objMin.task_name) 
				{
					font.innerHTML=objMin.task_name + objMin.next_excute_time.substring(11, 17) + "执行";
				} 
				else 
				{
					font.innerHTML="今天无定时设置";
				}
			} 
			else 
			{
				font.innerHTML="定时为空";
			}
		});
	}
}
main.init();
