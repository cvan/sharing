define(["exports", "dns-sd.js/dist/dns-sd", "fxos-mvc/dist/mvc", "app/js/services/http_server_service", "app/js/services/http_client_service"], function (exports, _dnsSdJsDistDnsSd, _fxosMvcDistMvc, _appJsServicesHttpServerService, _appJsServicesHttpClientService) {
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
  var HttpServerService = _appJsServicesHttpServerService["default"];
  var HttpClientService = _appJsServicesHttpClientService["default"];


  // Enable this if you want the device to pretend that it's connected to another
  // device and request its own apps.
  window.TEST_MODE = true;

  var singletonGuard = {};
  var instance;

  var P2pService = (function (Service) {
    var P2pService = function P2pService(guard) {
      var _this = this;
      if (guard !== singletonGuard) {
        console.error("Cannot create singleton class");
        return;
      }

      if (window.TEST_MODE) {
        window.p2p = this;
      }

      Service.call(this);

      this._initialized = new Promise(function (resolve, reject) {
        navigator.mozSettings.addObserver("lightsaber.p2p_broadcast", function (e) {
          _this._broadcastLoaded(e.settingValue);
        });

        var broadcastSetting = navigator.mozSettings.createLock().get("lightsaber.p2p_broadcast", false);

        broadcastSetting.onsuccess = function () {
          _this._broadcastLoaded(broadcastSetting.result["lightsaber.p2p_broadcast"]);
          resolve();
        };

        broadcastSetting.onerror = function () {
          console.error("error getting `lightsaber.p2p_broadcast` setting");
          reject();
        };
      });

      this._proximityApps = [];
      this._proximityAddons = [];
      this._proximityThemes = [];

      /*
      setTimeout(() => {
        this._updatePeerInfo('127.0.0.1', {name: 'localhost', apps: [
          {manifest: {name: 'Sharing', description: 'doo'}, owner: 'Doug'},
          {manifest: {name: 'HelloWorld', description: 'too'}, owner: 'Ham'},
          {manifest: {name: 'Rail Rush', description: 'game'}, owner: 'Gamer'},
          {manifest: {name: 'test', description: 'ham'}, owner: 'Hurr'}]});
      }, 2000);
       setTimeout(() => {
        this._updatePeerInfo('192.168.100.100', {name: 'garbage', apps: []});
      }, 4000);
      */

      /*if (window.TEST_MODE) {
        setTimeout(() => {
          this._addPeer('127.0.0.1');
        }, 2000);
      }*/

      this._enableP2pConnection();

      this._ipAddresses = new Promise(function (resolve, reject) {
        IPUtils.getAddresses(function (ipAddress) {
          // XXX/drs: This will break if we have multiple IP addresses.
          resolve([ipAddress]);
        });
      });
    };

    _extends(P2pService, Service);

    P2pService.prototype.getProximityApps = function () {
      return this._proximityApps;
    };

    P2pService.prototype.getProximityAddons = function () {
      return this._proximityAddons;
    };

    P2pService.prototype.getProximityThemes = function () {
      return this._proximityThemes;
    };

    P2pService.prototype.getProximityApp = function (appName) {
      function searchForProximityApp(appName, apps) {
        var proximityApp;
        for (var index in apps) {
          var peer = apps[index];
          proximityApp = peer.apps.find(function (app) {
            return app.manifest.name === appName;
          });
        }
        return proximityApp;
      }

      var retval = searchForProximityApp(appName, this._proximityApps) || searchForProximityApp(appName, this._proximityAddons) || searchForProximityApp(appName, this._proximityTheme);
      return retval;
    };

    P2pService.prototype._broadcastLoaded = function (val) {
      this._broadcast = val;
      if (this._broadcast) {
        HttpServerService.instance.activate();
      } else {
        HttpServerService.instance.deactivate();
      }
      this._dispatchEvent("broadcast");
    };

    P2pService.prototype._enableP2pConnection = function () {
      var _this2 = this;
      DNSSD.registerService("_fxos-sharing._tcp.local", 8080, {});

      DNSSD.addEventListener("discovered", function (e) {
        var isSharingPeer = e.services.find(function (service) {
          return service === "_fxos-sharing._tcp.local";
        });

        if (!isSharingPeer) {
          return;
        }

        var address = e.address;

        _this2._ipAddresses.then(function (ipAddresses) {
          // Make sure we're not trying to connect to ourself.
          if (ipAddresses.indexOf(address) !== -1) {
            return;
          }

          HttpClientService.instance.requestPeerInfo(address).then(function (peer) {
            _this2._updatePeerInfo(address, peer);
          });
        });
      });

      DNSSD.startDiscovery();
      setInterval(function () {
        DNSSD.startDiscovery();
      }, 10000);
    };

    P2pService.prototype._updatePeerInfo = function (address, peer) {
      peer.address = address;
      if (peer.apps !== undefined) {
        this._proximityApps[address] = peer;
      } else {
        delete this._proximityApps[address];
      }
      if (peer.addons !== undefined) {
        this._proximityAddons[address] = peer;
      } else {
        delete this._proximityAddons[address];
      }
      if (peer.themes !== undefined) {
        this._proximityThemes[address] = peer;
      } else {
        delete this._proximityThemes[address];
      }
      this._dispatchEvent("proximity");
    };

    _classProps(P2pService, {
      instance: {
        get: function () {
          if (!instance) {
            instance = new this(singletonGuard);
          }
          return instance;
        }
      }
    }, {
      broadcast: {
        get: function () {
          return this._broadcast;
        },
        set: function (enable) {
          navigator.mozSettings.createLock().set({
            "lightsaber.p2p_broadcast": enable });
        }
      }
    });

    return P2pService;
  })(Service);

  exports["default"] = P2pService;
});