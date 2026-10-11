/**
 * Mock Data - 二级单位考核指标评分系统
 * 数据来源：2026年6月实际考核数据（Excel导入）
 */

// ============================================================
// 考核标准配置数据（2026年7月修订版新标准）
// 三业态独立标准表：主业16项84分 / 海外8项100分 / 投资9项100分
// 字段：applicable=业态，category=考核类别，proof=证明资料，source=取数平台/通道
// ============================================================
const ASSESSMENT_RULES = [
  // ---------- 主业（总分84分，序号1-16） ----------
  { id: 1, applicable: '主业', category: '目标引领', name: '云筑网履约额', period: '仅6月、12月触发', score: '7', rule: '未达标按缺口比例扣分', proof: '平台提取', source: 'DSC+数字商务', standard: '云筑网履约额/本月累计产值×100%≥70%，每低1%扣1分；以商务确权值为基准；JMRH等项目产值扣除需生产副总签字确认；商务确权产值来源于数字商务系统（自动抓取，不再经手动补录）' },
  { id: 2, applicable: '主业', category: '目标引领', name: '采购成本降低率', period: '每月触发', score: '6', rule: '实际降低率低于目标值扣分', proof: '平台提取', source: 'DSC+数字商务', standard: '平均采购成本降低率≥3.2%，每低0.1%扣1分' },
  { id: 3, applicable: '主业', category: '目标引领', name: '物资设备采购效益率', period: '每月触发', score: '6', rule: '效益率低于目标值扣分', proof: '平台提取', source: 'DSC', standard: '平均物资设备采购效益率≥11%，每低0.5%扣1分' },
  { id: 4, applicable: '主业', category: '目标引领', name: '分包工程集中采购率', period: '仅3、6、9、12月触发', score: '7', rule: '未达标按比例扣分（单位差异化阈值）', proof: '平台提取', source: 'DSC', standard: '≥25%，每低1%扣1分；差异化目标：主业25%/土木、轨道10%/文旅5%/北京22%' },
  { id: 5, applicable: '主业', category: '目标引领', name: '物资设备集中采购率', period: '每月触发', score: '6', rule: '未达标按比例扣分（单位差异化阈值）', proof: '平台提取', source: 'DSC', standard: '≥90%，每低2%扣1分；差异化目标：装饰65%/新型建造44%/轨道公司54%/发展建设80%' },
  { id: 6, applicable: '主业', category: '目标引领', name: '采购计划执行率', period: '每月触发', score: '5', rule: '执行率低于目标值按比例扣分', proof: '平台提取', source: 'DSC', standard: '当月采购计划执行率≥95%，每低1%扣1分' },
  { id: 7, applicable: '主业', category: '目标引领', name: '厂家直采率', period: '每月触发', score: '4', rule: '直采率低于目标值扣分', proof: '平台提取', source: 'DSC', standard: '厂家直采率≥33%，每低1%扣1分' },
  { id: 8, applicable: '主业', category: '目标引领', name: '在线评标率', period: '每月触发', score: '4', rule: '未达标按梯度扣分', proof: '平台提取', source: 'DSC', standard: '在线评标率≥98%，每低1%扣2分' },
  { id: 9, applicable: '主业', category: '目标引领', name: '平均采购时长', period: '每月触发', score: '3', rule: '超出标准天数按超期天数扣分', proof: '平台提取', source: 'DSC', standard: '平均采购时长≤32天，每增加1天扣1分' },
  { id: 10, applicable: '主业', category: '目标引领', name: '资源库优化', period: '仅3、6、9、12月触发', score: '4', rule: '休眠分供商清除率未达标扣分', proof: '平台提取', source: 'DSC', standard: '休眠（两年无合作）分供商清除率100%，每低1%扣1分' },
  { id: 11, applicable: '主业', category: '目标引领', name: '竣工项目资产周转率', period: '每月触发（延后2个月考核）', score: '4', rule: '周转率低于标杆扣分', proof: '平台提取', source: 'DSC', standard: '项目资产周转率≥70%，每低1%扣1分；延后2个月考核（6月考核1-4月竣工项目）' },
  { id: 12, applicable: '主业', category: '平台应用', name: '数字供应链平台应用', period: '按月（上月26日-本月25日）', score: '6', rule: '按平台考核子表内容执行', proof: '平台提取', source: '—', standard: '子表100分制，得分×0.06折算为本项6分；2、3月预考核，4月起正式考核' },
  { id: 13, applicable: '主业', category: '数据治理', name: '数据治理', period: '每月触发', score: '6', rule: '按异常占比排名梯度扣分', proof: '平台提取', source: 'DSC', standard: '采购成本降低率异常（>30%或<-30%）及物资设备采购效益率异常（>50%或<-30%）结算单占总计算单比例，按排名依次扣0.1分；承接原子表移出的两项异常数据考核' },
  { id: 14, applicable: '主业', category: '验收合规性', name: '验收合规性', period: '每月触发', score: '4', rule: '按不合规项数量扣分（全量核查）', proof: '检查', source: '—', standard: '当月验收单据全量核查：四方验收、送货据资料、货实相符，不合规1条扣1分；数据来自平台，平台不直接判定，需考核人主动抽查详情信息判断' },
  { id: 15, applicable: '主业', category: '资源管理', name: '资源管理', period: '按月', score: '7', rule: '事件驱动扣分（5条）', proof: '检查', source: '—', standard: '①工信部正式批投诉0.1分/笔；②云筑网投诉逾期未办结0.05分/笔；③上访事件2-4分/次；④违规使用禁用分供商1分/起；⑤分供商评价完成率100%，未完成扣0.5分（1月、7月考核）；数据来自平台，人工抽查判定类扣分经检查录入通道登记抽查记录与扣分依据后计分' },
  { id: 16, applicable: '主业', category: '合规管理', name: '合规管理', period: '按月', score: '5', rule: '事件驱动扣分（4条，上不封顶）', proof: '检查', source: '—', standard: '①一标一检违法分包/围标串标0.5分/条，其他违规0.2分/条；②审计巡视0.1分/条；③无计划进场0.5分/笔上不封顶；④专项治理延期上报0.5分/次' },
  // ---------- 海外（总分100分，序号1-8） ----------
  { id: 17, applicable: '海外', category: '目标引领', name: '采购成本降低率', period: '按季（季度末月）', score: '20', rule: '实际降低率低于目标值扣分', proof: '报送', source: '—', standard: '平均采购成本降低率≥3.2%，每低0.1%扣1分；与采购金额对比；海外报表功能上线后可转平台提取' },
  { id: 18, applicable: '海外', category: '目标引领', name: '物资设备集中采购率', period: '按月', score: '20', rule: '未达标按比例扣分', proof: '报送', source: '—', standard: '平均≥40%，每低1%扣1分；海外报表功能上线后可转平台提取' },
  { id: 19, applicable: '海外', category: '目标引领', name: '平均采购时长', period: '按月', score: '10', rule: '超出标准天数按超期天数扣分', proof: '报送', source: '—', standard: '平均采购时长≤32天，每增加1天扣1分；海外报表功能上线后可转平台提取' },
  { id: 20, applicable: '海外', category: '重点工作', name: '海外供应链建设', period: '按月', score: '10', rule: '事件驱动扣分', proof: '检查', source: '—', standard: '按月组织海外采购物资例会，问题未及时解决1分/项；参与马来西亚、印度尼西亚采购共享中心工作，未完成/延迟0.5分/项' },
  { id: 21, applicable: '海外', category: '重点工作', name: '月度重点工作挂图计划', period: '按月', score: '10', rule: '报送进度，按未完成项扣分', proof: '报送', source: '—', standard: '每季第一周报送挂图计划，每月25日报送进度；每月≥5项，每少1项或质量不高扣1分扣完为止；不报送/晚报送不得分' },
  { id: 22, applicable: '海外', category: '重点工作', name: '资源管理', period: '按月', score: '10', rule: '事件驱动扣分', proof: '报送', source: '—', standard: '同主业"资源管理"（1）-（5）条款；海外数据以报送为准，海外报表功能上线后可转平台提取' },
  { id: 23, applicable: '海外', category: '重点工作', name: '采购合规', period: '按月', score: '10', rule: '事件驱动扣分', proof: '报送', source: '—', standard: '同主业"合规管理"（1）-（4）条款；海外数据以报送为准，海外报表功能上线后可转平台提取' },
  { id: 24, applicable: '海外', category: '重点工作', name: '资源白名单', period: '按年（12月年末考核）', score: '10', rule: '按发布数量缺口扣分', proof: '报送', source: '—', standard: '年度发布≥20项出海资源白名单资源库，每少1项扣1.5分' },
  // ---------- 投资（总分100分，序号1-9） ----------
  { id: 25, applicable: '投资', category: '目标引领', name: '采购成本降低率', period: '按季（季度末月）', score: '10', rule: '实际降低率低于目标值扣分', proof: '报送', source: '—', standard: '平均采购成本降低率≥3.2%，每低0.1%扣1分；与目标成本对比' },
  { id: 26, applicable: '投资', category: '目标引领', name: '招标采购计划执行率', period: '按月', score: '10', rule: '执行率低于目标值按比例扣分', proof: '平台提取', source: 'DSC', standard: '当月采购计划执行率≥95%，每低1%扣1分；城市运营报送' },
  { id: 27, applicable: '投资', category: '目标引领', name: '在线评标率', period: '按月', score: '10', rule: '未达标按梯度扣分', proof: '平台提取', source: '云筑网', standard: '在线评标率≥98%，每低1%扣2分；选用云筑网部分' },
  { id: 28, applicable: '投资', category: '目标引领', name: '公开采购率', period: '按月', score: '10', rule: '未达标按比例扣分', proof: '平台提取', source: '云筑网', standard: '公开采购率≥80%，每低1%扣1分；选用云筑网，结果公开' },
  { id: 29, applicable: '投资', category: '目标引领', name: '平均采购时长', period: '按月', score: '10', rule: '超出标准天数按超期天数扣分', proof: '平台提取', source: '云筑网', standard: '平均采购时长≤32天，每增加1天扣1分；①城市运营报送（DSC）；②东孚：取采购文件发布至招标结束；③考核口径：自发布采购公告起至完成成交' },
  { id: 30, applicable: '投资', category: '重点工作', name: '月度重点工作挂图计划', period: '按季度（局供应链管理部查验）', score: '20', rule: '报送进度+查验评分', proof: '报送', source: '—', standard: '每季第一周报送，每月25日报进度；每月≥3项，每少1项扣1分扣完为止；局供应链管理部按查验情况评分' },
  { id: 31, applicable: '投资', category: '重点工作', name: '资源管理', period: '按月', score: '10', rule: '事件驱动扣分', proof: '检查', source: '—', standard: '同主业"资源管理"（1）-（5）条款；恶意投诉除外；人工抽查判定类扣分经检查录入通道登记后计分' },
  { id: 32, applicable: '投资', category: '重点工作', name: '采购合规', period: '按月', score: '10', rule: '事件驱动扣分', proof: '检查', source: '—', standard: '同主业"合规管理"（1）-（4）条款' },
  { id: 33, applicable: '投资', category: '重点工作', name: '资源白名单', period: '按年（12月年末考核）', score: '10', rule: '按发布数量缺口扣分', proof: '报送', source: '—', standard: '年度发布≥6项白名单资源库，每少1项扣1.5分' },
];

// 三业态总分与类别分值汇总（用于类别分值合计校验）
const BIZ_TOTALS = [
  { biz: '主业', total: 84, count: 16, categories: '目标引领66 / 平台应用6 / 数据治理6 / 验收合规性4 / 资源管理7 / 合规管理5' },
  { biz: '海外', total: 100, count: 8, categories: '目标引领50 / 重点工作50' },
  { biz: '投资', total: 100, count: 9, categories: '目标引领50 / 重点工作50' },
];

// ============================================================
// 平台应用考核子表项（2026年7月修订版，13项，100分制）
// 较6月前版本（15项）：移出"采购成本降低率异常数据"与"物资设备采购效益异常数据"
// 两项（原累计扣分上限各50分），并入整体考核"数据治理"指标（按排名依次扣0.1分）
// ============================================================
const PLATFORM_RULES = [
  { id: 1, dimension: '采购管理方面', platform: 'DSC数字供应链平台', module: '【智慧采购】-采购计划', funcModule: '公司集采计划', indicator: '年度集采计划上线率', rule: '考核日前，应集采的二、三级单位是否上线"年度"集采计划，未上线扣5分。(1)年度集采计划应审批完成；(2)计划期间应为"年度-2026年"；(3)任意抽查2026年各单位新招标集采，若二、三级单位存在集采且均未做年度计划的，扣10分', score: 10 },
  { id: 2, dimension: '采购管理方面', platform: 'DSC数字供应链平台', module: '【智慧采购】-采购计划', funcModule: '项目采购计划', indicator: '物料名称准确率', rule: '考核周期内，考核项目采购计划物料名称的准确性，即项目采购计划中总采购类别为"物资、设备"时，采购内容未按照物料三级分类名称填写，而是在备注栏中注明具体采购物资设备名称的，每出现一次扣5分，扣完为止。', score: 40 },
  { id: 3, dimension: '采购管理方面', platform: '数据造假', module: '/', funcModule: '/', indicator: '数据全面真实有效', rule: '若发现数据不全，或存在数据作假，当月月度平台考核计0分处理', score: '当月月度平台考核计0分', note: '2、3月预考核，4月起正式考核' },
  { id: 4, dimension: '物资管理方面', platform: 'MDM主数据平台', module: '物料主数据管理', funcModule: '物料分类管理', indicator: '物料分类管理合规率', rule: '考核周期内，每条被驳回分类申请扣1分。', score: 10 },
  { id: 5, dimension: '物资管理方面', platform: 'DSC数字供应链平台', module: '【智能物管】-结算管理', funcModule: '物资过程结算', indicator: '结算办理率（产值录入）', rule: '考核二级单位项目月度结算办理率（办理率=考核周期内拥有过程结算单的验收单数量/考核周期内全部验收单数量），若高于95%计满分，若低于95%，每降低1%扣4分（90%以下不得分）。注：当月线上结算金额合计与当月实际产值占比，偏差低于产值的5%，或高于产值的80%的，此项扣20分。当月结算存在打包结算，造成结算数据异常的，每存在一条扣10分。', score: 20 },
  { id: 6, dimension: '物资管理方面', platform: 'DSC数字供应链平台', module: '【智能物管】-结算管理', funcModule: '确价管理', indicator: '结算确价应用率', rule: '考核周期内，浮动价结算时未进行确价，导致结算单单价金额为0元的单据，数量超过当月结算数量的0.5%的部分，每存在一笔扣5分。', score: 10 },
  { id: 7, dimension: '物资管理方面', platform: 'DSC数字供应链平台', module: '【智能物管】-结算管理', funcModule: '物资过程结算', indicator: '结算调差金额规范性', rule: '考核周期内，存在发生（正负）一千万元金额以上调差的单据，经复核与事实不符的，每发生1条单据扣5分，扣完为止（租赁除外）；考核周期内，存在单笔结算金额高于一千万元或低于零元的单据，经复核与事实不符的，每1条单据扣10分。', score: 10 },
  { id: 8, dimension: '物资管理方面', platform: '数字建造-DSC物资需用计划上线情况', module: '【智能物管】-订单管理', funcModule: '采购订单', indicator: '物资需用计划链通项目上线率', rule: '计算规则：物资需用计划链通上线率=应用需用计划生成已生效采购订单数量/发生已生效采购订单数量。考核规则：物资需用计划链通项目上线率90%，每降低10%，扣1分（虚拟项目不纳入）；', score: '累计扣分上限10分', note: '2、3月预考核，4月起正式考核' },
  { id: 9, dimension: '物资管理方面', platform: '验收合规性', module: '【智能物管】-验收管理', funcModule: '验收管理', indicator: '验收是否合规满足手册标准要求', rule: '计算规则：每月检查各二级单位当月验收单据，核实验收资料是否为四方验收，送货据资料是否货实相符。考核规则：不合规情况1条扣2分（混凝土等特例材料也需进行收验货操作，可批量或按部位收货）', score: '累计扣分上限10分', note: '2、3月预考核，4月起正式考核' },
  { id: 10, dimension: '物资管理方面', platform: 'DSC数字供应链平台', module: '【智能物管】-使用管理', funcModule: '盘点管理', indicator: '项目月度盘点应用执行率', rule: '计算规则：项目月度盘点应用率=执行盘点的项目数量/上月及本月产生生效采购订单的项目数量，应用率100%不扣分，每降低10%，扣1分', score: '累计扣分上限10分', note: '2、3月预考核，4月起正式考核' },
  { id: 11, dimension: '物资管理方面', platform: 'DSC数字供应链平台', module: '【智慧运营】-物资管理', funcModule: '物资设备依约支付率分析', indicator: '依约支付率异常数据', rule: '1、2026年以后产生的新合同每条异常数据扣1分，同时若当月月度考核整体面板异常此项加扣10分；2、日常应用排查，抓取面板数据作为汇报支撑材料时发现异常面板数据，记录至当月月度考核汇总1次扣1分。', score: '累计扣分上限10分', note: '2、3月预考核，4月起正式考核' },
  { id: 12, dimension: '物资管理方面', platform: '钢筋异常订单结算单率', module: '【智慧运营】-专题分析', funcModule: '物料价格明细查询', indicator: '钢筋异常价格数据', rule: '出现异常价格数据每条扣2分；异常范围：普通钢筋小类下物料，含税单价2000以下，5000以上', score: '累计扣分上限10分', note: '2、3月预考核，4月起正式考核' },
  { id: 13, dimension: '物资管理方面', platform: '数据造假', module: '/', funcModule: '/', indicator: '数据全面真实有效（物资）', rule: '若发现数据不全，或存在数据作假，当月月度平台考核计0分处理', score: '本月考核计0分', note: '2、3月预考核，4月起正式考核' },
];

// ============================================================
// 二级单位列表（18家主业单位，名称与原始 Excel 资料一致）
// 来源：2026年6月指标整体考核汇总.xlsx - 月度考核指标得分情况
// ============================================================
const SECONDARY_UNITS = [
  '一公司', '二公司', '三公司', '四公司', '东北公司', '总承包公司',
  '南方公司', '西南公司', '华南公司', '华北公司', '发展建设公司', '西北公司',
  '上海公司', '浙江公司', '华中公司', '北京公司', '土木公司', '轨道公司'
];

// ============================================================
// 2026年6月 各二级单位考核得分数据 (来自月度考核指标得分情况)
// ============================================================
const UNIT_SCORES_202606 = [
  { unit: '一公司', totalScore: 62.5, totalFullScore: 68, scoreRate: '91.9%', rank: 1,
    details: [
      { indicator: '履约额', fullScore: 7, actualScore: 7, actualValue: '78.3%', standard: '≥70%' },
      { indicator: '采购成本降低率', fullScore: 6, actualScore: 5.2, actualValue: '3.12%', standard: '≥3.2%' },
      { indicator: '物资设备采购效益率', fullScore: 6, actualScore: 6, actualValue: '12.5%', standard: '≥11%' },
      { indicator: '分包工程集中采购率', fullScore: 7, actualScore: 7, actualValue: '28.3%', standard: '≥25%' },
      { indicator: '物资设备集中采购率', fullScore: 6, actualScore: 6, actualValue: '92.1%', standard: '≥90%' },
      { indicator: '招标采购计划执行率', fullScore: 5, actualScore: 4.2, actualValue: '94.2%', standard: '≥95%' },
      { indicator: '厂家直采率', fullScore: 4, actualScore: 4, actualValue: '35.6%', standard: '≥33%' },
      { indicator: '在线评标率', fullScore: 4, actualScore: 3.6, actualValue: '97.8%', standard: '≥98%' },
      { indicator: '平均采购时长', fullScore: 3, actualScore: 2.5, actualValue: '32.5天', standard: '≤32天' },
      { indicator: '竣工项目资产周转率', fullScore: 4, actualScore: 3.8, actualValue: '68.2%', standard: '≥70%' },
      { indicator: '数据治理', fullScore: 6, actualScore: 5, actualValue: '正常', standard: '无异常' },
      { indicator: '验收合规性', fullScore: 4, actualScore: 3.8, actualValue: '9条合规', standard: '抽检10条' },
      { indicator: '数字供应链平台应用', fullScore: 6, actualScore: 4.4, actualValue: '73分', standard: '按标准' },
    ]
  },
  { unit: '二公司', totalScore: 60.8, totalFullScore: 68, scoreRate: '89.4%', rank: 2,
    details: [
      { indicator: '履约额', fullScore: 7, actualScore: 6.5, actualValue: '75.1%', standard: '≥70%' },
      { indicator: '采购成本降低率', fullScore: 6, actualScore: 5.8, actualValue: '3.18%', standard: '≥3.2%' },
      { indicator: '物资设备采购效益率', fullScore: 6, actualScore: 5.5, actualValue: '10.8%', standard: '≥11%' },
      { indicator: '分包工程集中采购率', fullScore: 7, actualScore: 6, actualValue: '23.5%', standard: '≥25%' },
      { indicator: '物资设备集中采购率', fullScore: 6, actualScore: 6, actualValue: '91.5%', standard: '≥90%' },
      { indicator: '招标采购计划执行率', fullScore: 5, actualScore: 4, actualValue: '94.0%', standard: '≥95%' },
      { indicator: '厂家直采率', fullScore: 4, actualScore: 3.5, actualValue: '32.5%', standard: '≥33%' },
      { indicator: '在线评标率', fullScore: 4, actualScore: 4, actualValue: '98.5%', standard: '≥98%' },
      { indicator: '平均采购时长', fullScore: 3, actualScore: 2, actualValue: '33.0天', standard: '≤32天' },
      { indicator: '竣工项目资产周转率', fullScore: 4, actualScore: 3.5, actualValue: '67.5%', standard: '≥70%' },
      { indicator: '数据治理', fullScore: 6, actualScore: 5, actualValue: '正常', standard: '无异常' },
      { indicator: '验收合规性', fullScore: 4, actualScore: 3.5, actualValue: '8条合规', standard: '抽检10条' },
      { indicator: '数字供应链平台应用', fullScore: 6, actualScore: 5.5, actualValue: '92分', standard: '按标准' },
    ]
  },
  { unit: '三公司', totalScore: 59.3, totalFullScore: 68, scoreRate: '87.2%', rank: 3,
    details: [
      { indicator: '履约额', fullScore: 7, actualScore: 7, actualValue: '81.2%', standard: '≥70%' },
      { indicator: '采购成本降低率', fullScore: 6, actualScore: 5, actualValue: '3.10%', standard: '≥3.2%' },
      { indicator: '物资设备采购效益率', fullScore: 6, actualScore: 5, actualValue: '10.5%', standard: '≥11%' },
      { indicator: '分包工程集中采购率', fullScore: 7, actualScore: 7, actualValue: '27.8%', standard: '≥25%' },
      { indicator: '物资设备集中采购率', fullScore: 6, actualScore: 5.5, actualValue: '88.3%', standard: '≥90%' },
      { indicator: '招标采购计划执行率', fullScore: 5, actualScore: 3.5, actualValue: '93.5%', standard: '≥95%' },
      { indicator: '厂家直采率', fullScore: 4, actualScore: 4, actualValue: '34.8%', standard: '≥33%' },
      { indicator: '在线评标率', fullScore: 4, actualScore: 3.2, actualValue: '97.4%', standard: '≥98%' },
      { indicator: '平均采购时长', fullScore: 3, actualScore: 2.3, actualValue: '32.7天', standard: '≤32天' },
      { indicator: '竣工项目资产周转率', fullScore: 4, actualScore: 4, actualValue: '72.1%', standard: '≥70%' },
      { indicator: '数据治理', fullScore: 6, actualScore: 5, actualValue: '正常', standard: '无异常' },
      { indicator: '验收合规性', fullScore: 4, actualScore: 3.5, actualValue: '8条合规', standard: '抽检10条' },
      { indicator: '数字供应链平台应用', fullScore: 6, actualScore: 4.3, actualValue: '72分', standard: '按标准' },
    ]
  },
  { unit: '四公司', totalScore: 58.1, totalFullScore: 68, scoreRate: '85.4%', rank: 4,
    details: [
      { indicator: '履约额', fullScore: 7, actualScore: 6.8, actualValue: '76.5%', standard: '≥70%' },
      { indicator: '采购成本降低率', fullScore: 6, actualScore: 5.5, actualValue: '3.15%', standard: '≥3.2%' },
      { indicator: '物资设备采购效益率', fullScore: 6, actualScore: 5, actualValue: '10.6%', standard: '≥11%' },
      { indicator: '分包工程集中采购率', fullScore: 7, actualScore: 6.5, actualValue: '24.2%', standard: '≥25%' },
      { indicator: '物资设备集中采购率', fullScore: 6, actualScore: 6, actualValue: '91.8%', standard: '≥90%' },
      { indicator: '招标采购计划执行率', fullScore: 5, actualScore: 3.8, actualValue: '93.8%', standard: '≥95%' },
      { indicator: '厂家直采率', fullScore: 4, actualScore: 3, actualValue: '31.5%', standard: '≥33%' },
      { indicator: '在线评标率', fullScore: 4, actualScore: 3.5, actualValue: '97.5%', standard: '≥98%' },
      { indicator: '平均采购时长', fullScore: 3, actualScore: 2, actualValue: '33.0天', standard: '≤32天' },
      { indicator: '竣工项目资产周转率', fullScore: 4, actualScore: 3.2, actualValue: '66.8%', standard: '≥70%' },
      { indicator: '数据治理', fullScore: 6, actualScore: 4, actualValue: '3条异常', standard: '无异常' },
      { indicator: '验收合规性', fullScore: 4, actualScore: 3.4, actualValue: '7条合规', standard: '抽检10条' },
      { indicator: '数字供应链平台应用', fullScore: 6, actualScore: 4.4, actualValue: '73分', standard: '按标准' },
    ]
  },
  { unit: '土木公司', totalScore: 57.5, totalFullScore: 68, scoreRate: '84.6%', rank: 5,
    details: [
      { indicator: '履约额', fullScore: 7, actualScore: 6.5, actualValue: '74.8%', standard: '≥70%' },
      { indicator: '采购成本降低率', fullScore: 6, actualScore: 5, actualValue: '3.10%', standard: '≥3.2%' },
      { indicator: '物资设备采购效益率', fullScore: 6, actualScore: 5.5, actualValue: '10.9%', standard: '≥11%' },
      { indicator: '分包工程集中采购率', fullScore: 7, actualScore: 6, actualValue: '23.8%', standard: '≥25%' },
      { indicator: '物资设备集中采购率', fullScore: 6, actualScore: 5, actualValue: '88.5%', standard: '≥90%' },
      { indicator: '招标采购计划执行率', fullScore: 5, actualScore: 3.5, actualValue: '93.5%', standard: '≥95%' },
      { indicator: '厂家直采率', fullScore: 4, actualScore: 3.5, actualValue: '32.8%', standard: '≥33%' },
      { indicator: '在线评标率', fullScore: 4, actualScore: 3, actualValue: '97.0%', standard: '≥98%' },
      { indicator: '平均采购时长', fullScore: 3, actualScore: 2.5, actualValue: '32.5天', standard: '≤32天' },
      { indicator: '竣工项目资产周转率', fullScore: 4, actualScore: 3.5, actualValue: '67.2%', standard: '≥70%' },
      { indicator: '数据治理', fullScore: 6, actualScore: 5, actualValue: '正常', standard: '无异常' },
      { indicator: '验收合规性', fullScore: 4, actualScore: 3, actualValue: '7条合规', standard: '抽检10条' },
      { indicator: '数字供应链平台应用', fullScore: 6, actualScore: 5.5, actualValue: '92分', standard: '按标准' },
    ]
  },
  { unit: '轨道公司', totalScore: 56.2, totalFullScore: 68, scoreRate: '82.6%', rank: 6,
    details: [
      { indicator: '履约额', fullScore: 7, actualScore: 6.3, actualValue: '73.5%', standard: '≥70%' },
      { indicator: '采购成本降低率', fullScore: 6, actualScore: 4.8, actualValue: '3.05%', standard: '≥3.2%' },
      { indicator: '物资设备采购效益率', fullScore: 6, actualScore: 5.2, actualValue: '10.7%', standard: '≥11%' },
      { indicator: '分包工程集中采购率', fullScore: 7, actualScore: 5.8, actualValue: '22.8%', standard: '≥25%' },
      { indicator: '物资设备集中采购率', fullScore: 6, actualScore: 5.6, actualValue: '89.2%', standard: '≥90%' },
      { indicator: '招标采购计划执行率', fullScore: 5, actualScore: 4.1, actualValue: '94.0%', standard: '≥95%' },
      { indicator: '厂家直采率', fullScore: 4, actualScore: 3.3, actualValue: '32.2%', standard: '≥33%' },
      { indicator: '在线评标率', fullScore: 4, actualScore: 3.1, actualValue: '97.0%', standard: '≥98%' },
      { indicator: '平均采购时长', fullScore: 3, actualScore: 1.6, actualValue: '33.5天', standard: '≤32天' },
      { indicator: '竣工项目资产周转率', fullScore: 4, actualScore: 3.1, actualValue: '65.8%', standard: '≥70%' },
      { indicator: '数据治理', fullScore: 6, actualScore: 5.4, actualValue: '1条异常', standard: '无异常' },
      { indicator: '验收合规性', fullScore: 4, actualScore: 3.4, actualValue: '7条合规', standard: '抽检10条' },
      { indicator: '数字供应链平台应用', fullScore: 6, actualScore: 4.5, actualValue: '75分', standard: '按标准' },
    ]
  },
  { unit: '东北公司', totalScore: 55.6, totalFullScore: 68, scoreRate: '81.8%', rank: 7,
    details: [
      { indicator: '履约额', fullScore: 7, actualScore: 6.2, actualValue: '74.1%', standard: '≥70%' },
      { indicator: '采购成本降低率', fullScore: 6, actualScore: 4.7, actualValue: '3.02%', standard: '≥3.2%' },
      { indicator: '物资设备采购效益率', fullScore: 6, actualScore: 5.1, actualValue: '10.6%', standard: '≥11%' },
      { indicator: '分包工程集中采购率', fullScore: 7, actualScore: 5.7, actualValue: '22.5%', standard: '≥25%' },
      { indicator: '物资设备集中采购率', fullScore: 6, actualScore: 5.5, actualValue: '88.9%', standard: '≥90%' },
      { indicator: '招标采购计划执行率', fullScore: 5, actualScore: 4.0, actualValue: '93.8%', standard: '≥95%' },
      { indicator: '厂家直采率', fullScore: 4, actualScore: 3.2, actualValue: '32.0%', standard: '≥33%' },
      { indicator: '在线评标率', fullScore: 4, actualScore: 3.0, actualValue: '96.8%', standard: '≥98%' },
      { indicator: '平均采购时长', fullScore: 3, actualScore: 1.7, actualValue: '33.3天', standard: '≤32天' },
      { indicator: '竣工项目资产周转率', fullScore: 4, actualScore: 3.2, actualValue: '65.9%', standard: '≥70%' },
      { indicator: '数据治理', fullScore: 6, actualScore: 5.3, actualValue: '1条异常', standard: '无异常' },
      { indicator: '验收合规性', fullScore: 4, actualScore: 3.3, actualValue: '7条合规', standard: '抽检10条' },
      { indicator: '数字供应链平台应用', fullScore: 6, actualScore: 4.4, actualValue: '73分', standard: '按标准' },
    ]
  },
  { unit: '总承包公司', totalScore: 55.0, totalFullScore: 68, scoreRate: '80.9%', rank: 8,
    details: [
      { indicator: '履约额', fullScore: 7, actualScore: 6.4, actualValue: '74.6%', standard: '≥70%' },
      { indicator: '采购成本降低率', fullScore: 6, actualScore: 4.6, actualValue: '3.00%', standard: '≥3.2%' },
      { indicator: '物资设备采购效益率', fullScore: 6, actualScore: 5.0, actualValue: '10.5%', standard: '≥11%' },
      { indicator: '分包工程集中采购率', fullScore: 7, actualScore: 5.6, actualValue: '22.2%', standard: '≥25%' },
      { indicator: '物资设备集中采购率', fullScore: 6, actualScore: 5.4, actualValue: '88.5%', standard: '≥90%' },
      { indicator: '招标采购计划执行率', fullScore: 5, actualScore: 3.9, actualValue: '93.5%', standard: '≥95%' },
      { indicator: '厂家直采率', fullScore: 4, actualScore: 3.1, actualValue: '31.8%', standard: '≥33%' },
      { indicator: '在线评标率', fullScore: 4, actualScore: 2.9, actualValue: '96.6%', standard: '≥98%' },
      { indicator: '平均采购时长', fullScore: 3, actualScore: 1.5, actualValue: '33.5天', standard: '≤32天' },
      { indicator: '竣工项目资产周转率', fullScore: 4, actualScore: 3.0, actualValue: '65.5%', standard: '≥70%' },
      { indicator: '数据治理', fullScore: 6, actualScore: 5.2, actualValue: '2条异常', standard: '无异常' },
      { indicator: '验收合规性', fullScore: 4, actualScore: 3.3, actualValue: '7条合规', standard: '抽检10条' },
      { indicator: '数字供应链平台应用', fullScore: 6, actualScore: 4.3, actualValue: '72分', standard: '按标准' },
    ]
  },
  { unit: '南方公司', totalScore: 54.6, totalFullScore: 68, scoreRate: '80.3%', rank: 9,
    details: [
      { indicator: '履约额', fullScore: 7, actualScore: 6.3, actualValue: '74.3%', standard: '≥70%' },
      { indicator: '采购成本降低率', fullScore: 6, actualScore: 4.5, actualValue: '2.98%', standard: '≥3.2%' },
      { indicator: '物资设备采购效益率', fullScore: 6, actualScore: 4.9, actualValue: '10.4%', standard: '≥11%' },
      { indicator: '分包工程集中采购率', fullScore: 7, actualScore: 5.5, actualValue: '22.0%', standard: '≥25%' },
      { indicator: '物资设备集中采购率', fullScore: 6, actualScore: 5.4, actualValue: '88.4%', standard: '≥90%' },
      { indicator: '招标采购计划执行率', fullScore: 5, actualScore: 3.8, actualValue: '93.2%', standard: '≥95%' },
      { indicator: '厂家直采率', fullScore: 4, actualScore: 3.0, actualValue: '31.5%', standard: '≥33%' },
      { indicator: '在线评标率', fullScore: 4, actualScore: 3.0, actualValue: '96.7%', standard: '≥98%' },
      { indicator: '平均采购时长', fullScore: 3, actualScore: 1.6, actualValue: '33.4天', standard: '≤32天' },
      { indicator: '竣工项目资产周转率', fullScore: 4, actualScore: 3.1, actualValue: '66.0%', standard: '≥70%' },
      { indicator: '数据治理', fullScore: 6, actualScore: 5.1, actualValue: '2条异常', standard: '无异常' },
      { indicator: '验收合规性', fullScore: 4, actualScore: 3.2, actualValue: '6条合规', standard: '抽检10条' },
      { indicator: '数字供应链平台应用', fullScore: 6, actualScore: 4.2, actualValue: '70分', standard: '按标准' },
    ]
  },
  { unit: '西南公司', totalScore: 54.2, totalFullScore: 68, scoreRate: '79.7%', rank: 10,
    details: [
      { indicator: '履约额', fullScore: 7, actualScore: 6.2, actualValue: '73.9%', standard: '≥70%' },
      { indicator: '采购成本降低率', fullScore: 6, actualScore: 4.4, actualValue: '2.95%', standard: '≥3.2%' },
      { indicator: '物资设备采购效益率', fullScore: 6, actualScore: 4.9, actualValue: '10.3%', standard: '≥11%' },
      { indicator: '分包工程集中采购率', fullScore: 7, actualScore: 5.6, actualValue: '22.1%', standard: '≥25%' },
      { indicator: '物资设备集中采购率', fullScore: 6, actualScore: 5.3, actualValue: '88.2%', standard: '≥90%' },
      { indicator: '招标采购计划执行率', fullScore: 5, actualScore: 3.7, actualValue: '93.0%', standard: '≥95%' },
      { indicator: '厂家直采率', fullScore: 4, actualScore: 2.9, actualValue: '31.2%', standard: '≥33%' },
      { indicator: '在线评标率', fullScore: 4, actualScore: 2.8, actualValue: '96.4%', standard: '≥98%' },
      { indicator: '平均采购时长', fullScore: 3, actualScore: 1.5, actualValue: '33.5天', standard: '≤32天' },
      { indicator: '竣工项目资产周转率', fullScore: 4, actualScore: 3.2, actualValue: '66.1%', standard: '≥70%' },
      { indicator: '数据治理', fullScore: 6, actualScore: 5.0, actualValue: '2条异常', standard: '无异常' },
      { indicator: '验收合规性', fullScore: 4, actualScore: 3.2, actualValue: '6条合规', standard: '抽检10条' },
      { indicator: '数字供应链平台应用', fullScore: 6, actualScore: 4.1, actualValue: '68分', standard: '按标准' },
    ]
  },
  { unit: '华南公司', totalScore: 53.8, totalFullScore: 68, scoreRate: '79.1%', rank: 11,
    details: [
      { indicator: '履约额', fullScore: 7, actualScore: 6.1, actualValue: '73.5%', standard: '≥70%' },
      { indicator: '采购成本降低率', fullScore: 6, actualScore: 4.3, actualValue: '2.93%', standard: '≥3.2%' },
      { indicator: '物资设备采购效益率', fullScore: 6, actualScore: 4.8, actualValue: '10.2%', standard: '≥11%' },
      { indicator: '分包工程集中采购率', fullScore: 7, actualScore: 5.5, actualValue: '21.9%', standard: '≥25%' },
      { indicator: '物资设备集中采购率', fullScore: 6, actualScore: 5.3, actualValue: '88.1%', standard: '≥90%' },
      { indicator: '招标采购计划执行率', fullScore: 5, actualScore: 3.6, actualValue: '92.8%', standard: '≥95%' },
      { indicator: '厂家直采率', fullScore: 4, actualScore: 2.9, actualValue: '31.1%', standard: '≥33%' },
      { indicator: '在线评标率', fullScore: 4, actualScore: 2.9, actualValue: '96.5%', standard: '≥98%' },
      { indicator: '平均采购时长', fullScore: 3, actualScore: 1.6, actualValue: '33.4天', standard: '≤32天' },
      { indicator: '竣工项目资产周转率', fullScore: 4, actualScore: 3.1, actualValue: '65.9%', standard: '≥70%' },
      { indicator: '数据治理', fullScore: 6, actualScore: 5.1, actualValue: '2条异常', standard: '无异常' },
      { indicator: '验收合规性', fullScore: 4, actualScore: 3.1, actualValue: '6条合规', standard: '抽检10条' },
      { indicator: '数字供应链平台应用', fullScore: 6, actualScore: 4.0, actualValue: '67分', standard: '按标准' },
    ]
  },
  { unit: '华北公司', totalScore: 53.4, totalFullScore: 68, scoreRate: '78.5%', rank: 12,
    details: [
      { indicator: '履约额', fullScore: 7, actualScore: 6.0, actualValue: '73.1%', standard: '≥70%' },
      { indicator: '采购成本降低率', fullScore: 6, actualScore: 4.2, actualValue: '2.90%', standard: '≥3.2%' },
      { indicator: '物资设备采购效益率', fullScore: 6, actualScore: 4.8, actualValue: '10.1%', standard: '≥11%' },
      { indicator: '分包工程集中采购率', fullScore: 7, actualScore: 5.4, actualValue: '21.7%', standard: '≥25%' },
      { indicator: '物资设备集中采购率', fullScore: 6, actualScore: 5.2, actualValue: '87.9%', standard: '≥90%' },
      { indicator: '招标采购计划执行率', fullScore: 5, actualScore: 3.5, actualValue: '92.5%', standard: '≥95%' },
      { indicator: '厂家直采率', fullScore: 4, actualScore: 2.8, actualValue: '30.9%', standard: '≥33%' },
      { indicator: '在线评标率', fullScore: 4, actualScore: 2.8, actualValue: '96.3%', standard: '≥98%' },
      { indicator: '平均采购时长', fullScore: 3, actualScore: 1.5, actualValue: '33.5天', standard: '≤32天' },
      { indicator: '竣工项目资产周转率', fullScore: 4, actualScore: 3.0, actualValue: '65.6%', standard: '≥70%' },
      { indicator: '数据治理', fullScore: 6, actualScore: 5.0, actualValue: '3条异常', standard: '无异常' },
      { indicator: '验收合规性', fullScore: 4, actualScore: 3.1, actualValue: '6条合规', standard: '抽检10条' },
      { indicator: '数字供应链平台应用', fullScore: 6, actualScore: 3.9, actualValue: '65分', standard: '按标准' },
    ]
  },
  { unit: '发展建设公司', totalScore: 53.0, totalFullScore: 68, scoreRate: '77.9%', rank: 13,
    details: [
      { indicator: '履约额', fullScore: 7, actualScore: 6.1, actualValue: '73.4%', standard: '≥70%' },
      { indicator: '采购成本降低率', fullScore: 6, actualScore: 4.1, actualValue: '2.88%', standard: '≥3.2%' },
      { indicator: '物资设备采购效益率', fullScore: 6, actualScore: 4.7, actualValue: '10.0%', standard: '≥11%' },
      { indicator: '分包工程集中采购率', fullScore: 7, actualScore: 5.4, actualValue: '21.6%', standard: '≥25%' },
      { indicator: '物资设备集中采购率', fullScore: 6, actualScore: 5.2, actualValue: '87.8%', standard: '≥90%' },
      { indicator: '招标采购计划执行率', fullScore: 5, actualScore: 3.4, actualValue: '92.2%', standard: '≥95%' },
      { indicator: '厂家直采率', fullScore: 4, actualScore: 2.8, actualValue: '30.8%', standard: '≥33%' },
      { indicator: '在线评标率', fullScore: 4, actualScore: 2.9, actualValue: '96.5%', standard: '≥98%' },
      { indicator: '平均采购时长', fullScore: 3, actualScore: 1.6, actualValue: '33.4天', standard: '≤32天' },
      { indicator: '竣工项目资产周转率', fullScore: 4, actualScore: 3.1, actualValue: '65.8%', standard: '≥70%' },
      { indicator: '数据治理', fullScore: 6, actualScore: 4.9, actualValue: '3条异常', standard: '无异常' },
      { indicator: '验收合规性', fullScore: 4, actualScore: 3.0, actualValue: '6条合规', standard: '抽检10条' },
      { indicator: '数字供应链平台应用', fullScore: 6, actualScore: 3.8, actualValue: '63分', standard: '按标准' },
    ]
  },
  { unit: '西北公司', totalScore: 52.6, totalFullScore: 68, scoreRate: '77.4%', rank: 14,
    details: [
      { indicator: '履约额', fullScore: 7, actualScore: 6.0, actualValue: '73.0%', standard: '≥70%' },
      { indicator: '采购成本降低率', fullScore: 6, actualScore: 4.0, actualValue: '2.85%', standard: '≥3.2%' },
      { indicator: '物资设备采购效益率', fullScore: 6, actualScore: 4.6, actualValue: '9.9%', standard: '≥11%' },
      { indicator: '分包工程集中采购率', fullScore: 7, actualScore: 5.3, actualValue: '21.4%', standard: '≥25%' },
      { indicator: '物资设备集中采购率', fullScore: 6, actualScore: 5.1, actualValue: '87.6%', standard: '≥90%' },
      { indicator: '招标采购计划执行率', fullScore: 5, actualScore: 3.4, actualValue: '92.1%', standard: '≥95%' },
      { indicator: '厂家直采率', fullScore: 4, actualScore: 2.8, actualValue: '30.7%', standard: '≥33%' },
      { indicator: '在线评标率', fullScore: 4, actualScore: 2.8, actualValue: '96.3%', standard: '≥98%' },
      { indicator: '平均采购时长', fullScore: 3, actualScore: 1.5, actualValue: '33.5天', standard: '≤32天' },
      { indicator: '竣工项目资产周转率', fullScore: 4, actualScore: 3.0, actualValue: '65.5%', standard: '≥70%' },
      { indicator: '数据治理', fullScore: 6, actualScore: 4.9, actualValue: '3条异常', standard: '无异常' },
      { indicator: '验收合规性', fullScore: 4, actualScore: 3.0, actualValue: '5条合规', standard: '抽检10条' },
      { indicator: '数字供应链平台应用', fullScore: 6, actualScore: 3.7, actualValue: '62分', standard: '按标准' },
    ]
  },
  { unit: '上海公司', totalScore: 52.2, totalFullScore: 68, scoreRate: '76.8%', rank: 15,
    details: [
      { indicator: '履约额', fullScore: 7, actualScore: 5.9, actualValue: '72.7%', standard: '≥70%' },
      { indicator: '采购成本降低率', fullScore: 6, actualScore: 3.9, actualValue: '2.82%', standard: '≥3.2%' },
      { indicator: '物资设备采购效益率', fullScore: 6, actualScore: 4.6, actualValue: '9.8%', standard: '≥11%' },
      { indicator: '分包工程集中采购率', fullScore: 7, actualScore: 5.3, actualValue: '21.3%', standard: '≥25%' },
      { indicator: '物资设备集中采购率', fullScore: 6, actualScore: 5.1, actualValue: '87.5%', standard: '≥90%' },
      { indicator: '招标采购计划执行率', fullScore: 5, actualScore: 3.3, actualValue: '91.9%', standard: '≥95%' },
      { indicator: '厂家直采率', fullScore: 4, actualScore: 2.7, actualValue: '30.5%', standard: '≥33%' },
      { indicator: '在线评标率', fullScore: 4, actualScore: 2.7, actualValue: '96.1%', standard: '≥98%' },
      { indicator: '平均采购时长', fullScore: 3, actualScore: 1.4, actualValue: '33.6天', standard: '≤32天' },
      { indicator: '竣工项目资产周转率', fullScore: 4, actualScore: 3.1, actualValue: '65.9%', standard: '≥70%' },
      { indicator: '数据治理', fullScore: 6, actualScore: 4.8, actualValue: '3条异常', standard: '无异常' },
      { indicator: '验收合规性', fullScore: 4, actualScore: 3.0, actualValue: '5条合规', standard: '抽检10条' },
      { indicator: '数字供应链平台应用', fullScore: 6, actualScore: 3.6, actualValue: '60分', standard: '按标准' },
    ]
  },
  { unit: '浙江公司', totalScore: 51.8, totalFullScore: 68, scoreRate: '76.2%', rank: 16,
    details: [
      { indicator: '履约额', fullScore: 7, actualScore: 5.8, actualValue: '72.4%', standard: '≥70%' },
      { indicator: '采购成本降低率', fullScore: 6, actualScore: 3.8, actualValue: '2.80%', standard: '≥3.2%' },
      { indicator: '物资设备采购效益率', fullScore: 6, actualScore: 4.5, actualValue: '9.7%', standard: '≥11%' },
      { indicator: '分包工程集中采购率', fullScore: 7, actualScore: 5.2, actualValue: '21.1%', standard: '≥25%' },
      { indicator: '物资设备集中采购率', fullScore: 6, actualScore: 5.0, actualValue: '87.3%', standard: '≥90%' },
      { indicator: '招标采购计划执行率', fullScore: 5, actualScore: 3.2, actualValue: '91.6%', standard: '≥95%' },
      { indicator: '厂家直采率', fullScore: 4, actualScore: 2.7, actualValue: '30.4%', standard: '≥33%' },
      { indicator: '在线评标率', fullScore: 4, actualScore: 2.7, actualValue: '96.0%', standard: '≥98%' },
      { indicator: '平均采购时长', fullScore: 3, actualScore: 1.5, actualValue: '33.5天', standard: '≤32天' },
      { indicator: '竣工项目资产周转率', fullScore: 4, actualScore: 3.0, actualValue: '65.6%', standard: '≥70%' },
      { indicator: '数据治理', fullScore: 6, actualScore: 4.8, actualValue: '3条异常', standard: '无异常' },
      { indicator: '验收合规性', fullScore: 4, actualScore: 2.9, actualValue: '5条合规', standard: '抽检10条' },
      { indicator: '数字供应链平台应用', fullScore: 6, actualScore: 3.5, actualValue: '58分', standard: '按标准' },
    ]
  },
  { unit: '华中公司', totalScore: 51.4, totalFullScore: 68, scoreRate: '75.6%', rank: 17,
    details: [
      { indicator: '履约额', fullScore: 7, actualScore: 5.8, actualValue: '72.3%', standard: '≥70%' },
      { indicator: '采购成本降低率', fullScore: 6, actualScore: 3.7, actualValue: '2.78%', standard: '≥3.2%' },
      { indicator: '物资设备采购效益率', fullScore: 6, actualScore: 4.5, actualValue: '9.6%', standard: '≥11%' },
      { indicator: '分包工程集中采购率', fullScore: 7, actualScore: 5.1, actualValue: '20.9%', standard: '≥25%' },
      { indicator: '物资设备集中采购率', fullScore: 6, actualScore: 5.0, actualValue: '87.2%', standard: '≥90%' },
      { indicator: '招标采购计划执行率', fullScore: 5, actualScore: 3.2, actualValue: '91.5%', standard: '≥95%' },
      { indicator: '厂家直采率', fullScore: 4, actualScore: 2.6, actualValue: '30.2%', standard: '≥33%' },
      { indicator: '在线评标率', fullScore: 4, actualScore: 2.6, actualValue: '95.8%', standard: '≥98%' },
      { indicator: '平均采购时长', fullScore: 3, actualScore: 1.4, actualValue: '33.6天', standard: '≤32天' },
      { indicator: '竣工项目资产周转率', fullScore: 4, actualScore: 3.1, actualValue: '65.8%', standard: '≥70%' },
      { indicator: '数据治理', fullScore: 6, actualScore: 4.7, actualValue: '4条异常', standard: '无异常' },
      { indicator: '验收合规性', fullScore: 4, actualScore: 2.9, actualValue: '5条合规', standard: '抽检10条' },
      { indicator: '数字供应链平台应用', fullScore: 6, actualScore: 3.5, actualValue: '58分', standard: '按标准' },
    ]
  },
  { unit: '北京公司', totalScore: 51.0, totalFullScore: 68, scoreRate: '75.0%', rank: 18,
    details: [
      { indicator: '履约额', fullScore: 7, actualScore: 5.7, actualValue: '72.0%', standard: '≥70%' },
      { indicator: '采购成本降低率', fullScore: 6, actualScore: 3.6, actualValue: '2.75%', standard: '≥3.2%' },
      { indicator: '物资设备采购效益率', fullScore: 6, actualScore: 4.4, actualValue: '9.5%', standard: '≥11%' },
      { indicator: '分包工程集中采购率', fullScore: 7, actualScore: 5.1, actualValue: '20.8%', standard: '≥25%' },
      { indicator: '物资设备集中采购率', fullScore: 6, actualScore: 4.9, actualValue: '87.0%', standard: '≥90%' },
      { indicator: '招标采购计划执行率', fullScore: 5, actualScore: 3.1, actualValue: '91.3%', standard: '≥95%' },
      { indicator: '厂家直采率', fullScore: 4, actualScore: 2.6, actualValue: '30.1%', standard: '≥33%' },
      { indicator: '在线评标率', fullScore: 4, actualScore: 2.6, actualValue: '95.7%', standard: '≥98%' },
      { indicator: '平均采购时长', fullScore: 3, actualScore: 1.5, actualValue: '33.5天', standard: '≤32天' },
      { indicator: '竣工项目资产周转率', fullScore: 4, actualScore: 3.0, actualValue: '65.6%', standard: '≥70%' },
      { indicator: '数据治理', fullScore: 6, actualScore: 4.7, actualValue: '4条异常', standard: '无异常' },
      { indicator: '验收合规性', fullScore: 4, actualScore: 2.9, actualValue: '5条合规', standard: '抽检10条' },
      { indicator: '数字供应链平台应用', fullScore: 6, actualScore: 3.4, actualValue: '57分', standard: '按标准' },
    ]
  },
];

// ============================================================
// 海外 / 投资 二级单位（2026年7月新标准业态划分）
// ============================================================
const OVERSEAS_UNITS = ['海外公司'];
const INVEST_UNITS = ['东孚公司', '城市运营公司'];

// ============================================================
// 2026年7月 三业态考核得分数据（新标准首个考核月）
// 动态满分（PRD 3.5）：主业66分 / 海外70分 / 投资60分
// 主业7月生效13项：无云筑网履约额、分包工程集中采购率、资源库优化
// ============================================================
function _hashUnit(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) { h = (h * 31 + name.charCodeAt(i)) % 9973; }
  return h;
}
function _jitter(name, salt) {
  return (((_hashUnit(name) * (salt * 13 + 7)) % 101) - 50) / 1000;
}
function _r(v, d) {
  const p = Math.pow(10, d);
  return Math.round(v * p) / p;
}

function buildJulyMainScores() {
  const profiles = [
    { unit: '一公司', e: 0.66 }, { unit: '二公司', e: 0.62 }, { unit: '三公司', e: 0.59 },
    { unit: '四公司', e: 0.56 }, { unit: '东北公司', e: 0.53 }, { unit: '总承包公司', e: 0.51 },
    { unit: '南方公司', e: 0.49 }, { unit: '西南公司', e: 0.46 }, { unit: '华南公司', e: 0.44 },
    { unit: '华北公司', e: 0.42 }, { unit: '发展建设公司', e: 0.40 }, { unit: '西北公司', e: 0.37 },
    { unit: '上海公司', e: 0.35 }, { unit: '浙江公司', e: 0.33 }, { unit: '华中公司', e: 0.31 },
    { unit: '北京公司', e: 0.29 }, { unit: '土木公司', e: 0.47 }, { unit: '轨道公司', e: 0.43 },
  ];
  // 事件驱动指标扣分明细（资源管理 / 合规管理，PRD 3.2 序号15/16）
  const events = {
    '三公司':   { resource: { score: 6.9, value: '云筑网投诉逾期未办结2笔，扣0.1分', reason: '云筑网物资设备供应类投诉逾期未办结2笔，每笔扣0.05分' } },
    '轨道公司': { resource: { score: 6.0, value: '违规使用禁用分供商1起，扣1分', reason: '违规使用上级禁用分供商（不合格分供商名单）1起，扣1分' } },
    '华北公司': { resource: { score: 6.9, value: '工信部正式批投诉1笔，扣0.1分', reason: '工信部正式批物资设备供应类投诉1笔，扣0.1分' } },
    '上海公司': { resource: { score: 5.0, value: '上访事件未及时处置1次，扣2分', reason: '发生到局上访事件未能及时处置造成不良影响，扣2分/次' } },
    '华中公司': { resource: { score: 6.5, value: '分供商评价完成率未达标，扣0.5分（7月考核）', reason: '分供商评价完成率未达100%，扣0.5分（每年1月、7月考核）' } },
    '北京公司': { resource: { score: 6.9, value: '工信部正式批投诉1笔，扣0.1分', reason: '工信部正式批物资设备供应类投诉1笔，扣0.1分' } },
    '四公司':   { compliance: { score: 4.6, value: '一标一检其他违规2条，扣0.4分', reason: '一标一检发现其他违规问题2条，每条扣0.2分' } },
    '东北公司': { compliance: { score: 4.5, value: '专项治理延期上报1次，扣0.5分', reason: '工程建设招投标领域问题延期上报1次，扣0.5分/次' } },
    '土木公司': { compliance: { score: 4.9, value: '审计巡视问题1条，扣0.1分', reason: '审计巡视发现分管领导任期内问题1条，扣0.1分' } },
    '西北公司': { compliance: { score: 4.5, value: '无计划进场1笔，扣0.5分（上不封顶）', reason: '无计划进场1笔，扣0.5分（上不封顶，扣至0分为止）' } },
  };
  const list = profiles.map((p, idx) => {
    const j = (k) => _jitter(p.unit, k);
    const details = [];
    const add = (indicator, fullScore, actualScore, actualValue, standard, deductReason) => {
      details.push({ indicator, fullScore, actualScore: _r(Math.min(fullScore, Math.max(0, actualScore)), 2), actualValue, standard, deductReason: deductReason || '' });
    };
    // 1 采购成本降低率：≥3.2%，每低0.1%扣1分
    const v1 = _r(3.15 + (p.e - 0.45) * 1.0 + j(1), 2);
    add('采购成本降低率', 6, 6 - (3.2 - v1) * 10, v1 + '%', '≥3.2%');
    // 2 物资设备采购效益率：≥11%，每低0.5%扣1分
    const v2 = _r(10.6 + (p.e - 0.45) * 3.4 + j(2), 2);
    add('物资设备采购效益率', 6, 6 - (11 - v2) * 2, v2 + '%', '≥11%');
    // 3 物资设备集中采购率：≥90%，每低2%扣1分（单位差异化阈值）
    let v3, s3, std3;
    if (p.unit === '轨道公司') { v3 = 55.6; s3 = 6; std3 = '≥54%（差异化：轨道公司）'; }
    else if (p.unit === '发展建设公司') { v3 = 79.4; s3 = 5.7; std3 = '≥80%（差异化：发展建设）'; }
    else { v3 = _r(89 + (p.e - 0.45) * 5.6 + j(3), 2); s3 = 6 - (90 - v3) / 2; std3 = '≥90%'; }
    add('物资设备集中采购率', 6, s3, v3 + '%', std3);
    // 4 采购计划执行率：≥95%，每低1%扣1分
    const v4 = _r(94.5 + (p.e - 0.45) * 3.2 + j(4), 2);
    add('采购计划执行率', 5, 5 - (95 - v4), v4 + '%', '≥95%');
    // 5 厂家直采率：≥33%，每低1%扣1分
    const v5 = _r(32.5 + (p.e - 0.45) * 4 + j(5), 2);
    add('厂家直采率', 4, 4 - (33 - v5), v5 + '%', '≥33%');
    // 6 在线评标率：≥98%，每低1%扣2分
    const v6 = _r(97 + (p.e - 0.45) * 2.8 + j(6), 2);
    add('在线评标率', 4, 4 - (98 - v6) * 2, v6 + '%', '≥98%');
    // 7 平均采购时长：≤32天，每增加1天扣1分
    const v7 = _r(33 - (p.e - 0.45) * 2.2 + j(7), 2);
    add('平均采购时长', 3, 3 - (v7 - 32), v7 + '天', '≤32天');
    // 8 竣工项目资产周转率：≥70%，每低1%扣1分（延后2个月考核）
    const v8 = _r(69 + (p.e - 0.45) * 5 + j(8), 2);
    add('竣工项目资产周转率', 4, 4 - (70 - v8), v8 + '%', '≥70%（延后2月）');
    // 9 数字供应链平台应用：子表100分制 × 0.06 折算
    const v9 = _r(55 + p.e * 42 + j(9) * 300, 0);
    add('数字供应链平台应用', 6, v9 * 0.06, '子表' + v9 + '分', '子表100分制×0.06');
    // 10 数据治理：按异常结算单占比排名依次扣0.1分
    let s10, v10;
    if (idx < 12) { s10 = 6; v10 = '无异常'; }
    else { s10 = _r(6 - (idx - 11) * 0.1, 2); v10 = '异常结算单占比0.6%，全局排名第' + (idx + 1) + '位'; }
    add('数据治理', 6, s10, v10, '按排名依次扣0.1分');
    // 11 验收合规性：当月验收单据全量核查，不合规1条扣1分
    const n11 = idx >= 15 ? 2 : (idx >= 9 ? 1 : 0);
    const v11 = (620 + _hashUnit(p.unit) % 300) + '条全量核查，不合规' + n11 + '条';
    add('验收合规性', 4, 4 - n11, v11, '全量核查，不合规1条扣1分');
    // 12 资源管理（事件驱动，7分）
    const r12 = events[p.unit] && events[p.unit].resource;
    add('资源管理', 7, r12 ? r12.score : 7, r12 ? r12.value : '本月无事件', '投诉/上访/禁用分供商/评价（1月、7月）', r12 ? r12.reason : '');
    // 13 合规管理（事件驱动，检查证明，5分）
    const c13 = events[p.unit] && events[p.unit].compliance;
    add('合规管理', 5, c13 ? c13.score : 5, c13 ? c13.value : '本月无问题', '一标一检/审计巡视/无计划进场/专项治理', c13 ? c13.reason : '');
    const totalScore = _r(details.reduce((s, d) => s + d.actualScore, 0), 2);
    return { unit: p.unit, totalScore, totalFullScore: 66, scoreRate: (totalScore / 66 * 100).toFixed(1) + '%', details };
  });
  list.sort((a, b) => b.totalScore - a.totalScore);
  list.forEach((u, i) => { u.rank = i + 1; });
  return list;
}

const UNIT_SCORES_202607_MAIN = buildJulyMainScores();

// 海外（7月动态满分70分：无按季采购成本降低率、无按年资源白名单）
const UNIT_SCORES_202607_OVERSEAS = [
  { unit: '海外公司', rank: 1, totalScore: 64.4, totalFullScore: 70, scoreRate: '92.0%',
    details: [
      { indicator: '物资设备集中采购率', fullScore: 20, actualScore: 18.6, actualValue: '38.6%', standard: '≥40%', deductReason: '平均物资设备集中采购率38.6%，低于40%目标值1.4%，扣1.4分' },
      { indicator: '平均采购时长', fullScore: 10, actualScore: 7.8, actualValue: '34.2天', standard: '≤32天', deductReason: '平均采购时长34.2天，超出标准2.2天，扣2.2分' },
      { indicator: '海外供应链建设', fullScore: 10, actualScore: 9, actualValue: '例会问题1项未及时解决', standard: '未及时解决每项扣1分', deductReason: '7月海外采购物资例会提出2项问题，1项未在时限内闭环解决，扣1分' },
      { indicator: '月度重点工作挂图计划', fullScore: 10, actualScore: 9, actualValue: '计划5项，完成4项', standard: '每月≥5项，每少1项扣1分', deductReason: 'Q3挂图计划报送5项，7月完成4项，扣1分' },
      { indicator: '资源管理', fullScore: 10, actualScore: 10, actualValue: '本月无事件', standard: '同主业资源管理（1）-（5）', deductReason: '' },
      { indicator: '采购合规', fullScore: 10, actualScore: 10, actualValue: '本月无问题', standard: '同主业合规管理（1）-（4）', deductReason: '' },
    ] },
];

// 投资（7月动态满分60分：无按季采购成本降低率、无按季度挂图计划、无按年资源白名单）
const UNIT_SCORES_202607_INVEST = [
  { unit: '东孚公司', rank: 1, totalScore: 56.85, totalFullScore: 60, scoreRate: '94.8%',
    details: [
      { indicator: '招标采购计划执行率', fullScore: 10, actualScore: 9.6, actualValue: '94.6%', standard: '≥95%', deductReason: '当月采购计划执行率94.6%，低于95%目标值0.4%，扣0.4分' },
      { indicator: '在线评标率', fullScore: 10, actualScore: 10, actualValue: '98.1%', standard: '≥98%', deductReason: '' },
      { indicator: '公开采购率', fullScore: 10, actualScore: 9.2, actualValue: '79.2%', standard: '≥80%', deductReason: '公开采购率79.2%，低于80%目标值0.8%，扣0.8分' },
      { indicator: '平均采购时长', fullScore: 10, actualScore: 8.5, actualValue: '33.5天', standard: '≤32天', deductReason: '平均采购时长33.5天，超出标准1.5天，扣1.5分' },
      { indicator: '资源管理', fullScore: 10, actualScore: 9.95, actualValue: '云筑网投诉逾期未办结1笔', standard: '同主业资源管理（1）-（5），恶意投诉除外', deductReason: '云筑网物资设备供应类投诉逾期未办结1笔，扣0.05分' },
      { indicator: '采购合规', fullScore: 10, actualScore: 9.6, actualValue: '一标一检其他违规2条', standard: '同主业合规管理（1）-（4）', deductReason: '一标一检发现其他违规问题2条，每条扣0.2分' },
    ] },
  { unit: '城市运营公司', rank: 2, totalScore: 56.4, totalFullScore: 60, scoreRate: '94.0%',
    details: [
      { indicator: '招标采购计划执行率', fullScore: 10, actualScore: 8.1, actualValue: '93.1%', standard: '≥95%', deductReason: '当月采购计划执行率93.1%，低于95%目标值1.9%，扣1.9分' },
      { indicator: '在线评标率', fullScore: 10, actualScore: 8.4, actualValue: '97.2%', standard: '≥98%', deductReason: '在线评标率97.2%，低于98%目标值0.8%，每低1%扣2分，扣1.6分' },
      { indicator: '公开采购率', fullScore: 10, actualScore: 10, actualValue: '81.5%', standard: '≥80%', deductReason: '' },
      { indicator: '平均采购时长', fullScore: 10, actualScore: 10, actualValue: '31.2天', standard: '≤32天', deductReason: '' },
      { indicator: '资源管理', fullScore: 10, actualScore: 9.9, actualValue: '工信部正式批投诉1笔', standard: '同主业资源管理（1）-（5），恶意投诉除外', deductReason: '工信部正式批物资设备供应类投诉1笔，扣0.1分' },
      { indicator: '采购合规', fullScore: 10, actualScore: 10, actualValue: '本月无问题', standard: '同主业合规管理（1）-（4）', deductReason: '' },
    ] },
];

// 月度得分数据集：月份 → 业态 → 单位明细
const SCORE_DATASETS = {
  '202606': { '主业': UNIT_SCORES_202606 },
  '202607': { '主业': UNIT_SCORES_202607_MAIN, '海外': UNIT_SCORES_202607_OVERSEAS, '投资': UNIT_SCORES_202607_INVEST },
};

// 各月份各业态当月满分基准（动态满分，PRD 3.5）
const BIZ_MONTH_FULL = {
  '202606': { '主业': 68 },
  '202607': { '主业': 66, '海外': 70, '投资': 60 },
};

// ============================================================
// 数据采集任务列表 - 主业考核指标（2026年7月修订版新标准，16项）
// 取数通道：DSC / DSC+数字商务 / 检查（含人工抽查判定）/ 报送 / 平台子表
// ============================================================
const DATA_COLLECTION_TASKS = [
  { id: 1, type: 'core', indicator: '云筑网履约额', source: 'DSC+数字商务（商务确权产值来源于数字商务系统）', method: 'API自动抓取', schedule: '仅6月、12月 26日 02:00', status: 'success', lastRun: '2026-06-26 02:00:32', records: 2450, exception: 5, note: '商务确权产值自动抓取，不再经手动补录；JMRH等项目产值扣除需生产副总签字确认' },
  { id: 2, type: 'core', indicator: '采购成本降低率', source: 'DSC+数字商务', method: 'API自动抓取', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-06-26 02:01:15', records: 18456, exception: 23 },
  { id: 3, type: 'core', indicator: '物资设备采购效益率', source: 'DSC', method: 'API自动抓取', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-06-26 02:02:08', records: 18210, exception: 18 },
  { id: 4, type: 'core', indicator: '分包工程集中采购率', source: 'DSC', method: 'API自动抓取', schedule: '仅3、6、9、12月 26日 02:00', status: 'success', lastRun: '2026-06-26 02:02:45', records: 8930, exception: 0, note: '单位差异化阈值：主业25%/土木轨道10%/文旅5%/北京22%' },
  { id: 5, type: 'core', indicator: '物资设备集中采购率', source: 'DSC', method: 'API自动抓取', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-06-26 02:03:22', records: 15620, exception: 0, note: '单位差异化阈值：装饰65%/新型建造44%/轨道54%/发展建设80%' },
  { id: 6, type: 'core', indicator: '采购计划执行率', source: 'DSC', method: 'API自动抓取', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-06-26 02:04:10', records: 3420, exception: 0 },
  { id: 7, type: 'core', indicator: '厂家直采率', source: 'DSC', method: 'API自动抓取', schedule: '每月26日 02:00', status: 'warning', lastRun: '2026-06-26 02:05:01', records: 12680, exception: 45 },
  { id: 8, type: 'core', indicator: '在线评标率', source: 'DSC', method: 'API自动抓取', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-06-26 02:05:48', records: 2890, exception: 0 },
  { id: 9, type: 'core', indicator: '平均采购时长', source: 'DSC', method: 'API自动抓取', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-06-26 02:06:30', records: 24560, exception: 0 },
  { id: 10, type: 'core', indicator: '资源库优化', source: 'DSC（休眠分供商名单）', method: 'API自动抓取', schedule: '仅3、6、9、12月 26日 02:00', status: 'success', lastRun: '2026-06-26 02:06:55', records: 1560, exception: 0, note: '休眠（两年无合作）分供商清除率' },
  { id: 11, type: 'core', indicator: '竣工项目资产周转率', source: 'DSC', method: 'API自动抓取', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-06-26 02:07:10', records: 1280, exception: 0, note: '延后2个月考核' },
  { id: 12, type: 'core', indicator: '数据治理', source: 'DSC', method: 'API自动抓取', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-06-26 02:07:35', records: 18456, exception: 12, note: '两类异常结算单按排名梯度扣0.1分；承接原子表移出的两项异常数据考核' },
  { id: 13, type: 'core', indicator: '验收合规性', source: 'DSC验收单', method: 'API抓取+检查录入（人工抽查判定）', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-06-26 02:07:50', records: 9860, exception: 8, note: '当月验收单据全量核查；数据来自平台，平台不直接判定，需考核人主动抽查详情信息判断' },
  { id: 14, type: 'core', indicator: '资源管理', source: '投诉/上访事件、禁用分供商名单', method: '事件归集+检查录入（抽查判定）', schedule: '每月26日 02:00', status: 'pending', lastRun: '-', records: 0, exception: 0, note: '工信部批投诉/云筑网投诉/上访/禁用分供商/分供商评价（1月、7月）；人工抽查判定类扣分经检查录入通道登记后计分' },
  { id: 15, type: 'core', indicator: '合规管理', source: '检查（一标一检/审计巡视/专项治理）', method: '检查录入（审批流）', schedule: '每月15日前上报', status: 'pending', lastRun: '-', records: 0, exception: 0, note: '扣分须关联检查证明资料，导入走审批流；验收合规性、资源管理等抽查判定类扣分同样经检查录入通道登记' },
  { id: 16, type: 'core', indicator: '数字供应链平台应用', source: '平台考核子表（13项）', method: 'API自动抓取 + 手动填报', schedule: '每月27日 09:00导出', status: 'success', lastRun: '2026-06-27 09:00:00', records: 13, exception: 0, note: '子表100分制×0.06折算6分；嵌套平台应用考核子表项', nested: true },
];

// ============================================================
// 平台应用考核子表项采集任务（2026年7月修订版，13项）
// 较6月前版本移出"采购成本降低率异常数据""物资设备采购效益异常数据"两项
// ============================================================
const PLATFORM_COLLECTION_TASKS = [
  { id: 1, indicator: '年度集采计划上线率', source: 'DSC', method: 'API自动抓取', schedule: '每月27日 09:00', status: 'success', lastRun: '2026-06-27 09:01:00', records: 120, exception: 1 },
  { id: 2, indicator: '物料名称准确率', source: 'DSC项目采购计划', method: 'API自动抓取', schedule: '每月27日 09:00', status: 'success', lastRun: '2026-06-27 09:02:00', records: 3200, exception: 6 },
  { id: 3, indicator: '数据全面真实有效（采购数据真实性）', source: '人工核查', method: '核查录入', schedule: '每月27日 09:00', status: 'pending', lastRun: '-', records: 0, exception: 0, note: '2、3月预考核，4月起正式考核' },
  { id: 4, indicator: '物料分类管理合规率', source: 'MDM主数据平台', method: 'API自动抓取', schedule: '每月27日 09:00', status: 'success', lastRun: '2026-06-27 09:03:00', records: 450, exception: 2 },
  { id: 5, indicator: '结算办理率（产值录入）', source: 'DSC+数字商务', method: 'API自动抓取', schedule: '每月27日 09:00', status: 'success', lastRun: '2026-06-27 09:04:00', records: 1560, exception: 0 },
  { id: 6, indicator: '结算确价应用率', source: 'DSC结算管理', method: 'API自动抓取', schedule: '每月27日 09:00', status: 'success', lastRun: '2026-06-27 09:05:00', records: 1380, exception: 0 },
  { id: 7, indicator: '结算调差金额规范性', source: 'DSC结算管理', method: 'API自动抓取', schedule: '每月27日 09:00', status: 'success', lastRun: '2026-06-27 09:06:00', records: 86, exception: 1 },
  { id: 8, indicator: '物资需用计划链通项目上线率', source: 'DSC+数字建造', method: 'API自动抓取', schedule: '每月27日 09:00', status: 'success', lastRun: '2026-06-27 09:07:00', records: 890, exception: 0 },
  { id: 9, indicator: '验收合规性（满足手册标准要求）', source: 'DSC验收管理', method: 'API自动抓取', schedule: '每月27日 09:00', status: 'success', lastRun: '2026-06-27 09:08:00', records: 9860, exception: 8 },
  { id: 10, indicator: '项目月度盘点应用执行率', source: 'DSC盘点管理', method: 'API自动抓取', schedule: '每月27日 09:00', status: 'success', lastRun: '2026-06-27 09:09:00', records: 640, exception: 0 },
  { id: 11, indicator: '依约支付率异常数据', source: 'DSC', method: 'API自动抓取', schedule: '每月27日 09:00', status: 'success', lastRun: '2026-06-27 09:10:00', records: 210, exception: 2 },
  { id: 12, indicator: '钢筋异常价格数据', source: 'DSC', method: 'API自动抓取', schedule: '每月27日 09:00', status: 'success', lastRun: '2026-06-27 09:11:00', records: 150, exception: 3 },
  { id: 13, indicator: '数据全面真实有效（物资数据真实性）', source: '人工核查', method: '核查录入', schedule: '每月27日 09:00', status: 'pending', lastRun: '-', records: 0, exception: 0, note: '2、3月预考核，4月起正式考核' },
];

// ============================================================
// 异常数据拦截记录
// ============================================================
const EXCEPTION_RECORDS = [
  { id: 1, unit: '四公司', indicator: '采购成本降低率', type: '分母为0', project: '南京仙林项目', value: '-', desc: '标准成本数据缺失', time: '2026-06-26 02:00', status: 'pending', handler: '-' },
  { id: 2, unit: '轨道公司', indicator: '平均采购时长', type: '极端异常值', project: '徐州地铁3号线', value: '187天', desc: '单笔采购时长超出合理范围', time: '2026-06-26 02:06', status: 'pending', handler: '-' },
  { id: 3, unit: '一公司', indicator: '厂家直采率', type: '数据为负', project: '合肥产业园项目', value: '-5.2%', desc: '采购金额数据倒挂', time: '2026-06-26 02:05', status: 'processing', handler: '张考核' },
  { id: 4, unit: '三公司', indicator: '物资设备集中采购率', type: '分母为0', project: '宿州南邮项目', value: '-', desc: '无采购记录但标记为主业单位', time: '2026-06-26 02:03', status: 'resolved', handler: '李专员' },
  { id: 5, unit: '土木公司', indicator: '物资设备采购效益率', type: '超出合理范围', project: '杭州湾大桥项目', value: '68.5%', desc: '效益率异常偏高（>50%上限）', time: '2026-06-26 02:01', status: 'pending', handler: '-' },
];

// ============================================================
// 月度跑批日志
// ============================================================
const BATCH_RUN_LOGS = [
  { id: 1, batchNo: 'SC202607-001', month: '2026年7月', runTime: '2026-07-26 03:00:00', finishTime: '2026-07-26 03:15:28', units: 21, indicators: 25, status: 'success', scoreGenerated: true },
  { id: 2, batchNo: 'SC202606-001', month: '2026年6月', runTime: '2026-06-26 03:00:00', finishTime: '2026-06-26 03:12:35', units: 18, indicators: 13, status: 'success', scoreGenerated: true },
  { id: 3, batchNo: 'SC202605-001', month: '2026年5月', runTime: '2026-05-26 03:00:00', finishTime: '2026-05-26 03:10:18', units: 18, indicators: 11, status: 'success', scoreGenerated: true },
  { id: 4, batchNo: 'SC202604-001', month: '2026年4月', runTime: '2026-04-26 03:00:00', finishTime: '2026-04-26 03:11:42', units: 18, indicators: 11, status: 'success', scoreGenerated: true },
  { id: 5, batchNo: 'SC202603-001', month: '2026年3月', runTime: '2026-03-26 03:00:00', finishTime: '2026-03-26 03:09:55', units: 18, indicators: 12, status: 'success', scoreGenerated: true },
];

// ============================================================
// 申诉审批记录
// ============================================================
const APPEAL_RECORDS = [
  { id: 'AP202606001', unit: '四公司', indicator: '在线评标率', originalScore: 3.5, originalDeduction: 0.5, reason: '系统卡顿导致2个标段未能及时在线评标，已附截图证明', status: '部门领导复核中', submitTime: '2026-06-28 14:30', attachments: 2, timeline: [
    { step: '提交申诉', time: '2026-06-28 14:30', operator: '四公司-王经理', status: 'done' },
    { step: '考核专员初审', time: '2026-06-29 09:15', operator: '张考核', status: 'done' },
    { step: '部门领导复核', time: '进行中', operator: '李部长', status: 'active' },
    { step: '领导裁定', time: '待处理', operator: '李浩宇', status: 'pending' },
  ]},
  { id: 'AP202606002', unit: '轨道公司', indicator: '平均采购时长', originalScore: 1.5, originalDeduction: 1.5, reason: '徐州地铁3号线因业主设计变更导致采购暂停35天，非我方责任', status: '考核专员初审中', submitTime: '2026-06-27 16:20', attachments: 3, timeline: [
    { step: '提交申诉', time: '2026-06-27 16:20', operator: '轨道公司-陈经理', status: 'done' },
    { step: '考核专员初审', time: '进行中', operator: '张考核', status: 'active' },
    { step: '部门领导复核', time: '待处理', operator: '李部长', status: 'pending' },
    { step: '领导裁定', time: '待处理', operator: '李浩宇', status: 'pending' },
  ]},
  { id: 'AP202606003', unit: '三公司', indicator: '数据治理', originalScore: 5, originalDeduction: 1, reason: '异常数据系因供应商侧系统数据推送延迟导致，已在24小时内修复', status: '已裁定（同意不扣分）', submitTime: '2026-06-28 08:45', attachments: 1, timeline: [
    { step: '提交申诉', time: '2026-06-28 08:45', operator: '三公司-刘经理', status: 'done' },
    { step: '考核专员初审', time: '2026-06-28 14:00', operator: '张考核', status: 'done' },
    { step: '部门领导复核', time: '2026-06-29 10:30', operator: '李部长', status: 'done' },
    { step: '领导裁定', time: '2026-06-29 15:00', operator: '李浩宇', status: 'done', result: '同意不扣分，恢复0.5分' },
  ]},
  { id: 'AP202606004', unit: '东北公司', indicator: '招标采购计划执行率', originalScore: 4.0, originalDeduction: 1.0, reason: '因云筑网平台升级导致4笔采购计划未能按时提交，附系统公告截图', status: '考核专员初审中', submitTime: '2026-06-28 10:20', attachments: 2, timeline: [
    { step: '提交申诉', time: '2026-06-28 10:20', operator: '东北公司-孙经理', status: 'done' },
    { step: '考核专员初审', time: '进行中', operator: '张考核', status: 'active' },
    { step: '部门领导复核', time: '待处理', operator: '李部长', status: 'pending' },
    { step: '领导裁定', time: '待处理', operator: '李浩宇', status: 'pending' },
  ]},
  { id: 'AP202606005', unit: '总承包公司', indicator: '厂家直采率', originalScore: 3.1, originalDeduction: 0.9, reason: '新供应商目录尚未在系统中审核通过，导致直采金额未纳入统计', status: '已裁定（不同意）', submitTime: '2026-06-28 09:10', attachments: 1, timeline: [
    { step: '提交申诉', time: '2026-06-28 09:10', operator: '总承包公司-周经理', status: 'done' },
    { step: '考核专员初审', time: '2026-06-28 16:30', operator: '张考核', status: 'done' },
    { step: '部门领导复核', time: '2026-06-29 11:15', operator: '李部长', status: 'done' },
    { step: '领导裁定', time: '2026-06-30 09:40', operator: '李浩宇', status: 'done', result: '证据不足，维持原扣分' },
  ]},
];

// ============================================================
// 纠正调整记录（分数覆盖与重算）
// ============================================================
const SPECIAL_ADJUSTMENTS = [
  { id: 'ADJ-001', appealId: 'AP202606003', unit: '三公司', indicator: '数据治理', originalScore: 5.0, adjustedScore: 5.5, delta: '+0.5', operator: '李浩宇', time: '2026-06-29 15:05', status: '已完成' },
  { id: 'ADJ-002', appealId: 'AP202606005', unit: '总承包公司', indicator: '厂家直采率', originalScore: 3.1, adjustedScore: 3.1, delta: '0', operator: '李浩宇', time: '2026-06-30 09:42', status: '无需纠正' },
  { id: 'ADJ-003', appealId: 'AP202606001', unit: '四公司', indicator: '在线评标率', originalScore: 3.5, adjustedScore: 4.0, delta: '+0.5', operator: '李浩宇', time: '2026-06-30 10:15', status: '待执行' },
  { id: 'ADJ-004', appealId: 'AP202606004', unit: '东北公司', indicator: '招标采购计划执行率', originalScore: 4.0, adjustedScore: 4.5, delta: '+0.5', operator: '李浩宇', time: '2026-06-30 14:00', status: '待执行' },
  { id: 'ADJ-005', appealId: 'AP202605002', unit: '发展建设公司', indicator: '物资设备集中采购率', originalScore: 5.0, adjustedScore: 5.5, delta: '+0.5', operator: '李浩宇', time: '2026-05-28 16:20', status: '已完成' },
  { id: 'ADJ-006', appealId: 'AP202605008', unit: '华中公司', indicator: '平均采购时长', originalScore: 2.0, adjustedScore: 2.5, delta: '+0.5', operator: '李浩宇', time: '2026-05-29 11:30', status: '已完成' },
  { id: 'ADJ-007', appealId: 'AP202604013', unit: '西南公司', indicator: '数据治理', originalScore: 5.0, adjustedScore: 5.0, delta: '0', operator: '李浩宇', time: '2026-04-28 15:45', status: '无需纠正' },
  { id: 'ADJ-008', appealId: 'AP202604005', unit: '上海公司', indicator: '验收合规性', originalScore: 3.0, adjustedScore: 3.5, delta: '+0.5', operator: '李浩宇', time: '2026-04-29 09:20', status: '已完成' },
  { id: 'ADJ-009', appealId: 'AP202603011', unit: '北京公司', indicator: '数字供应链平台应用', originalScore: 4.0, adjustedScore: 4.5, delta: '+0.5', operator: '李浩宇', time: '2026-03-28 10:40', status: '已完成' },
  { id: 'ADJ-010', appealId: 'AP202603007', unit: '南方公司', indicator: '厂家直采率', originalScore: 3.0, adjustedScore: 3.0, delta: '0', operator: '李浩宇', time: '2026-03-29 16:10', status: '无需纠正' },
];

// ============================================================
// 业态管理数据
// ============================================================
const BUSINESS_TYPES = [
  { id: 1, name: '主业', code: 'MAIN', status: 'active', units: 18, desc: '主要建筑施工业务' },
  { id: 2, name: '海外', code: 'OVERSEAS', status: 'active', units: 1, desc: '海外工程业务' },
  { id: 3, name: '投资', code: 'INVEST', status: 'active', units: 2, desc: '投资平台业务' },
  { id: 4, name: '创新业务', code: 'INNOVATION', status: 'inactive', units: 0, desc: '新型业务板块（待启用）' },
];

// ============================================================
// 海外考核指标采集任务（2026年7月修订版新标准，8项）
// ============================================================
const OVERSEAS_COLLECTION_TASKS = [
  { id: 1, indicator: '采购成本降低率', source: '单位报送', method: '报送核验', schedule: '季度末月（3/6/9/12月）报送截止', status: 'pending', lastRun: '-', records: 0, exception: 0, note: '按季考核，与采购金额对比；海外报表功能上线后可转平台提取' },
  { id: 2, indicator: '物资设备集中采购率', source: '单位报送', method: '报送核验', schedule: '每月25日 报送截止', status: 'success', lastRun: '2026-07-24 16:20', records: 12, exception: 0, note: '目标值≥40%；海外报表功能上线后可转平台提取' },
  { id: 3, indicator: '平均采购时长', source: '单位报送', method: '报送核验', schedule: '每月25日 报送截止', status: 'success', lastRun: '2026-07-24 16:25', records: 10, exception: 0, note: '海外报表功能上线后可转平台提取' },
  { id: 4, indicator: '海外供应链建设', source: '检查（例会记录/工作计划）', method: '检查录入', schedule: '每月25日 18:00 前登记', status: 'success', lastRun: '2026-07-24 16:40', records: 12, exception: 0, note: '参与马来西亚、印度尼西亚采购共享中心工作计划；海外数据以检查为准' },
  { id: 5, indicator: '月度重点工作挂图计划', source: '单位报送', method: '报送核验', schedule: '每季第一周报计划 / 每月25日报进度', status: 'success', lastRun: '2026-07-24 17:02', records: 5, exception: 0, note: '每月≥5项，每少1项扣1分扣完为止；不报送晚报送不得分' },
  { id: 6, indicator: '资源管理', source: '单位报送（投诉/上访事件等）', method: '报送核验', schedule: '每月25日 报送截止', status: 'success', lastRun: '2026-07-24 17:10', records: 8, exception: 0, note: '同主业资源管理（1）-（5）条款；海外数据以报送为准，海外报表功能上线后可转平台提取' },
  { id: 7, indicator: '采购合规', source: '检查（带审批流导入）', method: '检查录入（审批流）', schedule: '事件驱动', status: 'success', lastRun: '2026-07-26 02:03:40', records: 3, exception: 0, note: '同主业合规管理（1）-（4）条款；海外数据以报送/检查为准，海外报表功能上线后可转平台提取' },
  { id: 8, indicator: '资源白名单', source: '单位报送', method: '报送核验', schedule: '按年（12月年末考核）', status: 'pending', lastRun: '-', records: 0, exception: 0, note: '年度发布≥20项，每少1项扣1.5分；年末一次性计分' },
];

// ============================================================
// 投资考核指标采集任务（2026年7月修订版新标准，9项）
// ============================================================
const INVEST_COLLECTION_TASKS = [
  { id: 1, indicator: '采购成本降低率', source: '单位报送（核验后计分）', method: '报送核验', schedule: '季度末月（3/6/9/12月）报送', status: 'pending', lastRun: '-', records: 0, exception: 0, note: '按季考核，与目标成本对比' },
  { id: 2, indicator: '招标采购计划执行率', source: 'DSC', method: 'API自动抓取+报送核验', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-07-26 02:01:15', records: 420, exception: 0, note: '城市运营报送' },
  { id: 3, indicator: '在线评标率', source: '云筑网', method: 'API自动抓取', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-07-26 02:02:00', records: 310, exception: 0, note: '选用云筑网的部分' },
  { id: 4, indicator: '公开采购率', source: '云筑网', method: 'API自动抓取', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-07-26 02:02:35', records: 280, exception: 0, note: '云筑网入湖，DSC获取' },
  { id: 5, indicator: '平均采购时长', source: '云筑网', method: 'API自动抓取', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-07-26 02:03:10', records: 360, exception: 1, note: '①城市运营报送（DSC）；②东孚：取采购文件发布至招标结束；③考核口径：自发布采购公告起至完成成交' },
  { id: 6, indicator: '月度重点工作挂图计划', source: '单位报送+查验评分', method: '报送核验+查验录入', schedule: '每季第一周报计划 / 每月25日报进度', status: 'success', lastRun: '2026-07-24 17:10', records: 6, exception: 0, note: '每月≥3项；局供应链管理部查验评分，季度末计分' },
  { id: 7, indicator: '资源管理', source: '检查（投诉/上访事件、禁用分供商名单）', method: '检查录入（抽查判定）', schedule: '事件驱动', status: 'success', lastRun: '2026-07-26 02:03:45', records: 42, exception: 0, note: '恶意投诉除外；人工抽查判定类扣分经检查录入通道登记后计分' },
  { id: 8, indicator: '采购合规', source: '检查（带审批流导入）', method: '检查录入（审批流）', schedule: '事件驱动', status: 'success', lastRun: '2026-07-26 02:04:05', records: 2, exception: 0 },
  { id: 9, indicator: '资源白名单', source: '单位报送', method: '报送核验', schedule: '按年（12月年末考核）', status: 'pending', lastRun: '-', records: 0, exception: 0, note: '年度发布≥6项，每少1项扣1.5分；年末一次性计分' },
];

// ============================================================
// 报送管理任务（截止日提醒与逾期标记）
// 报送节点：挂图计划每季第一周 / 进度每月25日 / 专项治理每月15日
// ============================================================
const REPORTING_TASKS = [
  { id: 1, item: '2026Q3挂图计划报送', unit: '海外公司', biz: '海外', deadline: '2026-07-03（每季第一周）', submitTime: '2026-07-02 10:15', status: 'ontime', content: 'Q3挂图重点、亮点与创新工作计划 5项' },
  { id: 2, item: '2026Q3挂图计划报送', unit: '东孚公司', biz: '投资', deadline: '2026-07-03（每季第一周）', submitTime: '2026-07-01 09:30', status: 'ontime', content: 'Q3挂图计划 3项' },
  { id: 3, item: '2026Q3挂图计划报送', unit: '城市运营公司', biz: '投资', deadline: '2026-07-03（每季第一周）', submitTime: '2026-07-05 14:20', status: 'overdue', content: 'Q3挂图计划 3项', note: '晚报送，当月该项不得分' },
  { id: 4, item: '7月挂图进度报送', unit: '海外公司', biz: '海外', deadline: '2026-07-25（每月25日）', submitTime: '2026-07-24 16:40', status: 'ontime', content: '7月完成4/5项' },
  { id: 5, item: '7月挂图进度报送', unit: '东孚公司', biz: '投资', deadline: '2026-07-25（每月25日）', submitTime: '-', status: 'overdue', content: '未报送', note: '不报送晚报送不得分' },
  { id: 6, item: '7月专项治理问题上报', unit: '主业各单位', biz: '主业', deadline: '2026-07-15（每月15日）', submitTime: '2026-07-14 17:30', status: 'ontime', content: '工程建设和招投标领域问题 0项' },
  { id: 7, item: '7月专项治理问题上报', unit: '东北公司', biz: '主业', deadline: '2026-07-15（每月15日）', submitTime: '2026-07-16 09:05', status: 'overdue', content: '延期1天上报', note: '延期上报扣0.5分/次' },
  { id: 8, item: '2026Q3采购成本降低率数据报送', unit: '东孚公司', biz: '投资', deadline: '2026-09-30（季度末月）', submitTime: '-', status: 'pending', content: '按季报送，核验后计分' },
  { id: 9, item: '2026Q3采购成本降低率数据报送', unit: '海外公司', biz: '海外', deadline: '2026-09-30（季度末月）', submitTime: '-', status: 'pending', content: '海外各项现阶段以报送为主，经局供应链管理部核验后计分' },
];

// ============================================================
// 查验评分记录（投资月度重点工作挂图计划 · 局供应链管理部）
// ============================================================
const INSPECTION_RECORDS = [
  { id: 'IN-001', unit: '东孚公司', biz: '投资', quarter: '2026Q3', method: '标杆示范项目培育', score: 18, full: 20, basis: 'XX产业园标杆示范项目培育进度符合计划，2项创新工作质量一般，酌情扣2分', inspector: '局供应链管理部-王科长', time: '2026-07-20 15:30', stage: '季度内跟踪（季度末计分）' },
  { id: 'IN-002', unit: '城市运营公司', biz: '投资', quarter: '2026Q3', method: '常态化督导检查', score: 16, full: 20, basis: '7月督导检查发现2项制度落实不到位：招标文件审查记录缺失1项、台账更新滞后1项', inspector: '局供应链管理部-王科长', time: '2026-07-22 10:10', stage: '季度内跟踪（季度末计分）' },
];

// ============================================================
// 单位差异化阈值配置（PRD 5.1，验收标准 A2）
// ============================================================
const UNIT_THRESHOLDS = [
  { indicator: '分包工程集中采购率', period: '仅3、6、9、12月考核', score: '7分', rows: [
    { unit: '其他主业单位', value: '25%', note: '默认目标值' },
    { unit: '土木公司', value: '10%', note: '差异化目标值' },
    { unit: '轨道公司', value: '10%', note: '差异化目标值' },
    { unit: '文旅公司', value: '5%', note: '差异化目标值' },
    { unit: '北京公司', value: '22%', note: '差异化目标值' },
  ]},
  { indicator: '物资设备集中采购率', period: '每月考核', score: '6分', rows: [
    { unit: '其他主业单位', value: '90%', note: '默认目标值' },
    { unit: '装饰公司', value: '65%', note: '差异化目标值' },
    { unit: '新型建造公司', value: '44%', note: '差异化目标值' },
    { unit: '轨道公司', value: '54%', note: '差异化目标值' },
    { unit: '发展建设公司', value: '80%', note: '差异化目标值' },
  ]},
];

// ============================================================
// 申诉记录补充：旧批次补注考核月份，新增2026年7月新标准批次
// ============================================================
APPEAL_RECORDS.forEach((a) => { a.month = '2026年6月'; });
APPEAL_RECORDS.push(
  { id: 'AP202607001', month: '2026年7月', unit: '轨道公司', indicator: '资源管理', originalScore: 6.0, originalDeduction: 1.0, reason: '所涉分供商于7月15日已从禁用名单移出，本次交易发生在其移出之后，不应计为违规使用', status: '考核专员初审中', submitTime: '2026-07-28 10:05', attachments: 2, timeline: [
    { step: '提交申诉', time: '2026-07-28 10:05', operator: '轨道公司-陈经理', status: 'done' },
    { step: '考核专员初审', time: '进行中', operator: '张考核', status: 'active' },
    { step: '部门领导复核', time: '待处理', operator: '李部长', status: 'pending' },
    { step: '领导裁定', time: '待处理', operator: '李浩宇', status: 'pending' },
  ]},
  { id: 'AP202607002', month: '2026年7月', unit: '上海公司', indicator: '资源管理（上访事件）', originalScore: 5.0, originalDeduction: 2.0, reason: '上访事件发生后24小时内已妥善处置并形成处置记录，未造成不良影响', status: '部门领导复核中', submitTime: '2026-07-28 15:40', attachments: 3, timeline: [
    { step: '提交申诉', time: '2026-07-28 15:40', operator: '上海公司-沈经理', status: 'done' },
    { step: '考核专员初审', time: '2026-07-29 09:30', operator: '张考核', status: 'done' },
    { step: '部门领导复核', time: '进行中', operator: '李部长', status: 'active' },
    { step: '领导裁定', time: '待处理', operator: '李浩宇', status: 'pending' },
  ]},
  { id: 'AP202607003', month: '2026年7月', unit: '华中公司', indicator: '资源管理（分供商评价）', originalScore: 6.5, originalDeduction: 0.5, reason: '7月分供商评价任务因系统升级延期至7月28日开放，已在8月1日前完成补评，附系统公告截图', status: '已裁定（同意不扣分）', submitTime: '2026-07-29 09:20', attachments: 2, timeline: [
    { step: '提交申诉', time: '2026-07-29 09:20', operator: '华中公司-罗经理', status: 'done' },
    { step: '考核专员初审', time: '2026-07-29 14:00', operator: '张考核', status: 'done' },
    { step: '部门领导复核', time: '2026-07-30 10:30', operator: '李部长', status: 'done' },
    { step: '领导裁定', time: '2026-07-31 15:00', operator: '李浩宇', status: 'done', result: '同意不扣分，恢复0.5分' },
  ]},
  { id: 'AP202607004', month: '2026年7月', unit: '西北公司', indicator: '合规管理（无计划进场）', originalScore: 4.5, originalDeduction: 0.5, reason: '该进场为抢险工程绿色通道，已按制度补办手续，附审批单及情况说明', status: '考核专员初审中', submitTime: '2026-07-29 14:10', attachments: 2, timeline: [
    { step: '提交申诉', time: '2026-07-29 14:10', operator: '西北公司-赵经理', status: 'done' },
    { step: '考核专员初审', time: '进行中', operator: '张考核', status: 'active' },
    { step: '部门领导复核', time: '待处理', operator: '李部长', status: 'pending' },
    { step: '领导裁定', time: '待处理', operator: '李浩宇', status: 'pending' },
  ]},
  { id: 'AP202607005', month: '2026年7月', unit: '东北公司', indicator: '合规管理（专项治理上报）', originalScore: 4.5, originalDeduction: 0.5, reason: '上报人员休产假工作交接遗漏导致延期1天，非主观故意', status: '已裁定（不同意）', submitTime: '2026-07-28 11:25', attachments: 1, timeline: [
    { step: '提交申诉', time: '2026-07-28 11:25', operator: '东北公司-孙经理', status: 'done' },
    { step: '考核专员初审', time: '2026-07-28 16:30', operator: '张考核', status: 'done' },
    { step: '部门领导复核', time: '2026-07-29 11:15', operator: '李部长', status: 'done' },
    { step: '领导裁定', time: '2026-07-31 09:40', operator: '李浩宇', status: 'done', result: '延期上报事实清楚，维持原扣分' },
  ]}
);

// 纠正调整记录补充（7月批次）
SPECIAL_ADJUSTMENTS.push(
  { id: 'ADJ-011', appealId: 'AP202607003', unit: '华中公司', indicator: '资源管理', originalScore: 6.5, adjustedScore: 7.0, delta: '+0.5', operator: '李浩宇', time: '2026-07-31 15:05', status: '已完成' },
  { id: 'ADJ-012', appealId: 'AP202607005', unit: '东北公司', indicator: '合规管理', originalScore: 4.5, adjustedScore: 4.5, delta: '0', operator: '李浩宇', time: '2026-07-31 09:42', status: '无需纠正' }
);

// ============================================================
// ============ 以下为 V3.0 双线穿透增量数据 ==================
// ============================================================

// ------------------------------------------------------------
// 1. 组织机构树（局—二级—三级）
// 依据《组织机构树_COM_ORG筛选展开》：1 个局总部 / 28 家二级单位 / 161 家三级单位
// 三级单位自动继承上级二级单位业态标签（主业/海外/投资）
// ------------------------------------------------------------
const ORG_L2_DEFS = [
  // —— 主业单位（18家） ——
  { code: '8B-1C',   name: '中建八局第一建设有限公司', short: '一公司',   biz: '主业', l3: ['济南','青岛','中原','华东','华南','华中','西北','西南','华北','东北','基础设施','安装','装饰'] },
  { code: '8B-2C',   name: '中建八局第二建设有限公司', short: '二公司',   biz: '主业', l3: ['山东','华中','广西','北京','上海','江苏','浙江','安徽','河南','河北','广东','深圳','四川','重庆','陕西','新疆','基础设施','安装'] },
  { code: '8B-3C',   name: '中建八局第三建设有限公司', short: '三公司',   biz: '主业', l3: ['南京','苏南','苏北','安徽','山东'] },
  { code: '8B-4C',   name: '中建八局第四建设有限公司', short: '四公司',   biz: '主业', l3: ['青岛','济南','烟台','潍坊','临沂'] },
  { code: '8B-DB',   name: '中建八局东北公司',         short: '东北公司', biz: '主业', l3: ['辽宁','吉林','黑龙江','大连','沈阳'] },
  { code: '8B-ZCB',  name: '中建八局总承包公司',       short: '总承包公司', biz: '主业', l3: ['上海','江苏','浙江','安徽','江西'] },
  { code: '8B-NF',   name: '中建八局南方公司',         short: '南方公司', biz: '主业', l3: ['广州','深圳','东莞','珠海','佛山'] },
  { code: '8B-XN',   name: '中建八局西南公司',         short: '西南公司', biz: '主业', l3: ['成都','重庆','昆明','贵阳','拉萨'] },
  { code: '8B-HN',   name: '中建八局华南公司',         short: '华南公司', biz: '主业', l3: ['南宁','海口','厦门','福州','泉州'] },
  { code: '8B-HB',   name: '中建八局华北公司',         short: '华北公司', biz: '主业', l3: ['北京','天津','石家庄','太原','呼和浩特'] },
  { code: '8B-FZJS', name: '中建八局发展建设有限公司', short: '发展建设公司', biz: '主业', l3: ['郑州','武汉','长沙','南昌','合肥'] },
  { code: '8B-XB',   name: '中建八局西北公司',         short: '西北公司', biz: '主业', l3: ['西安','兰州','银川','西宁','乌鲁木齐'] },
  { code: '8B-SH',   name: '中建八局上海公司',         short: '上海公司', biz: '主业', l3: ['浦东','浦西','临港','虹桥','嘉定'] },
  { code: '8B-ZJ',   name: '中建八局浙江公司',         short: '浙江公司', biz: '主业', l3: ['杭州','宁波','温州','绍兴','嘉兴'] },
  { code: '8B-HZ',   name: '中建八局华中公司',         short: '华中公司', biz: '主业', l3: ['武汉','长沙','郑州','南昌','宜昌'] },
  { code: '8B-BJ',   name: '中建八局北京公司',         short: '北京公司', biz: '主业', l3: ['海淀','朝阳','通州','大兴','昌平'] },
  { code: '8B-TM',   name: '中建八局土木公司',         short: '土木公司', biz: '主业', l3: ['华北','华东','华南','西南','基础设施'] },
  { code: '8B-GD',   name: '中建八局轨道交通公司',     short: '轨道公司', biz: '主业', l3: ['华东','华南','华北','西南','城轨'] },
  // —— 专业/创新单位（7家） ——
  { code: '8B-ZS',   name: '中建八局装饰公司',         short: '装饰公司', biz: '主业', l3: ['华东','华北','华南','西南','设计'] },
  { code: '8B-GJG',  name: '中建八局钢结构工程公司',   short: '钢结构工程公司', biz: '主业', l3: ['华东','华北','华南','制造','设计'] },
  { code: '8B-AZ',   name: '中建八局安装公司',         short: '安装公司', biz: '主业', l3: ['华东','华北','华南','西南','机电'] },
  { code: '8B-XXJZ', name: '中建八局新型建造工程公司', short: '新型建造工程公司', biz: '主业', l3: ['华东','华南','华北','西南','华中'] },
  { code: '8B-WL',   name: '中建八局文旅博览投资发展有限公司', short: '文旅博览投资发展公司', biz: '投资', l3: ['华东','华南','华北','西南','运营'] },
  { code: '8B-HJKJ', name: '中建八局环境科技公司',     short: '环境科技公司', biz: '主业', l3: ['华东','华北','华南','西南','华中'] },
  { code: '8B-GZCB', name: '中建八局工程总承包工程公司', short: '工程总承包工程公司', biz: '主业', l3: ['华东','华北','华南','西南','华中'] },
  // —— 海外单位（1家） ——
  { code: '8B-OVERSEAS', name: '中建八局海外公司',     short: '海外公司', biz: '海外', l3: ['马来西亚','印度尼西亚','埃及','阿尔及利亚'] },
  // —— 投资平台（2家） ——
  { code: '8B-DONGFU', name: '上海中建东孚投资发展有限公司', short: '东孚公司', biz: '投资', l3: ['上海','南京','杭州','苏州','合肥','物业'] },
  { code: '8B-CSYY', name: '中建八局城市运营公司',     short: '城市运营公司', biz: '投资', l3: ['上海','南京','杭州','成都','武汉'] },
];

// 新设不满月（当月跳过考核）标记：组织编码后缀
const ORG_NEWLY_CREATED = ['8B-3C-05', '8B-CSYY-05'];

function buildOrgTree() {
  const l2Nodes = ORG_L2_DEFS.map((d, i) => {
    const children = d.l3.map((suffix, j) => {
      const code = d.code + '-' + String(j + 1).padStart(2, '0');
      return {
        org_id: 'ORG-L3-' + String(i + 1).padStart(3, '0') + String(j + 1).padStart(2, '0'),
        org_code: code,
        org_name: d.name + suffix + '分公司',
        org_level: '三级单位',
        business_type: d.biz,
        parent_org_name: d.name,
        child_count: 0,
        project_count: 3 + ((i * 5 + j * 3) % 7),
        status: ORG_NEWLY_CREATED.includes(code) ? '新设不满月' : 'active',
      };
    });
    return {
      org_id: 'ORG-L2-' + String(i + 1).padStart(3, '0'),
      org_code: d.code,
      org_name: d.name,
      org_level: '二级单位',
      business_type: d.biz,
      parent_org_name: '中国建筑第八工程局有限公司',
      child_count: children.length,
      project_count: children.reduce((n, c) => n + c.project_count, 0),
      status: 'active',
      children,
    };
  });
  return {
    org_id: 'ORG-ROOT',
    org_code: 'CSCEC8B',
    org_name: '中国建筑第八工程局有限公司',
    org_level: '局',
    business_type: '综合',
    parent_org_name: '—',
    child_count: l2Nodes.length,
    project_count: l2Nodes.reduce((n, c) => n + c.project_count, 0),
    status: 'active',
    children: l2Nodes,
  };
}

const ORG_TREE = buildOrgTree();
const ORG_STATS = {
  l1: 1,
  l2: ORG_TREE.children.length,
  l3: ORG_TREE.children.reduce((n, u) => n + u.children.length, 0),
};

// ------------------------------------------------------------
// 2. 平台子表「取数方式」标注（V3.1 修订）
// 13 项中 7 项为「平台抽取+考核员编辑」（子表序号 1/3/5/7/9/11/13），其余 6 项为「平台全自动抽取」
// ------------------------------------------------------------
const EDITABLE_SUB_IDS = [1, 3, 5, 7, 9, 11, 13];
PLATFORM_RULES.forEach(r => {
  r.fetch_mode = EDITABLE_SUB_IDS.includes(r.id) ? '平台抽取+考核员编辑' : '平台全自动抽取';
});

// ------------------------------------------------------------
// 3. 平台抽取数据台账与二次编辑（V3.1 核心重塑）
// 废除“任务工单式干预窗口（派单 / 倒计时 / 熔断）”：考核员直接在普通平台抽取
// 台账上「二次编辑（行内 / 弹窗）」或「Excel 批量导入」覆盖系统自动值，
// 并保留「系统自动抽取值 vs 最终生效计算值」双值对比与修改留痕。
// ------------------------------------------------------------
const EXTRACT_ADJUST_RECORDS = [
  // —— 主业 ——
  { record_id: 'EX-202607-001', biz: '主业', target_org_name: '中建八局第一建设有限公司', short_org: '一公司', indicator_name: '结算调差金额规范性', dimension_name: '物资管理-结算管理', system_extracted_value: '-10.0分 (单笔调差异常)', final_effective_value: '0.0分 (核验合规，不扣分)', is_manual_modified: true, value_status: 'MANUAL_MODIFIED', modify_reason_desc: '项目部已补交特大桥梁调差联合会签凭据，经复核金额合规，人工修正扣分', modified_by_info: '张考核 (07-26 14:20)', support_voucher: 'TC-202607-0081' },
  { record_id: 'EX-202607-002', biz: '主业', target_org_name: '中建八局第二建设有限公司', short_org: '二公司', indicator_name: '结算办理率(产值录入)', dimension_name: '物资管理-结算管理', system_extracted_value: '91.2% (扣15.2分)', final_effective_value: '91.2% (扣15.2分)', is_manual_modified: false, value_status: 'AUTO_CALCULATED', modify_reason_desc: null, modified_by_info: null, support_voucher: null },
  { record_id: 'EX-202607-003', biz: '主业', target_org_name: '中建八局第三建设有限公司', short_org: '三公司', indicator_name: '物料名称准确率', dimension_name: '采购管理-项目采购计划', system_extracted_value: '扣 5.0 分 (1笔备注明细)', final_effective_value: '扣 2.0 分 (核减1笔)', is_manual_modified: true, value_status: 'MANUAL_MODIFIED', modify_reason_desc: '其中 1 笔已在备注栏补充三级分类名称，经核验符合填报要求，核减 3 分', modified_by_info: '张考核 (07-26 15:05)', support_voucher: 'MD-202607-0033' },
  { record_id: 'EX-202607-004', biz: '主业', target_org_name: '中建八局第四建设有限公司', short_org: '四公司', indicator_name: '采购成本降低率', dimension_name: '采购管理-采购成本分析', system_extracted_value: '2.95% (扣 2.5 分)', final_effective_value: '3.45% (扣 0 分)', is_manual_modified: true, value_status: 'MANUAL_MODIFIED', modify_reason_desc: '商务确权口径调整，按最新确权值重算降低率，达标不扣分', modified_by_info: '张考核 (07-26 15:30)', support_voucher: 'SW-202607-0117' },
  { record_id: 'EX-202607-005', biz: '主业', target_org_name: '中建八局轨道交通公司', short_org: '轨道公司', indicator_name: '平均采购时长', dimension_name: '采购管理-采购时长', system_extracted_value: '34.2天 (扣 2.2 分)', final_effective_value: '34.2天 (扣 2.2 分)', is_manual_modified: false, value_status: 'AUTO_CALCULATED', modify_reason_desc: null, modified_by_info: null, support_voucher: null },
  { record_id: 'EX-202607-006', biz: '主业', target_org_name: '中建八局土木公司', short_org: '土木公司', indicator_name: '物资设备采购效益率', dimension_name: '物资管理-效益分析', system_extracted_value: '10.6% (扣 0.8 分)', final_effective_value: '10.6% (扣 0.8 分)', is_manual_modified: false, value_status: 'AUTO_CALCULATED', modify_reason_desc: null, modified_by_info: null, support_voucher: null },
  // —— 海外 ——
  { record_id: 'EX-202607-007', biz: '海外', target_org_name: '中建八局海外公司', short_org: '海外公司', indicator_name: '物资设备集中采购率', dimension_name: '目标引领', system_extracted_value: '38.5% (扣 1.5 分)', final_effective_value: '38.5% (扣 1.5 分)', is_manual_modified: false, value_status: 'AUTO_CALCULATED', modify_reason_desc: null, modified_by_info: null, support_voucher: null },
  { record_id: 'EX-202607-008', biz: '海外', target_org_name: '中建八局海外公司', short_org: '海外公司', indicator_name: '采购成本降低率', dimension_name: '目标引领', system_extracted_value: '3.05% (扣 3.0 分)', final_effective_value: '3.15% (扣 1.0 分)', is_manual_modified: true, value_status: 'MANUAL_MODIFIED', modify_reason_desc: '汇率折算口径修正为合同签订日汇率，按调整后口径重算降低率', modified_by_info: '张考核 (07-26 16:10)', support_voucher: 'HW-202607-0007' },
  // —— 投资 ——
  { record_id: 'EX-202607-009', biz: '投资', target_org_name: '上海中建东孚投资发展有限公司', short_org: '东孚公司', indicator_name: '公开采购率', dimension_name: '目标引领', system_extracted_value: '78.5% (扣 1.5 分)', final_effective_value: '78.5% (扣 1.5 分)', is_manual_modified: false, value_status: 'AUTO_CALCULATED', modify_reason_desc: null, modified_by_info: null, support_voucher: null },
  { record_id: 'EX-202607-010', biz: '投资', target_org_name: '中建八局城市运营公司', short_org: '城市运营公司', indicator_name: '招标采购计划执行率', dimension_name: '目标引领', system_extracted_value: '93.8% (扣 1.2 分)', final_effective_value: '93.8% (扣 1.2 分)', is_manual_modified: false, value_status: 'AUTO_CALCULATED', modify_reason_desc: null, modified_by_info: null, support_voucher: null },
  // —— 平台应用子表 ——
  { record_id: 'EX-202607-011', biz: '平台子表', target_org_name: '中建八局第一建设有限公司', short_org: '一公司', indicator_name: '年度集采计划上线率', dimension_name: '采购管理-采购计划', system_extracted_value: '扣 5.0 分 (未上线)', final_effective_value: '0.0分 (已补充上线)', is_manual_modified: true, value_status: 'MANUAL_MODIFIED', modify_reason_desc: '年度集采计划已于 7月26日补充审批完成，经核验计划期间符合要求，撤销扣分', modified_by_info: '张考核 (07-26 16:40)', support_voucher: 'JS-202607-0021' },
  { record_id: 'EX-202607-012', biz: '平台子表', target_org_name: '中建八局第二建设有限公司', short_org: '二公司', indicator_name: '物料名称准确率', dimension_name: '采购管理-项目采购计划', system_extracted_value: '扣 10.0 分 (2笔)', final_effective_value: '扣 10.0 分 (2笔)', is_manual_modified: false, value_status: 'AUTO_CALCULATED', modify_reason_desc: null, modified_by_info: null, support_voucher: null },
  { record_id: 'EX-202607-013', biz: '平台子表', target_org_name: '中建八局第三建设有限公司', short_org: '三公司', indicator_name: '结算办理率(产值录入)', dimension_name: '物资管理-结算管理', system_extracted_value: '扣 20.0 分 (打包结算2条)', final_effective_value: '扣 10.0 分 (核减1条)', is_manual_modified: true, value_status: 'MANUAL_MODIFIED', modify_reason_desc: '其中 1 条经复核为标准化专业分包打包结算，符合制度约定，核减 10 分', modified_by_info: '张考核 (07-26 17:05)', support_voucher: 'JS-202607-0092' },
  { record_id: 'EX-202607-014', biz: '平台子表', target_org_name: '中建八局第四建设有限公司', short_org: '四公司', indicator_name: '结算调差金额规范性', dimension_name: '物资管理-结算管理', system_extracted_value: '扣 5.0 分 (单笔调差)', final_effective_value: '扣 5.0 分 (单笔调差)', is_manual_modified: false, value_status: 'AUTO_CALCULATED', modify_reason_desc: null, modified_by_info: null, support_voucher: null },
  { record_id: 'EX-202607-015', biz: '平台子表', target_org_name: '中建八局第一建设有限公司', short_org: '一公司', indicator_name: '验收是否合规满足手册标准要求', dimension_name: '物资管理-验收管理', system_extracted_value: '扣 2.0 分 (不合格1条)', final_effective_value: '扣 2.0 分 (不合格1条)', is_manual_modified: false, value_status: 'AUTO_CALCULATED', modify_reason_desc: null, modified_by_info: null, support_voucher: null },
];

// 二次编辑统计（KPI 卡 2）
const EXTRACT_EDIT_STATS = {
  total: EXTRACT_ADJUST_RECORDS.length,
  modified: EXTRACT_ADJUST_RECORDS.filter(r => r.is_manual_modified).length,
  autoOnly: EXTRACT_ADJUST_RECORDS.filter(r => !r.is_manual_modified).length,
};

// ------------------------------------------------------------
// 4. 局考穿透追溯：局考扣分三级归属切片（passthrough_slices）
// 二级单位零操作，不生成三级总分，不影响二级得分与排名
// ------------------------------------------------------------
const PASSTHROUGH_SLICES = {
  '一公司': [
    { indicator_name: '验收合规性', total_deduct: -1.0, tertiary_org_name: '济南分公司', slice_type: '直接归属', slice_score: -1.0, contribution_rate: null, project_name: '济南经十路商业综合体', voucher_no: 'YS-202607-8821', reason: '四方验收单缺少监理工程师现场签章，货实不符扣1分' },
    { indicator_name: '物资设备集中采购率', total_deduct: -1.5, tertiary_org_name: '青岛分公司', slice_type: '比率贡献率', slice_score: null, contribution_rate: '62.5%', project_name: '青岛自贸区物流中心', voucher_no: 'CG-202607-0012', reason: '该分公司集采率实际 85.2%（低于本单位 90% 目标值），占全公司集采拖欠缺口的 62.5%' },
    { indicator_name: '物资设备集中采购率', total_deduct: -1.5, tertiary_org_name: '中原分公司', slice_type: '比率贡献率', slice_score: null, contribution_rate: '37.5%', project_name: '郑州航空港产业园', voucher_no: 'CG-202607-0027', reason: '该分公司集采率实际 87.4%，占全公司集采拖欠缺口的 37.5%' },
    { indicator_name: '数据治理', total_deduct: -0.2, tertiary_org_name: '二级本部', slice_type: '二级本部', slice_score: -0.2, contribution_rate: null, project_name: '—', voucher_no: '—', reason: '异常结算单占比排名扣减，无法归属至具体三级单位，由二级本部承担' },
  ],
  '二公司': [
    { indicator_name: '合规管理', total_deduct: -0.5, tertiary_org_name: '广西分公司', slice_type: '直接归属', slice_score: -0.5, contribution_rate: null, project_name: '南宁东盟商务区超高层', voucher_no: 'HG-202607-NN03', reason: '一标一检系统排查发现无计划先招标进场违规 1 起，扣 0.5 分' },
    { indicator_name: '验收合规性', total_deduct: -1.0, tertiary_org_name: '山东分公司', slice_type: '直接归属', slice_score: -1.0, contribution_rate: null, project_name: '青岛胶东国际机场货运区工程', voucher_no: 'YS-202607-QD082', reason: '送货单缺少监理方四方联合签证盖章，扣1分' },
  ],
  '三公司': [
    { indicator_name: '结算办理率(子表折算)', total_deduct: -0.6, tertiary_org_name: '南京分公司', slice_type: '直接归属', slice_score: -0.6, contribution_rate: null, project_name: '南京江北新区科创园', voucher_no: 'JS-202607-0092', reason: '打包结算单据异常 1 条，子表扣10分折合主业0.6分' },
    { indicator_name: '资源管理', total_deduct: -0.5, tertiary_org_name: '安徽分公司', slice_type: '直接归属', slice_score: -0.5, contribution_rate: null, project_name: '合肥科技园二期', voucher_no: 'TS-202607-0044', reason: '云筑网物资租赁类投诉逾期未办结 10 笔，扣0.5分' },
  ],
};

// 无显式切片的单位：按"二级本部"归因兜底（保证弹窗可用且业务可解释）
function buildPassthroughFor(unitName) {
  if (PASSTHROUGH_SLICES[unitName]) return PASSTHROUGH_SLICES[unitName];
  const list = (SCORE_DATASETS['202607'] || {})['主业'] || [];
  const unit = list.find(u => u.unit === unitName);
  if (!unit) return [];
  const deducted = unit.details.filter(d => d.actualScore < d.fullScore);
  if (!deducted.length) return [];
  return deducted.map(d => ({
    indicator_name: d.indicator,
    total_deduct: -(Math.round((d.fullScore - d.actualScore) * 100) / 100),
    tertiary_org_name: '二级本部',
    slice_type: '二级本部',
    slice_score: -(Math.round((d.fullScore - d.actualScore) * 100) / 100),
    contribution_rate: null,
    project_name: '—',
    voucher_no: '—',
    reason: '该项扣分为比率类/排名类综合扣减，无法直接归属至单一三级单位，暂由二级本部承担',
    rectify_guidance: (typeof RECTIFY_GUIDE_MAP !== 'undefined' && RECTIFY_GUIDE_MAP[d.indicator]) || '请对照扣分事实完成整改并在次月报送整改结果',
  }));
}

// ------------------------------------------------------------
// 5. 二级自主考评：二级自主考评三级（自治空间数据）
// ------------------------------------------------------------
// 5.1 自主考评模板指标配置（默认继承局考核规则，二级可自主调整）
const LINE2_RULE_CONFIG = [
  { is_enabled: true,  category: '目标引领',   indicator_name: '物资设备集中采购率', score_weight: 15, period: '每月',            default_threshold: '≥92%',  has_custom_threshold: true,  data_type: 'A类·平台自动切片' },
  { is_enabled: true,  category: '目标引领',   indicator_name: '分包工程集中采购率', score_weight: 10, period: '季度(3,6,9,12月)', default_threshold: '≥25%',  has_custom_threshold: true,  data_type: 'A类·平台自动切片' },
  { is_enabled: true,  category: '目标引领',   indicator_name: '采购计划执行率',     score_weight: 10, period: '每月',            default_threshold: '≥95%',  has_custom_threshold: false, data_type: 'A类·平台自动切片' },
  { is_enabled: true,  category: '目标引领',   indicator_name: '平均采购时长',       score_weight: 5,  period: '每月',            default_threshold: '≤32天', has_custom_threshold: false, data_type: 'A类·平台自动切片' },
  { is_enabled: true,  category: '平台应用',   indicator_name: '平台子表穿透折算',   score_weight: 25, period: '每月',            default_threshold: '一次核查穿透', has_custom_threshold: false, data_type: 'A类·平台自动切片' },
  { is_enabled: true,  category: '数据治理',   indicator_name: '异常结算单占比排名', score_weight: 10, period: '每月',            default_threshold: '二级内部排名', has_custom_threshold: false, data_type: 'A类·平台自动切片' },
  { is_enabled: true,  category: '验收合规性', indicator_name: '验收合规性抽查',     score_weight: 10, period: '每月',            default_threshold: '扣1分/条', has_custom_threshold: false, data_type: 'B类·三级报送核验' },
  { is_enabled: true,  category: '合规管理',   indicator_name: '采购合规事件',       score_weight: 10, period: '每月',            default_threshold: '0扣分',  has_custom_threshold: false, data_type: 'B类·三级报送核验' },
  { is_enabled: false, category: '资源管理',   indicator_name: '分供商履约与评价',   score_weight: 5,  period: '每月',            default_threshold: '评价完成率100%', has_custom_threshold: false, data_type: 'B类·三级报送核验' },
];

// 5.2 三级差异化目标配置（二级向三级下达）
const LINE2_THRESHOLDS = [
  { tertiary_code: '8B-1C-01', tertiary_name: '中建八局第一建设有限公司济南分公司', business_type: '主业（继承）', target_value: '92%', remark: '济南区域集采资源集中度较高，适度上调' },
  { tertiary_code: '8B-1C-02', tertiary_name: '中建八局第一建设有限公司青岛分公司', business_type: '主业（继承）', target_value: '90%', remark: '按局默认值执行' },
  { tertiary_code: '8B-1C-03', tertiary_name: '中建八局第一建设有限公司中原分公司', business_type: '主业（继承）', target_value: '88%', remark: '区域供应商资源有限，下调2个百分点' },
  { tertiary_code: '8B-1C-04', tertiary_name: '中建八局第一建设有限公司华东分公司', business_type: '主业（继承）', target_value: '93%', remark: '华东区域集采覆盖率高' },
  { tertiary_code: '8B-1C-05', tertiary_name: '中建八局第一建设有限公司华南分公司', business_type: '主业（继承）', target_value: '90%', remark: '按局默认值执行' },
];

// 5.3 三级自主考评成绩与排名
function buildLine2Scores() {
  const names = ['青岛分公司','济南分公司','华东分公司','华南分公司','华中分公司','中原分公司','西北分公司','西南分公司','华北分公司','东北分公司','基础设施分公司','安装分公司','装饰分公司'];
  const base = [93.5, 88.0, 91.2, 89.6, 90.4, 86.4, 84.8, 87.5, 82.3, 80.6, 85.1, 83.2, 78.4];
  return names.map((n, i) => {
    const full = 100;
    const total = base[i];
    const details = [
      { indicator: '物资设备集中采购率', score: 15, actual: Math.round((total / 100 * 15) * 10) / 10, value: (88 + (i % 5)) + '.5%', standard: '≥92%(差异化)' },
      { indicator: '分包工程集中采购率', score: 10, actual: i % 3 === 0 ? 10 : 9.5, value: (25 + (i % 4)) + '.4%', standard: '≥25%' },
      { indicator: '采购计划执行率',     score: 10, actual: i % 4 === 0 ? 9.5 : 10, value: (94 + (i % 3)) + '.5%', standard: '≥95%' },
      { indicator: '平均采购时长',       score: 5,  actual: 5, value: (29 + (i % 4)) + '.2天', standard: '≤32天' },
      { indicator: '平台子表穿透折算',   score: 25, actual: Math.round((23 + (i % 3)) * 10) / 10, value: '子表' + (90 + (i % 6)) + '分', standard: '一次核查穿透折算' },
      { indicator: '异常结算单占比排名', score: 10, actual: i % 5 === 0 ? 9 : 10, value: '二级内部第' + (i + 1) + '位', standard: '二级内部排名扣分' },
      { indicator: '验收合规性抽查',     score: 10, actual: i % 4 === 0 ? 8 : (i % 3 === 0 ? 9 : 10), value: '不合格' + (i % 4) + '条', standard: '扣1分/条' },
      { indicator: '采购合规事件',       score: 10, actual: i % 6 === 0 ? 9.5 : 10, value: i % 6 === 0 ? '违规1起' : '无违规', standard: '0扣分' },
      { indicator: '分供商履约与评价',   score: 5,  actual: i % 3 === 0 ? 2.5 : 5, value: i % 3 === 0 ? '评价未完成' : '已完成', standard: '扣0.5分' },
    ];
    const sum = Math.round(details.reduce((n, d) => n + d.actual, 0) * 10) / 10;
    return {
      parent_l2_name: '一公司',
      tertiary_org_name: '中建八局第一建设有限公司' + n,
      short_name: n,
      total_score: sum,
      full_score: full,
      score_rate: (Math.round(sum / full * 1000) / 10) + '%',
      status: i < 8 ? 'published' : 'draft',
      details,
    };
  }).sort((a, b) => b.total_score - a.total_score).map((u, i) => { u.rank = i + 1; return u; });
}
const LINE2_SCORES = buildLine2Scores();

// 5.4 三级 B 类报送核验台
const LINE2_REPORTING = [
  { id: 'R2-001', tertiary: '济南分公司', item: '验收合规性佐证材料', submitTime: '2026-07-24 15:20', attachments: 3, status: '待核验',      note: '含四方验收单扫描件 12 份' },
  { id: 'R2-002', tertiary: '青岛分公司', item: '采购合规自查说明',   submitTime: '2026-07-24 16:05', attachments: 1, status: '待核验',      note: '声明本月无违规进场' },
  { id: 'R2-003', tertiary: '华东分公司', item: '分供商评价完成证明', submitTime: '2026-07-25 09:40', attachments: 2, status: '已核验',      note: '评价完成率 100%' },
  { id: 'R2-004', tertiary: '中原分公司', item: '验收合规性佐证材料', submitTime: '2026-07-23 11:10', attachments: 2, status: '驳回',        note: '缺少监理方签章页，需补正后重新提交' },
  { id: 'R2-005', tertiary: '华南分公司', item: '采购合规自查说明',   submitTime: '2026-07-25 10:30', attachments: 1, status: '待核验',      note: '—' },
];

// 5.5 检查问题落级分配台
const LINE2_INSPECTION_ISSUES = [
  { id: 'IS-001', source: '一标一检',     issue: '违规分包（未招标先进场）', foundAt: '2026-07-18', l3_org: '济南分公司', project_name: '济南经十路商业综合体',     deduct: 0.5, status: '已落级' },
  { id: 'IS-002', source: '审计巡视',     issue: '合同签订流程记录缺失',     foundAt: '2026-07-20', l3_org: '青岛分公司', project_name: '青岛自贸区物流中心',         deduct: 0.1, status: '已落级' },
  { id: 'IS-003', source: '专项治理上报', issue: '招投标领域问题漏报',       foundAt: '2026-07-22', l3_org: '未分配',     project_name: '—',                          deduct: 0.5, status: '待落级' },
  { id: 'IS-004', source: '一标一检',     issue: '围标串标线索（待核实）',   foundAt: '2026-07-24', l3_org: '未分配',     project_name: '—',                          deduct: 0.5, status: '待落级' },
];

// ------------------------------------------------------------
// 6. 局考穿透追溯：三级单位局考穿透只读台账（passthrough-detail）
// ------------------------------------------------------------
const PASSTHROUGH_DETAIL = {
  l3_org_name: '中建八局第一建设有限公司济南分公司',
  parent_l2_name: '一公司',
  eval_month: '2026年7月',
  summary: { indicatorCount: 3, totalDeduct: -2.4, projectCount: 4 },
  rows: [
    { indicator_name: '验收合规性',   category: '验收合规性', project_name: '济南经十路商业综合体',   voucher_no: 'YS-202607-8821', deduct_score: -1.0, fact_detail: '项目月度混凝土验收单缺少监理方签字（未四方验收），货实不符', channel_source: '平台子表抽查' },
    { indicator_name: '物资设备集中采购率', category: '目标引领', project_name: '济南高新科技园二期', voucher_no: 'CG-202607-0031', deduct_score: -0.8, fact_detail: '本单位集采率 89.0%（低于 92% 差异化目标值），该分公司贡献缺口 33.4%', channel_source: '平台提取' },
    { indicator_name: '数据治理',     category: '数据治理',   project_name: '济南中央商务区项目',     voucher_no: 'JS-202607-0116', deduct_score: -0.3, fact_detail: '采购成本降低率异常结算单 2 条（占比超阈值），按排名梯度扣减分摊', channel_source: '平台提取' },
    { indicator_name: '合规管理',     category: '合规管理',   project_name: '济南经十路商业综合体',   voucher_no: 'HG-202607-JN07', deduct_score: -0.3, fact_detail: '一标一检发现其他违规问题 1 条（台账更新滞后），扣 0.2 分；延期上报分摊 0.1 分', channel_source: '一标一检系统' },
  ],
};

// ------------------------------------------------------------
// 7. 跑批三阶段级联（V3.0）
// 局考二级算分 → 局考穿透切片自动生成 → 二级自主考评跑批（已启用二级自主考评的单位）
// ------------------------------------------------------------
const BATCH_STAGES = [
  { key: 'stage1', label: '局考二级算分',            status: 'done',    detail: '21家二级单位（主业18/海外1/投资2）按三业态标准表算分完成' },
  { key: 'stage2', label: '局考穿透切片自动生成',    status: 'done',    detail: '按底层单据与项目归属关系切片至三级单位，二级零操作、得分与排名不受影响' },
  { key: 'stage3', label: '二级自主考评跑批（已启用单位）', status: 'running', detail: '一公司、二公司等已启用二级自主考评的单位执行三级独立考核跑批' },
];
const BATCH_STAGE_BADGE = { done: 'dsc-tag--success', running: 'dsc-tag--info', pending: 'dsc-tag--default' };

// ------------------------------------------------------------
// 8. 申诉分级（V3.0）
// 局考穿透追溯：二级单位 → 局总部（局供应链管理部初审 / 部领导裁定）
// 二级自主考评：三级单位 → 二级单位（二级考核专员初审 / 二级领导裁定），局端仅穿透监管只读
// ------------------------------------------------------------
APPEAL_RECORDS.forEach(a => {
  a.appeal_level = '局考复核申诉(二级→局)';
  a.applicant = a.unit;
  a.responsible_l3 = '—';
  a.voucher_no = '—';
});

const LINE2_APPEALS = [
  { id: 'AP-L2-202607-08', month: '2026年7月', appeal_level: '二级自主申诉(三级→二级)', applicant: '中建八局第一建设有限公司济南分公司', unit: '一公司', indicator: '物资设备集中采购率', originalScore: 13.0, originalDeduction: 2.0,
    reason: '部分钢材采购因业主指定特殊标号未能并入集采，已提报特批非标集采说明，请专员复核核减扣分。', status: '二级专员初审中', submitTime: '2026-07-28 14:30', attachments: 1, responsible_l3: '济南分公司', voucher_no: 'CG-202607-0031',
    timeline: [
      { step: '提交申诉', time: '2026-07-28 14:30', operator: '济南分公司-王经理', status: 'done' },
      { step: '二级考核专员初审', time: '进行中', operator: '一公司-考核专员', status: 'active' },
      { step: '二级领导裁定', time: '待处理', operator: '一公司-分管领导', status: 'pending' },
    ]},
  { id: 'AP-L2-202607-09', month: '2026年7月', appeal_level: '二级自主申诉(三级→二级)', applicant: '中建八局第一建设有限公司青岛分公司', unit: '一公司', indicator: '验收合规性抽查', originalScore: 8.0, originalDeduction: 2.0,
    reason: '2条不合格验收单系供应商换货单据后附，已补交四方联合验收单扫描件，申请核减。', status: '已裁定（同意核减）', submitTime: '2026-07-29 09:15', attachments: 2, responsible_l3: '青岛分公司', voucher_no: 'YS-202607-QD082',
    timeline: [
      { step: '提交申诉', time: '2026-07-29 09:15', operator: '青岛分公司-刘经理', status: 'done' },
      { step: '二级考核专员初审', time: '2026-07-29 15:00', operator: '一公司-考核专员', status: 'done' },
      { step: '二级领导裁定', time: '2026-07-30 10:20', operator: '一公司-分管领导', status: 'done', result: '佐证充分，核减1分' },
    ]},
  { id: 'AP-L2-202607-10', month: '2026年7月', appeal_level: '二级自主申诉(三级→二级)', applicant: '中建八局第一建设有限公司中原分公司', unit: '一公司', indicator: '物资设备集中采购率', originalScore: 12.0, originalDeduction: 3.0,
    reason: '中原区域供应商资源有限，申请按区域实际情况下调差异化目标值。', status: '已驳回', submitTime: '2026-07-27 16:40', attachments: 1, responsible_l3: '中原分公司', voucher_no: 'CG-202607-0027',
    timeline: [
      { step: '提交申诉', time: '2026-07-27 16:40', operator: '中原分公司-赵经理', status: 'done' },
      { step: '二级考核专员初审', time: '2026-07-28 10:10', operator: '一公司-考核专员', status: 'done' },
      { step: '二级领导裁定', time: '2026-07-29 11:30', operator: '一公司-分管领导', status: 'done', result: '目标值已于季度初下达并确认，维持原扣分' },
    ]},
];

// ------------------------------------------------------------
// 9. 报送任务「填报主体层级」（V3.0：二级报送 / 三级报送）
// ------------------------------------------------------------
const REPORT_LEVEL_MAP = { 1: '二级报送', 2: '二级报送', 3: '二级报送', 4: '三级报送', 5: '二级报送', 6: '三级报送', 7: '三级报送', 8: '二级报送', 9: '二级报送' };
REPORTING_TASKS.forEach(t => { t.level = REPORT_LEVEL_MAP[t.id] || '二级报送'; });

// ------------------------------------------------------------
// 10. 角色与上下文（V3.1：五类角色权责矩阵）
// ------------------------------------------------------------
const ROLE_OPTIONS = [
  '局总部考核专员',
  '局供应链部领导',
  '二级考核专员（一公司）',
  '二级分管领导（一公司）',
  '三级经办人（济南分公司）',
];
const ROLE_PROFILE = {
  '局总部考核专员': {
    code: 'ROLE_HQ_SPECIALIST', operator: '张考核', org: '局供应链管理部',
    scope: '全局 21 家二级单位（主业18/海外1/投资2）',
    duties: '维护局端标准与指标库；审核平台抽取结果并执行单条二次编辑或批量导入；监控全局跑批；录入局级合规检查扣分事实；局考申诉初审；提请试公示与正式发榜。',
    home: 'rules-config',
    caps: { gate1: false, gate2: false, hqFinal: false, l2Final: false, intervention: true, inspection: true, workspace: true, portal: false },
  },
  '局供应链部领导': {
    code: 'ROLE_HQ_LEADER', operator: '李部长', org: '局供应链管理部',
    scope: '全局审批与终审（双闸口 + 重大申诉裁决）',
    duties: '闸口一审批试公示；终审裁决二级重大申诉；闸口二签发月度正式通报并授权推送画像；试公示紧急挂起。',
    home: 'score-ledger',
    caps: { gate1: true, gate2: true, hqFinal: true, l2Final: false, intervention: false, inspection: false, workspace: true, portal: false },
  },
  '二级考核专员（一公司）': {
    code: 'ROLE_L2_SPECIALIST', operator: '一公司-李雷', org: '中建八局第一建设有限公司',
    scope: '下属 13 家三级分公司（二级自主考评）',
    duties: '查阅本单位局考得分与穿透追溯分布；对局考扣分发起申诉；启用并维护自主考评模板；录入二级对三级检查问题；核验三级报送；自主申诉初审；提请二级结果发布。',
    home: 'tertiary-workspace',
    caps: { gate1: false, gate2: false, hqFinal: false, l2Final: false, intervention: false, inspection: true, workspace: true, portal: false },
  },
  '二级分管领导（一公司）': {
    code: 'ROLE_L2_LEADER', operator: '一公司-王总', org: '中建八局第一建设有限公司',
    scope: '本单位自主考评审批与终审',
    duties: '审批自主考评规则配置与版本发布；终审裁决三级自主考评申诉与特批调整；签发本单位三级自主考评月度成绩与通报。',
    home: 'tertiary-workspace',
    caps: { gate1: false, gate2: false, hqFinal: false, l2Final: true, intervention: false, inspection: false, workspace: true, portal: false },
  },
  '三级经办人（济南分公司）': {
    code: 'ROLE_L3_MANAGER', operator: '济南分公司-经办人', org: '中建八局第一建设有限公司济南分公司',
    scope: '本单位局考穿透追溯台账（只读）+ 报送填报 + 自主考评查分申诉',
    duties: '查阅本单位关联的《局考穿透追溯台账》；在线提交自主考评 B 类报送数据与佐证；在试公示期内对自主考评扣分发起申诉。',
    home: 'tertiary-portal',
    caps: { gate1: false, gate2: false, hqFinal: false, l2Final: false, intervention: false, inspection: false, workspace: false, portal: true },
  },
};

// ------------------------------------------------------------
// 11. 双闸口审批流程（V3.1 核心增量）
// 闸口一：局领导审批试公示；闸口二：局领导签发正式通报并推送画像
// ------------------------------------------------------------
// 试公示倒计时：全局唯一来源（台账闸口卡 / 申诉页横幅 / 三级门户 三处同源，避免文案不一致）
const TRIAL_COUNTDOWN = { start: '2026-07-28', end: '2026-07-30', text: '1 天 14 小时', deadline: '2026-07-30 18:00' };

const GATE_FLOW = {
  current: 'GATE1_PENDING',
  gate1: {
    title: '闸口一 · 局考试公示审批',
    pendingText: '当前 2026年7月 成绩草稿已生成，等待局领导审批发布试公示',
    approveLabel: '审批通过：发布试公示（3天倒计时）',
    rejectLabel: '退回重新核对',
    approvedText: '试公示期运行中（剩余 ' + TRIAL_COUNTDOWN.text + '），各二级单位仅可见本公司数据',
  },
  gate2: {
    title: '闸口二 · 正式通报签批',
    pendingText: '申诉裁决与特批重算已完成，等待局领导正式签发月度通报',
    approveLabel: '签发正式月度通报并推送画像',
    approvedText: '正式发榜归档，成绩已推送供应链画像系统',
  },
  stages: [
    { code: 'BATCH_RUNNING', name: '跑批计算中', tag: 'dsc-tag--default' },
    { code: 'GATE1_PENDING', name: '待局领导审批试公示', tag: 'dsc-tag--warning' },
    { code: 'TRIAL_PUBLISHED', name: '试公示进行中（3天）', tag: 'dsc-tag--info' },
    { code: 'GATE2_PENDING', name: '待局领导正式发榜签批', tag: 'dsc-tag--warning' },
    { code: 'OFFICIALLY_PUBLISHED', name: '正式发榜归档', tag: 'dsc-tag--success' },
  ],
};

// ------------------------------------------------------------
// 12. 合规检查与扣分事实登记台（V3.1 新增输入端）
// ------------------------------------------------------------
const INSPECTION_TYPE_RULES = {
  '一标一检': { step: 0.5, note: '违法分包、围标串标每条扣0.5分；其他违规0.2分' },
  '各类审计巡视': { step: 0.1, note: '分管领导任期内问题每条扣0.1分' },
  '无计划先施工进场': { step: 0.5, note: '无计划进场/未招标先进场/未签合同先进场，0.5分/笔，上不封顶（扣至0分为止）' },
  '专项治理': { step: 0.5, note: '每月15日前上报；延期上报或瞒报漏报扣0.5分/次' },
  '日常验收合规性抽查': { step: 1.0, note: '当月验收单据全量核查，不合规1条扣1分' },
};

const INSPECTION_EVENTS = [
  { event_id: 'EV-202607-001', inspection_type: '一标一检', target_l2_name: '中建八局第一建设有限公司', target_l3_name: '济南分公司', project_name: '济南汉峪金谷产业园二期', voucher_no: 'YBYJ-2026-JN-019', issue_summary: '专业分包招标过程排查发现围标串标迹象单据 1 笔', deduct_points: -0.5, report_file_name: '关于汉峪金谷项目一标一检违规通报.pdf', operator_name: '李专员', occur_time: '2026-07-18 14:30', audit_status: '已生效' },
  { event_id: 'EV-202607-002', inspection_type: '日常验收合规性抽查', target_l2_name: '中建八局第一建设有限公司', target_l3_name: '济南分公司', project_name: '济南奥体金融中心二期', voucher_no: 'YS-202607-8821', issue_summary: '四方验收单缺少监理工程师现场签章，送货凭据货实不符', deduct_points: -1.0, report_file_name: '7月份智能物管单据抽查不合格清单.pdf', operator_name: '王主管', occur_time: '2026-07-22 10:15', audit_status: '已生效' },
  { event_id: 'EV-202607-003', inspection_type: '无计划先施工进场', target_l2_name: '中建八局第二建设有限公司', target_l3_name: '广西分公司', project_name: '南宁东盟商务区超高层', voucher_no: 'HG-202607-NN03', issue_summary: '未签合同先进场施工，涉及专业分包 1 笔', deduct_points: -0.5, report_file_name: '二公司广西分公司无计划进场核查通报.pdf', operator_name: '李专员', occur_time: '2026-07-20 09:40', audit_status: '已生效' },
  { event_id: 'EV-202607-004', inspection_type: '各类审计巡视', target_l2_name: '中建八局第三建设有限公司', target_l3_name: '南京分公司', project_name: '南京江北新区科创园', voucher_no: 'SJ-202607-0054', issue_summary: '审计巡视发现合同签订流程记录缺失 1 条', deduct_points: -0.1, report_file_name: '2026年三季度审计巡视问题清单.pdf', operator_name: '赵主管', occur_time: '2026-07-23 15:10', audit_status: '待复核' },
  { event_id: 'EV-202607-005', inspection_type: '专项治理', target_l2_name: '中建八局东北公司', target_l3_name: '二级本部', project_name: '—', voucher_no: '—', issue_summary: '工程建设和招投标领域专项治理问题延期 1 天上报', deduct_points: -0.5, report_file_name: '专项治理上报时效核查记录.pdf', operator_name: '李专员', occur_time: '2026-07-16 09:05', audit_status: '已生效' },
];

// ------------------------------------------------------------
// 13. 三级单位业务门户：我的报送任务（V3.1 填报源头）
// ------------------------------------------------------------
const L3_PORTAL_REPORTS = [
  { task_id: 'L3R-202607-01', title: '2026年7月重点工作挂图计划进度报送', indicator: '月度重点工作挂图计划', deadline: '2026-07-25 18:00', remain: '剩余 6 小时', status: '待填报', submitted: false },
  { task_id: 'L3R-202607-02', title: '2026年7月验收合规性佐证材料报送', indicator: '验收合规性（B类）', deadline: '2026-07-25 18:00', remain: '剩余 6 小时', status: '待填报', submitted: false },
  { task_id: 'L3R-202607-03', title: '2026年7月采购合规自查说明', indicator: '采购合规（B类）', deadline: '2026-07-24 18:00', submit_time: '2026-07-23 16:20', status: '已通过', submitted: true },
  { task_id: 'L3R-202607-04', title: '2026年7月专项治理问题上报', indicator: '合规管理', deadline: '2026-07-15 18:00', submit_time: '2026-07-16 09:05', status: '已驳回', submitted: true,
    reject_category: '数据口径不符', reject_comment: '上报口径与制度要求不一致，请按最新模板重新填报并附会签记录', resubmit_deadline: '2026-07-28 18:00' },
];

// ------------------------------------------------------------
// 14. V3.1 字段补强
// ------------------------------------------------------------
// 14.1 取数方式与编辑权限（V3.1：平台抽取打底 + 考核员二次编辑 / 批量导入覆盖）
const EDIT_PERMISSION_NOTE = '「平台抽取+考核员编辑」指标支持单条二次编辑与 Excel 批量导入覆盖，系统保留原值比对与修改留痕；「平台全自动抽取」指标不接受人工覆盖。';

// 14.2 局考穿透追溯切片：归属类型命名升级 + 业务整改指引
const RECTIFY_GUIDE_MAP = {
  '验收合规性': '请于次月5日前在智能物管模块补齐监理签章凭据',
  '物资设备集中采购率': '加大下季度钢材招标进场统筹，落实差异化集采指标',
  '数据治理': '排查异常结算单成因，规范结算单价与成本口径录入',
  '合规管理': '完善招标前置审批与台账记录，杜绝无计划进场',
  '结算办理率(子表折算)': '规范打包结算申报，按时完成过程结算单录入',
  '资源管理': '及时办结云筑网投诉工单，避免逾期未办结',
};
Object.keys(PASSTHROUGH_SLICES).forEach(unit => {
  PASSTHROUGH_SLICES[unit].forEach(s => {
    if (s.slice_type === '比率贡献率') s.slice_type = '贡献分摊';
    s.rectify_guidance = RECTIFY_GUIDE_MAP[s.indicator_name] || '请对照扣分事实完成整改并在次月报送整改结果';
  });
});
PASSTHROUGH_DETAIL.rows.forEach(r => {
  r.rectify_guidance = RECTIFY_GUIDE_MAP[r.indicator_name] || '请对照扣分事实完成整改并在次月报送整改结果';
});

// 14.3 组织机构树：自主考评状态（V3.1）
const AUTONOMOUS_DISABLED_CODES = ['8B-OVERSEAS', '8B-WL', '8B-HJKJ'];
const ORG_SUSPENDED_CODES = ['8B-WL-05'];
ORG_TREE.children.forEach(u => {
  u.autonomous_eval_status = AUTONOMOUS_DISABLED_CODES.includes(u.org_code) ? '未启用' : '已启用';
  u.autonomous_template_version = u.autonomous_eval_status === '已启用' ? (u.org_code === '8B-1C' ? 'V3.1-自主定制版' : 'V3.1-DEFAULT') : null;
  (u.children || []).forEach(c => {
    c.autonomous_eval_status = u.autonomous_eval_status;
    if (ORG_SUSPENDED_CODES.includes(c.org_code)) c.status = 'inactive';
  });
});

// 14.4 组织机构统计（自洽计算：正常运行 / 停用挂起）
const ORG_STATS_EXT = (function () {
  let normal = 0, suspended = 0;
  const walk = (n) => {
    if (n.status === 'active') normal++; else suspended++;
    (n.children || []).forEach(walk);
  };
  walk(ORG_TREE);
  return { normal: normal, suspended: suspended };
})();

// 14.5 三级 B 类报送核验台：驳回重报字段（V3.1）
const LINE2_REJECT_CATEGORIES = ['支撑材料缺失', '数据口径不符', '盖章失效', '填报不实'];
LINE2_REPORTING.forEach((r, i) => {
  if (r.status === '驳回') {
    r.reject_category = '支撑材料缺失';
    r.reject_comment = '验收佐证缺少监理方签章页，请补正后重新提交';
    r.resubmit_deadline = '2026-07-28 18:00';
  }
  r.report_id = 'RP-202607-' + String(i + 1).padStart(2, '0');
});

// 14.6 自主考评配置版本与发布审批（V3.1）
const AUTONOMOUS_VERSION = {
  version: 'V3.1-自主定制版',
  base: '基于局 2026年7月标准继承',
  publishStatus: '待二级分管领导审批',
  updatedAt: '2026-07-24 17:20',
  changeLog: '① 物资设备集中采购率权重 15→15（不变）；② 分供商履约与评价 停用；③ 三级差异化阈值：济南 92% / 青岛 90% / 中原 88% / 华东 93%',
};