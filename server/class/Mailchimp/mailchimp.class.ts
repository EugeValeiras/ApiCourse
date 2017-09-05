const mailchimpConfig = require('../../constants/mailchimp.json')[process.env.NODE_ENV || 'default'];

const MailChimp = require('mailchimp');
const MailChimpAPI = MailChimp.MailChimpAPI;
const MailChimpWebhook = MailChimp.MailChimpWebhook;
const MandrillAPI = require('mailchimp').MandrillAPI;

export class MailChimpUtil {

  static webhook = new MailChimpWebhook();
  static api = new MailChimpAPI(mailchimpConfig.API_KEY, {version: '2.0'});
  static mandrill = new MandrillAPI(mailchimpConfig.MANDRIL_API_KEY, { version : '1.0', secure: false });

  static initWebhook() {
    this.webhook.on('error', function (error) {
      console.log(error.message);
    });
    this.webhook.on('subscribe', function (data, meta) {
      console.log(`${data.email} subscribed to your newsletter!`); // Do something with your data!
    });
    this.webhook.on('unsubscribe', function (data, meta) {
      console.log(`${data.email} unsubscribed from your newsletter!`); // Do something with your data!
    });
  }

  static sendTemplate() {
    this.api.call('template', 'template-content', { cid: '/* CAMPAIGN ID */' }, function (error, data) {
      if (error)
        console.log(error.message);
      else
        console.log(JSON.stringify(data)); // Do something with your data!
    });
  }

  constructor() {
  }


}
