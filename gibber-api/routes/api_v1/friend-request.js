// const router = require('express').Router();
// const User = require('../../models/User');
// const Conversation = require('../../models/Conversation');
// const auth = require('../auth');
// const {ErrorHandler} = require('../../config/error');
// const FriendRequest = require('../../models/FriendRequest');

// // POST createRequest call
// const create = async (req, res, next) => {
//   try {
//     const request = new FriendRequest({sender: req.body.sender, receiver: req.body.receiver});
//     request.save(async function (err, data) {
//         if (err) return new ErrorHandler(400, "Request could not be created", [], res);
//         else {
//             // request created
//             res.status(200).json(data);
//         }
//     });
//   } catch (e) {
//     next(e);
//   }
// };

// // POST acceptRequest call
// const accept = async (req, res, next) => {
//   try {
//     const accepted = await FriendRequest.findOneAndUpdate({_id: req.params.id}, {
//         $set: {
//             status: "accepted"
//         }
//     });
//     // add receiver to sender's 'friends' array
//     await User.updateOne({ _id: accepted.sender }, { $addToSet: { friends: accepted.receiver } });
//     // add sender to receiver's 'friends' array
//     await User.updateOne({ _id: accepted.receiver }, { $addToSet: { friends: accepted.sender } });

//     res.json(accepted);
//   } catch (e) {
//     next(e);
//   }
// };

// // POST declineRequest call
// const decline = async (req, res, next) => {
//   try {
//     const declined = await FriendRequest.findOneAndUpdate({_id: req.params.id}, {
//         $set: {
//             status: "declined"
//         }
//     });
//     res.json(declined);
//   } catch (e) {
//     next(e);
//   }
// };

// // GET getSentRequests call
// const getSent = async (req, res, next) => {
//   try {
//     const sentRequests = await FriendRequest.find({sender: req.params.id});
//     const users = await Promise.all(sentRequests.map(async u => {
//       const obj = await User.findById(u.receiver).select('-password');
//       return obj;
//     }));
//     res.json({requests: sentRequests, users: users});
//   } catch (e) {
//     next(e);
//   }
// };

// // GET getReceivedRequests call
// const getReceived = async (req, res, next) => {
//     try {
//       const recievedRequests = await FriendRequest.find({receiver: req.params.id});
//       const users = await Promise.all(recievedRequests.map(async u => {
//         const obj = await User.findById(u.sender).select('-password');
//         return obj;
//       }));
//       res.json({requests: recievedRequests, users: users});
//     } catch (e) {
//       next(e);
//     }
//   };

// // DELETE removeRequest call
// const remove = async (req, res, next) => {
//   try {
//     const data = await FriendRequest.deleteOne({_id: req.params.id});
//     res.json(data);
//   } catch (e) {
//     next(e);
//   }
// }

// // *** ONLY USE ONCE BEFORE PROD PUSH THEN DELETE *** //

// // // ADD to Friends Array
// // const buildAllFriendsList = async (req, res, next) => {
// //   try {
// //     const allUsers = await User.find({});
// //     allUsers.forEach(async u => {
// //       // get conversations each user is in
// //       const convs = await Conversation.find({users: { $in: [u._id]}});
// //       // console.log(convs);
// //       // for each conversation, add user (not teamgibber and not self and not someone who's already in there) to friends array
// //       friendsArr = [];
// //       convs.forEach(conv => {
// //         conv.users.forEach(c_user => {
// //           let uid = c_user.toString();
// //           if(uid !== u._id.toString() && uid !== "641378a933af58d8c66e7406"){ // teamgibber id
// //             friendsArr.push(uid);
// //           }
// //         })
// //       })
// //       // remove duplicates from friendsArr
// //       friendsArr  = [...new Set(friendsArr)]
// //       const addFriends = await User.updateOne({_id: u.id}, {
// //          $set: { friends: friendsArr }
// //       });
// //     })
// //     const updatedUsers = await User.find({});
// //     console.log(updatedUsers);
// //     res.json(updatedUsers);
// //   } catch (e) {
// //     next(e);
// //   }
// // }

// // router.get('/buildFriends', buildAllFriendsList);
// //
// // *** ONLY USE ONCE BEFORE PROD PUSH THEN DELETE *** //

// router.post("/create", auth.required, create);
// router.post("/accept/:id", auth.required, accept);
// router.post("/decline/:id", auth.required, decline);
// router.get("/sent/:id", auth.required, getSent);
// router.get("/received/:id", auth.required, getReceived);
// router.delete("/:id", auth.required, remove);

// module.exports = router;
