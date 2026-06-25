import express from 'express';

import './config/env.js'

import ConnectDB from './config/db.js';

// import { env } from "../config/env.js";
import userRoutes from './routes/user.routes.js'
import authRoutes from './routes/auth.routes.js';

/// import { connect } from 'mongoose';

const app = express();

app.use(express.json());

ConnectDB();

app.use(userRoutes);
app.use("/auth", authRoutes);
app.listen(process.env.PORT,() =>{
    console.log(`Servidor corriendo en puerto${process.env.PORT}`)
});