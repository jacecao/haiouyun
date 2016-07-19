define(['jquery'],function($){

  function Tool( ){

  }
  Tool.prototype = {
    scroll_animate : function(obj)
    {
      //运动目标值
      var target = obj.target,
          time = obj.time ? obj.time : 20,
          step = obj.step ? obj.step : 400,
          type = obj.type ? obj.type : 'normal';//动画的速度，fast/normal/slow
      var now_scrollTop = '';
      var over = true;
      //获取运动最终速度值
      switch( type )
      {
        case 'fast':
          step += 450;
          time = 20;
          break;
        case 'slow':
          step = 200;
          time = 50;
          break;
        case 'normal':
          step = 300;
          time = 30;
          break;
      }
      var animate = function()
      {
        setTimeout( function(){
          now_scrollTop = $(window).scrollTop();
          if( now_scrollTop === target ){
            over = true;
            obj.callback && obj.callback( );
          }else{
            if( now_scrollTop < target )
            {
              now_scrollTop += step;
              if( now_scrollTop >  target || Math.abs( now_scrollTop - target ) < step )
              {
                now_scrollTop = target;
                $(window).scrollTop( now_scrollTop );
                over = true;
              }
            }else{
              now_scrollTop -= step;
              if( now_scrollTop <  target || Math.abs( now_scrollTop - target ) < step )
              {
                now_scrollTop = target;
                $(window).scrollTop( now_scrollTop );
                over = true;  
              }
            }
            $(window).scrollTop( now_scrollTop );
            over = false;
            animate();
          }
        }, time);
      };
      if( over ){ animate(); }   
    }















  };



  return {
    Tool : Tool
  };
});