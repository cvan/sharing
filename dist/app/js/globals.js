define(["exports"], function (exports) {
  "use strict";

  window.COMPONENTS_BASE_URL = "./components/";
  require.config({
    paths: {
      "gaia-component": "components/gaia-component/gaia-component"
    }
  });
});