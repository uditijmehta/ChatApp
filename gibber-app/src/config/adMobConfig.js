import {banner_ad_android, banner_ad_ios} from './constants';

//Keeping this function from TestIds in case we want to have different ads! 
export const AdIds= {
  APP_OPEN: '',
  BANNER: '',
  INTERSTITIAL: '',
  REWARDED: '',
  REWARDED_INTERSTITIAL: '',
  GAM_APP_OPEN: '/6499/example/app-open',
  GAM_BANNER: '/6499/example/banner',
  GAM_INTERSTITIAL: '/6499/example/interstitial',
  GAM_REWARDED: '/6499/example/rewarded',
  GAM_REWARDED_INTERSTITIAL: '/21775744923/example/rewarded_interstitial',
  GAM_NATIVE: '/6499/example/native',
  ...Platform.select({
    android: {
      APP_OPEN: 'ca-app-pub-3940256099942544/3419835294',
      BANNER: 'ca-app-pub-9161240946129783/8510824494',
      INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
      REWARDED: 'ca-app-pub-3940256099942544/5224354917',
      REWARDED_INTERSTITIAL: 'ca-app-pub-3940256099942544/5354046379',
    },
    ios: {
      APP_OPEN: 'ca-app-pub-3940256099942544/5662855259',
      BANNER: 'ca-app-pub-9161240946129783/4763151177',
      INTERSTITIAL: 'ca-app-pub-3940256099942544/4411468910',
      REWARDED: 'ca-app-pub-3940256099942544/1712485313',
      REWARDED_INTERSTITIAL: 'ca-app-pub-3940256099942544/6978759866',
    },
  }),
}