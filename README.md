# Serverless reCAPTCHA

This is a sample static site hosted on Netlify with Google's reCAPTCHA v2, using Netlify Functions.  
[Try it here!](https://nifty-tesla-2a3aa5.netlify.com/)

Want a reCAPTCHA for your static site without dedicating an entire back-end? This is it.

## Use cases:
 - Hide email, phone numbers from scrapers
 - Hide download links
 - Special messages for humans


## To integrate this yourself:
 - Add the reCAPTCHA elements (`index.html` and `main.js`) to your page
 - Register for your reCAPTCHA [here](https://www.google.com/recaptcha/admin/create), using your static site host name
 - Obtain your `site key`, set it as `data-site-key` attribute in the reCAPTCHA form.
 - Obtain your `secret key`, set it as a Netlify environment variable `CAPTCHA_SECRET=...` (or hard code it ... it's a free country.)
 - Update your Netlify Function url (whose ending should resemble `.com/.netlify/functions/{function_name}`)
 - Optional: set a Netlify environment variable `SECRET_MESSAGE=..` to return a message, or bake it into your serverless function.
 
 
For verification flow: https://developers.google.com/recaptcha/docs/verify  
More Netlify Function examples: https://github.com/netlify/function
