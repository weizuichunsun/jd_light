//�ƶ�ʱ
function CloudTimeTask() {
  this.app_time = getFormatedTime(); //��ʱʱ��
}

CloudTimeTask.prototype = {
    //���Ӷ�ʱ����
    addTimedTask: function (cmd, callback) {
     var timed_task= {};
         timed_task.app_time = app_time;
         timed_task.task_name = cmd.taskName;
         timed_task.task_time_express = json.cron;
         timed_task.task_express = cmd.task_express;
         timed_task.task_type = cmd.task_type;
        JDSMART.util.post("service/addTimedTask", JSON.stringify(timedTask), callback);
    },
    //�޸Ķ�ʱ����
    //�û�ѡ��һ���豸��ѡ��һ����ʱ���񣬽����޸�����.
    modifyTimedTaskName: function (cmd, callback) {
        //cmd��ʽ��{ "task_id":"666666","task_name":"�򿪿���-�޸�"}
        //callback:�ص�����
        task = null;
        task.task_id = cmd.task_id;
        task.task_name = cmd.task_name;
        JDSMART.util.post("service/modifyTimedTaskName", JSON.stringify(task), callback);
    },
    //�޸Ķ�ʱ���� �ӿ�
    //�û�ѡ��һ���豸��ѡ��һ����ʱ���񣬽����޸ġ�
    modifyTimedTask: function (cmd, callback) {
        //cmd��ʽ{task_id:"xxxx",task_name:"xxxx",task_time_express:"xxxx",task_express:"xxxx",task_type:"xxxxx"}
        task = null;
        task.timed_task.app_time = app_time;
        task.timed_task.task_id = cmd.task_id;
        task.timed_task.task_name = cmd.task_name;
        task.timed_task.task_time_express = cmd.task_time_express;
        task.timed_task.task_express = cmd.task_express;
        task.timed_task.task_type = cmd.task_type;
        JDSMART.util.post("service/modifyTimedTask", JSON.stringify(task), callback);
    },
    //ɾ����ʱ����
    removeTimedTask: function (cmd, callback) {
        //��ʽ {"task_ids": ["666666", "777777"]};
        task = null;
        task.task_ids = cmd.task_ids;
        JDSMART.util.post("service/removeTimedTask", JSON.stringify(task), callback);
    },
    //���� / ͣ�ö�ʱ���� �ӿ�
    controlTimedTask: function (cmd, callback) {
        //��ʽ{"task_ids":[ "666666","777777"] ,"control":0/1}
        task = null;
        task.task_ids = cmd.task_ids;
        task.control = cmd.control;
        JDSMART.util.post("service/controlTimedTask", JSON.stringify(task), callback);
    },
    //��ѯ��ʱ���� �ӿ�
    //�û��ͻ����������豸 id����ȡ��Ӧ�� task
    getTimedTaskByFeedIds: function (cmd, callback) {
        //��ʽ{"feed_ids":"[\"12345678",\"2345433\",\"3666666\"]" }
        task = null;
        task.feed_ids = cmd.feed_ids;
        JDSMART.util.post("service/getTimedTaskByFeedIds", JSON.stringify(task), callback);
    },
    //��ѯ��ʱ���� �ӿ�
    //�û��ͻ�������� taskid����ȡ��Ӧ�� task ����Ϣ
    getTimedTaskByTaskIds: function (cmd, callback) {
        //��ʽ{"task_ids":"[\"666666",\"888888\"]"}
        task = null;
        task.feed_ids = cmd.task_ids;
        JDSMART.util.post("service/getTimedTaskByTaskIds", JSON.stringify(task), callback);
    },
    //��ѯ ��ʱִ����־
    getTimedTaskResultByFeedId: function (cmd, callback) {
        //��ʽ{"feed_id":666666,"start_time":"2015-03-18","end_time":"2015-03-19"}
        task = null;
        task.feed_id = cmd.task_ids;
        task.start_time = cmd.start_time;
        task.end_time = cmd.end_time;
        JDSMART.util.post("service/getTimedTaskResultByFeedId", JSON.stringify(task), callback);
    },
    //��ʱ����ִ�к�ͨ��ִ����־��֪�û�ִ�н��
    removeTimedTaskResultByFeedId: function (cmd, callback) {
        task = null;
        task.feed_id = cmd.feed_id;
        JDSMART.util.post("service/removeTimedTaskResultByFeedId", JSON.stringify(task), callback);
    },
    //��������ʱ�������ʱ����ȡ
    getServerTime: function (callback) {
        JDSMART.util.post("service/getServerTime", callback);
    },
    //����Cron���ʽ ��֧�֣���������Ӽ���Сʱ����ִ��
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
            //return t;//4 ÿ��
        } else if (t.april == '*' && t.week == '*' && t.year == '*') {
            t.type = 3;
            //return t;//3;//ÿ�� ����
        } else if (t.day == '*' && t.april == '*' && t.year == '*') {
            t.type = 2;
            var weeks = t.week.split(',');
            var weekH = [];
            for (var week in weeks) {
                switch (weeks[week]) {
                    case "1":
                        weekH.push("��һ");
                        break;
                    case "2":
                        weekH.push("�ܶ�");
                        break;
                    case "3":
                        weekH.push("����");
                        break;
                    case "4":
                        weekH.push("����");
                        break;
                    case "5":
                        weekH.push("����");
                        break;
                    case "6":
                        weekH.push("����");
                        break;
                    case "7":
                        weekH.push("����");
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
//ʱ���ʽ��
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //�·�
        "d+": this.getDate(), //��
        "h+": this.getHours(), //Сʱ
        "m+": this.getMinutes(), //��
        "s+": this.getSeconds(), //��
        "q+": Math.floor((this.getMonth() + 3) / 3), //����
        "S": this.getMilliseconds() //����
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
//��ȡ��ǰʱ��
function getFormatedTime() {
    return new Date().Format("yyyy-MM-dd hh:mm");
}