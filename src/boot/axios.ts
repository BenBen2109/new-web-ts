import axios from 'axios';

export default ({ Vue }: { Vue: any }) => {
  Vue.prototype.$axios = axios;
};
