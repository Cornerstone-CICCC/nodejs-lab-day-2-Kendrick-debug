import { Request, Response } from "express";
import {User }from '../types/user'
import userModel from "../models/user.model"



/** ADD Users By Username
 * @param {Request} req
 * @param {Response} res
 * @returns {void} return newly created uers
 */

    const getUserByUsername= (req: Request,res: Response) => {
        if (req.session && req.session.username) {
            const user = userModel.findByUsername(req.session.username)
            res.status(200).json(user)
            return
        }
        res.status(500).send('User is not logged in')
    }



    /** Get All Users
     * @param {Request} req
     * @param {Response} res
     * @returns {void} Get all the users 
     */

    const getAllUsers =  (req: Request, res: Response) => {
        const users = userModel.findAll()
        res.status(200).json(users)
    }



    /** LogIn Users
     * @param {Request<{}, {}, Omit<User, 'id'>>} req
     * @param {Response} res
     * @returns {void} Log in all 
     */


    const loginUser = async (req: Request<{}, {}, Omit<User, 'id'>>, res: Response) => {
        const {username, password} = req.body
        if (!username || !password) {
            res.status(500).send('Missing Details')
            return
        }

        try {
            const user = await userModel.login(username, password);

            if(!user) {
                res.status(500.).send('Incorrect Details, Please ReCheck')
                return
            }
            if (req.session) {
                req.session.isLoggedIn = true
                req.session.username = user.username
            }

            //Respond succsessful
            res.status(200).json({message: 'You are Now Logged In. Welcome!',
                user: {
                    username: user.username,
                    firstname: user.firstname,
                    lastname: user.lastname

                }

        });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal Server Error" }); // Use 500 for server errors
    }
       
       
    }


    /** Add New Users
     * @param {Request<{}, {}, Omit<User, 'id'>>} req
     * @param {Response} res
     * @returns {void} Add Users
     */

const addUser = async(req: Request<{}, {}, Omit<User, 'id'>>, res: Response) => {
    const {username, firstname, lastname, password} = req.body
    if(!username || !firstname || !lastname || !password) {
        res.status(500).json({message: "Please Fill Out All The Form"})
        return
    }
    const user = await userModel.createnewUser({username, firstname, lastname, password})
    if(!user) {
        res.status(404).json({message: "Username is Already Takem, Sorry"})
        return
    }
    res.status(201).json({message: 'New User Added Successfully'})

    }



       /** LogOut User
     * @param {Request} req
     * @param {Response} res
     * @returns {void} LogOut some User/ direct to the signup page
     */
    const logout = (req: Request, res: Response) => {
        req.session = null
        res.status(200).json({message: "Session Cookies Are All Cleared, Good To Go"})
       }





export default {
    getUserByUsername,
    getAllUsers,
    loginUser,
    addUser,
    logout

}