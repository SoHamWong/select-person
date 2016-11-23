;(function(){
	var _CON        = null, //弹窗外层class
    	_SELECTBOX  = null, //选择框外层class
    	_SAVEBIGBOX = null, //选择框
    	_SAVEBOX    = null, //已有成员列表框
    	_RIGHTUL    = null, //新添加成员列表框
    	_CHECKALL   = null, //项目全选按钮
    	_LINK       = null, //数据源
    	_USERALL    = null, //所有数据
    	_LETTER     = null, //首字母
    	_TYPE       = null, //选择类型
    	_INDEX      = null, //对应的选择框序号
    	_ALLOBJ     = null, //所有成员
    	_OBJBOX     = null, //项目
    	_PLACEHOLDER= null, //水印
    	_POPUP      = null, //弹窗
    	_YESFN      = null; //选择事件处理

	$.fn.select_run=function(json){
		_LINK       = json.link;
		_SELECTBOX  = json.selectbox;
		if(json.container){ _CON = json.container }else{ _CON = 'body' };
		if(json.type){ _TYPE = json.type }else{ _TYPE = 1 };
		if($.fn.isType(json.ysefn,'function') && json.ysefn){ _YESFN = json.ysefn};
		// 选择框初始化
		$.fn.box_init();
		// 绑定事件
		$.fn.select_event();
	}

	$.fn.box_init=function(){
		var tpl = $.fn.select_tpl('selectbox');
		$(_SELECTBOX).eq(0).append(tpl);
		_SAVEBIGBOX = $('.person_box');
	}

	$.fn.select_init=function(){
		$.fn.select_creat();
		$.fn.switch_type();
	}

	$.fn.select_event=function(){
		// 点击弹窗
		$.fn.select_begin();
		// 清空所有成员
		$.fn.clear_all();
		// 添加成员
		$.fn.add_person();
		// 删除新添加成员
		$.fn.del_person();
		// 删除已有成员
		$.fn.del_btn();
		// 模糊搜索
		$.fn.fuzzy_search();
		// 全选
		$.fn.all_select();
		// 选择完毕回调
		$.fn.yes_fn();
		// 取消选择
		$.fn.cancle_fn();
	}

	// 模板
	$.fn.select_tpl=function(index){
		var defaults={
			'selectbox':'<div class="person_box"><ul class="person_save"></ul><input type="hidden" /><a class="del_person_btn"><img src="images/del.png"></a><a class="add_person_btn"><img src="images/add.png"></a></div>',
			'addli'    :'<li class="add_item_name" data-letter="@addletter"><span class="fl">@addName</span><span class="fr cur-poin add_del_btn">&times;</span><input type="hidden" name="uesr[]" value="@addValue" /></li>',
			'double'   :'<div class="obj_box"><div class="obj_name"><label><input type="checkbox" class="obj_check"/>@obj</label></div></div>',
			'user'     :'<div class="add_item_name show_user" data-obj="@objName" value="@userId">@userName</div>',
			'addletter':'<div class="add_item_s_title letter_title" data-letter="@word">@word</div>',
			'savelist' :'<li class="ali"><span>@name</span><a class="aa" value="@value"></a></li>',
			'single'   :'<div class="obj_box"><div class="obj_name">@obj</div></div>',
		}
		return defaults[index];
	}

	// 字符串替换
	$.fn.str_replace=function(search,replace,str){
		while(str.indexOf(search,0)+1){
			str=str.replace(search,replace);
		}
		return str;
	}

	// 查看值是否存在
	$.fn.isset=function(obj){
		if(typeof(obj)=='undefined'){
			return false;
		}else{
			return true;
		}
	}

	// 删除数组的某个值
	$.fn.arrRemoveValue=function(arr,val){
		for(var i=0; i<arr.length; i++) {
            if(arr[i] == val) {
                arr.splice(i, 1);
                break;
            }
        } 
	}

	//字符串分割成数组
	$.fn.explode=function(search,str){
		return str.split(search);
	}

	//数组转字符串
	$.fn.implode=function(search,arr){
		return arr.join(search);
	}

	//判断类型
    $.fn.isType = function(obj, type) {
        type = type.replace(/\b(\w)|\s(\w)/g, function(m) {
            return m.toLowerCase();
        });
        return typeof(obj) == type;
    };

	// ajax请求
	$.fn.myAjax=function(data,url,options){
		var json=null;
		var defaults={
			type:'GET',
			async: true,
			callback:null
		}
		if($.fn.isset(options)){
			var opts=$.extend(defaults,options);
		}else{
			var opts=defaults;
		}
		$.ajax({
			type:opts.type,
			async:opts.async,
			url:url,
			data:'data='+data,
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

	// 生成弹窗
	$.fn.select_creat=function(){
		var selectBox = $('<div id="add_item_box">'
 					  	+ '<div id="add_item_title"><span class="fl">选择人员</span><span class="fr cur-poin add_item_close_btn">X</span></div>'
 					  	+ '<div id="add_item_sbox">'
 					  		+ '<div class="fl" id="add_item_search">'
 					  			+'<div>'
									+'<input type="text" placeholder="输入姓名搜索" id="txtChinese" class="add_item_search_input" />'
								+'</div>'
								+'<div id="add_item_search_box">'
								+'</div>'
 					  		+ '</div>'
 					  		+ '<div class="fr" id="add_item_show">'
 					  			+ '<div class="add_item_s_title">新添加成员（<span class="add_item_count">0</span>）</div>'
 					  			+ '<ul class="add_item_show_ul">'
 					  				+'<div class="add_placeholder"></div>'
 					  			+ '</ul>'
 					  			+ '<input type="hidden" name="item_id" value="" />'
 					  		+ '</div>'
 					  	+ '</div>'
 					  	+ '<div id="add_item_btn_box">'
 					  		+'<button class="add_item_yes_btn" type="button">确认</button><button class="add_item_cancel_btn" type="button">取消</button>'
 					  	+ '</div>'
					  +'</div>');

		var returns=$.fn.myAjax('{}','js/'+_LINK,{
			callback:function(data){
				_JSON = data;
	        	for(var i=0;i<_JSON.length;i++){
					var _OBJ = _JSON[i];
					var objName = _OBJ.name;
					var objUser = _OBJ.user;
					if(_TYPE == 0){var tpl=$.fn.select_tpl('single');}else if(_TYPE == 1){var tpl=$.fn.select_tpl('double');}
					var obj = $($.fn.str_replace('@obj',objName,tpl));
					for(var k=0;k<objUser.length;k++){
						var tpl=$.fn.select_tpl('user');
						tpl = $.fn.str_replace('@objName',objName,tpl);
						tpl = $.fn.str_replace('@userId',objUser[k].user_id,tpl);
						tpl = $.fn.str_replace('@userName',objUser[k].name,tpl);
						obj.append(tpl);
					}
					selectBox.find('#add_item_search_box').append(obj);
				}
				_ALLOBJ=$('.show_user');
	   			_OBJBOX=$('.obj_box');
	   			// 添加首字母
	   			$.fn.add_letter();
	   			_LETTER   = $('.add_item_s_title');
	   			// 隐藏已存在成员
	   			$.fn.hide_already();
	   			_CHECKALL = $('.obj_check');
				_SAVEBOX  = $('.person_save');
	   			_USERALL  = $('#add_item_search_box').html();
			}
		});
		$(_CON).append(selectBox);
	    _PLACEHOLDER = $('.add_placeholder');
	    _RIGHTUL     = $('.add_item_show_ul');
	    _lEFTBOX     = $('#add_item_search_box');
	    _POPUP       = $('#add_item_box');
	}

	$.fn.select_begin=function(){
		$(document).on('click','.add_person_btn',function(){
			_INDEX=$(this).parents(_SAVEBIGBOX).index(_SAVEBIGBOX);
			$.fn.select_init();
		})
	}

	// 生成字母
	$.fn.add_letter=function(){
		_OBJBOX.each(function(){
            var word = '';
            var obj = $(this).find('.show_user');
            for (var i=0; i < obj.length ;i++ ){
                if(typeof (($(obj[i]).html())[0]) == 'string'){
                    // 获取首字母
                    var word_ = makePy(($(obj[i]).html())[0]);
                    if(word_.length == 2){
                        word_ = word_[1];
                    }

                    $(obj[i]).attr("data-letter",word_[0]);

                    if(word != word_[0]){
                        word = word_[0];
                        var tpl=$.fn.select_tpl('addletter');
                        $(obj[i]).before($.fn.str_replace('@word',word,tpl));
                    }
                }
            }
        })
	}

	//隐藏已经存在的人
	$.fn.hide_already=function(){
		var already_text = _SAVEBIGBOX.eq(_INDEX).find(_SAVEBOX).find('li').text();
        _ALLOBJ.each(function(){
            if(already_text.indexOf($(this).text()) > -1){
                $(this).hide();
            }
        });      

        $.fn.hide_letter();
	}

	$.fn.hide_letter=function(){
        _OBJBOX.each(function(){
            $(this).find(_LETTER).each(function(){
                var title_letter = $(this).attr("data-letter");
                if($(this).siblings('.show_user[data-letter='+ title_letter +']:visible').length == 0){
                    $(this).hide();
                }else{
                	$(this).show();
                }
            })

            if($(this).find('.show_user:visible').length == 0){
                $(this).find('.obj_name').hide();
            }else{
            	$(this).find('.obj_name').show();
            }
        })
	}

	$.fn.switch_type=function(){
		switch(_TYPE){
        	//单选   
        	case "0":_PLACEHOLDER.text("只能添加一人");break;
        	//多选
        	case "1":_PLACEHOLDER.text("可添加多人");break;
    	}
	}

	// 绑定添加事件
	$.fn.add_person=function(){
		$(document).on('click','.show_user',function(){
	        _PLACEHOLDER.hide();
	        var self = $(this);
	        var add_letter = self.attr("data-letter");
	        var add_name = self.text();
	        var add_value = self.attr("value");
	        if(_TYPE == 0){
	        	_RIGHTUL.find('li').remove();
                _ALLOBJ.show();
                _LETTER.show();
	        }
	        $.fn.switch_add(add_letter,add_name,add_value,self);
	    })
	}

	// 添加成员
	$.fn.switch_add=function(add_letter,add_name,add_value,self){
		var tpl=$.fn.select_tpl('addli');
		tpl = $.fn.str_replace('@addLetter',add_letter,tpl);
		tpl = $.fn.str_replace('@addName',add_name,tpl);
		tpl = $.fn.str_replace('@addValue',add_value,tpl);
	    _RIGHTUL.append(tpl);
	    self.hide();

	    $.fn.hide_letter();
	    $.fn.count_num();
	}

	// 绑定删除事件
	$.fn.del_person=function(){
		$(document).on('click','.add_del_btn',function(){
	        var del_val = $(this).next().attr("value");
	        var del_letter = $(this).parent().attr("data-letter");
	        $(this).parent().remove();
	        $('.add_item_name[value='+ del_val +']').show();
	        $.fn.count_num();
	        $.fn.hide_letter();
	        _CHECKALL.removeAttr('checked');
	        if(_RIGHTUL.find('li').length == 0){
	            _PLACEHOLDER.show();
	        }
	    })
	}

	// 计算成员数量
	$.fn.count_num=function(){
		var count = _RIGHTUL.find('li').length;
  		$(".add_item_count").text(count);
	}

	// 模糊搜索
	$.fn.fuzzy_search=function(){
		$(document).on('input propertychange','.add_item_search_input',function(){
			var key_word = $('#txtChinese').val();					
		    var data_str = '';
		    if(key_word==''){
		        _lEFTBOX.empty().append(_USERALL);
		        _lEFTBOX.find('div').each(function(){
		            if(_RIGHTUL.find('li').text().indexOf($(this).text()) > -1){
		                $(this).hide();
		            }
		        });
		        _OBJBOX=$('.obj_box');
		        _LETTER=$('.add_item_s_title');
		        _CHECKALL=$('.obj_check');
		        $.fn.hide_letter();
		        return;
		    }

		    _ALLOBJ.each(function(){
		        if($(this).text().indexOf(key_word) > -1){
		            data_str += $(this).get(0).outerHTML;
		        }
		    })
		    _lEFTBOX.empty().append(data_str||'<div class="add_item_s_title">---无搜索结果！---</div>');
		})
	}

	// 全选
	$.fn.all_select=function(){
		$(document).on('click','.obj_check',function(){
			var add_user = $(this).parents('.obj_box').find('.show_user:visible');
            add_user.each(function(){
            	var self = $(this);
                var add_letter = self.attr("data-letter");
                var add_name = self.text();
                var add_value = self.attr("value");
                $.fn.switch_add(add_letter,add_name,add_value,self);
            })
            _PLACEHOLDER.hide();
		})
	}

	// 选择完毕回调
	$.fn.yes_fn=function(){
		$(document).on('click','.add_item_yes_btn',function(){
			var all_value = [];
			_RIGHTUL.find('li').each(function(){
                var name = $(this).children('span').html();
                var value = $(this).children('input').val();
                var tpl = $.fn.select_tpl('savelist');
            	tpl = $.fn.str_replace('@value',value,tpl);
            	tpl = $.fn.str_replace('@name',name,tpl);
                switch(_TYPE){
		            // 单选
		            case 0:
		                _SAVEBIGBOX.eq(_INDEX).find('.ali').remove();
		                _SAVEBIGBOX.eq(_INDEX).find(_SAVEBOX).append(tpl);
                		all_value.push(value);
		                break;
		            // 多选
		            case 1:
		            	if(_SAVEBIGBOX.eq(_INDEX).find('input[type=hidden]').val()){all_value = _SAVEBIGBOX.eq(_INDEX).find('input[type=hidden]').val().split(',')}
	                    if(_SAVEBIGBOX.eq(_INDEX).find(_SAVEBOX).find('li').text().indexOf(name) < 0){
	                        _SAVEBIGBOX.eq(_INDEX).find(_SAVEBOX).append(tpl);
	                        all_value.push(value);
	                    }
		                break;
		        }
            });
	        _SAVEBIGBOX.eq(_INDEX).find('input[type=hidden]').val(all_value.join(','));
	        _POPUP.remove();
			if(_YESFN){_YESFN()};
		})
	}

	// 取消选择
	$.fn.cancle_fn=function(){
		$(document).on('click','.add_item_cancel_btn,.add_item_close_btn',function(){
			_POPUP.remove();
		})
	}

	// 清空所有成员
	$.fn.clear_all=function(){
		$(document).on('click','.del_person_btn',function(){
			layer.confirm('确定全部清空吗？', {
				btn: ['确定','取消'] //按钮
			}, function(){
				$('.ali').remove();
				layer.msg('清空成功', {icon: 1});
			}, function(){
				layer.closeAll();
			});
		})
	}

	// 删除已有成员
	$.fn.del_btn=function(){
		$(document).on('click','.aa',function(){
			var self = $(this);
			var del_name = self.siblings('span').text();
			layer.confirm('确定要删除'+del_name+'吗？', {
			    btn: ['确定','取消'] //按钮
			}, function(){
				var value_arr = $.fn.explode(',',_SAVEBIGBOX.find('[type="hidden"]').val());
				$.fn.arrRemoveValue(value_arr,self.attr('value'));
				_SAVEBIGBOX.find('[type="hidden"]').val($.fn.implode(',',value_arr));
				self.parents('li').remove();
				layer.msg('删除成功', {icon: 1});
			}, function(){
			    layer.closeAll();
			});
		})
	}
})(jQuery);
