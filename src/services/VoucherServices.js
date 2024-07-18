import { getApi, putApi2, postApi2, deleteApi } from './agent';

const VoucherServices = {
  getAll: async () => {
    try {
      const result = await getApi(`voucher`, '');
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  addData: async (payload) => {
    try {
      const result = await postApi2('voucher', payload);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
  editData: async (id, payload) => {
    try {
      const result = await putApi2(`voucher/${id}`, payload);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
  showData: async (id, payload) => {
    try {
      const result = await putApi2(`voucher/active/${id}`, payload);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },

  deleteData: async (id) => {
    try {
      const result = await deleteApi(`voucher/${id}`);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
};

export default VoucherServices;
