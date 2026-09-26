import axios from "axios";
import User from "../models/user"
export const authService = {
    login,
    logout
};

async function login(email, password) {
       const res = await axios.post(`http://127.0.0.1:8000/api/login`, { email , password  } )
       const userData = res.data.data.user
       userData.token = res.data.data.token
       const user = new User(userData)
       if (user.token) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    return user;
}

function logout() {
    localStorage.removeItem('user');
}