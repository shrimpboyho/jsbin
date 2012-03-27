//= require "errors"
//= require "download"
//= require "tips"

var debug = jsbin.settings.debug === undefined ? false : jsbin.settings.debug,
    documentTitle = null, // null = JS Bin
    $bin = $('#bin'),
    loadGist,
    $document = $(document),
    // splitterSettings = JSON.parse(localStorage.getItem('splitterSettings') || '[ { "x" : null }, { "x" : null } ]'),
    unload = function () {
      // sessionStorage.setItem('javascript', editors.javascript.getCode());
      // sessionStorage.setItem('html', editors.html.getCode());
      sessionStorage.setItem('url', template.url);
      localStorage.setItem('settings', JSON.stringify(jsbin.settings));

      if (jsbin.panels.saveOnExit) jsbin.panels.save();
      jsbin.panels.savecontent();

      var panel = getFocusedPanel();
      sessionStorage.setItem('panel', panel);
      try { // this causes errors in IE9 - so we'll use a try/catch to get through it
        sessionStorage.setItem('line', editors[panel].getCursor().line);
        sessionStorage.setItem('character', editors[panel].getCursor().ch);
      } catch (e) {
        sessionStorage.setItem('line', 0);
        sessionStorage.setItem('character', 0);
      }
    };

//= require "storage"
//= require "navigation"
//= require "save"
//= require "file-drop"

$(window).unload(unload);

// hack for Opera because the unload event isn't firing to capture the settings, so we put it on a timer
if ($.browser.opera) {
  setInterval(unload, 500);
}

$('#library').chosen();

$document.one('jsbinReady', function () {
  // for (panel in jsbin.settings.show) {
  //   if (jsbin.settings.show[panel]) {
  //     $('#panelsvisible').find('value=[' + panel + ']').attr('selected', 'selected').trigger("liszt:updated")
  //     // $('#show' + panel).addClass('selected');
  //   } else {
  //     // $('#show' + panel);
  //   }
  // }
  
  // var $sp1 = $('.code.html').splitter().data('splitter');
  // var $sp2 = $live.splitter().data('splitter');
  
  // updatePanel('html', jsbin.settings.show.html);
  // updatePanel('javascript', jsbin.settings.show.javascript);
  // updatePanel('live', jsbin.settings.show.live);

  // $sp1.filter(':visible').trigger('init', (splitterSettings[0] || {x:null}).x);
  // $sp2.filter(':visible').trigger('init', (splitterSettings[1] || {x:null}).x);
  $bin.removeAttr('style').addClass('ready');
});

// if a gist has been requested, lazy load the gist library and plug it in
if (/gist\/\d+/.test(window.location.pathname) && (!sessionStorage.getItem('javascript') && !sessionStorage.getItem('html'))) {
  window.editors = editors; // needs to be global when the callback triggers to set the content
  loadGist = function () {
    $.getScript('/js/chrome/gist.js', function () {
      window.gist = new Gist(window.location.pathname.replace(/.*?(\d+).*/, "$1"));
    });
  };
  
  if (editors.ready) {
    loadGist();
  } else {
    editors.onReady = loadGist;
  }
}

window.CodeMirror = CodeMirror; // fix to allow code mirror to break naturally

// $(window).bind('online', function () {
//   console.log("we're online");
// }).bind('offline', function () {
//   console.log("we're offline");
// });

