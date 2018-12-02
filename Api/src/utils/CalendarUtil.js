module.exports = class CalendarUtil {
  
  // 天干
  static Gan = new Array("甲","乙","丙","丁","戊","己","庚","辛","壬","癸");

  // 地支
  static Zhi = new Array("子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥");


  static solarMonth=new Array(31,28,31,30,31,30,31,31,30,31,30,31);

  // 获取阳历对应月份的天数
  static getDaysOfSolarMonth(year,month){
      if(m==1)//m等于1表示2月份
      return(((y%4 == 0) && (y%100 != 0) || (y%400 == 0))? 29: 28);
      else
      return(solarMonth[m]);
  }
}