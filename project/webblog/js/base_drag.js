$().extend( "drag", function( arry ){
	//拖拽功能，id是事件触发元素
	for( var i = 0; i < this.elements.length; i++ )
	{
		addEvent( this.elements[i], "mousedown", function( e )
		{
			// 兼容火狐低版本在容器没有内容时移动会产生的bug
			if( dele_spce(this.innerHTML).length == 0 )
			{
				e.preventDefault();
			}
			var	_this = this; 
			var box_x = e.clientX - this.offsetLeft,
				box_y = e.clientY - this.offsetTop;	
			//移动函数
			var move = function( e )
			{
				var _this_left = e.clientX - box_x,
					_this_top = e.clientY - box_y;
				//这里需要考虑滚动条的影响，所以加入滚动条的高度scroll().top和宽度值scroll().left
				var _max_left = View_X + scroll().left - _this.offsetWidth,
					_max_top = View_Y + scroll().top - _this.offsetHeight;
				if( _this_left > _max_left )
				{
					_this_left = _max_left - 15;
				}
				if( _this_top > _max_top )
				{
					_this_top = _max_top;
				}
				if( _this_left <= 0 )
				{
					_this_left = 0;
				}
				if( _this_top <= 0 )
				{
					_this_top = 10;
				}
				if( _this_top <= scroll().top )
				{
					_this_top = scroll().top + 10;
				}
				_this.style.left = _this_left + "px";
				_this.style.top = _this_top + "px";
				//IE在鼠标移出窗口后依然能捕捉到鼠标事件，用于修复老版BUG
				if( typeof _this.setCapture != "undefined" )
				{
					_this.setCapture();
				}
			};
			var up = function()
			{
				removeEvent( document, "mousemove", move );
				removeEvent( document, "mouseup", up );
				if( typeof _this.releaseCapture != "undefined" )//兼容老版IE
				{
					_this.releaseCapture();
				}
			};
			var _drag = false;
			for( var i = 0; i < arry.length; i++ )
			{
				var _arry = arry[i].elements;
				for( var j = 0; j < _arry.length; j++)
				{
					if(  e.target.tagName == _arry[j].tagName )
					{
					
						_drag = true; //只要有一个是真那么就跳出循环
						break;
					}
				}
			}
			if( _drag )
			{
				addEvent( document, "mousemove", move );
				addEvent( document, "mouseup", up );
			}else{
				removeEvent( document, "mousemove", move );
				removeEvent( document, "mouseup", up );
			}
		});
	}
	return this;
});