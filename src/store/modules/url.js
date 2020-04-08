// 地址栏参数缓存
export default {
  state: {
    params: {
      //一级部门
      department1: '',
      //二级部门
      department2: '',
      //时间
      monthlyTime: ''
    }

  },
  mutations: {
    //url参数
    setUrlParams(state, data) {
      let allKeys = Object.keys(state.params);
      for (let key in data) {
        if (allKeys.indexOf(key) > -1) {
          state.params[key] = data[key];
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