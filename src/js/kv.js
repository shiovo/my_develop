(function ($) {
  'use strict';
  var brands = [
    {
      link: 'vuitton',
      logo: 'logo_lv',
      alt: 'LOUIS VUITTON',
      kv: 'kv_lv.jpg'
    },
    {
      link: 'gucci',
      logo: 'logo_gucci',
      alt: 'Gucci',
      kv: 'kv_gucci.jpg'
    },
    {
      link: 'chanel',
      logo: 'logo_chanel',
      alt: 'CHANEL',
      kv: 'kv_chanel.jpg'
    },
    {
      link: 'prada',
      logo: 'logo_prada',
      alt: 'PRADA',
      kv: 'kv_prada.jpg'
    },
    {
      link: 'hermes',
      logo: 'logo_hermes',
      alt: 'HERMES',
      kv: 'kv_hermes.jpg'
    }
  ];

  function kvImage(i) {
    return 'images/kv/' + brands[i].kv;
  }

  var currentIndex = brands.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = brands[currentIndex];
    brands[currentIndex] = brands[randomIndex];
    brands[randomIndex] = temporaryValue;
  }

  var brand;
  var i;
  var l = brands.length;
  var tmp;
  for (i=0;i<l;i++) {
    brand = brands[i];
    document.write(
      '<li>'+
          '<a href="'+brand.link+'">'+
              '<img src="images/kv/logo_spacer.png" alt="" class="lu_img-spacer">'+
              '<img src="images/kv/logo_space_over.png" alt="" class="lu_img-spacer is-over">'+
              '<img src="images/kv/'+brand.logo+'.png" alt="'+brand.alt+'" class="lu_img-logo">'+
          '</a>'+
      '</li>'
    );
  }

  var kvPreloads = [];
  for (i=0;i<l;i++) (function (preloadImg, dfd) {
    kvPreloads.push(dfd);
    preloadImg.onload = function () {
      preloadImg.onload = null;
      dfd.resolve();
    };
    preloadImg.src = kvImage(i);
  })(document.createElement('img'), $.Deferred());

  $(function () {

    var switchDelay = 4000 + 500;

    var $kvContainer = $('.lu_js-kv .lu_js-kv-img-container');
    var $kvClickable = $kvContainer.find('.lu_js-kv-img-dummy');
    var $logos = $('.lu_js-kv-logo li');
    var currentIndex;
    var targetIndex;
    var timerId;
    var mouseEnter = false;
    var removeAnim = false;
    var kvIsShowClass = 'lu_js-kv-img-is-show';

    $kvContainer.on('oTransitionEnd mozTransitionEnd webkitTransitionEnd transitionend', function () {
      $(this).removeClass('on-add');
    });

    function startKvSwitch() {
      clearTimeout(timerId);
      timerId = setTimeout(function () {
        kvSwitch((currentIndex + 1) % brands.length);
      }, switchDelay);        
    }

    function stopKvSwitch() {
      clearTimeout(timerId);
    }

    var showTimerId;
    var testDiv = document.createElement('div');
    function kvSwitch(idx) {
      if (currentIndex === idx) {
        return;
      }

      stopKvSwitch();
      currentIndex = idx;

      $kvClickable.attr('href', brands[currentIndex].link);
      $kvContainer
        .find('.lu_js-kv-img:eq('+currentIndex+')').addClass('on-add')
        .siblings('.lu_js-kv-img').removeClass('on on-add');

      clearTimeout(showTimerId);
      showTimerId = setTimeout(function () {
        $kvContainer.find('.lu_js-kv-img.on-add').addClass('on')
        var $removeOn = $logos.filter('.on').removeClass('on');
        var $addOn = $logos.eq(currentIndex).addClass('on');
        if (!('transform' in testDiv.style) && !('WebkitTransform' in testDiv.style)) {
          $removeOn.find('.lu_img-spacer.is-over').css('margin-top', '0');
          $removeOn.find('.lu_img-logo').css('margin-top', '0');
          $addOn.find('.lu_img-spacer.is-over').css('margin-top', '-17px');
          $addOn.find('.lu_img-logo').css('margin-top', '-15px');
        }
      }, 60);

      if (!mouseEnter) {
        startKvSwitch();
      }
    }

    function showKv() {
      currentIndex = targetIndex;

      var $kv = $kvContainer.find('.lu_js-kv-img:eq('+currentIndex+')');
      $kv.css({
        opacity: 0,
        scale: 1.01
      });
      $kv.addClass(kvIsShowClass);

      $kvClickable.attr('href', brands[currentIndex].link);

      $logos.filter('.on').removeClass('on');
      $logos.eq(currentIndex).addClass('on');
      $kv.transition({
        opacity: 1,
        scale: 1,
        delay: 0
      }, 500, 'out', function () {

        if (currentIndex !== targetIndex) {
          kvSwitch(targetIndex);
        }

        if (!mouseEnter) {
          startKvSwitch();
        }
      });
    }

    $.when.apply($, kvPreloads).done(function () {
      var $kv;
      for (var i=0,l=brands.length;i<l;i++) {
        $kv = $('<a href="'+brands[i].link+'" class="lu_js-kv-img"><img src="'+kvImage(i)+'"></a>');
        $kvClickable.before($kv);
      }

      var $brands = $('.lu_js-kv-logo li');

      // hover
      $brands.on('mouseenter', function () {
        mouseEnter = true;
        var idx = $brands.index(this);
        kvSwitch(idx);
      })
      .on('mouseleave', function () {
        mouseEnter = false;
        startKvSwitch();
      });

      // touch
      $brands.on('touchstart', function () {
        if (!$(this).hasClass('on')) {
          kvSwitch($brands.index(this));
          return false;
        }
      });

      setTimeout(function () {
        kvSwitch(0);
      }, 60);
    });

  });
})(window.snm ? snm.$ : $);
