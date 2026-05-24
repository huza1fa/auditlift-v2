import { a9 as attr_class, ac as stringify } from "./index3.js";
function Card($$renderer, $$props) {
  let { class: className = "", children } = $$props;
  $$renderer.push(`<div${attr_class(`rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--background)] shadow-[var(--shadow)] ${stringify(className)}`)}>`);
  children($$renderer);
  $$renderer.push(`<!----></div>`);
}
export {
  Card as C
};
