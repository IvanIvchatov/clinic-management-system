import axios from "axios";
import Service from "../models/service"
export const serviceService = {
    getAll,
    add,
    edit,
    remove
};

async function getAll() {
    const res = await axios.get(`http://127.0.0.1:8000/api/services`)
    const services = res.data.data.map(services => new Service(services))
    return services;
}

async function add(service) {
    const res = await axios.post(`http://127.0.0.1:8000/api/services`,service)
    const data = new Service(res.data.data)
    return data;
}

async function edit(service) {
    const res = await axios.put(`http://127.0.0.1:8000/api/services/${service['id']}`,service)
    const data = new Service(res.data.data)
    return data;
}
async function remove(service) {
    const res = await axios.delete(`http://127.0.0.1:8000/api/services/${service['id']}`,service)
    const data = new Service(res.data.data)
    return data;
}
