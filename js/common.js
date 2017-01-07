// ajax请求
function myAjax(data,url,options){
    var json=null;
    var defaults={
        type:'GET',
        async: true,
        callback:null
    }
    // 查看是否存在
    if(isset(options)){
        // $.extend 合并多个对象
        var opts=$.extend(defaults,options);
    }else{
        var opts=defaults;
    }
    $.ajax({
        type:opts.type,
        async:opts.async,
        url:url,
        data:data,
        success:function(data){
            if(opts.async){
                opts.callback(data);
            }
        }
    });
    if(!opts.async){
        return json;
    }
}

// 查看是否存在
function isset(obj){
    if(typeof(obj)=='undefined'){
        return false;
    }else{
        return true;
    }
}

// 判断类型
function isType(obj,type){
    type = type.replace(/\b(\w)|\s(\w)/g, function(m) {
        return m.toLowerCase();
    });
    return typeof(obj) == type;
}

// 字符串分割成数组
function explode(search,str){
    return str.split(search);  
}

// 数组转字符串
function implode(search,arr){
    return arr.join(search);
}

// 删除数组某个值
function arrRemoveVal(arr,val){
    for(var i=0; i<arr.length; i++) {
        if(arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    } 
}

String.prototype.replaceAll = function(oldstring,newstring){    
    return this.replace(new RegExp(oldstring,"gm"),newstring);    
}