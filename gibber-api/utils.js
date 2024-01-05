const _ = require("lodash");
const axios = require('axios');
const { Translate } = require('@google-cloud/translate').v2;
// const CREDENTIALS = require(process.env.CREDENTIALS_PATH); // FOR prod

exports.getNotNullFields = function(data) {
  const out = {};
  _(data).forEach((value, key) => {
    if (!_.isEmpty(value) || _.isBoolean(value) || _.isNumber(value)) {
      out[key] = value;
    }
  });
  return out;
};


const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

const translate = new Translate({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id
})


exports.translateText = async (text, lang, tarLang) => {
  if(lang === tarLang) return text;
  try{
    let [res] = await translate.translate(text, tarLang);
    return res;
  }catch(e){
    throw new Error(e);
  }
}


exports.welcomeMessage = "Hey! We're excited you're here! We're reaching out today to kick off a conversation so you see the power of our app! Reply back in any language you feel comfortable and see the power of translation. FYI if you have any feedback or bugs, we're open to hearing about them! Excited to talk with you!";

