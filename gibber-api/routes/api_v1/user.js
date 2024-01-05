const router = require('express').Router();
const User = require('../../models/User');
const auth = require('../auth');
const {ErrorHandler} = require('../../config/error');
const {getNotNullFields, welcomeMessage} = require('../../utils');
const {upload, getImageName} = require('../../config/storage');
const s3 = require('../../config/s3');
const qr = require('qrcode');
const Conversation = require('../../models/Conversation');
const Message = require('../../models/Message');
const {translatedWelcomeMsgs} = require('../../config/translatedWelcomeMsgs');
const Realm = require('realm-web');
const realmApp = new Realm.App({id : process.env.REALM_ID});

const s3_dir = 'test/'; // 'prod/' for production


const profileFields = {contacts: 0, blocked: 0, blockedFrom: 0, password: 0};

const create = async (req, res, next) => {
  try {
    const {name, phone, email, password, language, translateUser} = req.body;
    const missingFields = [];
    if (!name) missingFields.push('Name');
    if (!password) missingFields.push('Password');
    if (!language || language === "") missingFields.push('Language');

    if (missingFields.length > 0)
      return new ErrorHandler(400, "Missing fields: " + missingFields.toString(), missingFields, res);

    const alreadyExists = await User.findOne({
     $or: [
            { email },
            { phone }
          ]
   });

    if (alreadyExists)
      return new ErrorHandler(409, `Either Email or Phone already exist. Please enter a different email address or phone number.`, [], res);

    const user = {email, phone, name, password, language, translateUser};
    const finalUser = new User(user);
    finalUser.translateUser = false;
    finalUser.setPassword(user.password);
    finalUser.save(async (err, newUser) => {
      if (err)
        return new ErrorHandler(400, "An error occurred during user creation, please try again later.", [], res);
      const realmCreds = await Realm.Credentials.emailPassword(newUser.email, newUser.password);
      const regRealmUser = await realmApp.emailPasswordAuth.registerUser({email: newUser.email, password: newUser.password});
      const loggedInRealm = await realmApp.logIn(realmCreds);
      const userWithToken = { ...newUser.toJSON() };
      delete userWithToken['password'];
      userWithToken.token = finalUser.generateJWT();
      const adminUser = await User.findOne({ email: 'teamgibber@test.com' });
      const newConversation = new Conversation({
        users: [adminUser._id, newUser._id]
      });
      // creating coversation with Team account
      await newConversation.save( async (err, newConv) => {
        if (err)
          return new ErrorHandler(404, "Failed to create conversation with team account", [], res);
        await User.updateOne({ _id: adminUser._id }, { $addToSet: { contacts: newUser._id } });
        await User.updateOne({ _id: newUser._id }, { $addToSet: { contacts: adminUser._id } });

        // creating reply from Team account
        let textArr;
        if(newUser.language === adminUser.language){
          textArr = [{language: newUser.language, text: translatedWelcomeMsgs.find((e) => e.language === newUser.language).message}];
        }else {
          textArr = [{language: newUser.language, text: translatedWelcomeMsgs.find((e) => e.language === newUser.language).message}, {language: 'en', text: welcomeMessage}];
        }
        const reply = new Message({conversationId: newConv._id, user: adminUser._id, createdAt: new Date(), originalLang: 'en', text: textArr, originalText: welcomeMessage });
        reply.save(async function (err, reply) {
          if (err) return new ErrorHandler(404, "Failed to create message from team account", [], res);
          else {
            const msg = await Message.populate(reply, {path:"user", select: 'name , avatar'});
            res.status(200).json(userWithToken);
          }
        });
      });
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const {email, phone, password} = req.body;
    if ((phone || email) && password) {
      const query = email ? {email} : {phone};
      const user = await User.findOne(query);
      if (!user || !user.validatePassword(password)) return new ErrorHandler(400, (email ? 'email':'phone') + " or password is invalid", [], res);
      const finalData = {token: await user.generateJWT(), ...user.toJSON()};
      const realmCreds = await Realm.Credentials.emailPassword(finalData.email, finalData.password);
      // const loggedInRealm = await realmApp.logIn(realmCreds);
      delete finalData['password'];
      res.status(200).json(finalData);
    } else
      new ErrorHandler(404, "Missing required fields", [], res);
  } catch (e) {
    next(e);
  }
};

const search = async (req, res, next) => {
  try {
    const {q, by} = req.query;
    if (!q) return res.status(404).send("query is required");
    const user = await User.findOne({_id: req.payload.id}, {blocked: 1, blockedFrom: 1});
    const query = {$regex: q, $options: 'i'};
    let data;
    if(by === 'search-email'){
      data = await User.find(
        {email: query,
          _id: {$nin: [...user.blocked, ...user.blockedFrom, req.payload.id]}},
        profileFields
      ).limit(3);
    } else if (by === 'search-phone'){
      data = await User.find(
        {phone: query,
          _id: {$nin: [...user.blocked, ...user.blockedFrom, req.payload.id]}},
        profileFields
      ).limit(3);
    } else {
      data = await User.find(
        {name: query,
          _id: {$nin: [...user.blocked, ...user.blockedFrom, req.payload.id]}},
        profileFields
      ).limit(3);
    }
    res.json(data);
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const data = await User.findOne({_id: req.params.id}, profileFields);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const data = await User.find({});
    res.json(data);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
      res.json({ message: 'Instructions to reset your password have been sent to your email or phone number.' });
  } catch (e) {
    next(e);
  }
}

const getProfile = async (req, res, next) => {
  try {
    const data = await User.findOne({_id: req.payload.id}, {password: 0})
      .populate({path: 'contacts', select: 'name , avatar , phone , email'})
      .populate({path: 'blocked', select: 'name , avatar'})
      .populate({path: 'blockedFrom', select: 'name , avatar'});
    res.json(data);
  } catch (e) {
    next(e);
  }
};
//Getting 401 error when trying to change language here
const update = async (req, res, next) => {
  try {
    const {name, phone, email} = req.body;
    const data = await User.findOneAndUpdate(
      {_id: req.payload.id},
      {$set: {...getNotNullFields({name, phone, email})}},
      {new: true},
    ).select({password: 0});
    res.json(data);
  } catch (e) {
    next(e);
  }
};

const updateTranslateUser = async (req, res, next) => {
  try {
    await User.updateOne({_id: req.payload.id}, {$set: {translateUser: req.body.translateUser}});
    res.json({updated: true});
  } catch (e) {
    next(e);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const uploaded = await s3.upload(req.file, s3_dir + 'user', getImageName(req.file, req.payload.id));
    await User.updateOne({_id: req.payload.id}, {$set: {avatar: uploaded.key}});
    res.status(200).json({path: uploaded.key});
  } catch (e) {
    next(e);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { userOldPassword, userNewPassword } = req.body;
    const userId = req.params.id;
    const user = await User.findOne({_id: userId});
    if (!user || !user.validatePassword(userOldPassword)) {
      new ErrorHandler(400, ('Invalid password or passwords do not match'), [], res);
      return;
    }
    user.setPassword(userNewPassword);
    await user.save();
    res.json(user)
  } catch (e) {
    next(e);
  }
}

const updateLanguage = async (req, res, next) => {
  try {
    const { language } = req.body;
    const userId = req.params.id;
    const user = await User.findOne({_id: userId});

    if(!user){
      throw new Error('User not found');
    }
  
    user.language = language;
    await user.save();

    res.json(user)
  } catch (e) {
    next(e);
  }
}

const block = async (req, res, next) => {
  try {
    await User.updateOne({_id: req.params.user}, {$addToSet: {blockedFrom: req.payload.id}, $pull: {contacts: req.payload.id}, $pull: {friends: req.payload.id}});
    await User.updateOne({_id: req.payload.id}, {$addToSet: {blocked: req.params.user}, $pull: {contacts: req.params.user}, $pull: {friends: req.params.user}});
    res.status(200).json({updated: true});
  } catch (e) {
    next(e);
  }
};

const unblock = async (req, res, next) => {
  try {
    await User.updateOne({_id: req.params.user}, {$pull: {blockedFrom: req.payload.id}});
    await User.updateOne({_id: req.payload.id}, {$pull: {blocked: req.params.user}});
    res.status(200).json({updated: true});
  } catch (e) {
    next(e);
  }
};

const generateQr = async (req, res, next) => {
  try {
    qr.toDataURL(req.body.secret, (err, src) => {
      res.status(200).json({src});
    });
  } catch (e) {
    next(e);
  }
};

const addDevice = async (req, res, next) => {
  try {
    await User.updateOne({_id: req.payload.id}, {$push: {devices: req.body.device}});
    res.send('ok')
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    await User.deleteOne({_id: req.payload.id});
    res.json({ok: 1});
  } catch (e) {
    next(e);
  }
};

const forgotPassword = async (req, res, next) => {

  try {
    const {email} = req.body;
    const resetEmail = await realmApp.emailPasswordAuth.sendResetPasswordEmail({ email });
    res.status(200).json("success in sending forgot password email")
  } catch (e) {
    next(e);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const {newPassword, token, tokenId, email} = req.body;

    const user = await User.findOne({email});
    user.setPassword(newPassword);
    await user.save();

    res.status(200).json("success in resetting password")
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const updateTextSize = async (req, res, next) => {
  try {
    const { textSize } = req.body;
    const { id } = req.params;
    const newTextSize = Number(textSize)
    await User.updateOne({_id: id}, {$set: {fontSize: newTextSize}});
    res.status(200).json({ message: 'Text size updated successfully' });

  } catch (error) {
    next(error)
  }
};

router.post("/", create);
router.post("/login", login);
router.post("/qr", generateQr);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/device", auth.required, addDevice);
router.get("/", auth.required, getProfile);
router.get("/search", auth.required, search);
router.get("/allUsers", auth.required, getAllUsers);
router.get("/:id", auth.required, get);
router.put("/", auth.required, update);
router.put("/translateUser", auth.required, updateTranslateUser);
router.put("/avatar", [auth.required, upload.single('file')], updateAvatar);
router.put("/password/:id", auth.required, updatePassword);
router.put("/language/:id", auth.required, updateLanguage);
router.put("/block/:user", auth.required, block);
router.put("/unblock/:user", auth.required, unblock);
router.put("/changeText/:id", auth.required, updateTextSize);
router.delete("/:id", auth.required, remove);

module.exports = router;
