(function(){
	// 锁定body的高度
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
		content : $("#chapter_content")
	};
	function main(){
		readerBaseFrame();
		eventHandler();
	}
	function readerModel(){}

	function readerBaseFrame(){
		$('.bottom_btn .fontset').removeClass('fontset_active');
		Dom.setNav.hide();

		// bottom_nav click handler button
		function active( obj ){
			obj.mousedown(function(){
				$(this).addClass('bot_active');
			});
			obj.mouseup(function(){
				var _this = $(this);
				setTimeout(function(){
					//注意这里就不能直接使用this，因为这里的作用域已经发送变法
					_this.removeClass('bot_active');
				},350);
			});
		}
		active( $('.bottom_btn li span') );
		active( $('.top_nav .nav_title') );
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
		//readtype_set************************
		$('.bottom_btn .readtype').click(function(){
			readerBaseFrame();
			if( $(this).hasClass('readtype_day') ){
				$(this).removeClass('readtype_day');
				$(this).html('夜间');
				Dom.root.css('backgroundColor','rgb(233, 223, 199)');
				Dom.content.css('color','rgb(0, 0, 0)');
			}else{
				$(this).addClass('readtype_day');
				$(this).html('昼间');
				Dom.root.css('backgroundColor','rgb(15, 20, 16)');
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