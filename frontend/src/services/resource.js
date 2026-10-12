import axios from "axios";

// Thin REST client for a Laravel resource route: GET / POST / PUT / DELETE /api/{name}
export function resource(name) {
  const url = `/api/${name}`;
  return {
    async getAll() {
      const res = await axios.get(url);
      return res.data.data;
    },
    async add(item) {
      const res = await axios.post(url, item);
      return res.data.data;
    },
    async edit(item) {
      const res = await axios.put(`${url}/${item.id}`, item);
      return res.data.data;
    },
    async remove(item) {
      await axios.delete(`${url}/${item.id}`);
      return item;
    },
  };
}
