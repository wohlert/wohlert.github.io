(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function( root, jQuery ) {
            if ( jQuery === undefined ) {
                // require('jQuery') returns a factory that requires window to
                // build a jQuery instance, we normalize how we use modules
                // that require this pattern but the window provided is a noop
                // if it's defined (how jquery works)
                if ( typeof window !== 'undefined' ) {
                    jQuery = require('jquery');
                }
                else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    $.fn.marginotes = function () {
      $('body').append('<div class="margintooltip" style="display: inline;"></div>')

      this.hover(function (e) {
        var hash = this.hash.split('#')[1]
        var element = document.getElementById(hash);
        var description = element.getElementsByTagName('p')[0].innerHTML

        var parent = $(this.parentElement)
        var position = parent.position()
        var tooltip = $('.margintooltip')
        var article = $('article')

        var minWidth = 200
        if (article.position().left < minWidth) {
          return
        }

        var offset = 88
        var width = Math.min(300, article.position().left - offset - 20)

        tooltip
          .css({
            'border-right': 'solid 2px #9E579D',
            'font-size': '11px',
            'left': article.position().left - width - offset,
            'min-height': parent.height(),
            'padding-right': '6px',
            'position': 'absolute',
            'text-align': 'right',
            'top': position.top,
            'width': width
          })
          .html(description)
          .stop()
          .fadeIn({
            duration: 100,
            queue: false
          })
      }, function () {
        $('.margintooltip').stop()
        $('.margintooltip').delay(4000).fadeOut({
          duration: 500,
        })
      })
    }
}));
$(".footnote").marginotes()
$(".collapser").click(function(){
  $(".collapse").toggleClass("show");
});