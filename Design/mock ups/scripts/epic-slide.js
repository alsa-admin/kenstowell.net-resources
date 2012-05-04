/* Javascript document
 *
 * @Author:	Ken Stowell
 * @Date:		
 *
 * @Description: slide show plugin
 */
/**********************************************************************************************************************************************************
 * GLOBAL VARS/FUNCTIONS																																																																	*
 *********************************************************************************************************************************************************/
 
//Options placeholder 
var o;

//Global Objects
var methods = {

	startAnimation : function(o) {
		var $elem = $('li.slide-active');
		var base = this;
		
		//Begin Animation
		$('.slide-active').delay(10000).animate({
			top : '-=419',
			opacity : '0'
		}, o.interval, function() {
			$(this).css({'top' : 0, 'opacity' : 0});
		});
		
		$('.slide-active').next().delay(10000).animate({
			top : '-=414',
			opacity : '100'
		}, o.interval, function() {
			$(this).css({'top' : 0});
			base.stageAnimation();
		});
	},
	
	stageAnimation : function() {
		var base = this;
	
		$('.slide-active').appendTo($('.slide-active').parent()).
			toggleClass('slide-active').parent().children().first().
				toggleClass('slide-active');
				
		$('.slide-active').next().css({'opacity' : '0'});
		
		/* Animation finishes:
			1. clone the $elem to a var
			2. remove active one from the DOM - done
			3. append the cloned version to the ul	-done
			4. reset positions
			
		*/	
		base.startAnimation(o);
	},
		
	pauseAnimation : function() {
	
	}
		
};//End Methods Object

/**********************************************************************************************************************************************************
 * 	INIT PLUGIN																																																															              *
 **********************************************************************************************************************************************************
 *
 *
 *
 *
 *
 *
*/
(function($){
    $.epicSlide = function(el, options){
				
				//Scope resolution
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        
        // Add a reverse reference to the DOM object
        base.$el.data("epicSlide", base);
        
        base.init = function(){
            base.options = $.extend({},$.epicSlide.defaultOptions, options);
            o = base.options;
            
            //Class Manipulation Init.
            $('#' + base.el.id + ' li:first-child').addClass('slide-active');
            $('.slide-active').next().css({'opacity' : '0'});
            
            methods.startAnimation(o);
        };
        
        // Run initializer
        base.init();
    };
    
    $.epicSlide.defaultOptions = {
        'interval': 10000
    };
    
    $.fn.epicSlide = function(options){
        return this.each(function(){
            (new $.epicSlide(this, options));
        });
    };
    
})(jQuery);	

/************************************************************* END ***************************************************************************************/ 
