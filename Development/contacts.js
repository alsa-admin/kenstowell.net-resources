/**********************************************************************************************************************************************************
 * GLOBAL VARS/FUNCTIONS																																																																	*
 *********************************************************************************************************************************************************/
var root; //Super global access to the Contacts object.
/**********************************************************************************************************************************************************
 * DOCUMENT READY																																																																					*
 *********************************************************************************************************************************************************/
$(document).ready(function () {

});

/**********************************************************************************************************************************************************
 * WINDOW LOAD																																																																						*
 *********************************************************************************************************************************************************/
$(window).load(function () {
	var cts = new Contacts; //Initialize the Contacts object
	window.CTS = cts; //Grant it all uber window access
	root = window.CTS; //Make it more useable
});


/**********************************************************************************************************************************************************
 *	CONTACTS OBJECT																																																																				*
 **********************************************************************************************************************************************************
 * @author: kstowell
 *
 * @desc: Main scripting object for the contacts view located in /application/views/contact. So far this is only imported in 'list_contacts.php' But is
 *        built for any view dealing with contacts information.
 *
 *
 */
var Contacts = function() {

	//console.logs: '/contacts/*'
	this.uri = window.location.pathname;

	//View object - if ever you add a new view, please create a property for it here.
	// These get cycled through the view-object-loader so they need to be kept current
	// for any page to actually get js loaded with it.
	this.views = {
		_contacts: '/contacts', //Main contacts page - all other views inherit what's in this object
		_all: '/contacts/all', //All contacts
		_bounced: '/contacts/bounced', //Bounced contacts
		_never_emailed: '/contacts/never_emailed', //never emailed contacts
		_deleted: '/contacts/deleted', // deleted contacts
		_search: '/contacts/search', //search contacts
		_results: '/contacts/results' //search results
	};

	//Load objects
	this.objectLoader();

	//Global init - ran no matter what.
	this.init();

}//End constructor

/**
 * CONTACTS OBJECT METHODS
 *
 * @desc: This is the main object house for the Contacts section of the site.
 * 				The methods in here follow a specific tree of: Prototype - >_view,
 * 			  please follow this pattern and the Object loader instructions below.
 */
Contacts.prototype = {
	/**
	 * GLOBAL INIT
	 * @desc: anything that needs to be run no matter what.
	 */
	init: function() {
		var self = this;

	},
	/**
	 * CONTACTS UTILITY OBJECTS
	 * @desc: general house for repetitive utilities such as getting DOM element properties like length, etc
	 */
	utils: {
		getItmLength: function(itm) {
			return itm.length;
		}
	},
	/**
	 *  CONTACTS VIEW OBJECT METHODS
	 *  @desc: Parent view object for all contacts views.
	 *  			 If there's anything you want to only be executed while on '/contacts'
	 *  			 please utilize '_contacts.contactsOnly'
	 */
	_contacts: {
		/**
		 * INIT
		 * @param CTS: base Contacts object
		 */
		init: function(CTS) {
			var self = this;

			//Load /contacts only code
			if(window.location.pathname === CTS.views._contacts) {
				this.contactsOnly();
			}
		},
		/**
		 * CONTACTS ONLY
		 * @desc: code to _only_ be run while on the /contacts view.
		 */
		contactsOnly: function() {

		}
	},
	/**
	 * ALL VIEW OBJECT METHODS
	 */
	_all: {
		/**
		 * INIT
		 * @param CTS: base Contacts object
		 */
		init: function(CTS) {
			$('div.lb_section_utility').hide();

			//Creates a buffer between the search results and the main breadcrumbs
			$('.breadcrumbs').css({'padding-top' : '1%'});
		}
	},
	/**
	 * DELETED VIEW OBJECT METHODS
	 */
	_deleted: {
		/**
		 * INIT
		 * @param CTS: base Contacts object
		 */
		init: function(CTS) {
			var self = this;
			//Hide the /contacts search content
			$('div.lb_section_utility').hide();

			//Creates a buffer between the search results and the main breadcrumbs
			$('.breadcrumbs').css({'padding-top' : '1%'});

			//Start the chain:
			this.bindEvents();
		},
		/**
		 * BIND EVENTS
		 * @desc: general event handler management
		 */
		bindEvents: function() {
			var self = this;

			//Since we're on the deleted contacts page - hide the delete functionality - since this is just a list
			$('.ui-accordion-content-active').live('change',function() {
				$('a.delete_button').hide();
			});
		}
	},
	/**
	 * BOUNCED VIEW OBJECT METHODS
	 */
	_bounced: {
		/**
		 * INIT
		 * @param CTS: base Contacts object
		 */
		init: function(CTS) {
			$('div.lb_section_utility').hide();

			//Creates a buffer between the search results and the main breadcrumbs
			$('.breadcrumbs').css({'padding-top' : '1%'});
		}
	},
	/**
	 *  NEVER-EMAILED VIEW OBJECT METHODS
	 */
	_never_emailed: {
		/**
		 * INIT
		 * @param CTS: base Contacts object
		 */
		init: function() {
			$('div.lb_section_utility').hide();

			//Creates a buffer between the search results and the main breadcrumbs
			$('.breadcrumbs').css({'padding-top' : '1%'});
		}
	},
	/**
	 * SEARCH VIEW OBJECT METHODS
	 */
	_search: {
		/**
		 * INIT
		 * @desc: base contacts view constructor
		 * 				Also inits anything that needs to be from the page load.
		 *
		 * @param CTS: base Contacts object
		 */
		init: function(CTS) {
			var self = this;

			//Constructor properties
			this.asf = $('ul.advanced_search_filters'); //get a copy of the ul in memory w/o any user data in it yet.
			this.advanced_search_filters = this.asf.clone(); //clone said copy so it's _really_ in memory.

			//Check to see if a search is still in memory.
			this.loadForm();

			//Right on page load append the index to each form elements name.
			this.appendIdentifier();

			//Init DOM event handlers
			this.bindEvents();

		},
		/**
		 * BIND EVENTS
		 * @desc: general event handler management
		 */
		bindEvents: function() {
			var self = this;

			//Additional search filters
			$('a.add_filters').live('click', function(e) {
				e.preventDefault();
				var base = this;
				//validation processing
				self.advancedSearchValidation(base);
			});

			//If there's text in the search box when they click on the 'is_blank' cbx, clear the text.
			$('input[type="checkbox"]').live('change', function() {
				//if there's a value in the related search box, clear it.
				if($(this).parent().parent().find('.search').val()) {
					$(this).parent().parent().find('.search').val('');
				}
				//if the user decided the empty field is actually supposed to be empty -> kill the box shadow
				$(this).parent().parent().find('.search').css('box-shadow','none');

				//Add a 'checked' class for ease of unchecked element detection.
				if($(this).is(':checked')) {
					$(this).removeClass('blank');
				} else {
					$(this).addClass('blank');
				}
				//If there aren't any 'blanks' ...
				if(root.utils.getItmLength($('.blank')) > 0) {
					$('.advanced_search_submit').addClass('disabled');
				} else {
					$('.advanced_search_submit').removeClass('disabled');
				}
			});

			//when a user enters a text into the search but the 'is_blank' is checked -> uncheck it
			$('ul.advanced_search_filters .search').live('keyup', function(e) {
				//now do the is_blank test
				if($(this).parent().parent().find('input[type=checkbox]').is(':checked')) {
					// This fixed traversal method is the only way I could get it to work - i think it's because...
					// ...jQuery's .prop() couldn't navigate around all of the text-only child elements.
					// To see what I mean, uncomment the following line:
					// console.log(this.parentElement.parentElement.childNodes);
					// Thus, I had to get super specific w/ parent/child selection.
					this.parentElement.parentElement.childNodes[9].childNodes[0].checked = false;
					//remove the disabled class
					$('.advanced_search_submit').removeClass('disabled');
				} else {
					//if the delete key is not being pressed
					if(e.which != 8) {
						//extra fall back for 'blank' row checking
						$(this).parent().parent().find('input[type=checkbox]').removeClass('blank');
						//if the text field box isn't empty - the second condition should never be false at this point - but just in case.
						if((e.target.value != "") && (root.utils.getItmLength($('.blank')) == 0)){
							//remove the disabled class
							$('.advanced_search_submit').removeClass('disabled');
						}
					} else {
						//if the text field is empty
						if(e.target.value == "") {
							//reapply the 'blank' class
							$(this).parent().parent().find('input[type=checkbox]').addClass('blank');
							//add the disabled class
							$('.advanced_search_submit').addClass('disabled');
						}
					}
				}
			});

			//Search submit button for advanced search
			$('.advanced_search_submit').live('click', function(e) {
				//Check to see if _search.saveForm has finished processing before forwarding to teh results page
				if($('.advanced_search_submit').is('.disabled')) {
					e.preventDefault();
				} else {
					self.saveForm();
				}
			});

			//Clear the search form
			$('a.clear_advanced_search').live('click', function(e) {
				e.preventDefault();
				self.clearForm();
			})
		},
		/**
		 * LOAD FORM
		 * @desc: load form vals from cookies
		 */
		loadForm: function() {
			var self = this;
			var cookies = {}; //object for cookie name consitency
			var and_or_filter_data;// all/any contact filter
			var filter_row_data = {}; // advanced search filter rows
			var and_or_c_name = 'lb2_search_and_or';//prehaps not the prettiest way to do this.
			var filter_c_name = 'lb2_search';//cookie name

			function getCookie(name1, name2) {
				var i,x,y,ARRcookies=document.cookie.split(";");
				//loop through each cookie in the document
				for (i=0;i<ARRcookies.length;i++) {
					//everything before the =
					x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
					//everything after the =
					y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
					//get rid of the space before the name
					x=x.replace(/^\s+|\s+$/g,"");
					//load each one into the local object if it's not lbsession cookie
					if(x != 'lbsession') {
						cookies[x] = y;
					}
				}
				//now loop through the cookies object to check and set values for finer string manipulation
				$.each(cookies, function(key, val) {
					//everything but the and/or dropdown
					if(key != 'lb2_search_and_or') {
						//decode the json objects
						val = JSON.parse(val);
						//now put json-decoded vals into a useable object
						filter_row_data[key] = val;
					} else {
						//lb2 and/any filter - keep seperate from filter row form values
						and_or_filter_data = val;
					}
				});
			}

			//Get/Check for the chookie
			getCookie(and_or_c_name, filter_c_name);

			//build form
			if(filter_row_data.hasOwnProperty('lb2_search_0')) {
				var i,f = self.advanced_search_filters, af = $('a.add_filters');
				//remove disabled flag from search button
				$('.advanced_search_submit').removeClass('disabled');
				//load the any/or filter
				$('select[name=and_or]').children("option[value="+and_or_filter_data+"]").attr('selected', 'seletected');
				//remove existing filter rows - only if f has a value to be extra sure we have the elem in memory at this point.
				if(f) {
					$('ul.advanced_search_filters').remove();
				}

				//loop through each object property
				for(var prop in filter_row_data) {
					//a second clone is needed for non literal duplication
					var cf = f.clone();
					//if the element actually gets inserted
					if($(af).before(cf)) {
						//now loop through each child's elements
						$(cf).children('li').each(function(idx, itm) {
							//this switch is the cleanest way i could come up with since the order of
							//the elements in the cookie is no longer the default order of the form
							//elements - so I take it index by index to perform the custom actions
							switch(idx) {
								case 0:
									$(itm).children('select').children('option[value="'+filter_row_data[prop].field+'"]').attr('selected', 'selected');
									break;
								case 1:
									$(itm).children('select').children('option[value='+filter_row_data[prop].modal_verb+']').attr('selected', 'selected');
									break;
								case 2:
									$(itm).children('select').children('option[value='+filter_row_data[prop].verb+']').attr('selected', 'selected');
									break;
								case 3:
									$(itm).children('input').val(filter_row_data[prop].object);
									break;
								case 4:
									if(filter_row_data[prop].is_blank == true) {
										$(itm).children('input').attr('checked', 'checked');
									};
									break;
							}
						});
					}
				}
			}

			//enable/disable the search button on load based on pre-poulated criteria.

		},
		/**
		 * SAVE FORM
		 * @desc: build the form data into an array to store in a cookie for subsequent searches.
		 */
		saveForm: function() {
			var self = this;

			//Create the cookie
			function createCookie(name, value, days) {
				if(days) {
					var date = new Date();
					date.setTime(date.getTime()+(days*24*60*60*1000));
					var exp = "; expires="+date.toGMTString();
				} else {
					var exp = "";
				}
				document.cookie = name+"="+value+exp+"; path=/";
			}

			// Get/set 'and_or' value to the cookie.
			createCookie('lb2_search_and_or', $('[name="and_or"]').val(), 7);

			//Init filter row loopage
			$('ul.advanced_search_filters').each(function(idx, itm) {
				var base = this;
				var c_name = 'lb2_search_'+idx; // cookie name
				var tmp = {}; //object for each ul's child element
				var is_blank; //bool for cookie fallback processing
				//loop through each child and pus its val to the array
				$(base).children('li').each(function(a, b) {
					if(a == 4) {
						// if it's the last index - determine if it's checked.
						if($(b).children().is(':checked')) {
							tmp[a] = true;
							is_blank = true;
						} else {
							tmp[a] = false;
							is_blank = false;
						}
					} else {
						//push all vals to the object
						tmp[a] = $(b).children().val();
					}
				});

				//build the object in the desired order for the server
				var obj = {
					field: tmp[0],
					modal_verb: tmp[1],
					verb: tmp[2],
					is_blank: tmp[4],
					object: tmp[3]
				};

				//Serialize cookies data
				var data = JSON.stringify(obj);
				//Now we actually create the cookie based on its contents
				if(is_blank == true) {
					//if the filter row is marked as 'is blank' actually create the cookie
					createCookie(c_name, data, 7);
					//if the filter row isn't 'is_blank'...
				} else {
					//...and if there's something in the search field
					if(obj.object != null || obj.object!= undefined) {
						//actually create the cookie
						createCookie(c_name, data, 7);
					}
				}
			});
		},
		/**
		 * CLEAR FORM
		 * @desc: reset the DOM back to the original state and wipe out the previsouly created cookies.
		 */
		clearForm: function() {
			var self = this;

			//delete the and_or cookie
			createCookie('lb2_search_and_or', "", -1);

			//delete the filter row cookies cookies
			$('ul.advanced_search_filters').each(function(idx, itm) {
				var base = this;
				var c_name = 'lb2_search_'+idx;
				//Set the cookie expiry to a negative value - in essence deleting the cookie.
				createCookie(c_name, "", -1);
			});

			//remove all filter rows from the form
			$('form#advanced_search_form ul.advanced_search_filters').remove();
			//append a new, empty one
			$('form#advanced_search_form ul').after(self.advanced_search_filters.clone());
			//disable search button
			$('.advanced_search_submit').addClass('disabled');

			//create cookie method to reset epxiry
			function createCookie(name, value, days) {
				if(days) {
					var date = new Date();
					date.setTime(date.getTime()+(days*24*60*60*1000));
					var exp = "; expires="+date.toGMTString();
				} else {
					var exp = "";
				}
				document.cookie = name+"="+value+exp+"; path=/";
			}
		},
		/**
		 * FADE IN BOX SHADOW
		 * @desc: Animate a box shadow if the search field is empty and they try to add another filter
		 */
		fadeInBoxShadow: function(elem) {
			var self = this;

			$(elem).stop().animate({
					'box-shadow' : '0 0 11px red'
				},
				{
					duration: 200,
					complete: function() {
						self.fadeOutBoxShadow(this);
					},
					queue: true
				}
			);
		},
		/**
		 * FADE OUT BOX SHADOW
		 * @desc: Remove above created shadow once the element has focus
		 */
		fadeOutBoxShadow: function(elem) {
			$(elem).focusin(function() {
					$(this).css('box-shadow', 'none');
				}
			);
		},
		/**
		 * ADVANCED SEARCH VALIDATION
		 * @desc: This function determines whether or not to allow the user to add more search filters
		 * 				through index management and class toggling and an arse load of if statements.
		 */
		advancedSearchValidation: function(base, baseObj) {
			var self = this;
			//set upper bound of 35 filter rows
			if(root.utils.getItmLength($('ul.advanced_search_filters')) < 35) {
				$('ul.advanced_search_filters').each(function(idx, itm) {
						if(!$(itm).find('.search').val()) {
							//if there's no value in .search -> check if the cbx of the same row is checked
							if($(itm).find('input[name="is_blank_'+idx+'"]').is(':checked')) {
								//if it is ^ checked, remove the 'is_empty' flag
								$(itm).find('.search').removeClass('is_empty');
							} else {
								//if not -> add it.
								$(itm).find('.search').addClass('is_empty');
							}
						} else {
							//If there's already a value in there - just remove the class in case it gets skipped in any other part of the
							//process.
							$(itm).find('.search').removeClass('is_empty');
						}
				});

				//If there is one or more 'is_empty's
				if(root.utils.getItmLength($('.is_empty')) >= 1) {
					$('.is_empty').each(function(idx,itm) {
						//if it's the last 'is_empty' of all the ones counted from countItems
						if(idx == root.utils.getItmLength(itm) - 1) {
							//Check if the last one is actually 'checked'
							if($(itm).parent().parent().find('input[name="is_blank"]').is(':checked')) {
								//Now see if there are any others that are still 'empty'
								if(root.utils.getItmLength($('.is_empty')) > 0 ) {
									//if it's the last 'is_empty' and 'is_blank', highlight other 'is_empty's if any.
									self.fadeInBoxShadow($('.is_empty'))
								} else {
									//if it's the last 'is_empty' and 'is_blank' is checked AND there are no other 'is_empty's then add another filter
									$(base).before(self.advanced_search_filters.clone());
									//set the search button to disabled
									$('.advanced_search_submit').addClass('disabled');
								}
							} else {
								//if it's not the last 'is_empty' and the is_blank isn't checked - highlight it.
								self.fadeInBoxShadow(itm);
							}
						} else {
							//fall back to catch any 'is_empty's that are _not_ the last element in the $.each
							self.fadeInBoxShadow(itm);
						}
					});
				} else {
					//if there are no 'is_empty's -> add a new filter row
					$(base).before(self.advanced_search_filters.clone());
					//set the search button to disabled
					$('.advanced_search_submit').addClass('disabled');
				}
			}
			//Apply unique filter names
			self.appendIdentifier();
		},
		/**
		 * APPEND IDENTIFIER
		 * @desc: Used to append the parent UL's index number to the end of each form elements name attribute
		 * 				The only thing bad I can think about this method is it would take quite a bit more processing
		 * 				power if the user were to have a significant amount of filters. I mean - getting the results back
		 * 				from the server would take a decent amount of time anyways - so maybe it's not a big deal.
		 */
		appendIdentifier: function() {
			var self = this;

			$('ul.advanced_search_filters').each(function(idx,itm) {
				$(itm).children('li').each(function() {
					//for each child 'li' get its child element's name attribute
					var name = $(this).children().attr('name');
					//search the string to see if it already contains the index
					var is_unique = name.search('_'+idx);
					//check and see if 'is_unique' returns an index
					if(is_unique > 0 ) {
						//TODO: do something here
					} else {
						//create the uniqe name
						var unique_name = name + '_' + idx;
						//apply it to the DOM
						$(this).children().attr('name', unique_name);
					}
				});
			});
		}
	},
	/**
	 * RESULTS VIEW OBJECT
	 */
	_results: {
		/**
		 * INIT
		 * @param CTS: base Contacts object
		 */
		init: function(CTS) {
			//hides the search form
			$('div.lb_section_utility').hide();

			//Creates a buffer between the search results and the main breadcrumbs
			$('.breadcrumbs').css({'padding-top' : '1%'});
		}
	}
}//End Contacts.prototype

/**
 *  OBJECT LOADER
 *
 *  @desc: This loads the appropriate object methods based on what contacts view is being loaded.
 *  			 This file is going to get too big to just throw everything into one object, so for scalability
 *  			 and maintainability I created a nested object for each view.
 *
 *  @use: <- pretty sure I just made that doc block tag up but whatever.
 *  			To use the Object Loader:
 *  				1: Add the key val pair the in Contacts.views object(approx line 39).
 *  				2: actually create the object in Contacts.prototype as shown below:
 *  						Contacts.prototype
 *  					 		->_view-name
 *  					 			->init
 */
Contacts.prototype.objectLoader = function() {
	var self = this;

	//Iterate through the view object properties and search the pathname to see if it contains it.
	//doing it this way will cause every view to load _contacts as well as its own view-object code.
	//This kind of creates a cool inheritance model - however this might complicate things if we want to have /contacts specific code.
	for (var prop in self.views) {
		if((self.uri.search(self.views[prop])) > -1) {
			self[prop].init(self);//Pass in Contacts as an object.
		}
	}
}//End Object Loader

/************************************************************* END CONTACTS OBJECT ***********************************************************************/

