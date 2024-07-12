import { getApi, putApi2, postApi2, deleteApi } from './agent';

const BlogServices = {
  getAll: async () => {
    try {
      const result = await getApi(`blog`, '');
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  getById: async (id) => {
    try {
      const result = await getApi(`blog/${id}`, '');
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  addData: async (payload) => {
    try {
      const result = await postApi2('blog', payload);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
  editData: async (id, payload) => {
    try {
      const result = await putApi2(`blog/${id}`, payload);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  deleteData: async (id) => {
    try {
      const result = await deleteApi(`blog/${id}`);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
};

export default BlogServices;
