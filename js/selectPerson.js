;(function(){
    // 调用传参
    var type,           //单选 or 多选
        data,           //数据
        hasObj,         //是否有项目/部门
        popParent,      //弹窗外层class
        yesCallback,    //回调
        hasCreate = false;//弹框是否要创建

    // 其他全局
    var index,          //选择框下标
        personBox,      //选择框
        popBox,         //弹窗
        popIndex,       //弹窗下标

        itemObj,        //所有成员
        initData,       //所有数据

        itemBox,        //成员外框
        newItemBox,     //新添加成员框

        placeholder;    //水印

    $.fn.selectRun = function(json){
        // 如果需要创建
        hasCreate = json.hasCreate;
        if(hasCreate){
            // 取数据
            if(json.data){
                data = json.data;
            }
            // 取弹窗外层
            if(json.popParent){
                popParent = json.popParent;
            }else{
                popParent = 'body';
            }
            if(json.hasObj){
                hasObj = json.hasObj;
            }
        }
        if(json.yesCallback){
            yesCallback = json.yesCallback;
        }
        begin();
    }

    function createPop(){
        var selectBox = $('<div class="add_item_box display-none">'
                        + '<div class="add_item_sbox">'
                            + '<div class="fl add_item_search">'
                                +'<div>'
                                    +'<input type="text" placeholder="输入姓名搜索" class="txtChinese add_item_search_input" />'
                                +'</div>'
                                +'<div class="add_item_search_box">'
                                +'</div>'
                            + '</div>'
                            + '<div class="fr add_item_show">'
                                + '<div class="add_item_s_title">新添加成员（<span class="add_item_count">0</span>）</div>'
                                + '<ul class="add_item_show_ul">'
                                    +'<div class="add_placeholder"></div>'
                                + '</ul>'
                                + '<input type="hidden" name="item_id" value="" />'
                            + '</div>'
                        + '</div>'
                      +'</div>');

        if(data){
            // 有项目
            if(hasObj == 'true' || hasObj == true){
                for(var i=0;i<data.length;i++){
                    var obj = data[i];
                    var objName = obj.name; //项目名
                    var objUser = obj.user; //项目下的成员

                    // 单选
                    if(type == '0'){
                        var objNew='<div class="obj_box">'
                                    +    '<div class="obj_name">'+objName+'</div>'
                                    +'</div>';
                    // 多选
                    }else if(type == '1'){
                        var objNew ='<div class="obj_box">'
                                    +    '<div class="obj_name">'
                                    +        '<label><input type="checkbox" class="obj_check"/>'+objName+'</label>'
                                    +    '</div>'
                                    +'</div>';
                    }
                    // 生成项目
                    selectBox.find('.add_item_search_box').append(objNew);

                    // 添加项目下的成员
                    for(var k=0;k<objUser.length;k++){
                        var user = '<div class="add_item_name show_user" data-obj="'+objName+'" value="'+objUser[k].user_id+'">'+objUser[k].name+'</div>'
                        selectBox.find('.add_item_search_box').children().last().append(user);
                    }
                }

            // 单人
            }else{
                // 生成单个成员
                for(var i=0;i<data.length;i++){
                    var obj = data[i];
                    var userId = obj.user_id;
                    var userName = obj.name;

                    var user = '<div class="add_item_name show_user" value="'+userId+'">'+userName+'</div>'
                    selectBox.find('.add_item_search_box').append(user);
                }
            }
            $(popParent).append(selectBox);
            popBox = $('.add_item_box');
        }

        // 获取所有对象
        itemObj = $('.show_user');

        // 添加首字母
        addLetter();

        // 隐藏已存在成员
        hideAlready();
        // 获取所有数据
        initData = selectBox.find('.add_item_search_box').html();

        newItemBox = $('.add_item_show_ul');
        placeholder = $('.add_placeholder');
        itemBox = $('.add_item_search_box');

        layer.open({
            type: 1,
            closeBtn: 1, //不显示关闭按钮
            skin:'select-layer',
            title:'选择人员',
            area: ['700px', '471px'], //宽高
            btn: ['确定', '取消'],
            shadeClose: true, //开启遮罩关闭
            content: popBox,
            success:function(index){
                initPop();
                initLetter();
                $('.select-layer .layui-layer-close').html('&times;');
            },
            end:function(index){
                popBox.remove();
            },
            yes:function(index){
                yesFunction(index);
            }
        });
    }

    // 初始化
    function initPop(){
        placeholder.show();
        popBox.find('input').val('');
        newItemBox.find('li').remove();
        popBox.find('.add_item_count').text('0');
    }

    function switchType(){
        switch(type){
            //单选   
            case '0':
                placeholder.text("只能添加一人");
                break;
            //多选
            case '1':
                placeholder.text("可添加多人");
                break;
        }
    }
        
    // 开始执行
    function begin(){
        $(document).on('click','.add_person_btn',function(){
            personBox = $(this).parents('.person_box');
            type = personBox.attr('type');
            index = personBox.index('.person_box');
            if(hasCreate){
                createPop();
                switchType();
            }else{  
                // 弹窗下标
                popIndex = personBox.attr('popIndex');
                popBox = $('.add_item_box').eq(popIndex);

                // 成员外框
                itemBox = popBox.find('.add_item_search_box');
                // 所有成员
                itemObj = itemBox.find('.show_user');
                // 所有数据
                initData = itemBox.html();
                // 新添加成员框
                newItemBox = popBox.find('.add_item_show_ul');
                placeholder = popBox.find('.add_placeholder');
                // 是否有项目
                hasObj = personBox.attr('hasObj');

                switchType();
                layer.open({
                    type: 1,
                    skin: 'select-layer', //加上边框
                    title:'添加成员',
                    area: ['700px', '471px'], //宽高
                    btn:['确定','取消'],
                    content: popBox,
                    success:function(){
                        initPop();
                        if(itemBox.find('.add_item_s_title').length == 0){
                            addLetter();
                        }
                        initData = itemBox.html();
                        hideAlready();
                        initLetter();
                        $('.select-layer .layui-layer-close').html('&times;');
                    },
                    btn1:function(index){
                        yesFunction(index);
                    }
                });
            }
        });

        addItem();      // 添加新成员
        delItem();      // 删除新成员
        delHave();      // 删除已有成员
        selectAll();    //全选
        clearHave();    //清空已有
        selectName();   //模糊搜索
    }

    // 添加新成员
    function addItem() {
        $(document).on('click','.show_user',function(){
            var self = $(this);
            placeholder.hide();
            var addName = self.text(),
                addValue = self.attr('value'),
                addLetter = self.attr('data-letter');

            // 单选
            if(type == '0'){
                newItemBox.find('li').remove();
                itemBox.find('.add_item_s_title').show();
                itemBox.find('.show_user').show();
            }
            switchAdd(self,addLetter,addName,addValue);
        })
    }

    function switchAdd(self,addLetter,addName,addValue){
         var addLi = '<li class="add_item_name" data-letter="'+addLetter+'">'
                    +    '<span class="fl add_name">'+addName+'</span>'
                    +    '<span class="fr cur-poin add_del_btn">&times;</span>'
                    +    '<input type="hidden" name="" value="'+addValue+'" />'
                    +'</li>';
        switch(type){
            case '0':
                newItemBox.find('li').remove();
                newItemBox.append(addLi);
                break;
            case '1':
                if(newItemBox.find('.add_name').text().indexOf(addName) < 0){
                    newItemBox.append(addLi);
                }
                break;
        }
        calAddCount();
        popBox.find('.show_user[value="'+addValue+'"]').hide();
        initLetter();
    }

    // 删除新成员
    function delItem(){
        $(document).on('click','.add_del_btn',function(){
            var self = $(this);
            var self_p = self.parents('li');
            var delVal = self_p.find('[type="hidden"]').val(),
                delLetter = self_p.attr("data-letter");

            self_p.remove();
            calAddCount();
            itemBox.find('.show_user[value="'+delVal+'"]').show();
            initLetter();

            if(newItemBox.find('li').length == 0){
                placeholder.show();
            }
        })
    }

    // 计算新添加的成员
    function calAddCount(){
        var count = newItemBox.find('li').length;
        popBox.find('.add_item_count').text(count);
    }

    // 重置首字母
    function initLetter(){
        if(hasObj == 'true' || hasObj == true){
            popBox.find('.obj_box').each(function(){
                $(this).find('.add_item_s_title').each(function(){
                    var self = $(this);
                    var letterVal = self.attr("data-letter");
                    if(self.siblings('.show_user[data-letter="'+letterVal+'"]:visible').length == 0){
                        self.hide();
                    }else{
                        self.show();
                    }
                })

                // 隐藏第一个首字母上边框
                hideUserBorder($(this),0);
                
                if($(this).find('.show_user:visible').length == 0){
                    $(this).find('.obj_name').hide();
                }else{
                    $(this).find('.obj_name').show();
                }
            })
            // 隐藏第一个项目上边框
            hideUserBorder(popBox,1);
        }else{
            itemBox.find('.add_item_s_title').each(function(){
                var self = $(this);
                var letterVal = self.attr("data-letter");
                if(itemBox.find('.show_user[data-letter="'+letterVal+'"]:visible').length == 0){
                    self.hide();
                }else{
                    self.show();
                }
            })
            // 隐藏第一个首字母上边框
            hideUserBorder(itemBox,0);
        }
    }

    // 添加首字母
    function addLetter(){
        if(hasObj == 'true' || hasObj == true){
            popBox.find('.obj_box').each(function(){
                var item = $(this).find('.show_user');
                addItemLetter(item);
            })
        }else{
            var oldLetter = '';
            addItemLetter(itemObj);
        }
    }

    function addItemLetter(item){
        var oldLetter = '';
        for(var i=0;i<item.length;i++ ){
            var itemCur = $(item[i]);
            if(typeof((itemCur.html())[0]) == 'string'){
                // 获取第一个字母
                var newLetter = makePy((itemCur.html())[0]);
                // 多音字取第一个
                newLetter = newLetter[newLetter.length-1];
                itemCur.attr("data-letter",newLetter);

                if(oldLetter != newLetter){
                    oldLetter = newLetter;
                    var letter ='<div class="add_item_s_title" data-letter="'+oldLetter+'">'+oldLetter+'</div>';
                    itemCur.before(letter);
                }
            }
        }
    }

    // 隐藏已存在的item
    function hideAlready(){
        var alreadyText = personBox.find('li').text();
        itemObj.each(function(){
            if(alreadyText.indexOf($(this).text()) > -1){
                $(this).hide();
            }
        }); 
    }

    // 隐藏新添加的item
    function hideNew(){
        var newText = newItemBox.find('li .add_name').text().trim();
        itemBox.find('.show_user').each(function(){
            if(newText.indexOf($(this).text()) > -1){
                $(this).hide();
            }
        })
    }

    // 确定添加回调
    function yesFunction(){
        var allValue;
        switch(type){
            // 单选
            case "0":
                var newName = newItemBox.find('li .add_name').text(),
                    newValue = newItemBox.find('li [type="hidden"]').val();

                var newLi =  '<li class="ali" data-value="'+newValue+'">'+newName+'<a class="aa"></a></li>';   
                personBox.find('li').remove();
                personBox.find('.person_save').append(newLi);
                allValue = newValue;
                break;
            // 多选
            case "1":
                haveValue = personBox.find('input[type=hidden]').val()
                allValue = haveValue == '' ? [] : haveValue.split(',');

                newItemBox.find('li').each(function(){
                    var self = $(this);
                    var newName = self.find('.add_name').text(),
                        newValue = self.find('[type="hidden"]').val();
                    var newLi =  '<li class="ali" data-value="'+newValue+'">'+newName+'<a class="aa"></a></li>'; 
                    if(personBox.text().trim().indexOf(newName) < 0){
                        personBox.find('.person_save').append(newLi);
                        allValue.push(newValue);
                    }
                })
                break;
        }
        personBox.find('input[type=hidden]').val(allValue);
        if(yesCallback){
            yesCallback();
        }
        layer.msg('添加成功！',{icon:1,time:800},function(){
            layer.closeAll();
        })
    }

    // 删除已有成员
    function delHave(){
        $(document).on("click",".aa",function(){
            var self = $(this);
            var selfP = self.parent();
                delName = selfP.text();
                delVal = selfP.attr('data-value'),
                haveValBox = personBox.find('[type="hidden"]');
                allHaveVal = haveValBox.val().split(',');

            layer.msg('确定移除' + delName + '？', {
                time: 0 //不自动关闭
                ,btn: ['确定', '取消']
                ,yes: function(index){
                    arrRemoveVal(allHaveVal,delVal);
                    haveValBox.val(allHaveVal);
                    selfP.remove();
                    layer.msg('删除成功',{icon:1},function(){
                        layer.close(index);
                    });
                }
            });
        });
    }

    // 清空已有成员
    function clearHave(){
        $(document).on('click','.del_person_btn',function(){
            layer.msg('确定清空？', {
                time: 0 //不自动关闭
                ,btn: ['确定', '取消']
                ,yes: function(index){
                    personBox.find('li').remove();
                    personBox.find('input[type=hidden]').val('');
                    layer.msg('清空成功',{icon:1},function(){
                        layer.close(index);
                    });
                }
            });
        });
    }

    // 模糊搜索
    function selectName(){  
        $(document).on('input propertychange','.txtChinese',function(){
            // 获取输入的值
            var keyWord = $(this).val();   
            var resultData = '';

            // 如果输入内容为空
            if(keyWord==''){
                itemBox.empty().append(initData);
                // 隐藏已存在的人
                hideAlready();
                // 隐藏新添加的成员
                hideNew();
                // 重置字母
                initLetter();

                // 隐藏第一个边框
                hideUserBorder(itemBox,0);
                return;
            }

            itemObj.each(function(){
                if($(this).text().indexOf(keyWord) > -1 && resultData.indexOf($(this).text()) < 0){
                    resultData += $(this).get(0).outerHTML;
                }
            })
            itemBox.html(resultData||'<div class="add_item_s_title">---无搜索结果！---</div>');
            // 隐藏新添加的成员
            hideNew();
        })    
    }

    // 全选
    function selectAll(){
        $(document).on('click','.obj_check',function(){
            var addUser = $(this).parents('.obj_box').find('.show_user:visible');
            addUser.each(function(){
                var self = $(this);
                var addLetter = self.attr("data-letter"),
                    addValue = self.attr("value"),
                    addName = self.text();

                switchAdd(self,addLetter,addName,addValue);
            })
            placeholder.hide();
        })
    }

    function hideUserBorder(self,type){
        if(type == 0){
            visibleLetter = self.find('.add_item_s_title:visible')
        }
        if(type == 1){
            visibleLetter = self.find('.obj_name:visible')
        }
        visibleLetter.css('border-top-color','#ccc');
        visibleLetter.eq(0).css('border-top-color','transparent');
    }
})(jQuery);
