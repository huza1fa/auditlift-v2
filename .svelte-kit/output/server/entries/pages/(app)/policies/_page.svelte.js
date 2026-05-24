import { a7 as attributes, a5 as escape_html, _ as derived, a3 as ensure_array_like, a9 as attr_class, ac as stringify, a4 as attr, ab as attr_style } from "../../../../chunks/index3.js";
import { g as getIconContext } from "../../../../chunks/context.js";
import { C as CaretUp, a as CaretDown } from "../../../../chunks/CaretUp.js";
import { D as Download } from "../../../../chunks/Download.js";
import { F as FileText } from "../../../../chunks/FileText.js";
import { F as FloppyDisk } from "../../../../chunks/FloppyDisk.js";
import { P as PencilSimple } from "../../../../chunks/PencilSimple.js";
import { P as Plus } from "../../../../chunks/Plus.js";
import { S as Spinner } from "../../../../chunks/Spinner.js";
import { T as Trash } from "../../../../chunks/Trash.js";
import { X } from "../../../../chunks/X.js";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { B as Button } from "../../../../chunks/Button.js";
import { C as Card } from "../../../../chunks/Card.js";
import { B as Badge } from "../../../../chunks/Badge.js";
import { b as toastSuccess, a as toastError } from "../../../../chunks/toasts.svelte.js";
import { g as getLocale } from "../../../../chunks/runtime.js";
import { p as policies_title } from "../../../../chunks/policies_title.js";
import "../../../../chunks/client.js";
import { h as html } from "../../../../chunks/html.js";
function ArrowCounterClockwise($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const ctx = getIconContext();
    let { children, $$slots, $$events, ...props } = $$props;
    let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
    let color = derived(() => props.color ?? ctx.color ?? "currentColor");
    let size = derived(() => props.size ?? ctx.size ?? "1em");
    let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
    function svgAttr(obj) {
      let { weight: weight2, color: color2, size: size2, mirrored: mirrored2, ...attrs } = obj;
      return attrs;
    }
    $$renderer2.push(`<svg${attributes(
      {
        xmlns: "http://www.w3.org/2000/svg",
        role: "img",
        width: size(),
        height: size(),
        fill: color(),
        transform: mirrored() ? "scale(-1, 1)" : void 0,
        viewBox: "0 0 256 256",
        ...svgAttr(ctx),
        ...svgAttr(props)
      },
      void 0,
      void 0,
      void 0,
      3
    )}>`);
    if (children) {
      $$renderer2.push("<!--[0-->");
      children($$renderer2);
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
    if (weight() === "bold") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<path d="M228,128a100,100,0,0,1-98.66,100H128a99.39,99.39,0,0,1-68.62-27.29,12,12,0,0,1,16.48-17.45,76,76,0,1,0-1.57-109c-.13.13-.25.25-.39.37L54.89,92H72a12,12,0,0,1,0,24H24a12,12,0,0,1-12-12V56a12,12,0,0,1,24,0V76.72L57.48,57.06A100,100,0,0,1,228,128Z"></path>`);
    } else if (weight() === "duotone") {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<path d="M216,128a88,88,0,1,1-88-88A88,88,0,0,1,216,128Z" opacity="0.2"></path><path d="M224,128a96,96,0,0,1-94.71,96H128A95.38,95.38,0,0,1,62.1,197.8a8,8,0,0,1,11-11.63A80,80,0,1,0,71.43,71.39a3.07,3.07,0,0,1-.26.25L44.59,96H72a8,8,0,0,1,0,16H24a8,8,0,0,1-8-8V56a8,8,0,0,1,16,0V85.8L60.25,60A96,96,0,0,1,224,128Z"></path>`);
    } else if (weight() === "fill") {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<path d="M224,128a96,96,0,0,1-94.71,96H128A95.38,95.38,0,0,1,62.1,197.8a8,8,0,0,1,11-11.63A80,80,0,1,0,71.43,71.39a3.07,3.07,0,0,1-.26.25L60.63,81.29l17,17A8,8,0,0,1,72,112H24a8,8,0,0,1-8-8V56A8,8,0,0,1,29.66,50.3L49.31,70,60.25,60A96,96,0,0,1,224,128Z"></path>`);
    } else if (weight() === "light") {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`<path d="M222,128a94,94,0,0,1-92.74,94H128a93.43,93.43,0,0,1-64.5-25.65,6,6,0,1,1,8.24-8.72A82,82,0,1,0,70,70l-.19.19L39.44,98H72a6,6,0,0,1,0,12H24a6,6,0,0,1-6-6V56a6,6,0,0,1,12,0V90.34L61.63,61.4A94,94,0,0,1,222,128Z"></path>`);
    } else if (weight() === "regular") {
      $$renderer2.push("<!--[4-->");
      $$renderer2.push(`<path d="M224,128a96,96,0,0,1-94.71,96H128A95.38,95.38,0,0,1,62.1,197.8a8,8,0,0,1,11-11.63A80,80,0,1,0,71.43,71.39a3.07,3.07,0,0,1-.26.25L44.59,96H72a8,8,0,0,1,0,16H24a8,8,0,0,1-8-8V56a8,8,0,0,1,16,0V85.8L60.25,60A96,96,0,0,1,224,128Z"></path>`);
    } else if (weight() === "thin") {
      $$renderer2.push("<!--[5-->");
      $$renderer2.push(`<path d="M220,128a92,92,0,0,1-90.77,92H128a91.47,91.47,0,0,1-63.13-25.1,4,4,0,1,1,5.5-5.82A84,84,0,1,0,68.6,68.57l-.13.12L34.3,100H72a4,4,0,0,1,0,8H24a4,4,0,0,1-4-4V56a4,4,0,0,1,8,0V94.89l35-32A92,92,0,0,1,220,128Z"></path>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html((console.error('Unsupported icon weight. Choose from "thin", "light", "regular", "bold", "fill", or "duotone".'), ""))}`);
    }
    $$renderer2.push(`<!--]--></svg>`);
  });
}
function ClockCounterClockwise($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const ctx = getIconContext();
    let { children, $$slots, $$events, ...props } = $$props;
    let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
    let color = derived(() => props.color ?? ctx.color ?? "currentColor");
    let size = derived(() => props.size ?? ctx.size ?? "1em");
    let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
    function svgAttr(obj) {
      let { weight: weight2, color: color2, size: size2, mirrored: mirrored2, ...attrs } = obj;
      return attrs;
    }
    $$renderer2.push(`<svg${attributes(
      {
        xmlns: "http://www.w3.org/2000/svg",
        role: "img",
        width: size(),
        height: size(),
        fill: color(),
        transform: mirrored() ? "scale(-1, 1)" : void 0,
        viewBox: "0 0 256 256",
        ...svgAttr(ctx),
        ...svgAttr(props)
      },
      void 0,
      void 0,
      void 0,
      3
    )}>`);
    if (children) {
      $$renderer2.push("<!--[0-->");
      children($$renderer2);
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
    if (weight() === "bold") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<path d="M140,80v41.21l34.17,20.5a12,12,0,1,1-12.34,20.58l-40-24A12,12,0,0,1,116,128V80a12,12,0,0,1,24,0ZM128,28A99.38,99.38,0,0,0,57.24,57.34c-4.69,4.74-9,9.37-13.24,14V64a12,12,0,0,0-24,0v40a12,12,0,0,0,12,12H72a12,12,0,0,0,0-24H57.77C63,86,68.37,80.22,74.26,74.26a76,76,0,1,1,1.58,109,12,12,0,0,0-16.48,17.46A100,100,0,1,0,128,28Z"></path>`);
    } else if (weight() === "duotone") {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<path d="M216,128a88,88,0,1,1-88-88A88,88,0,0,1,216,128Z" opacity="0.2"></path><path d="M136,80v43.47l36.12,21.67a8,8,0,0,1-8.24,13.72l-40-24A8,8,0,0,1,120,128V80a8,8,0,0,1,16,0Zm-8-48A95.44,95.44,0,0,0,60.08,60.15C52.81,67.51,46.35,74.59,40,82V64a8,8,0,0,0-16,0v40a8,8,0,0,0,8,8H72a8,8,0,0,0,0-16H49c7.15-8.42,14.27-16.35,22.39-24.57a80,80,0,1,1,1.66,114.75,8,8,0,1,0-11,11.64A96,96,0,1,0,128,32Z"></path>`);
    } else if (weight() === "fill") {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<path d="M224,128A96,96,0,0,1,62.11,197.82a8,8,0,1,1,11-11.64A80,80,0,1,0,71.43,71.43C67.9,75,64.58,78.51,61.35,82L77.66,98.34A8,8,0,0,1,72,112H32a8,8,0,0,1-8-8V64a8,8,0,0,1,13.66-5.66L50,70.7c3.22-3.49,6.54-7,10.06-10.55A96,96,0,0,1,224,128ZM128,72a8,8,0,0,0-8,8v48a8,8,0,0,0,3.88,6.86l40,24a8,8,0,1,0,8.24-13.72L136,123.47V80A8,8,0,0,0,128,72Z"></path>`);
    } else if (weight() === "light") {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`<path d="M134,80v44.6l37.09,22.25a6,6,0,0,1-6.18,10.3l-40-24A6,6,0,0,1,122,128V80a6,6,0,0,1,12,0Zm-6-46A93.4,93.4,0,0,0,61.51,61.56c-8.58,8.68-16,17-23.51,25.8V64a6,6,0,0,0-12,0v40a6,6,0,0,0,6,6H72a6,6,0,0,0,0-12H44.73C52.86,88.29,60.79,79.35,70,70a82,82,0,1,1,1.7,117.62,6,6,0,1,0-8.24,8.72A94,94,0,1,0,128,34Z"></path>`);
    } else if (weight() === "regular") {
      $$renderer2.push("<!--[4-->");
      $$renderer2.push(`<path d="M136,80v43.47l36.12,21.67a8,8,0,0,1-8.24,13.72l-40-24A8,8,0,0,1,120,128V80a8,8,0,0,1,16,0Zm-8-48A95.44,95.44,0,0,0,60.08,60.15C52.81,67.51,46.35,74.59,40,82V64a8,8,0,0,0-16,0v40a8,8,0,0,0,8,8H72a8,8,0,0,0,0-16H49c7.15-8.42,14.27-16.35,22.39-24.57a80,80,0,1,1,1.66,114.75,8,8,0,1,0-11,11.64A96,96,0,1,0,128,32Z"></path>`);
    } else if (weight() === "thin") {
      $$renderer2.push("<!--[5-->");
      $$renderer2.push(`<path d="M132,80v45.74l38.06,22.83a4,4,0,0,1-4.12,6.86l-40-24A4,4,0,0,1,124,128V80a4,4,0,0,1,8,0Zm-4-44A91.42,91.42,0,0,0,62.93,63C53.05,73,44.66,82.47,36,92.86V64a4,4,0,0,0-8,0v40a4,4,0,0,0,4,4H72a4,4,0,0,0,0-8H40.47C49.61,89,58.3,79,68.6,68.6a84,84,0,1,1,1.75,120.49,4,4,0,1,0-5.5,5.82A92,92,0,1,0,128,36Z"></path>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html((console.error('Unsupported icon weight. Choose from "thin", "light", "regular", "bold", "fill", or "duotone".'), ""))}`);
    }
    $$renderer2.push(`<!--]--></svg>`);
  });
}
function Code($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const ctx = getIconContext();
    let { children, $$slots, $$events, ...props } = $$props;
    let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
    let color = derived(() => props.color ?? ctx.color ?? "currentColor");
    let size = derived(() => props.size ?? ctx.size ?? "1em");
    let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
    function svgAttr(obj) {
      let { weight: weight2, color: color2, size: size2, mirrored: mirrored2, ...attrs } = obj;
      return attrs;
    }
    $$renderer2.push(`<svg${attributes(
      {
        xmlns: "http://www.w3.org/2000/svg",
        role: "img",
        width: size(),
        height: size(),
        fill: color(),
        transform: mirrored() ? "scale(-1, 1)" : void 0,
        viewBox: "0 0 256 256",
        ...svgAttr(ctx),
        ...svgAttr(props)
      },
      void 0,
      void 0,
      void 0,
      3
    )}>`);
    if (children) {
      $$renderer2.push("<!--[0-->");
      children($$renderer2);
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
    if (weight() === "bold") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<path d="M71.68,97.22,34.74,128l36.94,30.78a12,12,0,1,1-15.36,18.44l-48-40a12,12,0,0,1,0-18.44l48-40A12,12,0,0,1,71.68,97.22Zm176,21.56-48-40a12,12,0,1,0-15.36,18.44L221.26,128l-36.94,30.78a12,12,0,1,0,15.36,18.44l48-40a12,12,0,0,0,0-18.44ZM164.1,28.72a12,12,0,0,0-15.38,7.18l-64,176a12,12,0,0,0,7.18,15.37A11.79,11.79,0,0,0,96,228a12,12,0,0,0,11.28-7.9l64-176A12,12,0,0,0,164.1,28.72Z"></path>`);
    } else if (weight() === "duotone") {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<path d="M240,128l-48,40H64L16,128,64,88H192Z" opacity="0.2"></path><path d="M69.12,94.15,28.5,128l40.62,33.85a8,8,0,1,1-10.24,12.29l-48-40a8,8,0,0,1,0-12.29l48-40a8,8,0,0,1,10.24,12.3Zm176,27.7-48-40a8,8,0,1,0-10.24,12.3L227.5,128l-40.62,33.85a8,8,0,1,0,10.24,12.29l48-40a8,8,0,0,0,0-12.29ZM162.73,32.48a8,8,0,0,0-10.25,4.79l-64,176a8,8,0,0,0,4.79,10.26A8.14,8.14,0,0,0,96,224a8,8,0,0,0,7.52-5.27l64-176A8,8,0,0,0,162.73,32.48Z"></path>`);
    } else if (weight() === "fill") {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM92.8,145.6a8,8,0,1,1-9.6,12.8l-32-24a8,8,0,0,1,0-12.8l32-24a8,8,0,0,1,9.6,12.8L69.33,128Zm58.89-71.4-32,112a8,8,0,1,1-15.38-4.4l32-112a8,8,0,0,1,15.38,4.4Zm53.11,60.2-32,24a8,8,0,0,1-9.6-12.8L186.67,128,163.2,110.4a8,8,0,1,1,9.6-12.8l32,24a8,8,0,0,1,0,12.8Z"></path>`);
    } else if (weight() === "light") {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`<path d="M67.84,92.61,25.37,128l42.47,35.39a6,6,0,1,1-7.68,9.22l-48-40a6,6,0,0,1,0-9.22l48-40a6,6,0,0,1,7.68,9.22Zm176,30.78-48-40a6,6,0,1,0-7.68,9.22L230.63,128l-42.47,35.39a6,6,0,1,0,7.68,9.22l48-40a6,6,0,0,0,0-9.22Zm-81.79-89A6,6,0,0,0,154.36,38l-64,176A6,6,0,0,0,94,221.64a6.15,6.15,0,0,0,2,.36,6,6,0,0,0,5.64-3.95l64-176A6,6,0,0,0,162.05,34.36Z"></path>`);
    } else if (weight() === "regular") {
      $$renderer2.push("<!--[4-->");
      $$renderer2.push(`<path d="M69.12,94.15,28.5,128l40.62,33.85a8,8,0,1,1-10.24,12.29l-48-40a8,8,0,0,1,0-12.29l48-40a8,8,0,0,1,10.24,12.3Zm176,27.7-48-40a8,8,0,1,0-10.24,12.3L227.5,128l-40.62,33.85a8,8,0,1,0,10.24,12.29l48-40a8,8,0,0,0,0-12.29ZM162.73,32.48a8,8,0,0,0-10.25,4.79l-64,176a8,8,0,0,0,4.79,10.26A8.14,8.14,0,0,0,96,224a8,8,0,0,0,7.52-5.27l64-176A8,8,0,0,0,162.73,32.48Z"></path>`);
    } else if (weight() === "thin") {
      $$renderer2.push("<!--[5-->");
      $$renderer2.push(`<path d="M66.56,91.07,22.25,128l44.31,36.93A4,4,0,0,1,64,172a3.94,3.94,0,0,1-2.56-.93l-48-40a4,4,0,0,1,0-6.14l48-40a4,4,0,0,1,5.12,6.14Zm176,33.86-48-40a4,4,0,1,0-5.12,6.14L233.75,128l-44.31,36.93a4,4,0,1,0,5.12,6.14l48-40a4,4,0,0,0,0-6.14ZM161.37,36.24a4,4,0,0,0-5.13,2.39l-64,176a4,4,0,0,0,2.39,5.13A4.12,4.12,0,0,0,96,220a4,4,0,0,0,3.76-2.63l64-176A4,4,0,0,0,161.37,36.24Z"></path>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html((console.error('Unsupported icon weight. Choose from "thin", "light", "regular", "bold", "fill", or "duotone".'), ""))}`);
    }
    $$renderer2.push(`<!--]--></svg>`);
  });
}
function Eye($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const ctx = getIconContext();
    let { children, $$slots, $$events, ...props } = $$props;
    let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
    let color = derived(() => props.color ?? ctx.color ?? "currentColor");
    let size = derived(() => props.size ?? ctx.size ?? "1em");
    let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
    function svgAttr(obj) {
      let { weight: weight2, color: color2, size: size2, mirrored: mirrored2, ...attrs } = obj;
      return attrs;
    }
    $$renderer2.push(`<svg${attributes(
      {
        xmlns: "http://www.w3.org/2000/svg",
        role: "img",
        width: size(),
        height: size(),
        fill: color(),
        transform: mirrored() ? "scale(-1, 1)" : void 0,
        viewBox: "0 0 256 256",
        ...svgAttr(ctx),
        ...svgAttr(props)
      },
      void 0,
      void 0,
      void 0,
      3
    )}>`);
    if (children) {
      $$renderer2.push("<!--[0-->");
      children($$renderer2);
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
    if (weight() === "bold") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<path d="M251,123.13c-.37-.81-9.13-20.26-28.48-39.61C196.63,57.67,164,44,128,44S59.37,57.67,33.51,83.52C14.16,102.87,5.4,122.32,5,123.13a12.08,12.08,0,0,0,0,9.75c.37.82,9.13,20.26,28.49,39.61C59.37,198.34,92,212,128,212s68.63-13.66,94.48-39.51c19.36-19.35,28.12-38.79,28.49-39.61A12.08,12.08,0,0,0,251,123.13Zm-46.06,33C183.47,177.27,157.59,188,128,188s-55.47-10.73-76.91-31.88A130.36,130.36,0,0,1,29.52,128,130.45,130.45,0,0,1,51.09,99.89C72.54,78.73,98.41,68,128,68s55.46,10.73,76.91,31.89A130.36,130.36,0,0,1,226.48,128,130.45,130.45,0,0,1,204.91,156.12ZM128,84a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,84Zm0,64a20,20,0,1,1,20-20A20,20,0,0,1,128,148Z"></path>`);
    } else if (weight() === "duotone") {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<path d="M128,56C48,56,16,128,16,128s32,72,112,72,112-72,112-72S208,56,128,56Zm0,112a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z" opacity="0.2"></path><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path>`);
    } else if (weight() === "fill") {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z"></path>`);
    } else if (weight() === "light") {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`<path d="M245.48,125.57c-.34-.78-8.66-19.23-27.24-37.81C201,70.54,171.38,50,128,50S55,70.54,37.76,87.76c-18.58,18.58-26.9,37-27.24,37.81a6,6,0,0,0,0,4.88c.34.77,8.66,19.22,27.24,37.8C55,185.47,84.62,206,128,206s73-20.53,90.24-37.75c18.58-18.58,26.9-37,27.24-37.8A6,6,0,0,0,245.48,125.57ZM128,194c-31.38,0-58.78-11.42-81.45-33.93A134.77,134.77,0,0,1,22.69,128,134.56,134.56,0,0,1,46.55,95.94C69.22,73.42,96.62,62,128,62s58.78,11.42,81.45,33.94A134.56,134.56,0,0,1,233.31,128C226.94,140.21,195,194,128,194Zm0-112a46,46,0,1,0,46,46A46.06,46.06,0,0,0,128,82Zm0,80a34,34,0,1,1,34-34A34,34,0,0,1,128,162Z"></path>`);
    } else if (weight() === "regular") {
      $$renderer2.push("<!--[4-->");
      $$renderer2.push(`<path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path>`);
    } else if (weight() === "thin") {
      $$renderer2.push("<!--[5-->");
      $$renderer2.push(`<path d="M243.66,126.38c-.34-.76-8.52-18.89-26.83-37.2C199.87,72.22,170.7,52,128,52S56.13,72.22,39.17,89.18c-18.31,18.31-26.49,36.44-26.83,37.2a4.08,4.08,0,0,0,0,3.25c.34.77,8.52,18.89,26.83,37.2,17,17,46.14,37.17,88.83,37.17s71.87-20.21,88.83-37.17c18.31-18.31,26.49-36.43,26.83-37.2A4.08,4.08,0,0,0,243.66,126.38Zm-32.7,35c-23.07,23-51,34.62-83,34.62s-59.89-11.65-83-34.62A135.71,135.71,0,0,1,20.44,128,135.69,135.69,0,0,1,45,94.62C68.11,71.65,96,60,128,60s59.89,11.65,83,34.62A135.79,135.79,0,0,1,235.56,128,135.71,135.71,0,0,1,211,161.38ZM128,84a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,84Zm0,80a36,36,0,1,1,36-36A36,36,0,0,1,128,164Z"></path>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html((console.error('Unsupported icon weight. Choose from "thin", "light", "regular", "bold", "fill", or "duotone".'), ""))}`);
    }
    $$renderer2.push(`<!--]--></svg>`);
  });
}
const en_policies_generate_section = (
  /** @type {(inputs: Policies_Generate_SectionInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Generate a Policy`
    );
  }
);
const policies_generate_section = (
  /** @type {((inputs?: Policies_Generate_SectionInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_Generate_SectionInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_generate_section();
  })
);
const en_policies_tab_standard = (
  /** @type {(inputs: Policies_Tab_StandardInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Standard Policies`
    );
  }
);
const policies_tab_standard = (
  /** @type {((inputs?: Policies_Tab_StandardInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_Tab_StandardInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_tab_standard();
  })
);
const en_policies_tab_custom = (
  /** @type {(inputs: Policies_Tab_CustomInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Custom Policy`
    );
  }
);
const policies_tab_custom = (
  /** @type {((inputs?: Policies_Tab_CustomInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_Tab_CustomInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_tab_custom();
  })
);
const en_policies_generate_button = (
  /** @type {(inputs: Policies_Generate_ButtonInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Generate`
    );
  }
);
const policies_generate_button = (
  /** @type {((inputs?: Policies_Generate_ButtonInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_Generate_ButtonInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_generate_button();
  })
);
const en_policies_generating_short = (
  /** @type {(inputs: Policies_Generating_ShortInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Generating...`
    );
  }
);
const policies_generating_short = (
  /** @type {((inputs?: Policies_Generating_ShortInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_Generating_ShortInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_generating_short();
  })
);
const en_policies_step_analysing = (
  /** @type {(inputs: Policies_Step_AnalysingInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Analysing your company profile…`
    );
  }
);
const policies_step_analysing = (
  /** @type {((inputs?: Policies_Step_AnalysingInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_Step_AnalysingInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_step_analysing();
  })
);
const en_policies_step_reviewing = (
  /** @type {(inputs: Policies_Step_ReviewingInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Reviewing framework requirements…`
    );
  }
);
const policies_step_reviewing = (
  /** @type {((inputs?: Policies_Step_ReviewingInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_Step_ReviewingInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_step_reviewing();
  })
);
const en_policies_step_drafting = (
  /** @type {(inputs: Policies_Step_DraftingInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Drafting policy content…`
    );
  }
);
const policies_step_drafting = (
  /** @type {((inputs?: Policies_Step_DraftingInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_Step_DraftingInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_step_drafting();
  })
);
const en_policies_step_tailoring = (
  /** @type {(inputs: Policies_Step_TailoringInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Tailoring to your tech stack…`
    );
  }
);
const policies_step_tailoring = (
  /** @type {((inputs?: Policies_Step_TailoringInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_Step_TailoringInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_step_tailoring();
  })
);
const en_policies_step_finalising = (
  /** @type {(inputs: Policies_Step_FinalisingInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Finalising…`
    );
  }
);
const policies_step_finalising = (
  /** @type {((inputs?: Policies_Step_FinalisingInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_Step_FinalisingInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_step_finalising();
  })
);
const en_policies_empty_title = (
  /** @type {(inputs: Policies_Empty_TitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `No policies generated yet`
    );
  }
);
const policies_empty_title = (
  /** @type {((inputs?: Policies_Empty_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_Empty_TitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_empty_title();
  })
);
const en_policies_empty_subtitle = (
  /** @type {(inputs: Policies_Empty_SubtitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Use the generator above to create your first policy.`
    );
  }
);
const policies_empty_subtitle = (
  /** @type {((inputs?: Policies_Empty_SubtitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_Empty_SubtitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_empty_subtitle();
  })
);
const en_policies_error_generic = (
  /** @type {(inputs: Policies_Error_GenericInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Failed to generate policy. Please try again.`
    );
  }
);
const policies_error_generic = (
  /** @type {((inputs?: Policies_Error_GenericInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_Error_GenericInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_error_generic();
  })
);
const en_policies_view = (
  /** @type {(inputs: Policies_ViewInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `View`
    );
  }
);
const policies_view = (
  /** @type {((inputs?: Policies_ViewInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_ViewInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_view();
  })
);
const en_policies_hide = (
  /** @type {(inputs: Policies_HideInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Hide`
    );
  }
);
const policies_hide = (
  /** @type {((inputs?: Policies_HideInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_HideInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_hide();
  })
);
const en_policies_download = (
  /** @type {(inputs: Policies_DownloadInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Download`
    );
  }
);
const policies_download = (
  /** @type {((inputs?: Policies_DownloadInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_DownloadInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_download();
  })
);
const en_policies_regenerate = (
  /** @type {(inputs: Policies_RegenerateInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Regenerate`
    );
  }
);
const policies_regenerate = (
  /** @type {((inputs?: Policies_RegenerateInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_RegenerateInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_regenerate();
  })
);
const en_policies_badge_custom = (
  /** @type {(inputs: Policies_Badge_CustomInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Custom`
    );
  }
);
const policies_badge_custom = (
  /** @type {((inputs?: Policies_Badge_CustomInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_Badge_CustomInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_badge_custom();
  })
);
const en_policies_generated_on = (
  /** @type {(inputs: Policies_Generated_OnInputs) => LocalizedString} */
  (i) => {
    return (
      /** @type {LocalizedString} */
      `Generated ${i?.date}`
    );
  }
);
const policies_generated_on = (
  /** @type {((inputs: Policies_Generated_OnInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_Generated_OnInputs, { locale?: "en" }, {}>} */
  ((inputs, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_generated_on(inputs);
  })
);
const en_policies_group_security_fundamentals = (
  /** @type {(inputs: Policies_Group_Security_FundamentalsInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Security Fundamentals`
    );
  }
);
const policies_group_security_fundamentals = (
  /** @type {((inputs?: Policies_Group_Security_FundamentalsInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_Group_Security_FundamentalsInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_group_security_fundamentals();
  })
);
const en_policies_group_operations = (
  /** @type {(inputs: Policies_Group_OperationsInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Operations`
    );
  }
);
const policies_group_operations = (
  /** @type {((inputs?: Policies_Group_OperationsInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_Group_OperationsInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_group_operations();
  })
);
const en_policies_group_data_privacy = (
  /** @type {(inputs: Policies_Group_Data_PrivacyInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Data & Privacy`
    );
  }
);
const policies_group_data_privacy = (
  /** @type {((inputs?: Policies_Group_Data_PrivacyInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_Group_Data_PrivacyInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_group_data_privacy();
  })
);
const en_policies_group_business_continuity = (
  /** @type {(inputs: Policies_Group_Business_ContinuityInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Business Continuity`
    );
  }
);
const policies_group_business_continuity = (
  /** @type {((inputs?: Policies_Group_Business_ContinuityInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_Group_Business_ContinuityInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_group_business_continuity();
  })
);
const en_policies_group_vendor = (
  /** @type {(inputs: Policies_Group_VendorInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Vendor & Suppliers`
    );
  }
);
const policies_group_vendor = (
  /** @type {((inputs?: Policies_Group_VendorInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_Group_VendorInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_group_vendor();
  })
);
const en_policies_group_technology = (
  /** @type {(inputs: Policies_Group_TechnologyInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Technology`
    );
  }
);
const policies_group_technology = (
  /** @type {((inputs?: Policies_Group_TechnologyInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_Group_TechnologyInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_group_technology();
  })
);
const en_policies_view_raw = (
  /** @type {(inputs: Policies_View_RawInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Markdown`
    );
  }
);
const policies_view_raw = (
  /** @type {((inputs?: Policies_View_RawInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_View_RawInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_view_raw();
  })
);
const en_policies_view_preview = (
  /** @type {(inputs: Policies_View_PreviewInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Preview`
    );
  }
);
const policies_view_preview = (
  /** @type {((inputs?: Policies_View_PreviewInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_View_PreviewInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_view_preview();
  })
);
const POLICY_DESCRIPTIONS = {
  "security-policy": "Overarching InfoSec governance covering asset classification, access controls, and risk management.",
  "access-control-policy": "User provisioning, MFA requirements, privileged access, and quarterly access reviews.",
  "password-policy": "Password complexity, rotation schedules, and credential storage requirements.",
  "acceptable-use-policy": "Rules for acceptable use of company systems, devices, and data.",
  "incident-response-policy": "Detection, escalation, and remediation procedures for security incidents.",
  "change-management-policy": "Approval workflows and testing requirements for system and infrastructure changes.",
  "vulnerability-management-policy": "Scanning cadence, patch timelines, and remediation SLAs.",
  "physical-security-policy": "Data center access controls, visitor management, and equipment disposal.",
  "data-classification-policy": "Data sensitivity tiers, labeling requirements, and handling rules.",
  "data-retention-policy": "Retention schedules, deletion procedures, and legal hold processes.",
  "privacy-policy": "User data collection, processing, storage, and deletion rights.",
  "business-continuity-policy": "RTO/RPO targets, disaster recovery procedures, and testing schedules.",
  "vendor-management-policy": "Third-party risk assessment, due diligence, and ongoing monitoring.",
  "cryptography-policy": "Encryption standards, key management, and certificate rotation.",
  "remote-work-policy": "VPN requirements, device management, and secure remote access rules.",
  "ai-usage-policy": "Approved AI tools, data privacy constraints, and employee usage guidelines."
};
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const generationSteps = [
      policies_step_analysing(),
      policies_step_reviewing(),
      policies_step_drafting(),
      policies_step_tailoring(),
      policies_step_finalising()
    ];
    let selectedType = "security-policy";
    let generating = false;
    let generationStepIndex = 0;
    let progressWidth = "0%";
    let errorMessage = "";
    let policyList = data.policies;
    let expandedId = null;
    let editingId = null;
    let editContent = "";
    let saving = false;
    let archivingId = null;
    let versionsByPolicy = {};
    let versionsOpenId = null;
    let restoringVersionId = null;
    let previewingId = null;
    const policyGroups = [
      {
        label: policies_group_security_fundamentals(),
        items: [
          { value: "security-policy", label: "Security Policy" },
          {
            value: "access-control-policy",
            label: "Access Control Policy"
          },
          { value: "password-policy", label: "Password Policy" },
          {
            value: "acceptable-use-policy",
            label: "Acceptable Use Policy"
          }
        ]
      },
      {
        label: policies_group_operations(),
        items: [
          {
            value: "incident-response-policy",
            label: "Incident Response Policy"
          },
          {
            value: "change-management-policy",
            label: "Change Management Policy"
          },
          {
            value: "vulnerability-management-policy",
            label: "Vulnerability Management Policy"
          },
          {
            value: "physical-security-policy",
            label: "Physical Security Policy"
          }
        ]
      },
      {
        label: policies_group_data_privacy(),
        items: [
          {
            value: "data-classification-policy",
            label: "Data Classification Policy"
          },
          {
            value: "data-retention-policy",
            label: "Data Retention Policy"
          },
          { value: "privacy-policy", label: "Privacy Policy" }
        ]
      },
      {
        label: policies_group_business_continuity(),
        items: [
          {
            value: "business-continuity-policy",
            label: "Business Continuity Policy"
          }
        ]
      },
      {
        label: policies_group_vendor(),
        items: [
          {
            value: "vendor-management-policy",
            label: "Vendor Management Policy"
          }
        ]
      },
      {
        label: policies_group_technology(),
        items: [
          { value: "cryptography-policy", label: "Cryptography Policy" },
          { value: "remote-work-policy", label: "Remote Work Policy" },
          { value: "ai-usage-policy", label: "AI Usage Policy" }
        ]
      }
    ];
    function formatDate(date) {
      if (!date) return "recently";
      const d = new Date(date);
      const now = /* @__PURE__ */ new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffDays = Math.floor(diffMs / (1e3 * 60 * 60 * 24));
      if (diffDays === 0) return "today";
      if (diffDays === 1) return "1 day ago";
      if (diffDays < 30) return `${diffDays} days ago`;
      return d.toLocaleDateString();
    }
    function downloadPolicy(policy) {
      window.open(`/api/policies/${policy.id}/download`, "_blank");
    }
    function toggleExpand(id) {
      const closing = expandedId === id;
      expandedId = closing ? null : id;
      if (!closing && !(id in versionsByPolicy)) {
        fetch(`/api/policies/${id}?versions=true`).then((r) => r.json()).then((body) => {
          versionsByPolicy = { ...versionsByPolicy, [id]: body.versions };
        }).catch(() => {
          versionsByPolicy = { ...versionsByPolicy, [id]: [] };
        });
      }
    }
    function formatVersionDate(date) {
      const d = new Date(date);
      const now = /* @__PURE__ */ new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / (1e3 * 60));
      const diffHours = Math.floor(diffMs / (1e3 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1e3 * 60 * 60 * 24));
      if (diffMins < 1) return "just now";
      if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
      if (diffDays === 1) return "1 day ago";
      if (diffDays < 30) return `${diffDays} days ago`;
      return d.toLocaleDateString();
    }
    let stepInterval = null;
    function startGenerationProgress() {
      generationStepIndex = 0;
      progressWidth = "0%";
      requestAnimationFrame(() => {
        progressWidth = "90%";
      });
      stepInterval = setInterval(
        () => {
          if (generationStepIndex < generationSteps.length - 1) {
            generationStepIndex += 1;
          }
        },
        2200
      );
    }
    function stopGenerationProgress(success) {
      if (stepInterval !== null) {
        clearInterval(stepInterval);
        stepInterval = null;
      }
      if (success) {
        progressWidth = "100%";
      }
      generationStepIndex = 0;
    }
    async function callGenerate(body) {
      generating = true;
      errorMessage = "";
      startGenerationProgress();
      try {
        const res = await fetch("/api/policies/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          errorMessage = json.message ?? policies_error_generic();
          stopGenerationProgress(false);
          return;
        }
        const newPolicy = await res.json();
        policyList = [newPolicy, ...policyList];
        stopGenerationProgress(true);
      } catch {
        errorMessage = policies_error_generic();
        stopGenerationProgress(false);
      } finally {
        generating = false;
      }
    }
    async function generateStandard() {
      await callGenerate({ policyType: selectedType });
    }
    async function regenerate(policy) {
      const body = { policyType: policy.type };
      if (policy.isCustom && policy.customPrompt) {
        body.policyType = "custom";
        body.customTitle = policy.title;
        body.customPrompt = policy.customPrompt;
      }
      await callGenerate(body);
    }
    function startEdit(policy) {
      editingId = policy.id;
      editContent = policy.content;
    }
    function cancelEdit() {
      editingId = null;
      editContent = "";
    }
    async function saveEdit(policy) {
      saving = true;
      try {
        const res = await fetch(`/api/policies/${policy.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: editContent })
        });
        if (!res.ok) throw new Error("Failed to save");
        toastSuccess("Policy saved");
        policyList = policyList.map((p) => p.id === policy.id ? { ...p, content: editContent, editedAt: /* @__PURE__ */ new Date() } : p);
        editingId = null;
        editContent = "";
      } catch {
        toastError("Failed to save policy");
      } finally {
        saving = false;
      }
    }
    async function archivePolicy(policy) {
      archivingId = policy.id;
      try {
        const res = await fetch(`/api/policies/${policy.id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to archive");
        policyList = policyList.filter((p) => p.id !== policy.id);
        toastSuccess("Policy archived");
      } catch {
        toastError("Failed to archive");
      } finally {
        archivingId = null;
      }
    }
    $$renderer2.push(`<div class="space-y-6"><div class="flex items-center justify-between"><h1 class="text-2xl font-bold text-[var(--foreground)]">${escape_html(policies_title())}</h1></div> `);
    Card($$renderer2, {
      class: "p-6",
      children: ($$renderer3) => {
        $$renderer3.push(`<h2 class="mb-4 font-semibold text-[var(--foreground)]">${escape_html(policies_generate_section())}</h2> <div class="mb-5 flex gap-1 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background-alt)] p-1"><button${attr_class(`flex-1 rounded-[var(--radius)] px-3 py-1.5 text-sm font-medium transition-colors ${stringify(
          "bg-[var(--background)] text-[var(--foreground)] shadow-[var(--shadow)]"
        )}`)}>${escape_html(policies_tab_standard())}</button> <button${attr_class(`flex-1 rounded-[var(--radius)] px-3 py-1.5 text-sm font-medium transition-colors ${stringify("text-[var(--foreground-muted)] hover:text-[var(--foreground)]")}`)}>${escape_html(policies_tab_custom())}</button></div> `);
        {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="space-y-4"><!--[-->`);
          const each_array = ensure_array_like(policyGroups);
          for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
            let group = each_array[$$index_1];
            $$renderer3.push(`<div><p class="mb-2 text-xs font-semibold tracking-wider text-[var(--foreground-muted)] uppercase">${escape_html(group.label)}</p> <div class="grid grid-cols-2 gap-2 sm:grid-cols-4"><!--[-->`);
            const each_array_1 = ensure_array_like(group.items);
            for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
              let item = each_array_1[$$index];
              $$renderer3.push(`<button${attr_class(`rounded-[var(--radius)] border px-3 py-2 text-left text-sm transition-colors ${stringify(selectedType === item.value ? "border-[var(--brand)] bg-[var(--brand-light)] font-medium text-[var(--brand)]" : "border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--brand)] hover:bg-[var(--background-alt)]")}`)}><span class="block font-medium">${escape_html(item.label)}</span> `);
              if (POLICY_DESCRIPTIONS[item.value]) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<span${attr_class(`mt-0.5 block text-xs leading-tight text-[var(--foreground-muted)] ${stringify(selectedType === item.value ? "text-[var(--brand)]" : "")}`)}>${escape_html(POLICY_DESCRIPTIONS[item.value])}</span>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--></button>`);
            }
            $$renderer3.push(`<!--]--></div></div>`);
          }
          $$renderer3.push(`<!--]--> `);
          Button($$renderer3, {
            onclick: generateStandard,
            disabled: generating,
            class: "mt-2",
            children: ($$renderer4) => {
              if (generating) {
                $$renderer4.push("<!--[0-->");
                Spinner($$renderer4, { size: 16, class: "animate-spin" });
                $$renderer4.push(`<!----> ${escape_html(policies_generating_short())}`);
              } else {
                $$renderer4.push("<!--[-1-->");
                Plus($$renderer4, { size: 16 });
                $$renderer4.push(`<!----> ${escape_html(policies_generate_button())}`);
              }
              $$renderer4.push(`<!--]-->`);
            }
          });
          $$renderer3.push(`<!----></div>`);
        }
        $$renderer3.push(`<!--]--> `);
        {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (generating) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="mt-4 rounded-[var(--radius)] bg-[var(--info-light)] px-4 py-3"><div class="flex items-center gap-2">`);
          Spinner($$renderer3, { size: 16, class: "shrink-0 animate-spin text-[var(--info)]" });
          $$renderer3.push(`<!----> <p class="text-sm font-medium text-[var(--info)]">${escape_html(generationSteps[generationStepIndex])}</p></div> <div class="mt-3 h-1 w-full overflow-hidden rounded-full" style="background-color: color-mix(in srgb, var(--info) 20%, transparent);"><div class="h-full rounded-full bg-[var(--info)]"${attr_style(`width: ${stringify(progressWidth)}; transition: width 12s ease-out;`)}></div></div></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (errorMessage) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="mt-4 rounded-[var(--radius)] bg-[var(--danger-light)] px-4 py-3"><p class="text-sm text-[var(--danger)]">${escape_html(errorMessage)}</p></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]-->`);
      }
    });
    $$renderer2.push(`<!----> `);
    if (policyList.length === 0) {
      $$renderer2.push("<!--[0-->");
      Card($$renderer2, {
        class: "p-8 text-center",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="mx-auto mb-3 flex justify-center">`);
          FileText($$renderer3, { size: 40, color: "var(--foreground-subtle)" });
          $$renderer3.push(`<!----></div> <p class="font-medium text-[var(--foreground)]">${escape_html(policies_empty_title())}</p> <p class="mt-1 text-sm text-[var(--foreground-muted)]">${escape_html(policies_empty_subtitle())}</p>`);
        }
      });
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="space-y-3"><!--[-->`);
      const each_array_2 = ensure_array_like(policyList);
      for (let $$index_3 = 0, $$length = each_array_2.length; $$index_3 < $$length; $$index_3++) {
        let policy = each_array_2[$$index_3];
        Card($$renderer2, {
          class: "overflow-hidden",
          children: ($$renderer3) => {
            $$renderer3.push(`<div class="flex items-center justify-between p-4"><div class="flex min-w-0 items-center gap-3">`);
            FileText($$renderer3, { size: 20, color: "var(--brand)", class: "shrink-0" });
            $$renderer3.push(`<!----> <div class="min-w-0"><div class="flex items-center gap-2"><p class="truncate font-medium text-[var(--foreground)]">${escape_html(policy.title)}</p> `);
            if (policy.isCustom) {
              $$renderer3.push("<!--[0-->");
              Badge($$renderer3, {
                variant: "info",
                children: ($$renderer4) => {
                  $$renderer4.push(`<!---->${escape_html(policies_badge_custom())}`);
                }
              });
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--></div> <p class="text-xs text-[var(--foreground-muted)]">${escape_html(policies_generated_on({ date: formatDate(policy.createdAt) }))}</p></div></div> <div class="flex shrink-0 gap-2">`);
            Button($$renderer3, {
              variant: "ghost",
              size: "sm",
              onclick: () => toggleExpand(policy.id),
              children: ($$renderer4) => {
                $$renderer4.push(`<!---->${escape_html(expandedId === policy.id ? policies_hide() : policies_view())} `);
                if (expandedId === policy.id) {
                  $$renderer4.push("<!--[0-->");
                  CaretUp($$renderer4, { size: 12 });
                } else {
                  $$renderer4.push("<!--[-1-->");
                  CaretDown($$renderer4, { size: 12 });
                }
                $$renderer4.push(`<!--]-->`);
              }
            });
            $$renderer3.push(`<!----> `);
            Button($$renderer3, {
              variant: "secondary",
              size: "sm",
              onclick: () => downloadPolicy(policy),
              children: ($$renderer4) => {
                Download($$renderer4, { size: 14 });
                $$renderer4.push(`<!----> ${escape_html(policies_download())}`);
              }
            });
            $$renderer3.push(`<!----> `);
            Button($$renderer3, {
              variant: "ghost",
              size: "sm",
              onclick: () => regenerate(policy),
              disabled: generating,
              children: ($$renderer4) => {
                $$renderer4.push(`<!---->${escape_html(policies_regenerate())}`);
              }
            });
            $$renderer3.push(`<!----> `);
            Button($$renderer3, {
              variant: "ghost",
              size: "sm",
              onclick: () => startEdit(policy),
              children: ($$renderer4) => {
                PencilSimple($$renderer4, { size: 14 });
              }
            });
            $$renderer3.push(`<!----> `);
            Button($$renderer3, {
              variant: "ghost",
              size: "sm",
              onclick: () => archivePolicy(policy),
              disabled: archivingId === policy.id,
              children: ($$renderer4) => {
                Trash($$renderer4, { size: 14 });
              }
            });
            $$renderer3.push(`<!----></div></div> `);
            if (expandedId === policy.id) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<div class="border-t border-[var(--border)] bg-[var(--background-alt)] p-4">`);
              if (editingId === policy.id) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<textarea class="h-64 w-full resize-none rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-[var(--foreground)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none">`);
                const $$body_1 = escape_html(editContent);
                if ($$body_1) {
                  $$renderer3.push(`${$$body_1}`);
                }
                $$renderer3.push(`</textarea> <div class="mt-3 flex justify-end gap-2">`);
                Button($$renderer3, {
                  variant: "ghost",
                  size: "sm",
                  onclick: cancelEdit,
                  children: ($$renderer4) => {
                    X($$renderer4, { size: 14 });
                    $$renderer4.push(`<!----> Cancel`);
                  }
                });
                $$renderer3.push(`<!----> `);
                Button($$renderer3, {
                  size: "sm",
                  onclick: () => saveEdit(policy),
                  disabled: saving,
                  children: ($$renderer4) => {
                    FloppyDisk($$renderer4, { size: 14 });
                    $$renderer4.push(`<!----> ${escape_html(saving ? "Saving..." : "Save")}`);
                  }
                });
                $$renderer3.push(`<!----></div>`);
              } else {
                $$renderer3.push("<!--[-1-->");
                $$renderer3.push(`<div class="mb-3 flex items-center gap-1 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] p-0.5 w-fit"><button${attr_class(`rounded-[var(--radius)] px-2.5 py-1 text-xs font-medium transition-colors ${stringify(previewingId !== policy.id ? "bg-[var(--background-alt)] text-[var(--foreground)] shadow-sm" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]")}`)}><span class="inline-flex items-center gap-1">`);
                Code($$renderer3, { size: 12 });
                $$renderer3.push(`<!----> ${escape_html(policies_view_raw())}</span></button> <button${attr_class(`rounded-[var(--radius)] px-2.5 py-1 text-xs font-medium transition-colors ${stringify(previewingId === policy.id ? "bg-[var(--background-alt)] text-[var(--foreground)] shadow-sm" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]")}`)}><span class="inline-flex items-center gap-1">`);
                Eye($$renderer3, { size: 12 });
                $$renderer3.push(`<!----> ${escape_html(policies_view_preview())}</span></button></div> `);
                if (previewingId === policy.id) {
                  $$renderer3.push("<!--[0-->");
                  $$renderer3.push(`<div class="prose prose-sm max-w-none text-[var(--foreground)] [&amp;_h1]:text-lg [&amp;_h1]:font-bold [&amp;_h1]:mb-2 [&amp;_h1]:text-[var(--foreground)] [&amp;_h2]:text-base [&amp;_h2]:font-semibold [&amp;_h2]:mb-2 [&amp;_h2]:text-[var(--foreground)] [&amp;_h3]:text-sm [&amp;_h3]:font-semibold [&amp;_h3]:mb-1 [&amp;_h3]:text-[var(--foreground)] [&amp;_h4]:text-[var(--foreground)] [&amp;_p]:text-sm [&amp;_p]:leading-relaxed [&amp;_p]:mb-2 [&amp;_ul]:text-sm [&amp;_ul]:ml-4 [&amp;_ul]:list-disc [&amp;_ol]:text-sm [&amp;_ol]:ml-4 [&amp;_ol]:list-decimal [&amp;_li]:mb-1 [&amp;_li]:text-[var(--foreground)] [&amp;_strong]:font-semibold [&amp;_strong]:text-[var(--foreground)] [&amp;_a]:text-[var(--brand)] [&amp;_hr]:border-[var(--border)] [&amp;_hr]:my-4 [&amp;_code]:text-[var(--foreground)] [&amp;_blockquote]:text-[var(--foreground-muted)] [&amp;_blockquote]:border-[var(--border)]">${html(DOMPurify.sanitize(marked(policy.content)))}</div>`);
                } else {
                  $$renderer3.push("<!--[-1-->");
                  $$renderer3.push(`<pre class="font-mono text-xs leading-relaxed whitespace-pre-wrap text-[var(--foreground)]">${escape_html(policy.content)}</pre>`);
                }
                $$renderer3.push(`<!--]-->`);
              }
              $$renderer3.push(`<!--]--> `);
              if (versionsByPolicy[policy.id]?.length > 0) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<div class="mt-4 border-t border-[var(--border)] pt-4"><button class="flex items-center gap-1.5 text-xs font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]">`);
                ClockCounterClockwise($$renderer3, { size: 14 });
                $$renderer3.push(`<!----> Version history `);
                if (versionsOpenId === policy.id) {
                  $$renderer3.push("<!--[0-->");
                  CaretUp($$renderer3, { size: 11 });
                } else {
                  $$renderer3.push("<!--[-1-->");
                  CaretDown($$renderer3, { size: 11 });
                }
                $$renderer3.push(`<!--]--></button> `);
                if (versionsOpenId === policy.id) {
                  $$renderer3.push("<!--[0-->");
                  $$renderer3.push(`<div class="mt-3 space-y-2"><!--[-->`);
                  const each_array_3 = ensure_array_like(versionsByPolicy[policy.id]);
                  for (let $$index_2 = 0, $$length2 = each_array_3.length; $$index_2 < $$length2; $$index_2++) {
                    let version = each_array_3[$$index_2];
                    $$renderer3.push(`<div class="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2.5"><div class="flex items-center justify-between gap-3"><p class="text-xs font-medium text-[var(--foreground-muted)]">${escape_html(formatVersionDate(version.savedAt))}</p> <button${attr("disabled", restoringVersionId === version.id, true)} class="flex shrink-0 items-center gap-1 rounded-[var(--radius)] border border-[var(--border)] px-2 py-1 text-xs font-medium text-[var(--foreground-muted)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)] disabled:opacity-50">`);
                    if (restoringVersionId === version.id) {
                      $$renderer3.push("<!--[0-->");
                      Spinner($$renderer3, { size: 11, class: "animate-spin" });
                      $$renderer3.push(`<!----> Restoring...`);
                    } else {
                      $$renderer3.push("<!--[-1-->");
                      ArrowCounterClockwise($$renderer3, { size: 11 });
                      $$renderer3.push(`<!----> Restore`);
                    }
                    $$renderer3.push(`<!--]--></button></div> <p class="mt-1.5 line-clamp-2 font-mono text-xs leading-relaxed text-[var(--foreground-subtle)]">${escape_html(version.content.slice(0, 120))}${escape_html(version.content.length > 120 ? "..." : "")}</p></div>`);
                  }
                  $$renderer3.push(`<!--]--></div>`);
                } else {
                  $$renderer3.push("<!--[-1-->");
                }
                $$renderer3.push(`<!--]--></div>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--></div>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]-->`);
          }
        });
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
