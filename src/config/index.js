import axios from "axios";

export const api = axios.create({
  baseURL:'http://localhost:5166/api/Event/Publish?source=',
  headers: {
    "Access-Control-Allow-Origin": "*",
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    }
})
  