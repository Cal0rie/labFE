/**
 * @returns {String} 当前浏览器名称
 */
export const getExplorer = () => {
  const ua = window.navigator.userAgent;
  const isExplorer = (exp) => {
    return ua.indexOf(exp) > -1;
  };
  if (isExplorer('MSIE')) return 'IE';
  else if (isExplorer('Firefox')) return 'Firefox';
  else if (isExplorer('Chrome')) return 'Chrome';
  else if (isExplorer('Opera')) return 'Opera';
  else if (isExplorer('Safari')) return 'Safari';
};

/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
    };
  }
})();

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
})();

/**
 * @description 返回当前时间
 * @param {String} timeStr 分割线
 */
export const getDate = (timeStr = '-') => {
  const curDate = new Date();
  const curYear = curDate.getFullYear(); // 获取完整的年份(4位,1970-????)
  const curMonth = curDate.getMonth() + 1; // 获取当前月份(0-11,0代表1月)
  const curDay = curDate.getDate(); // 获取当前日(1-31)
  const curHour = curDate.getHours(); // 获取当前小时数(0-23)
  const curMinute = curDate.getMinutes(); // 获取当前分钟数(0-59)
  const curSec = curDate.getSeconds(); // 获取当前秒数(0-59)
  const Current = curYear + timeStr + curMonth + timeStr + curDay + ' ' + curHour + ':' + curMinute + ':' + curSec;
  return Current;
};
