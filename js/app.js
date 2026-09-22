/**
 * DSC 二级单位考核指标评分系统 - 主应用逻辑
 * 基于 UI/UE 设计规范 v2026
 */

// ============================================================
// 全局状态管理
// ============================================================
const AppState = {
  currentPage: 'rules-config', // rules-config | data-collection | score-ledger | appeal-approval | tertiary-workspace | passthrough-detail
  sidebarCollapsed: false,
  currentModal: null,
  scoreMonth: '202607', // 打分台账当前月份
  scoreBiz: '全局',     // 排名看板当前维度：全局 | 主业 | 海外 | 投资
  collectTab: 'main',   // 数据采集当前业态Tab
  collectSection: 'extract', // V3.1 数据采集页内分区：extract | inspection | reporting | exception
  // —— V3.0 双线穿透 ——
  currentRole: '局总部考核专员', // V3.1 五类角色，见 ROLE_PROFILE
  rulesTab: 'org',             // 规则配置Tab：org | indicators | platform-rules | templates
  appealLine: '局考复核申诉',           // 申诉分级：局考穿透追溯 | 二级自主考评
  workspaceTab: 'rule',        // 工作台Tab：rule | reporting | inspection | board
  portalTab: 'passthrough',    // 三级门户Tab：passthrough | report | score
  orgExpanded: { 'ORG-ROOT': true }, // 组织机构树展开状态
  orgFilter: { name: '', biz: '', level: '' },
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

  // V3.0：角色视图切换
  const roleSwitch = document.getElementById('roleSwitch');
  if (roleSwitch) {
    roleSwitch.value = AppState.currentRole;
    roleSwitch.addEventListener('change', function() { applyRole(this.value); });
  }
  // V3.1：按当前角色初始化侧栏权限菜单
  applySidebarScope();
}

// 侧栏权限菜单作用域：局侧菜单（hq） / 三级门户（l3）
function applySidebarScope() {
  const p = (typeof ROLE_PROFILE !== 'undefined' && ROLE_PROFILE[AppState.currentRole]) || null;
  const isL3 = !!(p && p.caps && p.caps.portal);
  document.querySelectorAll('.dsc-sidebar__submenu-item[data-scope]').forEach(it => {
    it.style.display = (it.dataset.scope === (isL3 ? 'l3' : 'hq')) ? '' : 'none';
  });
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
    'data-collection': '数据采集与编辑',
    'score-ledger': '月度自动跑批与打分台账',
    'appeal-approval': '申诉审批与纠正',
    'tertiary-workspace': '二级考核专员工作台',
    'tertiary-portal': '三级业务门户（济南分公司）',
  };
  document.getElementById('breadcrumbPage').textContent = pageNames[page] || page;
}

// V3.1：角色与上下文切换（五类角色权责矩阵）
function applyRole(role) {
  AppState.currentRole = role;
  const p = (typeof ROLE_PROFILE !== 'undefined' && ROLE_PROFILE[role]) || null;
  const isL3 = !!(p && p.caps && p.caps.portal);

  // 侧栏权限菜单联动：三级角色精简显示「三级业务门户」
  applySidebarScope();
  // 顶部身份同步
  const un = document.getElementById('headerUserName');
  if (un && p) un.textContent = p.operator;

  if (p) showToast(`已切换至「${role}」：${p.org}；数据范围 ${p.scope}`, 'info');

  const home = (p && p.home) || 'rules-config';
  navigateTo(home);
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
    case 'tertiary-workspace':
      container.innerHTML = renderTertiaryWorkspacePage();
      initTertiaryWorkspacePage();
      break;
    case 'tertiary-portal':
      container.innerHTML = renderTertiaryPortalPage();
      initTertiaryPortalPage();
      break;
  }
}

// ============================================================
// V3.0 M1：组织机构树（局—二级—三级）
// ============================================================
const ORG_CARET_DOWN = '<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg>';
const ORG_CARET_RIGHT = '<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4l4 4-4 4"/></svg>';

function orgBizTag(b) {
  return b === '主业' ? 'dsc-tag--info' : b === '海外' ? 'dsc-tag--success' : b === '投资' ? 'dsc-tag--warning' : 'dsc-tag--default';
}
function orgLevelTag(l) {
  return l === '局' ? 'dsc-tag--danger' : l === '二级单位' ? 'dsc-tag--info' : 'dsc-tag--default';
}
function orgStatusTag(s) {
  return s === 'active' ? 'dsc-tag--success' : s === '新设不满月' ? 'dsc-tag--warning' : 'dsc-tag--default';
}
function orgStatusText(s) {
  return s === 'active' ? '正常运行' : s === '新设不满月' ? '新设不满月' : '年内停用';
}
function orgHit(n) {
  const f = AppState.orgFilter;
  const kw = (f.name || '').trim().toLowerCase();
  const byName = !kw || n.org_name.toLowerCase().includes(kw) || n.org_code.toLowerCase().includes(kw);
  const byBiz = !f.biz || n.business_type === f.biz;
  const byLevel = !f.level || n.org_level === f.level;
  return byName && byBiz && byLevel;
}

function orgRowHtml(n, depth) {
  const hasChild = !!(n.children && n.children.length);
  const expanded = !!AppState.orgExpanded[n.org_id];
  const caret = (depth < 2 && hasChild)
    ? `<span class="dsc-tree-toggle" role="button" tabindex="0" aria-expanded="${expanded}" onclick="toggleOrgNode('${n.org_id}')" title="${expanded ? '收起' : '展开'}">${expanded ? ORG_CARET_DOWN : ORG_CARET_RIGHT}</span>`
    : '<span class="dsc-tree-toggle dsc-tree-toggle--placeholder"></span>';
  const nodeCls = depth === 1 ? 'dsc-tree-node--l2' : depth === 2 ? 'dsc-tree-node--l3' : '';
  // P0-3 搜索命中高亮
  const kw = (AppState.orgFilter.name || '').trim();
  const esc = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const hl = (text) => kw
    ? String(text).replace(new RegExp(esc, 'gi'), m => `<mark class="dsc-hl">${m}</mark>`)
    : text;
  const nameHtml = depth < 2 ? `<strong>${hl(n.org_name)}</strong>` : hl(n.org_name);
  const countText = depth === 2 ? `${n.project_count} 个项目` : `${n.child_count} 家三级`;
  const autoCell = n.autonomous_eval_status
    ? `<span class="dsc-tag ${n.autonomous_eval_status === '已启用' ? 'dsc-tag--success' : 'dsc-tag--default'} dsc-tag--sm">${n.autonomous_eval_status}</span>`
    : '<span class="dsc-text-tertiary dsc-font-sm">—</span>';
  const editBtn = depth < 2 ? `<button class="dsc-btn dsc-btn--text dsc-btn--sm" onclick="showToast('编辑机构：${n.org_name}（原型演示）','info')">编辑</button>` : '';
  const diffBtn = depth === 1 ? `<button class="dsc-btn dsc-btn--text dsc-btn--sm dsc-text-primary" onclick="openOrgThresholdHint('${n.org_name}')">差异化目标分解</button>` : '';
  return `<tr>
    <td><span class="dsc-tree-node ${nodeCls}">${caret}${nameHtml}</span></td>
    <td class="dsc-tree-code">${n.org_code}</td>
    <td><span class="dsc-tag ${orgLevelTag(n.org_level)}">${n.org_level}</span></td>
    <td><span class="dsc-tag ${orgBizTag(n.business_type)}">${n.business_type}</span></td>
    <td>${autoCell}</td>
    <td class="dsc-font-sm">${n.parent_org_name}</td>
    <td class="dsc-table__num">${countText}</td>
    <td><span class="dsc-tag ${orgStatusTag(n.status)}">${orgStatusText(n.status)}</span></td>
    <td class="dsc-table__actions">${editBtn}${diffBtn}<button class="dsc-btn dsc-btn--text dsc-btn--sm" onclick="showToast('机构档案：${n.org_name}（${n.org_code}）','info')">查看档案</button></td>
  </tr>`;
}

function buildOrgRows() {
  const f = AppState.orgFilter;
  const filtering = !!(f.name || f.biz || f.level);
  const rows = [];
  if (orgHit(ORG_TREE)) rows.push(orgRowHtml(ORG_TREE, 0));
  ORG_TREE.children.forEach(u => {
    const kidsHit = (u.children || []).filter(orgHit);
    if (!orgHit(u) && !kidsHit.length) return;
    if (f.level !== '三级单位') rows.push(orgRowHtml(u, 1));
    const expanded = filtering ? true : !!AppState.orgExpanded[u.org_id];
    if (f.level !== '二级单位' && expanded) {
      const kids = (f.level === '三级单位' || (filtering && f.biz)) ? kidsHit : (filtering ? kidsHit : u.children);
      kids.forEach(c => rows.push(orgRowHtml(c, 2)));
    }
  });
  return rows;
}

function renderOrgTreeTab() {
  const f = AppState.orgFilter;
  return `
    <div class="dsc-alert dsc-alert--info dsc-mb-md">
      组织机构树由局供应链管理部统一维护（局—二级—三级两级架构）：<strong>一级局总部 ${ORG_STATS.l1}</strong> ｜ <strong>纳入考核二级单位 ${ORG_STATS.l2}</strong> ｜ <strong>下属三级单位 ${ORG_STATS.l3}</strong> ｜ <strong>状态正常 ${ORG_STATS_EXT.normal}</strong> ｜ <strong>停用/挂起 ${ORG_STATS_EXT.suspended}</strong>。<br/>
      三级单位自动继承上级二级单位业态标签（主业 / 海外 / 投资）；停用单位历史数据物理封存，当月不满周期的新设单位自动跳过当月考核；组织划转时历史月份台账按"发生时机构代码"只读锁定。
    </div>
    <div class="dsc-filter-bar" style="box-shadow:none;padding:0 0 var(--space-lg) 0;">
      <div class="dsc-filter-bar__item">
        <span class="dsc-filter-bar__label">机构名称：</span>
        <input class="dsc-input" id="orgNameFilter" style="width:190px;" placeholder="机构名称或编码" value="${f.name || ''}" oninput="applyOrgFilter()" />
      </div>
      <div class="dsc-filter-bar__item">
        <span class="dsc-filter-bar__label">业态：</span>
        <select class="dsc-select" id="orgBizFilter" onchange="applyOrgFilter()">
          <option value="">全部</option>
          <option ${f.biz === '主业' ? 'selected' : ''}>主业</option>
          <option ${f.biz === '海外' ? 'selected' : ''}>海外</option>
          <option ${f.biz === '投资' ? 'selected' : ''}>投资</option>
        </select>
      </div>
      <div class="dsc-filter-bar__item">
        <span class="dsc-filter-bar__label">层级：</span>
        <select class="dsc-select" id="orgLevelFilter" onchange="applyOrgFilter()">
          <option value="">全部</option>
          <option ${f.level === '二级单位' ? 'selected' : ''}>二级单位</option>
          <option ${f.level === '三级单位' ? 'selected' : ''}>三级单位</option>
        </select>
      </div>
      <button class="dsc-btn dsc-btn--default dsc-btn--sm" onclick="expandToSecondLevel()">展开到二级</button>
      <button class="dsc-btn dsc-btn--default dsc-btn--sm" onclick="expandAllTertiary()">展开全部三级</button>
      <button class="dsc-btn dsc-btn--default dsc-btn--sm" onclick="expandAllOrg(false)">全部折叠</button>
      <button class="dsc-btn dsc-btn--primary dsc-btn--sm" onclick="resetOrgFilter()">重置</button>
    </div>
    <div class="dsc-table-wrapper">
      <table class="dsc-table">
        <thead>
          <tr>
            <th>组织机构名称</th><th>组织编码</th><th>层级类型</th><th>适用业态</th><th>自主考评状态</th><th>上级组织</th><th>下属单位/项目数</th><th>运行状态</th><th>操作</th>
          </tr>
        </thead>
        <tbody id="orgTreeBody">${buildOrgRows().join('')}</tbody>
      </table>
    </div>
    <div class="dsc-pagination"><span id="orgTreeSummary">当前展示 ${buildOrgRows().length} 行（局总部 1 / 二级 ${ORG_STATS.l2} / 三级 ${ORG_STATS.l3}）</span></div>
  `;
}

function refreshOrgTree() {
  const tbody = document.getElementById('orgTreeBody');
  if (!tbody) return;
  const rows = buildOrgRows();
  tbody.innerHTML = rows.join('');
  updateEmptyRow(tbody);
  const sum = document.getElementById('orgTreeSummary');
  if (sum) sum.textContent = `当前展示 ${rows.length} 行（局总部 1 / 二级 ${ORG_STATS.l2} / 三级 ${ORG_STATS.l3}）`;
}

function applyOrgFilter() {
  const n = document.getElementById('orgNameFilter');
  const b = document.getElementById('orgBizFilter');
  const l = document.getElementById('orgLevelFilter');
  AppState.orgFilter = { name: n ? n.value : '', biz: b ? b.value : '', level: l ? l.value : '' };
  refreshOrgTree();
}

function resetOrgFilter() {
  AppState.orgFilter = { name: '', biz: '', level: '' };
  const container = document.getElementById('pageContainer');
  container.innerHTML = renderRulesConfigPage();
  initRulesConfigPage();
}

function expandAllOrg(expand) {
  const walk = (n) => { AppState.orgExpanded[n.org_id] = expand; (n.children || []).forEach(walk); };
  walk(ORG_TREE);
  refreshOrgTree();
}

// P0-3 渐进披露：仅展开到二级（28 行）
function expandToSecondLevel() {
  AppState.orgExpanded = {};
  AppState.orgExpanded[ORG_TREE.org_id] = true;
  ORG_TREE.children.forEach(u => { AppState.orgExpanded[u.org_id] = false; });
  refreshOrgTree();
}

// P0-3 深展开（含 161 家三级）——列表容器内滚动，不再撑长整页
function expandAllTertiary() {
  const walk = (n) => { AppState.orgExpanded[n.org_id] = true; (n.children || []).forEach(walk); };
  walk(ORG_TREE);
  refreshOrgTree();
}

function toggleOrgNode(orgId) {
  AppState.orgExpanded[orgId] = !AppState.orgExpanded[orgId];
  refreshOrgTree();
}

// 差异化阈值二级→三级分解说明（V3.0）
function openOrgThresholdHint(orgName) {
  const rows = (typeof UNIT_THRESHOLDS !== 'undefined' ? UNIT_THRESHOLDS : []).map(t => `
    <tr>
      <td><strong>${t.indicator}</strong></td>
      <td class="dsc-font-sm">${t.period}</td>
      <td class="dsc-table__num">${t.score}</td>
      <td class="dsc-font-sm">${t.rows.map(r => `${r.unit} ${r.value}`).join('；')}</td>
    </tr>`).join('');
  openModal(`差异化目标分解 - ${orgName}`, `
    <div class="dsc-alert dsc-alert--info">
      ⓘ 局侧差异化阈值（分包工程集中采购率 4 档 / 物资设备集中采购率 4 档）可由二级单位向所属三级单位进一步分解下达；分解后的目标值<strong>仅作用于二级自主考评（二级自主考评）</strong>，不影响局考二级得分与排名。
    </div>
    <table class="dsc-table">
      <thead><tr><th>指标</th><th>考核周期</th><th>分值</th><th>当前阈值档位</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `, false);
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
          <div class="dsc-tabs__item ${AppState.rulesTab === 'org' ? 'dsc-tabs__item--active' : ''}" data-tab="org">组织机构树（${ORG_STATS.l2}家二级/${ORG_STATS.l3}家三级）</div>
          <div class="dsc-tabs__item ${AppState.rulesTab === 'indicators' ? 'dsc-tabs__item--active' : ''}" data-tab="indicators">指标库管理（三业态33项）</div>
          <div class="dsc-tabs__item ${AppState.rulesTab === 'platform-rules' ? 'dsc-tabs__item--active' : ''}" data-tab="platform-rules">平台应用考核规则</div>
          <div class="dsc-tabs__item ${AppState.rulesTab === 'templates' ? 'dsc-tabs__item--active' : ''}" data-tab="templates">计分模板配置</div>
        </div>
      </div>
      <div class="dsc-card__body">
        <!-- 组织机构树（V3.0 新增） -->
        <div id="tab-org" class="tab-content" style="${AppState.rulesTab === 'org' ? '' : 'display:none;'}">
          ${renderOrgTreeTab()}
        </div>
        <!-- 指标库管理 -->
        <div id="tab-indicators" class="tab-content" style="${AppState.rulesTab === 'indicators' ? '' : 'display:none;'}">
          <div class="dsc-alert dsc-alert--info dsc-mb-md">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" class="dsc-icon-inline"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.2"/></svg>三业态独立考核标准表（2026年7月修订版）：${BIZ_TOTALS.map(b => `<strong>${b.biz}</strong>&nbsp;${b.count}项 / 总分${b.total}分`).join('<span style="margin:0 12px;color:var(--color-border);">|</span>')}<span style="margin-left:12px;">类别分值合计已校验</span><br/><span class="dsc-font-sm dsc-text-tertiary">色彩图例：<span class="dsc-tag dsc-tag--info dsc-tag--sm">主业</span> <span class="dsc-tag dsc-tag--success dsc-tag--sm">海外</span> <span class="dsc-tag dsc-tag--warning dsc-tag--sm">投资</span> 表示业态；<span class="dsc-tag dsc-tag--outline dsc-tag--sm">描边标签</span> 表示类别 / 来源等中性分类（不承载状态语义）</span>
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
                    <td><span class="dsc-tag dsc-tag--outline">${r.category}</span></td>
                    <td><strong>${r.name}</strong></td>
                    <td>${r.applicable}</td>
                    <td><span class="dsc-tag dsc-tag--outline">${r.proof}</span></td>
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
            
            
          </div>
        </div>
        <!-- 平台应用考核规则 -->
        <div id="tab-platform-rules" class="tab-content" style="display:none;">
          <div class="dsc-alert dsc-alert--info">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" class="dsc-icon-inline"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.2"/></svg>平台应用考核子表项（2026年7月修订版，13项，100分制），得分×0.06折算计入主业"数字供应链平台应用"（6分）。较6月前版本移出"采购成本降低率异常数据""物资设备采购效益异常数据"两项，并入整体考核"数据治理"指标。<strong>V3.1 起其中 ${PLATFORM_RULES.filter(r => (r.fetch_mode || '').indexOf('考核员编辑') >= 0).length} 项为「平台抽取+考核员编辑」</strong>，考核员可在 26 日抽取台账上直接二次编辑或 Excel 批量导入覆盖；其余 ${PLATFORM_RULES.filter(r => (r.fetch_mode || '').indexOf('考核员编辑') < 0).length} 项为「平台全自动抽取」，不接受人工覆盖。
          </div>
          <div class="dsc-table-wrapper">
            <table class="dsc-table">
              <thead>
                <tr>
                  <th>序号</th><th>考核维度</th><th>考核指标</th><th>取数方式</th><th>考核信息化平台</th><th>考核模块</th><th>平台功能模块</th><th>考核规则</th><th>分数</th><th>备注</th>
                </tr>
              </thead>
              <tbody>
                ${PLATFORM_RULES.map(r => {
                  const needEdit = (r.fetch_mode || '').indexOf('考核员编辑') >= 0;
                  return `
                  <tr>
                    <td>${r.id}</td>
                    <td><span class="dsc-tag dsc-tag--outline">${r.dimension}</span></td>
                    <td><strong>${r.indicator}</strong></td>
                    <td><span class="dsc-tag ${needEdit ? 'dsc-tag--primary' : 'dsc-tag--default'}">${r.fetch_mode || '平台全自动抽取'}</span></td>
                    <td>${r.platform}</td>
                    <td>${r.module}</td>
                    <td>${r.funcModule}</td>
                    <td style="max-width:300px;font-size:12px;">${r.rule.length > 100 ? r.rule.substring(0,100)+'...' : r.rule}</td>
                    <td class="dsc-table__num"><strong>${r.score}</strong></td>
                    <td class="dsc-font-sm dsc-text-tertiary">${r.note || ''}</td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
          <div class="dsc-pagination">
            <span>共 ${PLATFORM_RULES.length} 条</span>
            
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
            <select class="dsc-select dsc-w-full"><option>累计扣分封顶（子表上限10分）</option><option>上不封顶（扣至0分为止）</option><option>整体清零（一票否决）</option></select>
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
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" class="dsc-icon-inline"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.2"/></svg>月度满分 = 当月生效指标分值之和（非生效指标不计入当月满分）。<strong>新标准自2026年7月起适用</strong>（蓝色列）；资源白名单<strong>年末考核</strong>（12月一次性计分并计入当月满分）。绿色列为季度考核月（3/6/9/12月）。
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
    <div class="dsc-alert dsc-alert--info"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" class="dsc-icon-inline"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.2"/></svg>为「${indicator}」配置单位差异化目标值，跑批时按「指标 × 业态 × 二级单位」三元组取值。</div>
    <div class="dsc-form-row dsc-form-row--2">
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">二级单位</label>
        <select class="dsc-select dsc-w-full">${unitOptions}</select>
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
  updateEmptyRow(document.querySelector('#tab-indicators tbody'));
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
      AppState.rulesTab = target;
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
// 页面2: 数据采集、二次编辑与检查登记中心
// ============================================================
const COLLECT_TAB_GROUPS = [
  { key: 'main', label: '主业考核指标', list: DATA_COLLECTION_TASKS },
  { key: 'overseas', label: '海外考核指标', list: OVERSEAS_COLLECTION_TASKS },
  { key: 'invest', label: '投资考核指标', list: INVEST_COLLECTION_TASKS },
  { key: 'platform', label: '平台应用子表', list: PLATFORM_COLLECTION_TASKS },
];
const COLLECT_TYPE_LABEL = { main: '主业考核指标', overseas: '海外考核指标', invest: '投资考核指标', platform: '平台应用考核子表项' };

function renderDataCollectionPage() {
  const activeTab = AppState.collectTab || 'main';
  const activeSec = AppState.collectSection || 'auto';
  const autoTotal = COLLECT_TAB_GROUPS.reduce((n, g) => n + g.list.length, 0);
  const overdueCnt = REPORTING_TASKS.filter(t => t.status === 'overdue').length;
  // P1-1 页内分区（原 9 张表纵向堆叠 → 5 个分区，消除 6 屏长滚动）
  const EXTRACT_GROUPS = [
    { key: 'main', label: '主业', biz: '主业' },
    { key: 'overseas', label: '海外', biz: '海外' },
    { key: 'invest', label: '投资', biz: '投资' },
    { key: 'platform', label: '平台子表', biz: '平台子表' },
  ].map(g => Object.assign(g, { list: EXTRACT_ADJUST_RECORDS.filter(r => r.biz === g.biz) }));
  const COLLECT_SECTIONS = [
    { key: 'extract', label: '平台抽取数据台账与二次编辑', badge: EXTRACT_ADJUST_RECORDS.length },
    { key: 'inspection', label: '合规检查与扣分事实登记台', badge: INSPECTION_EVENTS.length },
    { key: 'reporting', label: '报送任务监控与核验', badge: overdueCnt },
    { key: 'exception', label: '异常数据拦截底表', badge: EXCEPTION_RECORDS.filter(e => e.status === 'pending').length },
  ];

  return `
    <div class="dsc-page-header">
      <h1 class="dsc-page-header__title">数据采集与编辑</h1>
      <div class="dsc-page-header__actions">
        <button class="dsc-btn dsc-btn--primary" onclick="triggerManualCollect(this)">+ 手动触发采集</button>
        <button class="dsc-btn dsc-btn--default" onclick="openImportModal()"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="dsc-icon-inline"><path d="M8 1.5V11M4.5 7.5L8 11l3.5-3.5"/><path d="M2 13.5h12"/></svg>Excel模板导入</button>
      </div>
    </div>

    <!-- 统计卡片（V3.1：4 列） -->
    <div class="dsc-stat-row">
      <div class="dsc-stat-card" style="cursor:pointer;" title="点击查看平台抽取台账" onclick="switchCollectSection('extract')">
        <div class="dsc-stat-card__label">平台自动采集任务数</div>
        <div class="dsc-stat-card__value">${autoTotal}</div>
        <div class="dsc-stat-card__footer">主表 33 项 + 平台子表 13 项，共 46 项任务全量监控</div>
      </div>
      <div class="dsc-stat-card" style="cursor:pointer;" title="点击查看台账中已人工修正的记录" onclick="switchCollectSection('extract');applyExtractFilter('modified');">
        <div class="dsc-stat-card__label">考核员二次编辑覆盖笔数</div>
        <div class="dsc-stat-card__value dsc-stat-card__value--primary">${EXTRACT_EDIT_STATS.modified}</div>
        <div class="dsc-stat-card__footer">共 ${EXTRACT_EDIT_STATS.total} 条抽取记录，其中 ${EXTRACT_EDIT_STATS.autoOnly} 条由系统自动计算
          <button class="dsc-btn dsc-btn--text dsc-btn--sm dsc-text-primary" onclick="openBatchImportModal()">[批量导入数据]</button>
        </div>
      </div>
      <div class="dsc-stat-card" style="cursor:pointer;" title="点击查看合规检查登记台" onclick="switchCollectSection('inspection')">
        <div class="dsc-stat-card__label">合规检查扣分录入笔数</div>
        <div class="dsc-stat-card__value dsc-stat-card__value--danger">${INSPECTION_EVENTS.length}</div>
        <div class="dsc-stat-card__footer">一标一检 / 审计巡视 / 验收抽查；待复核 ${INSPECTION_EVENTS.filter(e => e.audit_status === '待复核').length} 笔</div>
      </div>
      <div class="dsc-stat-card" style="cursor:pointer;" title="点击查看报送任务" onclick="switchCollectSection('reporting')">
        <div class="dsc-stat-card__label">报送任务监控</div>
        <div class="dsc-stat-card__value dsc-stat-card__value--primary">${REPORTING_TASKS.length}</div>
        <div class="dsc-stat-card__footer">逾期 ${overdueCnt} 项已自动标记「不报送晚报送不得分」</div>
      </div>
    </div>

    <!-- P1-1 页内分区 Tab 栏 -->
    <div class="dsc-tabs dsc-mb-md" id="collectSecTabs">
      ${COLLECT_SECTIONS.map(s => `<div class="dsc-tabs__item ${activeSec === s.key ? 'dsc-tabs__item--active' : ''}" data-sec="${s.key}" onclick="switchCollectSection('${s.key}')">${s.label}${s.badge ? ` <span class="dsc-tag dsc-tag--warning dsc-tag--sm" style="margin-left:4px;">${s.badge}</span>` : ''}</div>`).join('')}
    </div>

    <!-- V3.1 合规检查与扣分事实登记台（新增输入端） -->
    <div class="dsc-card" id="inspectionRegisterCard" data-collect-sec="inspection">
      <div class="dsc-card__header">
        <span class="dsc-card__title">合规检查与扣分事实登记台 <span class="dsc-tag dsc-tag--info" style="margin-left:8px;">${INSPECTION_EVENTS.length}笔</span></span>
        <div class="dsc-flex dsc-gap-sm">
          <button class="dsc-btn dsc-btn--primary dsc-btn--sm" onclick="openInspectionEventModal()">+ 登记检查扣分事实</button>
          <button class="dsc-btn dsc-btn--default dsc-btn--sm" onclick="showToast('检查通报 Excel 批量导入：请选择一标一检 / 审计巡视通报文件','info')">批量导入检查通报</button>
        </div>
      </div>
      <div class="dsc-card__body--no-padding">
        <div class="dsc-alert dsc-alert--info" style="margin:var(--space-lg) var(--space-xl) var(--space-md);">
          ⓘ 本登记台为合规管理类扣分的<strong>唯一输入端</strong>：扣分事实须关联责任二级与穿透责任三级（同时用于局考穿透切片与二级自主考评落级），并上传正式检查底稿或会签通报后方可生效。
        </div>
        <div class="dsc-table-wrapper">
          <table class="dsc-table">
            <thead>
              <tr><th>事件编号</th><th>检查类型</th><th>责任二级</th><th>穿透责任三级</th><th>涉事工程</th><th>违规事实摘要</th><th>拟扣分值</th><th>通报附件</th><th>审核状态</th><th>操作</th></tr>
            </thead>
            <tbody>
              ${INSPECTION_EVENTS.map(e => {
                const st = e.audit_status === '已生效' ? 'dsc-tag--success' : e.audit_status === '待复核' ? 'dsc-tag--warning' : 'dsc-tag--default';
                return `
                <tr>
                  <td class="dsc-tree-code">${e.event_id}</td>
                  <td><span class="dsc-tag dsc-tag--warning dsc-tag--sm">${e.inspection_type}</span></td>
                  <td>${e.target_l2_name}</td>
                  <td><span class="dsc-tag dsc-tag--info">${e.target_l3_name}</span></td>
                  <td class="dsc-font-sm">${e.project_name}</td>
                  <td class="dsc-font-sm" style="max-width:260px;">${e.issue_summary}</td>
                  <td class="dsc-table__num"><strong class="dsc-text-danger">${e.deduct_points}</strong></td>
                  <td class="dsc-font-sm dsc-text-tertiary">附件：${e.report_file_name}</td>
                  <td><span class="dsc-tag ${st}">${e.audit_status}</span></td>
                  <td class="dsc-table__actions">
                    ${e.audit_status === '待复核' ? `<button class="dsc-btn dsc-btn--text dsc-btn--sm dsc-text-success" onclick="showToast('已复核生效：${e.event_id}','success')">复核生效</button>` : ''}
                    <button class="dsc-btn dsc-btn--text dsc-btn--sm" onclick="viewInspectionEvent('${e.event_id}')">查看</button>
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
        <div class="dsc-pagination"><span>共 ${INSPECTION_EVENTS.length} 笔检查扣分事件</span></div>
      </div>
    </div>

    <!-- V3.1 Tab1：平台抽取数据台账与二次编辑（核心业务台账） -->
    <div class="dsc-card" data-collect-sec="extract">
      <div class="dsc-card__header">
        <span class="dsc-card__title">平台抽取数据台账与二次编辑</span>
        <div class="dsc-flex dsc-gap-sm">
          <button class="dsc-btn dsc-btn--default dsc-btn--sm" onclick="downloadAdjustTemplate(this)">下载二次编辑调整模板 Excel</button>
          <button class="dsc-btn dsc-btn--primary dsc-btn--sm" onclick="openBatchImportModal()">批量导入调整数据</button>
        </div>
      </div>
      <div class="dsc-card__body">
        <div class="dsc-tabs dsc-mb-md" id="collectTabs">
          ${EXTRACT_GROUPS.map(g => `<div class="dsc-tabs__item ${activeTab === g.key ? 'dsc-tabs__item--active' : ''}" data-tab="${g.key}">${g.label}（${g.list.length}项）</div>`).join('')}
        </div>
        <div class="dsc-filter-bar" style="box-shadow:none;padding:0 0 var(--space-md) 0;">
          <div class="dsc-filter-bar__item">
            <span class="dsc-filter-bar__label">过滤：</span>
            <select class="dsc-select" id="extractFilter" onchange="applyExtractFilter(this.value)">
              <option value="">全部抽取记录</option>
              <option value="modified">仅看人工已修改记录</option>
            </select>
          </div>
          <span class="dsc-font-sm dsc-text-tertiary">「系统自动抽取值」与「最终生效计算值」双值对照；人工覆盖全程留痕，跑批优先采用最终生效值。</span>
        </div>
        ${EXTRACT_GROUPS.map(g => `
          <div id="collectTab-${g.key}" style="${activeTab === g.key ? '' : 'display:none;'}">
            <div class="dsc-table-wrapper">
              <table class="dsc-table">
                <thead>
                  <tr><th>序号</th><th>考核对象单位</th><th>考核指标名称</th><th>归属维度/子表</th><th>系统自动抽取值</th><th>最终生效计算值</th><th>取值状态</th><th>修正理由/凭证</th><th>修改人与时间</th><th>操作</th></tr>
                </thead>
                <tbody>${g.list.map((r, i) => extractRowHtml(r, i + 1)).join('')}</tbody>
              </table>
            </div>
            <div class="dsc-pagination"><span>共 ${g.list.length} 条抽取记录（含人工修正 ${g.list.filter(r => r.is_manual_modified).length} 条）</span></div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- 报送管理 -->
    <div class="dsc-card" data-collect-sec="reporting">
      <div class="dsc-card__header">
        <span class="dsc-card__title">报送管理（截止日提醒与逾期标记 · 含三级下沉报送）</span>
        <div class="dsc-flex dsc-gap-sm">
          <select class="dsc-select" id="reportStatusFilter" style="width:130px;"><option value="">全部状态</option><option>按时报送</option><option>逾期</option><option>待报送</option></select>
          <button class="dsc-btn dsc-btn--default dsc-btn--sm">批量催报</button>
        </div>
      </div>
      <div class="dsc-card__body--no-padding">
        <div class="dsc-table-wrapper">
          <table class="dsc-table">
            <thead>
              <tr><th>序号</th><th>报送事项</th><th>报送单位</th><th>填报主体层级</th><th>业态</th><th>报送内容</th><th>报送截止</th><th>实际报送</th><th>状态</th><th>逾期标记</th><th>操作</th></tr>
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
                    <td><span class="dsc-tag ${t.level === '三级报送' ? 'dsc-tag--warning' : 'dsc-tag--default'} dsc-tag--sm">${t.level || '二级报送'}</span></td>
                    <td><span class="dsc-tag ${SCORE_BOARD_BIZ_TAG[t.biz] || 'dsc-tag--default'}">${t.biz}</span></td>
                    <td class="dsc-font-sm">${t.content}</td>
                    <td class="dsc-font-sm">${t.deadline}</td>
                    <td class="dsc-font-sm">${t.submitTime}</td>
                    <td><span class="dsc-tag ${sTag}" data-status="${sText}">${sText}</span></td>
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
        <div class="dsc-pagination"><span>共 ${REPORTING_TASKS.length} 条</span></div>
      </div>
    </div>

    <!-- 查验评分 -->
    <div class="dsc-card" data-collect-sec="reporting">
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
        <div class="dsc-pagination"><span>共 ${INSPECTION_RECORDS.length} 条</span></div>
      </div>
    </div>

    <!-- 异常数据拦截 -->
    <div class="dsc-card" data-collect-sec="exception">
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
  // P1-1 应用当前分区显隐（初始化不触发滚动）
  applyCollectSection(true);

  // 报送管理状态筛选
  const rf = document.getElementById('reportStatusFilter');
  if (rf) rf.addEventListener('change', function() {
    const val = this.value;
    document.querySelectorAll('#reportingTable tr').forEach(row => {
      if (!val || val === '全部状态') { row.style.display = ''; return; }
      const statusTag = row.querySelector('[data-status]');
      row.style.display = statusTag && statusTag.textContent === val ? '' : 'none';
    });
    updateEmptyRow(document.getElementById('reportingTable'));
  });
}

// ============================================================
// V3.1 M2：平台抽取数据台账 —— 二次编辑 / 批量导入 / 撤销重置
// 依据 PRD §2.2.2 (1)fact_extract_adjust_table、(2)modal_single_edit_score、(3)modal_batch_import_adjust
// ============================================================
// 台账行：系统自动抽取值 vs 最终生效计算值 双值对照
function extractRowHtml(r, seq) {
  const modified = !!r.is_manual_modified;
  const statusTag = modified ? 'dsc-tag--info' : 'dsc-tag--default';
  const statusText = modified ? '考核员已修正' : '系统自动计算';
  return `<tr data-modified="${modified ? '1' : '0'}">
    <td>${seq}</td>
    <td><strong>${r.target_org_name}</strong><div class="dsc-font-sm dsc-text-tertiary">${r.short_org}</div></td>
    <td><span class="dsc-tag dsc-tag--outline dsc-tag--sm">${r.indicator_name}</span></td>
    <td class="dsc-font-sm">${r.dimension_name}</td>
    <td class="dsc-tree-code">${r.system_extracted_value}</td>
    <td><strong class="${modified ? 'dsc-text-primary' : ''}">${r.final_effective_value}</strong></td>
    <td><span class="dsc-tag ${statusTag} dsc-tag--sm">${statusText}</span></td>
    <td class="dsc-font-sm" style="max-width:220px;">${modified ? `<div class="dsc-clamp-2 dsc-tooltip" data-tip="${r.modify_reason_desc}">${r.modify_reason_desc}</div>` : '<span class="dsc-text-tertiary">—</span>'}</td>
    <td class="dsc-font-sm dsc-text-tertiary">${r.modified_by_info || '—'}</td>
    <td class="dsc-table__actions">
      <button class="dsc-btn dsc-btn--text dsc-btn--sm dsc-text-primary" onclick="openSingleEditModal('${r.record_id}')">二次编辑</button>
      ${modified ? `<button class="dsc-btn dsc-btn--text dsc-btn--sm dsc-text-danger" onclick="revokeAdjust('${r.record_id}')">撤销重置</button>` : ''}
      <button class="dsc-btn dsc-btn--text dsc-btn--sm" onclick="viewExtractVoucher('${r.record_id}')">查验单据底表</button>
    </td>
  </tr>`;
}

// 「过滤：仅看人工已修改记录」
function applyExtractFilter(val) {
  const activeTab = AppState.collectTab || 'main';
  const tbody = document.querySelector('#collectTab-' + activeTab + ' tbody');
  if (!tbody) return;
  Array.from(tbody.rows).forEach(row => {
    if (row.classList.contains('dsc-empty-row')) return;
    const isMod = row.dataset.modified === '1';
    row.style.display = (val === 'modified' && !isMod) ? 'none' : '';
  });
  updateEmptyRow(tbody);
  const sel = document.getElementById('extractFilter');
  if (sel && sel.value !== (val || '')) sel.value = val || '';
}

// (2) 考核员单条二次编辑弹窗
function openSingleEditModal(recordId) {
  const r = (typeof EXTRACT_ADJUST_RECORDS !== 'undefined' ? EXTRACT_ADJUST_RECORDS : []).find(x => x.record_id === recordId);
  if (!r) { showToast('未找到该抽取记录', 'warning'); return; }
  const modified = !!r.is_manual_modified;
  openModal('考核员二次编辑 - ' + r.indicator_name, `
    <div class="dsc-alert dsc-alert--info">ⓘ 二次编辑将<strong>直接替代系统自动抽取的初始数值与得分</strong>；跑批优先采用最终生效值，原值比对与修改留痕永久保存。</div>
    <div class="dsc-form-group dsc-mb-lg">
      <label class="dsc-form-label">考核单位与指标</label>
      <input class="dsc-input" value="${r.target_org_name} · ${r.indicator_name}" readonly />
    </div>
    <div class="dsc-form-group dsc-mb-lg">
      <label class="dsc-form-label">系统自动抽取原值（只读）</label>
      <input class="dsc-input" value="${r.system_extracted_value}" readonly />
    </div>
    <div class="dsc-form-group dsc-mb-lg">
      <label class="dsc-form-label dsc-form-label--required">调整后最终生效值</label>
      <input class="dsc-input" id="seNewValue" value="${modified ? r.final_effective_value : ''}" placeholder="直接录入替换后的数值或得分（如 0.0分 (核验合规，不扣分)）" />
    </div>
    <div class="dsc-form-group dsc-mb-lg">
      <label class="dsc-form-label dsc-form-label--required">调整依据与说明</label>
      <textarea class="dsc-textarea" id="seReason" placeholder="不少于 10 字，详细说明为何覆盖系统原值">${modified ? r.modify_reason_desc : ''}</textarea>
    </div>
    <div class="dsc-form-group">
      <label class="dsc-form-label">支撑证明附件</label>
      <input class="dsc-input" type="file" multiple accept=".pdf,.png,.jpg,.jpeg" />
      <div class="dsc-font-sm dsc-text-tertiary" style="margin-top:4px;">可选：上传现场核查单或特批会议纪要（PDF / 图片）</div>
    </div>
  `, true);
  document.getElementById('modalConfirm').onclick = function () {
    const val = (document.getElementById('seNewValue') || {}).value || '';
    const reason = (document.getElementById('seReason') || {}).value || '';
    if (!val.trim()) { showToast('「调整后最终生效值」为必填项', 'warning'); return; }
    if (reason.trim().length < 10) { showToast('「调整依据与说明」为必填项，且不少于 10 个字', 'warning'); return; }
    r.final_effective_value = val.trim();
    r.modify_reason_desc = reason.trim();
    r.is_manual_modified = true;
    r.value_status = 'MANUAL_MODIFIED';
    r.modified_by_info = '张考核 (07-26 ' + String(new Date().getHours()).padStart(2, '0') + ':' + String(new Date().getMinutes()).padStart(2, '0') + ')';
    closeModal();
    showToast('二次编辑已生效：最终生效值已覆盖系统抽取值，修改留痕已保存', 'success');
    const container = document.getElementById('pageContainer');
    container.innerHTML = renderDataCollectionPage();
    initDataCollectionPage();
  };
}

// 撤销重置：恢复系统自动抽取值
function revokeAdjust(recordId) {
  const r = (typeof EXTRACT_ADJUST_RECORDS !== 'undefined' ? EXTRACT_ADJUST_RECORDS : []).find(x => x.record_id === recordId);
  if (!r) return;
  openModal('撤销重置二次编辑', `
    <div class="dsc-alert dsc-alert--warning">⚠ 将撤销「${r.target_org_name} · ${r.indicator_name}」的人工修正，最终生效值恢复为系统自动抽取值 <strong>${r.system_extracted_value}</strong>。原修改记录仍保留在历史留痕中。</div>
  `, true);
  document.getElementById('modalConfirm').onclick = function () {
    r.final_effective_value = r.system_extracted_value;
    r.is_manual_modified = false;
    r.value_status = 'AUTO_CALCULATED';
    r.modify_reason_desc = null;
    r.modified_by_info = null;
    closeModal();
    showToast('已撤销人工修正，恢复为系统自动计算值', 'success');
    const container = document.getElementById('pageContainer');
    container.innerHTML = renderDataCollectionPage();
    initDataCollectionPage();
  };
}

// 查验单据底表（只读）
function viewExtractVoucher(recordId) {
  const r = (typeof EXTRACT_ADJUST_RECORDS !== 'undefined' ? EXTRACT_ADJUST_RECORDS : []).find(x => x.record_id === recordId);
  if (!r) { showToast('未找到该抽取记录', 'warning'); return; }
  openModal('查验单据底表 - ' + r.record_id, `
    <table class="dsc-table">
      <tbody>
        <tr><td style="width:150px;" class="dsc-cell-label">考核对象单位</td><td>${r.target_org_name}</td></tr>
        <tr><td class="dsc-cell-label">考核指标</td><td>${r.indicator_name}</td></tr>
        <tr><td class="dsc-cell-label">归属维度/子表</td><td>${r.dimension_name}</td></tr>
        <tr><td class="dsc-cell-label">系统自动抽取值</td><td class="dsc-tree-code">${r.system_extracted_value}</td></tr>
        <tr><td class="dsc-cell-label">最终生效计算值</td><td><strong>${r.final_effective_value}</strong></td></tr>
        <tr><td class="dsc-cell-label">取值状态</td><td><span class="dsc-tag ${r.is_manual_modified ? 'dsc-tag--info' : 'dsc-tag--default'} dsc-tag--sm">${r.is_manual_modified ? '考核员已修正' : '系统自动计算'}</span></td></tr>
        <tr><td class="dsc-cell-label">关联底层单据</td><td class="dsc-tree-code">${r.support_voucher || '—'}</td></tr>
        <tr><td class="dsc-cell-label">修正理由/凭证</td><td class="dsc-font-sm">${r.modify_reason_desc || '—'}</td></tr>
      </tbody>
    </table>
    <div class="dsc-alert dsc-alert--info" style="margin-top:16px;">ⓘ 数据来源：大数据湖 DSC / 数字商务 / 云筑网单据级底表；人工修正后跑批优先采用「最终生效计算值」。</div>
  `, false);
}

// (3) Excel 批量导入调整数据
function openBatchImportModal() {
  const preview = EXTRACT_ADJUST_RECORDS.filter(r => r.is_manual_modified).slice(0, 3);
  openModal('批量导入调整数据', `
    <div class="dsc-form-group dsc-mb-lg">
      <label class="dsc-form-label">模板下载</label>
      <div><button class="dsc-btn dsc-btn--default dsc-btn--sm" onclick="showToast('已下载《月度考核抽取数据二次编辑导入模板.xlsx》','success')">下载二次编辑导入模板.xlsx</button></div>
    </div>
    <div class="dsc-form-group dsc-mb-lg">
      <label class="dsc-form-label dsc-form-label--required">导入文件选择</label>
      <input class="dsc-input" type="file" accept=".xlsx" />
      <div class="dsc-font-sm dsc-text-tertiary" style="margin-top:4px;">仅限 .xlsx 格式，文件大小 ≤ 10MB</div>
    </div>
    <div class="dsc-form-group dsc-mb-lg">
      <label class="dsc-form-label dsc-form-label--required">冲突处理策略</label>
      <div class="dsc-flex dsc-gap-lg dsc-flex--center">
        <label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;"><input type="radio" name="biStrategy" value="OVERWRITE_EXISTING" checked style="width:15px;height:15px;" /><span class="dsc-font-sm">覆盖已有修改（OVERWRITE_EXISTING）</span></label>
        <label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;"><input type="radio" name="biStrategy" value="SKIP_EXISTING" style="width:15px;height:15px;" /><span class="dsc-font-sm">跳过已有修改（SKIP_EXISTING）</span></label>
      </div>
    </div>
    <div class="dsc-form-group">
      <label class="dsc-form-label">数据比对结果预览</label>
      <table class="dsc-table">
        <thead><tr><th>行号</th><th>考核对象单位</th><th>考核指标</th><th>调整后值</th><th>校验结果</th></tr></thead>
        <tbody>
          ${preview.map((r, i) => `<tr>
            <td>${i + 1}</td><td class="dsc-font-sm">${r.short_org}</td><td class="dsc-font-sm">${r.indicator_name}</td>
            <td class="dsc-font-sm"><strong>${r.final_effective_value}</strong></td>
            <td><span class="dsc-tag dsc-tag--success dsc-tag--sm">校验通过</span></td>
          </tr>`).join('')}
          <tr><td>4</td><td class="dsc-font-sm">—</td><td class="dsc-font-sm">指标名称未匹配</td><td class="dsc-font-sm">—</td><td><span class="dsc-tag dsc-tag--danger dsc-tag--sm">校验失败</span></td></tr>
        </tbody>
      </table>
      <div class="dsc-font-sm dsc-text-tertiary" style="margin-top:8px;">解析结果：共 4 行 ｜ 校验通过 3 行 ｜ 错误 1 行；确认后仅入库校验通过行。</div>
    </div>
  `, true);
  document.getElementById('modalConfirm').onclick = function () {
    closeModal();
    showToast('批量导入完成：3 条调整数据已覆盖系统抽取值，1 条错误行已跳过', 'success');
  };
}

function downloadAdjustTemplate(btn) {
  setBtnLoading(btn, '生成中…', 1600, function () {
    showToast('已下载《月度考核抽取数据二次编辑导入模板.xlsx》（含指标编码与校验规则）', 'success');
  });
}

// ============================================================
// V3.1 M2：合规检查扣分事实登记（modal_inspection_event_create）
// ============================================================
function openInspectionEventModal() {
  const typeOptions = Object.keys(INSPECTION_TYPE_RULES).map(t => `<option value="${t}">${t}</option>`).join('');
  const l2Options = ORG_TREE.children.map(u => `<option value="${u.org_name}">${u.org_name}</option>`).join('');
  const html = `
    <div class="dsc-alert dsc-alert--info">ⓘ 登记生效后自动计入局考二级扣分，并按「穿透责任三级」同步生成局考穿透切片与二级自主考评落级依据。</div>
    <div class="dsc-form-row dsc-form-row--2">
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">检查类型</label>
        <select class="dsc-select dsc-w-full" id="ieType" onchange="onInspectionTypeChange()">${typeOptions}</select>
      </div>
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">责任二级单位</label>
        <select class="dsc-select dsc-w-full" id="ieL2" onchange="onInspectionL2Change()">${l2Options}</select>
      </div>
    </div>
    <div class="dsc-form-row dsc-form-row--2">
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">穿透责任三级</label>
        <select class="dsc-select dsc-w-full" id="ieL3"></select>
      </div>
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">拟扣减分值</label>
        <input class="dsc-input" id="iePoints" type="number" step="0.1" value="-0.5" />
      </div>
    </div>
    <div class="dsc-form-row dsc-form-row--2">
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">涉事工程项目</label>
        <input class="dsc-input" id="ieProject" placeholder="手工录入或检索已入湖项目（不少于4个汉字）" />
      </div>
      <div class="dsc-form-group">
        <label class="dsc-form-label">关联单据/合同号</label>
        <input class="dsc-input" id="ieVoucher" placeholder="如合同号、招标流水号（用于底表穿透关联）" />
      </div>
    </div>
    <div class="dsc-form-group dsc-mb-lg">
      <label class="dsc-form-label dsc-form-label--required">违规违纪事实摘要</label>
      <textarea class="dsc-textarea" id="ieSummary" placeholder="如实阐明违规依据与事实（不少于15字）"></textarea>
    </div>
    <div class="dsc-form-group dsc-mb-lg">
      <label class="dsc-form-label dsc-form-label--required">正式通报扫描附件</label>
      <input class="dsc-input" type="file" accept=".pdf,.zip" />
      <div class="dsc-font-sm dsc-text-tertiary" style="margin-top:4px;">必传：正式检查底稿或会签通报（PDF / ZIP）</div>
    </div>
    <div class="dsc-alert dsc-alert--warning" id="ieRuleTip" style="margin-bottom:0;"></div>
  `;
  openModal('登记检查扣分事实', html, true);
  onInspectionTypeChange();
  onInspectionL2Change();
  document.getElementById('modalConfirm').onclick = function () {
    const project = (document.getElementById('ieProject') || {}).value || '';
    const summary = (document.getElementById('ieSummary') || {}).value || '';
    if (project.trim().length < 4) { showToast('「涉事工程项目」为必填项，且不少于 4 个汉字', 'warning'); return; }
    if (summary.trim().length < 15) { showToast('「违规违纪事实摘要」为必填项，且不少于 15 字', 'warning'); return; }
    closeModal();
    showToast('检查扣分事实已登记并进入审批流，生效后将同步计入局考二级扣分与局考穿透切片', 'success');
  };
}

// 检查类型联动扣分步长
function onInspectionTypeChange() {
  const sel = document.getElementById('ieType');
  const tip = document.getElementById('ieRuleTip');
  const pts = document.getElementById('iePoints');
  if (!sel) return;
  const r = INSPECTION_TYPE_RULES[sel.value];
  if (r && tip) {
    tip.innerHTML = `<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" class="dsc-icon-inline"><path d="M8 1.5L15 14H1z"/><path d="M8 6v3.2M8 11.6v.2"/></svg>扣分步长规则（${sel.value}）：${r.note}`;
  }
  if (r && pts) pts.value = (-r.step).toFixed(1);
}

// 责任二级 → 穿透责任三级 联动
function onInspectionL2Change() {
  const l2 = document.getElementById('ieL2');
  const l3 = document.getElementById('ieL3');
  if (!l2 || !l3) return;
  const node = ORG_TREE.children.find(u => u.org_name === l2.value);
  if (!node) return;
  const shortOf = (c) => c.org_name.replace(node.org_name, '') || c.org_name;
  l3.innerHTML = ['二级本部']
    .concat((node.children || []).map(shortOf))
    .map(n => `<option>${n}</option>`).join('');
}

function viewInspectionEvent(eventId) {
  const e = INSPECTION_EVENTS.find(x => x.event_id === eventId);
  if (!e) { showToast('未找到该检查事件', 'warning'); return; }
  openModal(`检查扣分事实 - ${e.event_id}`, `
    <div class="dsc-alert dsc-alert--warning">⚠ ${e.issue_summary}</div>
    <table class="dsc-table">
      <tbody>
        <tr><td style="width:150px;background:var(--color-bg-table-header);font-weight:500;">检查类型</td><td>${e.inspection_type}</td></tr>
        <tr><td class="dsc-cell-label">责任二级单位</td><td>${e.target_l2_name}</td></tr>
        <tr><td class="dsc-cell-label">穿透责任三级</td><td>${e.target_l3_name}</td></tr>
        <tr><td class="dsc-cell-label">涉事工程</td><td>${e.project_name}</td></tr>
        <tr><td class="dsc-cell-label">关联单据/合同号</td><td class="dsc-tree-code">${e.voucher_no}</td></tr>
        <tr><td class="dsc-cell-label">拟扣分值</td><td class="dsc-text-danger"><strong>${e.deduct_points}</strong> 分</td></tr>
        <tr><td class="dsc-cell-label">通报附件</td><td>${e.report_file_name}</td></tr>
        <tr><td class="dsc-cell-label">登记人 / 时间</td><td>${e.operator_name} · ${e.occur_time}</td></tr>
        <tr><td class="dsc-cell-label">审核状态</td><td><span class="dsc-tag ${e.audit_status === '已生效' ? 'dsc-tag--success' : 'dsc-tag--warning'}">${e.audit_status}</span></td></tr>
      </tbody>
    </table>
    <div class="dsc-alert dsc-alert--info" style="margin-top:16px;">ⓘ 生效后该扣分将同时进入：① 局考二级扣分（责任二级）；② 局考穿透追溯切片（穿透责任三级）；③ 二级自主考评落级台账。</div>
  `, false);
}

function switchCollectTab(key) {
  AppState.collectTab = key;
  document.querySelectorAll('#collectTabs .dsc-tabs__item').forEach(t => t.classList.remove('dsc-tabs__item--active'));
  const tabEl = document.querySelector('#collectTabs .dsc-tabs__item[data-tab="' + key + '"]');
  if (tabEl) tabEl.classList.add('dsc-tabs__item--active');
  document.querySelectorAll('[id^="collectTab-"]').forEach(c => c.style.display = 'none');
  const panel = document.getElementById('collectTab-' + key);
  if (panel) panel.style.display = 'block';
  const ef = document.getElementById('extractFilter');
  if (ef) applyExtractFilter(ef.value);
}


// P1-1 采集页内分区切换（含 KPI 卡锚点跳转）
function applyCollectSection(noScroll) {
  const sec = AppState.collectSection || 'auto';
  document.querySelectorAll('#pageContainer [data-collect-sec]').forEach(el => {
    el.style.display = (el.dataset.collectSec === sec) ? '' : 'none';
  });
  document.querySelectorAll('#collectSecTabs .dsc-tabs__item').forEach(t => {
    t.classList.toggle('dsc-tabs__item--active', t.dataset.sec === sec);
  });
  if (!noScroll) {
    const tabs = document.getElementById('collectSecTabs');
    if (tabs) tabs.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function switchCollectSection(key) {
  AppState.collectSection = key;
  applyCollectSection();
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
    <table class="dsc-table dsc-mb-lg">
      <tbody>
        <tr><td style="width:140px;background:var(--color-bg-table-header);font-weight:500;">报送事项</td><td><strong>${t.item}</strong></td></tr>
        <tr><td class="dsc-cell-label">报送单位</td><td>${t.unit}（${t.biz}）</td></tr>
        <tr><td class="dsc-cell-label">报送内容</td><td>${t.content}</td></tr>
        <tr><td class="dsc-cell-label">报送截止</td><td>${t.deadline}</td></tr>
        <tr><td class="dsc-cell-label">实际报送</td><td>${t.submitTime}</td></tr>
        ${t.note ? `<tr><td class="dsc-cell-label">逾期标记</td><td><span class="dsc-tag dsc-tag--danger">${t.note}</span></td></tr>` : ''}
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
        <select class="dsc-select dsc-w-full">${INVEST_UNITS.map(u => `<option>${u}</option>`).join('')}</select>
      </div>
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">查验季度</label>
        <select class="dsc-select dsc-w-full"><option>2026Q3</option><option>2026Q4</option></select>
      </div>
    </div>
    <div class="dsc-form-row dsc-form-row--2">
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">查验方式</label>
        <select class="dsc-select dsc-w-full"><option>供应链过程检查</option><option>常态化督导检查</option><option>标杆示范项目培育</option></select>
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
    <div class="dsc-alert dsc-alert--info"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" class="dsc-icon-inline"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.2"/></svg>查验评分将计入季度末「月度重点工作挂图计划」（20分）考核，季度内按月跟踪报送进度。</div>
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
    <table class="dsc-table dsc-mb-lg">
      <tbody>
        <tr><td style="width:140px;background:var(--color-bg-table-header);font-weight:500;">被查验单位</td><td><strong>${r.unit}</strong>（${r.quarter}）</td></tr>
        <tr><td class="dsc-cell-label">查验方式</td><td>${r.method}</td></tr>
        <tr><td class="dsc-cell-label">查验评分</td><td><strong style="color:var(--color-warning)">${r.score}</strong> / ${r.full}分</td></tr>
        <tr><td class="dsc-cell-label">评分依据</td><td>${r.basis}</td></tr>
        <tr><td class="dsc-cell-label">查验人</td><td>${r.inspector}（${r.time}）</td></tr>
        <tr><td class="dsc-cell-label">计分阶段</td><td><span class="dsc-tag dsc-tag--info">${r.stage}</span></td></tr>
      </tbody>
    </table>
  `;
  openModal(`查验评分详情 - ${r.unit}`, html, false);
}

function triggerManualCollect(btn) {
  setBtnLoading(btn, '采集中…', 2400, function () { showToast('手动采集已触发，预计 3-5 分钟完成', 'info'); });
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
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" class="dsc-icon-inline"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.2"/></svg>采集任务详情 - ${typeLabel}
    </div>
    <table class="dsc-table dsc-mb-lg">
      <tbody>
        <tr><td style="width:140px;background:var(--color-bg-table-header);font-weight:500;">考核指标</td><td><strong>${t.indicator}</strong></td></tr>
        <tr><td class="dsc-cell-label">数据来源</td><td>${t.source}</td></tr>
        <tr><td class="dsc-cell-label">采集方式</td><td>${t.method}</td></tr>
        <tr><td class="dsc-cell-label">定时计划</td><td>${t.schedule}</td></tr>
        <tr><td class="dsc-cell-label">当前状态</td><td><span class="dsc-tag ${t.status==='success'?'dsc-tag--success':t.status==='warning'?'dsc-tag--warning':'dsc-tag--info'}">${statusMap[t.status]||t.status}</span></td></tr>
        <tr><td class="dsc-cell-label">最近执行时间</td><td>${t.lastRun}</td></tr>
        <tr><td class="dsc-cell-label">采集记录数</td><td class="dsc-table__num">${t.records.toLocaleString()}</td></tr>
        <tr><td class="dsc-cell-label">异常记录数</td><td class="dsc-table__num dsc-text-warning">${t.exception}</td></tr>
        ${t.note ? `<tr><td class="dsc-cell-label">备注</td><td class="dsc-font-sm">${t.note}</td></tr>` : ''}
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
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="dsc-icon-inline"><path d="M8 1.5L15 14H1z"/><path d="M8 6v3.2M8 11.6v.2" stroke-linecap="round"/></svg>即将立即执行采集任务，请确认以下信息：
    </div>
    <table class="dsc-table dsc-mb-lg">
      <tbody>
        <tr><td style="width:140px;background:var(--color-bg-table-header);font-weight:500;">考核指标</td><td><strong>${t.indicator}</strong></td></tr>
        <tr><td class="dsc-cell-label">采集方式</td><td>${t.method}</td></tr>
        <tr><td class="dsc-cell-label">定时计划</td><td>${t.schedule}</td></tr>
        <tr><td class="dsc-cell-label">数据来源</td><td>${t.source}</td></tr>
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

// ============================================================
// V3.1 双闸口审批（闸口一：试公示审批；闸口二：正式通报签批）
// ============================================================
function renderGateBanner() {
  const g = GATE_FLOW;
  const role = AppState.currentRole;
  const caps = ((typeof ROLE_PROFILE !== 'undefined' && ROLE_PROFILE[role]) || {}).caps || {};
  const isLeader = !!(caps.gate1 || caps.gate2);
  const cur = g.current;
  const stageIdx = g.stages.findIndex(s => s.code === cur);

  const steps = g.stages.map((s, i) => {
    const cls = i < stageIdx ? 'dsc-steps__item--done' : i === stageIdx ? 'dsc-steps__item--active' : '';
    return `<div class="dsc-steps__item ${cls}"><div class="dsc-steps__num">${i + 1}</div><div class="dsc-steps__label">${s.name}</div></div>`;
  }).join('');

  const noPerm = `<span class="dsc-tag dsc-tag--default dsc-tag--sm dsc-shrink-0">当前角色（${role}）无审批权限 · 请切换至「局供应链部领导」</span>`;
  let actionHtml = '';
  if (cur === 'GATE1_PENDING') {
    actionHtml = isLeader
      ? `<span class="dsc-flex dsc-gap-sm dsc-shrink-0">
           <button class="dsc-btn dsc-btn--primary dsc-btn--sm" onclick="approveGate('gate1', true)">${g.gate1.approveLabel}</button>
           <button class="dsc-btn dsc-btn--default dsc-btn--sm" onclick="approveGate('gate1', false)">${g.gate1.rejectLabel}</button>
         </span>` : noPerm;
  } else if (cur === 'TRIAL_PUBLISHED') {
    actionHtml = `<span class="dsc-flex dsc-gap-sm dsc-shrink-0">
        <button class="dsc-btn dsc-btn--default dsc-btn--sm" onclick="approveGate('gate1', false)">试点期间紧急挂起</button>
        <button class="dsc-btn dsc-btn--primary dsc-btn--sm" onclick="advanceToGate2()">试公示结束 · 提请正式发布</button>
      </span>`;
  } else if (cur === 'GATE2_PENDING') {
    actionHtml = isLeader
      ? `<span class="dsc-shrink-0"><button class="dsc-btn dsc-btn--primary dsc-btn--sm" onclick="approveGate('gate2', true)">${g.gate2.approveLabel}</button></span>` : noPerm;
  } else if (cur === 'OFFICIALLY_PUBLISHED') {
    actionHtml = `<span class="dsc-tag dsc-tag--success dsc-tag--sm dsc-shrink-0">${g.gate2.approvedText}</span>`;
  } else {
    actionHtml = `<span class="dsc-tag dsc-tag--default dsc-tag--sm dsc-shrink-0">跑批执行中，预计 3-5 分钟完成</span>`;
  }

  const pendingText = cur === 'GATE1_PENDING' ? g.gate1.pendingText
    : cur === 'TRIAL_PUBLISHED' ? g.gate1.approvedText
    : cur === 'GATE2_PENDING' ? g.gate2.pendingText
    : cur === 'OFFICIALLY_PUBLISHED' ? g.gate2.approvedText : '系统正在执行局考二级算分与局考穿透切片。';
  const alertCls = (cur === 'GATE1_PENDING' || cur === 'GATE2_PENDING') ? 'dsc-alert--warning'
    : cur === 'TRIAL_PUBLISHED' ? 'dsc-alert--info'
    : cur === 'OFFICIALLY_PUBLISHED' ? 'dsc-alert--success' : 'dsc-alert--info';

  return `
    <div class="dsc-card" id="gateCard">
      <div class="dsc-card__header">
        <span class="dsc-card__title">双闸口审批流程（V3.1）</span>
        <span class="dsc-text-tertiary dsc-font-sm">闸口一：局领导审批试公示 → 试公示 3 天 → 闸口二：局领导签发正式通报并推送画像</span>
      </div>
      <div class="dsc-card__body">
        <div class="dsc-steps dsc-mb-md">${steps}</div>
        <div class="dsc-alert ${alertCls}" style="margin-bottom:0;display:flex;align-items:center;justify-content:space-between;gap:var(--space-md);">
          <span>ⓘ ${pendingText}</span>
          ${actionHtml}
        </div>
      </div>
    </div>
  `;
}

function approveGate(gate, approved) {
  const g = GATE_FLOW;
  if (gate === 'gate1') {
    if (approved) {
      g.current = 'TRIAL_PUBLISHED';
      showToast('闸口一审批通过：试公示已发布，3 天倒计时启动，各二级单位仅可见本公司数据', 'success');
    } else {
      g.current = g.current === 'TRIAL_PUBLISHED' ? 'BATCH_RUNNING' : 'BATCH_RUNNING';
      showToast(g.current === 'BATCH_RUNNING' ? '已执行紧急挂起/退回：全网公示置灰，停止倒计时，要求重新核对底表与算分结果' : '已退回重算', 'warning');
    }
  } else if (approved) {
    g.current = 'OFFICIALLY_PUBLISHED';
    showToast('闸口二已签批：正式月度通报发布，成绩已推送供应链画像系统', 'success');
  } else {
    showToast('已驳回签发，请补充申诉裁决与特批重算材料', 'warning');
  }
  rerenderScoreLedger();
}

function advanceToGate2() {
  GATE_FLOW.current = 'GATE2_PENDING';
  showToast('试公示已结束，申诉裁决与特批重算完成，已提请局领导签发正式通报', 'info');
  rerenderScoreLedger();
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
    <div class="dsc-tabs dsc-mb-md" id="boardTabs">
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
        <button class="dsc-btn dsc-btn--primary" onclick="runMonthlyBatch(this)">执行月度跑批</button>
        <button class="dsc-btn dsc-btn--default" onclick="exportLedger(this)">导出当月台账</button>
      </div>
    </div>

    ${renderGateBanner()}

    <div class="dsc-alert dsc-alert--info">
      ${isNewStd
        ? '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" class="dsc-icon-inline"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.2"/></svg>自<strong>2026年7月</strong>起适用新标准：三业态独立考核标准表（主业84分 / 海外100分 / 投资100分），按月动态满分计分；平台应用按子表100分制×0.06折算；资源白名单年末考核。1—6月旧数据不追溯重算。'
        : '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" class="dsc-icon-inline"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.2"/></svg>2026年6月及以前按6月前旧标准执行（主业满分68分/月）；<strong>自2026年7月起适用新标准</strong>（主业84分 / 海外100分 / 投资100分，动态满分按月计算）。1—6月历史数据不追溯重算。'}
    </div>

    <!-- V3.0 跑批三阶段级联 -->
    <div class="dsc-card">
      <div class="dsc-card__header">
        <span class="dsc-card__title">月度跑批级联（V3.1 三步级联）</span>
        <span class="dsc-text-tertiary dsc-font-sm">局考二级算分 → 局考穿透切片自动生成 → 二级自主考评跑批</span>
      </div>
      <div class="dsc-card__body">
        <div class="dsc-steps dsc-mb-md">
          ${BATCH_STAGES.map((s, i) => `
            <div class="dsc-steps__item ${s.status === 'done' ? 'dsc-steps__item--done' : s.status === 'running' ? 'dsc-steps__item--active' : ''}">
              <div class="dsc-steps__num">${i + 1}</div>
              <div class="dsc-steps__label">${s.label}</div>
            </div>`).join('')}
        </div>
        <div class="dsc-alert dsc-alert--info" style="margin-bottom:0;">
          ${BATCH_STAGES.map((s, i) => `<strong>步骤${i + 1}</strong>：${s.detail}`).join('<br/>')}
        </div>
      </div>
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
                <th>跑批编号</th><th>考核月份</th><th>开始时间</th><th>完成时间</th><th>耗时</th><th>涉及单位</th><th>指标数</th><th>级联阶段</th><th>状态</th><th>得分生成</th><th>操作</th>
              </tr>
            </thead>
            <tbody id="batchLogTable">
              ${BATCH_RUN_LOGS.map(b => {
                const cascade = b.month === '2026年7月'
                  ? BATCH_STAGES.map(s => `<span class="dsc-tag ${BATCH_STAGE_BADGE[s.status]} dsc-tag--sm" style="margin:0 2px;">${s.label}</span>`).join('<span class="dsc-text-tertiary dsc-font-sm">→</span>')
                  : '<span class="dsc-text-tertiary dsc-font-sm">单阶段（旧标准，无三级穿透）</span>';
                return `
                <tr>
                  <td>${b.batchNo}</td>
                  <td><strong>${b.month}</strong></td>
                  <td class="dsc-font-sm">${b.runTime}</td>
                  <td class="dsc-font-sm">${b.finishTime}</td>
                  <td class="dsc-font-sm">约12分钟</td>
                  <td class="dsc-table__num">${b.units}</td>
                  <td class="dsc-table__num">${b.indicators}</td>
                  <td style="min-width:260px;">${cascade}</td>
                  <td><span class="dsc-tag dsc-tag--success">完成</span></td>
                  <td><span class="dsc-tag dsc-tag--success">已生成</span></td>
                  <td class="dsc-table__actions">
                    <button class="dsc-btn dsc-btn--text dsc-btn--sm">查看明细</button>
                    <button class="dsc-btn dsc-btn--text dsc-btn--sm">重新计算</button>
                  </td>
                </tr>`;
              }).join('')}
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

function runMonthlyBatch(btn) {
  setBtnLoading(btn, '跑批中…', 2600, function () { showToast('月度跑批任务已提交：按业态标准表与单位差异化阈值自动算分，预计 3-5 分钟完成', 'info'); });
}

function exportLedger(btn) {
  setBtnLoading(btn, '导出中…', 1800, function () { showToast('当月打分台账已导出（含明细账单、排名看板与三级切片）', 'success'); });
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
  const sliceRows = buildPassthroughFor(unitName);
  const sliceTableHtml = `
    <div class="dsc-alert dsc-alert--info dsc-mb-md">
      ⓘ 本页签为<strong>局考穿透追溯切片</strong>：由系统基于底层单据与项目归属关系自动生成，二级单位<strong>零操作</strong>；不生成三级独立总分，不影响二级得分与排名。
    </div>
    <table class="dsc-table dsc-table--fixed">
      <colgroup>
        <col style="width:11%"><col style="width:9%"><col style="width:11%"><col style="width:9%"><col style="width:9%"><col style="width:11%"><col style="width:14%"><col style="width:14%"><col style="width:12%">
      </colgroup>
      <thead><tr><th>局考一级指标</th><th>二级总体被扣分</th><th>责任三级单位</th><th>切片归属类型</th><th>穿透责任扣分</th><th>指标拖欠贡献率</th><th>底层凭证与项目</th><th>扣分事实认定因由</th><th>业务整改指引</th></tr></thead>
      <tbody>
        ${sliceRows.length ? sliceRows.map(s => `
          <tr>
            <td><strong>${s.indicator_name}</strong></td>
            <td class="dsc-table__num dsc-text-danger">${s.total_deduct}</td>
            <td><span class="dsc-tag dsc-tag--info">${s.tertiary_org_name}</span></td>
            <td><span class="dsc-tag ${s.slice_type === '直接归属' ? 'dsc-tag--warning' : s.slice_type === '贡献分摊' ? 'dsc-tag--info' : 'dsc-tag--default'}">${s.slice_type}</span></td>
            <td class="dsc-table__num">${s.slice_score === null || s.slice_score === undefined ? '—' : `<strong class="dsc-text-danger">${s.slice_score}</strong>`}</td>
            <td>${s.contribution_rate ? `<div class="dsc-progress" style="height:8px;margin-bottom:4px;"><div class="dsc-progress__bar dsc-progress__bar--primary" style="width:${s.contribution_rate}"></div></div><span class="dsc-font-sm">${s.contribution_rate}</span>` : '—'}</td>
            <td class="dsc-font-sm">${s.project_name && s.project_name !== '—' ? `<div class="dsc-clamp-2 dsc-tooltip" data-tip="项目：${s.project_name}｜单据：${s.voucher_no}">[项目] ${s.project_name}<br/>[单据] <span class="dsc-tree-code">${s.voucher_no}</span></div>` : '—'}</td>
            <td class="dsc-font-sm"><div class="dsc-clamp-2 dsc-tooltip" data-tip="${s.reason}">${s.reason}</div></td>
            <td class="dsc-font-sm dsc-text-tertiary"><div class="dsc-clamp-2 dsc-tooltip" data-tip="${s.rectify_guidance || '—'}">${s.rectify_guidance || '—'}</div></td>
          </tr>`).join('') : `<tr><td colspan="9" class="dsc-text-center dsc-text-tertiary" style="padding:24px;">本月该单位无三级归属切片（无直接归属扣分，扣分均由二级本部承担）</td></tr>`}
      </tbody>
    </table>
  `;
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
    ${isNew && bizFull !== undefined ? `<div class="dsc-alert dsc-alert--info"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" class="dsc-icon-inline"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.2"/></svg>2026年7月动态满分按新标准计算（${b} ${bizFull}分），每笔扣分可追溯至实际指标数据、扣分规则与扣分原因。</div>` : ''}
    <div class="dsc-tabs dsc-mb-md" id="unitDetailTabs">
      <div class="dsc-tabs__item dsc-tabs__item--active" data-dtab="detail">指标得分明细（局考口径）</div>
      <div class="dsc-tabs__item" data-dtab="slice">下属三级归属分布（局考穿透切片）</div>
    </div>
    <div id="unitDetail-detail">
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
    </div>
    <div id="unitDetail-slice" style="display:none;">${sliceTableHtml}</div>
  `;

  openModal(`${unit.unit}月度考核得分明细单`, detailHtml, false, 'wide');
  document.querySelectorAll('#unitDetailTabs .dsc-tabs__item').forEach(t => {
    t.addEventListener('click', function() { switchUnitDetailTab(this.dataset.dtab); });
  });
}

// 明细弹窗页签切换（指标得分明细 / 下属三级归属分布）
function switchUnitDetailTab(key) {
  document.querySelectorAll('#unitDetailTabs .dsc-tabs__item').forEach(t => {
    t.classList.toggle('dsc-tabs__item--active', t.dataset.dtab === key);
  });
  ['detail', 'slice'].forEach(k => {
    const el = document.getElementById('unitDetail-' + k);
    if (el) el.style.display = (k === key) ? '' : 'none';
  });
}

// ============================================================
// 页面5 (V3.0 全新): 二级考核专员工作台（二级自主考评三级）
// ============================================================
function renderTertiaryWorkspacePage() {
  const tab = AppState.workspaceTab || 'rule';
  const enabled = AppState.line2Enabled !== false;
  const scores = LINE2_SCORES;
  const published = scores.filter(s => s.status === 'published').length;
  const avgRate = (scores.reduce((n, s) => n + parseFloat(s.score_rate), 0) / scores.length).toFixed(1) + '%';
  const weightSum = LINE2_RULE_CONFIG.filter(r => r.is_enabled).reduce((n, r) => n + r.score_weight, 0);
  const pendingReport = LINE2_REPORTING.filter(r => r.status === '待核验').length;
  const pendingIssue = LINE2_INSPECTION_ISSUES.filter(r => r.status === '待落级').length;

  const tabs = [
    { key: 'rule', label: '独立考核规则管理' },
    { key: 'reporting', label: '三级B类报送核验台' },
    { key: 'inspection', label: '检查问题落级分配台' },
    { key: 'board', label: '下属三级考核成绩与排名看板' },
  ];

  const ruleRows = LINE2_RULE_CONFIG.map(r => `
    <tr>
      <td><button class="dsc-btn dsc-btn--text dsc-btn--sm ${r.is_enabled ? 'dsc-text-success' : 'dsc-text-tertiary'}" onclick="toggleLine2Indicator('${r.indicator_name}')">${r.is_enabled ? '● 已启用' : '○ 已停用'}</button></td>
      <td><span class="dsc-tag dsc-tag--outline">${r.category}</span></td>
      <td><strong>${r.indicator_name}</strong></td>
      <td class="dsc-table__num"><input class="dsc-input" style="width:70px;height:28px;" type="number" value="${r.score_weight}" /></td>
      <td class="dsc-font-sm">${r.period}</td>
      <td class="dsc-font-sm">${r.default_threshold}</td>
      <td>${r.has_custom_threshold ? `<button class="dsc-btn dsc-btn--text dsc-btn--sm dsc-text-primary" onclick="openLine2ThresholdModal('${r.indicator_name}')">配置明细</button>` : '<span class="dsc-text-tertiary dsc-font-sm">—</span>'}</td>
      <td><span class="dsc-tag dsc-tag--outline dsc-tag--sm">${r.data_type}</span></td>
    </tr>`).join('');

  const reportRows = LINE2_REPORTING.map(r => {
    const tag = r.status === '已核验' ? 'dsc-tag--success' : r.status === '驳回' ? 'dsc-tag--danger' : 'dsc-tag--warning';
    return `
    <tr>
      <td>${r.id}</td>
      <td><strong>${r.tertiary}</strong></td>
      <td>${r.item}</td>
      <td class="dsc-font-sm">${r.submitTime}</td>
      <td class="dsc-table__num">${r.attachments} 份</td>
      <td class="dsc-font-sm">${r.note}</td>
      <td><span class="dsc-tag ${tag}">${r.status}</span></td>
      <td class="dsc-table__actions">
        ${r.status === '待核验' ? `<button class="dsc-btn dsc-btn--text dsc-btn--sm dsc-text-success" onclick="showToast('已核验通过并记分：${r.id}','success')">核验通过并记分</button><button class="dsc-btn dsc-btn--text dsc-btn--sm dsc-text-danger" onclick="openLine2RejectModal('${r.id}')">驳回修改</button>` : ''}
        <button class="dsc-btn dsc-btn--text dsc-btn--sm" onclick="showToast('报送详情：${r.id}（${r.item}）','info')">查看</button>
      </td>
    </tr>`;
  }).join('');

  const issueRows = LINE2_INSPECTION_ISSUES.map(r => `
    <tr>
      <td>${r.id}</td>
      <td><span class="dsc-tag dsc-tag--warning dsc-tag--sm">${r.source}</span></td>
      <td>${r.issue}</td>
      <td class="dsc-font-sm">${r.foundAt}</td>
      <td>${r.l3_org === '未分配' ? '<span class="dsc-text-tertiary">未分配</span>' : `<span class="dsc-tag dsc-tag--info">${r.l3_org}</span>`}</td>
      <td class="dsc-font-sm">${r.project_name}</td>
      <td class="dsc-table__num dsc-text-danger">-${r.deduct}</td>
      <td><span class="dsc-tag ${r.status === '已落级' ? 'dsc-tag--success' : 'dsc-tag--warning'}">${r.status}</span></td>
      <td class="dsc-table__actions">
        ${r.status === '待落级' ? `<button class="dsc-btn dsc-btn--text dsc-btn--sm dsc-text-primary" onclick="assignIssueToTertiary('${r.id}')">分配责任三级</button>` : `<button class="dsc-btn dsc-btn--text dsc-btn--sm" onclick="showToast('已落级至责任三级单位','info')">查看</button>`}
      </td>
    </tr>`).join('');

  const boardRows = scores.map(s => `
    <tr>
      <td><strong>${s.rank}</strong></td>
      <td><strong>${s.tertiary_org_name}</strong></td>
      <td class="dsc-table__num"><span class="dsc-score__value" style="font-size:18px;color:${scoreColorOf(s.score_rate)}">${s.total_score}</span></td>
      <td class="dsc-table__num">${s.full_score}</td>
      <td class="dsc-table__num"><strong>${s.score_rate}</strong></td>
      <td style="width:130px;"><div class="dsc-progress"><div class="dsc-progress__bar ${scoreBarClassOf(s.score_rate)}" style="width:${parseFloat(s.score_rate)}%"></div></div></td>
      <td><span class="dsc-tag ${s.status === 'published' ? 'dsc-tag--success' : 'dsc-tag--default'}">${s.status === 'published' ? '已发布' : '暂存'}</span></td>
      <td class="dsc-table__actions"><button class="dsc-btn dsc-btn--text dsc-btn--sm" onclick="openLine2UnitDetail('${s.tertiary_org_name}')">明细</button></td>
    </tr>`).join('');

  const tabContent = {
    rule: `
      <div class="dsc-alert dsc-alert--info dsc-mb-md">
        ⓘ 自主考评模板<strong>默认继承局端 2026年7月标准</strong>（同业态标准表与平台子表）；二级考核专员可按本单位管理实际自主调整指标启停、增删指标、调整权重、配置三级差异化阈值。当前启用项分值合计 <strong>${weightSum} 分</strong>${weightSum === 100 ? '（总分校验通过）' : '（当前存在停用指标，启用项合计不足 100 分，系统已自动提示）'}。
      </div>
      <div class="dsc-table-wrapper">
        <table class="dsc-table">
          <thead><tr><th>指标启停</th><th>考核类别</th><th>指标名称</th><th>指标满分权重</th><th>考核周期</th><th>默认达标阈值</th><th>三级差异化阈值</th><th>取数机制分类</th></tr></thead>
          <tbody>${ruleRows}</tbody>
        </table>
      </div>
      <div class="dsc-alert dsc-alert--warning" style="margin-top:var(--space-md);">
        ⚠ 二级自主考评结果<strong>不反向影响局考二级成绩</strong>；双轨数据、得分、流程完全隔离。
      </div>`,
    reporting: `
      <div class="dsc-alert dsc-alert--info dsc-mb-md">ⓘ B 类指标（验收合规性、采购合规、分供商履约与评价等）由三级单位报送，二级考核专员集中核验后计分。</div>
      <div class="dsc-table-wrapper">
        <table class="dsc-table">
          <thead><tr><th>编号</th><th>报送三级单位</th><th>报送事项</th><th>提交时间</th><th>附件</th><th>说明</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>${reportRows}</tbody>
        </table>
      </div>`,
    inspection: `
      <div class="dsc-alert dsc-alert--info dsc-mb-md">ⓘ 将一标一检 / 审计巡视 / 专项治理等检查问题<strong>落级到具体责任三级单位</strong>，作为二级自主考评的事件类扣分依据。</div>
      <div class="dsc-table-wrapper">
        <table class="dsc-table">
          <thead><tr><th>编号</th><th>问题来源</th><th>问题描述</th><th>发现日期</th><th>责任三级单位</th><th>涉及项目</th><th>扣分</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>${issueRows}</tbody>
        </table>
      </div>`,
    board: `
      <div class="dsc-alert dsc-alert--info dsc-mb-md">ⓘ 下属 13 家三级分公司月度得分与排名（满分 100 分制，二级自主口径）；已发布 ${published} 家。</div>
      <div class="dsc-table-wrapper">
        <table class="dsc-table">
          <thead><tr><th>排名</th><th>三级单位</th><th>总得分</th><th>满分</th><th>得分率</th><th>得分率进度</th><th>发布状态</th><th>操作</th></tr></thead>
          <tbody>${boardRows}</tbody>
        </table>
      </div>`,
  };

  return `
    <div class="dsc-page-header">
      <h1 class="dsc-page-header__title">二级考核专员工作台</h1>
      <div class="dsc-page-header__actions">
        <span class="dsc-tag ${enabled ? 'dsc-tag--success' : 'dsc-tag--default'}">二级自主考评${enabled ? '已启用' : '已停用'}</span>
      </div>
    </div>

    <div class="dsc-card">
      <div class="dsc-card__body">
        <div class="dsc-flex dsc-flex--between dsc-flex--center">
          <div>
            <div style="font-size:18px;font-weight:700;">中建八局第一建设有限公司 · 考核专员工作台</div>
            <div class="dsc-font-sm dsc-text-tertiary" style="margin-top:4px;">当前运行模板：<strong>V3.1</strong>（已继承局 2026年7月标准，已完成本地差异化调整）</div>
          </div>
          <div class="dsc-flex dsc-gap-md dsc-flex--center">
            <span class="dsc-font-sm">二级自主考评状态：</span>
            <button class="dsc-btn ${enabled ? 'dsc-btn--primary' : 'dsc-btn--default'} dsc-btn--sm" onclick="toggleLine2()">${enabled ? '已启用 · 点击停用' : '已停用 · 点击启用'}</button>
          </div>
        </div>
        <div class="dsc-flex dsc-gap-md" style="margin-top:var(--space-lg);">
          <button class="dsc-btn dsc-btn--default dsc-btn--sm" onclick="restoreLine2Template()">一键恢复局标准模板</button>
          <button class="dsc-btn dsc-btn--default dsc-btn--sm" onclick="openVersionPublishModal()">配置版本发布审批</button>
          <button class="dsc-btn dsc-btn--default dsc-btn--sm" onclick="exportLine2Report(this)">导出三级月度通报</button>
          <button class="dsc-btn dsc-btn--primary dsc-btn--sm" onclick="rerunLine2Batch(this)">发起三级跑批重算</button>
        </div>
      </div>
    </div>

    <div class="dsc-card">
      <div class="dsc-card__body dsc-flex dsc-flex--between dsc-flex--center">
        <div>
          <div class="dsc-font-bold">当前执行模板：${AUTONOMOUS_VERSION.version}</div>
          <div class="dsc-font-sm dsc-text-tertiary" style="margin-top:2px;">${AUTONOMOUS_VERSION.base}　|　最近更新：${AUTONOMOUS_VERSION.updatedAt}</div>
          <div class="dsc-font-sm dsc-text-tertiary" style="margin-top:4px;">变更记录：${AUTONOMOUS_VERSION.changeLog}</div>
        </div>
        <span class="dsc-tag ${AUTONOMOUS_VERSION.publishStatus === '已发布' ? 'dsc-tag--success' : 'dsc-tag--warning'} dsc-shrink-0">${AUTONOMOUS_VERSION.publishStatus}</span>
      </div>
    </div>

    <div class="dsc-stat-row">
      <div class="dsc-stat-card">
        <div class="dsc-stat-card__label">下属三级单位</div>
        <div class="dsc-stat-card__value">${scores.length}</div>
        <div class="dsc-stat-card__footer">已发布 ${published} 家 / 暂存 ${scores.length - published} 家</div>
      </div>
      <div class="dsc-stat-card">
        <div class="dsc-stat-card__label">三级平均得分率</div>
        <div class="dsc-stat-card__value dsc-stat-card__value--primary">${avgRate}</div>
        <div class="dsc-stat-card__footer">满分 100 分制（二级自主口径）</div>
      </div>
      <div class="dsc-stat-card">
        <div class="dsc-stat-card__label">待核验报送</div>
        <div class="dsc-stat-card__value dsc-stat-card__value--warning">${pendingReport}</div>
        <div class="dsc-stat-card__footer">B 类报送（三级报送 / 二级核验）</div>
      </div>
      <div class="dsc-stat-card">
        <div class="dsc-stat-card__label">待落级检查问题</div>
        <div class="dsc-stat-card__value dsc-stat-card__value--warning">${pendingIssue}</div>
        <div class="dsc-stat-card__footer">一标一检 / 审计巡视 / 专项治理</div>
      </div>
    </div>

    <div class="dsc-card">
      <div class="dsc-card__header" style="border-bottom:none;padding-bottom:0;">
        <div class="dsc-tabs" id="workspaceTabs">
          ${tabs.map(t => `<div class="dsc-tabs__item ${tab === t.key ? 'dsc-tabs__item--active' : ''}" data-wtab="${t.key}">${t.label}</div>`).join('')}
        </div>
      </div>
      <div class="dsc-card__body">${tabContent[tab] || tabContent.rule}</div>
    </div>
  `;
}

function initTertiaryWorkspacePage() {
  document.querySelectorAll('#workspaceTabs .dsc-tabs__item').forEach(t => {
    t.addEventListener('click', function() { switchWorkspaceTab(this.dataset.wtab); });
  });
}

function switchWorkspaceTab(key) {
  AppState.workspaceTab = key;
  const container = document.getElementById('pageContainer');
  container.innerHTML = renderTertiaryWorkspacePage();
  initTertiaryWorkspacePage();
}

function toggleLine2() {
  AppState.line2Enabled = AppState.line2Enabled === false;
  showToast(`二级自主考评已${AppState.line2Enabled ? '启用' : '停用'}${AppState.line2Enabled ? '，将参与下一步三级跑批' : '，暂停三级独立考核'}`, AppState.line2Enabled ? 'success' : 'warning');
  switchWorkspaceTab(AppState.workspaceTab || 'rule');
}

function toggleLine2Indicator(name) {
  const r = LINE2_RULE_CONFIG.find(x => x.indicator_name === name);
  if (!r) return;
  r.is_enabled = !r.is_enabled;
  const weightSum = LINE2_RULE_CONFIG.filter(x => x.is_enabled).reduce((n, x) => n + x.score_weight, 0);
  showToast(`「${name}」已${r.is_enabled ? '启用' : '停用'}；当前启用项合计 ${weightSum} 分`, 'info');
  switchWorkspaceTab('rule');
}

function openLine2ThresholdModal(indicator) {
  const rows = LINE2_THRESHOLDS.map(t => `
    <tr>
      <td class="dsc-tree-code">${t.tertiary_code}</td>
      <td><strong>${t.tertiary_name}</strong></td>
      <td class="dsc-font-sm">${t.business_type}</td>
      <td><input class="dsc-input" style="width:90px;height:28px;" value="${t.target_value}" /></td>
      <td class="dsc-font-sm">${t.remark}</td>
    </tr>`).join('');
  openModal(`三级差异化阈值配置 - ${indicator}`, `
    <div class="dsc-alert dsc-alert--info">ⓘ 二级向所属三级单位下达差异化目标值；支持批量 Excel 粘贴导入。分解后的目标值仅作用于<strong>二级自主考评</strong>。</div>
    <table class="dsc-table">
      <thead><tr><th>三级组织编码</th><th>三级单位全称</th><th>业态类别</th><th>分解目标值</th><th>调整依据说明</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `, true);
  document.getElementById('modalConfirm').onclick = function() {
    closeModal();
    showToast('三级差异化阈值已保存（仅作用于二级自主考评）', 'success');
  };
}

function assignIssueToTertiary(id) {
  const r = LINE2_INSPECTION_ISSUES.find(x => x.id === id);
  if (!r) return;
  const opts = LINE2_SCORES.map(s => `<option>${s.short_name}</option>`).join('');
  openModal(`分配责任三级单位 - ${id}`, `
    <div class="dsc-alert dsc-alert--warning">⚠ 检查问题：${r.issue}（${r.source}，发现于 ${r.foundAt}，扣 ${r.deduct} 分）</div>
    <div class="dsc-form-row dsc-form-row--2">
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">责任三级单位</label>
        <select class="dsc-select dsc-w-full">${opts}</select>
      </div>
      <div class="dsc-form-group">
        <label class="dsc-form-label">关联项目</label>
        <input class="dsc-input" placeholder="如：济南经十路商业综合体" />
      </div>
    </div>
    <div class="dsc-form-group dsc-mb-lg">
      <label class="dsc-form-label">落级依据说明</label>
      <textarea class="dsc-textarea" placeholder="填写问题归属判定依据"></textarea>
    </div>
  `, true);
  document.getElementById('modalConfirm').onclick = function() {
    closeModal();
    showToast(`检查问题 ${id} 已落级至责任三级单位（仅作用于二级自主考评）`, 'success');
  };
}

function openLine2UnitDetail(orgName) {
  const u = LINE2_SCORES.find(s => s.tertiary_org_name === orgName);
  if (!u) { showToast('未找到该三级单位得分明细', 'warning'); return; }
  const html = `
    <div class="dsc-flex dsc-flex--between dsc-flex--center dsc-mb-lg">
      <span style="font-size:18px;font-weight:700;">${u.tertiary_org_name}</span>
      <span>
        <span class="dsc-tag dsc-tag--warning" style="margin-right:8px;">二级自主考评</span>
        <span class="dsc-tag dsc-tag--info">三级内排名 ${u.rank}</span>
      </span>
    </div>
    <div class="dsc-stat-row" style="grid-template-columns:repeat(3,1fr);margin-bottom:16px;">
      <div class="dsc-stat-card" style="padding:16px;"><div class="dsc-stat-card__label">总得分</div><div class="dsc-stat-card__value" style="font-size:24px;">${u.total_score}<span style="font-size:14px;color:var(--color-text-tertiary);"> / ${u.full_score}</span></div></div>
      <div class="dsc-stat-card" style="padding:16px;"><div class="dsc-stat-card__label">得分率</div><div class="dsc-stat-card__value" style="font-size:24px;">${u.score_rate}</div></div>
      <div class="dsc-stat-card" style="padding:16px;"><div class="dsc-stat-card__label">满分基数</div><div class="dsc-stat-card__value" style="font-size:24px;">${u.full_score}</div></div>
    </div>
    <table class="dsc-table">
      <thead><tr><th>考核指标</th><th>满分</th><th>实际得分</th><th>实际值</th><th>达标标准</th></tr></thead>
      <tbody>
        ${u.details.map(d => `<tr><td>${d.indicator}</td><td class="dsc-table__num">${d.score}</td><td class="dsc-table__num"><strong>${d.actual}</strong></td><td class="dsc-table__num">${d.value}</td><td class="dsc-font-sm">${d.standard}</td></tr>`).join('')}
      </tbody>
    </table>
    <div class="dsc-alert dsc-alert--info" style="margin-top:16px;">ⓘ 自主考评结果仅用于二级单位内部管理与通报，<strong>不反向影响局考二级成绩</strong>。</div>
  `;
  openModal(`${u.short_name} 三级考核得分明细（二级自主考评）`, html, false);
}

function restoreLine2Template() {
  openModal('恢复局端默认规则', `
    <div class="dsc-alert dsc-alert--warning">⚠ 将使用局端 2026年7月标准（同业态标准表与平台子表）覆盖当前自主考评模板，本地的指标启停、权重与三级差异化阈值配置将被重置。此操作仅影响二级自主考评，不影响局考二级成绩。</div>
  `, true);
  document.getElementById('modalConfirm').onclick = function() {
    closeModal();
    showToast('已恢复局端默认规则（模板版本 V3.1-DEFAULT）', 'success');
  };
}

function exportLine2Report(btn) {
  setBtnLoading(btn, '导出中…', 1800, function () { showToast('三级考核通报已导出（含 13 家三级分公司得分、排名与明细）', 'success'); });
}

function rerunLine2Batch(btn) {
  setBtnLoading(btn, '跑批中…', 2400, function () { showToast('三级跑批重算已提交（二级自主考评算分，预计 2-3 分钟完成）', 'info'); });
}

// 自主考评配置版本发布审批（V3.1：二级分管领导审批闸口）
function openVersionPublishModal() {
  const caps = ((typeof ROLE_PROFILE !== 'undefined' && ROLE_PROFILE[AppState.currentRole]) || {}).caps || {};
  const canApprove = !!caps.l2Final;
  openModal('配置版本发布审批', `
    <div class="dsc-alert dsc-alert--info">ⓘ 二级自主考评的规则配置需经<strong>二级分管领导</strong>审批后方可发布生效；未获签批前成绩与排名不得变更，修改版本全量留痕。</div>
    <table class="dsc-table dsc-mb-lg">
      <tbody>
        <tr><td style="width:150px;background:var(--color-bg-table-header);font-weight:500;">模板版本</td><td><strong>${AUTONOMOUS_VERSION.version}</strong></td></tr>
        <tr><td class="dsc-cell-label">继承基线</td><td>${AUTONOMOUS_VERSION.base}</td></tr>
        <tr><td class="dsc-cell-label">最近更新</td><td>${AUTONOMOUS_VERSION.updatedAt}</td></tr>
        <tr><td class="dsc-cell-label">变更记录</td><td class="dsc-font-sm">${AUTONOMOUS_VERSION.changeLog}</td></tr>
        <tr><td class="dsc-cell-label">当前状态</td><td><span class="dsc-tag dsc-tag--warning">${AUTONOMOUS_VERSION.publishStatus}</span></td></tr>
      </tbody>
    </table>
    ${canApprove ? `
      <div class="dsc-form-group dsc-mb-lg">
        <label class="dsc-form-label dsc-form-label--required">二级分管领导签批意见</label>
        <textarea class="dsc-textarea" id="verPublishRemark" placeholder="请填写对本版本规则配置的审批意见"></textarea>
      </div>` : `
      <div class="dsc-alert dsc-alert--info" style="margin-bottom:0;">ⓘ 版本发布签批为<strong>二级分管领导专属权限</strong>，当前角色（${AppState.currentRole}）仅可提请与查看。请切换至「二级分管领导（一公司）」完成签批。</div>`}
  `, true);
  document.getElementById('modalConfirm').onclick = function () {
    if (canApprove) {
      const remark = (document.getElementById('verPublishRemark') || {}).value || '';
      if (remark.trim().length < 5) { showToast('「二级分管领导签批意见」为必填项，不少于 5 个字符', 'warning'); return; }
      AUTONOMOUS_VERSION.publishStatus = '已发布';
      closeModal();
      showToast('配置版本已签批发布：V3.1-自主定制版生效，三级差异化阈值同步下发生效', 'success');
    } else {
      AUTONOMOUS_VERSION.publishStatus = '已提请二级分管领导审批';
      closeModal();
      showToast('已提请二级分管领导审批（未签批前配置不生效）', 'info');
    }
    switchWorkspaceTab(AppState.workspaceTab || 'rule');
  };
}

// 三级 B 类报送驳回重报弹窗（PRD §2.5.2 (2) modal_report_reject）
function openLine2RejectModal(reportId) {
  const r = LINE2_REPORTING.find(x => x.id === reportId || x.report_id === reportId);
  if (!r) { showToast('未找到该报送工单', 'warning'); return; }
  const cats = LINE2_REJECT_CATEGORIES.map(c => `<option>${c}</option>`).join('');
  openModal(`驳回报送 - ${r.tertiary}（${r.item}）`, `
    <div class="dsc-alert dsc-alert--warning">
      ⚠ 报送工单 ${r.report_id || r.id}：${r.item}（${r.tertiary}，提交于 ${r.submitTime}）—— 驳回后将通知三级单位在截止时限内补正重报。
    </div>
    <div class="dsc-form-group dsc-mb-lg">
      <label class="dsc-form-label dsc-form-label--required">驳回原因分类</label>
      <select class="dsc-select dsc-w-full" id="rjCategory">${cats}</select>
    </div>
    <div class="dsc-form-group dsc-mb-lg">
      <label class="dsc-form-label dsc-form-label--required">具体驳回批注</label>
      <textarea class="dsc-textarea" id="rjComment" placeholder="请指导三级单位针对性补充证明材料（不少于10个字）"></textarea>
    </div>
    <div class="dsc-form-group">
      <label class="dsc-form-label dsc-form-label--required">允许重新提报截止</label>
      <input class="dsc-input" id="rjDeadline" type="datetime-local" value="2026-07-28T18:00" />
    </div>
  `, true);
  document.getElementById('modalConfirm').onclick = function () {
    const comment = (document.getElementById('rjComment') || {}).value || '';
    if (comment.trim().length < 10) { showToast('「具体驳回批注」为必填项，且不少于 10 个字', 'warning'); return; }
    closeModal();
    showToast(`已驳回 ${r.report_id || r.id}，并通知 ${r.tertiary} 于截止时限前补正重报`, 'success');
  };
}

// ============================================================
// 页面6 (V3.1): 三级单位供应链考核业务门户
// 穿透追溯台账（只读） / 我的报送任务 / 自主考评成绩与申诉
// ============================================================
function renderTertiaryPortalPage() {
  const d = PASSTHROUGH_DETAIL;
  const tab = AppState.portalTab || 'passthrough';
  const portalTabs = [
    { key: 'passthrough', label: '局考穿透追溯台账（只读责任查验与整改）' },
    { key: 'report', label: '我的报送任务（待我填报 / 重新填报 / 历史报送）' },
    { key: 'score', label: '自主考评成绩与申诉（查分 / 发起申诉）' },
  ];
  const myScore = LINE2_SCORES.find(s => s.short_name === '济南分公司') || LINE2_SCORES[0];
  const pendingReports = L3_PORTAL_REPORTS.filter(r => r.status === '待填报' || r.status === '已驳回').length;

  return `
    <div class="dsc-page-header">
      <h1 class="dsc-page-header__title">三级单位供应链考核业务门户</h1>
      <div class="dsc-page-header__actions">
        <span class="dsc-tag dsc-tag--default">三级经办人视图</span>
        <select class="dsc-select" style="width:130px;"><option>2026年7月</option></select>
      </div>
    </div>

    <div class="dsc-card">
      <div class="dsc-card__body">
        <div style="font-size:18px;font-weight:700;">${d.l3_org_name}</div>
        <div class="dsc-font-sm dsc-text-tertiary" style="margin-top:4px;">上级二级单位：${d.parent_l2_name}　|　考核期间：${d.eval_month}　|　数据权限：仅本单位（行级强隔离，不可查看其他三级数据）</div>
      </div>
    </div>

    <div class="dsc-tabs" id="portalTabs">
      ${portalTabs.map(t => `<div class="dsc-tabs__item ${tab === t.key ? 'dsc-tabs__item--active' : ''}" data-ptab="${t.key}">${t.label}${t.key === 'report' && pendingReports ? ` <span class="dsc-tag dsc-tag--warning dsc-tag--sm" style="margin-left:4px;">${pendingReports}</span>` : ''}</div>`).join('')}
    </div>

    ${tab === 'passthrough' ? `
    <div class="dsc-alert dsc-alert--info">
      ⓘ 本页数据为中建八局总部对二级单位考核扣分事实在三级层面的<strong>自动切片穿透</strong>。本数据<strong>不生成三级独立总分</strong>，仅用于责任追溯与改进。如有异议，请向二级单位考核专员反馈并在局考复核申诉中统一提报。
    </div>

    <div class="dsc-stat-row" style="grid-template-columns:repeat(3,1fr);">
      <div class="dsc-stat-card">
        <div class="dsc-stat-card__label">本月涉及局考扣分项</div>
        <div class="dsc-stat-card__value">${d.summary.indicatorCount} 项</div>
      </div>
      <div class="dsc-stat-card">
        <div class="dsc-stat-card__label">关联直接扣分总额</div>
        <div class="dsc-stat-card__value dsc-stat-card__value--danger">${d.summary.totalDeduct} 分</div>
      </div>
      <div class="dsc-stat-card">
        <div class="dsc-stat-card__label">涉及项目数量</div>
        <div class="dsc-stat-card__value">${d.summary.projectCount} 个</div>
      </div>
    </div>

    <div class="dsc-card">
      <div class="dsc-card__header">
        <span class="dsc-card__title">局考穿透追溯台账（按指标分类展开）</span>
        <span class="dsc-text-tertiary dsc-font-sm">共同底座：大数据湖 DSC / 数字商务 / 云筑网单据级底表</span>
      </div>
      <div class="dsc-card__body--no-padding">
        <div class="dsc-table-wrapper">
          <table class="dsc-table">
            <thead>
              <tr><th>局考一级指标</th><th>所属考核类别</th><th>责任项目工程</th><th>底层单据凭单号</th><th>产生扣分分值</th><th>事实认定明细</th><th>业务整改指引</th><th>认定来源通道</th></tr>
            </thead>
            <tbody>
              ${d.rows.map(r => `
                <tr>
                  <td><span class="dsc-tag dsc-tag--info">${r.indicator_name}</span></td>
                  <td class="dsc-font-sm">${r.category}</td>
                  <td><strong>${r.project_name}</strong></td>
                  <td class="dsc-tree-code">${r.voucher_no}</td>
                  <td class="dsc-table__num"><strong class="dsc-text-danger">${r.deduct_score}</strong></td>
                  <td class="dsc-font-sm" style="max-width:300px;">${r.fact_detail}</td>
                  <td class="dsc-font-sm dsc-text-tertiary" style="max-width:240px;">${r.rectify_guidance || '—'}</td>
                  <td><span class="dsc-tag dsc-tag--default dsc-tag--sm">${r.channel_source}</span></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="dsc-pagination"><span>共 ${d.rows.length} 条穿透记录</span></div>
      </div>
    </div>

    <div class="dsc-alert dsc-alert--info">
      ⓘ 免责与归因说明：本页数据由系统按底层单据与项目归属关系自动切片生成，<strong>二级单位零操作</strong>；穿透结果不改变局考二级得分与排名，亦不替代二级单位内部考核结论。
    </div>
    ` : ''}

    ${tab === 'report' ? `
    <div class="dsc-alert dsc-alert--info">
      ⓘ 报送截止：挂图计划每季第一周报计划、每月 25 日 18:00 报进度；专项治理每月 15 日前上报。逾期系统自动标记「不报送晚报送不得分」，被驳回任务须在截止时限内补正重报。
    </div>
    <div class="dsc-card">
      <div class="dsc-card__header">
        <span class="dsc-card__title">我的报送任务</span>
        <span class="dsc-text-tertiary dsc-font-sm">三级报送 → 二级考核专员集中核验</span>
      </div>
      <div class="dsc-card__body--no-padding">
        <div class="dsc-table-wrapper">
          <table class="dsc-table">
            <thead>
              <tr><th>报送工单</th><th>报送事项</th><th>关联考核指标</th><th>截止填报时间</th><th>实际提交</th><th>状态</th><th>驳回/提示</th><th>操作</th></tr>
            </thead>
            <tbody>
              ${L3_PORTAL_REPORTS.map(r => {
                const tag = r.status === '已通过' ? 'dsc-tag--success' : r.status === '已驳回' ? 'dsc-tag--danger' : 'dsc-tag--warning';
                const due = r.status === '待填报' ? `<span class="dsc-text-danger dsc-font-sm">${r.deadline}（${r.remain || ''}）</span>` : `<span class="dsc-font-sm">${r.deadline}</span>`;
                return `
                <tr>
                  <td class="dsc-tree-code">${r.task_id}</td>
                  <td><strong>${r.title}</strong></td>
                  <td><span class="dsc-tag dsc-tag--info dsc-tag--sm">${r.indicator}</span></td>
                  <td>${due}</td>
                  <td class="dsc-font-sm">${r.submit_time || '—'}</td>
                  <td><span class="dsc-tag ${tag}">${r.status}</span></td>
                  <td class="dsc-font-sm">${r.status === '已驳回' ? `<span class="dsc-text-danger">${r.reject_category}</span>：${r.reject_comment}<br/>重报截止：${r.resubmit_deadline}` : '—'}</td>
                  <td class="dsc-table__actions">
                    ${r.status === '待填报' ? `<button class="dsc-btn dsc-btn--text dsc-btn--sm dsc-text-primary" onclick="openL3ReportSubmit('${r.task_id}')">立即填报</button>` : r.status === '已驳回' ? `<button class="dsc-btn dsc-btn--text dsc-btn--sm dsc-text-primary" onclick="openL3ReportSubmit('${r.task_id}')">重新填报</button>` : ''}
                    <button class="dsc-btn dsc-btn--text dsc-btn--sm" onclick="showToast('报送详情：${r.task_id}（${r.status}）','info')">查看</button>
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
        <div class="dsc-pagination"><span>共 ${L3_PORTAL_REPORTS.length} 条报送任务</span></div>
      </div>
    </div>
    ` : ''}

    ${tab === 'score' ? `
    <div class="dsc-alert dsc-alert--info">
      ⓘ 本单位<strong>二级自主考评</strong>成绩（二级考三级口径，满分 100 分制）；该成绩<strong>不反向影响局考二级得分</strong>，与「局考穿透追溯台账」为两套独立口径。
    </div>
    <div class="dsc-stat-row" style="grid-template-columns:repeat(3,1fr);">
      <div class="dsc-stat-card">
        <div class="dsc-stat-card__label">本单位自主考评得分</div>
        <div class="dsc-stat-card__value dsc-stat-card__value--primary">${myScore.total_score}<span style="font-size:14px;color:var(--color-text-tertiary);"> / ${myScore.full_score}</span></div>
      </div>
      <div class="dsc-stat-card">
        <div class="dsc-stat-card__label">得分率</div>
        <div class="dsc-stat-card__value">${myScore.score_rate}</div>
      </div>
      <div class="dsc-stat-card">
        <div class="dsc-stat-card__label">三级内排名</div>
        <div class="dsc-stat-card__value">第 ${myScore.rank} 名</div>
      </div>
    </div>
    <div class="dsc-card">
      <div class="dsc-card__header">
        <span class="dsc-card__title">自主考评指标明细与申诉</span>
        <button class="dsc-btn dsc-btn--primary dsc-btn--sm" onclick="openL3Appeal()">+ 发起申诉</button>
      </div>
      <div class="dsc-card__body--no-padding">
        <div class="dsc-table-wrapper">
          <table class="dsc-table">
            <thead><tr><th>考核指标</th><th>满分</th><th>实际得分</th><th>实际值</th><th>达标标准</th><th>操作</th></tr></thead>
            <tbody>
              ${myScore.details.map(dr => {
                const ded = Math.round((dr.score - dr.actual) * 100) / 100;
                return `<tr>
                  <td>${dr.indicator}</td>
                  <td class="dsc-table__num">${dr.score}</td>
                  <td class="dsc-table__num"><strong class="${ded > 0 ? 'dsc-text-warning' : 'dsc-text-success'}">${dr.actual}</strong></td>
                  <td class="dsc-table__num">${dr.value}</td>
                  <td class="dsc-font-sm">${dr.standard}</td>
                  <td class="dsc-table__actions">${ded > 0 ? `<button class="dsc-btn dsc-btn--text dsc-btn--sm dsc-text-primary" onclick="openL3Appeal('${dr.indicator}', ${ded})">对扣分申诉</button>` : '<span class="dsc-text-tertiary dsc-font-sm">—</span>'}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
        <div class="dsc-pagination"><span>试公示期内可对扣分项发起申诉（倒计时剩余 1 天 14 小时）</span></div>
      </div>
    </div>
    ` : ''}
  `;
}

function initTertiaryPortalPage() {
  document.querySelectorAll('#portalTabs .dsc-tabs__item').forEach(t => {
    t.addEventListener('click', function() { switchPortalTab(this.dataset.ptab); });
  });
}

function switchPortalTab(key) {
  AppState.portalTab = key;
  const container = document.getElementById('pageContainer');
  container.innerHTML = renderTertiaryPortalPage();
  initTertiaryPortalPage();
}

// 三级报送数据填报弹窗（PRD §2.6.2 (1)）
function openL3ReportSubmit(taskId) {
  const r = L3_PORTAL_REPORTS.find(x => x.task_id === taskId);
  if (!r) { showToast('未找到该报送任务', 'warning'); return; }
  const isReject = r.status === '已驳回';
  openModal(`报送数据填报 - ${r.title}`, `
    ${isReject ? `<div class="dsc-alert dsc-alert--danger">⚠ 本任务已被驳回（${r.reject_category}）：${r.reject_comment}；请于 ${r.resubmit_deadline} 前补正重报。</div>` : ''}
    <table class="dsc-table dsc-mb-lg">
      <tbody>
        <tr><td style="width:150px;background:var(--color-bg-table-header);font-weight:500;">本期报送任务</td><td><strong>${r.title}</strong></td></tr>
        <tr><td class="dsc-cell-label">关联考核指标</td><td><span class="dsc-tag dsc-tag--info dsc-tag--sm">${r.indicator}</span></td></tr>
        <tr><td class="dsc-cell-label">截止填报时间</td><td><span class="dsc-text-danger">${r.deadline}${r.remain ? '（' + r.remain + '）' : ''}</span></td></tr>
      </tbody>
    </table>
    <div class="dsc-form-row dsc-form-row--2">
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">指标完成数值</label>
        <input class="dsc-input" id="l3Metric" placeholder="如：计划5项，完成5项" />
      </div>
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">填报经办人与电话</label>
        <input class="dsc-input" id="l3Contact" value="济南分公司-经办人 138****6621" />
      </div>
    </div>
    <div class="dsc-form-group dsc-mb-lg">
      <label class="dsc-form-label dsc-form-label--required">进展情况详细陈述</label>
      <textarea class="dsc-textarea" id="l3Progress" placeholder="请详细阐述当月举措、完成成果与现场形象进度（不少于20字）"></textarea>
    </div>
    <div class="dsc-form-group dsc-mb-lg">
      <label class="dsc-form-label dsc-form-label--required">证明材料附件上传</label>
      <input class="dsc-input" type="file" multiple accept=".pdf,.zip" />
      <div class="dsc-font-sm dsc-text-tertiary" style="margin-top:4px;">必传：上传盖章的周报表、验收明细或工程例会纪要（PDF / ZIP）</div>
    </div>
  `, true);
  document.getElementById('modalConfirm').onclick = function () {
    const metric = (document.getElementById('l3Metric') || {}).value || '';
    const progress = (document.getElementById('l3Progress') || {}).value || '';
    if (!metric.trim()) { showToast('「指标完成数值」为必填项', 'warning'); return; }
    if (progress.trim().length < 20) { showToast('「进展情况详细陈述」为必填项，且不少于 20 字', 'warning'); return; }
    closeModal();
    // P1-4 提交状态回写：状态机流转，避免"提示成功但列表仍为待填报"
    r.status = '待核验';
    r.submitted = true;
    r.submit_time = '2026-07-25 16:40';
    delete r.reject_category;
    delete r.reject_comment;
    delete r.resubmit_deadline;
    showToast(`报送任务 ${r.task_id} 已提交，已进入二级考核专员核验队列`, 'success');
    const container = document.getElementById('pageContainer');
    container.innerHTML = renderTertiaryPortalPage();
    initTertiaryPortalPage();
  };
}

// 三级发起自主考评申诉（PRD §2.4 二级自主考评申诉）
function openL3Appeal(indicator, deduct) {
  const ind = indicator || '物资设备集中采购率';
  const ded = deduct || 2.0;
  openModal('发起自主考评申诉', `
    <div class="dsc-alert dsc-alert--info">ⓘ 本申诉提交至<strong>二级单位</strong>：由二级考核专员初审、二级分管领导终审签批；未获签批前成绩与排名不得变更。局端仅具备穿透监管审计权限（只读）。</div>
    <div class="dsc-form-row dsc-form-row--2">
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">争议考核指标</label>
        <input class="dsc-input" value="${ind}" readonly />
      </div>
      <div class="dsc-form-group">
        <label class="dsc-form-label">原扣分分值</label>
        <input class="dsc-input" value="-${ded} 分" readonly />
      </div>
    </div>
    <div class="dsc-form-group dsc-mb-lg">
      <label class="dsc-form-label dsc-form-label--required">关联原始底表单据号</label>
      <input class="dsc-input" value="CG-202607-0192" />
    </div>
    <div class="dsc-form-group dsc-mb-lg">
      <label class="dsc-form-label dsc-form-label--required">申诉理由与依据</label>
      <textarea class="dsc-textarea" id="l3AppealReason" placeholder="请填写客观抗辩说明（如业主指定品牌、非我方责任等）"></textarea>
    </div>
    <div class="dsc-form-group dsc-mb-lg">
      <label class="dsc-form-label dsc-form-label--required">佐证材料上传</label>
      <input class="dsc-input" type="file" multiple accept=".pdf,.png,.jpg" />
      <div class="dsc-font-sm dsc-text-tertiary" style="margin-top:4px;">如平台卡顿截图、业主指令单、联合会签单扫描件等</div>
    </div>
  `, true);
  document.getElementById('modalConfirm').onclick = function () {
    const reason = (document.getElementById('l3AppealReason') || {}).value || '';
    if (reason.trim().length < 10) { showToast('「申诉理由与依据」为必填项，且不少于 10 个字符', 'warning'); return; }
    closeModal();
    showToast('自主考评申诉已提交至二级单位（工单号 AP-L2-202607-NEW），待二级考核专员初审', 'success');
  };
}

// ============================================================
// 页面4: 申诉审批与纠正
// ============================================================
function renderAppealApprovalPage() {
  const line = AppState.appealLine || '局考复核申诉';
  const isLine1 = line === '局考复核申诉';
  const records = isLine1 ? APPEAL_RECORDS : LINE2_APPEALS;
  return `
    <div class="dsc-page-header">
      <h1 class="dsc-page-header__title">申诉审批与纠正</h1>
      <div class="dsc-page-header__actions">
        <button class="dsc-btn dsc-btn--default"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="dsc-icon-inline"><path d="M2.5 13V4M7 13V2.5M11.5 13V6M2 13h12"/></svg>试公示看板</button>
        <button class="dsc-btn dsc-btn--primary" onclick="openSpecialApprovalModal()">+ 纠正调整</button>
      </div>
    </div>

    <!-- 试公示倒计时横幅（V3.0） -->
    <div class="dsc-alert dsc-alert--warning">
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="dsc-icon-inline"><circle cx="8" cy="8" r="6.5"/><path d="M8 4.5V8l2.5 1.5"/></svg>当前处于 <strong>2026年7月</strong> 考核结果试公示期（剩余 <strong>1 天 14 小时</strong>），逾期申诉通道关闭。
    </div>

    <!-- V3.0 申诉分级 Tab -->
    <div class="dsc-tabs" id="appealLineTabs">
      <div class="dsc-tabs__item ${isLine1 ? 'dsc-tabs__item--active' : ''}" data-line="局考复核申诉">局考复核申诉（局供应链管理部初审 / 部领导裁定）</div>
      <div class="dsc-tabs__item ${!isLine1 ? 'dsc-tabs__item--active' : ''}" data-line="二级自主考评申诉">二级自主考评申诉（二级考核专员初审 / 二级领导裁定）</div>
    </div>

    <div class="dsc-alert dsc-alert--info">
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" class="dsc-icon-inline"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.2"/></svg>${isLine1
        ? '<strong>局考穿透追溯</strong>：二级单位 → 局总部，试公示期7月28日—7月30日（共3个工作日），8月1日起公示正式结果；试公示期间二级单位仅可见本单位结果。1—6月旧标准批次仅作历史查询。'
        : '<strong>二级自主考评</strong>：三级单位 → 二级单位（二级考核专员初审 / 二级领导裁定）。局端具备<strong>穿透监管审计权限</strong>，仅只读查看各二级内部的申诉处理流向与进度，不介入裁定。'}
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
                <th>申诉编号</th><th>考核月份</th><th>申诉发起单位</th><th>申诉层级</th><th>争议考核指标</th><th>原得分</th><th>原扣分</th><th>申诉理由与依据</th><th>提交时间</th><th>佐证材料</th><th>审批流进度状态</th><th>操作</th>
              </tr>
            </thead>
            <tbody id="appealTable">
              ${records.map(a => {
                const sTag = a.status.includes('已裁定') ? 'dsc-tag--success' : a.status.includes('复核') ? 'dsc-tag--info' : 'dsc-tag--warning';
                const isL2 = (a.appeal_level || '').includes('自主');
                return `
                  <tr>
                    <td>${a.id}</td>
                    <td class="dsc-font-sm">${a.month || '2026年6月'}</td>
                    <td><strong>${a.applicant || a.unit}</strong></td>
                    <td><span class="dsc-tag ${isL2 ? 'dsc-tag--warning' : 'dsc-tag--info'} dsc-tag--sm">${a.appeal_level || '局考复核申诉(二级→局)'}</span></td>
                    <td>${a.indicator}</td>
                    <td class="dsc-table__num">${a.originalScore}</td>
                    <td class="dsc-table__num dsc-text-danger">-${a.originalDeduction}</td>
                    <td style="max-width:240px;font-size:12px;">${a.reason}</td>
                    <td class="dsc-font-sm">${a.submitTime}</td>
                    <td class="dsc-table__num"><svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:3px;"><path d="M11 4.5a1.5 1.5 0 0 1 0 3L6 12.5a3 3 0 0 1-4.2-4.2l5.8-5.8a4.5 4.5 0 0 1 6.3 6.3l-6 6a1.5 1.5 0 0 1-2.1-2.1l5.5-5.5"/></svg>${a.attachments}个</td>
                    <td><span class="dsc-tag ${sTag}" data-status="${a.status}">${a.status}</span></td>
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
          <span>共 ${records.length} 条（${isLine1 ? '局考复核申诉' : '二级自主考评申诉'}）</span>
          
        </div>
      </div>
    </div>

    ${isLine1 ? `
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
    ` : `
    <div class="dsc-alert dsc-alert--info">
      ⓘ 二级自主考评申诉的裁定权归属二级单位（二级考核专员初审 / 二级领导裁定）；局端仅具备穿透监管审计权限，可只读查看各二级内部的申诉处理流向与进度，不介入裁定。
    </div>
    `}
  `;
}

function initAppealApprovalPage() {
  const mf = document.getElementById('appealMonthFilter');
  if (mf) mf.addEventListener('change', applyAppealFilters);
  const sf = document.getElementById('appealStatusFilter');
  if (sf) sf.addEventListener('change', applyAppealFilters);
  // V3.0：申诉分级 Tab（局考复核申诉 / 二级自主考评申诉）
  document.querySelectorAll('#appealLineTabs .dsc-tabs__item').forEach(tab => {
    tab.addEventListener('click', function() {
      AppState.appealLine = this.dataset.line;
      const container = document.getElementById('pageContainer');
      container.innerHTML = renderAppealApprovalPage();
      initAppealApprovalPage();
    });
  });
}

function applyAppealFilters() {
  const m = (document.getElementById('appealMonthFilter') || {}).value || '';
  const s = (document.getElementById('appealStatusFilter') || {}).value || '';
  document.querySelectorAll('#appealTable tr').forEach(row => {
    const tds = row.querySelectorAll('td');
    if (tds.length < 10) return;
    const monthText = tds[1].textContent;
    const statusEl = row.querySelector('[data-status]');
    const statusText = statusEl ? statusEl.textContent : '';
    const matchM = !m || monthText === m;
    const matchS = !s || statusText.includes(s.replace('中', ''));
    row.style.display = (matchM && matchS) ? '' : 'none';
  });
  updateEmptyRow(document.getElementById('appealTable'));
}

function viewAppealDetail(appealId) {
  const appeal = APPEAL_RECORDS.find(a => a.id === appealId) || LINE2_APPEALS.find(a => a.id === appealId);
  if (!appeal) return;
  const isL2 = (appeal.appeal_level || '').includes('自主');
  const roleCaps = ((typeof ROLE_PROFILE !== 'undefined' && ROLE_PROFILE[AppState.currentRole]) || {}).caps || {};
  const canFinal = isL2 ? !!roleCaps.l2Final : !!roleCaps.hqFinal;
  const leaderTitle = isL2 ? '二级分管领导终审' : '局供应链部领导终审';

  let html = `
    <div class="dsc-mb-lg">
      <span style="font-size:16px;font-weight:700;">${appeal.applicant || appeal.unit} - ${appeal.indicator} 申诉详情</span>
      <span class="dsc-tag dsc-tag--warning" style="margin-left:8px;">原扣分: -${appeal.originalDeduction}分</span>
    </div>
    <table class="dsc-table dsc-mb-lg">
      <tbody>
        <tr><td style="width:150px;background:var(--color-bg-table-header);font-weight:500;">申诉层级</td><td><span class="dsc-tag ${isL2 ? 'dsc-tag--warning' : 'dsc-tag--info'} dsc-tag--sm">${appeal.appeal_level || '局考复核申诉(二级→局)'}</span></td></tr>
        <tr><td class="dsc-cell-label">考核批次月份</td><td>${appeal.month || '2026年6月'}</td></tr>
        <tr><td class="dsc-cell-label">责任三级单位</td><td>${appeal.responsible_l3 || '—'}</td></tr>
        <tr><td class="dsc-cell-label">关联原始底表单据号</td><td class="dsc-tree-code">${appeal.voucher_no || '—'}</td></tr>
      </tbody>
    </table>
    <div class="dsc-alert dsc-alert--warning">
      申诉理由：${appeal.reason}
    </div>

    <div style="margin-top:16px;font-weight:600;">两级审批录入（专员初审 → 分管领导终审签批）</div>
    <div class="dsc-form-group dsc-mb-lg" style="margin-top:8px;">
      <label class="dsc-form-label dsc-form-label--required">专员初审意见</label>
      <textarea class="dsc-textarea" id="apSpecialistOpinion" placeholder="核对底表后的初审意见（如：建议撤销扣分 0.5 分，佐证材料齐备）"></textarea>
    </div>
    ${canFinal ? `
    <div class="dsc-form-row dsc-form-row--2">
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">${leaderTitle}结论</label>
        <select class="dsc-select dsc-w-full" id="apLeaderVerdict">
          <option value="">请选择终审结论</option>
          <option value="AGREE_OVERRIDE">同意纠正（触发特批与重算）</option>
          <option value="REJECT">维持原判</option>
        </select>
      </div>
      <div class="dsc-form-group">
        <label class="dsc-form-label">最终纠正分值</label>
        <input class="dsc-input" id="apFinalScore" type="number" step="0.1" placeholder="终审同意纠正时填入" />
      </div>
    </div>
    <div class="dsc-form-group dsc-mb-lg">
      <label class="dsc-form-label">领导签批说明</label>
      <textarea class="dsc-textarea" id="apLeaderRemark" placeholder="终审审批意见，将永久封存入特批审计日志"></textarea>
    </div>
    ` : `
    <div class="dsc-alert dsc-alert--info">
      ⓘ 「${leaderTitle}结论」「最终纠正分值」「领导签批说明」为<strong>分管领导专属字段</strong>，当前角色（${AppState.currentRole}）不可操作——系统禁止考核专员一人改分。请切换至「${isL2 ? '二级分管领导（一公司）' : '局供应链部领导'}」完成终审签批。
    </div>
    `}

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
  document.getElementById('modalConfirm').onclick = function () {
    const opinion = (document.getElementById('apSpecialistOpinion') || {}).value || '';
    if (opinion.trim().length < 10) { showToast('「专员初审意见」为必填项，且不少于 10 个字符', 'warning'); return; }
    if (canFinal) {
      const verdict = (document.getElementById('apLeaderVerdict') || {}).value || '';
      const finalScore = (document.getElementById('apFinalScore') || {}).value || '';
      if (!verdict) { showToast('请选择领导终审结论', 'warning'); return; }
      if (verdict === 'AGREE_OVERRIDE' && !finalScore) { showToast('终审「同意纠正」时必须填写最终纠正分值', 'warning'); return; }
      closeModal();
      showToast(verdict === 'AGREE_OVERRIDE'
        ? `终审已签批：同意纠正并录入最终分值 ${finalScore} 分，系统已触发特批重算与排名刷新`
        : '终审已签批：维持原判，申诉工单归档', 'success');
    } else {
      closeModal();
      showToast('专员初审意见已提交，等待分管领导终审签批（未签批前成绩与排名不得变更）', 'info');
    }
  };
}

function viewAdjustLog(adjId) {
  const a = SPECIAL_ADJUSTMENTS.find(x => x.id === adjId);
  if (!a) { showToast('未找到该调整记录', 'warning'); return; }
  const html = `
    <div class="dsc-alert dsc-alert--info"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" class="dsc-icon-inline"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.2"/></svg>纠正调整日志 - ${a.id}（${a.unit}·${a.indicator}）</div>
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
    <div class="dsc-alert dsc-alert--warning" style="margin-top:16px;"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="dsc-icon-inline"><path d="M8 1.5L15 14H1z"/><path d="M8 6v3.2M8 11.6v.2" stroke-linecap="round"/></svg>调整已触发该单位当月总分与全局排名的重新计算，全程留痕可追溯。</div>
  `;
  openModal(`纠正调整日志 - ${a.id}`, html, false);
}

function openSpecialApprovalModal() {
  const html = `
    <div class="dsc-form-row dsc-form-row--2">
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">选择二级单位</label>
        <select class="dsc-select dsc-w-full">${SECONDARY_UNITS.map(u => `<option>${u}</option>`).join('')}</select>
      </div>
      <div class="dsc-form-group">
        <label class="dsc-form-label dsc-form-label--required">选择考核指标</label>
        <select class="dsc-select dsc-w-full">${ASSESSMENT_RULES.filter(r=>r.applicable==='主业').map(r => `<option>${r.name}</option>`).join('')}</select>
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
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="dsc-icon-inline"><path d="M8 1.5L15 14H1z"/><path d="M8 6v3.2M8 11.6v.2" stroke-linecap="round"/></svg>纠正调整将触发该单位当月总分与全局排名的重新计算，操作不可撤销。
    </div>
  `;
  openModal('纠正调整', html, true);
}

// ============================================================
// 通用组件
// ============================================================

function openModal(title, bodyHtml, showFooter, sizeClass) {
  const overlay = document.getElementById('modalOverlay');
  const modal = overlay.querySelector('.dsc-modal');
  AppState.modalReturnFocus = document.activeElement;   // 关闭后焦点归还
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHtml;
  document.getElementById('modalFooter').style.display = showFooter ? 'flex' : 'none';
  if (modal) modal.classList.toggle('dsc-modal--wide', sizeClass === 'wide');
  overlay.classList.add('dsc-modal-overlay--visible');
  overlay.setAttribute('aria-hidden', 'false');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  document.body.style.overflow = 'hidden';              // 锁定背景滚动
  AppState.currentModal = title;
  associateModalLabels();
  // 聚焦弹窗内首个可交互控件
  const first = document.getElementById('modalBody').querySelector('input:not([readonly]):not([disabled]), select:not([disabled]), textarea, button');
  if (first && first.focus) { try { first.focus(); } catch (e) {} }
}

// 无障碍基线：为弹窗内「标签 + 控件」自动建立 for/id 关联
let _labelSeq = 0;
function associateModalLabels() {
  const body = document.getElementById('modalBody');
  if (!body) return;
  body.querySelectorAll('.dsc-form-group').forEach(grp => {
    const label = grp.querySelector('label.dsc-form-label');
    const ctrl = grp.querySelector('input, select, textarea');
    if (!label || !ctrl) return;
    if (!ctrl.id) ctrl.id = 'mdl-ctl-' + (++_labelSeq);
    label.setAttribute('for', ctrl.id);
  });
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('dsc-modal-overlay--visible');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';                    // 解除背景滚动锁定
  AppState.currentModal = null;
  const back = AppState.modalReturnFocus;
  if (back && back.focus) { try { back.focus(); } catch (e) {} }
}

// ============================================================
// 表格增强（P0-2）：自动识别「操作列 / 标识首列」并启用固定列
// 通过 MutationObserver 覆盖所有动态重渲染路径
// ============================================================
function enhanceTables() {
  document.querySelectorAll('.dsc-table').forEach(tbl => {
    const ths = tbl.querySelectorAll('thead th');
    if (!ths.length) return;
    const first = ths[0].textContent.trim();
    const last = ths[ths.length - 1].textContent.trim();
    tbl.classList.toggle('dsc-table--sticky-actions', last === '操作' || last === '日志');
    tbl.classList.toggle('dsc-table--sticky-first',
      ['组织机构名称', '二级单位', '三级单位', '考核指标', '考核指标名称', '局考一级指标'].indexOf(first) >= 0);
  });
}

function initTableEnhancer() {
  enhanceTables();
  const obs = new MutationObserver(function () { enhanceTables(); });
  ['pageContainer', 'modalBody'].forEach(id => {
    const el = document.getElementById(id);
    if (el) obs.observe(el, { childList: true, subtree: true });
  });
}

// 空状态（P1-5）：筛选后无可见行时补一行提示
function updateEmptyRow(tbody) {
  if (!tbody) return;
  const table = tbody.closest('table');
  const colCount = table ? (table.querySelectorAll('thead th').length || 1) : 1;
  const visible = Array.from(tbody.rows).filter(r =>
    r.style.display !== 'none' && !r.classList.contains('dsc-empty-row'));
  let er = tbody.querySelector('.dsc-empty-row');
  if (!visible.length) {
    if (!er) {
      er = document.createElement('tr');
      er.className = 'dsc-empty-row';
      er.innerHTML = '<td colspan="' + colCount + '" class="dsc-text-center dsc-text-tertiary" style="padding:36px 0;">未找到符合条件的数据，请调整筛选条件后重试</td>';
      tbody.appendChild(er);
    }
  } else if (er) {
    er.remove();
  }
}

// 按钮加载态（P1-3）：长任务点击后进入 loading，避免重复提交
function setBtnLoading(btn, label, ms, done) {
  if (!btn) { if (done) setTimeout(done, ms || 0); return; }
  const original = btn.innerHTML;
  btn.classList.add('dsc-btn--loading');
  btn.setAttribute('aria-busy', 'true');
  btn.innerHTML = '<span class="dsc-spin"></span>' + (label || '处理中…');
  setTimeout(function () {
    btn.classList.remove('dsc-btn--loading');
    btn.removeAttribute('aria-busy');
    btn.innerHTML = original;
    if (done) done();
  }, ms || 2200);
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
        <select class="dsc-select dsc-w-full">
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
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" class="dsc-icon-inline"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.2"/></svg>正在为「${rule.name}」配置计分参数，满分上限 ${rule.score} 分。
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
        <select class="dsc-select dsc-w-full"><option>连续偏离度扣减</option><option>离散型扣减</option></select>
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
    <div class="dsc-alert dsc-alert--info"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" class="dsc-icon-inline"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.2"/></svg>编辑业态「${bt.name}」，可调整基本信息并选择本业态下参与考核的被考核单位。</div>
    <div class="dsc-form-row dsc-form-row--2">
      <div class="dsc-form-group"><label class="dsc-form-label dsc-form-label--required">业态名称</label><input class="dsc-input" value="${bt.name}" /></div>
      <div class="dsc-form-group"><label class="dsc-form-label dsc-form-label--required">业态编码</label><input class="dsc-input" value="${bt.code}" /></div>
    </div>
    <div class="dsc-form-row dsc-form-row--2">
      <div class="dsc-form-group"><label class="dsc-form-label">状态</label>
        <select class="dsc-select dsc-w-full">
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
    <div class="dsc-alert dsc-alert--warning"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="dsc-icon-inline"><path d="M8 1.5L15 14H1z"/><path d="M8 6v3.2M8 11.6v.2" stroke-linecap="round"/></svg>确定要${next}业态「${bt.name}」吗？${next==='停用'?'停用后该业态下的被考核单位将不再参与月度考核。':'启用后该业态下的被考核单位将纳入月度考核。'}</div>
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
// —— V3.0 双线穿透 ——
window.applyRole = applyRole;
window.switchCollectSection = switchCollectSection;
// —— V3.1 抽取台账二次编辑 ——
window.extractRowHtml = extractRowHtml;
window.applyExtractFilter = applyExtractFilter;
window.openSingleEditModal = openSingleEditModal;
window.revokeAdjust = revokeAdjust;
window.viewExtractVoucher = viewExtractVoucher;
window.openBatchImportModal = openBatchImportModal;
window.downloadAdjustTemplate = downloadAdjustTemplate;
window.expandToSecondLevel = expandToSecondLevel;
window.expandAllTertiary = expandAllTertiary;
window.toggleOrgNode = toggleOrgNode;
window.applyOrgFilter = applyOrgFilter;
window.resetOrgFilter = resetOrgFilter;
window.expandAllOrg = expandAllOrg;
window.openOrgThresholdHint = openOrgThresholdHint;

window.switchUnitDetailTab = switchUnitDetailTab;
window.switchWorkspaceTab = switchWorkspaceTab;
window.toggleLine2 = toggleLine2;
window.toggleLine2Indicator = toggleLine2Indicator;
window.openLine2ThresholdModal = openLine2ThresholdModal;
window.assignIssueToTertiary = assignIssueToTertiary;
window.openLine2UnitDetail = openLine2UnitDetail;
window.restoreLine2Template = restoreLine2Template;
window.exportLine2Report = exportLine2Report;
window.rerunLine2Batch = rerunLine2Batch;
// —— V3.1 双轨治理 ——
window.approveGate = approveGate;
window.advanceToGate2 = advanceToGate2;
window.openInspectionEventModal = openInspectionEventModal;
window.onInspectionTypeChange = onInspectionTypeChange;
window.onInspectionL2Change = onInspectionL2Change;
window.viewInspectionEvent = viewInspectionEvent;
window.switchPortalTab = switchPortalTab;
window.openL3ReportSubmit = openL3ReportSubmit;
window.openL3Appeal = openL3Appeal;
window.openVersionPublishModal = openVersionPublishModal;
window.openLine2RejectModal = openLine2RejectModal;

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

  // P2-8 弹窗键盘可达性：Esc 关闭
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && AppState.currentModal) closeModal();
  });
  document.getElementById('modalOverlay').setAttribute('aria-hidden', 'true');

  // P0-2 表格固定列/粘性表头增强（覆盖所有动态重渲染）
  initTableEnhancer();
  
  // 初始加载页面
  navigateTo('rules-config');
  
  console.log('DSC 二级单位考核指标评分系统 v2.1 已启动（2026年7月修订版新标准 · 三业态排名与动态满分）');
});