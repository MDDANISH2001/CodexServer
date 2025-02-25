import express from 'express';
import { userLogin } from '../controllers/userLogin';
import { userRegister } from '../controllers/userRegister';
import { getUser } from '../controllers/getUser';
import fetchDirectChatList from '../controllers/directChatControllers/getDirectChatList';
import fetchDirectMessages from '../controllers/directChatControllers/getDirectMessages';
import fetchGroupChatList from '../controllers/groupChatControllers/getGroupChatList';
import fetchGroupMessages from '../controllers/groupChatControllers/getGroupMessages';
import manageDirectChats from '../controllers/directChatControllers/manageDirectChats';
import manageGroupChats from '../controllers/groupChatControllers/manageGroupChats';
// import getUserDetails from '../controllers/getUserDetails.js';
// import getSharedChats from '../controllers/getSharedChats.js';
// import auth from '../controllers/auth.js'
// import checkConnectedUsers from '../controllers/checkConnectedUsers.js';
// import addChatToDb from '../controllers/addChatToDb.js';
// import getChatNames from '../controllers/getChatNames.js';

const userRoutes = express.Router();

//User Auth routes.
userRoutes.post('/login', userLogin)
userRoutes.post('/register', userRegister)

//Get Routes
userRoutes.get('/usersDetails', getUser)
userRoutes.get('/fetchDirectChatLists', fetchDirectChatList); // to fetch the chat list of the user
userRoutes.get('/fetchDirectMessages', fetchDirectMessages ) // to fetch the messages of the user using the chatId 

userRoutes.get('/fetchGroupChatLists', fetchGroupChatList); // to fetch the chat list of the user
userRoutes.get('/fetchGroupMessages', fetchGroupMessages ) // to fetch the messages of the user using the chatId 

//Put Routesd
userRoutes.put('/manageDirectChats', manageDirectChats) // to fetch the messages of the user using the chatId 
userRoutes.put('/manageGroupChats', manageGroupChats) // to fetch the messages of the user using the chatId 
// userRoutes.post('/userdata/:userId', checkConnectedUsers);
// userRoutes.post('/shareddata/:connectionId', addChatToDb);
// userRoutes.get('/shareddata/:sender/:receiver', getSharedChats);

export default userRoutes