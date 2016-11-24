# select-person
##背景介绍 (introduce)
这是第一个放上github的自写插件，我知道没什么人看的啦嘿嘿，要是发现什么bug，请邮箱联系我们，谢谢:blush:
##最新版本 (The latest version)
###0.1.0(161123)
[历史版本介绍](#readme)
##依赖 (dependence)
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
