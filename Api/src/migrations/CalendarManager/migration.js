const force =  false;

const  { TianGan,DiZhi,GanZhi } = require('../allModel')

TianGan.belongsTo(GanZhi,{foreignKey:'tiangan_id'})
DiZhi.belongsTo(GanZhi,{foreignKey:'dizhi_id'})

const { tiangan,dizhi} = require('../../meta/metadata')
  
// 创建表
const fn =  (async (callback)=> {
  // 创建表
  await GanZhi.sync({force:force})
  await TianGan.sync({force:force})
  await DiZhi.sync({force:force})

  // 创建天干地支
  let count =  await TianGan.count()
  if(count <= 0){
    await TianGan.bulkCreate(tiangan)
  }
  count  = await DiZhi.count()
  if(count <= 0){
    await DiZhi.bulkCreate(dizhi)
  }

  // 创建组合
  count = await GanZhi.count()
  if(count <= 0){
    let data = []
    for(let i = 0;i < 60;i++){
      const tianganIndex = i%10;
      const dizhiIndex = i%12;
      const tianganItem =  tiangan[tianganIndex];
      const dizhiItem = dizhi[dizhiIndex];
      data.push({
        name:tianganItem.name + dizhiItem.name,
        pinyin:tianganItem.pinyin + dizhiItem.pinyin,
        tiangan_id:tianganIndex+1,
        dizhi_id:dizhiIndex+1,
        is_yang:tianganItem.is_yang,
      })
    }
    await GanZhi.bulkCreate(data)
  }

  callback()
})


module.exports = function(){
   return new Promise((resolove)=>{
      fn(()=>{
          resolove(true) 
      })
   })
}
