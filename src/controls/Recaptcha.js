"use strict";

sap.ui.define(["./BasicRecaptcha"], function(BasicRecaptcha) {
  let Recaptcha = BasicRecaptcha.extend("grecaptcha.Recaptcha", {
    metadata: {
      properties: {
        theme: {
          type: "string",
          defaultValue: "light"
        },
        compact: {
          type: "boolean",
          defaultValue: false
        },
        size: {
          type: "string",
          defaultValue: "normal",
          visibility: "hidden"
        }
      }
    },
    renderer: {}
  });

  Recaptcha.prototype.init = function() {
    BasicRecaptcha.prototype.init.apply(this, arguments);
    this.addStyleClass("sapUiResponsiveMargin");
  };

  Recaptcha.prototype.setProperty = function(name, value, doNotInvalidate) {
    if (name === "compact") {
      let sizeValue = value ? "compact" : "normal";
      BasicRecaptcha.prototype.setProperty.call(
        this,
        "size",
        sizeValue,
        doNotInvalidate
      );
    }
    BasicRecaptcha.prototype.setProperty.call(
      this,
      name,
      value,
      doNotInvalidate
    );
  };

  Recaptcha.prototype.onAfterRendering = function(event) {
    let control = event.srcControl;
    control.getProperty("recaptchaPromise").then(recaptcha => {
      let domRef = this.getDomRef();
      let widgetId = recaptcha.render(domRef, {
        sitekey: this.getSitekey(),
        theme: this.getTheme(),
        size: control.getProperty("size"),
        callback: token => {
          control.fireSuccess({ token });
        },
        "expired-callback": () => control.fireError(),
        "error-callback": () => control.fireExpired()
      });
      control.setProperty("widgetId", widgetId, true);
      control.setProperty("isRendered", true, true);
    });
  };

  return Recaptcha;
});
