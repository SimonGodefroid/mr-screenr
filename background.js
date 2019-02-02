var screenshot = {
  content: document.createElement("canvas"),
  // height: document.body.clientHeight,
  // width: document.body.clientWidth,
  data: '',
  init: function () {
    this.initEvents();
  },

  // var viewport = document.querySelector("meta[name=viewport]");
  // viewport.setAttribute('content', ANY_VALUE_YOU_WANT);

  // doResizing: function (increaseWith) {
  //   if ($('#xxxx').length == 0) {
  //     $('body').css('margin', 0).css('padding', 0);
  //     $('body > *').wrapAll('<iframe id="xxxx" src="' + window.Location + '" /></iframe>');
  //     $('#xxxx').css('background-color', 'red').css('overflow', 'scroll').css('padding', 0).css('margin', 0).css('position', 'absolute').width('100%');
  //   }
  //   $('#xxxx').height(parseInt($(window).height()) + 'px').width(parseInt($('#xxxx').width()) + increaseWith + 'px');
  // },

  saveScreenshot: function (setting) {
    var image = new Image();
    image.onload = function () {
      var canvas = screenshot.content;
      canvas.width = image.width;
      canvas.height = image.height;
      var context = canvas.getContext("2d");
      context.drawImage(image, 0, 0);

      // save the image
      var link = document.createElement('a');
      link.download = canvas.width + 'by' + canvas.height + "screenshot-" + new Date().toLocaleDateString() +
        ".png";
      link.href = screenshot.content.toDataURL();
      link.click();
      screenshot.data = '';
    };
    image.src = screenshot.data;
  },

  initEvents: function () {
    chrome.browserAction.onClicked.addListener(function (tab) {
      chrome.windows.getCurrent(function (win) {
        var maxWidth = window.screen.availWidth;
        var maxHeight = window.screen.availHeight;
        var currentHeight = win.height;
        var currentWidth = win.width;
        var setting = {
          height: maxHeight,
          width: maxWidth
        };
        chrome.windows.update(win.id, {
          height: setting.height,
          width: setting.width,
        }, function (win) {
          // alert('we resized')
          chrome.tabs.captureVisibleTab(null, {
            format: "png",
            quality: 100,
          }, function (data) {
            screenshot.data = data;
            // send an alert message to webpage
            chrome.tabs.query({
              active: true,
              currentWindow: true
            }, function (tabs) {
              screenshot.saveScreenshot(setting);
              chrome.windows.update(win.id, {
                height: currentHeight,
                width: currentWidth
              })
            });
          });
        })
      });
    });
  }
};

screenshot.init();
