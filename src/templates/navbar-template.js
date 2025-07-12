import { html } from 'lit';
import { marked } from 'marked';
import { getMatchedPaths } from '~/utils/common-utils';

export function expandCollapseNavBarTag(navLinkEl, action = 'toggle') {
  const tagAndPathEl = navLinkEl?.closest('.nav-bar-tag-and-paths');
  if (!tagAndPathEl) return;

  // 更新选择器以匹配新的DOM结构
  const unifiedContainerEl = tagAndPathEl.querySelector('.unified-content-container');

  const isExpanded = tagAndPathEl.classList.contains('expanded');

  if (isExpanded && (action === 'toggle' || action === 'collapse')) {
    // 折叠：隐藏所有子内容
    tagAndPathEl.classList.remove('expanded');
    tagAndPathEl.classList.add('collapsed');

    if (unifiedContainerEl) {
      unifiedContainerEl.style.maxHeight = '0';
      unifiedContainerEl.style.overflow = 'hidden';
    }
  } else if (!isExpanded && (action === 'toggle' || action === 'expand')) {
    // 展开：显示所有子内容
    tagAndPathEl.classList.remove('collapsed');
    tagAndPathEl.classList.add('expanded');

    if (unifiedContainerEl) {
      // 使用auto高度，避免手动计算
      unifiedContainerEl.style.maxHeight = 'none';
      unifiedContainerEl.style.overflow = 'visible';
    }
  }
}

export function expandCollapseAll(event, action = 'expand-all') {
  if (!(event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13))) {
    return;
  }
  const navEl = event.target.closest('.nav-scroll');
  const elList = [...navEl.querySelectorAll('.nav-bar-tag-and-paths')];
  if (action === 'expand-all') {
    elList.forEach((el) => {
      const navBarPathsUnderTagEl = el.querySelector('.nav-bar-paths-under-tag');
      el.classList.replace('collapsed', 'expanded');
      navBarPathsUnderTagEl.style.maxHeight = `${navBarPathsUnderTagEl?.scrollHeight}px`;
    });
  } else {
    elList.forEach((el) => {
      el.classList.replace('expanded', 'collapsed');
      el.querySelector('.nav-bar-paths-under-tag').style.maxHeight = 0;
    });
  }
}

export function navBarClickAndEnterHandler(event) {
  if (!(event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13))) {
    return;
  }

  // 向上查找具有 data-action 属性的元素
  let navEl = event.target;
  while (navEl && navEl !== event.currentTarget) {
    if (navEl.dataset?.action) {
      break;
    }
    navEl = navEl.parentElement;
  }

  // 如果没有找到具有 data-action 的元素，退出
  if (!navEl || !navEl.dataset?.action) {
    return;
  }

  event.stopPropagation();

  if (navEl.dataset.action === 'navigate') {
    // 创建一个修改后的事件对象，确保 target 指向正确的元素
    const modifiedEvent = {
      ...event,
      target: navEl,
      currentTarget: event.currentTarget,
      type: event.type,
      bubbles: event.bubbles,
      cancelable: event.cancelable,
    };
    this.scrollToEventTarget(modifiedEvent, false);
  } else if (navEl.dataset.action === 'expand-all' || navEl.dataset.action === 'collapse-all') {
    expandCollapseAll(event, navEl.dataset.action);
  } else if (navEl.dataset.action === 'expand-collapse-tag') {
    expandCollapseNavBarTag(navEl, 'toggle');
  }
}

// Helper function to recursively render hierarchical tags
function renderHierarchicalTag(tag, context) {
  const hasVisiblePaths = tag.paths && tag.paths.filter((path) => getMatchedPaths(context.searchVal, path, tag.fullName || tag.name)).length > 0;

  // Check if any children have content (without recursing)
  const hasVisibleChildren = tag.children && tag.children.some((child) => {
    const childHasPaths = child.paths && child.paths.filter((path) => getMatchedPaths(context.searchVal, path, child.fullName || child.name)).length > 0;
    const childHasChildren = child.children && child.children.length > 0;
    return childHasPaths || childHasChildren;
  });

  if (!hasVisiblePaths && !hasVisibleChildren) {
    return { template: html``, hasContent: false };
  }

  // Calculate visual indicators
  const hasChildren = tag.children && tag.children.length > 0;
  const isExpanded = tag.expanded || context.renderStyle === 'read';
  const isRootLevel = tag.level === 0;

  // 响应式缩进：根据层级动态计算，确保不超出边界
  const maxIndentLevels = 8; // 最大支持8级缩进
  const baseIndent = isRootLevel ? 0 : Math.min(tag.level * 12, maxIndentLevels * 12);
  // 如果在父容器内部渲染，不添加额外的缩进，保持与文档对齐
  const indentSize = context.isInParentContainer ? 0 : baseIndent;

  const tagTemplate = html`
    <div class='nav-bar-tag-and-paths hierarchical-tag ${(context.renderStyle === 'read' ? 'expanded' : (tag.expanded ? 'expanded' : 'collapsed'))}'
         data-level='${tag.level}'>
      ${tag.name === 'General ⦂'
    ? html`<hr style='border:none; border-top: 1px dotted var(--nav-text-color); opacity:0.3; margin:-1px 0 0 0;'/>`
    : html`
          <div
            class='nav-bar-tag ${context.navActiveItemMarker} hierarchical-tag-header'
            part='section-navbar-item section-navbar-tag'
            id='link-${tag.elementId}'
            data-action='${context.renderStyle === 'read' ? 'navigate' : 'expand-collapse-tag'}'
            data-content-id='${tag.elementId}'
            data-first-path-id='${tag.firstPathId}'
            tabindex='0'
            style='padding: ${isRootLevel ? '8px 12px' : '6px 10px'};
                   position: relative;
                   background-color: ${!isRootLevel ? 'rgba(var(--nav-hover-bg-color-rgb, 240, 240, 240), 0.2)' : 'transparent'};
                   border-left: ${isRootLevel ? '4px solid var(--nav-accent-color)' : 'none'};
                   margin-left: ${context.isInParentContainer ? 0 : indentSize}px;
                   max-width: calc(100% - ${context.isInParentContainer ? 0 : indentSize}px);
                   overflow: hidden;'
          >
            <div style="display:flex; align-items:center; justify-content: space-between; width: 100%;">
              <div style="display: flex; align-items: center; flex: 1; min-width: 0;">
                <span style="margin-right: 8px; font-size: ${isRootLevel ? '16px' : '14px'};">
                  📁
                </span>
                <span style="color: ${isRootLevel ? 'var(--nav-accent-color)' : 'var(--nav-text-color)'};
                             font-size: ${isRootLevel ? '15px' : '13px'};
                             font-weight: ${isRootLevel ? 'bold' : '500'};
                             text-shadow: ${isRootLevel ? '0 1px 1px rgba(0,0,0,0.1)' : 'none'};
                             white-space: nowrap;
                             overflow: hidden;
                             text-overflow: ellipsis;">
                  ${tag.displayName || tag.name}
                </span>
              </div>

              <div style="display: flex; align-items: center; margin-left: 8px; flex-shrink: 0;">
              </div>
            </div>
            ${tag.isLeaf ? html`<div class='nav-bar-tag-icon' tabindex='0' data-action='expand-collapse-tag'></div>` : ''}
          </div>
        `
}
      ${(context.infoDescriptionHeadingsInNavBar === 'true' && tag.isLeaf)
    ? html`
          ${context.renderStyle === 'focused' && context.onNavTagClick === 'expand-collapse'
    ? ''
    : html`
              <div class='tag-headers'>
                ${tag.headers.map((header) => html`
                <div
                  class='nav-bar-h${header.depth} ${context.navActiveItemMarker}'
                  part='section-navbar-item section-navbar-h${header.depth}'
                  id='link-${tag.elementId}--${new marked.Slugger().slug(header.text)}'
                  data-action='navigate'
                  data-content-id='${tag.elementId}--${new marked.Slugger().slug(header.text)}'
                  tabindex='0'
                > ${header.text}</div>`)}
              </div>`
}`
    : ''
}

      <!-- 统一的虚线容器：包含文档和子分组 -->
      ${(hasVisiblePaths || hasChildren || context.renderStyle !== 'read') ? html`
        <div class='unified-content-container'
             style='max-height: ${isExpanded ? 'none' : '0'};
                    overflow: ${isExpanded ? 'visible' : 'hidden'};
                    transition: max-height 0.3s ease, overflow 0.3s ease;
                    margin-left: ${context.isInParentContainer ? 0 : indentSize}px;
                    border-left: 2px dashed rgba(var(--nav-accent-color-rgb, 0, 123, 255), 0.4);
                    padding-left: 12px;
                    background: linear-gradient(to right,
                      rgba(var(--nav-hover-bg-color-rgb, 240, 240, 240), 0.1) 0%,
                      transparent 30px);
                    border-radius: 0 0 8px 8px;'>

          <!-- 文档路径 -->
          ${hasVisiblePaths ? tag.paths.filter((v) => {
    if (context.searchVal) {
      return getMatchedPaths(context.searchVal, v, tag.fullName || tag.name);
    }
    return true;
  }).map((p) => html`
            <div
              class='nav-bar-path ${context.navActiveItemMarker} ${context.usePathInNavBar === 'true' ? 'small-font' : ''}'
              part='section-navbar-item section-navbar-path'
              data-action='navigate'
              data-content-id='${p.elementId}'
              id='link-${p.elementId}'
              tabindex='0'
              style='padding: 6px 10px; margin: 3px 0; border-radius: 6px;
                     transition: all 0.2s ease;
                     border-left: 3px solid transparent;
                     background: rgba(255, 255, 255, 0.5);
                     cursor: pointer;'
            >
              <span style = 'display:flex; align-items:center; ${p.deprecated ? 'filter:opacity(0.5)' : ''}'>
                ${html`<span class='nav-method ${context.showMethodInNavBar} ${p.method}'
                             style='margin-right: 10px; font-size: 9px;
                                    padding: 3px 6px; border-radius: 4px; font-weight: bold;
                                    box-shadow: 0 1px 2px rgba(0,0,0,0.1);'>
                    ${context.showMethodInNavBar === 'as-colored-block' ? p.method.substring(0, 3).toUpperCase() : p.method.toUpperCase()}
                  </span>`
}
                ${p.isWebhook ? html`<span style='font-weight:bold; margin-right:8px; font-size: calc(var(--font-size-small) - 2px)'>WEBHOOK</span>` : ''}
                <span style='font-size: 12px; line-height: 1.4; flex: 1;
                             color: var(--nav-text-color); font-weight: 400;'>
                  ${context.usePathInNavBar === 'true'
    ? html`<span class='mono-font'>${p.path}</span>`
    : p.summary || p.shortSummary
}
                </span>
              </span>
            </div>`) : ''}

          <!-- 子分组：与文档对齐 -->
          ${hasChildren ? tag.children.map((child) => {
    // 为子分组创建一个新的上下文，标记它们在父容器内部渲染
    const childContext = { ...context, isInParentContainer: true };
    return renderHierarchicalTag(child, childContext).template;
  }) : ''}
        </div>
      ` : ''}
    </div>
  `;

  return { template: tagTemplate, hasContent: true };
}

/* eslint-disable indent */
export default function navbarTemplate() {
  if (!this.resolvedSpec || this.resolvedSpec.specLoadError) {
    return html`
      <nav class='nav-bar' part='section-navbar'>
        <slot name='nav-logo' class='logo'></slot>
      </nav>
    `;
  }
  return html`
  <nav class='nav-bar ${this.renderStyle}' part='section-navbar'>
    <slot name='nav-logo' class='logo'></slot>
    ${(this.allowSearch === 'false' && this.allowAdvancedSearch === 'false')
      ? ''
      : html`


        <div style='display:flex; flex-direction:row; justify-content:center; align-items:stretch; padding:8px 24px 12px 24px; ${this.allowAdvancedSearch === 'false' ? 'border-bottom: 1px solid var(--nav-hover-bg-color)' : ''}' part='section-navbar-search'>
          <!-- 展开/折叠所有分组按钮 -->
          <button
            data-action='toggle-all-groups'
            title='展开/折叠所有分组'
            style='margin-right: 8px; padding: 6px 8px;
                   background: var(--nav-hover-bg-color);
                   border: 1px solid var(--nav-accent-color);
                   border-radius: 4px;
                   color: var(--nav-accent-color);
                   cursor: pointer;
                   font-size: 12px;
                   min-width: 32px;
                   display: flex;
                   align-items: center;
                   justify-content: center;'
            @click='${(e) => this.toggleAllGroups(e)}'
          >
            ${this.allGroupsExpanded ? '⊟' : '⊞'}
          </button>
          ${this.allowSearch === 'false'
            ? ''
            : html`
              <div style = 'display:flex; flex:1; line-height:22px;'>
                <input id = 'nav-bar-search'
                  part = 'textbox textbox-nav-filter'
                  style = 'width:100%; padding-right:20px; color:var(--nav-hover-text-color); border-color:var(--nav-accent-color); background-color:var(--nav-hover-bg-color)'
                  type = 'text'
                  placeholder = 'Filter'
                  @change = '${this.onSearchChange}'
                  spellcheck = 'false'
                >
                <div style='margin: 6px 5px 0 -24px; font-size:var(--font-size-regular); cursor:pointer;'>&#x21a9;</div>
              </div>
              ${this.searchVal
                ? html`
                  <button @click = '${this.onClearSearch}' class='m-btn thin-border' style='margin-left:5px; color:var(--nav-text-color); width:75px; padding:6px 8px;' part='btn btn-outline btn-clear-filter'>
                    CLEAR
                  </button>`
                : ''
              }
            `
          }
          ${this.allowAdvancedSearch === 'false' || this.searchVal
            ? ''
            : html`
              <button class='m-btn primary' part='btn btn-fill btn-search' style='margin-left:5px; padding:6px 8px; width:75px' @click='${this.onShowSearchModalClicked}'>
                SEARCH
              </button>
            `
          }
        </div>
      `
    }
    ${html`<nav class='nav-scroll' tabindex='-1' part='section-navbar-scroll' @click='${(e) => navBarClickAndEnterHandler.call(this, e)}' @keyup='${(e) => navBarClickAndEnterHandler.call(this, e)}' >
      ${(this.showInfo === 'false' || !this.resolvedSpec.info)
        ? ''
        : html`
          ${(this.infoDescriptionHeadingsInNavBar === 'true')
            ? html`
              ${this.resolvedSpec.infoDescriptionHeaders.length > 0
                ? html`<div class='nav-bar-info ${this.navActiveItemMarker}' id='link-overview' data-content-id='overview' data-action='navigate' tabindex='0' part='section-navbar-item section-navbar-overview'>
                    ${this.resolvedSpec.info?.title?.trim() || 'Overview'}
                  </div>`
                : ''
              }
              <div class='overview-headers'>
                ${this.resolvedSpec.infoDescriptionHeaders.map((header) => html`
                  <div
                    class='nav-bar-h${header.depth} ${this.navActiveItemMarker}'
                    id='link-overview--${new marked.Slugger().slug(header.text)}'
                    data-action='navigate'
                    data-content-id='overview--${new marked.Slugger().slug(header.text)}'
                  >
                    ${header.text}
                  </div>`)
                }
              </div>
              ${this.resolvedSpec.infoDescriptionHeaders.length > 0 ? html`<hr style='border-top: 1px solid var(--nav-hover-bg-color); border-width:1px 0 0 0; margin: 15px 0 0 0'/>` : ''}
            `
            : html`<div class='nav-bar-info ${this.navActiveItemMarker}' id='link-overview' data-action='navigate' data-content-id='overview' tabindex='0'>
              ${this.resolvedSpec.info?.title?.trim() || 'Overview'}
            </div>`
          }
        `
      }

      ${this.allowServerSelection === 'false'
        ? ''
        : html`<div class='nav-bar-info ${this.navActiveItemMarker}' id='link-servers' data-action='navigate' data-content-id='servers' tabindex='0' part='section-navbar-item section-navbar-servers'> API Servers </div>`
      }
      ${(this.allowAuthentication === 'false' || !this.resolvedSpec.securitySchemes)
        ? ''
        : html`<div class='nav-bar-info ${this.navActiveItemMarker}' id='link-auth' data-action='navigate' data-content-id='auth' tabindex='0' part='section-navbar-item section-navbar-auth'> Authentication </div>`
      }

      <div id='link-operations-top' class='nav-bar-section operations' data-action='navigate' data-content-id='${this.renderStyle === 'focused' ? '' : 'operations-top'}' part='section-navbar-item section-navbar-operations-top'>
        <div style='font-size:16px; display:flex; margin-left:10px;'>
          ${this.renderStyle === 'focused'
            ? html`
              <div class='nav-bar-expand-all'
                data-action='expand-all'
                tabindex='0'
                title='Expand all'
              >▸</div>
              <div class='nav-bar-collapse-all'
                data-action='collapse-all'
                tabindex='0'
                title='Collapse all'
              >▸</div>`
            : ''
          }
        </div>
        <div class='nav-bar-section-title'> OPERATIONS </div>
      </div>

      <!-- HIERARCHICAL TAGS AND PATHS-->
      ${this.resolvedSpec.tags.map((tag) => renderHierarchicalTag(tag, {
        searchVal: this.searchVal,
        renderStyle: this.renderStyle,
        navActiveItemMarker: this.navActiveItemMarker,
        onNavTagClick: this.onNavTagClick,
        infoDescriptionHeadingsInNavBar: this.infoDescriptionHeadingsInNavBar,
        usePathInNavBar: this.usePathInNavBar,
        showMethodInNavBar: this.showMethodInNavBar,
      }).template)}

      <!-- COMPONENTS -->
      ${this.resolvedSpec.components && this.showComponents === 'true' && this.renderStyle === 'focused'
        ? html`
          <div id='link-components' class='nav-bar-section components'>
            <div></div>
            <div class='nav-bar-section-title'>COMPONENTS</div>
          </div>
          ${this.resolvedSpec.components.map((component) => (component.subComponents.length
            ? html`
              <div class='nav-bar-tag'
                part='section-navbar-item section-navbar-tag'
                data-action='navigate'
                data-content-id='cmp--${component.name.toLowerCase()}'
                id='link-cmp--${component.name.toLowerCase()}'
              >
                ${component.name}
              </div>
              ${component.subComponents.filter((p) => p.expanded !== false).map((p) => html`
                <div class='nav-bar-path' data-action='navigate' data-content-id='cmp--${p.id}' id='link-cmp--${p.id}'>
                  <span style = 'pointer-events: none;'> ${p.name} </span>
                </div>`)
              }`
            : ''))
          }`
        : ''
      }
    </nav>`
  }
</nav>
`;
}
