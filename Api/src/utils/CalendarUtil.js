
// 农历
class Lunar {
  // 传入阳历日期
  constructor(solarDate = new Date){
    let offsetDays = (Date.UTC(solarDate.getFullYear(),solarDate.getMonth(),solarDate.getDate()) - Date.UTC(relativeYear,0,31))/86400000;
    // 减去要计算的年份对应的天数
    for(let i = relativeYear;i<2100;i++){
      // 获取对应年份的天数
      let yearDays = Lunar.yearDays(i)
      offsetDays -= yearDays;
      // 最后减成负数的话，要往回退一步
      if(offsetDays < 0){
        offsetDays+=yearDays;
        // 计算出当前阳历日期对应农历年份
        this.year = i;
        // 获取对应年份的闰月
        const leapMonth =  Lunar.leapMoth(i)
        this.isLeap = false;
        for(i = 1; i < 13 && offsetDays > 0;i++){
          // 闰月
          if(leapMonth > 0 && i == (leapMonth + 1) && !this.isLeap){
            i--;
            this.isLeap = true;
            // 返回对应年份闰月的天数
            yearDays = Lunar.leapDays(this.year);
          }else{// 非闰月
            yearDays = Lunar.monthDays(this.year,i)
          }
          // 解除闰月
          if(this.isLeap && i == (leapMonth+1)){
            this.isLeap = false
          }
          offsetDays -= yearDays;
        }
        if(offsetDays == 0 && leapMonth > 0 && i == leapMonth+1){
          if(this.isLeap){
            this.isLeap = false;
          }else{
            this.isLeap = true;
            i--
          }
        }
        if(offsetDays < 0){
          offsetDays += yearDays
          i--;
        }

        this.month = i;
        this.days = offsetDays + 1

        // break 大循环
        break;
      }
    }

    

  }

  // 返回农历对应年份闰那个月 1-12
  static leapMoth(year){
    const lm = Lunar.lunarInfo[year - relativeYear] & 0xf;
    return lm
  }

  // 返回农历对应年份闰月的天数
  static leapMonthDays(year){
    if(leapMonth(year)){
      return (Lunar.lunarInfo[year - (relativeYear-1)] & 0xf) == 0xf ? 30 : 29;
    }else{
      return 0;
    } 
  }

  // 返回对应year年month月份的总天
  static monthDays(year,month){
    return (lunarInfo[year-relativeYear] & (0x10000>>month))? 30: 29
  }

  // 返回农历对应年份的天数
  static yearDays(year){
    let sum = 348;
    for(let i = 0x8000; i>0x8; i>>=1){
      sum += (Lunar.lunarInfo[year-relativeYear] & i)? 1: 0;
    }
  }
}
Lunar.lunarInfo = new Array(
  0x4bd8, 0x4ae0, 0xa570, 0x54d5, 0xd260, 0xd950, 0x5554, 0x56af, 0x9ad0, 0x55d2,
  0x4ae0, 0xa5b6, 0xa4d0, 0xd250, 0xd255, 0xb54f, 0xd6a0, 0xada2, 0x95b0, 0x4977,
  0x497f, 0xa4b0, 0xb4b5, 0x6a50, 0x6d40, 0xab54, 0x2b6f, 0x9570, 0x52f2, 0x4970,
  0x6566, 0xd4a0, 0xea50, 0x6a95, 0x5adf, 0x2b60, 0x86e3, 0x92ef, 0xc8d7, 0xc95f,
  0xd4a0, 0xd8a6, 0xb55f, 0x56a0, 0xa5b4, 0x25df, 0x92d0, 0xd2b2, 0xa950, 0xb557,
  0x6ca0, 0xb550, 0x5355, 0x4daf, 0xa5b0, 0x4573, 0x52bf, 0xa9a8, 0xe950, 0x6aa0,
  0xaea6, 0xab50, 0x4b60, 0xaae4, 0xa570, 0x5260, 0xf263, 0xd950, 0x5b57, 0x56a0,
  0x96d0, 0x4dd5, 0x4ad0, 0xa4d0, 0xd4d4, 0xd250, 0xd558, 0xb540, 0xb6a0, 0x95a6,
  0x95bf, 0x49b0, 0xa974, 0xa4b0, 0xb27a, 0x6a50, 0x6d40, 0xaf46, 0xab60, 0x9570,
  0x4af5, 0x4970, 0x64b0, 0x74a3, 0xea50, 0x6b58, 0x5ac0, 0xab60, 0x96d5, 0x92e0,
  0xc960, 0xd954, 0xd4a0, 0xda50, 0x7552, 0x56a0, 0xabb7, 0x25d0, 0x92d0, 0xcab5,
  0xa950, 0xb4a0, 0xbaa4, 0xad50, 0x55d9, 0x4ba0, 0xa5b0, 0x5176, 0x52bf, 0xa930,
  0x7954, 0x6aa0, 0xad50, 0x5b52, 0x4b60, 0xa6e6, 0xa4e0, 0xd260, 0xea65, 0xd530,
  0x5aa0, 0x76a3, 0x96d0, 0x4afb, 0x4ad0, 0xa4d0, 0xd0b6, 0xd25f, 0xd520, 0xdd45,
  0xb5a0, 0x56d0, 0x55b2, 0x49b0, 0xa577, 0xa4b0, 0xaa50, 0xb255, 0x6d2f, 0xada0,
  0x4b63, 0x937f, 0x49f8, 0x4970, 0x64b0, 0x68a6, 0xea5f, 0x6b20, 0xa6c4, 0xaaef,
  0x92e0, 0xd2e3, 0xc960, 0xd557, 0xd4a0, 0xda50, 0x5d55, 0x56a0, 0xa6d0, 0x55d4,
  0x52d0, 0xa9b8, 0xa950, 0xb4a0, 0xb6a6, 0xad50, 0x55a0, 0xaba4, 0xa5b0, 0x52b0,
  0xb273, 0x6930, 0x7337, 0x6aa0, 0xad50, 0x4b55, 0x4b6f, 0xa570, 0x54e4, 0xd260,
  0xe968, 0xd520, 0xdaa0, 0x6aa6, 0x56df, 0x4ae0, 0xa9d4, 0xa4d0, 0xd150, 0xf252,
  0xd520);

// 1900 年参照
const relativeYear = 1900
// 1900 的干支序号
const relativeYearGZIndex = 36
const relativeMonthGZIndex = 12
const relativeDateGZIndex = 10
// 1900 节气
const relativeTermDate =  Date.UTC(relativeYear,0,6,2,5) 

class Solar {
 
  // 获取阳历对应月份的天数 month 索引
  static getDaysOfSolarMonth(year,month){
      if(month==1)//m等于1表示2月份
      return(((year%4 == 0) && (year%100 != 0) || (year%400 == 0))? 29: 28);
      else
      return(this.solarMonth[month]);
  }

  // 计算某年第 n 个节气为几日(从0小寒起算) 24节气
  static getYearTerm(year,index) {
    var offDate = new Date( ( 31556925974.7*(year-relativeYear) + Solar.sTermInfo[index]*60000  ) + relativeTermDate);
    return (offDate.getUTCDate());
  }
  
  // 传入年月
  constructor(date){
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate()

    // 阳历此年此月的第一天
    this.firstDayDate = new Date(year,month,1,0,0,0,0);
    // 获取当月的天数
    this.days = Solar.getDaysOfSolarMonth(year,month);
    // 获取公里1日星期几
    this.firstDayWeek = this.firstDayDate.getDay();

    // 立春
    this.spingOfBegin = Solar.getYearTerm(year,2)

    // 计算年柱  month < 2  前一年
    this.yearOffset = year - relativeYear + relativeYearGZIndex - (month < 2 ? 1 : 0);
    // 年干支索引
    this.yearGanIndex =  this.yearOffset % Solar.Gan.length;
    this.yearZhiIndex =  this.yearOffset % Solar.Zhi.length;
    // 年干支文字
    this.yearColumn =  Solar.Gan[this.yearGanIndex] + Solar.Zhi[this.yearZhiIndex];

    // 获取当月中的节气从几日开始
    this.monthFirstNode = Solar.getYearTerm(month*2);

    // 计算月柱
    this.monthOffset = (year - relativeYear) * 12 + month + relativeMonthGZIndex;
    this.monthGanIndex = this.monthOffset % Solar.Gan.length;
    this.monthZhiIndex = this.monthOffset % Solar.Zhi.length;
    // 月干支文字
    this.mothCloumn =  Solar.Gan[this.monthGanIndex] + Solar.Zhi[this.monthZhiIndex];

    // 计算日柱
    this.dateOffset = Date.UTC(year,month,day,0,0,0,0)/86400000 + 25567 + relativeDateGZIndex;
    this.dateGanIndex = this.dateOffset % Solar.Gan.length;
    this.dateZhiIndex = this.dateOffset % Solar.Zhi.length;
    this.dateColumn =  Solar.Gan[this.dateGanIndex] + Solar.Zhi[this.dateZhiIndex];

    // 计算农历日期
    this.luanr = new Lunar(date)
  }
}

// 静态属性
Solar.solarMonth=new Array(31,28,31,30,31,30,31,31,30,31,30,31);

 
Solar.Gan =  new Array("甲","乙","丙","丁","戊","己","庚","辛","壬","癸");
Solar.Zhi =  new Array("子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥");
Solar.sTermInfo = new Array(0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758);


module.exports = {
  Solar,
  Lunar
}