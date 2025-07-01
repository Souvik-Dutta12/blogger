import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();

app.use(cors({
    origin: 'http://blogger-orcin-five.vercel.app',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

//routes
import userRouter from "./routes/user.route.js"
import blogRouter from "./routes/blog.route.js"
import commentRouter from "./routes/comment.route.js"
import loveRouter from "./routes/love.route.js"
import tagRouter from "./routes/tag.route.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/blogs", blogRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/loves", loveRouter)
app.use("/api/v1/tags", tagRouter)

export { app };