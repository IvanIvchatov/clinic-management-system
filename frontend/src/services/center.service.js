

import axios from "axios";
import Center from "../models/center"

export const centerService = {
    getAllCenters
}
async function getAllCenters(){
    const res = await axios.get(`http://127.0.0.1:8000/api/centers`)

    const centers = res.data.data.map(center => new Center(center))
    return centers;
}