"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
/** ADD Users By Username
 * @param {Request} req
 * @param {Response} res
 * @returns {void} return newly created uers
 */
const getUserByUsername = (req, res) => {
    if (req.session && req.session.username) {
        const user = user_model_1.default.findByUsername(req.session.username);
        res.status(200).json(user);
        return;
    }
    res.status(500).send('User is not logged in');
};
/** Get All Users
 * @param {Request} req
 * @param {Response} res
 * @returns {void} Get all the users
 */
const getAllUsers = (req, res) => {
    const users = user_model_1.default.findAll();
    res.status(200).json(users);
};
/** LogIn Users
 * @param {Request<{}, {}, Omit<User, 'id'>>} req
 * @param {Response} res
 * @returns {void} Log in all
 */
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(500).send('Missing Details');
        return;
    }
    try {
        const user = yield user_model_1.default.login(username, password);
        if (!user) {
            res.status(500.).send('Incorrect Details, Please ReCheck');
            return;
        }
        if (req.session) {
            req.session.isLoggedIn = true;
            req.session.username = user.username;
        }
        //Respond succsessful
        res.status(200).json({ message: 'You are Now Logged In. Welcome!',
            user: {
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname
            }
        });
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal Server Error" }); // Use 500 for server errors
    }
});
/** Add New Users
 * @param {Request<{}, {}, Omit<User, 'id'>>} req
 * @param {Response} res
 * @returns {void} Add Users
 */
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, firstname, lastname, password } = req.body;
    if (!username || !firstname || !lastname || !password) {
        res.status(500).json({ message: "Please Fill Out All The Form" });
        return;
    }
    const user = yield user_model_1.default.createnewUser({ username, firstname, lastname, password });
    if (!user) {
        res.status(404).json({ message: "Username is Already Takem, Sorry" });
        return;
    }
    res.status(201).json({ message: 'New User Added Successfully' });
});
/** LogOut User
* @param {Request} req
* @param {Response} res
* @returns {void} LogOut some User/ direct to the signup page
*/
const logout = (req, res) => {
    req.session = null;
    res.status(200).json({ message: "Session Cookies Are All Cleared, Good To Go" });
};
exports.default = {
    getUserByUsername,
    getAllUsers,
    loginUser,
    addUser,
    logout
};
