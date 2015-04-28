/*
命名 : jquery.plugin_tab.js

描述 : Tab选项卡插件

功能描述 : 
	选项卡功能可以任意设置
	可仅用制定Tab选项
	可以绑定Tab事件触发函数
	可以制定Tab切换动画显示效果
	支持三种回调函数，方便Ajax异步交换数据
		callBackStartEvent 单击tab选项卡时立即执行
		callBackHideEvent  当显示的Tab选项内容完全隐藏式执行
		callBackShowEvent  当单击Tab选项内容完全显示后执行

参数 : 
	tabList: String，指定Tab选项卡标题包含框的类名
	contentList: String，指定Tab选项卡内容框的类名
	tabActiveClass: String，指定激活选项卡的类名
	tabDisableClass: String，指定要禁用选项卡的禁用类名
	eventType: String，制定触发时间类型，包括click、mouseover两种
	showType: String，设置显示方式，“show”直接显示“fade”渐变显示“slide”滑动显示
	showSpeed: Number, 表示显示速度，单位毫秒
	callBackStartEvent: 回调函数，在点击时触发
	callBackHideEvent: 回调函数，在隐藏时触发
	callBackShowEvent: 回调函数，在显示时触发

返回值 :
	本插件是一个类型插件，需要初始化才能使用，故没有返回值

成员描述 :
	(1) 初始化配置函数
		init(): 类型初始化方法。该方法在类型实例化过程中被调用，用来初始化设置Tab选项
	(2) 三个公共方法：
		setDisable(): 公共方法，用来设置锁定Tab选项。包含一个参数，用来传递锁定的Tab选项的序号
		setEnable(): 公共方法，用来设置解锁Tab选项。包含一个参数，用来传递解锁的Tab选项的序号
		triggleTab(): 公共方法，用来触发选中指定的Tab选项。包含一个参数，用来传递被选中的Tab选项的序号
	(3) 一个私有方法：
		showContent(): 私有方法，可以设置要显示的选项的内容。包含两个参数，一个用来设置要显示的选项序号，第二个参数传递参数选项对象
	(4) 一个公共属性：
		defaults: 设置插件的默认选项值
	(5) 两个私有属性：
		disableArr: 数组，用来记录哪些选项被禁用
		opts: 列表结构对象，可以设置当前调用插件的默认选项值	
*/

;(function ($) {
	var isShow = false; //初始化显示变量
	$.fn.tab = function (options) { //类型结构
		this.opts = $.extend({}, $.fn.tab.defaults, options);
		this._init(); //调用初始化配置方法
		this.disableArr = []; //本地私有属性，储存禁用选项	
	};
//类型原始对象
	$.fn.tab.prototype = {  
		_init: function () {
			var _this = this;
			if($(_this.opts.tabList).length > 0){
				$(_this.opts.tabList).each(function (index) {
					$(this).bind(_this.opts.eventType, function(){
						if($.inArray(index, _this.disableArr) == -1 && (!isShow) && $(this).attr("class").indexOf(_this.opts.tabActiveClass) == -1){
							if(_this.opts.callBackStartEvent){
								_this.opts.callBackStartEvent(index);
							}
							$(_this.opts.tabList).removeClass(_this.opts.tabActiveClass);
							$(this).addClass(_this.opts.tabActiveClass);
							showContent(index, _this.opts);
						}
					});
				});
			}

		},
		//公共方法，禁用函数
		setDisable : function (index) {
			var _this = this;
			if($.inArray(index, this.disableArr) == -1){
				this.disableArr.push(index);
				$(_this.opts.tabList).eq(index).addClass(_this.opts.tabDisableClass);
			}
		},
		//公共方法，解禁函数
		setEnable : function (index) {
			var _this = this;
			var i = $.inArray(index, this.disableArr);
			if(i > -1){
				this.disableArr.splice(i, 1);
				$(_this.opts.tabList).eq(index).removeClass(_this.opts.tabDisableClass);
			}
			
		},
		//公共方法，触发函数，根据制定序号，可以选中该项
		triggleTab : function (index) {
			$(this.opts.tabList).eq(index).trigger(this.opts.eventType);
		}

	}
//公共属性
	$.fn.tab.defaults = {
		tabList: ".tab_list li",
		contentList: ".tab_content",
		tabActiveClass: "active",
		tabDisableClass: "disable",
		eventType: "click",
		showType: "show",
		showSpeed: 200,
		callBackStartEvent: null,
		callBackHideEvent: null,
		callBackShowEvent: null
	};
//内部属性，显示选项内容
	function showContent (index, opts) {
		isShow = true;
		var _this = this;
		switch(opts.showType){
			case "show":
				$(opts.contentList + ":visible").hide();
				if(opts.callBackHideEvent){
					opts.callBackHideEvent(index);
				}
				$(opts.contentList).eq(index).show();
				if(opts.callBackShowEvent){
					opts.callBackShowEvent(index);
				}
				isShow = false;
				break;
			case "fade":
				$(opts.contentList + ":visible").fadeOut(opts.showSpeed, function () {
					if(opts.callBackHideEvent){
						opts.callBackHideEvent(index);
					}
					$(opts.contentList).eq(index).fadeIn(function () {
						if(opts.callBackShowEvent){
							opts.callBackShowEvent(index);
						}
						isShow = false;
					});
				});
				break;
			case "slide":
				$(opts.contentList + ":visible").slideUp(opts.showSpeed, function () {
					if(opts.callBackHideEvent){
						opts.callBackHideEvent(index);
					}
					$(opts.contentList).eq(index).slideDown(function () {
						if(opts.callBackShowEvent){
							opts.callBackShowEvent(index);
						}
						isShow = false;
					});
				});
				break;
		}
	};

})(jQuery);