//时间转换
export const formatDate = function (time) {
	var date = new Date(time * 1000);
	var YY = date.getFullYear() + "-";
	var MM =
		(date.getMonth() + 1 < 10
			? "0" + (date.getMonth() + 1)
			: date.getMonth() + 1) + "-";
	var DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
	var hh =
		(date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
	var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
	//var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
	return YY + MM + DD + " " + hh + mm;
};
//
export const timeMat = function (time) {
	if (!time) {
		return '00:00';
	}
	var minutes = Math.floor((time / 60 % 60)) < 10 ? '0' + Math.floor((time / 60 % 60)) : Math.floor((time / 60 % 60));
	var seconds = Math.floor((time % 60)) < 10 ? '0' + Math.floor((time % 60)) : Math.floor((time % 60));
	return `${minutes}:${seconds}`;
};
//
export const timeMat1 = function (time) {
	if (!time) {
		return '00:00:00';
	}
	var hours = Math.floor((time / 3600)).toString().padStart(2, '0');
	var minutes = Math.floor((time / 60 % 60)).toString().padStart(2, '0');
	var seconds = Math.floor((time % 60)).toString().padStart(2, '0');
	return `${hours}:${minutes}:${seconds}`;
};
export const timeMat2 = function (time) {
	if (!time) {
		return '0秒';
	}
	let hours = Math.floor((time / 3600));
	let minutes = Math.floor((time / 60 % 60));
	let seconds = Math.floor((time % 60));
	let val = ''
	if (hours) {
		val += hours + '小时'
	}
	if (minutes) {
		val += minutes.toString().padStart(2, '0') + '分钟'
	}
	if (seconds) {
		val += seconds.toString().padStart(2, '0') + '秒'
	}
	return val;
};

/**
 * @summary 根据时间及格式获取时间的字符串
 * @param {int} iDate 时间
 * @param {string} sFormat 格式，默认：yyyy-MM-dd HH:mm:ss
 * @return {string} 格式化后的日期字符串
 * @example
 *    formatDate(new Date(),'yyyy-MM-dd HH:mm:ss SSS');// 2017-6-6 11:11:11
 */
 export const formatDate2 = (iDate, sFormat = 'yyyy-MM-dd HH:mm:ss') => {
  if (!iDate) { return ''; }
  let dDate = new Date(iDate);
  let year = dDate.getFullYear();// 年
  let month = dDate.getMonth() + 1;// 月
  if (month < 10) { month = '0' + month; }
  let date = dDate.getDate();// 日
  if (date < 10) { date = '0' + date; }
  let hour = dDate.getHours();// 时
  if (hour < 10) { hour = '0' + hour; }
	let hour12 = +hour < 12 ? +hour : +hour - 12
	if (hour12 < 10) { hour12 = '0' + hour12; }
  let minute = dDate.getMinutes();// 分
  if (minute < 10) { minute = '0' + minute; }
  let second = dDate.getSeconds();// 秒
  if (second < 10) { second = '0' + second; }
  let millisecond = dDate.getMilliseconds();// 毫秒
  if (sFormat.indexOf('yyyy') >= 0) { sFormat = sFormat.replace('yyyy', year + ''); }
  if (sFormat.indexOf('MM') >= 0) { sFormat = sFormat.replace('MM', month + ''); }
  if (sFormat.indexOf('dd') >= 0) { sFormat = sFormat.replace('dd', date + ''); }
  if (sFormat.indexOf('HH') >= 0) { sFormat = sFormat.replace('HH', hour + ''); }
	if (sFormat.indexOf('hh') >= 0) { sFormat = sFormat.replace('hh', hour12 + ''); }
  if (sFormat.indexOf('mm') >= 0) { sFormat = sFormat.replace('mm', minute + ''); }
  if (sFormat.indexOf('ss') >= 0) { sFormat = sFormat.replace('ss', second + ''); }
  if (sFormat.indexOf('SSS') >= 0) { sFormat = sFormat.replace('SSS', millisecond + ''); }
  return sFormat;
};

/**
 * @summary 将日期字符串根据指定的格式进行识别，转换为Date对象
 * @param {string} dateString 日期；示例：2022-01-12-08-45-12，2022/01/12 08:45:12
 * @param {string} sFormat 格式，默认：yyyy[-/: ]MM[-/: ]dd[-/: ]HH[-/: ]mm[-/: ]ss ; ([]中的是指分隔符)
 * @return {string} Date对象
 */
export const dateParse = (dateString, sFormat = 'yyyy[-/: ]MM[-/: ]dd[-/: ]HH[-/: ]mm[-/: ]ss') => {
	if (!dateString) {
		return new Date()
	}
	let regS = sFormat
	let sFIndex = [
		{
			key: 'yyyy',
			index: -1,
		},
		{
			key: 'MM',
			index: -1,
		},
		{
			key: 'dd',
			index: -1,
		},
		{
			key: 'HH',
			index: -1,
		},
		{
			key: 'mm',
			index: -1,
		},
		{
			key: 'ss',
			index: -1,
		}
	]
	if (sFormat.indexOf('yyyy') >= 0) {
		regS = regS.replace('yyyy', '(\\d{4})')
		sFIndex[0].index = sFormat.indexOf('yyyy')
	}
  if (sFormat.indexOf('MM') >= 0) {
		regS = regS.replace('MM', '(\\d{1,2})')
		sFIndex[1].index = sFormat.indexOf('MM')
	}
  if (sFormat.indexOf('dd') >= 0) {
		regS = regS.replace('dd', '(\\d{1,2})')
		sFIndex[2].index = sFormat.indexOf('dd')
	}
  if (sFormat.indexOf('HH') >= 0) {
		regS = regS.replace('HH', '(\\d{1,2})')
		sFIndex[3].index = sFormat.indexOf('HH')
	}
  if (sFormat.indexOf('mm') >= 0) {
		regS = regS.replace('mm', '(\\d{1,2})')
		sFIndex[4].index = sFormat.indexOf('mm')
	}
  if (sFormat.indexOf('ss') >= 0) {
		regS = regS.replace('ss', '(\\d{1,2})')
		sFIndex[5].index = sFormat.indexOf('ss')
	}
	sFIndex = sFIndex.filter(item => {
		return item.index >= 0
	})
	sFIndex.sort((a, b)=>{
		return a.index - b.index
	})
	// console.log(sFIndex)
	// const dateReg = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d+)?$/
	const dateReg = new RegExp(regS)
	console.log(regS)
  const d = dateString.match(dateReg)
	// console.log(d)
	if (d) {
		let sObj = {}
		for (let i = 0; i < sFIndex.length; i++) {
			sObj[sFIndex[i].key] = d[i + 1]
		}
		const yyyy = sObj.yyyy || 0,
					MM = sObj.MM - 1 || 0,
					dd = sObj.dd || 1,
					HH = sObj.HH || 0,
					mm = sObj.mm || 0,
					ss = sObj.ss || 0
		return new Date(yyyy, MM, dd, HH, mm, ss)
	}
	return Date()
}