sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "./controls/Recaptcha",
    "./controls/InvisibleRecaptcha",
    "./controls/BasicRecaptcha",
    "sap/m/Button"
  ],
  function(UIComponent, Recaptcha, InvisibleRecaptcha, BasicRecaptcha, Button) {
    "use strict";

    let recaptcha;
    let firstButton = new Button({
      visible: false
    });

    const resetButon = new Button({
      text: "Reset",
      enabled: false,
      press: () => {
        recaptcha.reset();
        firstButton.setEnabled(true);
        resetButon.setEnabled(false);
      }
    });

    function success(event) {
      let token = event.getParameter("token");
      if (token) {
        alert(`Congrats! Your token key is\n${token}`);
      } else {
        alert(`Failed! No token was generated`);
      }

      firstButton.setEnabled(false);
      resetButon.setEnabled(true);
    }

    function basic() {
      recaptcha = new BasicRecaptcha({
        sitekey: "your public sitekey goes here",
        loadError: () => alert("Load Error!"),
        success: success,
        error: () => alert("Error!"),
        expired: () => alert("Expired!")
      });
    }

    function normal() {
      recaptcha = new Recaptcha({
        sitekey: "your public sitekey goes here",
        theme: "light",
        compact: false,
        loadError: () => alert("Load Error!"),
        success: success,
        error: () => alert("Error!"),
        expired: () => alert("Expired!")
      });
    }

    function invisible() {
      recaptcha = new InvisibleRecaptcha({
        sitekey: "your public sitekey goes here",
        badge: "bottomright",
        loadError: () => alert("Load Error!"),
        success: success,
        error: () => alert("Error!"),
        expired: () => alert("Expired!")
      });

      firstButton = new Button({
        text: "Ok",
        press: recaptcha.execute.bind(recaptcha)
      });
    }

    return UIComponent.extend("demo.Component", {
      metadata: {
        manifest: "json"
      },

      init: function() {
        UIComponent.prototype.init.apply(this, arguments);
      },

      createContent: function() {
        invisible();

        const page = new sap.m.Page("page", {
          title: "Recaptcha Test",
          busyIndicatorDelay: 0,
          busy: true,
          content: [recaptcha, firstButton, resetButon]
        });

        recaptcha.attachReady(() => page.setBusy(false));

        const app = new sap.m.App({
          pages: page
        });

        return app;
      }
    });
  }
);
