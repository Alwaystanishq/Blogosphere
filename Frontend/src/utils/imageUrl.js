import api from "../api/api";

export const imageUrl = (path) => new URL(path, api.defaults.baseURL).href;
