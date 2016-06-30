/*  夸浏览器兼容
** 主要是兼容IE9以下的浏览器
*/
// 浏览器检测
(function(){
	window.sys = {};
	var ua = navigator.userAgent.toLowerCase(), s;
	( s = ua.match( /media\scenter\spc\s[\d.]+/ ) ) ? sys.ie = s[0]:
	( s = ua.match( /applewebkit\/[\d.]+/ ) ) ? sys.webkit = s[0]:
	( s = ua.match( /firefox\/[\d.]+/ ) ) ? sys.firefox = s[0]: 0 ;
})();

//获取/设置css样式值
var getStyle = function( obj, attr )
	{
		var value = null;
		if( typeof window.getComputedStyle != "undefined")//w3c
		{
			_value = window.getComputedStyle( obj, null )[attr];
		}else if( typeof obj.currentStyle != "undefined"){//IE
			_value = obj.currentStyle[attr];
		}
		//判断如果样式值为长度单位的那么久转换为数值，否则就返回字符串
		//注意这里的需要加入是负数的情况
		if( /^[\d+|-\d+]/.test( _value ) )
		{
			return parseFloat( _value );
		}else{
			return _value;
		}
	};
//获取视窗大小
var View_X = window.innerWidth || document.documentElement.clientWidth,
	View_Y = window.innerHeight || document.documentElement.clientHeight;
//获取或设置滚动条属性值，参数以对象形式传入{attr:value}
var scroll = function( obj )
{
	if( arguments.length == 0 ){
		var scroll = {};
		scroll.top = document.body.scrollTop || document.documentElement.scrollTop;
		scroll.left = document.body.scrollLeft || document.documentElement.scrollLeft;
		scroll.height = document.body.scrollHeight || document.documentElement.scrollHeight;
		return scroll;
	}else{
		document.body.scrollTop = document.documentElement.scrollTop = obj.top;
		document.body.scrollLeft = document.documentElement.scrollLeft = obj.left;
		document.body.scrollHeight = document.documentElement.scrollHeight = obj.height;
	}
	
};
//阻止默认事件
var preDef = function( event )
	{
		var e = event || window.event;
		if( typeof e.preventDefault != "undefined" )
		{
			e.preventDefault();
		}else{
			e.returnValue = false;
		}
	};

//DOM加载-执行函数
 function DomLoaded( fn )
 {
 	var isReady = false;
 	var timer = null;
 	function doReady()
 	{
 		if( timer )
 		{
 			clearInterval(timer);
 			if( isReady ){ return; }
 			isReady = true;
 			fn();
 		}
 	}
 	if( sys.ie == 'undefined' || sys.webkit == 'undefined' || sys.firefox == 'undefined' )
 	{
 		timer = setInterval( function(){
 			if( document && document.getElementById && document.getElementsByTagName && document.body )
 			{
 				doReady();
 			}
 		}, 1 );
 	}else if( document.addEventListener ){
 		addEvent( document, "DOMContentLoaded", function(){
 			fn();
 			removeEvent( document, "DOMContentLoaded", arguments.callee );
 			//arguments.callee 这里是调用函数本身
 		});
 		//下面是兼容IE9以下版本
 	}else if( sys.ie == 'undefined' && document.addEventListener=='undefined' )
 	{
 		timer = setInterval( function(){
 			try
 			{
 				document.documentElement.doScroll('left');
 				doReady();
 			}catch(e){

 			}
 		}, 1 );
 	}
 }

// 事件的绑定和移除 兼容低版本浏览器
// 低版本IE浏览器不支持自动排除多次绑定同名函数
// 并且在绑定多个函数时执行顺序与其他浏览器是相反的
// 解决方案就是通过传统事件绑定方法来解决IE兼容
var addEvent = function( obj, type, fn )
	{
		if( typeof obj.addEventListener != "undefined" )
		{
			obj.addEventListener( type, fn, false );
		}else{
			//创建一个存放事件的哈希表（散列表）,需要判断这个列表是否存在
			if( !obj.events )
			{
				obj.events = {};
			}
			//判断该事件的数组是否创建
			if( !obj.events[type] )
			{
				obj.events[type] = [];
				//把第一次的事件处理函数储存在第一个位置上(需要判断该事件是否存在)
				if( obj['on'+type] )
				{
					obj.events[type][0] = fn;
				}
			}else{
				//屏蔽相同函数.equal为自写方法
				if( addEvent.equal( obj.events[type], fn ) == true )
				{
					return false;
				}
			}	
			//如果已经存在第一个函数那么使用计数器来储存新加入的函数
			obj.events[type][addEvent.ID++] = fn;
			//执行事件处理函数
			/*
			*obj['on'+type] = function(){
			*	for( var i in obj.events[type] )
			*	{
			*		obj.events[type][i]();
			*	}
			*}
			*/
			obj['on'+type] = addEvent.run;
		}
	};
//创建一个事件计数器
addEvent.ID = 1;
//执行事件处理函数
addEvent.run = function( event )
{
	var e = event || addEvent.fixEvent( window.event );
	var _this = this.events[ e.type ];//理解这里的this 指得是obj
	for( var i in _this )
	{
		_this[i].call( this, e ); 
		//理解这里的.call传参
		//这里是再次将obj和event传入函数便可以实现下面函数的功能
		//addEvent( obj ,'click',fn );
		// function fn(e){
		// 	alert('1'+this.value+e.clientX);
		// }
	}
};
//屏蔽注册同一个函数
addEvent.equal = function( objEvent, fn )
{
	for( var i in objEvent )
	{
		return objEvent[i] == fn ? true : false;
	}
};
//兼容IE事件配对到W3C中
addEvent.fixEvent = function( event )
{
	event.preventDefault = addEvent.fixEvent.preventDefault;
	event.stopPropagation = addEvent.fixEvent.stopPropagation;
	event.target = e.srcElement;
	return event;
};
addEvent.fixEvent.preventDefault = function(){ this.returnValue = false; };
addEvent.fixEvent.stopPropagation = function(){ this.cancelBubble = true; };
//跨浏览器移除事件函数
var removeEvent = function( obj, type, fn )
{
	if( typeof obj.removeEventListener != "undefined" )
	{
		obj.removeEventListener( type, fn );
	}else if( obj.events ){//在删除前需要判定obj是否有事件绑定存在，有才能执行移除事件
		for( var i in obj.events[type] )
		{
			if( obj.events[type][i] == fn )
			{
				delete obj.events[type][i];
			}
		}
	}
};
//去除空格
var dele_spce = function( str )
{
	return str.replace( /(^\s*)|(\s*$)/g, "" );
};
//跨浏览器获取、设置innerText
var getInnerText = function( ele )
{
	return (typeof ele.textContent == 'string')? ele.textContent:ele.innerText;
};
var setInnerText = function( ele,text )
{
	if( typeof ele.textContent == 'string' )
	{
		ele.textContent = text;
	}else{
		ele.innerText = text;
	}
};
//兼容低版本IE模式 获取某个元素到最外层顶点的位置
var offsetTop = function( element )
{
	var top = element.offsetTop;
	var parent = element.offsetParent;
	//offsetParent属性返回一个对象(element)的引用，
	//这个对象(element)是距离调用offsetParent的元素最近的（在包含层次中最靠近的），
	//并且是已进行过CSS定位的容器元素。
	while( parent != null )
	{
		top += parent.offsetTop;
		parent = parent.offsetParent;
	} 
	return top;
};
//判断某个值是否在某个数组中****************************
var inArray = function( array,value )
{
	for( var i in array )
	{
		return array[i] === value ? true : false;
	}
};
//获取某个节点的上一个节点的索引***********************
//current : 当前索引  sum_length: 元素总长度
var prevIndex = function( current, sum_length )
{
	return current == 0 ? sum_length - 1 : current - 1;
};
//获取某个节点的下一个节点的索引
var nextIndex = function( current, sum_length )
{
	return current == sum_length - 1 ? 0 : current + 1;
};

