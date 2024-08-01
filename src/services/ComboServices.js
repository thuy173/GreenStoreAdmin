import { getApi, putApi2, postApi, deleteApi } from './agent';

const ComboServices = {
  getByBmi: async (status) => {
    try {
      const result = await getApi(`combo/byBmi?bmiStatus=${status}`, '');
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  getById: async (id) => {
    try {
      const result = await getApi(`combo/${id}`, '');
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  addData: async (payload) => {
    try {
      const result = await postApi('combo', payload);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
  editData: async (id, payload) => {
    try {
      const result = await putApi2(`combo/${id}`, payload);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  deleteData: async (id) => {
    try {
      const result = await deleteApi(`combo/${id}`);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
};

export default ComboServices;
