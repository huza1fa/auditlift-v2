import { ah as attr_class, aj as stringify } from './index3-DkaUimNV.js';

function Card($$renderer, $$props) {
  let { class: className = "", children } = $$props;
  $$renderer.push(`<div${attr_class(`rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--background)] shadow-[var(--shadow)] ${stringify(className)}`)}>`);
  children($$renderer);
  $$renderer.push(`<!----></div>`);
}

export { Card as C };
//# sourceMappingURL=Card-C3cXNBIr.js.map
