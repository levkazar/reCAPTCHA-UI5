"use strict";

sap.ui.define(["./BasicRecaptcha"], function(BasicRecaptcha) {
  let InvisibleRecaptcha = BasicRecaptcha.extend("grecaptcha.InvisibleRecaptcha", {
    metadata: {
      properties: {
        badge: {
          type: "string",
          defaultValue: "bottomright"
        }
      }
    },
    renderer: {}
  });

  InvisibleRecaptcha.prototype.init = function() {
    BasicRecaptcha.prototype.init.apply(this, arguments);
  };

  InvisibleRecaptcha.prototype.onAfterRendering = function(event) {
    let control = event.srcControl;
    control.getProperty("recaptchaPromise").then(recaptcha => {
      let domRef = this.getDomRef();
      let widgetId = recaptcha.render(domRef, {
        sitekey: this.getSitekey(),
        badge: this.getBadge(),
        size: "invisible",
        callback: token => {
          this.fireSuccess({ token });
        },
        "expired-callback": () => this.fireError(),
        "error-callback": () => this.fireExpired()
      });
      this.setProperty("widgetId", widgetId, true);
      this.setProperty("isRendered", true, true);
    });
  };

  InvisibleRecaptcha.prototype.execute = function() {
    if (this.getProperty("isRendered")) {
      this.getProperty("recaptcha").execute(this.getProperty("widgetId"));
    }
  };

  return InvisibleRecaptcha;
});
