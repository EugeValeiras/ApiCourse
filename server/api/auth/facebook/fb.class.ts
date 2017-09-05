import FB from 'fb';

export class FBClass {

  static getProfileImageUrl(profileId, size?) {
    return new Promise((resolve, reject) => {
      FB.api(
        `/${profileId}/picture`, { type: size ? size : 'normal', redirect: false },
        (response) => {
          if (response && !response.error) {
            resolve(response.data.url);
          } else {
            reject(response.error);
          }
        });
    });

  }

  constructor() {

  }



}
