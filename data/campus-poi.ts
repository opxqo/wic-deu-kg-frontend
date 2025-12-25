
export type CategoryType = 'canteen' | 'dorm' | 'building' | 'sports' | 'service' | 'other';

export interface POI {
  id: string;
  name: string;
  description: string;
  coords: { longitude: number; latitude: number };
  category: CategoryType;
}

const rawData = [
  {
    "id": "donghu",
    "name": "📍 东湖校区 (Donghu)",
    "description": "大操场",
    "lng": 114.423496,
    "lat": 30.588613
  },
  {
    "id": "hongan",
    "name": "🏭 红安校区 (Hongan)",
    "description": "智能制造基地",
    "lng": 114.571833,
    "lat": 31.078671
  },
  {
    "id": "custom-1764392880177",
    "name": "南苑一舍",
    "description": "学生宿舍",
    "lng": 114.42253346537427,
    "lat": 30.58914403308208
  },
  {
    "id": "custom-1764392910799",
    "name": "体育馆",
    "description": "室内运动场",
    "lng": 114.42335893546738,
    "lat": 30.587398860098034
  },
  {
    "id": "custom-1764392935159",
    "name": "南苑三舍",
    "description": "学生宿舍",
    "lng": 114.42253464339836,
    "lat": 30.588177527586154
  },
  {
    "id": "custom-1764393038217",
    "name": "南苑四舍",
    "description": "学生宿舍",
    "lng": 114.42342608891414,
    "lat": 30.589745938635033
  },
  {
    "id": "custom-1764393050487",
    "name": "南苑五舍",
    "description": "学生宿舍",
    "lng": 114.42416391068218,
    "lat": 30.589738616545418
  },
  {
    "id": "custom-1764393069350",
    "name": "学部楼",
    "description": "综合教学楼",
    "lng": 114.42192010138268,
    "lat": 30.589167193987976
  },
  {
    "id": "custom-1764393088590",
    "name": "行政楼",
    "description": "学校行政办公",
    "lng": 114.42143102013523,
    "lat": 30.58903673727383
  },
  {
    "id": "custom-1764393111367",
    "name": "财务部财务结算大厅",
    "description": "缴费与报销",
    "lng": 114.42098281407885,
    "lat": 30.589042987369496
  },
  {
    "id": "custom-1764393146909",
    "name": "南4教学楼",
    "description": "教学区",
    "lng": 114.42100550241776,
    "lat": 30.58755357560409
  },
  {
    "id": "custom-1764393174258",
    "name": "南5教学楼",
    "description": "教学区",
    "lng": 114.42106453887789,
    "lat": 30.587138238449143
  },
  {
    "id": "custom-1764393193202",
    "name": "南7教学楼",
    "description": "教学区",
    "lng": 114.42004952786431,
    "lat": 30.58653463380803
  },
  {
    "id": "custom-1764393212567",
    "name": "南2教学楼",
    "description": "教学区",
    "lng": 114.42003976912974,
    "lat": 30.587421962767195
  },
  {
    "id": "custom-1764393223726",
    "name": "南3教学楼",
    "description": "教学区",
    "lng": 114.4200575659122,
    "lat": 30.586987867092617
  },
  {
    "id": "custom-1764393241585",
    "name": "图书馆",
    "description": "学习与阅读",
    "lng": 114.42044882952939,
    "lat": 30.588407830142415
  },
  {
    "id": "custom-1764393258167",
    "name": "实训楼",
    "description": "实验与实践",
    "lng": 114.42051857451457,
    "lat": 30.5890942363351
  },
  {
    "id": "custom-1764393284988",
    "name": "北苑一舍",
    "description": "学生宿舍",
    "lng": 114.41995938880467,
    "lat": 30.58975899354428
  },
  {
    "id": "custom-1764393636609",
    "name": "湖",
    "description": "校园景观",
    "lng": 114.42164550626944,
    "lat": 30.588557500347918
  },
  {
    "id": "custom-1764393652035",
    "name": "足球场",
    "description": "室外运动场",
    "lng": 114.42242256860857,
    "lat": 30.587093709937804
  },
  {
    "id": "custom-1764393667928",
    "name": "医疗室",
    "description": "校医务室",
    "lng": 114.42189369587823,
    "lat": 30.587927228454973
  },
  {
    "id": "custom-1764393905906",
    "name": "落雁派出所警务室",
    "description": "校园安全",
    "lng": 114.42301753541102,
    "lat": 30.590845174907344
  },
  {
    "id": "custom-1764393965382",
    "name": "大食堂",
    "description": "主要餐饮区",
    "lng": 114.42153832748113,
    "lat": 30.590444820494085
  },
  {
    "id": "custom-1764394014650",
    "name": "北苑3舍",
    "description": "学生宿舍",
    "lng": 114.42327017424873,
    "lat": 30.591234100867965
  },
  {
    "id": "custom-1764394038908",
    "name": "北苑10舍",
    "description": "学生宿舍",
    "lng": 114.42336954088205,
    "lat": 30.591885364646558
  },
  {
    "id": "custom-1764394056040",
    "name": "北苑5舍",
    "description": "学生宿舍",
    "lng": 114.42263591001426,
    "lat": 30.591635165836976
  },
  {
    "id": "custom-1764394071599",
    "name": "北苑9舍",
    "description": "学生宿舍",
    "lng": 114.42249641362116,
    "lat": 30.59186346371365
  },
  {
    "id": "custom-1764394102317",
    "name": "北苑4舍",
    "description": "学生宿舍",
    "lng": 114.42189059837716,
    "lat": 30.591263972125887
  },
  {
    "id": "custom-1764394115318",
    "name": "北苑7舍",
    "description": "学生宿舍",
    "lng": 114.42172612464822,
    "lat": 30.59159240559343
  },
  {
    "id": "custom-1764394140732",
    "name": "北苑6舍",
    "description": "学生宿舍",
    "lng": 114.42092326793102,
    "lat": 30.59141321504228
  },
  {
    "id": "custom-1764394159667",
    "name": "北苑8舍",
    "description": "学生宿舍",
    "lng": 114.42126683739997,
    "lat": 30.591833090482126
  },
  {
    "id": "custom-1764394193203",
    "name": "小食堂",
    "description": "特色餐饮",
    "lng": 114.42254423497423,
    "lat": 30.59119320634906
  },
  {
    "id": "custom-1764394237661",
    "name": "零食很忙",
    "description": "便利店",
    "lng": 114.4219058625049,
    "lat": 30.590977227815472
  },
  {
    "id": "custom-1764394314584",
    "name": "南苑小卖部",
    "description": "便利店",
    "lng": 114.42269723975107,
    "lat": 30.58961617066838
  },
  {
    "id": "custom-1764394784484",
    "name": "北苑1舍",
    "description": "学生宿舍",
    "lng": 114.42389092718622,
    "lat": 30.590395291611102
  },
  {
    "id": "custom-1764394795951",
    "name": "北苑2舍",
    "description": "学生宿舍",
    "lng": 114.42390062545564,
    "lat": 30.590803524497133
  }
];

// Data processing logic to auto-assign categories
export const CAMPUS_POIS: POI[] = rawData.map((item) => {
  let category: CategoryType = 'other';
  const n = item.name;

  if (n.includes('食堂') || n.includes('小卖部') || n.includes('零食') || n.includes('Cafe')) category = 'canteen';
  else if (n.includes('宿舍') || n.includes('南苑') || n.includes('北苑')) category = 'dorm';
  else if (n.includes('教学楼') || n.includes('实训楼') || n.includes('学部') || n.includes('行政') || n.includes('图书馆') || n.includes('财务')) category = 'building';
  else if (n.includes('体育') || n.includes('足球') || n.includes('操场')) category = 'sports';
  else if (n.includes('医疗') || n.includes('警务') || n.includes('医院')) category = 'service';

  return {
    id: item.id,
    name: item.name,
    description: item.description,
    coords: { longitude: item.lng, latitude: item.lat },
    category
  };
});
