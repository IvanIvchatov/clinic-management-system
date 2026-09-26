import axios from "axios";
import User from "../models/user"
export const userService = {
    getAll,
    add,
    edit
};

async function getAll() {
    const res = await axios.get(`http://127.0.0.1:8000/api/users`)
    const users = res.data.data.map(user => new User(user))
    return users;
}

async function add(user) {
    const res = await axios.post(`http://127.0.0.1:8000/api/users`,user)
    const data = new User(res.data.data)
    return data;
}

async function edit(user) {
    const res = await axios.put(`http://127.0.0.1:8000/api/users/${user['id']}`,user)
    const data = new User(res.data.data)
    return data;
}