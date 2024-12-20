import { getApi, putApi2, postApi2, deleteApi } from './agent';

const CustomerServices = {
  getAll: async () => {
    try {
      const result = await getApi(`customer`, '');
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  getById: async (id) => {
    try {
      const result = await getApi(`customer/${id}`, '');
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  addData: async (payload) => {
    try {
      const result = await postApi2('customer', payload);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
  editData: async (id, payload) => {
    try {
      const result = await putApi2(`customer/${id}`, payload);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  deleteData: async (id) => {
    try {
      const result = await deleteApi(`customer/${id}`);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
};

export default CustomerServices;
