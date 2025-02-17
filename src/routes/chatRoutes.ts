import express from 'express';
import { userLogin } from '../controllers/userLogin';
import { userRegister } from '../controllers/userRegister';
import { getUser } from '../controllers/getUser';
import getChatNames from '../controllers/getChatNames';
// import getUserDetails from '../controllers/getUserDetails.js';
// import getSharedChats from '../controllers/getSharedChats.js';
// import auth from '../controllers/auth.js'
// import checkConnectedUsers from '../controllers/checkConnectedUsers.js';
// import addChatToDb from '../controllers/addChatToDb.js';
// import getChatNames from '../controllers/getChatNames.js';

const userRoutes = express.Router();

userRoutes.post('/login', userLogin)

userRoutes.post('/register', userRegister)
userRoutes.get('/users', getUser)
userRoutes.get('/fetchChatLists', getChatNames); // to fetch the chat list of the user
userRoutes.get('/fetchMessages', ) // to fetch the messages of the user using the chatId 
userRoutes.get('/createConversation', ) // to fetch the messages of the user using the chatId 
// userRoutes.post('/userdata/:userId', checkConnectedUsers);
// userRoutes.post('/shareddata/:connectionId', addChatToDb);
// userRoutes.get('/shareddata/:sender/:receiver', getSharedChats);

export default userRoutes