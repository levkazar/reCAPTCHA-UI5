# reCAPTCHA-UI5
## Implementation of Google reCAPTCHA for SAP UI5

This is a very basic implementation of reCAPTCHA v2 as SAP UI5 controls. You should consider this more as an example and rework it to your needs.

Please refer also to the [developer guide for reCaptcha](https://developers.google.com/recaptcha/intro) provided by Google and the [API for SAP UI5](https://sapui5.hana.ondemand.com/#/api).

### TL;DR (when you need it done by EOB)
1. Smile and don't panic.
2. Go to the [Google ReCAPTCHA admin site](http://www.google.com/recaptcha/admin) and create an API key pair.
3. Copy the files under `src/controls` to you project.
4. Optional step: Rename the controls inside the files to something that matches your project id.
5. Require/Define either `Recaptcha` or `InvisibleRecaptcha` to use in your project. The `BasicRecaptcha` is really just something like an abstract class and shouldn't be used directly.
6. Create an instance of the Recaptcha object with the pblic API key and any optional parameters. See the file `src/Component.js` for examples.
7. Test your implementation. And then test some more...
