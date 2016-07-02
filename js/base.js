
// 基本功能组件开发
define(['jquery'],function($){

  function Base(){
    this.mobile_bar = function(top,opacity,callback){
      $('.header-nav').animate({
        "top": top,
        "opacity" : opacity
      },900,function(){
        if( callback )
        {
          callback();
        }
      });
    };
    this.pc_bar = function(){

    };
  }
  Base.prototype={
    set_side_bar : function(){
      var _this = this;
      if( $(window).width() <= 700 )
      {
        // 初始基本样式
        $('.nav-bar').html('&#xe9bd;');
        $('.header-nav').css({
          "top" : - $('.header-nav').height(),
          "left" : ( $(window).width() - $('.header-nav').width() )/2,
          "display" : 'block'
        });
        // 显示菜单栏
        $('.nav-bar').click(function(){
          $(".local").fadeIn();
          var _top = ( $(window).height() - $('.header-nav').height() )/2;
          _this.mobile_bar(_top , 1);
        });
        // 点击遮罩或菜单 遮罩和菜单消失
        var close_menu = function(){
          $(".local").fadeOut();
          _this.mobile_bar( - $('.header-nav').height() , 0 );
        };
        $(".local").click(function(){
          close_menu();
        });
        $(".header-nav a").click(function(){
          close_menu();
        });
      }else{
        $('.nav-bar').html('&#xe9ba;');
        $('.nav-bar').click(function(){
          $(".local").fadeIn();
          _this.pc_bar();
        });
      }
    }
  };

  return {
    Base : Base
  };
});
