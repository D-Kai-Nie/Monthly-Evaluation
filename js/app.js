/**
 * DSC 二级单位考核指标评分系统 - 主应用逻辑
 * 基于 UI/UE 设计规范 v2026
 */

// ============================================================
// 全局状态管理
// ============================================================
const AppState = {
  currentPage: 'rules-config', // rules-config | data-collection | score-ledger | appeal-approval
  sidebarCollapsed: false,
  currentModal: null,
  scoreMonth: '202607', // 打分台账当前月份
  scoreBiz: '全局',     // 排名看板当前维度：全局 | 主业 | 海外 | 投资
  collectTab: 'main',   // 数据采集当前业态Tab
};

// ============================================================
// 导航与页面路由
// ============================================================
function initNavigation() {
  // 顶部导航点击
  document.querySelectorAll('.dsc-header__nav-item').forEach(item => {
    item.addEventListener('click', function() {
      document.querySelectorAll('.dsc-header__nav-item').forEach(i => i.classList.remove('dsc-header__nav-item--active'));
      this.classList.add('dsc-header__nav-item--active');
    });
  });

  // 侧边栏菜单点击（支持一级菜单与子菜单）
  document.querySelectorAll('.dsc-sidebar__menu-item[data-page], .dsc-sidebar__submenu-item[data-page]').forEach(item => {
    item.addEventListener('click', function() {
      const page = this.dataset.page;
      navigateTo(page);
    });
  });

  // 「月度考核」分组头展开/收起
  const groupHead = document.getElementById('assessmentGroupHead');
  const submenu = document.getElementById('assessmentSubmenu');
  const caret = document.getElementById('assessmentCaret');
  if (groupHead) {
    groupHead.addEventListener('click', function() {
      const isOpen = submenu.classList.toggle('dsc-sidebar__submenu--open');
      this.classList.toggle('dsc-sidebar__group-head--active', isOpen);
      caret.classList.toggle('dsc-sidebar__caret--open', isOpen);
    });
  }

  // 侧边栏收起/展开
  document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
}

function navigateTo(page) {
  AppState.currentPage = page;
  
  // 更新侧边栏激活状态（一级菜单 + 子菜单）
  document.querySelectorAll('.dsc-sidebar__menu-item[data-page], .dsc-sidebar__submenu-item[data-page]').forEach(item => {
    const activeClass = item.classList.contains('dsc-sidebar__submenu-item')
      ? 'dsc-sidebar__submenu-item--active'
      : 'dsc-sidebar__menu-item--active';
    item.classList.toggle(activeClass, item.dataset.page === page);
  });
  
  // 更新面包屑
  updateBreadcrumb(page);
  
  // 渲染页面内容
  renderPage(page);
}

function updateBreadcrumb(page) {
  const pageNames = {
    'rules-config': '考核规则配置',
    'data-collection': '数据采集与预处理',
    'score-ledger': '月度自动跑批与打分台账',
    'appeal-approval': '申诉审批与纠正',
  };
  document.getElementById('breadcrumbPage').textContent = pageNames[page] || page;
}

function toggleSidebar() {
  AppState.sidebarCollapsed = !AppState.sidebarCollapsed;
  const sidebar = document.getElementById('sidebar');
  const main = document.getElementById('mainContent');
  sidebar.classList.toggle('dsc-sidebar--collapsed', AppState.sidebarCollapsed);
  main.classList.toggle('dsc-main--expanded', AppState.sidebarCollapsed);
  // toggleIcon 为 SVG 图标（单色汉堡/折叠图标），无需切换文本
}

// ============================================================
// 页面渲染入口
// ============================================================
function renderPage(page) {
  const container = document.getElementById('pageContainer');
  
  switch (page) {
    case 'rules-config':
      container.innerHTML = renderRulesConfigPage();
      initRulesConfigPage();
      break;
    case 'data-collection':
      container.innerHTML = renderDataCollectionPage();
      initDataCollectionPage();
      break;
    case 'score-ledger':
      container.innerHTML = renderScoreLedgerPage();
      initScoreLedgerPage();
      break;
    case 'appeal-approval':
      container.innerHTML = renderAppealApprovalPage();
      initAppealApprovalPage();
      break;
  }
}

// ============================================================
// 页面1: 考核规则配置
// ============================================================
function renderRulesConfigPage() {
  return `
    <div class="dsc-page-header">
      <h1 class="dsc-page-header__title">考核规则配置</h1>
      <div class="dsc-page-header__actions">
        <button class="dsc-btn dsc-btn--primary" onclick="openRuleModal()">+ 新增考核规则</button>
        <button class="dsc-btn dsc-btn--default">导出配置</button>
      </div>
    </div>

    <!-- 业态管理 -->
    <div class="dsc-card" id="businessTypeCard">
      <div class="dsc-card__header">
        <span class="dsc-card__title">业态管理</span>
        <button class="dsc-btn dsc-btn--primary dsc-btn--sm" onclick="openBusinessTypeModal()">+ 新增业态</button>
      </div>
      <div class="dsc-card__body--no-padding">
        <div class="dsc-table-wrapper">
          <table class="dsc-table">
            <thead>
              <tr>
                <th>序号</th><th>业态名称</th><th>业态编码</th><th>关联单位数</th><th>状态</th><th>说明</th><th>操作</th>
              </tr>
            </thead>
            <tbody id="businessTypeTable">
              ${BUSINESS_TYPES.map((bt, idx) => `
                <tr>
                  <td>${bt.id}</td>
                  <td><strong>${bt.name}</strong></td>
                  <td>${bt.code}</td>
                  <td class="dsc-table__num">${bt.units}</td>
                  <td><span class="dsc-tag ${bt.status === 'active' ? 'dsc-tag--success' : 'dsc-tag--default'}">${bt.status === 'active' ? '启用' : '停用'}</span></td>
                  <td>${bt.desc}</td>
                  <td class="dsc-table__actions">
                    <button class="dsc-btn dsc-btn--text dsc-btn--sm" onclick="openEditBusinessTypeModal(${bt.id})">编辑</button>
                    ${bt.status === 'active' ? `<button class="dsc-btn dsc-btn--text dsc-btn--sm dsc-text-danger" onclick="toggleBusinessType(${bt.id})">停用</button>` : `<button class="dsc-btn dsc-btn--text dsc-btn--sm dsc-text-success" onclick="toggleBusinessType(${bt.id})">启用</button>`}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Tabs: 指标库 / 计分模板配置 -->
    <div class="dsc-card">
      <div class="dsc-card__header" style="border-bottom:none;padding-bottom:0;">
        <div class="dsc-tabs" id="ruleTabs">
          <div class="dsc-tabs__item dsc-tabs__item--active" data-tab="indicators">指标库管理（三业态33项）</div>
          <div class="dsc-tabs__item" data-tab="platform-rules">平台应用考核规则</div>
          <div class="dsc-tabs__item" data-tab="templates">计分模板配置</div>
        </div>
      </div>
      <div class="dsc-card__body">
        <!-- 指标库管理 -->
        <div id="tab-indicators" class="tab-content">
          <div class="dsc-alert dsc-alert--info" style="margin-bottom:var(--space-md);">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" style="vertical-align:-2px;margin-right:4px;"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.2"/></svg>三业态独立考核标准表（2026年7月修订版）：${BIZ_TOTALS.map(b => `<strong>${b.biz}</strong>&nbsp;${b.count}项 / 总分${b.total}分`).join('<span style="margin:0 12px;color:var(--color-border);">|</span>')}<span style="margin-left:12px;">类别分值合计已校验</span>
          </div>
          <div class="dsc-filter-bar" style="box-shadow:none;padding:0 0 var(--space-lg) 0;">
            <div class="dsc-filter-bar__item">
              <span class="dsc-filter-bar__label">适用业态：</span>
              <select class="dsc-select" id="filterBusiness">
                <option value="">全部</option>
                <option>主业</option><option>海外</option><option>投资</option>
              </select>
            </div>
            <div class="dsc-filter-bar__item">
              <span class="dsc-filter-bar__label">考核类别：</span>
              <select class="dsc-select" id="filterCategory">
                <option value="">全部</option>
                <option>目标引领</option><option>平台应用</option><option>数据治理</option><option>验收合规性</option><option>资源管理</option><option>合规管理</option><option>重点工作</option>
              </select>
            </div>
            <div class="dsc-filter-bar__item">
              <span class="dsc-filter-bar__label">考核周期：</span>
              <select class="dsc-select" id="filterPeriod">
                <option value="">全部</option><option>每月</option><option>仅6月、12月</option><option>仅3、6、9、12月</option><option>按季</option><option>按年</option>
              </select>
            </div>
            <button class="dsc-btn dsc-btn--primary dsc-btn--sm" onclick="applyIndicatorFilters()">查询</button>
            <button class="dsc-btn dsc-btn--default dsc-btn--sm" onclick="resetIndicatorFilters()">重置</button>
          </div>
          <div class="dsc-table-wrapper">
            <table class="dsc-table">
              <thead>
                <tr>
                  <th>序号</th><th>考核类别</th><th>考核指标名称</th><th>适用业态</th><th>证明资料</th><th>考核周期</th><th>分值</th><th>扣分判定规则简述</th><th>取数平台</th><th>操作</th>
                </tr>
              </thead>
              <tbody>
                ${ASSESSMENT_RULES.map((r, idx) => `
                  <tr>
                    <td>${idx+1}</td>
                    <td><span class="dsc-tag ${r.category==='目标引领'?'dsc-tag--info':r.category==='合规管理'?'dsc-tag--danger':r.category==='重点工作'?'dsc-tag--success':r.category==='数据治理'||r.category==='验收合规性'?'dsc-tag--warning':'dsc-tag--default'}">${r.category}</span></td>
                    <td><strong>${r.name}</strong></td>
                    <td>${r.applicable}</td>
                    <td><span class="dsc-tag ${r.proof==='平台提取'?'dsc-tag--info':r.proof==='检查'?'dsc-tag--warning':'dsc-tag--success'}">${r.proof}</span></td>
                    <td class="dsc-font-sm">${r.period}</td>
                    <td class="dsc-table__num"><span class="dsc-score__value" style="font-size:18px;">${r.score}</span></td>
                    <td style="max-width:200px;">${r.rule}</td>
                    <td class="dsc-font-sm">${r.source}</td>
                    <td class="dsc-table__actions">
                      <button class="dsc-btn dsc-btn--text dsc-btn--sm" onclick="openEditRuleModal(${r.id})">编辑</button>
                      <button class="dsc-btn dsc-btn--text dsc-btn--sm" onclick="openParamModal(${r.id})">参数设置</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="dsc-pagination">
            <span>共 ${ASSESSMENT_RULES.length} 条</span>
            <button class="dsc-pagination__btn dsc-pagination__btn--active">1</button>
            <span>条/页</span>
          </div>
        </div>
        <!-- 平台应用考核规则 -->
        <div id="tab-platform-rules" class="tab-content" style="display:none;">
          <div class="dsc-alert dsc-alert--info">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" style="vertical-align:-2px;margin-right:4px;"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.2"/></svg>平台应用考核子表项（2026年7月修订版，13项，100分制），得分×0.06折算计入主业"数字供应链平台应用"（6分）。较6月前版本移出"采购成本降低率异常数据""物资设备采购效益异常数据"两项，并入整体考核"数据治理"指标。
          </div>
          <div class="dsc-table-wrapper">
            <table class="dsc-table">
              <thead>
                <tr>
                  <th>序号</th><th>考核维度</th><th>考核信息化平台</th><th>考核模块</th><th>平台功能模块</th><th>考核指标</th><th>考核规则</th><th>分数</th><th>备注</th>
                </tr>
              </thead>
              <tbody>
                ${PLATFORM_RULES.map(r => `
                  <tr>
                    <td>${r.id}</td>
                    <td><span class="dsc-tag dsc-tag--info">${r.dimension}</span></td>
                    <td>${r.platform}</td>
                    <td>${r.module}</td>
                    <td>${r.funcModule}</td>
                    <td><strong>${r.indicator}</strong></td>
                    <td style="max-width:320px;font-size:12px;">${r.rule.length > 100 ? r.rule.substring(0,100)+'...' : r.rule}</td>
                    <td class="dsc-table__num"><strong>${r.score}</strong></td>
                    <td class="dsc-font-sm dsc-text-tertiary">${r.note || ''}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="dsc-pagination">
            <span>共 ${PLATFORM_RULES.length} 条</span>
            <button class="dsc-pagination__btn dsc-pagination__btn--active">1</button>
          </div>
        </div>
        <!-- 计分模板配置 -->
        <div id="tab-templates" class="tab-content" style="display:none;">
          ${renderScoringTemplateForm()}
        </div>
      </div>
    </div>
  `;
}

function renderScoringTemplateForm() {
  const months = [1,2,3,4,5,6,7,8,9,10,11,12];
  const matrix = [
    { biz: '主业', values: [66,66,77,66,66,84,66,66,77,66,66,84], total: 84, note: '3/9月77分（含分包工程集中采购率7、资源库优化4）；6/12月84分（另含云筑网履约额7）' },
    { biz: '海外', values: [70,70,90,70,70,90,70,70,90,70,70,100], total: 100, note: '3/6/9月90分（含按季采购成本降低率20）；12月100分（另含按年资源白名单10）' },
    { biz: '投资', values: [60,60,90,60,60,90,60,60,90,60,60,100], total: 100, note: '3/6/9月90分（含采购成本降低率10、挂图计划20）；12月100分（另含按年资源白名单10）' },
  ];
  const monthCell = (v, i) => {
    const hl = (i === 6) ? 'background:var(--color-primary-light);font-weight:700;' : (i === 2 || i === 5 || i === 8 || i === 11) ? 'background:#F6FFED;' : '';
    return `<td class="dsc-table__num" style="${hl}">${v}</td>`;
  };
  return `
    <div class="dsc-card" style="box-shadow:none;border:1px solid var(--color-border);">
      <div class="dsc-card__header">
        <span class="dsc-card__title" style="font-size:16px;">① 离散型扣减算法模板</span>
        <span class="dsc-tag dsc-tag--info">适用：验收合规性、事件驱动类指标</span>
      </div>
      <div class="dsc-card__body">
        <div class="dsc-form-row dsc-form-row--4">
          <div class="dsc-form-group">
            <label class="dsc-form-label">满分基数 S_base</label>
            <input class="dsc-input" type="number" value="4" />
          </div>
          <div class="dsc-form-group">
            <label class="dsc-form-label">单次扣分步长 d</label>
            <input class="dsc-input" type="number" value="1" step="0.1" />
          </div>
          <div class="dsc-form-group">
            <label class="dsc-form-label">扣分上限</label>
            <input class="dsc-input" type="number" value="4" />
          </div>
          <div class="dsc-form-group">
            <label class="dsc-form-label">公式预览</label>
            <div class="dsc-input" style="background:#F5F5F5;color:var(--color-text-tertiary);display:flex;align-items:center;">得分 = MAX(S_base - n×d, 0)</div>
          </div>
        </div>
      </div>
    </div>
    <div class="dsc-card" style="box-shadow:none;border:1px solid var(--color-border);">
      <div class="dsc-card__header">
        <span class="dsc-card__title" style="font-size:16px;">② 连续偏离度扣减算法模板</span>
        <span class="dsc-tag dsc-tag--info">适用：计划执行率、采购时长等</span>
      </div>
      <div class="dsc-card__body">
        <div class="dsc-form-row dsc-form-row--4">
          <div class="dsc-form-group">
            <label class="dsc-form-label">满分基数 S_base</label>
            <input class="dsc-input" type="number" value="6" />
          </div>
          <div class="dsc-form-group">
            <label class="dsc-form-label">达标阈值 T</label>
            <input class="dsc-input" type="text" value="3.2%" />
          </div>
          <div class="dsc-form-group">
            <label class="dsc-form-label">偏离惩罚系数 α</label>
            <input class="dsc-input" type="text" value="0.1%" />
          </div>
          <div class="dsc-form-group">
            <label class="dsc-form-label">公式预览</label>
            <div class="dsc-input" style="background:#F5F5F5;color:var(--color-text-tertiary);display:flex;align-items:center;font-size:12px;">IF(A>=T,S_base,MAX(0,S_base-(T-A)/α))</div>
          </div>
        </div>
      </div>
    </div>
    <div class="dsc-card" style="box-shadow:none;border:1px solid var(--color-border);">
      <div class="dsc-card__header">
        <span class="dsc-card__title" style="font-size:16px;">③ 排名梯度扣减算法模板</span>
        <span class="dsc-tag dsc-tag--info">适用：数据治理</span>
      </div>
      <div class="dsc-card__body">
        <div class="dsc-form-row dsc-form-row--4">
          <div class="dsc-form-group">
            <label class="dsc-form-label">排名依据</label>
            <input class="dsc-input" type="text" value="异常结算单占比" />
          </div>
          <div class="dsc-form-group">
            <label class="dsc-form-label">每名次扣分值 d</label>
            <input class="dsc-input" type="number" value="0.1" step="0.1" />
          </div>
          <div class="dsc-form-group">
            <label class="dsc-form-label">得分下限</label>
            <input class="dsc-input" type="number" value="0" />
          </div>
          <div class="dsc-form-group">
            <label class="dsc-form-label">公式预览</label>
            <div class="dsc-input" style="background:#F5F5F5;color:var(--color-text-tertiary);display:flex;align-items:center;font-size:12px;">按异常占比排名，依次扣 d 分</div>
          </div>
        </div>
      </div>
    </div>
    <div class="dsc-card" style="box-shadow:none;border:1px solid var(--color-border);">
      <div class="dsc-card__header">
        <span class="dsc-card__title" style="font-size:16px;">④ 封顶与上不封顶扣减模板</span>
        <span class="dsc-tag dsc-tag--info">适用：合规管理、平台子表、整体清零</span>
      </div>
      <div class="dsc-card__body">
        <div class="dsc-form-row dsc-form-row--4">
          <div class="dsc-form-group">
            <label class="dsc-form-label">扣分上限类型</label>
            <select class="dsc-select" style="width:100%;"><option>累计扣分封顶（子表上限10分）</option><option>上不封顶（扣至0分为止）</option><option>整体清零（一票否决）</option></select>
          </div>
          <div class="dsc-form-group">
            <label class="dsc-form-label">单次扣分步长 d</label>
            <input class="dsc-input" type="number" value="0.5" step="0.1" />
          </div>
          <div class="dsc-form-group">
            <label class="dsc-form-label">得分下限</label>
            <input class="dsc-input" type="number" value="0" />
          </div>
          <div class="dsc-form-group">
            <label class="dsc-form-label">说明</label>
            <div class="dsc-input" style="background:#F5F5F5;color:var(--color-text-tertiary);display:flex;align-items:center;font-size:12px;">扣分笔数不设上限，得分以0分为下限不出现负分</div>
          </div>
        </div>
      </div>
    </div>
    <div class="dsc-card" style="box-shadow:none;border:1px solid var(--color-border);">
      <div class="dsc-card__header">
        <span class="dsc-card__title" style="font-size:16px;">⑤ 动态满分生成器 · 月度动态满分对照表</span>
        <span class="dsc-tag dsc-tag--info">满分(j, M) = Σᵢ δᵢ(M) × Wᵢⱼ</span>
      </div>
      <div class="dsc-card__body">
        <div class="dsc-alert dsc-alert--info">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" style="vertical-align:-2px;margin-right:4px;"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.2"/></svg>月度满分 = 当月生效指标分值之和（非生效指标不计入当月满分）。<strong>新标准自2026年7月起适用</strong>（蓝色列）；资源白名单<strong>年末考核</strong>（12月一次性计分并计入当月满分）。绿色列为季度考核月（3/6/9/12月）。
        </div>
        <div class="dsc-table-wrapper">
          <table class="dsc-table">
            <thead><tr><th>业态</th>${months.map(m => `<th class="dsc-table__num">${m}月</th>`).join('')}<th class="dsc-table__num">业态总分</th></tr></thead>
            <tbody>
              ${matrix.map(r => `
                <tr>
                  <td><strong>${r.biz}</strong></td>
                  ${r.values.map(monthCell).join('')}
                  <td class="dsc-table__num"><strong>${r.total}</strong></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="dsc-font-sm dsc-text-tertiary" style="margin-top:var(--space-md);line-height:1.8;">
          ${matrix.map(r => `· <strong>${r.biz}</strong>：${r.note}`).join('<br>')}
          <br>· 条款级周期例外（不影响指标满分，仅影响扣分时点）：资源管理（5）分供商评价完成率——每年1月、7月考核；竣工项目资产周转率——延后2个月考核；合规管理（4）专项治理上报——每月15日为截止日。
        </div>
      </div>
    </div>
    <div class="dsc-card" style="box-shadow:none;border:1px solid var(--color-border);">
      <div class="dsc-card__header">
        <span class="dsc-card__title" style="font-size:16px;">⑥ 单位差异化阈值配置</span>
        <span class="dsc-tag dsc-tag--success">验收标准 A2：按单位取值</span>
      </div>
      <div class="dsc-card__body">
        ${UNIT_THRESHOLDS.map(g => `
          <div style="margin-bottom:var(--space-xl);">
            <div class="dsc-flex dsc-flex--between" style="align-items:center;margin-bottom:var(--space-sm);">
              <span style="font-weight:600;">${g.indicator} <span class="dsc-font-sm dsc-text-tertiary" style="font-weight:400;">（${g.period} · ${g.score}）</span></span>
              <button class="dsc-btn dsc-btn--primary dsc-btn--sm" onclick="openThresholdModal('${g.indicator}')">+ 新增阈值</button>
            </div>
            <table class="dsc-table">
              <thead><tr><th>序号</th><th>二级单位</th><th>目标值</th><th>说明</th><th>操作</th></tr></thead>
              <tbody>
                ${g.rows.map((r, i) => `
                  <tr>
                    <td>${i + 1}</td>
                    <td><strong>${r.unit}</strong></td>
                    <td class="dsc-table__num"><strong style="color:var(--color-primary)">${r.value}</strong></td>
                    <td class="dsc-font-sm">${r.note}</td>
                    <td class="dsc-table__actions">
                      <button class="dsc-btn dsc-btn--text dsc-btn--sm" onclick="openThresholdModal('${g.indicator}')">编辑</button>
                      <button class="dsc-btn dsc-btn--text dsc-btn--sm dsc-text-danger">删除</button>
                    </td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        `).join('')}
        <div class="dsc-font-sm dsc-text-tertiary">跑批时按「指标 × 业态 × 二级单位」三元组取值；未配置差异化阈值的单位采用默认目标值。</div>
      </div>
    </div>
    <div class="dsc-flex dsc-flex--center" style="gap:var(--space-md);margin-top:var(--space-lg);">
      <button class="dsc-btn dsc-btn--primary">保存配置</button>
      <button class="dsc-btn dsc-btn--default">重置</button>
    </div>
  `;
}

function openThresholdModal(indicator) {
  const unitOptions = [...SECONDARY_UNITS, '装饰公司', '新型建造公司', '文旅公司'].map(u => `<option>${u}</option>`).join('');
  const html = `
    <div class="dsc-alert dsc-alert--info"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" style="vertical-align:-2px;margin-right:4px;"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.2"/></svg>为「${indicator}」配置单位差异化目标值，跑批时按「指标 × 业态 × 二级单位」三元组取值。</div>
    <div class="dsc-form-row dsc-form-row--2">
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">二级单位</label>
        <select class="dsc-select" style="width:100%;">${unitOptions}</select>
      </div>
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">目标值</label>
        <input class="dsc-input" type="text" placeholder="如 25%、54%" />
      </div>
    </div>
    <div class="dsc-form-group dsc-mb-lg">
      <label class="dsc-form-label">说明</label>
      <input class="dsc-input" type="text" placeholder="如：差异化目标值" />
    </div>
  `;
  openModal(`新增差异化阈值 - ${indicator}`, html, true);
  document.getElementById('modalConfirm').onclick = function() {
    closeModal();
    showToast(`「${indicator}」差异化阈值已保存，跑批将按单位取值`, 'success');
  };
}

// 指标库组合筛选（业态 + 类别 + 周期）
function applyIndicatorFilters() {
  const biz = (document.getElementById('filterBusiness') || {}).value || '';
  const cat = (document.getElementById('filterCategory') || {}).value || '';
  const period = (document.getElementById('filterPeriod') || {}).value || '';
  document.querySelectorAll('#tab-indicators tbody tr').forEach(row => {
    const tds = row.querySelectorAll('td');
    if (tds.length < 5) return;
    const bizText = tds[3].textContent;
    const catText = tds[1].textContent;
    const periodText = tds[5].textContent;
    const matchBiz = !biz || bizText.includes(biz);
    const matchCat = !cat || catText === cat;
    const matchPeriod = !period || periodText.includes(period);
    row.style.display = (matchBiz && matchCat && matchPeriod) ? '' : 'none';
  });
}

function resetIndicatorFilters() {
  ['filterBusiness', 'filterCategory', 'filterPeriod'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  applyIndicatorFilters();
}

function initRulesConfigPage() {
  // Tab 切换
  document.querySelectorAll('#ruleTabs .dsc-tabs__item').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('#ruleTabs .dsc-tabs__item').forEach(t => t.classList.remove('dsc-tabs__item--active'));
      this.classList.add('dsc-tabs__item--active');
      const target = this.dataset.tab;
      document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
      document.getElementById('tab-' + target).style.display = 'block';
    });
  });

  // 三维组合筛选（业态 / 类别 / 周期）
  ['filterBusiness', 'filterCategory', 'filterPeriod'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', applyIndicatorFilters);
  });
}

// ============================================================
// 页面2: 数据采集与预处理
// ============================================================
const COLLECT_TAB_GROUPS = [
  { key: 'main', label: '主业考核指标', list: DATA_COLLECTION_TASKS },
  { key: 'overseas', label: '海外考核指标', list: OVERSEAS_COLLECTION_TASKS },
  { key: 'invest', label: '投资考核指标', list: INVEST_COLLECTION_TASKS },
  { key: 'platform', label: '平台应用子表', list: PLATFORM_COLLECTION_TASKS },
];
const COLLECT_TYPE_LABEL = { main: '主业考核指标', overseas: '海外考核指标', invest: '投资考核指标', platform: '平台应用考核子表项' };

function collectTaskRow(t, type) {
  const statusTag = t.status === 'success' ? 'dsc-tag--success' : t.status === 'warning' ? 'dsc-tag--warning' : 'dsc-tag--default';
  const statusText = t.status === 'success' ? '成功' : t.status === 'warning' ? '异常' : t.status === 'pending' ? '待执行' : '失败';
  const detailBtn = `<button class="dsc-btn dsc-btn--text dsc-btn--sm" onclick="openCollectDetail(${t.id}, '${type}')">查看详情</button>`;
  const actionBtn = t.status === 'pending'
    ? `<button class="dsc-btn dsc-btn--text dsc-btn--sm dsc-text-primary" onclick="runCollectTask(${t.id}, '${type}')">立即执行</button>`
    : `<button class="dsc-btn dsc-btn--text dsc-btn--sm" onclick="runCollectTask(${t.id}, '${type}')">重新抓取</button>`;
  return `
    <tr>
      <td>${t.id}</td>
      <td><strong>${t.indicator}</strong></td>
      <td>${t.source}</td>
      <td>${t.method}</td>
      <td>${t.schedule}</td>
      <td><span class="dsc-tag ${statusTag}">${statusText}</span></td>
      <td class="dsc-font-sm">${t.lastRun}</td>
      <td class="dsc-table__num">${t.records.toLocaleString()}</td>
      <td class="dsc-table__num">${t.exception > 0 ? `<span class="dsc-text-warning dsc-font-bold">${t.exception}</span>` : '0'}</td>
      <td class="dsc-table__actions">${detailBtn}${actionBtn}</td>
    </tr>`;
}

function renderDataCollectionPage() {
  const activeTab = AppState.collectTab || 'main';
  const autoTotal = COLLECT_TAB_GROUPS.reduce((n, g) => n + g.list.length, 0);
  const autoOk = COLLECT_TAB_GROUPS.reduce((n, g) => n + g.list.filter(t => t.status !== 'pending').length, 0);
  const overdueCnt = REPORTING_TASKS.filter(t => t.status === 'overdue').length;

  return `
    <div class="dsc-page-header">
      <h1 class="dsc-page-header__title">数据采集与预处理</h1>
      <div class="dsc-page-header__actions">
        <button class="dsc-btn dsc-btn--primary" onclick="triggerManualCollect()">+ 手动触发采集</button>
        <button class="dsc-btn dsc-btn--default" onclick="openImportModal()"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><path d="M8 1.5V11M4.5 7.5L8 11l3.5-3.5"/><path d="M2 13.5h12"/></svg>Excel模板导入</button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="dsc-stat-row">
      <div class="dsc-stat-card">
        <div class="dsc-stat-card__label">考核指标采集任务</div>
        <div class="dsc-stat-card__value">${autoTotal}</div>
        <div class="dsc-stat-card__footer">主业16 / 海外8 / 投资9 / 平台应用子表13</div>
      </div>
      <div class="dsc-stat-card">
        <div class="dsc-stat-card__label">报送管理任务</div>
        <div class="dsc-stat-card__value dsc-stat-card__value--primary">${REPORTING_TASKS.length}</div>
        <div class="dsc-stat-card__footer">逾期 ${overdueCnt} 项已自动标记「不报送晚报送不得分」</div>
      </div>
      <div class="dsc-stat-card">
        <div class="dsc-stat-card__label">自动采集成功率</div>
        <div class="dsc-stat-card__value dsc-stat-card__value--success">95.8%</div>
        <div class="dsc-stat-card__footer">${autoOk}/${autoTotal} 自动任务正常</div>
      </div>
      <div class="dsc-stat-card">
        <div class="dsc-stat-card__label">异常数据记录</div>
        <div class="dsc-stat-card__value dsc-stat-card__value--warning">${EXCEPTION_RECORDS.length}</div>
        <div class="dsc-stat-card__footer">待处理 ${EXCEPTION_RECORDS.filter(e=>e.status==='pending').length} 条</div>
      </div>
    </div>

    <!-- 三业态 + 平台子表 采集任务监控 -->
    <div class="dsc-card">
      <div class="dsc-card__header">
        <span class="dsc-card__title">考核指标采集任务监控</span>
        <div class="dsc-flex dsc-gap-sm">
          <select class="dsc-select" id="collectStatusFilter" style="width:120px;"><option value="">全部状态</option><option>成功</option><option>异常</option><option>待执行</option></select>
          <button class="dsc-btn dsc-btn--default dsc-btn--sm">刷新</button>
        </div>
      </div>
      <div class="dsc-card__body">
        <div class="dsc-tabs" id="collectTabs" style="margin-bottom:var(--space-md);">
          ${COLLECT_TAB_GROUPS.map(g => `<div class="dsc-tabs__item ${activeTab === g.key ? 'dsc-tabs__item--active' : ''}" data-tab="${g.key}">${g.label}（${g.list.length}项）</div>`).join('')}
        </div>
        ${COLLECT_TAB_GROUPS.map(g => `
          <div id="collectTab-${g.key}" style="${activeTab === g.key ? '' : 'display:none;'}">
            ${g.key === 'overseas' ? '<div class="dsc-alert dsc-alert--info" style="margin-bottom:var(--space-md);">ⓘ 目前所有海外项目数据实际均为<strong>报送或检查</strong>，取数平台暂标注"—"；海外报表功能上线后部分报送数据可实现平台提取。</div>' : ''}
            <div class="dsc-table-wrapper">
              <table class="dsc-table">
                <thead>
                  <tr><th>序号</th><th>考核指标名称</th><th>数据来源</th><th>采集方式</th><th>定时计划</th><th>状态</th><th>最近执行时间</th><th>采集记录数</th><th>异常数</th><th>操作</th></tr>
                </thead>
                <tbody>${g.list.map(t => collectTaskRow(t, g.key)).join('')}</tbody>
              </table>
            </div>
            <div class="dsc-pagination"><span>共 ${g.list.length} 条</span><button class="dsc-pagination__btn dsc-pagination__btn--active">1</button></div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- 报送管理 -->
    <div class="dsc-card">
      <div class="dsc-card__header">
        <span class="dsc-card__title">报送管理（截止日提醒与逾期标记）</span>
        <div class="dsc-flex dsc-gap-sm">
          <select class="dsc-select" id="reportStatusFilter" style="width:130px;"><option value="">全部状态</option><option>按时报送</option><option>逾期</option><option>待报送</option></select>
          <button class="dsc-btn dsc-btn--default dsc-btn--sm">批量催报</button>
        </div>
      </div>
      <div class="dsc-card__body--no-padding">
        <div class="dsc-table-wrapper">
          <table class="dsc-table">
            <thead>
              <tr><th>序号</th><th>报送事项</th><th>报送单位</th><th>业态</th><th>报送内容</th><th>报送截止</th><th>实际报送</th><th>状态</th><th>逾期标记</th><th>操作</th></tr>
            </thead>
            <tbody id="reportingTable">
              ${REPORTING_TASKS.map(t => {
                const sTag = t.status === 'ontime' ? 'dsc-tag--success' : t.status === 'overdue' ? 'dsc-tag--danger' : 'dsc-tag--info';
                const sText = t.status === 'ontime' ? '按时报送' : t.status === 'overdue' ? '逾期' : '待报送';
                return `
                  <tr>
                    <td>${t.id}</td>
                    <td><strong>${t.item}</strong></td>
                    <td>${t.unit}</td>
                    <td><span class="dsc-tag ${SCORE_BOARD_BIZ_TAG[t.biz] || 'dsc-tag--default'}">${t.biz}</span></td>
                    <td class="dsc-font-sm">${t.content}</td>
                    <td class="dsc-font-sm">${t.deadline}</td>
                    <td class="dsc-font-sm">${t.submitTime}</td>
                    <td><span class="dsc-tag ${sTag}">${sText}</span></td>
                    <td>${t.note ? `<span class="dsc-tag dsc-tag--danger dsc-tag--sm">${t.note}</span>` : '—'}</td>
                    <td class="dsc-table__actions">
                      ${t.status !== 'ontime' ? `<button class="dsc-btn dsc-btn--text dsc-btn--sm dsc-text-primary" onclick="remindReport(${t.id})">催报</button>` : ''}
                      <button class="dsc-btn dsc-btn--text dsc-btn--sm" onclick="viewReportDetail(${t.id})">查看</button>
                    </td>
                  </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
        <div class="dsc-pagination"><span>共 ${REPORTING_TASKS.length} 条</span><button class="dsc-pagination__btn dsc-pagination__btn--active">1</button></div>
      </div>
    </div>

    <!-- 查验评分 -->
    <div class="dsc-card">
      <div class="dsc-card__header">
        <span class="dsc-card__title">查验评分（投资月度重点工作挂图计划 · 局供应链管理部）</span>
        <button class="dsc-btn dsc-btn--primary dsc-btn--sm" onclick="openInspectionModal()">+ 录入查验评分</button>
      </div>
      <div class="dsc-card__body--no-padding">
        <div class="dsc-table-wrapper">
          <table class="dsc-table">
            <thead>
              <tr><th>编号</th><th>被查验单位</th><th>季度</th><th>查验方式</th><th>查验评分</th><th>评分依据</th><th>查验人</th><th>查验时间</th><th>阶段</th><th>操作</th></tr>
            </thead>
            <tbody>
              ${INSPECTION_RECORDS.map(r => `
                <tr>
                  <td>${r.id}</td>
                  <td><strong>${r.unit}</strong></td>
                  <td>${r.quarter}</td>
                  <td>${r.method}</td>
                  <td class="dsc-table__num"><strong style="color:${r.score >= r.full * 0.9 ? 'var(--color-success)' : 'var(--color-warning)'}">${r.score}</strong> / ${r.full}分</td>
                  <td style="max-width:300px;font-size:12px;">${r.basis}</td>
                  <td>${r.inspector}</td>
                  <td class="dsc-font-sm">${r.time}</td>
                  <td><span class="dsc-tag dsc-tag--info">${r.stage}</span></td>
                  <td class="dsc-table__actions"><button class="dsc-btn dsc-btn--text dsc-btn--sm" onclick="viewInspectionDetail('${r.id}')">查看依据</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="dsc-pagination"><span>共 ${INSPECTION_RECORDS.length} 条</span><button class="dsc-pagination__btn dsc-pagination__btn--active">1</button></div>
      </div>
    </div>

    <!-- 异常数据拦截 -->
    <div class="dsc-card">
      <div class="dsc-card__header">
        <span class="dsc-card__title">异常数据拦截队列 <span class="dsc-tag dsc-tag--warning" style="margin-left:8px;">${EXCEPTION_RECORDS.filter(e=>e.status==='pending').length}条待处理</span></span>
        <button class="dsc-btn dsc-btn--default dsc-btn--sm">批量标记处理</button>
      </div>
      <div class="dsc-card__body--no-padding">
        <div class="dsc-table-wrapper">
          <table class="dsc-table">
            <thead>
              <tr>
                <th>编号</th><th>所属单位</th><th>关联指标</th><th>异常类型</th><th>涉及项目</th><th>异常值</th><th>描述</th><th>发现时间</th><th>状态</th><th>处理人</th><th>操作</th>
              </tr>
            </thead>
            <tbody>
              ${EXCEPTION_RECORDS.map(e => {
                const sTag = e.status === 'pending' ? 'dsc-tag--warning' : e.status === 'processing' ? 'dsc-tag--info' : 'dsc-tag--success';
                const sText = e.status === 'pending' ? '待处理' : e.status === 'processing' ? '处理中' : '已解决';
                return `
                  <tr>
                    <td>EX-${e.id}</td>
                    <td>${e.unit}</td>
                    <td>${e.indicator}</td>
                    <td><span class="dsc-tag dsc-tag--danger dsc-tag--sm">${e.type}</span></td>
                    <td>${e.project}</td>
                    <td class="dsc-table__num dsc-text-danger">${e.value}</td>
                    <td>${e.desc}</td>
                    <td class="dsc-font-sm">${e.time}</td>
                    <td><span class="dsc-tag ${sTag}">${sText}</span></td>
                    <td>${e.handler || '—'}</td>
                    <td class="dsc-table__actions">
                      <button class="dsc-btn dsc-btn--text dsc-btn--sm">处理</button>
                      <button class="dsc-btn dsc-btn--text dsc-btn--sm">忽略</button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function initDataCollectionPage() {
  // 采集任务业态Tab切换
  document.querySelectorAll('#collectTabs .dsc-tabs__item').forEach(tab => {
    tab.addEventListener('click', function() {
      switchCollectTab(this.dataset.tab);
    });
  });
  // 采集任务状态筛选（作用于当前Tab）
  const cf = document.getElementById('collectStatusFilter');
  if (cf) cf.addEventListener('change', function() { applyCollectStatusFilter(this.value); });
  // 报送管理状态筛选
  const rf = document.getElementById('reportStatusFilter');
  if (rf) rf.addEventListener('change', function() {
    const val = this.value;
    document.querySelectorAll('#reportingTable tr').forEach(row => {
      if (!val || val === '全部状态') { row.style.display = ''; return; }
      const tags = row.querySelectorAll('.dsc-tag');
      const statusTag = tags[1];
      row.style.display = statusTag && statusTag.textContent === val ? '' : 'none';
    });
  });
}

function switchCollectTab(key) {
  AppState.collectTab = key;
  document.querySelectorAll('#collectTabs .dsc-tabs__item').forEach(t => t.classList.remove('dsc-tabs__item--active'));
  const tabEl = document.querySelector('#collectTabs .dsc-tabs__item[data-tab="' + key + '"]');
  if (tabEl) tabEl.classList.add('dsc-tabs__item--active');
  document.querySelectorAll('[id^="collectTab-"]').forEach(c => c.style.display = 'none');
  const panel = document.getElementById('collectTab-' + key);
  if (panel) panel.style.display = 'block';
}

function applyCollectStatusFilter(val) {
  const activeTab = AppState.collectTab || 'main';
  const table = document.querySelector('#collectTab-' + activeTab + ' tbody');
  if (!table) return;
  Array.from(table.rows).forEach(row => {
    if (!val || val === '全部状态') { row.style.display = ''; return; }
    const tag = row.querySelector('.dsc-tag');
    row.style.display = tag && tag.textContent === val ? '' : 'none';
  });
}

function remindReport(id) {
  const t = REPORTING_TASKS.find(x => x.id === Number(id));
  if (!t) return;
  showToast(`已向「${t.unit}」发送「${t.item}」催报提醒`, 'success');
}

function viewReportDetail(id) {
  const t = REPORTING_TASKS.find(x => x.id === Number(id));
  if (!t) return;
  const html = `
    <table class="dsc-table" style="margin-bottom:16px;">
      <tbody>
        <tr><td style="width:140px;background:var(--color-bg-table-header);font-weight:500;">报送事项</td><td><strong>${t.item}</strong></td></tr>
        <tr><td style="background:var(--color-bg-table-header);font-weight:500;">报送单位</td><td>${t.unit}（${t.biz}）</td></tr>
        <tr><td style="background:var(--color-bg-table-header);font-weight:500;">报送内容</td><td>${t.content}</td></tr>
        <tr><td style="background:var(--color-bg-table-header);font-weight:500;">报送截止</td><td>${t.deadline}</td></tr>
        <tr><td style="background:var(--color-bg-table-header);font-weight:500;">实际报送</td><td>${t.submitTime}</td></tr>
        ${t.note ? `<tr><td style="background:var(--color-bg-table-header);font-weight:500;">逾期标记</td><td><span class="dsc-tag dsc-tag--danger">${t.note}</span></td></tr>` : ''}
      </tbody>
    </table>
  `;
  openModal(`报送任务详情 - ${t.item}`, html, false);
}

function openInspectionModal() {
  const html = `
    <div class="dsc-form-row dsc-form-row--2">
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">被查验单位</label>
        <select class="dsc-select" style="width:100%;">${INVEST_UNITS.map(u => `<option>${u}</option>`).join('')}</select>
      </div>
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">查验季度</label>
        <select class="dsc-select" style="width:100%;"><option>2026Q3</option><option>2026Q4</option></select>
      </div>
    </div>
    <div class="dsc-form-row dsc-form-row--2">
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">查验方式</label>
        <select class="dsc-select" style="width:100%;"><option>供应链过程检查</option><option>常态化督导检查</option><option>标杆示范项目培育</option></select>
      </div>
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">查验评分（挂图计划满分20分）</label>
        <input class="dsc-input" type="number" step="0.5" min="0" max="20" placeholder="0 - 20" />
      </div>
    </div>
    <div class="dsc-form-group dsc-mb-lg">
      <label class="dsc-form-label dsc-form-label--required">评分依据</label>
      <textarea class="dsc-textarea" placeholder="填写查验发现、评分依据，系统全程留痕"></textarea>
    </div>
    <div class="dsc-alert dsc-alert--info"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" style="vertical-align:-2px;margin-right:4px;"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.2"/></svg>查验评分将计入季度末「月度重点工作挂图计划」（20分）考核，季度内按月跟踪报送进度。</div>
  `;
  openModal('录入查验评分', html, true);
  document.getElementById('modalConfirm').onclick = function() {
    closeModal();
    showToast('查验评分已录入并留存依据，季度末计分时自动引用', 'success');
  };
}

function viewInspectionDetail(id) {
  const r = INSPECTION_RECORDS.find(x => x.id === id);
  if (!r) return;
  const html = `
    <table class="dsc-table" style="margin-bottom:16px;">
      <tbody>
        <tr><td style="width:140px;background:var(--color-bg-table-header);font-weight:500;">被查验单位</td><td><strong>${r.unit}</strong>（${r.quarter}）</td></tr>
        <tr><td style="background:var(--color-bg-table-header);font-weight:500;">查验方式</td><td>${r.method}</td></tr>
        <tr><td style="background:var(--color-bg-table-header);font-weight:500;">查验评分</td><td><strong style="color:var(--color-warning)">${r.score}</strong> / ${r.full}分</td></tr>
        <tr><td style="background:var(--color-bg-table-header);font-weight:500;">评分依据</td><td>${r.basis}</td></tr>
        <tr><td style="background:var(--color-bg-table-header);font-weight:500;">查验人</td><td>${r.inspector}（${r.time}）</td></tr>
        <tr><td style="background:var(--color-bg-table-header);font-weight:500;">计分阶段</td><td><span class="dsc-tag dsc-tag--info">${r.stage}</span></td></tr>
      </tbody>
    </table>
  `;
  openModal(`查验评分详情 - ${r.unit}`, html, false);
}

function triggerManualCollect() {
  showToast('手动采集已触发，预计3-5分钟完成', 'info');
}

function openImportModal() {
  showToast('检查录入通道（带审批流）：合规管理类扣分关联检查证明资料；验收合规性、资源管理等人工抽查判定类扣分，登记抽查记录与扣分依据后方可计分；云筑网履约额的商务确权产值已改为数字商务系统自动抓取，不再经手动补录通道', 'info');
}

// ============================================================
// 数据采集 - 查看详情 / 立即执行 弹窗交互
// ============================================================
function findCollectTask(id, type) {
  const map = {
    main: DATA_COLLECTION_TASKS,
    overseas: OVERSEAS_COLLECTION_TASKS,
    invest: INVEST_COLLECTION_TASKS,
    platform: PLATFORM_COLLECTION_TASKS,
  };
  const list = map[type] || DATA_COLLECTION_TASKS;
  return list.find(t => t.id === Number(id)) || null;
}

function openCollectDetail(id, type) {
  const t = findCollectTask(id, type);
  if (!t) { showToast('未找到该采集任务', 'warning'); return; }
  const typeLabel = COLLECT_TYPE_LABEL[type] || '考核指标';
  const statusMap = { success: '成功完成', warning: '异常待处理', pending: '待执行', failure: '失败' };
  const html = `
    <div class="dsc-alert dsc-alert--info">
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" style="vertical-align:-2px;margin-right:4px;"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.2"/></svg>采集任务详情 - ${typeLabel}
    </div>
    <table class="dsc-table" style="margin-bottom:16px;">
      <tbody>
        <tr><td style="width:140px;background:var(--color-bg-table-header);font-weight:500;">考核指标</td><td><strong>${t.indicator}</strong></td></tr>
        <tr><td style="background:var(--color-bg-table-header);font-weight:500;">数据来源</td><td>${t.source}</td></tr>
        <tr><td style="background:var(--color-bg-table-header);font-weight:500;">采集方式</td><td>${t.method}</td></tr>
        <tr><td style="background:var(--color-bg-table-header);font-weight:500;">定时计划</td><td>${t.schedule}</td></tr>
        <tr><td style="background:var(--color-bg-table-header);font-weight:500;">当前状态</td><td><span class="dsc-tag ${t.status==='success'?'dsc-tag--success':t.status==='warning'?'dsc-tag--warning':'dsc-tag--info'}">${statusMap[t.status]||t.status}</span></td></tr>
        <tr><td style="background:var(--color-bg-table-header);font-weight:500;">最近执行时间</td><td>${t.lastRun}</td></tr>
        <tr><td style="background:var(--color-bg-table-header);font-weight:500;">采集记录数</td><td class="dsc-table__num">${t.records.toLocaleString()}</td></tr>
        <tr><td style="background:var(--color-bg-table-header);font-weight:500;">异常记录数</td><td class="dsc-table__num dsc-text-warning">${t.exception}</td></tr>
        ${t.note ? `<tr><td style="background:var(--color-bg-table-header);font-weight:500;">备注</td><td class="dsc-font-sm">${t.note}</td></tr>` : ''}
      </tbody>
    </table>
  `;
  openModal(`采集任务详情 - ${t.indicator}`, html, false);
}

function runCollectTask(id, type) {
  const t = findCollectTask(id, type);
  if (!t) { showToast('未找到该采集任务', 'warning'); return; }
  const typeLabel = COLLECT_TYPE_LABEL[type] || '考核指标';
  const html = `
    <div class="dsc-alert dsc-alert--warning">
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><path d="M8 1.5L15 14H1z"/><path d="M8 6v3.2M8 11.6v.2" stroke-linecap="round"/></svg>即将立即执行采集任务，请确认以下信息：
    </div>
    <table class="dsc-table" style="margin-bottom:16px;">
      <tbody>
        <tr><td style="width:140px;background:var(--color-bg-table-header);font-weight:500;">考核指标</td><td><strong>${t.indicator}</strong></td></tr>
        <tr><td style="background:var(--color-bg-table-header);font-weight:500;">采集方式</td><td>${t.method}</td></tr>
        <tr><td style="background:var(--color-bg-table-header);font-weight:500;">定时计划</td><td>${t.schedule}</td></tr>
        <tr><td style="background:var(--color-bg-table-header);font-weight:500;">数据来源</td><td>${t.source}</td></tr>
      </tbody>
    </table>
  `;
  openModal(`立即执行采集 - ${t.indicator}`, html, true);
  document.getElementById('modalConfirm').onclick = function() {
    closeModal();
    showToast(`「${t.indicator}」采集任务已触发执行，预计3-5分钟完成`, 'success');
  };
}

// ============================================================
// 页面3: 月度自动跑批与打分台账
// ============================================================
const SCORE_BOARD_BIZ_TAG = { '主业': 'dsc-tag--info', '海外': 'dsc-tag--success', '投资': 'dsc-tag--warning' };

function scoreColorOf(rate) {
  const r = parseFloat(rate);
  return r >= 90 ? 'var(--color-success)' : r >= 85 ? 'var(--color-primary)' : 'var(--color-warning)';
}
function scoreBarClassOf(rate) {
  const r = parseFloat(rate);
  return r >= 90 ? 'dsc-progress__bar--success' : r >= 85 ? 'dsc-progress__bar--primary' : 'dsc-progress__bar--warning';
}

function renderScoreLedgerPage() {
  const month = AppState.scoreMonth || '202607';
  const biz = AppState.scoreBiz || '全局';
  const dataset = SCORE_DATASETS[month] || {};
  const bizs = Object.keys(dataset);
  const isNewStd = month === '202607';
  const monthLabel = isNewStd ? '2026年7月' : '2026年6月';

  // 全局排名（跨业态按得分率排序）
  let globalRows = [];
  bizs.forEach(b => { dataset[b].forEach(u => globalRows.push(Object.assign({ biz: b }, u))); });
  globalRows.sort((a, b) => parseFloat(b.scoreRate) - parseFloat(a.scoreRate));
  globalRows.forEach((u, i) => { u.globalRank = i + 1; });

  const isGlobalView = biz === '全局' && bizs.length > 1;
  const tabBiz = !isGlobalView && dataset[biz] ? biz : bizs[0];
  const curRows = isGlobalView ? globalRows : dataset[tabBiz];

  const boardTip = isNewStd
    ? `当月动态满分：${bizs.map(b => `${b} ${BIZ_MONTH_FULL[month][b]}分`).join(' / ')}；排名按得分率（得分 ÷ 当月该业态满分）计算`
    : '当月主业满分基准：68分（6月前旧标准，含履约额7分 + 分包集中采购率7分）；1—6月历史数据不追溯重算';

  const tabsHtml = `
    <div class="dsc-tabs" id="boardTabs" style="margin-bottom:var(--space-md);">
      ${bizs.length > 1 ? `<div class="dsc-tabs__item ${isGlobalView ? 'dsc-tabs__item--active' : ''}" data-biz="全局">全局排名（${globalRows.length}家）</div>` : ''}
      ${bizs.map(b => `<div class="dsc-tabs__item ${!isGlobalView && biz === b ? 'dsc-tabs__item--active' : ''}" data-biz="${b}">${b}排名（${dataset[b].length}家）</div>`).join('')}
    </div>`;

  let tableHtml = '';
  if (isGlobalView) {
    tableHtml = `
      <table class="dsc-table">
        <thead><tr><th>排名</th><th>业态</th><th>二级单位</th><th>总得分</th><th>当月满分</th><th>得分率</th><th>得分率进度</th><th>操作</th></tr></thead>
        <tbody>
          ${globalRows.map(u => `
            <tr>
              <td><strong>${u.globalRank}</strong></td>
              <td><span class="dsc-tag ${SCORE_BOARD_BIZ_TAG[u.biz] || 'dsc-tag--default'}">${u.biz}</span></td>
              <td><strong>${u.unit}</strong></td>
              <td class="dsc-table__num"><span class="dsc-score__value" style="font-size:20px;color:${scoreColorOf(u.scoreRate)}">${u.totalScore}</span></td>
              <td class="dsc-table__num">${u.totalFullScore}</td>
              <td class="dsc-table__num"><strong>${u.scoreRate}</strong></td>
              <td style="width:130px;"><div class="dsc-progress"><div class="dsc-progress__bar ${scoreBarClassOf(u.scoreRate)}" style="width:${parseFloat(u.scoreRate)}%"></div></div></td>
              <td class="dsc-table__actions"><button class="dsc-btn dsc-btn--text dsc-btn--sm" onclick="viewUnitDetail('${u.unit}','${u.biz}','${month}')">明细</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;
  } else {
    const indicators = (curRows[0] || { details: [] }).details;
    tableHtml = `
      <table class="dsc-table" id="rankTable">
        <thead>
          <tr>
            <th>排名</th><th>二级单位</th><th>总得分</th><th>当月满分</th><th>得分率</th><th>得分率进度</th>
            ${indicators.map(d => `<th>${d.indicator}</th>`).join('')}
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${curRows.map(u => `
            <tr>
              <td><strong>${u.rank}</strong></td>
              <td><strong>${u.unit}</strong></td>
              <td class="dsc-table__num"><span class="dsc-score__value" style="font-size:20px;color:${scoreColorOf(u.scoreRate)}">${u.totalScore}</span></td>
              <td class="dsc-table__num">${u.totalFullScore}</td>
              <td class="dsc-table__num"><strong>${u.scoreRate}</strong></td>
              <td style="width:130px;"><div class="dsc-progress"><div class="dsc-progress__bar ${scoreBarClassOf(u.scoreRate)}" style="width:${parseFloat(u.scoreRate)}%"></div></div></td>
              ${u.details.map(d => {
                const isFull = d.actualScore >= d.fullScore;
                const color = isFull ? 'dsc-text-success' : (d.actualScore > 0 ? 'dsc-text-warning' : 'dsc-text-danger');
                return `<td class="dsc-table__num ${color}" title="实际值: ${d.actualValue}\n标准: ${d.standard}">${d.actualScore}/${d.fullScore}</td>`;
              }).join('')}
              <td class="dsc-table__actions"><button class="dsc-btn dsc-btn--text dsc-btn--sm" onclick="viewUnitDetail('${u.unit}','${tabBiz}','${month}')">明细</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;
  }

  return `
    <div class="dsc-page-header">
      <h1 class="dsc-page-header__title">月度自动跑批与打分台账</h1>
      <div class="dsc-page-header__actions">
        <select class="dsc-select" id="monthFilter" style="width:175px;">
          <option value="202607" ${month === '202607' ? 'selected' : ''}>2026年7月（新标准）</option>
          <option value="202606" ${month === '202606' ? 'selected' : ''}>2026年6月（旧标准）</option>
        </select>
        <button class="dsc-btn dsc-btn--primary" onclick="runMonthlyBatch()">执行月度跑批</button>
        <button class="dsc-btn dsc-btn--default" onclick="exportLedger()">导出当月台账</button>
      </div>
    </div>

    <div class="dsc-alert dsc-alert--info">
      ${isNewStd
        ? '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" style="vertical-align:-2px;margin-right:4px;"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.2"/></svg>自<strong>2026年7月</strong>起适用新标准：三业态独立考核标准表（主业84分 / 海外100分 / 投资100分），按月动态满分计分；平台应用按子表100分制×0.06折算；资源白名单年末考核。1—6月旧数据不追溯重算。'
        : '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" style="vertical-align:-2px;margin-right:4px;"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.2"/></svg>2026年6月及以前按6月前旧标准执行（主业满分68分/月）；<strong>自2026年7月起适用新标准</strong>（主业84分 / 海外100分 / 投资100分，动态满分按月计算）。1—6月历史数据不追溯重算。'}
    </div>

    <!-- 跑批日志 -->
    <div class="dsc-card">
      <div class="dsc-card__header">
        <span class="dsc-card__title">定时跑批任务日志</span>
      </div>
      <div class="dsc-card__body--no-padding">
        <div class="dsc-table-wrapper">
          <table class="dsc-table">
            <thead>
              <tr>
                <th>跑批编号</th><th>考核月份</th><th>开始时间</th><th>完成时间</th><th>耗时</th><th>涉及单位</th><th>指标数</th><th>状态</th><th>得分生成</th><th>操作</th>
              </tr>
            </thead>
            <tbody id="batchLogTable">
              ${BATCH_RUN_LOGS.map(b => `
                <tr>
                  <td>${b.batchNo}</td>
                  <td><strong>${b.month}</strong></td>
                  <td class="dsc-font-sm">${b.runTime}</td>
                  <td class="dsc-font-sm">${b.finishTime}</td>
                  <td class="dsc-font-sm">约12分钟</td>
                  <td class="dsc-table__num">${b.units}</td>
                  <td class="dsc-table__num">${b.indicators}</td>
                  <td><span class="dsc-tag dsc-tag--success">完成</span></td>
                  <td><span class="dsc-tag dsc-tag--success">已生成</span></td>
                  <td class="dsc-table__actions">
                    <button class="dsc-btn dsc-btn--text dsc-btn--sm">查看明细</button>
                    <button class="dsc-btn dsc-btn--text dsc-btn--sm">重新计算</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 排名看板 -->
    <div class="dsc-card">
      <div class="dsc-card__header">
        <span class="dsc-card__title">${monthLabel} 排名看板（${isNewStd ? '新标准' : '旧标准'}）</span>
        <span class="dsc-text-tertiary dsc-font-sm">${boardTip}</span>
      </div>
      <div class="dsc-card__body">
        ${tabsHtml}
        <div class="dsc-table-wrapper">${tableHtml}</div>
        <div class="dsc-pagination">
          <span>共 ${curRows.length} 家二级单位</span>
          <button class="dsc-pagination__btn dsc-pagination__btn--active">1</button>
        </div>
      </div>
    </div>
  `;
}

function initScoreLedgerPage() {
  const monthFilter = document.getElementById('monthFilter');
  if (monthFilter) {
    monthFilter.addEventListener('change', function() {
      AppState.scoreMonth = this.value;
      rerenderScoreLedger();
    });
  }
  document.querySelectorAll('#boardTabs .dsc-tabs__item').forEach(tab => {
    tab.addEventListener('click', function() {
      AppState.scoreBiz = this.dataset.biz;
      rerenderScoreLedger();
    });
  });
}

function rerenderScoreLedger() {
  const container = document.getElementById('pageContainer');
  container.innerHTML = renderScoreLedgerPage();
  initScoreLedgerPage();
}

function runMonthlyBatch() {
  showToast('月度跑批任务已提交：按业态标准表与单位差异化阈值自动算分，预计3-5分钟完成', 'info');
}

function exportLedger() {
  showToast('当月打分台账已导出（含明细账单与排名看板）', 'success');
}

function viewUnitDetail(unitName, biz, month) {
  const m = month || AppState.scoreMonth || '202607';
  const b = biz || '主业';
  const list = (SCORE_DATASETS[m] || {})[b] || [];
  const unit = list.find(u => u.unit === unitName);
  if (!unit) { showToast('未找到该单位得分明细', 'warning'); return; }

  const isNew = m === '202607';
  const monthNum = parseInt(m.slice(4), 10);
  const bizFull = (BIZ_MONTH_FULL[m] || {})[b];
  let detailHtml = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
      <span style="font-size:18px;font-weight:700;">${unit.unit} - ${m.slice(0, 4)}年${monthNum}月考核明细</span>
      <span>
        <span class="dsc-tag ${SCORE_BOARD_BIZ_TAG[b] || 'dsc-tag--default'}" style="margin-right:8px;">${b}</span>
        <span class="dsc-tag dsc-tag--info">${b}内排名 ${unit.rank}</span>
      </span>
    </div>
    <div class="dsc-stat-row" style="grid-template-columns:repeat(3,1fr);margin-bottom:16px;">
      <div class="dsc-stat-card" style="padding:16px;">
        <div class="dsc-stat-card__label">总得分</div>
        <div class="dsc-stat-card__value" style="font-size:24px;">${unit.totalScore}<span style="font-size:14px;color:var(--color-text-tertiary);"> / ${unit.totalFullScore}</span></div>
      </div>
      <div class="dsc-stat-card" style="padding:16px;">
        <div class="dsc-stat-card__label">得分率</div>
        <div class="dsc-stat-card__value" style="font-size:24px;">${unit.scoreRate}</div>
      </div>
      <div class="dsc-stat-card" style="padding:16px;">
        <div class="dsc-stat-card__label">当月满分基数</div>
        <div class="dsc-stat-card__value" style="font-size:24px;">${unit.totalFullScore}</div>
      </div>
    </div>
    ${isNew && bizFull !== undefined ? `<div class="dsc-alert dsc-alert--info"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" style="vertical-align:-2px;margin-right:4px;"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.2"/></svg>2026年7月动态满分按新标准计算（${b} ${bizFull}分），每笔扣分可追溯至实际指标数据、扣分规则与扣分原因。</div>` : ''}
    <table class="dsc-table">
      <thead><tr><th>考核指标</th><th>满分</th><th>实际得分</th><th>扣分</th><th>实际值</th><th>达标标准</th><th>扣分原因</th></tr></thead>
      <tbody>
        ${unit.details.map(d => {
          const deduction = Math.round((d.fullScore - d.actualScore) * 100) / 100;
          const reason = d.deductReason
            ? d.deductReason
            : (deduction > 0
              ? (d.indicator === '采购成本降低率' ? `实际降低率${d.actualValue}，低于目标值3.2%，扣${deduction}分` :
                 d.indicator === '平均采购时长' ? `实际${d.actualValue}，超出标准32天，扣${deduction}分` :
                 d.indicator === '在线评标率' ? `在线评标率${d.actualValue}，低于98%，扣${deduction}分` :
                 `未达标，扣${deduction}分`)
              : '达标，未扣分');
          return `<tr>
            <td>${d.indicator}</td><td class="dsc-table__num">${d.fullScore}</td>
            <td class="dsc-table__num"><strong style="color:${deduction>0?'var(--color-warning)':'var(--color-success)'}">${d.actualScore}</strong></td>
            <td class="dsc-table__num dsc-text-danger">${deduction>0?'-'+deduction:'0'}</td>
            <td class="dsc-table__num">${d.actualValue}</td><td>${d.standard}</td>
            <td class="dsc-font-sm">${reason}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  `;

  openModal(`${unit.unit}月度考核得分明细单`, detailHtml, false);
}

// ============================================================
// 页面4: 申诉审批与纠正
// ============================================================
function renderAppealApprovalPage() {
  return `
    <div class="dsc-page-header">
      <h1 class="dsc-page-header__title">申诉审批与纠正</h1>
      <div class="dsc-page-header__actions">
        <button class="dsc-btn dsc-btn--default"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><path d="M2.5 13V4M7 13V2.5M11.5 13V6M2 13h12"/></svg>试公示看板</button>
        <button class="dsc-btn dsc-btn--primary" onclick="openSpecialApprovalModal()">+ 纠正调整</button>
      </div>
    </div>

    <!-- 进度提示 -->
    <div class="dsc-alert dsc-alert--info">
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" style="vertical-align:-2px;margin-right:4px;"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.2"/></svg><strong>2026年7月为新标准首个考核月</strong>：试公示期7月28日—7月30日（共3个工作日），8月1日起公示正式结果；试公示期间二级单位仅可见本单位结果。1—6月旧标准批次仅作历史查询。
    </div>

    <!-- 申诉列表 -->
    <div class="dsc-card">
      <div class="dsc-card__header">
        <span class="dsc-card__title">申诉审批列表</span>
        <div class="dsc-flex dsc-gap-sm">
          <select class="dsc-select" id="appealMonthFilter" style="width:130px;"><option value="">全部月份</option><option>2026年7月</option><option>2026年6月</option></select>
          <select class="dsc-select" id="appealStatusFilter" style="width:150px;"><option value="">全部状态</option><option value="初审中">考核专员初审中</option><option value="复核中">部门领导复核中</option><option value="已裁定">已裁定</option></select>
          <button class="dsc-btn dsc-btn--default dsc-btn--sm">刷新</button>
        </div>
      </div>
      <div class="dsc-card__body--no-padding">
        <div class="dsc-table-wrapper">
          <table class="dsc-table">
            <thead>
              <tr>
                <th>申诉编号</th><th>考核月份</th><th>申诉单位</th><th>争议指标</th><th>原得分</th><th>原扣分</th><th>申诉理由</th><th>提交时间</th><th>附件</th><th>当前状态</th><th>操作</th>
              </tr>
            </thead>
            <tbody id="appealTable">
              ${APPEAL_RECORDS.map(a => {
                const sTag = a.status.includes('已裁定') ? 'dsc-tag--success' : a.status.includes('复核') ? 'dsc-tag--info' : 'dsc-tag--warning';
                return `
                  <tr>
                    <td>${a.id}</td>
                    <td class="dsc-font-sm">${a.month || '2026年6月'}</td>
                    <td><strong>${a.unit}</strong></td>
                    <td>${a.indicator}</td>
                    <td class="dsc-table__num">${a.originalScore}</td>
                    <td class="dsc-table__num dsc-text-danger">-${a.originalDeduction}</td>
                    <td style="max-width:240px;font-size:12px;">${a.reason}</td>
                    <td class="dsc-font-sm">${a.submitTime}</td>
                    <td class="dsc-table__num"><svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:3px;"><path d="M11 4.5a1.5 1.5 0 0 1 0 3L6 12.5a3 3 0 0 1-4.2-4.2l5.8-5.8a4.5 4.5 0 0 1 6.3 6.3l-6 6a1.5 1.5 0 0 1-2.1-2.1l5.5-5.5"/></svg>${a.attachments}个</td>
                    <td><span class="dsc-tag ${sTag}">${a.status}</span></td>
                    <td class="dsc-table__actions">
                      <button class="dsc-btn dsc-btn--text dsc-btn--sm" onclick="viewAppealDetail('${a.id}')">处理</button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
        <div class="dsc-pagination">
          <span>共 ${APPEAL_RECORDS.length} 条</span>
          <button class="dsc-pagination__btn dsc-pagination__btn--active">1</button>
        </div>
      </div>
    </div>

    <!-- 纠正调整记录 -->
    <div class="dsc-card">
      <div class="dsc-card__header">
        <span class="dsc-card__title">纠正调整记录（分数覆盖与重算）</span>
      </div>
      <div class="dsc-card__body--no-padding">
        <div class="dsc-table-wrapper">
          <table class="dsc-table">
            <thead>
              <tr><th>记录ID</th><th>关联申诉</th><th>调整单位</th><th>调整指标</th><th>原分值</th><th>调整后分值</th><th>调整人</th><th>调整时间</th><th>状态</th><th>日志</th></tr>
            </thead>
            <tbody>
              ${SPECIAL_ADJUSTMENTS.map(a => `
                <tr>
                  <td>${a.id}</td><td>${a.appealId}</td><td><strong>${a.unit}</strong></td><td>${a.indicator}</td>
                  <td class="dsc-table__num">${a.originalScore}</td>
                  <td class="dsc-table__num dsc-text-${a.delta === '0' ? 'secondary' : 'success'}">${a.adjustedScore} (${a.delta})</td>
                  <td>${a.operator}</td><td class="dsc-font-sm">${a.time}</td>
                  <td><span class="dsc-tag ${a.status === '已完成' ? 'dsc-tag--success' : a.status === '待执行' ? 'dsc-tag--info' : 'dsc-tag--default'}">${a.status}</span></td>
                  <td><button class="dsc-btn dsc-btn--text dsc-btn--sm" onclick="viewAdjustLog('${a.id}')">查看日志</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function initAppealApprovalPage() {
  const mf = document.getElementById('appealMonthFilter');
  if (mf) mf.addEventListener('change', applyAppealFilters);
  const sf = document.getElementById('appealStatusFilter');
  if (sf) sf.addEventListener('change', applyAppealFilters);
}

function applyAppealFilters() {
  const m = (document.getElementById('appealMonthFilter') || {}).value || '';
  const s = (document.getElementById('appealStatusFilter') || {}).value || '';
  document.querySelectorAll('#appealTable tr').forEach(row => {
    const tds = row.querySelectorAll('td');
    if (tds.length < 10) return;
    const monthText = tds[1].textContent;
    const statusText = tds[9].textContent;
    const matchM = !m || monthText === m;
    const matchS = !s || statusText.includes(s.replace('中', ''));
    row.style.display = (matchM && matchS) ? '' : 'none';
  });
}

function viewAppealDetail(appealId) {
  const appeal = APPEAL_RECORDS.find(a => a.id === appealId);
  if (!appeal) return;
  
  let html = `
    <div style="margin-bottom:16px;">
      <span style="font-size:16px;font-weight:700;">${appeal.unit} - ${appeal.indicator} 申诉详情</span>
      <span class="dsc-tag dsc-tag--warning" style="margin-left:8px;">原扣分: -${appeal.originalDeduction}分</span>
    </div>
    <div class="dsc-alert dsc-alert--warning">
      申诉理由：${appeal.reason}
    </div>
    <div style="margin-top:16px;font-weight:600;">审批流程</div>
    <div class="dsc-timeline" style="margin-top:8px;">
      ${appeal.timeline.map(t => {
        const dotClass = t.status === 'done' ? 'dsc-timeline__dot--done' : t.status === 'active' ? 'dsc-timeline__dot--active' : '';
        return `
          <div class="dsc-timeline__item">
            <div class="dsc-timeline__dot ${dotClass}"></div>
            <div class="dsc-timeline__content">
              <div class="dsc-timeline__title">${t.step} ${t.result ? '<span class="dsc-tag dsc-tag--success">'+t.result+'</span>' : ''}</div>
              <div class="dsc-timeline__desc">${t.time} · ${t.operator}</div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  
  openModal(`申诉处理 - ${appealId}`, html, true);
}

function viewAdjustLog(adjId) {
  const a = SPECIAL_ADJUSTMENTS.find(x => x.id === adjId);
  if (!a) { showToast('未找到该调整记录', 'warning'); return; }
  const html = `
    <div class="dsc-alert dsc-alert--info"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" style="vertical-align:-2px;margin-right:4px;"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.2"/></svg>纠正调整日志 - ${a.id}（${a.unit}·${a.indicator}）</div>
    <div style="margin-top:16px;font-weight:600;">调整流程</div>
    <div class="dsc-timeline" style="margin-top:8px;">
      ${[
        { step: '提交纠正申请', time: '2026-06-28 09:00', operator: `${a.unit}-经办人`, status: 'done' },
        { step: '考核专员初审', time: '2026-06-29 10:30', operator: '张考核', status: 'done' },
        { step: '部门领导复核', time: '2026-06-29 16:00', operator: '李部长', status: 'done' },
        { step: `领导纠正（${a.operator}）`, time: a.time, operator: a.operator, status: 'done', result: `调整分值 ${a.adjustedScore} (${a.delta})，状态：${a.status}` },
      ].map(t => `
        <div class="dsc-timeline__item">
          <div class="dsc-timeline__dot dsc-timeline__dot--done"></div>
          <div class="dsc-timeline__content">
            <div class="dsc-timeline__title">${t.step} ${t.result ? '<span class="dsc-tag dsc-tag--success">'+t.result+'</span>' : ''}</div>
            <div class="dsc-timeline__desc">${t.time} · ${t.operator}</div>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="dsc-alert dsc-alert--warning" style="margin-top:16px;"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><path d="M8 1.5L15 14H1z"/><path d="M8 6v3.2M8 11.6v.2" stroke-linecap="round"/></svg>调整已触发该单位当月总分与全局排名的重新计算，全程留痕可追溯。</div>
  `;
  openModal(`纠正调整日志 - ${a.id}`, html, false);
}

function openSpecialApprovalModal() {
  const html = `
    <div class="dsc-form-row dsc-form-row--2">
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">选择二级单位</label>
        <select class="dsc-select" style="width:100%;">${SECONDARY_UNITS.map(u => `<option>${u}</option>`).join('')}</select>
      </div>
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">选择考核指标</label>
        <select class="dsc-select" style="width:100%;">${ASSESSMENT_RULES.filter(r=>r.applicable==='主业').map(r => `<option>${r.name}</option>`).join('')}</select>
      </div>
    </div>
    <div class="dsc-form-row dsc-form-row--2">
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">原得分</label>
        <input class="dsc-input" type="text" placeholder="系统自动带入" readonly />
      </div>
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">调整后得分</label>
        <input class="dsc-input" type="number" step="0.1" placeholder="输入调整分值" />
      </div>
    </div>
    <div class="dsc-form-group dsc-mb-lg">
      <label class="dsc-form-label dsc-form-label--required">调整原因</label>
      <textarea class="dsc-textarea" placeholder="请填写纠正调整原因，系统将全程留存修改日志"></textarea>
    </div>
    <div class="dsc-alert dsc-alert--warning">
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><path d="M8 1.5L15 14H1z"/><path d="M8 6v3.2M8 11.6v.2" stroke-linecap="round"/></svg>纠正调整将触发该单位当月总分与全局排名的重新计算，操作不可撤销。
    </div>
  `;
  openModal('纠正调整', html, true);
}

// ============================================================
// 通用组件
// ============================================================

function openModal(title, bodyHtml, showFooter) {
  const overlay = document.getElementById('modalOverlay');
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHtml;
  document.getElementById('modalFooter').style.display = showFooter ? 'flex' : 'none';
  overlay.classList.add('dsc-modal-overlay--visible');
  AppState.currentModal = title;
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('dsc-modal-overlay--visible');
  AppState.currentModal = null;
}

function showToast(message, type) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `dsc-alert dsc-alert--${type}`;
  toast.style.cssText = 'margin-bottom:8px;animation:slideIn 0.3s ease;box-shadow:var(--shadow-md);';
  toast.innerHTML = `<span style="margin-right:6px;">${type === 'info' ? '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" style="vertical-align:-2px;"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.2" stroke-linecap="round"/></svg>' : type === 'success' ? '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;"><path d="M2.5 8.5l3.5 3.5 7.5-7.5"/></svg>' : type === 'warning' ? '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;"><path d="M8 1.5L15 14H1z"/><path d="M8 6v3.2M8 11.6v.2" stroke-linecap="round"/></svg>' : '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" style="vertical-align:-2px;"><path d="M4 4l8 8M12 4L4 12"/></svg>'}</span> ${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add toast animation style
const toastStyle = document.createElement('style');
toastStyle.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;
document.head.appendChild(toastStyle);

// ============================================================
// 指标库 - 编辑弹窗 / 参数设置弹窗
// ============================================================
function openEditRuleModal(ruleId) {
  const rule = ASSESSMENT_RULES.find(r => r.id === ruleId);
  if (!rule) return;
  const html = `
    <div class="dsc-form-row dsc-form-row--2">
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">考核指标名称</label>
        <input class="dsc-input" value="${rule.name}" />
      </div>
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">适用业态</label>
        <input class="dsc-input" value="${rule.applicable}" />
      </div>
    </div>
    <div class="dsc-form-row dsc-form-row--3">
      <div class="dsc-form-group">
        <label class="dsc-form-label">考核周期触发条件</label>
        <input class="dsc-input" value="${rule.period}" />
      </div>
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">证明资料</label>
        <select class="dsc-select" style="width:100%;">
          <option ${rule.proof === '平台提取' ? 'selected' : ''}>平台提取</option>
          <option ${rule.proof === '检查' ? 'selected' : ''}>检查</option>
          <option ${rule.proof === '报送' ? 'selected' : ''}>报送</option>
        </select>
      </div>
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">分值上限</label>
        <input class="dsc-input" value="${rule.score}" />
      </div>
    </div>
    <div class="dsc-form-group dsc-mb-lg">
      <label class="dsc-form-label">扣分判定规则简述</label>
      <textarea class="dsc-textarea">${rule.rule}</textarea>
    </div>
    <div class="dsc-form-group dsc-mb-lg">
      <label class="dsc-form-label">达标标准 / 计算公式</label>
      <textarea class="dsc-textarea">${rule.standard}</textarea>
    </div>
    <div class="dsc-form-group">
      <label class="dsc-form-label">数据来源</label>
      <input class="dsc-input" value="${rule.source}" />
    </div>
  `;
  openModal(`编辑考核指标 - ${rule.name}`, html, true);
}

function openParamModal(ruleId) {
  const rule = ASSESSMENT_RULES.find(r => r.id === ruleId);
  if (!rule) return;
  const html = `
    <div class="dsc-alert dsc-alert--info">
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" style="vertical-align:-2px;margin-right:4px;"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.2"/></svg>正在为「${rule.name}」配置计分参数，满分上限 ${rule.score} 分。
    </div>
    <div class="dsc-form-row dsc-form-row--3">
      <div class="dsc-form-group">
        <label class="dsc-form-label">满分基数 S_base</label>
        <input class="dsc-input" type="number" value="${parseFloat(rule.score) || 0}" />
      </div>
      <div class="dsc-form-group">
        <label class="dsc-form-label">达标阈值 T</label>
        <input class="dsc-input" placeholder="如 70%、3.2%、98%" />
      </div>
      <div class="dsc-form-group">
        <label class="dsc-form-label">单次扣分步长 d</label>
        <input class="dsc-input" type="number" step="0.1" value="1" />
      </div>
    </div>
    <div class="dsc-form-row dsc-form-row--3">
      <div class="dsc-form-group">
        <label class="dsc-form-label">扣分上限</label>
        <input class="dsc-input" value="扣完为止" />
      </div>
      <div class="dsc-form-group">
        <label class="dsc-form-label">算法类型</label>
        <select class="dsc-select" style="width:100%;"><option>连续偏离度扣减</option><option>离散型扣减</option></select>
      </div>
      <div class="dsc-form-group">
        <label class="dsc-form-label">公式预览</label>
        <div class="dsc-input" style="background:#F5F5F5;color:var(--color-text-tertiary);display:flex;align-items:center;font-size:12px;">MAX(0, S_base - (T - A)/α)</div>
      </div>
    </div>
  `;
  openModal(`参数设置 - ${rule.name}`, html, true);
}

// ============================================================
// 页面3 - 单位详情查看（全局函数暴露）
// ============================================================
window.viewUnitDetail = viewUnitDetail;
window.viewAppealDetail = viewAppealDetail;
window.openSpecialApprovalModal = openSpecialApprovalModal;
window.viewAdjustLog = viewAdjustLog;
window.openEditRuleModal = openEditRuleModal;
window.openParamModal = openParamModal;
window.openRuleModal = () => openModal('新增考核规则', `
  <div class="dsc-form-row dsc-form-row--2">
    <div class="dsc-form-group"><label class="dsc-form-label dsc-form-label--required">考核指标名称</label><input class="dsc-input" placeholder="如：采购成本降低率" /></div>
    <div class="dsc-form-group"><label class="dsc-form-label dsc-form-label--required">适用业态</label><input class="dsc-input" placeholder="主业 / 海外 / 投资" /></div>
  </div>
  <div class="dsc-form-row dsc-form-row--2">
    <div class="dsc-form-group"><label class="dsc-form-label">考核周期触发条件</label><input class="dsc-input" placeholder="如：每月触发" /></div>
    <div class="dsc-form-group"><label class="dsc-form-label dsc-form-label--required">分值上限</label><input class="dsc-input" type="number" step="0.1" /></div>
  </div>
  <div class="dsc-form-group dsc-mb-lg"><label class="dsc-form-label">扣分判定规则简述</label><textarea class="dsc-textarea" placeholder="输入扣分判定规则"></textarea></div>
  <div class="dsc-form-group dsc-mb-lg"><label class="dsc-form-label">达标标准 / 计算公式</label><textarea class="dsc-textarea" placeholder="输入达标标准与计算公式"></textarea></div>
  <div class="dsc-form-group"><label class="dsc-form-label">数据来源</label><input class="dsc-input" placeholder="如：八局大数据湖DSC及云筑网入湖数据、手动填报" /></div>
`, true);
window.openBusinessTypeModal = () => openModal('新增业态', `
  <div class="dsc-form-row dsc-form-row--2">
    <div class="dsc-form-group"><label class="dsc-form-label dsc-form-label--required">业态名称</label><input class="dsc-input" placeholder="如：创新业务" /></div>
    <div class="dsc-form-group"><label class="dsc-form-label dsc-form-label--required">业态编码</label><input class="dsc-input" placeholder="如：INNOVATION" /></div>
  </div>
  <div class="dsc-form-group dsc-mb-lg"><label class="dsc-form-label">说明</label><textarea class="dsc-textarea" placeholder="业态说明"></textarea></div>
`, true);

// 编辑业态弹窗（含被考核单位选择）
window.openEditBusinessTypeModal = (businessId) => {
  const bt = BUSINESS_TYPES.find(b => b.id === Number(businessId));
  if (!bt) { showToast('未找到该业态', 'warning'); return; }
  // 按业态预选关联单位数量（取前 units 家）
  const unitOptions = SECONDARY_UNITS.map((u, i) => {
    const checked = i < bt.units ? 'checked' : '';
    return `<label style="display:inline-flex;align-items:center;gap:6px;margin:4px 12px 4px 0;cursor:pointer;font-size:14px;"><input type="checkbox" ${checked} style="width:16px;height:16px;" /> ${u}</label>`;
  }).join('');
  const html = `
    <div class="dsc-alert dsc-alert--info"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" style="vertical-align:-2px;margin-right:4px;"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.2"/></svg>编辑业态「${bt.name}」，可调整基本信息并选择本业态下参与考核的被考核单位。</div>
    <div class="dsc-form-row dsc-form-row--2">
      <div class="dsc-form-group"><label class="dsc-form-label dsc-form-label--required">业态名称</label><input class="dsc-input" value="${bt.name}" /></div>
      <div class="dsc-form-group"><label class="dsc-form-label dsc-form-label--required">业态编码</label><input class="dsc-input" value="${bt.code}" /></div>
    </div>
    <div class="dsc-form-row dsc-form-row--2">
      <div class="dsc-form-group"><label class="dsc-form-label">状态</label>
        <select class="dsc-select" style="width:100%;">
          <option ${bt.status==='active'?'selected':''}>启用</option>
          <option ${bt.status!=='active'?'selected':''}>停用</option>
        </select>
      </div>
      <div class="dsc-form-group"><label class="dsc-form-label">关联单位数</label><input class="dsc-input" type="number" value="${bt.units}" /></div>
    </div>
    <div class="dsc-form-group dsc-mb-lg">
      <label class="dsc-form-label dsc-form-label--required">关联被考核单位（勾选参与本业态考核的单位）</label>
      <div style="border:1px solid var(--color-border);border-radius:6px;padding:12px;max-height:220px;overflow-y:auto;background:#FAFAFA;">
        ${unitOptions}
      </div>
    </div>
    <div class="dsc-form-group dsc-mb-lg"><label class="dsc-form-label">说明</label><textarea class="dsc-textarea">${bt.desc}</textarea></div>
  `;
  openModal(`编辑业态 - ${bt.name}`, html, true);
};

// 启用/停用业态
window.toggleBusinessType = (businessId) => {
  const bt = BUSINESS_TYPES.find(b => b.id === Number(businessId));
  if (!bt) return;
  const next = bt.status === 'active' ? '停用' : '启用';
  openModal(`确认${next}业态`, `
    <div class="dsc-alert dsc-alert--warning"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px;"><path d="M8 1.5L15 14H1z"/><path d="M8 6v3.2M8 11.6v.2" stroke-linecap="round"/></svg>确定要${next}业态「${bt.name}」吗？${next==='停用'?'停用后该业态下的被考核单位将不再参与月度考核。':'启用后该业态下的被考核单位将纳入月度考核。'}</div>
  `, true);
  document.getElementById('modalConfirm').onclick = function() {
    bt.status = bt.status === 'active' ? 'inactive' : 'active';
    closeModal();
    showToast(`业态「${bt.name}」已${next}`, 'success');
    renderPage('rules-config');
  };
};
window.triggerManualCollect = triggerManualCollect;
window.openImportModal = openImportModal;
window.switchCollectTab = switchCollectTab;
window.openCollectDetail = openCollectDetail;
window.runCollectTask = runCollectTask;
window.remindReport = remindReport;
window.viewReportDetail = viewReportDetail;
window.openInspectionModal = openInspectionModal;
window.viewInspectionDetail = viewInspectionDetail;
window.applyIndicatorFilters = applyIndicatorFilters;
window.resetIndicatorFilters = resetIndicatorFilters;
window.runMonthlyBatch = runMonthlyBatch;
window.exportLedger = exportLedger;
window.openThresholdModal = openThresholdModal;

// ============================================================
// 应用启动
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  
  // 关闭模态框
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
  document.getElementById('modalCancel').addEventListener('click', closeModal);
  
  // 初始加载页面
  navigateTo('rules-config');
  
  console.log('DSC 二级单位考核指标评分系统 v2.1 已启动（2026年7月修订版新标准 · 三业态排名与动态满分）');
});