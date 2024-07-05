import { getApi, putApi, postApi2, deleteApi } from './agent';

const ProductServices = {
  getAll: async () => {
    try {
      const result = await getApi(`product`, '');
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  getById: async (id) => {
    try {
      const result = await getApi(`product/${id}`, '');
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  addData: async (payload) => {
    try {
      const result = await postApi2('product', payload);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
  editData: async (id, payload) => {
    try {
      const result = await putApi(`product/${id}`, payload);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  deleteData: async (id) => {
    try {
      const result = await deleteApi(`product/${id}`);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
};

export default ProductServices;
