'use strict';

var $           = require('jquery');
var queryString = require('query-string');

var getNewParam = function(param, btn) {
  var type = $(btn).attr('data-media');
  switch (type) {
    case 'desktop':
      param.desktop_view = 1;
      param.wap_view     = 0;
      break;
    case 'mobile':
      param.desktop_view = 0;
      param.wap_view     = 0;
      break;
    case 'wap':
      param.desktop_view = 0;
      param.wap_view     = 1;
      break;
    default:
      param.desktop_view = 1;
      param.wap_view     = 0;
      break;
  }

  return param;
}

var getNewOrigin = function(url, btn) {
  var type = $(btn).attr('data-media');
  var arr      = url.split('://');
  var protocol = arr[0];
  var host     = arr[1].split('.');

  switch (type) {
    case 'desktop':
      host[0] = 'www';
      break;
    case 'mobile':
      host[0] = 'm';
      break;
    case 'wap':
      host[0] = 'm';
      break;
    default:
      host[0] = 'www';
      break;
  }

  return protocol + '://' + host.join('.');
}

var senkaimonGate = function(tabs) {

  var url = tabs[0].url;

  var searchString = null;
  var param = null;
  var newUrl = null;

  var paramString = url.split('?');

  if (paramString.length > 1) {
    searchString = paramString[1].split('#');
  } else if (paramString.length > 0) {
    searchString = paramString[0];
  }

  if (searchString && typeof searchString == 'object') {
    param = queryString.parse(searchString[0]);
    param = getNewParam(param, this);
  } else if (searchString && typeof searchString == 'string') {
    param = getNewParam({}, this);
  }

  if (param) {
    newUrl = getNewOrigin(paramString[0], this) + '?' + queryString.stringify(param);
    chrome.tabs.update(tabs[0].id, {url: newUrl});
  }

  window.close();
}

$(".senkaimon-btn-go").on('click', function(e) {
  var $this      = $(this);

  chrome.tabs.query(
    {active: true, windowId: chrome.windows.WINDOW_ID_CURRENT},
    senkaimonGate.bind(this)
  );
});