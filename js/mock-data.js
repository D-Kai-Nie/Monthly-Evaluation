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
  { id: 1, applicable: '主业', category: '目标引领', name: '云筑网履约额', period: '仅6月、12月触发', score: '7', rule: '未达标按缺口比例扣分', proof: '平台提取', source: 'DSC+数字商务（商务确权产值自动抓取）', standard: '云筑网履约额/本月累计产值×100%≥70%，每低1%扣1分；以商务确权值为基准；JMRH等项目产值扣除需生产副总签字确认；商务确权产值来源于数字商务系统' },
  { id: 2, applicable: '主业', category: '目标引领', name: '采购成本降低率', period: '每月触发', score: '6', rule: '实际降低率低于目标值扣分', proof: '平台提取', source: 'DSC', standard: '平均采购成本降低率≥3.2%，每低0.1%扣1分' },
  { id: 3, applicable: '主业', category: '目标引领', name: '物资设备采购效益率', period: '每月触发', score: '6', rule: '效益率低于目标值扣分', proof: '平台提取', source: 'DSC', standard: '平均物资设备采购效益率≥11%，每低0.5%扣1分' },
  { id: 4, applicable: '主业', category: '目标引领', name: '分包工程集中采购率', period: '仅3、6、9、12月触发', score: '7', rule: '未达标按比例扣分（单位差异化阈值）', proof: '平台提取', source: 'DSC', standard: '≥25%，每低1%扣1分；差异化目标：主业25%/土木、轨道10%/文旅5%/北京22%' },
  { id: 5, applicable: '主业', category: '目标引领', name: '物资设备集中采购率', period: '每月触发', score: '6', rule: '未达标按比例扣分（单位差异化阈值）', proof: '平台提取', source: 'DSC', standard: '≥90%，每低2%扣1分；差异化目标：装饰65%/新型建造44%/轨道公司54%/发展建设80%' },
  { id: 6, applicable: '主业', category: '目标引领', name: '采购计划执行率', period: '每月触发', score: '5', rule: '执行率低于目标值按比例扣分', proof: '平台提取', source: 'DSC', standard: '当月采购计划执行率≥95%，每低1%扣1分' },
  { id: 7, applicable: '主业', category: '目标引领', name: '厂家直采率', period: '每月触发', score: '4', rule: '直采率低于目标值扣分', proof: '平台提取', source: 'DSC', standard: '厂家直采率≥33%，每低1%扣1分' },
  { id: 8, applicable: '主业', category: '目标引领', name: '在线评标率', period: '每月触发', score: '4', rule: '未达标按梯度扣分', proof: '平台提取', source: 'DSC', standard: '在线评标率≥98%，每低1%扣2分' },
  { id: 9, applicable: '主业', category: '目标引领', name: '平均采购时长', period: '每月触发', score: '3', rule: '超出标准天数按超期天数扣分', proof: '平台提取', source: 'DSC', standard: '平均采购时长≤32天，每增加1天扣1分' },
  { id: 10, applicable: '主业', category: '目标引领', name: '资源库优化', period: '仅3、6、9、12月触发', score: '4', rule: '休眠分供商清除率未达标扣分', proof: '平台提取', source: 'DSC', standard: '休眠（两年无合作）分供商清除率100%，每低1%扣1分' },
  { id: 11, applicable: '主业', category: '目标引领', name: '竣工项目资产周转率', period: '每月触发（延后2个月考核）', score: '4', rule: '周转率低于标杆扣分', proof: '平台提取', source: 'DSC', standard: '项目资产周转率≥70%，每低1%扣1分；延后2个月考核（6月考核1-4月竣工项目）' },
  { id: 12, applicable: '主业', category: '平台应用', name: '数字供应链平台应用', period: '按月（上月26日-本月25日）', score: '6', rule: '按平台考核子表内容执行', proof: '平台提取', source: '平台考核子表（13项×0.06折算）', standard: '子表100分制，得分×0.06折算为本项6分；2、3月预考核，4月起正式考核' },
  { id: 13, applicable: '主业', category: '数据治理', name: '数据治理', period: '每月触发', score: '6', rule: '按异常占比排名梯度扣分', proof: '平台提取', source: 'DSC结算单', standard: '采购成本降低率异常（>30%或<-30%）及物资设备采购效益率异常（>50%或<-30%）结算单占总计算单比例，按排名依次扣0.1分；承接原子表移出的两项异常数据考核' },
  { id: 14, applicable: '主业', category: '验收合规性', name: '验收合规性', period: '每月触发', score: '4', rule: '按不合规项数量扣分（全量核查）', proof: '平台提取', source: 'DSC验收单', standard: '当月验收单据全量核查：四方验收、送货据资料、货实相符，不合规1条扣1分' },
  { id: 15, applicable: '主业', category: '资源管理', name: '资源管理', period: '按月', score: '7', rule: '事件驱动扣分（5条）', proof: '平台提取', source: '投诉/上访事件、禁用分供商名单', standard: '①工信部正式批投诉0.1分/笔；②云筑网投诉逾期未办结0.05分/笔；③上访事件2-4分/次；④违规使用禁用分供商1分/起；⑤分供商评价完成率100%，未完成扣0.5分（1月、7月考核）' },
  { id: 16, applicable: '主业', category: '合规管理', name: '合规管理', period: '按月', score: '5', rule: '事件驱动扣分（4条，上不封顶）', proof: '检查报告', source: '检查报告（带审批流导入）', standard: '①一标一检违法分包/围标串标0.5分/条，其他违规0.2分/条；②审计巡视0.1分/条；③无计划进场0.5分/笔上不封顶；④专项治理延期上报0.5分/次' },
  // ---------- 海外（总分100分，序号1-8） ----------
  { id: 17, applicable: '海外', category: '目标引领', name: '采购成本降低率', period: '按季（季度末月）', score: '20', rule: '实际降低率低于目标值扣分', proof: '平台提取', source: 'DSC', standard: '平均采购成本降低率≥3.2%，每低0.1%扣1分；与采购金额对比' },
  { id: 18, applicable: '海外', category: '目标引领', name: '物资设备集中采购率', period: '按月', score: '20', rule: '未达标按比例扣分', proof: '平台提取', source: 'DSC', standard: '平均≥40%，每低1%扣1分' },
  { id: 19, applicable: '海外', category: '目标引领', name: '平均采购时长', period: '按月', score: '10', rule: '超出标准天数按超期天数扣分', proof: '平台提取', source: 'DSC', standard: '平均采购时长≤32天，每增加1天扣1分' },
  { id: 20, applicable: '海外', category: '重点工作', name: '海外供应链建设', period: '按月', score: '10', rule: '事件驱动扣分', proof: '报送', source: '工作计划/例会记录报送', standard: '按月组织海外采购物资例会，问题未及时解决1分/项；参与马来西亚、印度尼西亚采购共享中心工作，未完成/延迟0.5分/项' },
  { id: 21, applicable: '海外', category: '重点工作', name: '月度重点工作挂图计划', period: '按月', score: '10', rule: '报送进度，按未完成项扣分', proof: '报送', source: '挂图计划报送', standard: '每季第一周报送挂图计划，每月25日报送进度；每月≥5项，每少1项或质量不高扣1分扣完为止；不报送/晚报送不得分' },
  { id: 22, applicable: '海外', category: '重点工作', name: '资源管理', period: '按月', score: '10', rule: '事件驱动扣分', proof: '平台提取', source: '投诉/上访事件、禁用分供商名单', standard: '同主业"资源管理"（1）-（5）条款' },
  { id: 23, applicable: '海外', category: '重点工作', name: '采购合规', period: '按月', score: '10', rule: '事件驱动扣分', proof: '检查报告', source: '检查报告（带审批流导入）', standard: '同主业"合规管理"（1）-（4）条款' },
  { id: 24, applicable: '海外', category: '重点工作', name: '资源白名单', period: '按年（12月年末考核）', score: '10', rule: '按发布数量缺口扣分', proof: '报送', source: '白名单发布记录', standard: '年度发布≥20项出海资源白名单资源库，每少1项扣1.5分' },
  // ---------- 投资（总分100分，序号1-9） ----------
  { id: 25, applicable: '投资', category: '目标引领', name: '采购成本降低率', period: '按季（季度末月）', score: '10', rule: '实际降低率低于目标值扣分', proof: '报送', source: '单位报送（核验后计分）', standard: '平均采购成本降低率≥3.2%，每低0.1%扣1分；与目标成本对比' },
  { id: 26, applicable: '投资', category: '目标引领', name: '招标采购计划执行率', period: '按月', score: '10', rule: '执行率低于目标值按比例扣分', proof: '平台提取', source: 'DSC（城市运营报送）', standard: '当月采购计划执行率≥95%，每低1%扣1分' },
  { id: 27, applicable: '投资', category: '目标引领', name: '在线评标率', period: '按月', score: '10', rule: '未达标按梯度扣分', proof: '平台提取', source: 'DSC', standard: '在线评标率≥98%，每低1%扣2分；选用云筑网部分' },
  { id: 28, applicable: '投资', category: '目标引领', name: '公开采购率', period: '按月', score: '10', rule: '未达标按比例扣分', proof: '平台提取', source: '云筑网', standard: '公开采购率≥80%，每低1%扣1分；选用云筑网，结果公开' },
  { id: 29, applicable: '投资', category: '目标引领', name: '平均采购时长', period: '按月', score: '10', rule: '超出标准天数按超期天数扣分', proof: '平台提取', source: 'DSC（城市运营报送）+东孚', standard: '平均采购时长≤32天，每增加1天扣1分；自发布采购公告起至完成成交' },
  { id: 30, applicable: '投资', category: '重点工作', name: '月度重点工作挂图计划', period: '按季度（局供应链管理部查验）', score: '20', rule: '报送进度+查验评分', proof: '报送', source: '挂图计划+查验记录', standard: '每季第一周报送，每月25日报进度；每月≥3项，每少1项扣1分扣完为止；局供应链管理部按查验情况评分' },
  { id: 31, applicable: '投资', category: '重点工作', name: '资源管理', period: '按月', score: '10', rule: '事件驱动扣分', proof: '平台提取', source: '投诉/上访事件、禁用分供商名单', standard: '同主业"资源管理"（1）-（5）条款；恶意投诉除外' },
  { id: 32, applicable: '投资', category: '重点工作', name: '采购合规', period: '按月', score: '10', rule: '事件驱动扣分', proof: '检查报告', source: '检查报告（带审批流导入）', standard: '同主业"合规管理"（1）-（4）条款' },
  { id: 33, applicable: '投资', category: '重点工作', name: '资源白名单', period: '按年（12月年末考核）', score: '10', rule: '按发布数量缺口扣分', proof: '报送', source: '白名单发布记录', standard: '年度发布≥6项白名单资源库，每少1项扣1.5分' },
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
    // 13 合规管理（事件驱动，检查报告证明，5分）
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
// 取数通道：DSC / DSC+数字商务 / 投诉上访事件 / 检查报告 / 平台子表
// ============================================================
const DATA_COLLECTION_TASKS = [
  { id: 1, type: 'core', indicator: '云筑网履约额', source: 'DSC+数字商务（商务确权产值自动抓取）', method: 'API自动抓取', schedule: '仅6月、12月 26日 02:00', status: 'success', lastRun: '2026-06-26 02:00:32', records: 2450, exception: 5, note: '商务确权产值来源于数字商务系统，自动抓取；JMRH等项目产值扣除需生产副总签字确认' },
  { id: 2, type: 'core', indicator: '采购成本降低率', source: 'DSC', method: 'API自动抓取', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-06-26 02:01:15', records: 18456, exception: 23 },
  { id: 3, type: 'core', indicator: '物资设备采购效益率', source: 'DSC', method: 'API自动抓取', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-06-26 02:02:08', records: 18210, exception: 18 },
  { id: 4, type: 'core', indicator: '分包工程集中采购率', source: 'DSC', method: 'API自动抓取', schedule: '仅3、6、9、12月 26日 02:00', status: 'success', lastRun: '2026-06-26 02:02:45', records: 8930, exception: 0, note: '单位差异化阈值：主业25%/土木轨道10%/文旅5%/北京22%' },
  { id: 5, type: 'core', indicator: '物资设备集中采购率', source: 'DSC', method: 'API自动抓取', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-06-26 02:03:22', records: 15620, exception: 0, note: '单位差异化阈值：装饰65%/新型建造44%/轨道54%/发展建设80%' },
  { id: 6, type: 'core', indicator: '采购计划执行率', source: 'DSC', method: 'API自动抓取', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-06-26 02:04:10', records: 3420, exception: 0 },
  { id: 7, type: 'core', indicator: '厂家直采率', source: 'DSC', method: 'API自动抓取', schedule: '每月26日 02:00', status: 'warning', lastRun: '2026-06-26 02:05:01', records: 12680, exception: 45 },
  { id: 8, type: 'core', indicator: '在线评标率', source: 'DSC', method: 'API自动抓取', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-06-26 02:05:48', records: 2890, exception: 0 },
  { id: 9, type: 'core', indicator: '平均采购时长', source: 'DSC', method: 'API自动抓取', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-06-26 02:06:30', records: 24560, exception: 0 },
  { id: 10, type: 'core', indicator: '资源库优化', source: 'DSC（休眠分供商名单）', method: 'API自动抓取', schedule: '仅3、6、9、12月 26日 02:00', status: 'success', lastRun: '2026-06-26 02:06:55', records: 1560, exception: 0, note: '休眠（两年无合作）分供商清除率' },
  { id: 11, type: 'core', indicator: '竣工项目资产周转率', source: 'DSC', method: 'API自动抓取', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-06-26 02:07:10', records: 1280, exception: 0, note: '延后2个月考核' },
  { id: 12, type: 'core', indicator: '数据治理', source: 'DSC结算单', method: 'API自动抓取', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-06-26 02:07:35', records: 18456, exception: 12, note: '两类异常结算单按排名梯度扣0.1分；承接原子表移出的两项异常数据考核' },
  { id: 13, type: 'core', indicator: '验收合规性', source: 'DSC验收单', method: 'API自动抓取', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-06-26 02:07:50', records: 9860, exception: 8, note: '当月验收单据全量核查（四方验收/送货据/货实相符）' },
  { id: 14, type: 'core', indicator: '资源管理', source: '投诉/上访事件、禁用分供商名单', method: '事件归集', schedule: '每月26日 02:00', status: 'pending', lastRun: '-', records: 0, exception: 0, note: '工信部批投诉/云筑网投诉/上访/禁用分供商/分供商评价（1月、7月）' },
  { id: 15, type: 'core', indicator: '合规管理', source: '检查报告（一标一检/审计巡视/专项治理）', method: '检查报告录入（审批流）', schedule: '每月15日前上报', status: 'pending', lastRun: '-', records: 0, exception: 0, note: '扣分须关联检查报告证明资料，导入走审批流' },
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
  { id: 1, indicator: '采购成本降低率', source: 'DSC', method: 'API自动抓取', schedule: '季度末月（3/6/9/12月）26日 02:00', status: 'pending', lastRun: '-', records: 0, exception: 0, note: '按季考核，下一触发时点9月26日；与采购金额对比' },
  { id: 2, indicator: '物资设备集中采购率', source: 'DSC', method: 'API自动抓取', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-07-26 02:01:20', records: 1860, exception: 0, note: '目标值≥40%' },
  { id: 3, indicator: '平均采购时长', source: 'DSC', method: 'API自动抓取', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-07-26 02:02:05', records: 1240, exception: 0 },
  { id: 4, indicator: '海外供应链建设', source: '单位报送（例会记录/工作计划）', method: '报送核验', schedule: '每月25日 18:00 报送截止', status: 'success', lastRun: '2026-07-24 16:40', records: 12, exception: 0, note: '参与马来西亚、印度尼西亚采购共享中心工作计划' },
  { id: 5, indicator: '月度重点工作挂图计划', source: '单位报送', method: '报送核验', schedule: '每季第一周报计划 / 每月25日报进度', status: 'success', lastRun: '2026-07-24 17:02', records: 5, exception: 0, note: '每月≥5项，每少1项扣1分扣完为止；不报送晚报送不得分' },
  { id: 6, indicator: '资源管理', source: '投诉/上访事件、禁用分供商名单', method: '事件归集', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-07-26 02:03:10', records: 86, exception: 0, note: '同主业资源管理（1）-（5）条款' },
  { id: 7, indicator: '采购合规', source: '检查报告（带审批流导入）', method: '检查报告录入（审批流）', schedule: '事件驱动', status: 'success', lastRun: '2026-07-26 02:03:40', records: 3, exception: 0, note: '同主业合规管理（1）-（4）条款' },
  { id: 8, indicator: '资源白名单', source: '单位报送', method: '报送核验', schedule: '按年（12月年末考核）', status: 'pending', lastRun: '-', records: 0, exception: 0, note: '年度发布≥20项，每少1项扣1.5分；年末一次性计分' },
];

// ============================================================
// 投资考核指标采集任务（2026年7月修订版新标准，9项）
// ============================================================
const INVEST_COLLECTION_TASKS = [
  { id: 1, indicator: '采购成本降低率', source: '单位报送（核验后计分）', method: '报送核验', schedule: '季度末月（3/6/9/12月）报送', status: 'pending', lastRun: '-', records: 0, exception: 0, note: '按季考核，与目标成本对比' },
  { id: 2, indicator: '招标采购计划执行率', source: 'DSC（城市运营报送）', method: 'API自动抓取+报送核验', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-07-26 02:01:15', records: 420, exception: 0 },
  { id: 3, indicator: '在线评标率', source: 'DSC', method: 'API自动抓取', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-07-26 02:02:00', records: 310, exception: 0, note: '选用云筑网的部分' },
  { id: 4, indicator: '公开采购率', source: '云筑网', method: 'API自动抓取', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-07-26 02:02:35', records: 280, exception: 0, note: '云筑网入湖，DSC获取' },
  { id: 5, indicator: '平均采购时长', source: 'DSC（城市运营报送）+东孚', method: 'API自动抓取', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-07-26 02:03:10', records: 360, exception: 1, note: '东孚取采购文件发布至招标结束' },
  { id: 6, indicator: '月度重点工作挂图计划', source: '单位报送+查验评分', method: '报送核验+查验录入', schedule: '每季第一周报计划 / 每月25日报进度', status: 'success', lastRun: '2026-07-24 17:10', records: 6, exception: 0, note: '每月≥3项；局供应链管理部查验评分，季度末计分' },
  { id: 7, indicator: '资源管理', source: '投诉/上访事件、禁用分供商名单', method: '事件归集', schedule: '每月26日 02:00', status: 'success', lastRun: '2026-07-26 02:03:45', records: 42, exception: 0, note: '恶意投诉除外' },
  { id: 8, indicator: '采购合规', source: '检查报告（带审批流导入）', method: '检查报告录入（审批流）', schedule: '事件驱动', status: 'success', lastRun: '2026-07-26 02:04:05', records: 2, exception: 0 },
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