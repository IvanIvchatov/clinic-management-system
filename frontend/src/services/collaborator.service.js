import axios from "axios";
import Collaborator from "../models/collaborator"
export const serviceCollaborator = {
    getAll,
    add,
    edit,
    remove
};

async function getAll() {
    const res = await axios.get(`http://127.0.0.1:8000/api/collaborator`)
    const collaborators = res.data.data.map(collaborators => new Collaborator(collaborators))
    return collaborators;
}

async function add(collaborator) {
    debugger
    const res = await axios.post(`http://127.0.0.1:8000/api/collaborator`,collaborator)
    const data = new Collaborator(res.data.data)
    debugger
    return data;
}

async function edit(collaborator) {
    const res = await axios.put(`http://127.0.0.1:8000/api/collaborator/${collaborator['id']}`,collaborator)
    const data = new Collaborator(res.data.data)
    return data;
}
async function remove(collaborator) {
    const res = await axios.delete(`http://127.0.0.1:8000/api/collaborator/${collaborator['id']}`,collaborator)
    const data = new Collaborator(res.data.data)
    return data;
}