// 用户信息缓存
export default {
  state: {
    //一级部门
    department1: '',
    //二级部门
    department2: '',
    //时间
    monthlyTime: '',
  },
  mutations: {
    //设置用户信息
    setUser(state, data) {
      let allKeys = Object.keys(state);
      for (let key in data) {
        if (allKeys.indexOf(key) > -1) {
          state[key] = data[key];
        }
      }
    },
  },

  actions: {
    // setComponent(context, data = []) {
    //   context.commit('setComponenet', data);
    // }
  }


}