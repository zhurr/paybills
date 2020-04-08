  /** 地址栏信息**/
  function getUrlKey(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
  }

  /*
   *字符串型数字、数字型数字保留小数
   *num：当前数字、数字型字符串
   *pointNum：保留位数
   */
  function fixedNumber(num = 0, pointNum = 0) {
    num = (Number(num)).toFixed(pointNum);
    return Number(num);
  }

  /*
   *字符串型数字、数字型数字超过千处理
   *num：当前数字
   *pointNum：保留位数
   *keepMinNum：true小于1千的数字保留原位数
   */
  function fixedNumberK(num = 0, pointNum = 0, keepMinNum = false) {
    num = Number(num);
    if (num > 1000) {
      num = (num / 1000).toFixed(pointNum) + 'K';
    } else {
      if (!keepMinNum) {
        num = (num).toFixed(pointNum);
      } else {
        num = num;
      }

    }
    return num;
  }

  /*
   *除法：字符串型数字、数字型数字
   *num：当前数字
   *total：总数
   *pointNum：保留位数
   */
  function divisionNumber(num = 0, total = 0, pointNum = 0) {
    num = Number(num);
    total = Number(total);
    let res = 0;
    if (total) {
      res = num / total
    } else {
      res = 0;
    }
    return fixedNumber(res, pointNum)
  }

  /*
   *xMonth：根据当前月获得某一个月份
   *num：获得当前月往前后推的月份（默认下个月，负数上月）
   *yearFormat：年、月之间的格式
   *monthFormat：月格式
   */
  function xMonth(num = 0, yearFormat = '-', monthFormat = '') {
    let date = new Date();
    let year = date.getFullYear(); //当年
    let curMonth = date.getMonth() + 1; //当月(getMonth0~11)
    let month = curMonth + num;
    if (month === 0) {
      month = 12;
      year = year - 1;
    } else if (month < 0) {
      month = 12 + month;
      year = year - 1;
    } else if (month > 12) {
      month = month - 12;
      year = year + 1;
    }

    if (month > 9) {
      month = month;
    } else {
      month = '0' + month;
    }
    let result = year + yearFormat + month;
    if (monthFormat) {
      result = result + monthFormat;
    }
    return result;
  }



  export {
    getUrlKey,
    fixedNumber,
    fixedNumberK,
    divisionNumber,
    xMonth

  }