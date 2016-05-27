(function(){
	// 锁定父体的高度
	$('#root').css('height',screen.availHeight +'px');
	var util = (function(){
		var prefix = "html5_reader_";
		var storageGetter = function(key){
			return localStorage.getItem(prefix + key);
		};
		var storageSetter = function(key,value){
			return localStorage.setItem(prefix + key,value);
		};
		return {
			storageGetter:storageGetter,
			storageSetter:storageSetter
		};
	})();
	var Dom = {
		win : $(window),
		doc : $(document),
		topNav : $("#top_nav"),
		botNav : $("#bottom_nav"),
		setNav : $(".font_control"),
		root : $("#root"),
		h4 : $("#chapter_content h4"),
		content : $("#chapter_content"),
		lineHeight : $('#chapter_content p'),
		fontInfo : $('#font_info'),
		initTitleSize: 20,
		initContentSize: 14,
		initLineHeight: 24
	};
	function main(){
		readerBaseFrame();
		readerModel();
		eventHandler();
	}
	function readerModel(){
		//初始化字体模块
		Dom.initTitleSize = parseInt( util.storageGetter('h4FontSize') );
		Dom.initContentSize = parseInt( util.storageGetter('contentFontSize') );
		Dom.initLineHeight = parseInt( util.storageGetter('lineHeight') );
		Dom.h4.css('font-size', Dom.initTitleSize + 'px');
		Dom.content.css('font-size', Dom.initContentSize + 'px');
		Dom.lineHeight.css('line-height', Dom.initLineHeight + 'px');
		//初始化背景模块
		var getbg = util.storageGetter( 'rootBg');
		var getcolor = util.storageGetter( 'contentColor' );
		Dom.content.css('color',getcolor);
		Dom.root.css('background-color',getbg);
				
	}

	function readerBaseFrame(){

		if( $('.bottom_btn .fontset').hasClass('fontset_active') )
		{
			$('.bottom_btn .fontset').removeClass('fontset_active');
		}
		if( Dom.setNav.css('display') == 'block')
		{
			Dom.setNav.hide();
		}
		// bottom_nav click handler button
		function active( obj, className ){
			obj.mousedown(function(){
				$(this).addClass(className);
			});
			obj.mouseup(function(){
				var _this = $(this);
				setTimeout(function(){
					//注意这里就不能直接使用this，因为这里的作用域已经发送变法
					_this.removeClass(className);
				},350);
			});
		}
		active( $('.bottom_btn li span'), 'bot_active' );
		active( $('.top_nav .nav_title'), 'bot_active' );
		active( $('.set_btn'), 'setbutton_active' );
	}

	function eventHandler(){	
		// 交互事件的绑定
		$("#model_action .mid_action").click(function(){		
			readerBaseFrame();
			if(Dom.topNav.css('display') == 'none'){
				Dom.topNav.show();
				Dom.botNav.show();
			}else{
				Dom.topNav.hide();
				Dom.botNav.hide();
			}
		});
		// titleshow **********************
		$(".titleshow").click(function(){
			readerBaseFrame();
		});
		//font_set************************
		$('.bottom_btn .fontset').click(function(){
			if(Dom.setNav.css('display') == 'none')
			{
				$(this).addClass('fontset_active');
				Dom.setNav.show();
			}else{
				Dom.setNav.hide();
				$(this).removeClass('fontset_active');
			}
		});

			// set font-size 字体大小设置
			var setFontSize = function( obj ){
				Dom.initTitleSize += obj.num;
				Dom.initContentSize += obj.num;
				Dom.initLineHeight += obj.num;
				var max = false, min = false;
				if( Dom.initTitleSize >= 28 )
				{
					Dom.initTitleSize = 28;
					max = true;
				}else if( Dom.initTitleSize <= 18){
					Dom.initTitleSize = 18;
					min = true;
				}else{
					max = false;
					min = false;
				}	
				
				if( Dom.initContentSize >= 34 )
				{
					Dom.initContentSize = 34;
					Dom.initLineHeight = 44;
					max = true;
				}else if( Dom.initContentSize <= 14 ){
					Dom.initContentSize = 14;
					Dom.initLineHeight = 24;
					min = true;
				}else{
					max = false;
					min = false;
				}

				if( max || min ){
					Dom.fontInfo.show().html(obj.info);
					setTimeout(function(){
						Dom.fontInfo.hide();
					},1000);
				}
				Dom.h4.css('font-size', Dom.initTitleSize + 'px');
				Dom.content.css('font-size', Dom.initContentSize + 'px');
				Dom.lineHeight.css('line-height', Dom.initLineHeight + 'px');
				
				util.storageSetter( 'h4FontSize',Dom.initTitleSize);
				util.storageSetter( 'contentFontSize',Dom.initContentSize);
				util.storageSetter( 'lineHeight',Dom.initLineHeight);
			};
			$('#lg_font').click(function(){
				setFontSize({
					num: 2,
					info: '爷！不能再大啦'
				});
			});

			$('#sm_font').click(function(){
				setFontSize({
					num: -2,
					info: '爷！不能再小啦'
				});
			});
			// 背景设置
			$('.bg_type').click(function(){
				var bg = $(this).css('background-color');
				if( bg == 'rgb(85, 85, 85)')
				{
					Dom.content.css('color','#a3a3a3');
				}else{
					Dom.content.css('color','#555');
				}
				Dom.root.css('background-color',bg);
				util.storageSetter( 'rootBg',bg);
				util.storageSetter( 'contentColor',Dom.content.css('color'));
			});
		//readtype_set************************
		$('.bottom_btn .readtype').click(function(){
			readerBaseFrame();
			if( $(this).hasClass('readtype_day') ){
				$(this).removeClass('readtype_day');
				$(this).html('夜间');
				Dom.root.css('background-color','rgb(233, 223, 199)');
				Dom.content.css('color','rgb(0, 0, 0)');
			}else{
				$(this).addClass('readtype_day');
				$(this).html('昼间');
				Dom.root.css('background-color','rgb(15, 20, 16)');
				Dom.content.css('color','rgb(78, 83, 79)');
			}	
		});

		Dom.win.scroll(function(){
			readerBaseFrame();
			Dom.topNav.hide();
			Dom.botNav.hide();
		});
	}
	main();
})();