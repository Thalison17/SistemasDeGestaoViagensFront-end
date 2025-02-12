<<<<<<< HEAD
import api from '../services/api';

export default function useApi(url) {
  const list = async () => {
    const { data } = await api.get(url);
    return data;
  };

  const getById = async (id) => {
    if (id) {
      const response = await api.get(`${url}/${id}`);
      return response.data;
    }
    const response = await api.get(`${url}`);
    return response.data;
  };

  const post = async (form) => {
    const { data } = await api.post(url, form);
    return data;
  };

  const update = async (form) => {
    const { data } = await api.put(`${url}/${form?.id ? form.id : ''}`, form);
    console.log(data);
    return data;
  };

  const remove = async (id) => {
    const { data } = await api.delete(`${url}/${id}`);
    return data;
  };
=======
import api from '../services/api'

export default function useApi(url) {
  const list = async () => {
    const { data } = await api.get(url)
    return data
  }

  const getById = async (id) => {
    if (id) {
      const response = await api.get(`${url}/${id}`)
      return response.data
    }
    const response = await api.get(`${url}`)
    return response.data
  }

  const post = async (form) => {
    const { data } = await api.post(url, form)
    return data
  }

  const update = async (form) => {
    const { data } = await api.put(`${url}/${form?.id ? form.id : ''}`, form)
    console.log(data)
    return data
  }

  const remove = async (id) => {
    const { data } = await api.delete(`${url}/${id}`)
    return data
  }
>>>>>>> 2926bb1 (Salvando alterações locais antes de mudar de branch)

  return {
    list,
    post,
    update,
    remove,
    getById,
<<<<<<< HEAD
  };
=======
  }
>>>>>>> 2926bb1 (Salvando alterações locais antes de mudar de branch)
}
