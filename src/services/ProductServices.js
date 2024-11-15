import { getApi, putApi, putApi2, postApi2, deleteApi } from './agent';

const ProductServices = {
  getAll: async () => {
    try {
      const result = await getApi(`product/allStatus`, '');
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  getDataPagination: async (page, size) => {
    try {
      const result = await getApi(`product?page=${page}&size=${size}`, '');
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

  addImages: async (id, payload) => {
    try {
      const result = await postApi2(`product/${id}/images`, payload);
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

  changeImage: async (productId, index, payload) => {
    try {
      const result = await putApi(`product/${productId}/images/${index}`, payload);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  showData: async (id) => {
    try {
      const result = await putApi2(`product/active/${id}`, '');
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  hideData: async (id) => {
    try {
      const result = await deleteApi(`product/soft/${id}`);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
};

export default ProductServices;
