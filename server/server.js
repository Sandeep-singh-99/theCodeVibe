import express from 'express';
import dotenv from 'dotenv';
dotenv.config()
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import { ConnectDB }  from './config/db.js';
import userRoute from './routers/user.route.js'
import postRoute from './routers/post.route.js';
import bookmarkRoute from './routers/bookmark.route.js'
import messageRoute from './routers/message.route.js'
import commentRoute from './routers/comment.route.js'
import { app, server } from './socket/socket.js'


const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', userRoute)
app.use('/api/post', postRoute)
app.use('/api/bookmark', bookmarkRoute)
app.use('/api/message', messageRoute)
app.use('/api/comment', commentRoute)



server.listen(PORT, () => {
    ConnectDB()
    console.log(`server is running http://localhost:${PORT}`);
})