(function ($) {
  'use strict';

  var IS_SP = !!(navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0);

  var CLASS_STICKY = 'lu_sticky';
  var CLASS_FIXED  = 'lu_fixed';
  var CLASS_FIX_BOTTOM = 'lu_fix-bottom';

  $(function () {

    var isIE = (function () {
      var ua = window.navigator.userAgent.toLowerCase();
      return !!( ua.match(/(msie|MSIE)/) || ua.match(/(T|t)rident/) );
    })();

    var canUseSticky = (function () {
      // SPはoverflow:hidden;の影響で使えない
      if (IS_SP) {
        return false;
      }

      var testDiv = document.createElement('div');
      try {
        testDiv.style.position = 'sticky';
        if (testDiv.style.position === 'sticky') {
          return true;
        }
        testDiv.style.position = '-webkit-sticky';
        if (testDiv.style.position === '-webkit-sticky') {
          return true;
        }
      }
      catch (e) {}

      return false;
    })();

    //canUseSticky = false;
    //isIE = true;

    var $side    = $('#lu_side');
    var $container = $('.lu_brand-cotents');

    var containerTop;
    var containerHeight;
    var sideMaxTop;
    var st;

    function updatePositionData() {
      containerTop = $container.offset().top;
      containerHeight = $container.outerHeight() + 1;
      sideMaxTop = containerTop + containerHeight - $side.outerHeight();
      st = $(window).scrollTop();
    }

    function _updatePosition() {
      $side.toggleClass(CLASS_FIXED, st > containerTop && st < sideMaxTop);
      $side.toggleClass(CLASS_FIX_BOTTOM, st >= sideMaxTop)
    }

    var isHideAnim = false;
    var ieShowTimerID;
    function _updatePositionIE() {
      if (isHideAnim) {
        return;
      }

      // fixed <-> fix-bottomの切り替えは即時実行
      if (st >= sideMaxTop) {
        if (!$side.hasClass(CLASS_FIX_BOTTOM)) {
          $side.css('top', 'auto');
          $side.addClass(CLASS_FIX_BOTTOM).removeClass(CLASS_FIXED);
        }
        return;
      }
      else if (_isFixedIE()) {
        if ($side.hasClass(CLASS_FIX_BOTTOM)) {
          $side.css('top', 0);
          $side.addClass(CLASS_FIXED).removeClass(CLASS_FIX_BOTTOM);
          return;
        }
      }

      // 状態の変更が無い場合は終了
      if (_isFixedIE() === $side.hasClass(CLASS_FIXED)) {
        return;
      }


      // $side.css('top', $side.hasClass('fixed') ? Math.max(0, st - containerTop) : containerTop - st);
      // $side.toggleClass('fixed', _isFixedIE());
      // $side.stop(true, false).animate({top: 0}, 500);
      // return;


      // ↑へのスクロール時のfixed解除は即時実行
      if (!_isFixedIE() && $side.hasClass(CLASS_FIXED)) {
        $side.removeClass(CLASS_FIXED);
        //return;
      }

      isHideAnim = true;

      $side.stop(true, false).animate({opacity: 0}, 300, function () {
        isHideAnim = false;
        updatePositionData();

        $side.toggleClass(CLASS_FIXED, _isFixedIE());

        clearTimeout(ieShowTimerID);
        ieShowTimerID = setTimeout(function () {
          $side.animate({opacity: 1}, 700);
        }, 300);
        
      });
    }

    function _calcTargetTop() {
      return Math.min(sideMaxTop - containerTop, Math.max(0, st - containerTop));
    }

    function _isFixedIE(t) {
      return st > containerTop + 100;
    }

    function updatePosition() {
      updatePositionData();
      if (isIE) {
        _updatePositionIE();
      }
      else {
        _updatePosition();
      }
    }

    var timerId;
    function delayUpdatePosition() {
      clearTimeout(timerId);
      timerId = setTimeout(updatePosition, 100);
    }
    
    if (canUseSticky) {
      $side.addClass(CLASS_STICKY);
      return;
    }

    if (isIE) {
      updatePosition();
      $(window)
        .scroll(updatePosition)
        .resize(updatePosition)
        .resize();    
    }
    else {
      $(window)
        .scroll(updatePosition)
        .resize(updatePosition)
        .resize();    
    }

    // 一定時間初期化処理
    var _initTime = 15000;
    var _now = (new Date()).getTime();
    var _intervalId = setInterval(function () {
      updatePosition();
      if (_now + _initTime < (new Date()).getTime()) {
        clearInterval(_intervalId);
      }
    }, 300);

  });

})(window.snm ? snm.$ : $);
