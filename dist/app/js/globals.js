define(["exports"], function (exports) {
  "use strict";

  window.COMPONENTS_BASE_URL = "./components/";
  require.config({
    paths: {
      "gaia-component": "gaia-component/gaia-component",
      drag: "drag/drag",
      "gaia-icons": "gaia-icons/gaia-icons"
    }
  });
});