"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
dotenv_1.default.config();
// Create your server
const app = (0, express_1.default)();
// Cors Middleware 
app.use((0, cors_1.default)({
    origin: 'http://localhost:4321', // Astro port
    credentials: true // allow cookies
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const SIGN_KEY = process.env.COOKIE_SIGN_KEY;
const ENCRYPT_KEY = process.env.COOKIE_ENCRYPT_KEY;
// My cookie-session had a proble, took me hours to solve. so this will log to see if the encypt keys are working well
console.log("SIGN_KEY:", SIGN_KEY);
console.log("ENCRYPT_KEY:", ENCRYPT_KEY);
if (!SIGN_KEY || !ENCRYPT_KEY) {
    throw new Error("Missing cookie 🍪 key!");
}
app.use((0, cookie_session_1.default)({
    name: "session",
    keys: [SIGN_KEY, ENCRYPT_KEY],
    maxAge: 5 * 60 * 1000,
}));
//Routes
app.use("/", user_routes_1.default);
app.use((req, res) => {
    res.status(404).send("Page Not found");
});
// 404 Fallback
app.use((req, res) => {
    res.status(404).send("Page not found!");
});
// Start server
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
});
