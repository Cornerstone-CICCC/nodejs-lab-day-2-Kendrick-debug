import {v4 as uuidv4} from 'uuid'
import {User} from '../types/user'
import bcrypt from 'bcrypt'


class UserModel {
    private users: User[] = []

    findAll() {
        return this.users
    }
    
    

    findByUsername(username: string) {
        const user = this.users.find(u => u.username === username)
        if(!user) return false
        return user
    }


    async login(username: string, password: string) {
        const user = this.users.find(u => u.username === username)
        if (!user) return false
        const isMatch: boolean = await bcrypt.compare(password, user.password)
        if (!isMatch) return false
        return user
    }

    async createnewUser(newUser: Omit<User, 'id'>) {
        const { username, firstname, lastname, password } = newUser
        const foundIndex = this.users.findIndex(u => u.username === username)
        if(foundIndex !== -1) return false
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = {
            id: uuidv4(),
            username,
            firstname,
            lastname,
            password: hashedPassword

        }
        this.users.push(user)
        return user
    }


}






export default new UserModel