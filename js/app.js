/*
	@author_wx:rongyuezhicheng
	@组件采用原生JS设计实现！
*/
var app={
	init:function(){
		var self=this;
		self.html();
	},
	html:function(){
		var self=this;
		// 初始状态
		var state_temp=new hyDA.stateDA("id-state",{
			map:[
				{
					title:"当前色温",
					value:"60"
				},
				{
					title:"当前亮度",
					value:"30"
				},
				{
					title:"当前模式",
					value: self.modeTxt(1)
				}
			]
		});
		// 开关
		var switch_temp=new hyDA.switchDA("id-switch",{
			onTitle:"已开启",
			offTitle:"已关闭",
			value:"1",
			change:function(event,value){
				// console.log(event,value);
				var val=parseInt(value).toString();
				// 下发指令
				var command = {
					"command": [{
						"stream_id": "power",
						"current_value": val
					}]
				};
				// 控制设备接口
				JDSMART.io.controlDevice(command,
					function(suc) {
						console.log(suc);
						// if(typeof(main)!="undefined"){
						// 	main.getSnapshot();
						// }
					},
					function(error) {
						JDSMART.app.toast({message:error.errorInfo}, null);
						// console.log(error);
				});
			}
		});
		// 情景
		var scene_temp=new hyDA.sceneDA("id-scene",{
			uiTitle:"模式设置",
			value:"1",
			map:[
				{

					iconlink:"ico0_a.png",
					iconhover:"ico0_b.png",
					title:"手动",
					value:"0"
				},
				{

					iconlink:"ico1_a.png",
					iconhover:"ico1_b.png",
					title:"阅读",
					value:"1"
				},
				{
					iconlink:"ico2_a.png",
					iconhover:"ico2_b.png",
					title:"观影",
					value:"2"
				},
				{
					iconlink:"ico3_a.png",
					iconhover:"ico3_b.png",
					title:"聚会",
					value:"3"
				},
				{
					iconlink:"ico4_a.png",
					iconhover:"ico4_b.png",
					title:"睡眠",
					value:"4"
				}			
			],
			change:function(event,value){
				// console.log(event,value);
				var val=parseInt(value).toString();
				var command = {
					"command": [{
						"stream_id": "mode",
						"current_value": val
					}]
				};
				// 控制设备接口
				JDSMART.io.controlDevice(command,
					function(suc) {
						console.log(suc);
						// main.getSnapshot();
					},
					function(error) {
						JDSMART.app.toast({message:error.errorInfo}, null);
				});
			}
		});
		// 亮度
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
						// main.getSnapshot();
					},
					function(error) {
						JDSMART.app.toast({message:error.errorInfo}, null);
				});
			}
		})
		// 色温
		var color_temperature_temp=new hyDA.slideDA("id-color-temperature",{
			uiTitle:"色温设置",
			value:"20",
			min:0,
			max:100,
			unit:"k",
			change:function(event,value){
				// console.log(event,value);
				var val=parseInt(value).toString();
				var command = {
					"command": [{
						"stream_id": "colortemp",
						"current_value": val
					}]
				};
				// 控制设备接口
				JDSMART.io.controlDevice(command,
					function(suc) {
						console.log(suc);
						// main.getSnapshot();
					},
					function(error) {
						JDSMART.app.toast({message:error.errorInfo}, null);
				});	
			}
		});
		// 定时设置
		var alarm_clock_temp=new hyDA.alarmClockDA("id-alarm-clock",{
			uiTitle:"定时设置",
			fontText:"今日无定时",
			btnText:"设置定时",
			href:"#"
		})
	},
	modeTxt:function(value){
		var val=parseInt(value);
		var txt;
		switch(val){
			case 0:
				txt="手动";
				break;
			case 1:
				txt="阅读";
				break;
			case 2:
				txt="观影";
				break;
			case 3:
				txt="聚会";
				break;
			case 4:
				txt="睡眠";
				break;
		}
		return txt;
	}
}
app.init();
