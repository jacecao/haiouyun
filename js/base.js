
// 基本功能组件开发
define(['jquery'],function($){

  function Base(){
    this.config = {
      time : 100,
      _mobile_nav : $('.mobile-nav'),
      _local : $(".local")
    };
    var config = this.config;
    var reset = false; //防止动画被多次触发
    this.show_nav_bar = function( callback ){ 
      if( config._mobile_nav.css('display') == 'none' && !reset )
      {
        config._local.show();
        config._mobile_nav.show().animate({
          'top' : ( $(window).height() - config._mobile_nav.height() ) / 2,
          'opacity' : 1
        },config._time,function(){
          reset = true;
          if( callback ){ callback(); }
        });
      }
    };  
    this.close_nav_bar = function( callback ){
      if( config._mobile_nav.css('display') == 'block' && reset ){
         config._mobile_nav.animate({
          'top' : - config._mobile_nav.height(),
          'opacity' : 0
         }, config._time, function(){
          reset = false;
          config._mobile_nav.hide();
          if( callback ){ callback(); }
         });
         config._local.hide();
      } 
    };
  }    

  Base.prototype={
    bottom_bar_hander : function(){
      var _this = this;
      var _local = this.config._local;
      var _menu = $('.mobile-nav li a');
        // 显示菜单栏
        if( $(window).width() <= 623 ){
          $('.nav-bar').bind('touchend',function(){
            // 兼容手机横屏状态时，无法启动resize事件
            $('.mobile-nav').css('left', ( $(window).width() - $('.mobile-nav').width() )/2);
            // 再执行动画
            _this.show_nav_bar();
          });
          //关闭菜单栏
          _local.bind('touchend', function(){
            _this.close_nav_bar();
          });
          _menu.bind('touchend', function(){
            _this.close_nav_bar();
          });
        }else{
          $('.nav-bar').click(function(){
            if( $('body').hasClass('padding') )
            {
              $('body').removeClass('padding');
              $('.side-bar').removeClass('side-bar-active');
              $(this).html('&#xe9ba;');
            }else{
              $('body').addClass('padding');
              $('.side-bar').addClass('side-bar-active');
              $(this).html('&#xea0f;');
            }

          });
        }  
    }
  };

  return {
    Base : Base
  };


});
