# select-person
##背景介绍 (introduce)
这是第一个放上github的自写插件，我知道没什么人看的啦嘿嘿，要是发现什么bug，请邮箱联系我们，谢谢:blush:
##最新版本 (The latest version)
###0.1.0(161123)
[历史版本介绍](#readme)
##依赖 (dependence)  
jQuery 1.7以上版本，推荐jQuery 2.x版本  
JQuery version 1.7 above, recommended the jQuery (2) x version  

Layer，推荐layer 3.x版本    
Layer, recommend layer 3. X version 
##使用方法 (usage)
引用css和js    

```
<link rel="stylesheet" type="text/css" href="css/popup.css">      
<link rel="stylesheet" type="text/css" href="layer/skin/layer.css">  

<script type="text/javascript" src="js/jquery-1.8.3.min.js"></script>  
<script type="text/javascript" src="js/getWords.js"></script>  
<script type="text/javascript" src="js/selectPerson.js"></script>  
<script type="text/javascript" src="layer/layer.js"></script>
```

```
$.fn.select_run({  
    "selectbox":".main",  
    "link":"select.json",  
    "ysefn":function(){  
            layer.msg('选择完毕', {icon: 1});  
    }  
});
```
（注明：如需下载本地运行，请在本机装服务器环境，否则ajax会报错。）  
##参数列表 (options)   
| 参数           | 说明                      | 默认值    | 可填值   |
|---------------|:-------------------------:|:--------:|:-------:|
| container     | 包裹弹窗的容器              | body     | 选择器   |
| selectbox     | 包裹选择器的容器             | 空       | 选择器   |
| type          | 选择类型（1为多选，0为单选）  | 1        | 1或0     |
| link          | 数据源                     | 空        | json    |
| yesfn         | 选择完毕回调函数             | 空       | 函数     |  
##select-person使用交流群  
[群号：528263095，点击加群](http://shang.qq.com/wpa/qunwpa?idkey=0aaf7485d479d80a1d5877f140b28203288c5e2c50cfce2a365b4cbd7bad2c0d)
