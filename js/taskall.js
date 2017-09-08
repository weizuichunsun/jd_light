;(function() {
    
  if (window.JDSMART) { return }
  
  var JSBridge;
  var readyCallback;
  function init(config) {
      JSBridge = config.bridge;
      JSBridge.init(function(msg,callback){
          
      
      });
      readyCallback();
  }
    
    function ready(fn) {
    	readyCallback = fn;
    }
  
	var fn = {
        getSnapshot:function(successCallback,failedCallback){
            JSBridge.send({type:'getSnapshot'},function(result){
                
                if (result.status != 0) {
                    if (failedCallback)
                    failedCallback(result.error);
                } else {
                    successCallback(result.result);
                }
            });
        },
		initDeviceData:function(successCallback){
			JSBridge.send({type:'initDeviceData'},function(result){
					successCallback(result);					
					});
		},
        controlDevice:function(params, successCallback,failedCallback){
            JSBridge.send({type:'controlDevice', data:params["command"]},function(result){
                if (result.status != 0) {
                    if (failedCallback)
                    failedCallback(result.error);
                } else {
                    successCallback(result.result);
                }
            });
        },
        getHistory:function(successCallback){
			JSBridge.send({type:'history'},function(result){
					successCallback(result);					
					});
		}
        
	};  
  
    var app = {
        getNetworkType:function(successCallback){
            JSBridge.send({type:'getNetworkType'},function(result){
                    successCallback(result);
            });
        },
		openUrl:function(url){
			JSBridge.send({type:'openUrl', url:url});
        },
  		config:function(data){
            JSBridge.send({type:'config',data:data});
  		},
  		alert:function(data,successCallback){
  			JSBridge.callHandler('showAlertView', data, function(response) {
            	successCallback(response);
            });
  		},
        toast:function(data,successCallback){
            JSBridge.callHandler('messageToast', data, function(response) {
                                   successCallback(response);
            });
           },
        loading:function(show){
			JSBridge.send({type:'loading', show:show});
        },
    };
    
    var util = {
        get:function(url,callBack){
            JSBridge.send({type:'get',url:url},function(result){
                    callBack(result);
            });
        },
        
        post:function(url,params,callBack){
            JSBridge.send({type:'post',url:url, data:params},function(result){
                    callBack(result);
            });
        },
        configActionBar:function(params){
        JSBridge.send({type:'configActionBar',data:params},function(result){
                   
            });
        },
       closeWindow:function(){
          JSBridge.send({type:'closeWindow'},function(result){
                    
            });
        },
        getToken:function(appkey,callBack){
            JSBridge.send({type:'token',data:appkey},function(result){
                    callBack(result);
            });
        }
    };
	
  window.JDSMART = {
      init: init,
      ready:ready,
      io:fn,
      app:app,
      util:util
  }
  
  document.addEventListener('JDSmartBridgeReady', function onReady(ev) {
        JDSMART.init({'bridge':ev.bridge});
  });
})();