'use strict';

import { MailChimpUtil } from '../class/Mailchimp/mailchimp.class';

export class MailChimpConf {

  static init(): void {
    MailChimpUtil.initWebhook();
  }

}
;
