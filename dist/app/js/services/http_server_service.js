define(["exports", "fxos-web-server/dist/fxos-web-server", "fxos-mvc/dist/mvc", "app/js/services/apps_service", "app/js/services/device_name_service"], function (exports, _fxosWebServerDistFxosWebServer, _fxosMvcDistMvc, _appJsServicesAppsService, _appJsServicesDeviceNameService) {
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
  var DeviceNameService = _appJsServicesDeviceNameService["default"];


  var singletonGuard = {};
  var instance;

  var HttpServerService = (function (Service) {
    var HttpServerService = function HttpServerService(guard) {
      var _this = this;
      if (guard !== singletonGuard) {
        console.error("Cannot create singleton class");
        return;
      }

      Service.call(this);

      window.addEventListener("beforeunload", this.deactivate.bind(this));

      DeviceNameService.instance.addEventListener("devicenamechange", function (e) {
        _this._deviceName = e.deviceName;
      }, true);
    };

    _extends(HttpServerService, Service);

    HttpServerService.prototype.activate = function () {
      var _this2 = this;
      if (this.httpServer) {
        return;
      }

      this.httpServer = new HTTPServer(8080);
      this.httpServer.addEventListener("request", function (evt) {
        var response = evt.response;
        var request = evt.request;

        var path = request.path;
        var appName = request.params.app;
        AppsService.instance.getInstalledAppsAndAddons().then(function (appsAndAddons) {
          if (path !== "/") {
            appsAndAddons.forEach(function (app) {
              if (app.manifest.name === appName) {
                // The client is requesting a manifest for an app. This is used
                // for displaying a description and other info.
                if (path === "/manifest.webapp") {
                  response.headers["Content-Type"] = "application/x-web-app-manifest+json";
                  var manifest = app.manifest;
                  response.send(JSON.stringify(manifest));

                  // The client is requesting an app binary.
                } else if (path === "/download") {
                  app["export"]().then(function (blob) {
                    response.headers["Content-Type"] = blob.type;
                    response.sendFile(blob);
                  });
                }
              }
            });
            // The client is requesting a list of all apps.
          } else {
            AppsService.instance.getInstalledApps().then(function (apps) {
              AppsService.instance.getInstalledAddons().then(function (addons) {
                response.send(JSON.stringify({
                  name: _this2._deviceName,
                  apps: AppsService.instance.pretty(apps),
                  addons: AppsService.instance.pretty(addons)
                }));
              });
            });
          }
        });
      });
      this.httpServer.start();
    };

    HttpServerService.prototype.deactivate = function () {
      if (!this.httpServer) {
        return;
      }

      this.httpServer.stop();
      this.httpServer = null;
    };

    _classProps(HttpServerService, {
      instance: {
        get: function () {
          if (!instance) {
            instance = new this(singletonGuard);
          }
          return instance;
        }
      }
    });

    return HttpServerService;
  })(Service);

  exports["default"] = HttpServerService;
});