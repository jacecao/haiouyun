require.config({
    paths : {
      "jquery" : "jquery.min"
    }   
});
require(['jquery','renderUI','base'],function($,renderUI,Base){
 
  var render = new renderUI.renderUI();
  render.set_side_bar();
  var base = new Base.Base();
  base.side_bar_hander();
  //屏幕是否处于横屏状态
  var evt = "onorientationchange" in window ? "orientationchange" : "resize";
  window.addEventListener(evt,function(){
    render.set_side_bar();
  },false);


});
