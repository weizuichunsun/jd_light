//云定时
function CloudTimeTask() {
  this.app_time = getFormatedTime(); //定时时间
}

CloudTimeTask.prototype = {
    //增加定时任务
    addTimedTask: function (cmd, callback) {
     var timed_task= {};
         timed_task.app_time = app_time;
         timed_task.task_name = cmd.taskName;
         timed_task.task_time_express = json.cron;
         timed_task.task_express = cmd.task_express;
         timed_task.task_type = cmd.task_type;
        JDSMART.util.post("service/addTimedTask", JSON.stringify(timedTask), callback);
    },
    //修改定时任务
    //用户选定一个设备，选择一个定时任务，仅仅修改名字.
    modifyTimedTaskName: function (cmd, callback) {
        //cmd格式：{ "task_id":"666666","task_name":"打开开关-修改"}
        //callback:回调方法
        task = null;
        task.task_id = cmd.task_id;
        task.task_name = cmd.task_name;
        JDSMART.util.post("service/modifyTimedTaskName", JSON.stringify(task), callback);
    },
    //修改定时任务 接口
    //用户选定一个设备，选择一个定时任务，进行修改。
    modifyTimedTask: function (cmd, callback) {
        //cmd格式{task_id:"xxxx",task_name:"xxxx",task_time_express:"xxxx",task_express:"xxxx",task_type:"xxxxx"}
        task = null;
        task.timed_task.app_time = app_time;
        task.timed_task.task_id = cmd.task_id;
        task.timed_task.task_name = cmd.task_name;
        task.timed_task.task_time_express = cmd.task_time_express;
        task.timed_task.task_express = cmd.task_express;
        task.timed_task.task_type = cmd.task_type;
        JDSMART.util.post("service/modifyTimedTask", JSON.stringify(task), callback);
    },
    //删除定时任务
    removeTimedTask: function (cmd, callback) {
        //格式 {"task_ids": ["666666", "777777"]};
        task = null;
        task.task_ids = cmd.task_ids;
        JDSMART.util.post("service/removeTimedTask", JSON.stringify(task), callback);
    },
    //启用 / 停用定时任务 接口
    controlTimedTask: function (cmd, callback) {
        //格式{"task_ids":[ "666666","777777"] ,"control":0/1}
        task = null;
        task.task_ids = cmd.task_ids;
        task.control = cmd.control;
        JDSMART.util.post("service/controlTimedTask", JSON.stringify(task), callback);
    },
    //查询定时任务 接口
    //用户客户端输入多个设备 id，获取对应的 task
    getTimedTaskByFeedIds: function (cmd, callback) {
        //格式{"feed_ids":"[\"12345678",\"2345433\",\"3666666\"]" }
        task = null;
        task.feed_ids = cmd.feed_ids;
        JDSMART.util.post("service/getTimedTaskByFeedIds", JSON.stringify(task), callback);
    },
    //查询定时任务 接口
    //用户客户端输入多 taskid，获取对应的 task 的信息
    getTimedTaskByTaskIds: function (cmd, callback) {
        //格式{"task_ids":"[\"666666",\"888888\"]"}
        task = null;
        task.feed_ids = cmd.task_ids;
        JDSMART.util.post("service/getTimedTaskByTaskIds", JSON.stringify(task), callback);
    },
    //查询 定时执行日志
    getTimedTaskResultByFeedId: function (cmd, callback) {
        //格式{"feed_id":666666,"start_time":"2015-03-18","end_time":"2015-03-19"}
        task = null;
        task.feed_id = cmd.task_ids;
        task.start_time = cmd.start_time;
        task.end_time = cmd.end_time;
        JDSMART.util.post("service/getTimedTaskResultByFeedId", JSON.stringify(task), callback);
    },
    //定时任务执行后，通过执行日志告知用户执行结果
    removeTimedTaskResultByFeedId: function (cmd, callback) {
        task = null;
        task.feed_id = cmd.feed_id;
        JDSMART.util.post("service/removeTimedTaskResultByFeedId", JSON.stringify(task), callback);
    },
    //服务器端时间和允许时间差获取
    getServerTime: function (callback) {
        JDSMART.util.post("service/getServerTime", callback);
    },
    //解析Cron表达式 不支持：间隔几分钟几个小时几天执行
    ace: function (cron) {
        var s = cron.trim().split('_');
        var t = new Object();
        t.minute = s[0] < 10 ? '0' + s[0] : s[0];
        t.hour = s[1] < 10 ? '0' + s[1] : s[1];
        t.day = s[2];
        t.april = s[3];
        t.week = s[4];
        t.year = s[5];
        t.type = null;
        if (t.day == '*' && t.april == '*' && t.week == '*' && t.year == '*') {
            t.type = 4;
            //return t;//4 每天
        } else if (t.april == '*' && t.week == '*' && t.year == '*') {
            t.type = 3;
            //return t;//3;//每月 几号
        } else if (t.day == '*' && t.april == '*' && t.year == '*') {
            t.type = 2;
            var weeks = t.week.split(',');
            var weekH = [];
            for (var week in weeks) {
                switch (weeks[week]) {
                    case "1":
                        weekH.push("周一");
                        break;
                    case "2":
                        weekH.push("周二");
                        break;
                    case "3":
                        weekH.push("周三");
                        break;
                    case "4":
                        weekH.push("周四");
                        break;
                    case "5":
                        weekH.push("周五");
                        break;
                    case "6":
                        weekH.push("周六");
                        break;
                    case "7":
                        weekH.push("周日");
                        break;
                    default:
                }
            }
            t.week = weekH;
        } else {
            t.type = 1;
        }
        return t;
    }


}
//时间格式化
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
//获取当前时间
function getFormatedTime() {
    return new Date().Format("yyyy-MM-dd hh:mm");
}