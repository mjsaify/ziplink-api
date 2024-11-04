import Express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { BASE_URL } from './constants.js';
import router from './routes/index.js';
import { RedirectOriginalUrl } from './controllers/url.controller.js';

const app = Express();
app.use(cookieParser());
app.use(cors({
    origin: BASE_URL,
    credentials: true
}));

app.use(Express.json({ limit: "16kb"}));
app.use(Express.urlencoded({ extended: true, limit: "16kb"}));
app.use("/api", router);
app.get("/:urlId", RedirectOriginalUrl);

export { app };