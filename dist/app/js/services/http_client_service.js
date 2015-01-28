define(["exports", "fxos-mvc/dist/mvc", "app/js/services/apps_service", "app/js/services/http_service"], function (exports, _fxosMvcDistMvc, _appJsServicesAppsService, _appJsServicesHttpService) {
  "use strict";

  var _classProps = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var _extends = function (child, parent) {
    child.prototype = Object.create(parent.prototype, {
      constructor: {
        value: child,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    child.__proto__ = parent;
  };

  var Service = _fxosMvcDistMvc.Service;
  var AppsService = _appJsServicesAppsService["default"];
  var HttpService = _appJsServicesHttpService["default"];


  var singletonGuard = {};
  var instance;

  var HttpClientService = (function (Service) {
    var HttpClientService = function HttpClientService(guard) {
      if (guard !== singletonGuard) {
        console.error("Cannot create singleton class");
        return;
      }

      Service.call(this);
    };

    _extends(HttpClientService, Service);

    HttpClientService.prototype.downloadApp = function (url) {
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest({ mozAnon: true, mozSystem: true });
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              AppsService.instance.installAppBlob(xhr.response).then(resolve, reject);
            } else {
              reject({ name: "HTTP error", message: xhr.status });
            }
          }
        };
        xhr.send();
      });
    };

    HttpClientService.prototype.requestPeerInfo = function (address) {
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest({ mozAnon: true, mozSystem: true });
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            var peer = JSON.parse(xhr.responseText);
            resolve(peer);
          }
        };
        xhr.open("GET", HttpService.instance.getPeerUrl(address));
        xhr.send();
      });
    };

    _classProps(HttpClientService, {
      instance: {
        get: function () {
          if (!instance) {
            instance = new this(singletonGuard);
          }
          return instance;
        }
      }
    });

    return HttpClientService;
  })(Service);

  exports["default"] = HttpClientService;
});