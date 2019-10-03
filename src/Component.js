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
      fetch("/sap/opu/odata/verify", {
        method: "post",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          token: event.getParameter("token")
        })
      })
        .then(response => {
          response.json().then(body => {
            if (body.success) {
              alert(`Exzellente Glückwünsche!`);
            } else {
              alert(`Epic Fail!`);
            }
          });
        })
        .catch(error => alert(`Oh Nein! ${error}`));

      firstButton.setEnabled(false);
      resetButon.setEnabled(true);
    }

    function basic() {
      recaptcha = new BasicRecaptcha({
        sitekey: "6Le0p7EUAAAAAFHo5hMcK-8GEukxZcaBq7RBlsZl",
        loadError: () => alert("Load Error!"),
        success: success,
        error: () => alert("Error!"),
        expired: () => alert("Expired!")
      });
    }

    function normal() {
      recaptcha = new Recaptcha({
        sitekey: "6Le0p7EUAAAAAFHo5hMcK-8GEukxZcaBq7RBlsZl",
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
        sitekey: "6Ld_X7IUAAAAALQQyU3JR3T5fHSdgtVbTPX1XMat",
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
        normal();

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
