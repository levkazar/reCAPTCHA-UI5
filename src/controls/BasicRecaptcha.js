"use strict";

sap.ui.define(["sap/ui/core/Control"], function(Control) {
  let recaptchaPromise = new Promise((resolve, reject) => {
    let callback = "grecaptchaOnload";
    let script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?onload=${callback}&render=explicit`;
    script.async = true;
    script.defer = true;
    script.onerror = reject;
    window[callback] = () => {
      delete window[callback];
      let recaptcha = window.grecaptcha;
      delete window.grecaptcha;
      resolve(recaptcha);
    };
    document.head.appendChild(script);
  });

  let renderer = {
    render: function(renderer, control) {
      renderer.write("<div");
      renderer.writeControlData(control);
      renderer.writeClasses();
      renderer.write("></div>");
    }
  };

  let BasicRecaptcha = Control.extend("grecaptcha.BasicRecaptcha", {
    metadata: {
      properties: {
        sitekey: {
          type: "string",
          defaultValue: ""
        },
        isRendered: {
          type: "boolean",
          defaultValue: false,
          visibility: "hidden"
        },
        recaptchaPromise: {
          type: "object",
          defaultValue: null,
          visibility: "hidden"
        },
        recaptcha: {
          type: "object",
          defaultValue: null,
          visibility: "hidden"
        },
        widgetId: {
          type: "string",
          defaultValue: "",
          visibility: "hidden"
        }
      },
      events: {
        ready: {},
        loadError: {},
        success: {
          token: "string"
        },
        error: {},
        expired: {}
      }
    },
    renderer
  });

  BasicRecaptcha.prototype.init = function() {
    if (typeof Control.prototype.init === "function") {
      Control.prototype.init.apply(this, arguments);
    }
    this.setProperty("recaptchaPromise", recaptchaPromise, true);
    recaptchaPromise
      .then(recaptcha => {
        this.setProperty("recaptcha", recaptcha, true);
        this.fireReady();
      })
      .catch(() => this.fireLoadError());
  };

  BasicRecaptcha.prototype.onAfterRendering = function(event) {
    let control = event.srcControl;
    control.getProperty("recaptchaPromise").then(recaptcha => {
      let domRef = this.getDomRef();
      let widgetId = recaptcha.render(domRef, {
        sitekey: this.getSitekey(),
        theme: "light",
        size: "normal",
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

  BasicRecaptcha.prototype.reset = function() {
    if (this.getProperty("isRendered")) {
      this.getProperty("recaptcha").reset(this.getProperty("widgetId"));
    }
  };

  BasicRecaptcha.prototype.getResponse = function() {
    if (this.getProperty("isRendered")) {
      return this.getProperty("recaptcha").getResponse(
        this.getProperty("widgetId")
      );
    }
    return null;
  };

  return BasicRecaptcha;
});
