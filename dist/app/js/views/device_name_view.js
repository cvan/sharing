define(["exports", "fxos-mvc/dist/mvc", "gaia-icons/gaia-icons", "gaia-text-input/gaia-text-input", "gaia-dialog/gaia-dialog"], function (exports, _fxosMvcDistMvc, _gaiaIconsGaiaIcons, _gaiaTextInputGaiaTextInput, _gaiaDialogGaiaDialog) {
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

  var View = _fxosMvcDistMvc.View;
  var DeviceNameView = (function (View) {
    var DeviceNameView = function DeviceNameView() {
      View.apply(this, arguments);
    };

    _extends(DeviceNameView, View);

    DeviceNameView.prototype.template = function () {
      var string = "\n      <h1>Change device name</h1>\n      <p>Ugly due to a limitation in web components. See bug 1079236.</p>\n      <input id=\"device-name-input\"></input>\n      <section>\n        <button id=\"device-name-cancel\">Cancel</button>\n        <button id=\"device-name-submit\">Ok</button>\n      </section>\n    ";
      return string;
    };

    DeviceNameView.prototype.render = function () {
      var _this = this;
      this.el = document.createElement("gaia-dialog");

      View.prototype.render.call(this);

      setTimeout(function () {
        _this.cancelButtonEl = document.getElementById("device-name-cancel");
        _this.submitButtonEl = document.getElementById("device-name-submit");
        _this.inputEl = document.getElementById("device-name-input");

        _this.cancelButtonEl.addEventListener("click", _this.el.close.bind(_this.el));
        _this.submitButtonEl.addEventListener("click", _this._handleSubmit.bind(_this));

        _this.el.addEventListener("opened", _this.controller.handleOpened.bind(_this.controller));
        _this.el.addEventListener("closed", _this.controller.handleClosed.bind(_this.controller));
      });
    };

    DeviceNameView.prototype._handleSubmit = function (e) {
      this.controller.handleSubmit();
      this.el.close();
    }

    // XXX/drs: Bug 1079236 prevents us from opening the keyboard when focusing
    // an input element that is inside a shadow DOM tree. For now, replace it
    // with a text input.
    /*
    render() {
      this.el = document.createElement('gaia-dialog-prompt');
      this.el.addEventListener('opened', this._handleOpened.bind(this));
      this.el.addEventListener('closed', this._handleClosed.bind(this));
      // XXX/drs: Yikes, we should probably expose this a bit better in the WC.
      this.el.els.submit.addEventListener(
        'click', this._handleSubmit.bind(this));
    }
     get value() {
      return this.el.els.input.value;
    }
     set value(val) {
      this.el.els.input.value = val;
    }
    */
    ;

    _classProps(DeviceNameView, null, {
      value: {
        get: function () {
          return this.inputEl.value;
        },
        set: function (val) {
          this.inputEl.value = val;
        }
      }
    });

    return DeviceNameView;
  })(View);

  exports["default"] = DeviceNameView;
});