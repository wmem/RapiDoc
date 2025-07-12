import { css } from 'lit';

export default css`
.nav-bar-info:focus-visible,
.nav-bar-tag:focus-visible,
.nav-bar-path:focus-visible {
  outline: 1px solid;
  box-shadow: none;
  outline-offset: -4px;
}
.nav-bar-expand-all:focus-visible,
.nav-bar-collapse-all:focus-visible,
.nav-bar-tag-icon:focus-visible {
  outline: 1px solid;
  box-shadow: none;
  outline-offset: 2px;
}
.nav-bar {
  width:0;
  height:100%;
  overflow: hidden;
  color:var(--nav-text-color);
  background-color: var(--nav-bg-color);
  background-blend-mode: multiply;
  line-height: calc(var(--font-size-small) + 4px);
  display:none;
  position:relative;
  flex-direction:column;
  flex-wrap:nowrap;
  word-break:break-word;
}
::slotted([slot=nav-logo]) {
  padding:16px 16px 0 16px;
}
.nav-scroll {
  overflow-x: hidden;
  overflow-y: auto;
  overflow-y: overlay;
  scrollbar-width: thin;
  scrollbar-color: var(--nav-hover-bg-color) transparent;
}

.nav-bar-tag {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
}
.nav-bar.read .nav-bar-tag-icon {
  display:none;
}
.nav-bar-paths-under-tag {
  overflow:hidden;
  transition: max-height .2s ease-out, visibility .3s;
}
.collapsed .nav-bar-paths-under-tag {
  visibility: hidden;
}

.nav-bar-expand-all {
  transform: rotate(90deg);
  cursor:pointer;
  margin-right:10px;
}
.nav-bar-collapse-all {
  transform: rotate(270deg);
  cursor:pointer;
}
.nav-bar-expand-all:hover, .nav-bar-collapse-all:hover {
  color: var(--primary-color);
}

.nav-bar-tag-icon {
  color: var(--nav-text-color);
  font-size: 20px;
}
.nav-bar-tag-icon:hover {
  color:var(--nav-hover-text-color);
}
.nav-bar.focused .nav-bar-tag-and-paths.collapsed .nav-bar-tag-icon::after {
  content: '⌵';
  width:16px;
  height:16px;
  text-align: center;
  display: inline-block;
  transform: rotate(-90deg);
  transition: transform 0.2s ease-out 0s;
}
.nav-bar.focused .nav-bar-tag-and-paths.expanded .nav-bar-tag-icon::after {
  content: '⌵';
  width:16px;
  height:16px;
  text-align: center;
  display: inline-block;
  transition: transform 0.2s ease-out 0s;
}
.nav-scroll::-webkit-scrollbar {
  width: var(--scroll-bar-width, 8px);
}
.nav-scroll::-webkit-scrollbar-track {
  background:transparent;
}
.nav-scroll::-webkit-scrollbar-thumb {
  background-color: var(--nav-hover-bg-color);
}

.nav-bar-tag {
  font-size: var(--font-size-regular);
  color: var(--nav-accent-color);
  border-left:4px solid transparent;
  font-weight:bold;
  padding: 15px 15px 15px 10px;
  text-transform: capitalize;
}

.nav-bar-components,
.nav-bar-h1,
.nav-bar-h2,
.nav-bar-info,
.nav-bar-tag,
.nav-bar-path {
  display:flex;
  cursor: pointer;
  width: 100%;
  border: none;
  border-radius:4px;
  color: var(--nav-text-color);
  background: transparent;
  border-left:4px solid transparent;
}

.nav-bar-h1,
.nav-bar-h2,
.nav-bar-path {
  font-size: calc(var(--font-size-small) + 1px);
  padding: var(--nav-item-padding);
}
.nav-bar-path.small-font {
  font-size: var(--font-size-small);
}

.nav-bar-info {
  font-size: var(--font-size-regular);
  padding: 16px 10px;
  font-weight:bold;
}
.nav-bar-section {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: var(--font-size-small);
  color: var(--nav-text-color);
  padding: var(--nav-item-padding);
  font-weight:bold;
}
.nav-bar-section.operations {
  cursor:pointer;
}
.nav-bar-section.operations:hover {
  color:var(--nav-hover-text-color);
  background-color:var(--nav-hover-bg-color);
}

.nav-bar-section:first-child {
  display: none;
}
.nav-bar-h2 {margin-left:12px;}

.nav-bar-h1.left-bar.active,
.nav-bar-h2.left-bar.active,
.nav-bar-info.left-bar.active,
.nav-bar-tag.left-bar.active,
.nav-bar-path.left-bar.active,
.nav-bar-section.left-bar.operations.active {
  border-left:4px solid var(--nav-accent-color);
  color:var(--nav-hover-text-color);
}

.nav-bar-h1.colored-block.active,
.nav-bar-h2.colored-block.active,
.nav-bar-info.colored-block.active,
.nav-bar-tag.colored-block.active,
.nav-bar-path.colored-block.active,
.nav-bar-section.colored-block.operations.active {
  background-color: var(--nav-accent-color);
  color: var(--nav-accent-text-color);
  border-radius: 0;
}

.nav-bar-h1:hover,
.nav-bar-h2:hover,
.nav-bar-info:hover,
.nav-bar-tag:hover,
.nav-bar-path:hover {
  color:var(--nav-hover-text-color);
  background-color:var(--nav-hover-bg-color);
}

/* 选中状态的简单视觉效果 */
.nav-bar-path.active {
  background: rgba(var(--nav-accent-color-rgb, 0, 123, 255), 0.2) !important;
  color: var(--nav-accent-color) !important;
  border-left: 3px solid var(--nav-accent-color) !important;
  font-weight: 600 !important;
}

.nav-bar-tag.active {
  background: rgba(var(--nav-accent-color-rgb, 0, 123, 255), 0.08) !important;
  border-left: 4px solid var(--nav-accent-color) !important;
  color: var(--nav-accent-color) !important;
  font-weight: 600 !important;
}

/* 层级标签样式 */
.hierarchical-tag {
  position: relative;
}

.hierarchical-tag-header {
  position: relative;
  transition: all 0.2s ease;
  border-radius: 6px;
  margin: 2px 4px;
}

.hierarchical-tag-header:hover {
  background-color: var(--nav-hover-bg-color) !important;
  transform: translateX(2px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* 层级连接线 */
.hierarchical-tag::before {
  content: '';
  position: absolute;
  left: -2px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom,
    transparent 0%,
    var(--nav-hover-bg-color) 20%,
    var(--nav-hover-bg-color) 80%,
    transparent 100%);
  opacity: 0.6;
}

/* 根级标签不显示连接线 */
.nav-scroll > .hierarchical-tag::before {
  display: none;
}

/* 子级标签的路径样式 */
.hierarchical-tag .nav-bar-paths-under-tag {
  border-radius: 0 0 6px 6px;
  background: linear-gradient(135deg,
    rgba(var(--nav-hover-bg-color-rgb, 240, 240, 240), 0.1) 0%,
    rgba(var(--nav-hover-bg-color-rgb, 240, 240, 240), 0.05) 100%);
}

/* 层级子元素容器 */
.hierarchical-children {
  border-left: 2px solid var(--nav-hover-bg-color);
  margin-left: 12px;
  border-radius: 0 0 0 8px;
  background: linear-gradient(to right,
    rgba(var(--nav-hover-bg-color-rgb, 240, 240, 240), 0.1) 0%,
    transparent 20px);
}

/* 路径项的增强样式 */
.hierarchical-tag .nav-bar-path {
  position: relative;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.hierarchical-tag .nav-bar-path:hover {
  background-color: rgba(var(--primary-color-rgb, 0, 123, 255), 0.1);
  border-left: 3px solid var(--primary-color);
  transform: translateX(3px);
}

/* HTTP方法标签的增强样式 */
.hierarchical-tag .nav-method {
  border-radius: 3px;
  font-weight: bold;
  text-shadow: 0 1px 1px rgba(0,0,0,0.1);
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

/* 文件夹图标的动画 */
.hierarchical-tag-header span[title] {
  transition: transform 0.2s ease;
}

.hierarchical-tag-header:hover span[title] {
  transform: scale(1.1);
}

/* 层级指示器的样式优化 */
.hierarchical-tag .nav-bar-tag span[style*="monospace"] {
  color: var(--nav-accent-color);
  font-weight: bold;
  opacity: 0.8;
}

/* 子项数量指示器 */
.hierarchical-tag .nav-bar-tag span[style*="margin-left: auto"] {
  background: var(--nav-accent-color);
  color: var(--nav-accent-text-color);
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: bold;
  min-width: 16px;
  text-align: center;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .hierarchical-children {
    margin-left: 8px;
  }

  .hierarchical-tag-header {
    margin: 1px 2px;
  }
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  .hierarchical-tag::before {
    background: linear-gradient(to bottom,
      transparent 0%,
      rgba(255,255,255,0.1) 20%,
      rgba(255,255,255,0.1) 80%,
      transparent 100%);
  }

  .hierarchical-children {
    background: linear-gradient(to right,
      rgba(255,255,255,0.05) 0%,
      transparent 20px);
  }
}
`;
