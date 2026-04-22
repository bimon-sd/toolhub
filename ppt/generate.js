const PptxGenJS = require("pptxgenjs");

const pptx = new PptxGenJS();

pptx.author = "青岛弘博电缆有限公司";
pptx.title = "新业务入职培训";
pptx.subject = "汽车线束 & 家电线束业务培训";
pptx.company = "青岛弘博电缆有限公司";

const COLORS = {
  primary: "2B5797",
  primaryDark: "1E3A5F",
  secondary: "3498DB",
  accent: "E67E22",
  accentLight: "F39C12",
  bgLight: "F8F9FA",
  bgWhite: "FFFFFF",
  textDark: "2C3E50",
  textLight: "FFFFFF",
  textMuted: "7F8C8D",
  border: "BDC3C7",
  success: "27AE60",
  warning: "F39C12",
  danger: "E74C3C",
  tableHeader: "34495E",
  tableAlt: "ECF0F1"
};

const FONTS = {
  title: "微软雅黑",
  body: "微软雅黑"
};

pptx.layout = "LAYOUT_16x9";

function addSlideNumber(slide, num, total) {
  slide.addText(`${num} / ${total}`, {
    x: 9.2, y: 5.3, w: 0.6, h: 0.25,
    fontSize: 10, color: COLORS.textMuted, align: "right"
  });
}

function addFooter(slide, section) {
  slide.addText(section, {
    x: 0.4, y: 5.3, w: 3, h: 0.25,
    fontSize: 10, color: COLORS.textMuted
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 5.45, w: 10, h: 0.02,
    fill: { color: COLORS.border }
  });
}

function createTitleSlide(num, total) {
  let slide = pptx.addSlide();
  slide.background = { color: COLORS.primaryDark };

  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: COLORS.primaryDark }
  });

  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 1.8, w: 0.08, h: 2,
    fill: { color: COLORS.accent }
  });

  slide.addText("青岛弘博电缆有限公司", {
    x: 0.8, y: 1.8, w: 8, h: 0.6,
    fontSize: 18, fontFace: FONTS.title, color: COLORS.secondary,
    bold: false
  });

  slide.addText("新业务入职培训", {
    x: 0.8, y: 2.4, w: 8, h: 1,
    fontSize: 44, fontFace: FONTS.title, color: COLORS.textLight,
    bold: true
  });

  slide.addText("汽车线束  ·  家电线束", {
    x: 0.8, y: 3.4, w: 8, h: 0.5,
    fontSize: 20, fontFace: FONTS.body, color: COLORS.textMuted
  });

  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8, y: 4.3, w: 2, h: 0.5,
    fill: { color: COLORS.accent }
  });

  slide.addText("技术型销售培养计划", {
    x: 0.8, y: 4.3, w: 2, h: 0.5,
    fontSize: 12, fontFace: FONTS.body, color: COLORS.textLight,
    align: "center", valign: "middle"
  });

  addSlideNumber(slide, num, total);
  return slide;
}

function createSectionSlide(num, total, sectionNum, title) {
  let slide = pptx.addSlide();
  slide.background = { color: COLORS.primary };

  slide.addText(sectionNum, {
    x: 0.5, y: 1.5, w: 1.5, h: 1,
    fontSize: 72, fontFace: FONTS.title, color: COLORS.accent,
    bold: true
  });

  slide.addText(title, {
    x: 0.5, y: 2.6, w: 9, h: 1,
    fontSize: 40, fontFace: FONTS.title, color: COLORS.textLight,
    bold: true
  });

  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 3.7, w: 3, h: 0.06,
    fill: { color: COLORS.accent }
  });

  addSlideNumber(slide, num, total);
  return slide;
}

function createContentSlide(num, total, title, section) {
  let slide = pptx.addSlide();
  slide.background = { color: COLORS.bgLight };

  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 0.9,
    fill: { color: COLORS.primary }
  });

  slide.addText(title, {
    x: 0.5, y: 0.2, w: 9, h: 0.6,
    fontSize: 26, fontFace: FONTS.title, color: COLORS.textLight,
    bold: true, margin: 0
  });

  addFooter(slide, section);
  addSlideNumber(slide, num, total);
  return slide;
}

function addBulletList(slide, items, x, y, w, h, options = {}) {
  const bulletItems = items.map((item, idx) => ({
    text: item,
    options: { bullet: true, breakLine: idx < items.length - 1 }
  }));

  slide.addText(bulletItems, {
    x, y, w, h,
    fontSize: options.fontSize || 14,
    fontFace: FONTS.body,
    color: options.color || COLORS.textDark,
    paraSpaceAfter: options.spaceAfter || 6
  });
}

function addCard(slide, x, y, w, h, title, content, titleColor) {
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h,
    fill: { color: COLORS.bgWhite },
    line: { color: COLORS.border, width: 0.5 },
    shadow: { type: "outer", blur: 3, offset: 2, angle: 45, opacity: 0.15 }
  });

  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h: 0.45,
    fill: { color: titleColor || COLORS.primary }
  });

  slide.addText(title, {
    x: x + 0.15, y: y + 0.05, w: w - 0.3, h: 0.4,
    fontSize: 13, fontFace: FONTS.title, color: COLORS.textLight,
    bold: true, margin: 0
  });

  slide.addText(content, {
    x: x + 0.15, y: y + 0.55, w: w - 0.3, h: h - 0.7,
    fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark,
    valign: "top"
  });
}

const TOTAL = 28;

createTitleSlide(1, TOTAL);

let slide2 = createContentSlide(2, TOTAL, "目录", "CONTENTS");
slide2.addText("培训内容导航", {
  x: 0.5, y: 1.1, w: 9, h: 0.5,
  fontSize: 18, fontFace: FONTS.title, color: COLORS.primary, bold: true
});

const tocItems = [
  { num: "01", title: "公司认知", desc: "公司简介 · 产品家族 · 应用场景" },
  { num: "02", title: "岗位职责", desc: "岗位定位 · 职责清单 · 价值链条" },
  { num: "03", title: "对内联系", desc: "内部架构 · 生产部 · 技术部 · 采购/品质/财务" },
  { num: "04", title: "对外联系", desc: "客户分布 · 供应商联络 · 沟通规范" },
  { num: "05", title: "生产工艺", desc: "工艺流程 · 关键工序 · 生产周期" },
  { num: "06", title: "关键盯控点", desc: "质量红线 · 交期预警 · 成本意识" },
  { num: "07", title: "技术指引", desc: "汽车线束技术 · 家电线束技术 · 技术参数 · 沟通话术" },
  { num: "08", title: "成长路径", desc: "技术型销售成长 · 学习资源" }
];

tocItems.forEach((item, idx) => {
  const row = Math.floor(idx / 2);
  const col = idx % 2;
  const x = 0.5 + col * 4.7;
  const y = 1.7 + row * 0.9;

  slide2.addShape(pptx.ShapeType.rect, {
    x, y, w: 4.4, h: 0.75,
    fill: { color: COLORS.bgWhite },
    line: { color: COLORS.border, width: 0.5 }
  });

  slide2.addText(item.num, {
    x: x + 0.15, y: y + 0.15, w: 0.5, h: 0.45,
    fontSize: 20, fontFace: FONTS.title, color: COLORS.accent, bold: true
  });

  slide2.addText(item.title, {
    x: x + 0.7, y: y + 0.1, w: 3.5, h: 0.35,
    fontSize: 14, fontFace: FONTS.title, color: COLORS.textDark, bold: true
  });

  slide2.addText(item.desc, {
    x: x + 0.7, y: y + 0.4, w: 3.5, h: 0.3,
    fontSize: 10, fontFace: FONTS.body, color: COLORS.textMuted
  });
});

createSectionSlide(3, TOTAL, "01", "公司认知");
createSectionSlide(4, TOTAL, "02", "岗位职责");
createSectionSlide(5, TOTAL, "03", "对内联系");
createSectionSlide(6, TOTAL, "04", "对外联系");
createSectionSlide(7, TOTAL, "05", "生产工艺");
createSectionSlide(8, TOTAL, "06", "关键盯控点");
createSectionSlide(9, TOTAL, "07", "技术指引");
createSectionSlide(10, TOTAL, "08", "成长路径");

let slide11 = createContentSlide(11, TOTAL, "公司简介", "01 公司认知");
slide11.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.1, w: 4.3, h: 2.2,
  fill: { color: COLORS.bgWhite },
  shadow: { type: "outer", blur: 3, offset: 2, angle: 45, opacity: 0.15 }
});

slide11.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.1, w: 4.3, h: 0.5,
  fill: { color: COLORS.primary }
});

slide11.addText("公司概况", {
  x: 0.7, y: 1.15, w: 4, h: 0.4,
  fontSize: 14, fontFace: FONTS.title, color: COLORS.textLight, bold: true
});

slide11.addText([
  { text: "公司名称：", options: { bold: true, breakLine: false } },
  { text: "青岛弘博电缆有限公司", options: { breakLine: true } },
  { text: "主营业务：", options: { bold: true, breakLine: false } },
  { text: "汽车线束 · 家电线束 · 电线电缆", options: { breakLine: true } },
  { text: "产品定位：", options: { bold: true, breakLine: false } },
  { text: "中高端线束产品制造", options: { breakLine: true } },
  { text: "服务理念：", options: { bold: true, breakLine: false } },
  { text: "质量第一 · 客户至上", options: { breakLine: false } }
], {
  x: 0.7, y: 1.7, w: 4, h: 1.5,
  fontSize: 12, fontFace: FONTS.body, color: COLORS.textDark,
  paraSpaceAfter: 6
});

slide11.addShape(pptx.ShapeType.rect, {
  x: 5.0, y: 1.1, w: 4.5, h: 2.2,
  fill: { color: COLORS.bgWhite },
  shadow: { type: "outer", blur: 3, offset: 2, angle: 45, opacity: 0.15 }
});

slide11.addShape(pptx.ShapeType.rect, {
  x: 5.0, y: 1.1, w: 4.5, h: 0.5,
  fill: { color: COLORS.accent }
});

slide11.addText("核心优势", {
  x: 5.2, y: 1.15, w: 4, h: 0.4,
  fontSize: 14, fontFace: FONTS.title, color: COLORS.textLight, bold: true
});

slide11.addText([
  { text: "专业的生产设备和完善的检测体系", options: { bullet: true, breakLine: true } },
  { text: "丰富的汽车线和家电线生产经验", options: { bullet: true, breakLine: true } },
  { text: "可靠的质量管理（IATF16949/ISO9001）", options: { bullet: true, breakLine: true } },
  { text: "灵活的定制化服务能力", options: { bullet: true, breakLine: false } }
], {
  x: 5.2, y: 1.7, w: 4.2, h: 1.5,
  fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark,
  paraSpaceAfter: 6
});

slide11.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 3.5, w: 9, h: 1.7,
  fill: { color: COLORS.bgWhite },
  shadow: { type: "outer", blur: 3, offset: 2, angle: 45, opacity: 0.15 }
});

slide11.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 3.5, w: 9, h: 0.5,
  fill: { color: COLORS.primaryDark }
});

slide11.addText("当前主要客户", {
  x: 0.7, y: 3.55, w: 8, h: 0.4,
  fontSize: 14, fontFace: FONTS.title, color: COLORS.textLight, bold: true
});

const customers = [
  { name: "海信", status: "存量客户", detail: "部分小订单", color: COLORS.success },
  { name: "中国重汽", status: "新增客户", detail: "刚接入，潜力较大", color: COLORS.accent },
  { name: "美的", status: "暂停合作", detail: "刚被踢出，需关注", color: COLORS.danger }
];

customers.forEach((c, idx) => {
  const x = 0.7 + idx * 3;
  slide11.addShape(pptx.ShapeType.rect, {
    x, y: 4.1, w: 2.8, h: 1,
    fill: { color: COLORS.bgLight },
    line: { color: c.color, width: 2 }
  });

  slide11.addText(c.name, {
    x, y: 4.15, w: 2.8, h: 0.35,
    fontSize: 16, fontFace: FONTS.title, color: COLORS.textDark, bold: true, align: "center"
  });

  slide11.addText(c.status, {
    x, y: 4.5, w: 2.8, h: 0.25,
    fontSize: 11, fontFace: FONTS.body, color: c.color, bold: true, align: "center"
  });

  slide11.addText(c.detail, {
    x, y: 4.75, w: 2.8, h: 0.3,
    fontSize: 10, fontFace: FONTS.body, color: COLORS.textMuted, align: "center"
  });
});

let slide12 = createContentSlide(12, TOTAL, "产品家族：汽车线束 vs 家电线束", "01 公司认知");

slide12.addText("汽车线束", {
  x: 0.5, y: 1.1, w: 4.3, h: 0.4,
  fontSize: 18, fontFace: FONTS.title, color: COLORS.primary, bold: true
});

slide12.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.5, w: 4.3, h: 2.5,
  fill: { color: COLORS.bgWhite },
  shadow: { type: "outer", blur: 3, offset: 2, angle: 45, opacity: 0.15 }
});

slide12.addText([
  { text: "认证标准", options: { bold: true, color: COLORS.primary, breakLine: true } },
  { text: "IATF 16949 · UL · CCC", options: { breakLine: true } },
  { text: " ", options: { breakLine: true } },
  { text: "工作温度", options: { bold: true, color: COLORS.primary, breakLine: true } },
  { text: "-40°C ~ +125°C", options: { breakLine: true } },
  { text: " ", options: { breakLine: true } },
  { text: "质量要求", options: { bold: true, color: COLORS.primary, breakLine: true } },
  { text: "PPM级（<10PPM不良率）", options: { breakLine: true } },
  { text: " ", options: { breakLine: true } },
  { text: "典型应用", options: { bold: true, color: COLORS.primary, breakLine: true } },
  { text: "发动机 · 仪表盘 · 车身 · 底盘 · 高压系统", options: { breakLine: false } }
], {
  x: 0.7, y: 1.6, w: 4, h: 2.3,
  fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark,
  paraSpaceAfter: 2
});

slide12.addText("家电线束", {
  x: 5.2, y: 1.1, w: 4.3, h: 0.4,
  fontSize: 18, fontFace: FONTS.title, color: COLORS.accent, bold: true
});

slide12.addShape(pptx.ShapeType.rect, {
  x: 5.2, y: 1.5, w: 4.3, h: 2.5,
  fill: { color: COLORS.bgWhite },
  shadow: { type: "outer", blur: 3, offset: 2, angle: 45, opacity: 0.15 }
});

slide12.addText([
  { text: "认证标准", options: { bold: true, color: COLORS.accent, breakLine: true } },
  { text: "ISO 9001 · UL · CE", options: { breakLine: true } },
  { text: " ", options: { breakLine: true } },
  { text: "工作温度", options: { bold: true, color: COLORS.accent, breakLine: true } },
  { text: "-10°C ~ +70°C", options: { breakLine: true } },
  { text: " ", options: { breakLine: true } },
  { text: "质量要求", options: { bold: true, color: COLORS.accent, breakLine: true } },
  { text: "千分之三以内不良率", options: { breakLine: true } },
  { text: " ", options: { breakLine: true } },
  { text: "典型应用", options: { bold: true, color: COLORS.accent, breakLine: true } },
  { text: "空调 · 冰箱 · 洗衣机 · 小家电", options: { breakLine: false } }
], {
  x: 5.4, y: 1.6, w: 4, h: 2.3,
  fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark,
  paraSpaceAfter: 2
});

slide12.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 4.15, w: 9, h: 1.1,
  fill: { color: COLORS.primaryDark }
});

slide12.addText("业务要点：汽车线束要求更严格，但单价和利润更高；家电线束订单批量大，但竞争激烈", {
  x: 0.7, y: 4.35, w: 8.6, h: 0.7,
  fontSize: 13, fontFace: FONTS.body, color: COLORS.textLight,
  valign: "middle"
});

let slide13 = createContentSlide(13, TOTAL, "应用场景", "01 公司认知");

slide13.addText("汽车线束应用", {
  x: 0.5, y: 1.1, w: 9, h: 0.4,
  fontSize: 16, fontFace: FONTS.title, color: COLORS.primary, bold: true
});

const autoApps = [
  { name: "发动机线束", desc: "连接传感器与ECU" },
  { name: "仪表板线束", desc: "仪表盘指示灯、开关" },
  { name: "车身线束", desc: "车门、车顶、座椅电器" },
  { name: "底盘线束", desc: "车轮、刹车、悬挂系统" },
  { name: "高压线束", desc: "新能源电池包、电机" }
];

autoApps.forEach((app, idx) => {
  const x = 0.5 + idx * 1.85;
  slide13.addShape(pptx.ShapeType.rect, {
    x, y: 1.55, w: 1.7, h: 1.2,
    fill: { color: COLORS.bgWhite },
    line: { color: COLORS.primary, width: 1 }
  });

  slide13.addText(app.name, {
    x, y: 1.65, w: 1.7, h: 0.4,
    fontSize: 11, fontFace: FONTS.title, color: COLORS.primary, bold: true, align: "center"
  });

  slide13.addText(app.desc, {
    x, y: 2.05, w: 1.7, h: 0.6,
    fontSize: 9, fontFace: FONTS.body, color: COLORS.textMuted, align: "center"
  });
});

slide13.addText("家电线束应用", {
  x: 0.5, y: 2.95, w: 9, h: 0.4,
  fontSize: 16, fontFace: FONTS.title, color: COLORS.accent, bold: true
});

const homeApps = [
  { name: "空调线束", desc: "室内外机连接" },
  { name: "冰箱线束", desc: "制冷系统控制" },
  { name: "洗衣机线束", desc: "程序控制连接" },
  { name: "小家电", desc: "各类小型电器" }
];

homeApps.forEach((app, idx) => {
  const x = 0.5 + idx * 2.35;
  slide13.addShape(pptx.ShapeType.rect, {
    x, y: 3.4, w: 2.2, h: 1.1,
    fill: { color: COLORS.bgWhite },
    line: { color: COLORS.accent, width: 1 }
  });

  slide13.addText(app.name, {
    x, y: 3.5, w: 2.2, h: 0.4,
    fontSize: 12, fontFace: FONTS.title, color: COLORS.accent, bold: true, align: "center"
  });

  slide13.addText(app.desc, {
    x, y: 3.9, w: 2.2, h: 0.5,
    fontSize: 10, fontFace: FONTS.body, color: COLORS.textMuted, align: "center"
  });
});

slide13.addShape(pptx.ShapeType.rect, {
  x: 5.0, y: 4.65, w: 4.5, h: 0.7,
  fill: { color: COLORS.bgLight },
  line: { color: COLORS.accent, width: 1 }
});

slide13.addText("客户动态：海信（存量） · 中国重汽（新增） · 美的（暂停）", {
  x: 5.1, y: 4.75, w: 4.3, h: 0.5,
  fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark, valign: "middle"
});

let slide14 = createContentSlide(14, TOTAL, "岗位定位：业务部架构", "02 岗位职责");

slide14.addShape(pptx.ShapeType.rect, {
  x: 3.5, y: 1.2, w: 3, h: 0.6,
  fill: { color: COLORS.primaryDark }
});

slide14.addText("总经理", {
  x: 3.5, y: 1.25, w: 3, h: 0.5,
  fontSize: 14, fontFace: FONTS.title, color: COLORS.textLight, bold: true, align: "center"
});

slide14.addShape(pptx.ShapeType.rect, {
  x: 4.6, y: 1.8, w: 0.8, h: 0.3,
  fill: { color: COLORS.border }
});

slide14.addShape(pptx.ShapeType.rect, {
  x: 3.5, y: 2.1, w: 3, h: 0.6,
  fill: { color: COLORS.primary }
});

slide14.addText("业务部", {
  x: 3.5, y: 2.15, w: 3, h: 0.5,
  fontSize: 14, fontFace: FONTS.title, color: COLORS.textLight, bold: true, align: "center"
});

const bizRoles = [
  { x: 1.0, title: "业务经理", desc: "团队管理\n大客户维护\n战略规划" },
  { x: 4.0, title: "业务主管", desc: "小组管理\n重点客户\n业务跟进" },
  { x: 7.0, title: "业务员", desc: "客户开发\n订单跟进\n报价处理" }
];

bizRoles.forEach((role, idx) => {
  slide14.addShape(pptx.ShapeType.rect, {
    x: role.x, y: 2.9, w: 2, h: 1.6,
    fill: { color: COLORS.bgWhite },
    line: { color: COLORS.primary, width: 1 },
    shadow: { type: "outer", blur: 2, offset: 1, angle: 45, opacity: 0.1 }
  });

  slide14.addShape(pptx.ShapeType.rect, {
    x: role.x, y: 2.9, w: 2, h: 0.45,
    fill: { color: COLORS.secondary }
  });

  slide14.addText(role.title, {
    x: role.x, y: 2.95, w: 2, h: 0.35,
    fontSize: 12, fontFace: FONTS.title, color: COLORS.textLight, bold: true, align: "center"
  });

  slide14.addText(role.desc, {
    x: role.x + 0.1, y: 3.4, w: 1.8, h: 1,
    fontSize: 10, fontFace: FONTS.body, color: COLORS.textDark, align: "center"
  });
});

slide14.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 4.7, w: 9, h: 0.7,
  fill: { color: COLORS.bgLight }
});

slide14.addText("你是业务部的核心力量，连接客户与工厂的桥梁，负责订单全生命周期管理", {
  x: 0.7, y: 4.8, w: 8.6, h: 0.5,
  fontSize: 12, fontFace: FONTS.body, color: COLORS.textDark, valign: "middle"
});

let slide15 = createContentSlide(15, TOTAL, "岗位职责清单", "02 岗位职责");

slide15.addText("日常工作内容", {
  x: 0.5, y: 1.1, w: 9, h: 0.4,
  fontSize: 16, fontFace: FONTS.title, color: COLORS.primary, bold: true
});

const duties = [
  { icon: "📋", title: "报价处理", desc: "根据客户需求，协同技术部完成产品报价" },
  { icon: "📝", title: "订单跟进", desc: "与PMC对接交期，与客户保持沟通更新" },
  { icon: "🔧", title: "技术对接", desc: "传递客户技术要求，协调内部技术变更" },
  { icon: "⚠️", title: "客诉处理", desc: "受理客户投诉，协调内部解决并反馈" },
  { icon: "💰", title: "回款管理", desc: "跟进应收账款，确保账期内的及时回款" },
  { icon: "📊", title: "数据统计", desc: "整理销售数据，制作周报/月报报表" }
];

duties.forEach((duty, idx) => {
  const row = Math.floor(idx / 2);
  const col = idx % 2;
  const x = 0.5 + col * 4.7;
  const y = 1.6 + row * 1.2;

  slide15.addShape(pptx.ShapeType.rect, {
    x, y, w: 4.4, h: 1,
    fill: { color: COLORS.bgWhite },
    shadow: { type: "outer", blur: 2, offset: 1, angle: 45, opacity: 0.1 }
  });

  slide15.addText(duty.title, {
    x: x + 0.15, y: y + 0.1, w: 4, h: 0.35,
    fontSize: 13, fontFace: FONTS.title, color: COLORS.primary, bold: true
  });

  slide15.addText(duty.desc, {
    x: x + 0.15, y: y + 0.45, w: 4.1, h: 0.5,
    fontSize: 10, fontFace: FONTS.body, color: COLORS.textMuted
  });
});

let slide16 = createContentSlide(16, TOTAL, "价值链条：从接单到回款", "02 岗位职责");

slide16.addText("订单全生命周期管理", {
  x: 0.5, y: 1.1, w: 9, h: 0.4,
  fontSize: 16, fontFace: FONTS.title, color: COLORS.primary, bold: true
});

const stages = [
  { num: "1", title: "客户询价", desc: "接收需求\n初步沟通" },
  { num: "2", title: "报价确认", desc: "技术评审\n成本核算" },
  { num: "3", title: "订单确认", desc: "合同签订\n付款方式" },
  { num: "4", title: "生产跟进", desc: "交期协调\n品质把控" },
  { num: "5", title: "出货验收", desc: "发货跟踪\n客户签收" },
  { num: "6", title: "回款完成", desc: "对账开票\n账款回收" }
];

stages.forEach((stage, idx) => {
  const x = 0.5 + idx * 1.55;

  slide16.addShape(pptx.ShapeType.rect, {
    x, y: 1.6, w: 1.4, h: 2.2,
    fill: { color: COLORS.bgWhite },
    line: { color: COLORS.primary, width: 1 }
  });

  slide16.addShape(pptx.ShapeType.ellipse, {
    x: x + 0.35, y: 1.75, w: 0.7, h: 0.7,
    fill: { color: COLORS.primary }
  });

  slide16.addText(stage.num, {
    x: x + 0.35, y: 1.85, w: 0.7, h: 0.5,
    fontSize: 18, fontFace: FONTS.title, color: COLORS.textLight, bold: true, align: "center"
  });

  slide16.addText(stage.title, {
    x, y: 2.55, w: 1.4, h: 0.4,
    fontSize: 11, fontFace: FONTS.title, color: COLORS.primary, bold: true, align: "center"
  });

  slide16.addText(stage.desc, {
    x, y: 2.95, w: 1.4, h: 0.7,
    fontSize: 9, fontFace: FONTS.body, color: COLORS.textMuted, align: "center"
  });

  if (idx < 5) {
    slide16.addText("→", {
      x: x + 1.35, y: 2.4, w: 0.25, h: 0.4,
      fontSize: 16, color: COLORS.accent, bold: true
    });
  }
});

slide16.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 4.0, w: 9, h: 1.3,
  fill: { color: COLORS.bgLight }
});

slide16.addText("业务的核心价值：", {
  x: 0.7, y: 4.1, w: 8.6, h: 0.35,
  fontSize: 12, fontFace: FONTS.title, color: COLORS.primary, bold: true
});

slide16.addText([
  { text: "在每个环节中，你是客户与公司内部的唯一窗口", options: { bullet: true, breakLine: true } },
  { text: "你需要主动协调资源、推动问题解决、传递准确信息", options: { bullet: true, breakLine: true } },
  { text: "你的专业度直接影响客户满意度和公司利润", options: { bullet: true, breakLine: false } }
], {
  x: 0.7, y: 4.45, w: 8.6, h: 0.8,
  fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark
});

let slide17 = createContentSlide(17, TOTAL, "内部联络总览", "03 对内联系");

slide17.addText("组织架构与协作网络", {
  x: 0.5, y: 1.1, w: 9, h: 0.4,
  fontSize: 16, fontFace: FONTS.title, color: COLORS.primary, bold: true
});

const depts = [
  { name: "生产部", color: COLORS.primary, x: 1.0, duties: "产能 · 交期 · 异常" },
  { name: "技术部", color: COLORS.secondary, x: 3.5, duties: "设计 · 工艺 · 变更" },
  { name: "PMC", color: COLORS.accent, x: 6.0, duties: "排产 · 物料 · 计划" },
  { name: "品质部", color: COLORS.success, x: 8.5, duties: "检验 · 客诉 · 质量" },
  { name: "采购部", color: "9B59B6", x: 1.0, duties: "材料 · 供应商" },
  { name: "财务部", color: "E67E22", x: 3.5, duties: "账单 · 回款 · 发票" },
  { name: "仓储部", color: "1ABC9C", x: 6.0, duties: "库存 · 出货 · 物流" }
];

depts.forEach((dept, idx) => {
  const y = idx < 4 ? 1.6 : 3.2;

  slide17.addShape(pptx.ShapeType.rect, {
    x: dept.x, y, w: 2.2, h: 1.3,
    fill: { color: COLORS.bgWhite },
    line: { color: dept.color, width: 2 },
    shadow: { type: "outer", blur: 2, offset: 1, angle: 45, opacity: 0.1 }
  });

  slide17.addText(dept.name, {
    x: dept.x, y: y + 0.2, w: 2.2, h: 0.4,
    fontSize: 13, fontFace: FONTS.title, color: dept.color, bold: true, align: "center"
  });

  slide17.addText(dept.duties, {
    x: dept.x, y: y + 0.65, w: 2.2, h: 0.5,
    fontSize: 10, fontFace: FONTS.body, color: COLORS.textMuted, align: "center"
  });
});

slide17.addShape(pptx.ShapeType.rect, {
  x: 6.5, y: 3.0, w: 2.8, h: 0.6,
  fill: { color: COLORS.primaryDark }
});

slide17.addText("业务部（你）", {
  x: 6.5, y: 3.1, w: 2.8, h: 0.4,
  fontSize: 12, fontFace: FONTS.title, color: COLORS.textLight, bold: true, align: "center"
});

slide17.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 4.7, w: 9, h: 0.7,
  fill: { color: COLORS.accent }
});

slide17.addText("重要提醒：通过业务沟通群进行官方沟通，涉及公司运营重要情况必须群里公开", {
  x: 0.7, y: 4.8, w: 8.6, h: 0.5,
  fontSize: 12, fontFace: FONTS.body, color: COLORS.textLight, bold: true, valign: "middle"
});

let slide18 = createContentSlide(18, TOTAL, "生产部对接", "03 对内联系");

slide18.addText("核心协作内容", {
  x: 0.5, y: 1.1, w: 9, h: 0.4,
  fontSize: 16, fontFace: FONTS.title, color: COLORS.primary, bold: true
});

const prodItems = [
  { title: "交期确认", items: ["确认订单交期", "更新交期进展", "处理交期异常"] },
  { title: "产能评估", items: ["评估生产能力", "处理紧急订单", "协调加班需求"] },
  { title: "生产异常", items: ["反馈品质问题", "协调返工/补产", "记录异常原因"] }
];

prodItems.forEach((item, idx) => {
  const x = 0.5 + idx * 3.1;

  slide18.addShape(pptx.ShapeType.rect, {
    x, y: 1.55, w: 2.9, h: 2.3,
    fill: { color: COLORS.bgWhite },
    shadow: { type: "outer", blur: 2, offset: 1, angle: 45, opacity: 0.1 }
  });

  slide18.addShape(pptx.ShapeType.rect, {
    x, y: 1.55, w: 2.9, h: 0.5,
    fill: { color: COLORS.primary }
  });

  slide18.addText(item.title, {
    x, y: 1.6, w: 2.9, h: 0.4,
    fontSize: 13, fontFace: FONTS.title, color: COLORS.textLight, bold: true, align: "center"
  });

  slide18.addText(
    item.items.map((i, iidx) => ({
      text: i,
      options: { bullet: true, breakLine: iidx < item.items.length - 1 }
    })),
    {
      x: x + 0.15, y: 2.15, w: 2.6, h: 1.5,
      fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark,
      paraSpaceAfter: 6
    }
  );
});

slide18.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 4.0, w: 9, h: 1.3,
  fill: { color: COLORS.bgLight }
});

slide18.addText("沟通技巧", {
  x: 0.7, y: 4.1, w: 8.6, h: 0.35,
  fontSize: 12, fontFace: FONTS.title, color: COLORS.accent, bold: true
});

slide18.addText([
  { text: "提前告知：订单确认后尽快与生产部同步，便于排产", options: { bullet: true, breakLine: true } },
  { text: "书面确认：重要交期承诺通过邮件或群消息书面确认", options: { bullet: true, breakLine: true } },
  { text: "主动跟进：定期在群里跟进进度，不要等问题来找你", options: { bullet: true, breakLine: false } }
], {
  x: 0.7, y: 4.45, w: 8.6, h: 0.8,
  fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark
});

let slide19 = createContentSlide(19, TOTAL, "PMC / 品质部对接", "03 对内联系");

slide19.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.1, w: 4.3, h: 2.5,
  fill: { color: COLORS.bgWhite },
  shadow: { type: "outer", blur: 2, offset: 1, angle: 45, opacity: 0.1 }
});

slide19.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.1, w: 4.3, h: 0.5,
  fill: { color: COLORS.accent }
});

slide19.addText("PMC（计划物控）", {
  x: 0.7, y: 1.15, w: 4, h: 0.4,
  fontSize: 13, fontFace: FONTS.title, color: COLORS.textLight, bold: true
});

slide19.addText([
  { text: "排产计划确认", options: { bullet: true, breakLine: true } },
  { text: "物料到料跟踪", options: { bullet: true, breakLine: true } },
  { text: "交期预测更新", options: { bullet: true, breakLine: true } },
  { text: "紧急插单协调", options: { bullet: true, breakLine: true } },
  { text: "库存数据查询", options: { bullet: true, breakLine: false } }
], {
  x: 0.7, y: 1.7, w: 4, h: 1.8,
  fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark,
  paraSpaceAfter: 6
});

slide19.addShape(pptx.ShapeType.rect, {
  x: 5.2, y: 1.1, w: 4.3, h: 2.5,
  fill: { color: COLORS.bgWhite },
  shadow: { type: "outer", blur: 2, offset: 1, angle: 45, opacity: 0.1 }
});

slide19.addShape(pptx.ShapeType.rect, {
  x: 5.2, y: 1.1, w: 4.3, h: 0.5,
  fill: { color: COLORS.success }
});

slide19.addText("品质部", {
  x: 5.4, y: 1.15, w: 4, h: 0.4,
  fontSize: 13, fontFace: FONTS.title, color: COLORS.textLight, bold: true
});

slide19.addText([
  { text: "来料检验结果", options: { bullet: true, breakLine: true } },
  { text: "过程质量异常", options: { bullet: true, breakLine: true } },
  { text: "成品检验报告", options: { bullet: true, breakLine: true } },
  { text: "客诉质量问题处理", options: { bullet: true, breakLine: true } },
  { text: "质量数据统计", options: { bullet: true, breakLine: false } }
], {
  x: 5.4, y: 1.7, w: 4, h: 1.8,
  fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark,
  paraSpaceAfter: 6
});

slide19.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 3.8, w: 9, h: 1.5,
  fill: { color: COLORS.primaryDark }
});

slide19.addText("⚠️ 重要原则", {
  x: 0.7, y: 3.9, w: 8.6, h: 0.4,
  fontSize: 14, fontFace: FONTS.title, color: COLORS.accent, bold: true
});

slide19.addText([
  { text: "日常了解情况：私下沟通 或 群里简单询问", options: { breakLine: true } },
  { text: "公司运营重要情况/数据/时效：必须群里公开沟通", options: { breakLine: true } },
  { text: "这是官方沟通规范，也是保护你自己的方式", options: { breakLine: false } }
], {
  x: 0.7, y: 4.35, w: 8.6, h: 0.9,
  fontSize: 12, fontFace: FONTS.body, color: COLORS.textLight
});

let slide20 = createContentSlide(20, TOTAL, "采购 / 财务对接", "03 对内联系");

slide20.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.1, w: 4.3, h: 2.3,
  fill: { color: COLORS.bgWhite },
  shadow: { type: "outer", blur: 2, offset: 1, angle: 45, opacity: 0.1 }
});

slide20.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.1, w: 4.3, h: 0.5,
  fill: { color: "9B59B6" }
});

slide20.addText("采购部", {
  x: 0.7, y: 1.15, w: 4, h: 0.4,
  fontSize: 13, fontFace: FONTS.title, color: COLORS.textLight, bold: true
});

slide20.addText([
  { text: "原材料价格波动", options: { bullet: true, breakLine: true } },
  { text: "供应商交期咨询", options: { bullet: true, breakLine: true } },
  { text: "新材料开发进度", options: { bullet: true, breakLine: true } },
  { text: "样品进度跟进", options: { bullet: true, breakLine: false } }
], {
  x: 0.7, y: 1.7, w: 4, h: 1.5,
  fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark,
  paraSpaceAfter: 6
});

slide20.addShape(pptx.ShapeType.rect, {
  x: 5.2, y: 1.1, w: 4.3, h: 2.3,
  fill: { color: COLORS.bgWhite },
  shadow: { type: "outer", blur: 2, offset: 1, angle: 45, opacity: 0.1 }
});

slide20.addShape(pptx.ShapeType.rect, {
  x: 5.2, y: 1.1, w: 4.3, h: 0.5,
  fill: { color: "E67E22" }
});

slide20.addText("财务部", {
  x: 5.4, y: 1.15, w: 4, h: 0.4,
  fontSize: 13, fontFace: FONTS.title, color: COLORS.textLight, bold: true
});

slide20.addText([
  { text: "应收账款查询", options: { bullet: true, breakLine: true } },
  { text: "发票开具进度", options: { bullet: true, breakLine: true } },
  { text: "账期/付款条款", options: { bullet: true, breakLine: true } },
  { text: "客户信用额度", options: { bullet: true, breakLine: false } }
], {
  x: 5.4, y: 1.7, w: 4, h: 1.5,
  fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark,
  paraSpaceAfter: 6
});

slide20.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 3.6, w: 9, h: 1.7,
  fill: { color: COLORS.bgLight }
});

slide20.addText("业务与财务的协作重点", {
  x: 0.7, y: 3.7, w: 8.6, h: 0.4,
  fontSize: 13, fontFace: FONTS.title, color: COLORS.primary, bold: true
});

slide20.addText([
  { text: "回款管理：及时跟进客户付款，确保账期健康", options: { bullet: true, breakLine: true } },
  { text: "账期评估：新客户合作前，了解其信用状况和账期要求", options: { bullet: true, breakLine: true } },
  { text: "数据同步：定期与财务核对应收账款数据，避免遗漏", options: { bullet: true, breakLine: true } },
  { text: "风险预警：发现客户付款异常，及时通报财务并采取措施", options: { bullet: true, breakLine: false } }
], {
  x: 0.7, y: 4.15, w: 8.6, h: 1.1,
  fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark
});

let slide21 = createContentSlide(21, TOTAL, "客户分布与状态", "04 对外联系");

slide21.addText("当前主要客户", {
  x: 0.5, y: 1.1, w: 9, h: 0.4,
  fontSize: 16, fontFace: FONTS.title, color: COLORS.primary, bold: true
});

const customers2 = [
  {
    name: "海信",
    status: "存量客户",
    statusColor: COLORS.success,
    detail: "部分小订单\n保持稳定合作",
    action: "维护关系，争取更多订单份额"
  },
  {
    name: "中国重汽",
    status: "新增客户",
    statusColor: COLORS.accent,
    detail: "刚接入阶段\n潜力较大",
    action: "重点跟进，建立信任，快速响应"
  },
  {
    name: "美的",
    status: "暂停合作",
    statusColor: COLORS.danger,
    detail: "刚被踢出\n原因待分析",
    action: "关注后续，看是否有改善机会"
  }
];

customers2.forEach((c, idx) => {
  const x = 0.5 + idx * 3.1;

  slide21.addShape(pptx.ShapeType.rect, {
    x, y: 1.55, w: 2.9, h: 3.2,
    fill: { color: COLORS.bgWhite },
    line: { color: c.statusColor, width: 2 },
    shadow: { type: "outer", blur: 3, offset: 2, angle: 45, opacity: 0.15 }
  });

  slide21.addShape(pptx.ShapeType.rect, {
    x, y: 1.55, w: 2.9, h: 0.55,
    fill: { color: c.statusColor }
  });

  slide21.addText(c.name, {
    x, y: 1.6, w: 2.9, h: 0.45,
    fontSize: 16, fontFace: FONTS.title, color: COLORS.textLight, bold: true, align: "center"
  });

  slide21.addText(c.status, {
    x, y: 2.2, w: 2.9, h: 0.35,
    fontSize: 12, fontFace: FONTS.title, color: c.statusColor, bold: true, align: "center"
  });

  slide21.addText(c.detail, {
    x: x + 0.15, y: 2.6, w: 2.6, h: 0.8,
    fontSize: 10, fontFace: FONTS.body, color: COLORS.textMuted, align: "center"
  });

  slide21.addShape(pptx.ShapeType.rect, {
    x: x + 0.15, y: 3.5, w: 2.6, h: 0.02,
    fill: { color: COLORS.border }
  });

  slide21.addText(c.action, {
    x: x + 0.15, y: 3.6, w: 2.6, h: 1,
    fontSize: 10, fontFace: FONTS.body, color: COLORS.textDark
  });
});

let slide22 = createContentSlide(22, TOTAL, "供应商联络", "04 对外联系");

slide22.addText("主要供应商类型", {
  x: 0.5, y: 1.1, w: 9, h: 0.4,
  fontSize: 16, fontFace: FONTS.title, color: COLORS.primary, bold: true
});

const suppliers = [
  { type: "铜线/导体", items: "铜杆、铜丝、镀锡线" },
  { type: "端子/连接器", items: "TE、Molex、JAE、安费诺" },
  { type: "胶带/套管", items: "3M、日东、国产替代" },
  { type: "护套材料", items: "PVC、PP、PA66" },
  { type: "辅助材料", items: "热缩管、扎带、号码管" }
];

suppliers.forEach((s, idx) => {
  const row = Math.floor(idx / 2);
  const col = idx % 2;
  const x = 0.5 + col * 4.7;
  const y = 1.6 + row * 0.75;

  slide22.addShape(pptx.ShapeType.rect, {
    x, y, w: 4.4, h: 0.65,
    fill: { color: COLORS.bgWhite },
    shadow: { type: "outer", blur: 1, offset: 1, angle: 45, opacity: 0.1 }
  });

  slide22.addText(s.type, {
    x: x + 0.15, y: y + 0.1, w: 1.5, h: 0.45,
    fontSize: 12, fontFace: FONTS.title, color: COLORS.primary, bold: true
  });

  slide22.addText(s.items, {
    x: x + 1.7, y: y + 0.1, w: 2.5, h: 0.45,
    fontSize: 10, fontFace: FONTS.body, color: COLORS.textMuted
  });
});

slide22.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 4.0, w: 9, h: 1.3,
  fill: { color: COLORS.bgLight }
});

slide22.addText("业务与供应商的协作要点", {
  x: 0.7, y: 4.1, w: 8.6, h: 0.35,
  fontSize: 12, fontFace: FONTS.title, color: COLORS.primary, bold: true
});

slide22.addText([
  { text: "了解供应能力：在订单量大或交期紧时，提前了解供应商产能", options: { bullet: true, breakLine: true } },
  { text: "价格波动传递：原材料价格变化时，及时与客户沟通价格调整", options: { bullet: true, breakLine: true } },
  { text: "质量协同：发现来料问题时，配合采购/品质与供应商沟通改善", options: { bullet: true, breakLine: false } }
], {
  x: 0.7, y: 4.5, w: 8.6, h: 0.75,
  fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark
});

let slide23 = createContentSlide(23, TOTAL, "外部沟通规范", "04 对外联系");

slide23.addText("沟通方式选择", {
  x: 0.5, y: 1.1, w: 9, h: 0.4,
  fontSize: 16, fontFace: FONTS.title, color: COLORS.primary, bold: true
});

const commMethods = [
  { method: "📧 邮件", use: "正式报价、合同、变更确认等需要书面记录的场景", best: "对公、正式、存档" },
  { method: "📱 微信/企微", use: "日常沟通、进度跟进、简单问题咨询", best: "快速、便捷、日常" },
  { method: "📞 电话", use: "紧急事项、复杂问题需要即时讨论", best: "即时、双向、详细" },
  { method: "📹 视频会议", use: "技术评审、远程会议、方案讨论", best: "直观、协同、远程" }
];

commMethods.forEach((m, idx) => {
  const y = 1.55 + idx * 0.85;

  slide23.addShape(pptx.ShapeType.rect, {
    x: 0.5, y, w: 9, h: 0.75,
    fill: { color: COLORS.bgWhite },
    shadow: { type: "outer", blur: 1, offset: 1, angle: 45, opacity: 0.1 }
  });

  slide23.addText(m.method, {
    x: 0.7, y: y + 0.15, w: 1.5, h: 0.45,
    fontSize: 13, fontFace: FONTS.title, color: COLORS.primary, bold: true
  });

  slide23.addText(m.use, {
    x: 2.3, y: y + 0.15, w: 4.5, h: 0.45,
    fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark
  });

  slide23.addText(m.best, {
    x: 7.0, y: y + 0.15, w: 2.3, h: 0.45,
    fontSize: 10, fontFace: FONTS.body, color: COLORS.textMuted
  });
});

slide23.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 4.0, w: 9, h: 1.3,
  fill: { color: COLORS.primaryDark }
});

slide23.addText("沟通原则", {
  x: 0.7, y: 4.1, w: 8.6, h: 0.35,
  fontSize: 13, fontFace: FONTS.title, color: COLORS.accent, bold: true
});

slide23.addText([
  { text: "及时响应：客户消息尽量在2小时内回复，紧急事项立即处理", options: { bullet: true, breakLine: true } },
  { text: "言出必行：承诺客户的交期或方案必须兑现，有变化提前告知", options: { bullet: true, breakLine: true } },
  { text: "专业形象：沟通中体现专业度，不确定的问题先确认再回复", options: { bullet: true, breakLine: false } }
], {
  x: 0.7, y: 4.5, w: 8.6, h: 0.75,
  fontSize: 11, fontFace: FONTS.body, color: COLORS.textLight
});

let slide24 = createContentSlide(24, TOTAL, "生产工艺流程概览", "05 生产工艺");

slide24.addText("线束生产六大工序", {
  x: 0.5, y: 1.1, w: 9, h: 0.4,
  fontSize: 16, fontFace: FONTS.title, color: COLORS.primary, bold: true
});

const processSteps = [
  { num: "01", name: "来料检验", desc: "IQC检查\n材料验证" },
  { num: "02", name: "裁线", desc: "定长裁切\n剥除外皮" },
  { num: "03", name: "压接", desc: "端子压接\n拉力检测" },
  { num: "04", name: "装配", desc: "预装配\n总装配" },
  { num: "05", name: "测试", desc: "通断测试\n耐压测试" },
  { num: "06", name: "包装", desc: "防护包装\n标签粘贴" }
];

processSteps.forEach((step, idx) => {
  const x = 0.5 + idx * 1.55;

  slide24.addShape(pptx.ShapeType.rect, {
    x, y: 1.55, w: 1.4, h: 2.4,
    fill: { color: COLORS.bgWhite },
    line: { color: COLORS.primary, width: 1 },
    shadow: { type: "outer", blur: 2, offset: 1, angle: 45, opacity: 0.1 }
  });

  slide24.addShape(pptx.ShapeType.rect, {
    x, y: 1.55, w: 1.4, h: 0.5,
    fill: { color: COLORS.primary }
  });

  slide24.addText(step.num, {
    x, y: 1.6, w: 1.4, h: 0.4,
    fontSize: 14, fontFace: FONTS.title, color: COLORS.textLight, bold: true, align: "center"
  });

  slide24.addText(step.name, {
    x, y: 2.15, w: 1.4, h: 0.4,
    fontSize: 12, fontFace: FONTS.title, color: COLORS.primary, bold: true, align: "center"
  });

  slide24.addText(step.desc, {
    x, y: 2.6, w: 1.4, h: 1.2,
    fontSize: 10, fontFace: FONTS.body, color: COLORS.textMuted, align: "center"
  });

  if (idx < 5) {
    slide24.addText("→", {
      x: x + 1.3, y: 2.4, w: 0.3, h: 0.4,
      fontSize: 18, color: COLORS.accent, bold: true
    });
  }
});

slide24.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 4.15, w: 9, h: 1.15,
  fill: { color: COLORS.bgLight }
});

slide24.addText("业务需要了解的要点", {
  x: 0.7, y: 4.25, w: 8.6, h: 0.35,
  fontSize: 12, fontFace: FONTS.title, color: COLORS.accent, bold: true
});

slide24.addText([
  { text: "标准生产周期：汽车线束7-15天，家电线束5-10天（视订单量）", options: { bullet: true, breakLine: true } },
  { text: "加急处理：紧急订单需额外支付费用，且会压缩其他订单交期", options: { bullet: true, breakLine: false } }
], {
  x: 0.7, y: 4.65, w: 8.6, h: 0.6,
  fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark
});

let slide25 = createContentSlide(25, TOTAL, "关键工序详解", "05 生产工艺");

slide25.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.1, w: 4.3, h: 2.3,
  fill: { color: COLORS.bgWhite },
  shadow: { type: "outer", blur: 2, offset: 1, angle: 45, opacity: 0.1 }
});

slide25.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.1, w: 4.3, h: 0.5,
  fill: { color: COLORS.primary }
});

slide25.addText("压接工序", {
  x: 0.7, y: 1.15, w: 4, h: 0.4,
  fontSize: 13, fontFace: FONTS.title, color: COLORS.textLight, bold: true
});

slide25.addText([
  { text: "压接高度：±0.05mm精度", options: { bullet: true, breakLine: true } },
  { text: "拉力测试：100%全检", options: { bullet: true, breakLine: true } },
  { text: "汽车线：需符合USCAR21标准", options: { bullet: true, breakLine: true } },
  { text: "家电线：抽检为主", options: { bullet: true, breakLine: true } },
  { text: "不良后果：虚压导致断路/火灾", options: { bullet: true, breakLine: false } }
], {
  x: 0.7, y: 1.7, w: 4, h: 1.6,
  fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark,
  paraSpaceAfter: 5
});

slide25.addShape(pptx.ShapeType.rect, {
  x: 5.2, y: 1.1, w: 4.3, h: 2.3,
  fill: { color: COLORS.bgWhite },
  shadow: { type: "outer", blur: 2, offset: 1, angle: 45, opacity: 0.1 }
});

slide25.addShape(pptx.ShapeType.rect, {
  x: 5.2, y: 1.1, w: 4.3, h: 0.5,
  fill: { color: COLORS.accent }
});

slide25.addText("测试工序", {
  x: 5.4, y: 1.15, w: 4, h: 0.4,
  fontSize: 13, fontFace: FONTS.title, color: COLORS.textLight, bold: true
});

slide25.addText([
  { text: "通断测试：100%检测每根导线", options: { bullet: true, breakLine: true } },
  { text: "耐压测试：AC 1500V/1min", options: { bullet: true, breakLine: true } },
  { text: "防水测试：IP67气密性检测", options: { bullet: true, breakLine: true } },
  { text: "汽车线：全检；家电线：抽检", options: { bullet: true, breakLine: true } },
  { text: "不良后果：短路/漏电风险", options: { bullet: true, breakLine: false } }
], {
  x: 5.4, y: 1.7, w: 4, h: 1.6,
  fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark,
  paraSpaceAfter: 5
});

slide25.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 3.6, w: 9, h: 1.7,
  fill: { color: COLORS.bgLight }
});

slide25.addText("业务需要关注的质量点", {
  x: 0.7, y: 3.7, w: 8.6, h: 0.35,
  fontSize: 12, fontFace: FONTS.title, color: COLORS.primary, bold: true
});

slide25.addText([
  { text: "汽车线束订单：任何质量问题都可能导致客户索赔甚至失去供货资质", options: { bullet: true, breakLine: true } },
  { text: "客户投诉处理：第一时间记录问题现象，反馈给品质部分析原因", options: { bullet: true, breakLine: true } },
  { text: "质量问题预防：了解产品关键特性，在与客户沟通时主动说明公司的质量控制措施", options: { bullet: true, breakLine: false } }
], {
  x: 0.7, y: 4.1, w: 8.6, h: 1.1,
  fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark
});

let slide26 = createContentSlide(26, TOTAL, "生产周期说明", "05 生产工艺");

slide26.addText("标准生产周期参考", {
  x: 0.5, y: 1.1, w: 9, h: 0.4,
  fontSize: 16, fontFace: FONTS.title, color: COLORS.primary, bold: true
});

slide26.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.55, w: 9, h: 2.5,
  fill: { color: COLORS.bgWhite },
  shadow: { type: "outer", blur: 2, offset: 1, angle: 45, opacity: 0.1 }
});

const cycleData = [
  { type: "汽车线束", time: "7-15天", factors: "订单量、工艺复杂度、认证要求" },
  { type: "家电线束", time: "5-10天", factors: "订单量、产品复杂度" },
  { type: "新产品开发", time: "15-30天", factors: "设计评审、开模、样品测试" },
  { type: "紧急订单", time: "3-5天", factors: "视车间排产情况，需加急费" }
];

cycleData.forEach((item, idx) => {
  const y = 1.7 + idx * 0.55;

  slide26.addText(item.type, {
    x: 0.7, y, w: 2, h: 0.45,
    fontSize: 12, fontFace: FONTS.title, color: COLORS.primary, bold: true
  });

  slide26.addShape(pptx.ShapeType.rect, {
    x: 2.8, y: y + 0.05, w: 1.2, h: 0.35,
    fill: { color: COLORS.accent }
  });

  slide26.addText(item.time, {
    x: 2.8, y: y + 0.05, w: 1.2, h: 0.35,
    fontSize: 11, fontFace: FONTS.title, color: COLORS.textLight, bold: true, align: "center"
  });

  slide26.addText(item.factors, {
    x: 4.2, y, w: 5, h: 0.45,
    fontSize: 10, fontFace: FONTS.body, color: COLORS.textMuted
  });
});

slide26.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 4.2, w: 9, h: 1.1,
  fill: { color: COLORS.primaryDark }
});

slide26.addText("交期管理要点", {
  x: 0.7, y: 4.3, w: 8.6, h: 0.35,
  fontSize: 13, fontFace: FONTS.title, color: COLORS.accent, bold: true
});

slide26.addText([
  { text: "提前介入：订单确认后立即与PMC确认交期，不要等到临近交期才跟进", options: { bullet: true, breakLine: true } },
  { text: "分批交货：大批量订单可协商分批交货，缓解生产压力", options: { bullet: true, breakLine: false } }
], {
  x: 0.7, y: 4.7, w: 8.6, h: 0.55,
  fontSize: 11, fontFace: FONTS.body, color: COLORS.textLight
});

let slide27 = createContentSlide(27, TOTAL, "质量红线", "06 关键盯控点");

slide27.addText("线束产品质量关键指标", {
  x: 0.5, y: 1.1, w: 9, h: 0.4,
  fontSize: 16, fontFace: FONTS.title, color: COLORS.primary, bold: true
});

slide27.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.55, w: 4.3, h: 2.2,
  fill: { color: COLORS.bgWhite },
  line: { color: COLORS.primary, width: 2 }
});

slide27.addText("汽车线束", {
  x: 0.5, y: 1.6, w: 4.3, h: 0.45,
  fontSize: 14, fontFace: FONTS.title, color: COLORS.primary, bold: true, align: "center"
});

slide27.addText([
  { text: "不良率：<10 PPM", options: { bullet: true, breakLine: true } },
  { text: "拉力测试：100%全检", options: { bullet: true, breakLine: true } },
  { text: "耐压测试：AC 1500V/1min", options: { bullet: true, breakLine: true } },
  { text: "防水等级：IP67/IP69K", options: { bullet: true, breakLine: true } },
  { text: "工作温度：-40°C~+125°C", options: { bullet: true, breakLine: false } }
], {
  x: 0.7, y: 2.1, w: 4, h: 1.5,
  fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark,
  paraSpaceAfter: 5
});

slide27.addShape(pptx.ShapeType.rect, {
  x: 5.2, y: 1.55, w: 4.3, h: 2.2,
  fill: { color: COLORS.bgWhite },
  line: { color: COLORS.accent, width: 2 }
});

slide27.addText("家电线束", {
  x: 5.2, y: 1.6, w: 4.3, h: 0.45,
  fontSize: 14, fontFace: FONTS.title, color: COLORS.accent, bold: true, align: "center"
});

slide27.addText([
  { text: "不良率：<0.3%", options: { bullet: true, breakLine: true } },
  { text: "拉力测试：抽检", options: { bullet: true, breakLine: true } },
  { text: "耐压测试：抽检", options: { bullet: true, breakLine: true } },
  { text: "防水等级：IP20~IP54", options: { bullet: true, breakLine: true } },
  { text: "工作温度：-10°C~+70°C", options: { bullet: true, breakLine: false } }
], {
  x: 5.4, y: 2.1, w: 4, h: 1.5,
  fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark,
  paraSpaceAfter: 5
});

slide27.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 3.9, w: 9, h: 1.4,
  fill: { color: COLORS.danger },
  transparency: 10
});

slide27.addText("⚠️ 质量红线 - 绝对不能触碰", {
  x: 0.7, y: 4.0, w: 8.6, h: 0.4,
  fontSize: 13, fontFace: FONTS.title, color: COLORS.textLight, bold: true
});

slide27.addText([
  { text: "虚压/假压：端子与导线未真正连接，会导致断路甚至火灾", options: { bullet: true, breakLine: true } },
  { text: "线序错误：多芯线束线序接错，导致设备无法工作甚至烧毁", options: { bullet: true, breakLine: true } },
  { text: "防水失效：密封不严导致水进入，轻则短路重则安全事故", options: { bullet: true, breakLine: false } }
], {
  x: 0.7, y: 4.4, w: 8.6, h: 0.85,
  fontSize: 11, fontFace: FONTS.body, color: COLORS.textLight
});

let slide28 = createContentSlide(28, TOTAL, "交期预警", "06 关键盯控点");

slide28.addText("交期管理时间节点", {
  x: 0.5, y: 1.1, w: 9, h: 0.4,
  fontSize: 16, fontFace: FONTS.title, color: COLORS.primary, bold: true
});

const timeNodes = [
  { node: "订单确认", day: "D+0", action: "业务确认订单，与PMC确认交期" },
  { node: "物料采购", day: "D+1~3", action: "PMC下达采购计划，跟进物料" },
  { node: "生产开始", day: "D+3~5", action: "首道工序开始，群里更新进度" },
  { node: "中段跟进", day: "D+7", action: "业务主动群里跟进进度，确认是否正常" },
  { node: "完成检验", day: "D+10~12", action: "产品完成，品质检验" },
  { node: "发货出货", day: "D+12~15", action: "包装出货，跟踪物流" }
];

timeNodes.forEach((item, idx) => {
  const y = 1.55 + idx * 0.6;

  slide28.addShape(pptx.ShapeType.rect, {
    x: 0.5, y, w: 1.5, h: 0.5,
    fill: { color: COLORS.primary }
  });

  slide28.addText(item.node, {
    x: 0.5, y: y + 0.05, w: 1.5, h: 0.4,
    fontSize: 11, fontFace: FONTS.title, color: COLORS.textLight, bold: true, align: "center"
  });

  slide28.addShape(pptx.ShapeType.rect, {
    x: 2.1, y: y + 0.05, w: 1, h: 0.4,
    fill: { color: COLORS.accent }
  });

  slide28.addText(item.day, {
    x: 2.1, y: y + 0.05, w: 1, h: 0.4,
    fontSize: 11, fontFace: FONTS.title, color: COLORS.textLight, bold: true, align: "center"
  });

  slide28.addText(item.action, {
    x: 3.3, y: y + 0.05, w: 6.2, h: 0.4,
    fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark
  });
});

slide28.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 4.25, w: 9, h: 1.05,
  fill: { color: COLORS.bgLight }
});

slide28.addText("交期预警信号", {
  x: 0.7, y: 4.35, w: 8.6, h: 0.35,
  fontSize: 12, fontFace: FONTS.title, color: COLORS.danger, bold: true
});

slide28.addText([
  { text: "物料延迟：立即在群里通报，评估对交期的影响", options: { bullet: true, breakLine: true } },
  { text: "良品率下降：可能影响出货进度，需协调技术/生产分析原因", options: { bullet: true, breakLine: true } },
  { text: "客户变更：立即评估影响，在群里公开沟通，不要私下处理", options: { bullet: true, breakLine: false } }
], {
  x: 0.7, y: 4.7, w: 8.6, h: 0.55,
  fontSize: 10, fontFace: FONTS.body, color: COLORS.textDark
});

let slide29 = createContentSlide(29, TOTAL, "成本意识", "06 关键盯控点");

slide29.addText("业务需要知道的成本要点", {
  x: 0.5, y: 1.1, w: 9, h: 0.4,
  fontSize: 16, fontFace: FONTS.title, color: COLORS.primary, bold: true
});

const costItems = [
  { title: "原材料成本", desc: "铜价波动直接影响成本，报价需确认原材料条款" },
  { title: "人工成本", desc: "加班费、紧急订单的人力成本" },
  { title: "不良成本", desc: "返工、报废、客诉索赔直接侵蚀利润" },
  { title: "交期成本", desc: "延迟交货可能产生罚款或失去客户信任" }
];

costItems.forEach((item, idx) => {
  const row = Math.floor(idx / 2);
  const col = idx % 2;
  const x = 0.5 + col * 4.7;
  const y = 1.6 + row * 1.1;

  slide29.addShape(pptx.ShapeType.rect, {
    x, y, w: 4.4, h: 0.95,
    fill: { color: COLORS.bgWhite },
    shadow: { type: "outer", blur: 2, offset: 1, angle: 45, opacity: 0.1 }
  });

  slide29.addShape(pptx.ShapeType.rect, {
    x, y, w: 0.1, h: 0.95,
    fill: { color: COLORS.accent }
  });

  slide29.addText(item.title, {
    x: x + 0.25, y: y + 0.1, w: 4, h: 0.35,
    fontSize: 12, fontFace: FONTS.title, color: COLORS.primary, bold: true
  });

  slide29.addText(item.desc, {
    x: x + 0.25, y: y + 0.45, w: 4, h: 0.45,
    fontSize: 10, fontFace: FONTS.body, color: COLORS.textMuted
  });
});

slide29.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 3.9, w: 9, h: 1.4,
  fill: { color: COLORS.primaryDark }
});

slide29.addText("业务报价参考原则", {
  x: 0.7, y: 4.0, w: 8.6, h: 0.35,
  fontSize: 13, fontFace: FONTS.title, color: COLORS.accent, bold: true
});

slide29.addText([
  { text: "材料成本占比：线束产品材料成本占总成本50-70%", options: { bullet: true, breakLine: true } },
  { text: "报价有效期：原材料价格波动大时，报价有效期应缩短", options: { bullet: true, breakLine: true } },
  { text: "账期影响：账期越长，资金占用成本越高，报价应体现", options: { bullet: true, breakLine: false } }
], {
  x: 0.7, y: 4.4, w: 8.6, h: 0.85,
  fontSize: 11, fontFace: FONTS.body, color: COLORS.textLight
});

let slide30 = createContentSlide(30, TOTAL, "汽车线束技术基础", "07 技术指引");

slide30.addText("认证标准与技术要求", {
  x: 0.5, y: 1.1, w: 9, h: 0.4,
  fontSize: 16, fontFace: FONTS.title, color: COLORS.primary, bold: true
});

slide30.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.55, w: 4.3, h: 2.5,
  fill: { color: COLORS.bgWhite },
  shadow: { type: "outer", blur: 2, offset: 1, angle: 45, opacity: 0.1 }
});

slide30.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.55, w: 4.3, h: 0.5,
  fill: { color: COLORS.primary }
});

slide30.addText("必须通过的认证", {
  x: 0.7, y: 1.6, w: 4, h: 0.4,
  fontSize: 12, fontFace: FONTS.title, color: COLORS.textLight, bold: true
});

slide30.addText([
  { text: "IATF 16949:2016", options: { bold: true, breakLine: true } },
  { text: "汽车行业质量管理体系", options: { breakLine: true } },
  { text: " ", options: { breakLine: true } },
  { text: "UL认证", options: { bold: true, breakLine: true } },
  { text: "电气安全认证", options: { breakLine: true } },
  { text: " ", options: { breakLine: true } },
  { text: "CCC认证", options: { bold: true, breakLine: true } },
  { text: "中国强制性产品认证", options: { breakLine: false } }
], {
  x: 0.7, y: 2.15, w: 4, h: 1.8,
  fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark,
  paraSpaceAfter: 2
});

slide30.addShape(pptx.ShapeType.rect, {
  x: 5.2, y: 1.55, w: 4.3, h: 2.5,
  fill: { color: COLORS.bgWhite },
  shadow: { type: "outer", blur: 2, offset: 1, angle: 45, opacity: 0.1 }
});

slide30.addShape(pptx.ShapeType.rect, {
  x: 5.2, y: 1.55, w: 4.3, h: 0.5,
  fill: { color: COLORS.accent }
});

slide30.addText("关键测试项目", {
  x: 5.4, y: 1.6, w: 4, h: 0.4,
  fontSize: 12, fontFace: FONTS.title, color: COLORS.textLight, bold: true
});

slide30.addText([
  { text: "振动测试（ISO 16750）", options: { bullet: true, breakLine: true } },
  { text: "耐温循环测试", options: { bullet: true, breakLine: true } },
  { text: "盐雾腐蚀测试", options: { bullet: true, breakLine: true } },
  { text: "防水等级测试（IP67/IP69K）", options: { bullet: true, breakLine: true } },
  { text: "端子压接强度测试（USCAR 21）", options: { bullet: true, breakLine: false } }
], {
  x: 5.4, y: 2.15, w: 4, h: 1.8,
  fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark,
  paraSpaceAfter: 6
});

slide30.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 4.2, w: 9, h: 1.1,
  fill: { color: COLORS.bgLight }
});

slide30.addText("业务常见问题", {
  x: 0.7, y: 4.3, w: 8.6, h: 0.35,
  fontSize: 12, fontFace: FONTS.title, color: COLORS.primary, bold: true
});

slide30.addText("Q: 客户要求提供TS16949证书？→ 这是IATF 16949的前身，向品质部索取 | Q: 样品需要AVLL测试？→ 向技术部确认测试项目和费用", {
  x: 0.7, y: 4.7, w: 8.6, h: 0.5,
  fontSize: 10, fontFace: FONTS.body, color: COLORS.textDark
});

let slide31 = createContentSlide(31, TOTAL, "家电线束技术基础", "07 技术指引");

slide31.addText("家电线束特点与要求", {
  x: 0.5, y: 1.1, w: 9, h: 0.4,
  fontSize: 16, fontFace: FONTS.title, color: COLORS.primary, bold: true
});

slide31.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.55, w: 9, h: 2.3,
  fill: { color: COLORS.bgWhite },
  shadow: { type: "outer", blur: 2, offset: 1, angle: 45, opacity: 0.1 }
});

const homeSpecs = [
  { title: "认证标准", items: "ISO 9001 · UL · CE · CQC" },
  { title: "工作温度", items: "-10°C ~ +70°C（一般）" },
  { title: "质量要求", items: "不良率<0.3%，抽检为主" },
  { title: "环保要求", items: "RoHS，符合GB 4706安全标准" }
];

homeSpecs.forEach((spec, idx) => {
  const y = 1.7 + idx * 0.5;

  slide31.addText(spec.title + "：", {
    x: 0.7, y, w: 1.8, h: 0.4,
    fontSize: 11, fontFace: FONTS.title, color: COLORS.primary, bold: true
  });

  slide31.addText(spec.items, {
    x: 2.5, y, w: 6.8, h: 0.4,
    fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark
  });
});

slide31.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 4.0, w: 4.3, h: 1.3,
  fill: { color: COLORS.success },
  transparency: 15
});

slide31.addText("✅ 优势", {
  x: 0.7, y: 4.1, w: 4, h: 0.35,
  fontSize: 12, fontFace: FONTS.title, color: COLORS.success, bold: true
});

slide31.addText([
  { text: "订单批量大，稳定生产", options: { bullet: true, breakLine: true } },
  { text: "工艺相对简单，良率高", options: { bullet: true, breakLine: true } },
  { text: "客户账期相对较好", options: { bullet: true, breakLine: false } }
], {
  x: 0.7, y: 4.5, w: 4, h: 0.75,
  fontSize: 10, fontFace: FONTS.body, color: COLORS.textDark
});

slide31.addShape(pptx.ShapeType.rect, {
  x: 5.2, y: 4.0, w: 4.3, h: 1.3,
  fill: { color: COLORS.danger },
  transparency: 15
});

slide31.addText("⚠️ 风险", {
  x: 5.4, y: 4.1, w: 4, h: 0.35,
  fontSize: 12, fontFace: FONTS.title, color: COLORS.danger, bold: true
});

slide31.addText([
  { text: "竞争激烈，价格压力大", options: { bullet: true, breakLine: true } },
  { text: "大客户账期长（如海尔、美的）", options: { bullet: true, breakLine: true } },
  { text: "质量要求逐步向汽车线看齐", options: { bullet: true, breakLine: false } }
], {
  x: 5.4, y: 4.5, w: 4, h: 0.75,
  fontSize: 10, fontFace: FONTS.body, color: COLORS.textDark
});

let slide32 = createContentSlide(32, TOTAL, "技术参数速查", "07 技术指引");

slide32.addText("常用导线规格对照表", {
  x: 0.5, y: 1.1, w: 9, h: 0.4,
  fontSize: 16, fontFace: FONTS.title, color: COLORS.primary, bold: true
});

slide32.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.55, w: 9, h: 2.6,
  fill: { color: COLORS.bgWhite },
  shadow: { type: "outer", blur: 2, offset: 1, angle: 45, opacity: 0.1 }
});

const wireData = [
  ["AWG", "截面积(mm²)", "额定电流(A)", "常见用途"],
  ["22 AWG", "0.324", "2", "信号线、小电流"],
  ["20 AWG", "0.519", "3", "信号线、控制线"],
  ["18 AWG", "0.823", "5", "尾灯、开关"],
  ["16 AWG", "1.31", "7", "转向灯、喇叭"],
  ["14 AWG", "2.08", "10", "大灯、暖风"],
  ["12 AWG", "3.31", "15", "发动机相关"],
  ["10 AWG", "5.26", "20", "电源线"],
  ["8 AWG", "8.37", "30", "启动电源"]
];

slide32.addTable(wireData, {
  x: 0.6, y: 1.65, w: 8.8, h: 2.4,
  colW: [1.5, 2, 1.8, 3.5],
  border: { pt: 0.5, color: COLORS.border },
  fontFace: FONTS.body,
  fontSize: 9,
  color: COLORS.textDark,
  align: "center",
  valign: "middle"
});

slide32.addShape(pptx.ShapeType.rect, {
  x: 0.6, y: 1.65, w: 8.8, h: 0.35,
  fill: { color: COLORS.primary }
});

slide32.addText("AWG            截面积(mm²)    额定电流(A)         常见用途", {
  x: 0.6, y: 1.67, w: 8.8, h: 0.3,
  fontSize: 9, fontFace: FONTS.title, color: COLORS.textLight, bold: true, align: "center"
});

slide32.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 4.3, w: 9, h: 1,
  fill: { color: COLORS.bgLight }
});

slide32.addText("业务记忆口诀", {
  x: 0.7, y: 4.4, w: 8.6, h: 0.3,
  fontSize: 11, fontFace: FONTS.title, color: COLORS.accent, bold: true
});

slide32.addText("AWG数值越大，导线越细，载流越小 | 0.5²够一般信号，1.5²够一般电源，2.5²够大电流 | 汽车线束常用18~10AWG", {
  x: 0.7, y: 4.75, w: 8.6, h: 0.5,
  fontSize: 10, fontFace: FONTS.body, color: COLORS.textDark
});

let slide33 = createContentSlide(33, TOTAL, "技术沟通话术", "07 技术指引");

slide33.addText("与客户技术部门沟通的技巧", {
  x: 0.5, y: 1.1, w: 9, h: 0.4,
  fontSize: 16, fontFace: FONTS.title, color: COLORS.primary, bold: true
});

const commTips = [
  { q: "客户问：你们的压接标准是什么？", a: "我们采用USCAR21标准，100%拉力检测，汽车线不良率<10PPM" },
  { q: "客户问：产品能过哪些认证？", a: "汽车线束通过IATF16949/UL/CCC，家电线束通过ISO9001/UL/CE" },
  { q: "客户问：最小订单量是多少？", a: "需要与PMC确认，一般汽车线束50套起，家电线束500套起" },
  { q: "客户问：样品交期多久？", a: "新产品开发15-30天，已有产品5-7天，具体需与技术部确认" }
];

commTips.forEach((tip, idx) => {
  const y = 1.55 + idx * 0.95;

  slide33.addShape(pptx.ShapeType.rect, {
    x: 0.5, y, w: 9, h: 0.85,
    fill: { color: COLORS.bgWhite },
    shadow: { type: "outer", blur: 1, offset: 1, angle: 45, opacity: 0.1 }
  });

  slide33.addText("Q:", {
    x: 0.65, y: y + 0.1, w: 0.3, h: 0.3,
    fontSize: 11, fontFace: FONTS.title, color: COLORS.accent, bold: true
  });

  slide33.addText(tip.q, {
    x: 0.95, y: y + 0.08, w: 8.4, h: 0.35,
    fontSize: 10, fontFace: FONTS.body, color: COLORS.textDark
  });

  slide33.addText("A:", {
    x: 0.65, y: y + 0.45, w: 0.3, h: 0.3,
    fontSize: 11, fontFace: FONTS.title, color: COLORS.success, bold: true
  });

  slide33.addText(tip.a, {
    x: 0.95, y: y + 0.43, w: 8.4, h: 0.35,
    fontSize: 10, fontFace: FONTS.body, color: COLORS.textMuted
  });
});

let slide34 = createContentSlide(34, TOTAL, "技术型销售成长路径", "08 成长路径");

slide34.addText("三阶段能力模型", {
  x: 0.5, y: 1.1, w: 9, h: 0.4,
  fontSize: 16, fontFace: FONTS.title, color: COLORS.primary, bold: true
});

const stages2 = [
  {
    phase: "初级阶段",
    time: "0-6个月",
    color: COLORS.secondary,
    skills: ["掌握产品基础参数", "熟悉内部流程", "了解客户需求", "独立跟进中小客户"],
    goal: "能独立处理日常业务"
  },
  {
    phase: "中级阶段",
    time: "6-18个月",
    color: COLORS.accent,
    skills: ["技术方案报价能力", "大客户维护", "问题处理能力", "竞争应对"],
    goal: "能独当一面，成为客户信赖的对象"
  },
  {
    phase: "高级阶段",
    time: "18-36个月",
    color: COLORS.primaryDark,
    skills: ["技术型销售转型", "大项目操盘", "客户战略规划", "团队协作能力"],
    goal: "能带领团队，赢得战略性客户"
  }
];

stages2.forEach((stage, idx) => {
  const x = 0.5 + idx * 3.1;

  slide34.addShape(pptx.ShapeType.rect, {
    x, y: 1.55, w: 2.9, h: 3.4,
    fill: { color: COLORS.bgWhite },
    line: { color: stage.color, width: 2 },
    shadow: { type: "outer", blur: 3, offset: 2, angle: 45, opacity: 0.15 }
  });

  slide34.addShape(pptx.ShapeType.rect, {
    x, y: 1.55, w: 2.9, h: 0.7,
    fill: { color: stage.color }
  });

  slide34.addText(stage.phase, {
    x, y: 1.6, w: 2.9, h: 0.4,
    fontSize: 14, fontFace: FONTS.title, color: COLORS.textLight, bold: true, align: "center"
  });

  slide34.addText(stage.time, {
    x, y: 2.0, w: 2.9, h: 0.25,
    fontSize: 10, fontFace: FONTS.body, color: COLORS.textLight, align: "center"
  });

  slide34.addText("目标：" + stage.goal, {
    x: x + 0.15, y: 2.35, w: 2.6, h: 0.55,
    fontSize: 9, fontFace: FONTS.body, color: COLORS.textDark
  });

  slide34.addText("核心能力：", {
    x: x + 0.15, y: 2.95, w: 2.6, h: 0.3,
    fontSize: 9, fontFace: FONTS.title, color: stage.color, bold: true
  });

  slide34.addText(
    stage.skills.map((s, i) => ({
      text: s,
      options: { bullet: true, breakLine: i < stage.skills.length - 1 }
    })),
    {
      x: x + 0.15, y: 3.25, w: 2.6, h: 1.5,
      fontSize: 9, fontFace: FONTS.body, color: COLORS.textDark,
      paraSpaceAfter: 4
    }
  );
});

let slide35 = createContentSlide(35, TOTAL, "学习资源推荐", "08 成长路径");

slide35.addText("技术型销售成长指南", {
  x: 0.5, y: 1.1, w: 9, h: 0.4,
  fontSize: 16, fontFace: FONTS.title, color: COLORS.primary, bold: true
});

slide35.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.55, w: 4.3, h: 2.5,
  fill: { color: COLORS.bgWhite },
  shadow: { type: "outer", blur: 2, offset: 1, angle: 45, opacity: 0.1 }
});

slide35.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.55, w: 4.3, h: 0.5,
  fill: { color: COLORS.primary }
});

slide35.addText("📚 推荐学习内容", {
  x: 0.7, y: 1.6, w: 4, h: 0.4,
  fontSize: 12, fontFace: FONTS.title, color: COLORS.textLight, bold: true
});

slide35.addText([
  { text: "线束设计基础", options: { bullet: true, breakLine: true } },
  { text: "汽车电气系统原理", options: { bullet: true, breakLine: true } },
  { text: "供应商管理知识", options: { bullet: true, breakLine: true } },
  { text: "商务谈判技巧", options: { bullet: true, breakLine: true } },
  { text: "客户关系管理", options: { bullet: true, breakLine: false } }
], {
  x: 0.7, y: 2.15, w: 4, h: 1.8,
  fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark,
  paraSpaceAfter: 6
});

slide35.addShape(pptx.ShapeType.rect, {
  x: 5.2, y: 1.55, w: 4.3, h: 2.5,
  fill: { color: COLORS.bgWhite },
  shadow: { type: "outer", blur: 2, offset: 1, angle: 45, opacity: 0.1 }
});

slide35.addShape(pptx.ShapeType.rect, {
  x: 5.2, y: 1.55, w: 4.3, h: 0.5,
  fill: { color: COLORS.accent }
});

slide35.addText("💡 实践建议", {
  x: 5.4, y: 1.6, w: 4, h: 0.4,
  fontSize: 12, fontFace: FONTS.title, color: COLORS.textLight, bold: true
});

slide35.addText([
  { text: "跟线学习：跟一次完整的生产流程", options: { bullet: true, breakLine: true } },
  { text: "跟客学习：陪同拜访客户技术对接", options: { bullet: true, breakLine: true } },
  { text: "问题复盘：每次问题后写复盘总结", options: { bullet: true, breakLine: true } },
  { text: "技术考级：考取线束工程师证书", options: { bullet: true, breakLine: true } },
  { text: "跨部门轮岗：了解采购/品质基础", options: { bullet: true, breakLine: false } }
], {
  x: 5.4, y: 2.15, w: 4, h: 1.8,
  fontSize: 11, fontFace: FONTS.body, color: COLORS.textDark,
  paraSpaceAfter: 6
});

slide35.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 4.2, w: 9, h: 1.05,
  fill: { color: COLORS.primaryDark }
});

slide35.addText("🏆 成长寄语", {
  x: 0.7, y: 4.3, w: 8.6, h: 0.35,
  fontSize: 13, fontFace: FONTS.title, color: COLORS.accent, bold: true
});

slide35.addText("技术型销售是最稀缺的人才——既懂技术能解决问题，又懂商业能赢得客户。坚持学习，你将成为公司最有价值的人。", {
  x: 0.7, y: 4.7, w: 8.6, h: 0.5,
  fontSize: 11, fontFace: FONTS.body, color: COLORS.textLight
});

let slide36 = createContentSlide(36, TOTAL, "Q&A 与联系方式", "END");

slide36.addShape(pptx.ShapeType.rect, {
  x: 0, y: 0, w: 10, h: 5.625,
  fill: { color: COLORS.primaryDark }
});

slide36.addShape(pptx.ShapeType.rect, {
  x: 3, y: 1.2, w: 4, h: 0.06,
  fill: { color: COLORS.accent }
});

slide36.addText("Q & A", {
  x: 0, y: 1.4, w: 10, h: 1,
  fontSize: 48, fontFace: FONTS.title, color: COLORS.textLight, bold: true, align: "center"
});

slide36.addText("培训内容到此结束，欢迎提问交流", {
  x: 0, y: 2.4, w: 10, h: 0.5,
  fontSize: 16, fontFace: FONTS.body, color: COLORS.textMuted, align: "center"
});

slide36.addShape(pptx.ShapeType.rect, {
  x: 1.5, y: 3.2, w: 7, h: 1.8,
  fill: { color: COLORS.primary },
  transparency: 30
});

slide36.addText("联系咨询", {
  x: 1.5, y: 3.35, w: 7, h: 0.4,
  fontSize: 14, fontFace: FONTS.title, color: COLORS.accent, bold: true, align: "center"
});

slide36.addText([
  { text: "业务部负责人：[待补充]", options: { breakLine: true } },
  { text: "技术部负责人：[待补充]", options: { breakLine: true } },
  { text: "培训负责人：[待补充]", options: { breakLine: true } },
  { text: "培训日期：2026年4月", options: { breakLine: false } }
], {
  x: 1.7, y: 3.8, w: 6.6, h: 1.1,
  fontSize: 12, fontFace: FONTS.body, color: COLORS.textLight, align: "center"
});

slide36.addText("青岛弘博电缆有限公司", {
  x: 0, y: 5.1, w: 10, h: 0.35,
  fontSize: 12, fontFace: FONTS.body, color: COLORS.textMuted, align: "center"
});

const outputPath = "D:/线束业务培训/output/青岛弘博电缆_新业务入职培训.pptx";
pptx.writeFile({ fileName: outputPath }).then(() => {
  console.log("PPT generated successfully: " + outputPath);
}).catch(err => {
  console.error("Error generating PPT:", err);
});