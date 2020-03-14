(function() {
	'use strict';

	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
			BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
			iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
			Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
			Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
			any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	var owlCarousel = function(){

		var owl = jQuery('.owl-carousel-carousel');
		owl.owlCarousel({
			items: 3,
			loop: true,
			margin: 20,
			nav: true,
			dots: true,
			smartSpeed: 800,
			autoHeight: true,
			navText: [
		      "<i class='icon-keyboard_arrow_left owl-direction'></i>",
		      "<i class='icon-keyboard_arrow_right owl-direction'></i>"
	     	],
	     	responsive:{
	        0:{
	            items:1
	        },
	        600:{
	            items:2
	        },
	        1000:{
	            items:3
	        }
	    	}
		});

		var owl = jQuery('.owl-carousel-fullwidth');
		owl.owlCarousel({
			items: 1,
			loop: true,
			margin: 20,
			nav: false,
			dots: true,
			smartSpeed: 800,
			autoHeight: true,
			autoplay: true,
			navText: [
		      "<i class='icon-keyboard_arrow_left owl-direction'></i>",
		      "<i class='icon-keyboard_arrow_right owl-direction'></i>"
	     	]
		});

		var owl = jQuery('.owl-work');
		owl.owlCarousel({
			stagePadding: 150,
			loop: true,
			margin: 20,
			nav: true,
			dots: false,
			mouseDrag: false,
			autoWidth: true,
			autoHeight: true,
	    autoplay: true,
	    autoplayTimeout:2000,
	    autoplayHoverPause:true,
			navText: [	
				"<i class='icon-chevron-thin-left'></i>",
				"<i class='icon-chevron-thin-right'></i>"
			],
			responsive:{
			  0:{
		      items:1,
		      stagePadding: 10
			  },
			  500:{
			  	items:2,
		      stagePadding: 20
			  },
			  600:{
		      items:2,
		      stagePadding: 40
			  },
			  800: {
			  	items:2,
			  	stagePadding: 100
			  },
			  1100:{
		      items:3
			  },
			  1400:{
		      items:4
			  },
			}
		});
	};

	var flexSlider = function() {
	  jQuery('.flexslider').flexslider({
	    animation: "fade",
	    prevText: "",
	    nextText: "",
	    slideshow: true
	  });
	}

	var contentWayPoint = function() {
		var i = 0;
		jQuery('.Jefferson-animate').waypoint( function( direction ) {

			if( direction === 'down' && !jQuery(this.element).hasClass('Jefferson-animated') ) {
				
				i++;

				jQuery(this.element).addClass('item-animate');
				setTimeout(function(){

					jQuery('body .Jefferson-animate.item-animate').each(function(k){
						var el = jQuery(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn Jefferson-animated');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft Jefferson-animated');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight Jefferson-animated');
							} else {
								el.addClass('fadeInUp Jefferson-animated');
							}
							el.removeClass('item-animate');
						},  k * 30, 'easeInOutExpo' );
					});
					
				}, 100);
				
			}

		} , { offset: '95%' } );
	};

	var navbarState = function() {

		jQuery(window).scroll(function(){

			var $this = jQuery(this),
				 	st = $this.scrollTop();

			if ( st > 5 ) {
				jQuery('.Jefferson-navbar').addClass('scrolled');
			} else {
				jQuery('.Jefferson-navbar').removeClass('scrolled');
			}

		});
	};

	
	var initPhotoSwipeFromDOM = function(gallerySelector) {

    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for(var i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i];

            if(figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.children[0]; // <a> element
            console.log(figureEl);
            size = linkEl.getAttribute('data-size').split('x');

            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            if(figureEl.children.length > 1) {
                item.title = figureEl.children[1].innerHTML; 
            }

            if(linkEl.children.length > 0) {
                item.msrc = linkEl.children[0].getAttribute('src');
            } 

            item.el = figureEl;
            items.push(item);
        }

        return items;
    };

    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if(!clickedListItem) {
            return;
        }

        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) { 
                continue; 
            }

            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if(index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
        params = {};

        if(hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');  
            if(pair.length < 2) {
                continue;
            }           
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
		  var pswpElement = document.querySelectorAll('.pswp')[0],
		      gallery,
		      options,
		      items;

		  items = parseThumbnailElements(galleryElement);


		  options = {

		      galleryUID: galleryElement.getAttribute('data-pswp-uid'),

		      getThumbBoundsFn: function(index) {
		          // See Options -> getThumbBoundsFn section of documentation for more info
		          var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
		              pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
		              rect = thumbnail.getBoundingClientRect(); 

		          return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
		      }

		  };


		  if(fromURL) {
		      if(options.galleryPIDs) {
		          for(var j = 0; j < items.length; j++) {
		              if(items[j].pid == index) {
		                  options.index = j;
		                  break;
		              }
		          }
		      } else {

		          options.index = parseInt(index, 10) - 1;
		      }
		  } else {
		      options.index = parseInt(index, 10);
		  }

		  if( isNaN(options.index) ) {
		      return;
		  }

		  if(disableAnimation) {
		      options.showAnimationDuration = 0;
		  }

		  gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
		  gallery.init();
		};

		var galleryElements = document.querySelectorAll( gallerySelector );

		for(var i = 0, l = galleryElements.length; i < l; i++) {
		  galleryElements[i].setAttribute('data-pswp-uid', i+1);
		  galleryElements[i].onclick = onThumbnailsClick;
		}

		var hashData = photoswipeParseHash();
		if(hashData.pid && hashData.gid) {
		  openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
		}
	};

	var galleryMasonry = function() {
		// isotope 
		if (jQuery('.portfolio-feed').length > 0 ) {
			var $container = $('.portfolio-feed');
			$container.imagesLoaded(function() {
				$container.isotope({
				  itemSelector: '.grid-item',
				  percentPosition: true,
				  masonry: {
				    columnWidth: '.grid-sizer',
				    gutter: '.gutter-sizer'
				  }
				});
			});
		}

	};

	var stellarInit = function() {
		if( !isMobile.any() ) {
			jQuery(window).stellar();
		}
	};



	// Page Nav
	var clickMenu = function() {

		jQuery('.navbar-nav a:not([class="external"])').click(function(event){

			var section = jQuery(this).data('nav-section'),
				navbar = jQuery('.navbar-nav');
				if (isMobile.any()) {
					jQuery('.navbar-toggle').click();
				}
				if ( jQuery('[data-section="' + section + '"]').length ) {
			    	jQuery('html, body').animate({
			        	scrollTop: jQuery('[data-section="' + section + '"]').offset().top - 55
			    	}, 500, 'easeInOutExpo');
			   }

		    event.preventDefault();
		    return false;
		});


	};

	// Reflect scrolling in navigation
	var navActive = function(section) {

		var $el = jQuery('.navbar-nav');
		$el.find('li').removeClass('active');
		$el.each(function(){
			jQuery(this).find('a[data-nav-section="'+section+'"]').closest('li').addClass('active');
		});

	};

	var navigationSection = function() {

		var $section = jQuery('section[data-section]');
		
		$section.waypoint(function(direction) {
		  	if (direction === 'down') {
		    	navActive(jQuery(this.element).data('section'));
		  	}
		}, {
	  		offset: '150px'
		});

		$section.waypoint(function(direction) {
		  	if (direction === 'up') {
		    	navActive(jQuery(this.element).data('section'));
		  	}
		}, {
		  	offset: function() { return -jQuery(this.element).height() - 155; }
		});

	};

	jQuery(function(){
		contentWayPoint();
		navbarState();
		if (jQuery('.Jefferson-gallery').length > 0) {
			initPhotoSwipeFromDOM('.Jefferson-gallery');
		}
		galleryMasonry();
		stellarInit();
		dateTimePicker();
		clickMenu();
		navigationSection();
	});

	jQuery(window).load(function(){
		owlCarousel();
		flexSlider();
	});

})();