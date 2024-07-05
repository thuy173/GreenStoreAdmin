import { getApi, putApi, postApi2, deleteApi } from './agent';

const NutrientServices = {
  getAll: async () => {
    try {
      const result = await getApi(`nutrient`, '');
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  getById: async (id) => {
    try {
      const result = await getApi(`nutrient/${id}`, '');
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  addData: async (payload) => {
    try {
      const result = await postApi2('nutrient', payload);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
  editData: async (id, payload) => {
    try {
      const result = await putApi(`nutrient/${id}`, payload);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  deleteData: async (id) => {
    try {
      const result = await deleteApi(`nutrient/${id}`);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
};

export default NutrientServices;
