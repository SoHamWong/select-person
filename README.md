# select-person
##背景介绍 (introduce)
这是第一个放上github的自写插件，我知道没什么人看的啦嘿嘿，要是发现什么bug，请邮箱联系我们，谢谢:blush:  

[历史背景介绍](https://github.com/soHamWong/select-person/blob/master/Intro.md)
##最新版本 (The latest version)
###1.0.4(170107)
[所有更新日志](https://github.com/soHamWong/select-person/blob/master/Changelog.md)
##依赖 (dependence)  
jQuery 1.7以上版本，推荐jQuery 2.x版本  
JQuery version 1.7 above, recommended the jQuery (2) x version  

Layer，推荐layer 3.x版本    
Layer, recommend layer 3. X version 
##使用方法 (usage)
引用css和js    

```
<link rel="stylesheet" type="text/css" href="layer/skin/layer.css">  
<link rel="stylesheet" type="text/css" href="css/selectPerson.css">       

<script type="text/javascript" src="js/jquery-1.8.3.min.js"></script>  
<script type="text/javascript" src="js/getWords.js"></script>  
<script type="text/javascript" src="js/common.js"></script>  
<script type="text/javascript" src="js/selectPerson.js"></script>  
<script type="text/javascript" src="layer/layer.js"></script>
```
以下为两种调用方式  

```
$.ajax({  
    type:"GET",  
    url:'js/selectMultiple.json',  
    success:function(data){  
        $.fn.selectRun({  
            "hasCreate":true,  
            "hasObj":true,  
            "data":data  
        })  
    }  
})  
            
$.fn.select_run({   
    "hasCreate":false,
    "ysefn":function(){  
            layer.msg('选择完毕', {icon: 1});  
    }  
});
```
（注明：如需下载本地运行，请在本机装服务器环境，否则ajax会报错。）  
##参数列表 (options)    
| 参数           | 说明                      | 默认值    | 可填值   |
|:---------------|:-------------------------:|:--------:|:-------:|
|hasCreate|弹窗是否要创建|false|true or false|  
|popParent|弹窗外层class|空|选择器|  
|hasObj|数据是否按项目排列|空|true or false| 
|data|数据|空|数组|
|type|选择类型（1为多选，0为单选）|多选|1或0|   
|yesCallback|回调|空|函数|   
###注意：
popParent 必须配合 hasCreate 且 hasCreate 为 true，才有作用   
hasCreate 为true 时必须传 hasObj    
hasCreate 为false 时 type和hasObj 需写在 $('.person_box')的attr上     
##select-person使用交流群  
[群号：528263095，点击加群](http://shang.qq.com/wpa/qunwpa?idkey=0aaf7485d479d80a1d5877f140b28203288c5e2c50cfce2a365b4cbd7bad2c0d)
