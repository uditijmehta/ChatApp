import {REACT_APP_BASE_API_URL, REACT_APP_S3_BUCKET_URL, REACT_APP_ONE_SIGNAL_APP_ID, REACT_APP_GOOGLE_TRANSLATE_API_KEY} from "@env";

export default {
  base_url: 'http://localhost:8000', //for ios
  // base_url: 'http://10.0.2.2:8000', // for android
  // base_url: REACT_APP_BASE_API_URL,
  bucket_url: REACT_APP_S3_BUCKET_URL,
  onesignal_app: REACT_APP_ONE_SIGNAL_APP_ID, // app id
  translate_api: REACT_APP_GOOGLE_TRANSLATE_API_KEY,
}
