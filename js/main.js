/*global $, jQuery, alert*/
$(document).ready(function() {

  'use strict';

  // ========================================================================= //
  //  //SMOOTH SCROLL
  // ========================================================================= //


  $(document).on("scroll", onScroll);

  $('a[href^="#"]').on('click', function(e) {
    e.preventDefault();
    $(document).off("scroll");

    $('a').each(function() {
      $(this).removeClass('active');
      if ($(window).width() < 768) {
        $('.nav-menu').slideUp();
      }
    });

    $(this).addClass('active');

    var target = this.hash,
        menu = target;

    target = $(target);
    $('html, body').stop().animate({
      'scrollTop': target.offset().top - 80
    }, 500, 'swing', function() {
      window.location.hash = target.selector;
      $(document).on("scroll", onScroll);
    });
  });


  function onScroll(event) {
    if ($('.home').length) {
      var scrollPos = $(document).scrollTop();
      $('nav ul li a').each(function() {
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
      });
    }
  }

  // ========================================================================= //
  //  //NAVBAR SHOW - HIDE
  // ========================================================================= //


  $(window).scroll(function() {
    var scroll = $(window).scrollTop();

    // Check if the element has the 'blog-nav' class
    if ($("#main-nav").hasClass('blog-nav') || $("#main-nav-subpage").hasClass('blog-nav')) {
      // If it has 'blog-nav', just show it and return early
      $("#main-nav, #main-nav-subpage").show();
      $("#main-nav-subpage").removeClass('subpage-nav');
      return; // Exit the function, so no further hiding/showing happens
    }

    if (scroll > 50 ) {
      $("#main-nav, #main-nav-subpage").slideDown(700);
      $("#main-nav-subpage").removeClass('subpage-nav');
    } else {
      $("#main-nav").slideUp(700);
      $("#main-nav-subpage").hide();
      $("#main-nav-subpage").addClass('subpage-nav');
    }
  });

  // ========================================================================= //
  //  // RESPONSIVE MENU
  // ========================================================================= //

  $('.responsive').on('click', function(e) {
    $('.nav-menu').slideToggle();
  });

  // ========================================================================= //
  //  Typed Js
  // ========================================================================= //

  // var typed = $(".typed");

  $(function() {
    if (!$('.typed').length) {
      return;
    }
    var typed = new Typed('.typed', {
      strings: ["Engineer.", "Leader.", "Creator.", "Analyst.", "Problem Solver.", "Joshua O'Callaghan"],
      typeSpeed: 100,
      backSpeed: 50,
      loop: false,
      onComplete: (self) => {
        $('.typed-cursor').hide(); // Hide the cursor when typing finishes
      }
    });
  });


  // ========================================================================= //
  //  Owl Carousel Services
  // ========================================================================= //


  if ($('.services-carousel').length) {
    $('.services-carousel').owlCarousel({
      autoplay: true,
      loop: true,
      margin: 20,
      dots: true,
      nav: false,
      responsiveClass: true,
      responsive: { 0: { items: 1 }, 768: { items: 2 }, 900: { items: 4 } }
    });
  }

  // ========================================================================= //
  //  magnificPopup
  // ========================================================================= //

  var magnifPopup = function() {
    $('.popup-img').magnificPopup({
      type: 'image',
      removalDelay: 300,
      mainClass: 'mfp-with-zoom',
      gallery: {
        enabled: true
      },
      zoom: {
        enabled: true, // By default it's false, so don't forget to enable it

        duration: 300, // duration of the effect, in milliseconds
        easing: 'ease-in-out', // CSS transition easing function

        // The "opener" function should return the element from which popup will be zoomed in
        // and to which popup will be scaled down
        // By defailt it looks for an image tag:
        opener: function(openerElement) {
          // openerElement is the element on which popup was initialized, in this case its <a> tag
          // you don't need to add "opener" option if this code matches your needs, it's defailt one.
          return openerElement.is('img') ? openerElement : openerElement.find('img');
        }
      }
    });
  };


  if ($('.popup-img').length) {
    magnifPopup();
  }

// ========================================================================= //
//  Timeline
// ========================================================================= //

  if (typeof Swiper !== "undefined" && document.querySelector(".swiper")) {
    var mySwiper = new Swiper(".swiper", {
      autoHeight: true,
      autoplay: {
        delay: 10000,
        disableOnInteraction: false
      },
      speed: 500,
      direction: "horizontal",
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
      pagination: {
        el: ".swiper-pagination",
        type: "progressbar"
      },
      loop: false,
      effect: "slide",
      spaceBetween: 30,
      on: {
        init: function () {
          $(".swiper-pagination-custom .swiper-pagination-switch").removeClass("active");
          $(".swiper-pagination-custom .swiper-pagination-switch").eq(0).addClass("active");
        },
        slideChangeTransitionStart: function () {
          $(".swiper-pagination-custom .swiper-pagination-switch").removeClass("active");
          $(".swiper-pagination-custom .swiper-pagination-switch").eq(mySwiper.realIndex).addClass("active");
        }
      }
    });
    $(".swiper-pagination-custom .swiper-pagination-switch").click(function () {
      mySwiper.slideTo($(this).index());
      $(".swiper-pagination-custom .swiper-pagination-switch").removeClass("active");
      $(this).addClass("active");
    });
  }

});

// ========================================================================= //
//  Porfolio isotope and filter
// ========================================================================= //
$(window).load(function(){

  if (!$('.portfolio-container').length) {
    return;
  }
  var portfolioIsotope = $('.portfolio-container').isotope({
    itemSelector: '.portfolio-thumbnail',
    layoutMode: 'fitRows'
  });

  $('#portfolio-flters li').on( 'click', function() {
    $("#portfolio-flters li").removeClass('filter-active');
    $(this).addClass('filter-active');

    portfolioIsotope.isotope({ filter: $(this).data('filter') });
  });

})

// ========================================================================= //
//  Arrow
// ========================================================================= //

document.addEventListener("DOMContentLoaded", function () {
  let arrow = document.querySelector('.arrow');
  if (!arrow) {
    return;
  }
  let timeout;

  // Function to show the arrow
  function showArrow() {
    arrow.classList.add('visible');
  }

  // Function to hide the arrow
  function hideArrow() {
    arrow.classList.remove('visible');
    if (timeout) clearTimeout(timeout); // Clear any pending timeouts
  }

  // Check if the page is at the top and no scrolling happened
  function checkForArrowDisplay() {
    if (window.scrollY === 0) {
      timeout = setTimeout(showArrow, 3000); // Show arrow after 3 seconds
    }
  }

  // Event listener for scrolling
  window.addEventListener('scroll', function () {
    if (window.scrollY > 0) {
      hideArrow(); // Hide arrow when scrolling
    } else {
      checkForArrowDisplay(); // Check to display arrow when at the top
    }
  });

  // Initial check when the page loads
  checkForArrowDisplay();
});

document.addEventListener("DOMContentLoaded", function() {
  const resumeLink = document.querySelector(".list-social li:nth-child(3) a");
  if (resumeLink) {
    resumeLink.classList.add("blink-effect");
  }
});
