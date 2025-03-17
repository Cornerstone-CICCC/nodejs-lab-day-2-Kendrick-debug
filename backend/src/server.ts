import express, { Request, Response } from "express";
import cookieSession from "cookie-session";
import cors from 'cors'
import dotenv from 'dotenv'
import userRouter from "./routes/user.routes";
dotenv.config()

// Create your server
const app = express()

// Cors Middleware 
app.use(cors({
    origin: 'http://localhost:4321', // Astro port
    credentials: true // allow cookies
  }))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  const SIGN_KEY = process.env.COOKIE_SIGN_KEY;
  const ENCRYPT_KEY = process.env.COOKIE_ENCRYPT_KEY;

  
// My cookie-session had a proble, took me hours to solve. so this will log to see if the encypt keys are working well

console.log("SIGN_KEY:", SIGN_KEY);
console.log("ENCRYPT_KEY:", ENCRYPT_KEY);

  if (!SIGN_KEY || !ENCRYPT_KEY) {
    throw new Error("Missing cookie 🍪 key!");
  }
  app.use(
    cookieSession({
      name: "session",
      keys: [SIGN_KEY, ENCRYPT_KEY],
      maxAge: 5 * 60 * 1000,
    })
  );


  //Routes
app.use("/", userRouter)

  app.use((req: Request, res: Response) => {
    res.status(404).send("Page Not found")
  })


  // 404 Fallback
app.use((req: Request, res: Response) => {
    res.status(404).send("Page not found!");
  });

  // Start server
const PORT = process.env.PORT || 3500
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`)
})