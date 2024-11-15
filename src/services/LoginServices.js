import { postApi } from './agent';

const LoginServices = {
  Login: async (payload) => {
    try {
      const result = await postApi('login', payload);
      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
};

export default LoginServices;
