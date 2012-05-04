/* Javascript document
 *
 * @Author:	Ken Stowell
 * @Date:		1/6/2012
 *
 * @Description: Main Scripting Resource for www.kenstowell.net 
 */
 
/**********************************************************************************************************************************************************
 * GLOBAL VARS/FUNCTIONS																																																																	*
 *********************************************************************************************************************************************************/
var scrnW = window.innerWidth;
var scrnH = window.innerHeight;

/*------- Anon Functions -------------*/

//Global function to get the height of any element, must be called from onLoad
var getH = function(elem){
		 return $(elem).height();
		 console.log($(elem).height());
}

var getW = function(elem){
		 return $(elem).width();
		 console.log($(elem).width());
}

//Global function to set margin properties, will eventually extend to be able to set any css property
var setElemMarg = function(elem1, elem2, elemTrgt, propName){
	var margH = (getH(elem1) - getH(elem2)) / 2;
	$(elemTrgt).css(propName, margH);
	console.log(elem1, elem2, elemTrgt, propName, margH);
}

/************************************************************* END GLOBAL VARS ***************************************************************************/ 


/**********************************************************************************************************************************************************
 * DOCUMENT READY																																																																		      *
 *********************************************************************************************************************************************************/
$(document).ready(function(){
	$('#slide-show').epicSlide();
	
	initModals();
});

/**********************************************************************************************************************************************************
 * WINDOW LOAD    																																																																	      *
 *********************************************************************************************************************************************************/
$(window).load(function(){
	//Style Initial Dom Elements
	initDOM();
});
 

/**********************************************************************************************************************************************************
 * INITIALIZE DOM																																																																				  *
 **********************************************************************************************************************************************************
 *
 *
 *
 *
 *
 *
*/
function initDOM(){

	/*------- DOM Wide Behaviors -------------*/
	$('a').live('mouseenter', function() {
		$(this).css({'cursor' : 'pointer'});
	}).live('mouseleave', function() {
		$(this).css({'cursor' : 'default'});
	});
	
	/*------- Sectional Scripting -------------*/
	//Nav
	$('nav li:odd').addClass('nav-separator');

	//#main-content-one
	var winH = $(window).height() - ($('header').height() + $('footer').height());
	$('#main-content-one-wrapper').height(window.innerHeight).width(window.innerWidth);
	$('#main-content-one').css({'margin-top' : (window.innerHeight - $('#main-content-one').height()) /2});
	console.log($(window).height());
	setElemMarg("#main-content-one", "#intro-text", "#intro-text", "margin-top");
	
	//#slide show. Images are to be 699x409 by default reampled to whatever the browser says
	console.log($("#slide-show").height(), $("#slide-show").width());

	//#main-content-two
	$('#main-content-two').css({'margin-top' : (window.innerHeight - $('#main-content-two').height()) /2});
	$('#main-content-two-wrapper').height(window.innerHeight).width(window.innerWidth).css({'top' : $('#main-content-one-wrapper').height(), 'left': '0'});
}

/************************************************************* END INIT DOM ******************************************************************************/ 

/**********************************************************************************************************************************************************
 * INITIALIZE MODALS																																																																		  *
 **********************************************************************************************************************************************************
 *
 *
 *
 *
 *
 *
*/
function initModals(){
	//#coming-soon
	//#coming-soon
  $('section#coming-soon').hide();
  
  $('nav').hover(
      //Mouse-over    
      function(e) {
          $(this).mousemove(function(e) {
          $('section#coming-soon').css({
              'position' : 'absolute',
              'top' : e.pageY+10,
              'left' : e.pageX+5    
              }).show();
          });    
      },
      //Mouse-out
      function() {
          $('section#coming-soon').fadeOut(1400);
      }    
  );
}
/************************************************************* END INIT MODALS ***************************************************************************/ 
