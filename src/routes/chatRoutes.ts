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
import authMiddleware from '../middleware/authMiddleware';

const userRoutes = express.Router();

//User Auth routes.
userRoutes.post('/login', userLogin)
userRoutes.post('/register', userRegister)

//Get Routes
userRoutes.get('/usersDetails', authMiddleware, getUser)
userRoutes.get('/fetchDirectChatLists', authMiddleware, fetchDirectChatList); // to fetch the chat list of the user
userRoutes.get('/fetchDirectMessages', authMiddleware, fetchDirectMessages ) // to fetch the messages of the user using the chatId

userRoutes.get('/fetchGroupChatLists', authMiddleware, fetchGroupChatList); // to fetch the chat list of the user
userRoutes.get('/fetchGroupMessages', authMiddleware, fetchGroupMessages ) // to fetch the messages of the user using the chatId

//Put Routes
userRoutes.put('/manageDirectChats', authMiddleware, manageDirectChats) // to fetch the messages of the user using the chatId
userRoutes.put('/manageGroupChats', authMiddleware, manageGroupChats) // to fetch the messages of the user using the chatId

export default userRoutes