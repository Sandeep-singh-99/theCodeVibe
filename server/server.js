import express from 'express';
import dotenv from 'dotenv';
dotenv.config()
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { ConnectDB }  from './config/db.js';
import userRoute from './routers/user.route.js'

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', userRoute)



app.listen(PORT, () => {
    ConnectDB()
    console.log(`server is running http://localhost:${PORT}`);
})