import { ae as escape_html, ac as ensure_array_like, ag as attr_class, ai as stringify, X as derived, ad as attr, aj as attributes, ao as bind_props } from './index3-A6PWQL_h.js';
import { g as goto } from './client2-Bwd3FYwy.js';
import { A as ArrowLeft } from './ArrowLeft-P6H8Suc_.js';
import { A as ArrowRight } from './ArrowRight-DIl4ZNuw.js';
import { B as Buildings } from './Buildings-CJmiqFPP.js';
import { C as Check } from './Check-BpJ48H7I.js';
import { g as getIconContext } from './context-CZy4Dq81.js';
import { F as FileText } from './FileText-I3BE0SWy.js';
import { S as ShieldCheck } from './ShieldCheck-D1JuyFWv.js';
import { U as Users } from './Users-CikAlWVe.js';
import { B as Button } from './Button-CIQKvzrf.js';
import { C as Card } from './Card-B7pxgW8R.js';
import { B as Badge } from './Badge-Cer8O6lG.js';
import { e as getLocale } from './runtime-tB9eeHiM.js';
import './root-kx8UrV8x.js';
import './index-BIEJqs8E.js';
import './exports-B5ORJhfK.js';
import './state.svelte-CwtDSSSI.js';

function Cloud($$renderer, $$props) {
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
      $$renderer2.push(`<path d="M160,36A92.09,92.09,0,0,0,79,84.36,68,68,0,1,0,72,220h88a92,92,0,0,0,0-184Zm0,160H72a44,44,0,0,1-1.82-88A91.86,91.86,0,0,0,68,128a12,12,0,0,0,24,0,68,68,0,1,1,68,68Z"></path>`);
    } else if (weight() === "duotone") {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<path d="M240,128a80,80,0,0,1-80,80H72A56,56,0,1,1,85.92,97.74l0,.1A80,80,0,0,1,240,128Z" opacity="0.2"></path><path d="M160,40A88.09,88.09,0,0,0,81.29,88.67,64,64,0,1,0,72,216h88a88,88,0,0,0,0-176Zm0,160H72a48,48,0,0,1,0-96c1.1,0,2.2,0,3.29.11A88,88,0,0,0,72,128a8,8,0,0,0,16,0,72,72,0,1,1,72,72Z"></path>`);
    } else if (weight() === "fill") {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<path d="M160.06,40A88.1,88.1,0,0,0,81.29,88.67h0A87.48,87.48,0,0,0,72,127.73,8.18,8.18,0,0,1,64.57,136,8,8,0,0,1,56,128a103.66,103.66,0,0,1,5.34-32.92,4,4,0,0,0-4.75-5.18A64.09,64.09,0,0,0,8,152c0,35.19,29.75,64,65,64H160a88.09,88.09,0,0,0,87.93-91.48C246.11,77.54,207.07,40,160.06,40Z"></path>`);
    } else if (weight() === "light") {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`<path d="M160,42A86.11,86.11,0,0,0,82.43,90.88,62,62,0,1,0,72,214h88a86,86,0,0,0,0-172Zm0,160H72a50,50,0,0,1,0-100,50.67,50.67,0,0,1,5.91.35A85.61,85.61,0,0,0,74,128a6,6,0,0,0,12,0,74,74,0,1,1,74,74Z"></path>`);
    } else if (weight() === "regular") {
      $$renderer2.push("<!--[4-->");
      $$renderer2.push(`<path d="M160,40A88.09,88.09,0,0,0,81.29,88.67,64,64,0,1,0,72,216h88a88,88,0,0,0,0-176Zm0,160H72a48,48,0,0,1,0-96c1.1,0,2.2,0,3.29.11A88,88,0,0,0,72,128a8,8,0,0,0,16,0,72,72,0,1,1,72,72Z"></path>`);
    } else if (weight() === "thin") {
      $$renderer2.push("<!--[5-->");
      $$renderer2.push(`<path d="M160,44A84.11,84.11,0,0,0,83.59,93.12,60.71,60.71,0,0,0,72,92a60,60,0,0,0,0,120h88a84,84,0,0,0,0-168Zm0,160H72a52,52,0,1,1,8.55-103.3A83.66,83.66,0,0,0,76,128a4,4,0,0,0,8,0,76,76,0,1,1,76,76Z"></path>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html((console.error('Unsupported icon weight. Choose from "thin", "light", "regular", "bold", "fill", or "duotone".'), ""))}`);
    }
    $$renderer2.push(`<!--]--></svg>`);
  });
}
function Database($$renderer, $$props) {
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
      $$renderer2.push(`<path d="M196,35.52C177.62,25.51,153.48,20,128,20S78.38,25.51,60,35.52C39.37,46.79,28,62.58,28,80v96c0,17.42,11.37,33.21,32,44.48,18.35,10,42.49,15.52,68,15.52s49.62-5.51,68-15.52c20.66-11.27,32-27.06,32-44.48V80C228,62.58,216.63,46.79,196,35.52ZM204,128c0,17-31.21,36-76,36s-76-19-76-36v-8.46a88.9,88.9,0,0,0,8,4.94c18.35,10,42.49,15.52,68,15.52s49.62-5.51,68-15.52a88.9,88.9,0,0,0,8-4.94ZM128,44c44.79,0,76,19,76,36s-31.21,36-76,36S52,97,52,80,83.21,44,128,44Zm0,168c-44.79,0-76-19-76-36v-8.46a88.9,88.9,0,0,0,8,4.94c18.35,10,42.49,15.52,68,15.52s49.62-5.51,68-15.52a88.9,88.9,0,0,0,8-4.94V176C204,193,172.79,212,128,212Z"></path>`);
    } else if (weight() === "duotone") {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<path d="M216,80c0,26.51-39.4,48-88,48S40,106.51,40,80s39.4-48,88-48S216,53.49,216,80Z" opacity="0.2"></path><path d="M128,24C74.17,24,32,48.6,32,80v96c0,31.4,42.17,56,96,56s96-24.6,96-56V80C224,48.6,181.83,24,128,24Zm80,104c0,9.62-7.88,19.43-21.61,26.92C170.93,163.35,150.19,168,128,168s-42.93-4.65-58.39-13.08C55.88,147.43,48,137.62,48,128V111.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64ZM69.61,53.08C85.07,44.65,105.81,40,128,40s42.93,4.65,58.39,13.08C200.12,60.57,208,70.38,208,80s-7.88,19.43-21.61,26.92C170.93,115.35,150.19,120,128,120s-42.93-4.65-58.39-13.08C55.88,99.43,48,89.62,48,80S55.88,60.57,69.61,53.08ZM186.39,202.92C170.93,211.35,150.19,216,128,216s-42.93-4.65-58.39-13.08C55.88,195.43,48,185.62,48,176V159.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64V176C208,185.62,200.12,195.43,186.39,202.92Z"></path>`);
    } else if (weight() === "fill") {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<path d="M128,24C74.17,24,32,48.6,32,80v96c0,31.4,42.17,56,96,56s96-24.6,96-56V80C224,48.6,181.83,24,128,24Zm80,104c0,9.62-7.88,19.43-21.61,26.92C170.93,163.35,150.19,168,128,168s-42.93-4.65-58.39-13.08C55.88,147.43,48,137.62,48,128V111.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64Zm-21.61,74.92C170.93,211.35,150.19,216,128,216s-42.93-4.65-58.39-13.08C55.88,195.43,48,185.62,48,176V159.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64V176C208,185.62,200.12,195.43,186.39,202.92Z"></path>`);
    } else if (weight() === "light") {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`<path d="M128,26C75.29,26,34,49.72,34,80v96c0,30.28,41.29,54,94,54s94-23.72,94-54V80C222,49.72,180.71,26,128,26Zm0,12c44.45,0,82,19.23,82,42s-37.55,42-82,42S46,102.77,46,80,83.55,38,128,38Zm82,138c0,22.77-37.55,42-82,42s-82-19.23-82-42V154.79C62,171.16,92.37,182,128,182s66-10.84,82-27.21Zm0-48c0,22.77-37.55,42-82,42s-82-19.23-82-42V106.79C62,123.16,92.37,134,128,134s66-10.84,82-27.21Z"></path>`);
    } else if (weight() === "regular") {
      $$renderer2.push("<!--[4-->");
      $$renderer2.push(`<path d="M128,24C74.17,24,32,48.6,32,80v96c0,31.4,42.17,56,96,56s96-24.6,96-56V80C224,48.6,181.83,24,128,24Zm80,104c0,9.62-7.88,19.43-21.61,26.92C170.93,163.35,150.19,168,128,168s-42.93-4.65-58.39-13.08C55.88,147.43,48,137.62,48,128V111.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64ZM69.61,53.08C85.07,44.65,105.81,40,128,40s42.93,4.65,58.39,13.08C200.12,60.57,208,70.38,208,80s-7.88,19.43-21.61,26.92C170.93,115.35,150.19,120,128,120s-42.93-4.65-58.39-13.08C55.88,99.43,48,89.62,48,80S55.88,60.57,69.61,53.08ZM186.39,202.92C170.93,211.35,150.19,216,128,216s-42.93-4.65-58.39-13.08C55.88,195.43,48,185.62,48,176V159.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64V176C208,185.62,200.12,195.43,186.39,202.92Z"></path>`);
    } else if (weight() === "thin") {
      $$renderer2.push("<!--[5-->");
      $$renderer2.push(`<path d="M192.14,42.55C174.94,33.17,152.16,28,128,28S81.06,33.17,63.86,42.55C45.89,52.35,36,65.65,36,80v96c0,14.35,9.89,27.65,27.86,37.45,17.2,9.38,40,14.55,64.14,14.55s46.94-5.17,64.14-14.55c18-9.8,27.86-23.1,27.86-37.45V80C220,65.65,210.11,52.35,192.14,42.55ZM212,176c0,11.29-8.41,22.1-23.69,30.43C172.27,215.18,150.85,220,128,220s-44.27-4.82-60.31-13.57C52.41,198.1,44,187.29,44,176V149.48c4.69,5.93,11.37,11.34,19.86,16,17.2,9.38,40,14.55,64.14,14.55s46.94-5.17,64.14-14.55c8.49-4.63,15.17-10,19.86-16Zm0-48c0,11.29-8.41,22.1-23.69,30.43C172.27,167.18,150.85,172,128,172s-44.27-4.82-60.31-13.57C52.41,150.1,44,139.29,44,128V101.48c4.69,5.93,11.37,11.34,19.86,16,17.2,9.38,40,14.55,64.14,14.55s46.94-5.17,64.14-14.55c8.49-4.63,15.17-10,19.86-16Zm-23.69-17.57C172.27,119.18,150.85,124,128,124s-44.27-4.82-60.31-13.57C52.41,102.1,44,91.29,44,80s8.41-22.1,23.69-30.43C83.73,40.82,105.15,36,128,36s44.27,4.82,60.31,13.57C203.59,57.9,212,68.71,212,80S203.59,102.1,188.31,110.43Z"></path>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html((console.error('Unsupported icon weight. Choose from "thin", "light", "regular", "bold", "fill", or "duotone".'), ""))}`);
    }
    $$renderer2.push(`<!--]--></svg>`);
  });
}
function Shield($$renderer, $$props) {
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
      $$renderer2.push(`<path d="M208,36H48A20,20,0,0,0,28,56v56c0,54.29,26.32,87.22,48.4,105.29,23.71,19.39,47.44,26,48.44,26.29a12.1,12.1,0,0,0,6.32,0c1-.28,24.73-6.9,48.44-26.29,22.08-18.07,48.4-51,48.4-105.29V56A20,20,0,0,0,208,36Zm-4,76c0,35.71-13.09,64.69-38.91,86.15A126.28,126.28,0,0,1,128,219.38a126.14,126.14,0,0,1-37.09-21.23C65.09,176.69,52,147.71,52,112V60H204Z"></path>`);
    } else if (weight() === "duotone") {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<path d="M216,56v56c0,96-88,120-88,120S40,208,40,112V56a8,8,0,0,1,8-8H208A8,8,0,0,1,216,56Z" opacity="0.2"></path><path d="M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.27,47,25.53a8,8,0,0,0,4.2,0c1-.26,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0Z"></path>`);
    } else if (weight() === "fill") {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<path d="M224,56v56c0,52.72-25.52,84.67-46.93,102.19-23.06,18.86-46,25.27-47,25.53a8,8,0,0,1-4.2,0c-1-.26-23.91-6.67-47-25.53C57.52,196.67,32,164.72,32,112V56A16,16,0,0,1,48,40H208A16,16,0,0,1,224,56Z"></path>`);
    } else if (weight() === "light") {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`<path d="M208,42H48A14,14,0,0,0,34,56v56c0,51.94,25.12,83.4,46.2,100.64,22.73,18.6,45.27,24.89,46.22,25.15a6,6,0,0,0,3.16,0c.95-.26,23.49-6.55,46.22-25.15C196.88,195.4,222,163.94,222,112V56A14,14,0,0,0,208,42Zm2,70c0,37.76-13.94,68.39-41.44,91.06A131.17,131.17,0,0,1,128,225.72a130.94,130.94,0,0,1-40.56-22.66C59.94,180.39,46,149.76,46,112V56a2,2,0,0,1,2-2H208a2,2,0,0,1,2,2Z"></path>`);
    } else if (weight() === "regular") {
      $$renderer2.push("<!--[4-->");
      $$renderer2.push(`<path d="M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.27,47,25.53a8,8,0,0,0,4.2,0c1-.26,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0Z"></path>`);
    } else if (weight() === "thin") {
      $$renderer2.push("<!--[5-->");
      $$renderer2.push(`<path d="M208,44H48A12,12,0,0,0,36,56v56c0,51.16,24.73,82.12,45.47,99.1,22.4,18.32,44.55,24.5,45.48,24.76a4,4,0,0,0,2.1,0c.93-.26,23.08-6.44,45.48-24.76,20.74-17,45.47-47.94,45.47-99.1V56A12,12,0,0,0,208,44Zm4,68c0,38.44-14.23,69.63-42.29,92.71A132.45,132.45,0,0,1,128,227.82a132.23,132.23,0,0,1-41.71-23.11C58.23,181.63,44,150.44,44,112V56a4,4,0,0,1,4-4H208a4,4,0,0,1,4,4Z"></path>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html((console.error('Unsupported icon weight. Choose from "thin", "light", "regular", "bold", "fill", or "duotone".'), ""))}`);
    }
    $$renderer2.push(`<!--]--></svg>`);
  });
}
function User($$renderer, $$props) {
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
      $$renderer2.push(`<path d="M234.38,210a123.36,123.36,0,0,0-60.78-53.23,76,76,0,1,0-91.2,0A123.36,123.36,0,0,0,21.62,210a12,12,0,1,0,20.77,12c18.12-31.32,50.12-50,85.61-50s67.49,18.69,85.61,50a12,12,0,0,0,20.77-12ZM76,96a52,52,0,1,1,52,52A52.06,52.06,0,0,1,76,96Z"></path>`);
    } else if (weight() === "duotone") {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<path d="M192,96a64,64,0,1,1-64-64A64,64,0,0,1,192,96Z" opacity="0.2"></path><path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>`);
    } else if (weight() === "fill") {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<path d="M230.93,220a8,8,0,0,1-6.93,4H32a8,8,0,0,1-6.92-12c15.23-26.33,38.7-45.21,66.09-54.16a72,72,0,1,1,73.66,0c27.39,8.95,50.86,27.83,66.09,54.16A8,8,0,0,1,230.93,220Z"></path>`);
    } else if (weight() === "light") {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`<path d="M229.19,213c-15.81-27.32-40.63-46.49-69.47-54.62a70,70,0,1,0-63.44,0C67.44,166.5,42.62,185.67,26.81,213a6,6,0,1,0,10.38,6C56.4,185.81,90.34,166,128,166s71.6,19.81,90.81,53a6,6,0,1,0,10.38-6ZM70,96a58,58,0,1,1,58,58A58.07,58.07,0,0,1,70,96Z"></path>`);
    } else if (weight() === "regular") {
      $$renderer2.push("<!--[4-->");
      $$renderer2.push(`<path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>`);
    } else if (weight() === "thin") {
      $$renderer2.push("<!--[5-->");
      $$renderer2.push(`<path d="M227.46,214c-16.52-28.56-43-48.06-73.68-55.09a68,68,0,1,0-51.56,0c-30.64,7-57.16,26.53-73.68,55.09a4,4,0,0,0,6.92,4C55,184.19,89.62,164,128,164s73,20.19,92.54,54a4,4,0,0,0,3.46,2,3.93,3.93,0,0,0,2-.54A4,4,0,0,0,227.46,214ZM68,96a60,60,0,1,1,60,60A60.07,60.07,0,0,1,68,96Z"></path>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html((console.error('Unsupported icon weight. Choose from "thin", "light", "regular", "bold", "fill", or "duotone".'), ""))}`);
    }
    $$renderer2.push(`<!--]--></svg>`);
  });
}
const en_onboarding_brand_name = (
  /** @type {(inputs: Onboarding_Brand_NameInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `AuditLift`
    );
  }
);
const onboarding_brand_name = (
  /** @type {((inputs?: Onboarding_Brand_NameInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Brand_NameInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_brand_name();
  })
);
const en_onboarding_company_name_label = (
  /** @type {(inputs: Onboarding_Company_Name_LabelInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Company name`
    );
  }
);
const onboarding_company_name_label = (
  /** @type {((inputs?: Onboarding_Company_Name_LabelInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Company_Name_LabelInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_company_name_label();
  })
);
const en_onboarding_company_name_placeholder = (
  /** @type {(inputs: Onboarding_Company_Name_PlaceholderInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Acme Inc.`
    );
  }
);
const onboarding_company_name_placeholder = (
  /** @type {((inputs?: Onboarding_Company_Name_PlaceholderInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Company_Name_PlaceholderInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_company_name_placeholder();
  })
);
const en_onboarding_website_label = (
  /** @type {(inputs: Onboarding_Website_LabelInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Website`
    );
  }
);
const onboarding_website_label = (
  /** @type {((inputs?: Onboarding_Website_LabelInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Website_LabelInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_website_label();
  })
);
const en_onboarding_website_placeholder = (
  /** @type {(inputs: Onboarding_Website_PlaceholderInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `https://acme.com`
    );
  }
);
const onboarding_website_placeholder = (
  /** @type {((inputs?: Onboarding_Website_PlaceholderInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Website_PlaceholderInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_website_placeholder();
  })
);
const en_onboarding_industry_label = (
  /** @type {(inputs: Onboarding_Industry_LabelInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Industry`
    );
  }
);
const onboarding_industry_label = (
  /** @type {((inputs?: Onboarding_Industry_LabelInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Industry_LabelInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_industry_label();
  })
);
const en_onboarding_step1_title = (
  /** @type {(inputs: Onboarding_Step1_TitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Tell us about your company`
    );
  }
);
const onboarding_step1_title = (
  /** @type {((inputs?: Onboarding_Step1_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Step1_TitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_step1_title();
  })
);
const en_onboarding_step1_subtitle = (
  /** @type {(inputs: Onboarding_Step1_SubtitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `This helps us tailor your compliance journey`
    );
  }
);
const onboarding_step1_subtitle = (
  /** @type {((inputs?: Onboarding_Step1_SubtitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Step1_SubtitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_step1_subtitle();
  })
);
const en_onboarding_step2_title = (
  /** @type {(inputs: Onboarding_Step2_TitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `How big is your team?`
    );
  }
);
const onboarding_step2_title = (
  /** @type {((inputs?: Onboarding_Step2_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Step2_TitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_step2_title();
  })
);
const en_onboarding_step2_subtitle = (
  /** @type {(inputs: Onboarding_Step2_SubtitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `We'll calibrate recommendations to your team size`
    );
  }
);
const onboarding_step2_subtitle = (
  /** @type {((inputs?: Onboarding_Step2_SubtitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Step2_SubtitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_step2_subtitle();
  })
);
const en_onboarding_step3_title = (
  /** @type {(inputs: Onboarding_Step3_TitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `What's your tech stack?`
    );
  }
);
const onboarding_step3_title = (
  /** @type {((inputs?: Onboarding_Step3_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Step3_TitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_step3_title();
  })
);
const en_onboarding_step3_subtitle = (
  /** @type {(inputs: Onboarding_Step3_SubtitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Select all that apply — we'll pre-fill relevant controls`
    );
  }
);
const onboarding_step3_subtitle = (
  /** @type {((inputs?: Onboarding_Step3_SubtitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Step3_SubtitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_step3_subtitle();
  })
);
const en_onboarding_step4_title = (
  /** @type {(inputs: Onboarding_Step4_TitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `What brings you here today?`
    );
  }
);
const onboarding_step4_title = (
  /** @type {((inputs?: Onboarding_Step4_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Step4_TitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_step4_title();
  })
);
const en_onboarding_step4_subtitle = (
  /** @type {(inputs: Onboarding_Step4_SubtitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Choose the path that fits your current situation`
    );
  }
);
const onboarding_step4_subtitle = (
  /** @type {((inputs?: Onboarding_Step4_SubtitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Step4_SubtitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_step4_subtitle();
  })
);
const en_onboarding_intent_questionnaire_title = (
  /** @type {(inputs: Onboarding_Intent_Questionnaire_TitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `I have a security questionnaire to answer`
    );
  }
);
const onboarding_intent_questionnaire_title = (
  /** @type {((inputs?: Onboarding_Intent_Questionnaire_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Intent_Questionnaire_TitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_intent_questionnaire_title();
  })
);
const en_onboarding_intent_questionnaire_description = (
  /** @type {(inputs: Onboarding_Intent_Questionnaire_DescriptionInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Upload a questionnaire from a prospect and get AI-drafted answers in minutes`
    );
  }
);
const onboarding_intent_questionnaire_description = (
  /** @type {((inputs?: Onboarding_Intent_Questionnaire_DescriptionInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Intent_Questionnaire_DescriptionInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_intent_questionnaire_description();
  })
);
const en_onboarding_intent_compliance_title = (
  /** @type {(inputs: Onboarding_Intent_Compliance_TitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `I want to build my compliance foundation`
    );
  }
);
const onboarding_intent_compliance_title = (
  /** @type {((inputs?: Onboarding_Intent_Compliance_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Intent_Compliance_TitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_intent_compliance_title();
  })
);
const en_onboarding_intent_compliance_description = (
  /** @type {(inputs: Onboarding_Intent_Compliance_DescriptionInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Start working toward SOC 2, ISO 27001, or PCI DSS`
    );
  }
);
const onboarding_intent_compliance_description = (
  /** @type {((inputs?: Onboarding_Intent_Compliance_DescriptionInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Intent_Compliance_DescriptionInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_intent_compliance_description();
  })
);
const en_onboarding_nav_back = (
  /** @type {(inputs: Onboarding_Nav_BackInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Back`
    );
  }
);
const onboarding_nav_back = (
  /** @type {((inputs?: Onboarding_Nav_BackInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Nav_BackInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_nav_back();
  })
);
const en_onboarding_nav_continue = (
  /** @type {(inputs: Onboarding_Nav_ContinueInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Continue`
    );
  }
);
const onboarding_nav_continue = (
  /** @type {((inputs?: Onboarding_Nav_ContinueInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Nav_ContinueInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_nav_continue();
  })
);
const en_onboarding_nav_saving = (
  /** @type {(inputs: Onboarding_Nav_SavingInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Saving...`
    );
  }
);
const onboarding_nav_saving = (
  /** @type {((inputs?: Onboarding_Nav_SavingInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Nav_SavingInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_nav_saving();
  })
);
const en_onboarding_nav_setting_up = (
  /** @type {(inputs: Onboarding_Nav_Setting_UpInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Setting up...`
    );
  }
);
const onboarding_nav_setting_up = (
  /** @type {((inputs?: Onboarding_Nav_Setting_UpInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Nav_Setting_UpInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_nav_setting_up();
  })
);
const en_onboarding_error_company_required = (
  /** @type {(inputs: Onboarding_Error_Company_RequiredInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Company name is required`
    );
  }
);
const onboarding_error_company_required = (
  /** @type {((inputs?: Onboarding_Error_Company_RequiredInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Error_Company_RequiredInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_error_company_required();
  })
);
const en_onboarding_error_team_required = (
  /** @type {(inputs: Onboarding_Error_Team_RequiredInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Please select your team size`
    );
  }
);
const onboarding_error_team_required = (
  /** @type {((inputs?: Onboarding_Error_Team_RequiredInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Error_Team_RequiredInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_error_team_required();
  })
);
const en_onboarding_error_intent_required = (
  /** @type {(inputs: Onboarding_Error_Intent_RequiredInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Please choose a path to continue`
    );
  }
);
const onboarding_error_intent_required = (
  /** @type {((inputs?: Onboarding_Error_Intent_RequiredInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Error_Intent_RequiredInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_error_intent_required();
  })
);
const en_onboarding_error_generic = (
  /** @type {(inputs: Onboarding_Error_GenericInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Something went wrong. Please try again.`
    );
  }
);
const onboarding_error_generic = (
  /** @type {((inputs?: Onboarding_Error_GenericInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Error_GenericInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_error_generic();
  })
);
const en_onboarding_done_title = (
  /** @type {(inputs: Onboarding_Done_TitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `You're all set!`
    );
  }
);
const onboarding_done_title = (
  /** @type {((inputs?: Onboarding_Done_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Done_TitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_done_title();
  })
);
const en_onboarding_done_trial_badge = (
  /** @type {(inputs: Onboarding_Done_Trial_BadgeInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `14-day free trial started`
    );
  }
);
const onboarding_done_trial_badge = (
  /** @type {((inputs?: Onboarding_Done_Trial_BadgeInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Done_Trial_BadgeInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_done_trial_badge();
  })
);
const en_onboarding_done_subtitle_compliance = (
  /** @type {(inputs: Onboarding_Done_Subtitle_ComplianceInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Your compliance journey starts now. Let's get your first controls covered.`
    );
  }
);
const onboarding_done_subtitle_compliance = (
  /** @type {((inputs?: Onboarding_Done_Subtitle_ComplianceInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Done_Subtitle_ComplianceInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_done_subtitle_compliance();
  })
);
const en_onboarding_done_cta_compliance = (
  /** @type {(inputs: Onboarding_Done_Cta_ComplianceInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Go to dashboard`
    );
  }
);
const onboarding_done_cta_compliance = (
  /** @type {((inputs?: Onboarding_Done_Cta_ComplianceInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Done_Cta_ComplianceInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_done_cta_compliance();
  })
);
const en_onboarding_done_summary_company = (
  /** @type {(inputs: Onboarding_Done_Summary_CompanyInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Company`
    );
  }
);
const onboarding_done_summary_company = (
  /** @type {((inputs?: Onboarding_Done_Summary_CompanyInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Done_Summary_CompanyInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_done_summary_company();
  })
);
const en_onboarding_done_summary_industry = (
  /** @type {(inputs: Onboarding_Done_Summary_IndustryInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Industry`
    );
  }
);
const onboarding_done_summary_industry = (
  /** @type {((inputs?: Onboarding_Done_Summary_IndustryInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Done_Summary_IndustryInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_done_summary_industry();
  })
);
const en_onboarding_done_summary_team_size = (
  /** @type {(inputs: Onboarding_Done_Summary_Team_SizeInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Team size`
    );
  }
);
const onboarding_done_summary_team_size = (
  /** @type {((inputs?: Onboarding_Done_Summary_Team_SizeInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Done_Summary_Team_SizeInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_done_summary_team_size();
  })
);
const en_onboarding_done_summary_tech_stack = (
  /** @type {(inputs: Onboarding_Done_Summary_Tech_StackInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Tech stack`
    );
  }
);
const onboarding_done_summary_tech_stack = (
  /** @type {((inputs?: Onboarding_Done_Summary_Tech_StackInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Done_Summary_Tech_StackInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_done_summary_tech_stack();
  })
);
const en_onboarding_done_summary_path = (
  /** @type {(inputs: Onboarding_Done_Summary_PathInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Path`
    );
  }
);
const onboarding_done_summary_path = (
  /** @type {((inputs?: Onboarding_Done_Summary_PathInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Done_Summary_PathInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_done_summary_path();
  })
);
const en_onboarding_error_profile_required = (
  /** @type {(inputs: Onboarding_Error_Profile_RequiredInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Please complete all selections before continuing.`
    );
  }
);
const onboarding_error_profile_required = (
  /** @type {((inputs?: Onboarding_Error_Profile_RequiredInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboarding_Error_Profile_RequiredInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_onboarding_error_profile_required();
  })
);
function Input($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      label,
      id,
      error,
      value = "",
      placeholder = "",
      type = "text",
      required = false,
      disabled = false,
      class: className = "",
      $$slots,
      $$events,
      ...rest
    } = $$props;
    const inputId = derived(() => id ?? `input-${Math.random().toString(36).slice(2, 9)}`);
    $$renderer2.push(`<div${attr_class(`flex flex-col gap-1 ${stringify(className)}`)}>`);
    if (label) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<label${attr("for", inputId())} class="text-sm font-medium text-[var(--foreground)]">${escape_html(label)}`);
      if (required) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="ml-0.5 text-[var(--danger)]">*</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></label>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <input${attributes(
      {
        ...rest,
        id: inputId(),
        type,
        value,
        placeholder,
        required,
        disabled,
        class: `w-full rounded-[var(--radius)] border px-3 py-2 text-sm text-[var(--foreground)] transition-colors placeholder:text-[var(--foreground-subtle)] focus:ring-2 focus:ring-[var(--border-focus)] focus:outline-none disabled:opacity-50 ${stringify(error ? "border-[var(--danger)] focus:ring-[var(--danger)]" : "border-[var(--border)]")}`
      },
      void 0,
      void 0,
      void 0,
      4
    )}/> `);
    if (error) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-xs text-[var(--danger)]">${escape_html(error)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { value });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let step = 1;
    let intent = null;
    let companyName = "";
    let website = "";
    let industry = "SaaS";
    let teamSize = "";
    const teamOptions = [
      {
        value: "1",
        label: "Just me",
        sub: "Solo founder",
        icon: User
      },
      {
        value: "2-10",
        label: "2–10 people",
        sub: "Small team",
        icon: Users
      },
      {
        value: "11-50",
        label: "11–50 people",
        sub: "Growing company",
        icon: Buildings
      },
      {
        value: "50+",
        label: "50+ people",
        sub: "Enterprise",
        icon: Buildings
      }
    ];
    let stack = [];
    const stackOptions = [
      "AWS",
      "GCP",
      "Azure",
      "GitHub",
      "GitLab",
      "Vercel",
      "Cloudflare",
      "Other"
    ];
    let dataTypes = [];
    let customerType = "";
    let geoReach = "";
    let productType = "";
    const dataTypeOptions = [
      {
        value: "pii",
        label: "Personal data (PII)",
        sub: "Names, emails, addresses of users"
      },
      {
        value: "phi",
        label: "Health data (PHI)",
        sub: "Medical records, diagnoses"
      },
      {
        value: "financial",
        label: "Financial data",
        sub: "Payment cards, bank details"
      },
      {
        value: "business",
        label: "Business data only",
        sub: "No personal or sensitive data"
      }
    ];
    const customerTypeOptions = [
      { value: "b2b", label: "B2B", sub: "Businesses & teams" },
      { value: "b2c", label: "B2C", sub: "Individual consumers" },
      {
        value: "enterprise",
        label: "Enterprise / Gov",
        sub: "Large orgs & government"
      },
      {
        value: "internal",
        label: "Internal tool",
        sub: "Used by your team only"
      }
    ];
    const geoReachOptions = [
      { value: "us", label: "US only", sub: "No international users" },
      { value: "eu", label: "Europe / UK", sub: "GDPR applies" },
      { value: "global", label: "Global", sub: "Users worldwide" }
    ];
    const productTypeOptions = [
      {
        value: "saas",
        label: "SaaS web app",
        sub: "Browser-based product"
      },
      {
        value: "api",
        label: "API / platform",
        sub: "Developer-facing service"
      },
      { value: "mobile", label: "Mobile app", sub: "iOS or Android" },
      {
        value: "internal",
        label: "Internal tool",
        sub: "Used only within the company"
      }
    ];
    let securityTools = [];
    const securityToolOptions = [
      {
        value: "sso",
        label: "SSO / Identity provider",
        sub: "e.g. Okta, Google Workspace, Azure AD"
      },
      { value: "mdm", label: "MDM", sub: "Mobile/device management" },
      {
        value: "password_manager",
        label: "Password manager",
        sub: "e.g. 1Password, Bitwarden"
      },
      {
        value: "ci_cd",
        label: "CI/CD pipeline",
        sub: "Automated deployments"
      },
      {
        value: "code_review",
        label: "Code review process",
        sub: "PR reviews before merge"
      }
    ];
    data.frameworks.find((f) => f.recommended)?.slug ?? data.frameworks[0]?.slug ?? "";
    let loading = false;
    let errorMsg = "";
    let domainBlocked = false;
    let domainBlockMsg = "";
    const totalSteps = derived(() => 6);
    const completionStep = derived(() => 7);
    const teamLabel = derived(() => teamOptions.find((t) => t.value === teamSize)?.label ?? teamSize);
    const intentLabel = derived(() => "");
    const isCompletionStep = derived(() => step === completionStep());
    async function next() {
      errorMsg = "";
      domainBlocked = false;
      domainBlockMsg = "";
      loading = true;
      try {
        if (step === 1) {
          if (!companyName.trim()) {
            errorMsg = onboarding_error_company_required();
            loading = false;
            return;
          }
          const domainRes = await fetch("/api/onboarding/check-domain");
          if (domainRes.ok) {
            const domainData = await domainRes.json();
            if (domainData.hasExistingOrg && !domainData.isMember) {
              domainBlocked = true;
              domainBlockMsg = `An organization for ${domainData.domain} already exists on AuditLift. Ask your team admin to send you an invite.`;
              loading = false;
              return;
            }
          }
          const res = await fetch("/api/onboarding/organization", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: companyName, website: website.trim() || null, industry })
          });
          if (!res.ok) throw new Error("Failed to save");
        } else if (step === 2) {
          if (!teamSize) {
            errorMsg = onboarding_error_team_required();
            loading = false;
            return;
          }
          await fetch("/api/onboarding/team", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ teamSize })
          });
        } else if (step === 3) {
          await fetch("/api/onboarding/stack", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stack })
          });
        } else if (step === 4) {
          if (!customerType || !geoReach || !productType) {
            errorMsg = onboarding_error_profile_required();
            loading = false;
            return;
          }
          await fetch("/api/onboarding/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dataTypes, customerType, geoReach, productType })
          });
        } else if (step === 5) {
          await fetch("/api/onboarding/posture", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ securityTools })
          });
        } else if (step === 6) {
          if (!intent) {
            errorMsg = onboarding_error_intent_required();
            loading = false;
            return;
          }
          if (intent === "questionnaire") ;
        } else if (step === 7 && intent === "compliance") ;
        else if (isCompletionStep()) {
          const res = await fetch("/api/onboarding/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ intent })
          });
          if (!res.ok) throw new Error("Failed to complete");
          const completionData = await res.json();
          goto(completionData.redirectTo ?? "/dashboard");
          return;
        }
        step++;
      } catch {
        errorMsg = onboarding_error_generic();
      } finally {
        loading = false;
      }
    }
    function back() {
      errorMsg = "";
      if (step <= 1) return;
      if (isCompletionStep() && intent === "questionnaire") ;
      step--;
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="flex min-h-screen flex-col bg-[var(--background)]"><header class="flex items-center px-6 py-4"><div class="flex items-center gap-2">`);
      ShieldCheck($$renderer3, { size: 28, color: "var(--brand)", weight: "fill" });
      $$renderer3.push(`<!----> <span class="text-xl font-bold text-[var(--brand)]">${escape_html(onboarding_brand_name())}</span></div></header> <div class="flex items-center justify-center py-6"><div class="flex items-center gap-0"><!--[-->`);
      const each_array = ensure_array_like(Array.from({ length: totalSteps() }, (_, i) => i + 1));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let s = each_array[$$index];
        const displayStep = isCompletionStep() ? totalSteps() + 1 : step;
        $$renderer3.push(`<div${attr_class(`z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-200 ${stringify(s < displayStep ? "border-[var(--brand)] bg-[var(--brand)] text-white" : s === displayStep ? "border-[var(--brand)] bg-[var(--brand)] text-white" : "border-[var(--border)] bg-[var(--background-elevated)] text-[var(--foreground-muted)]")}`)}>`);
        if (s < displayStep) {
          $$renderer3.push("<!--[0-->");
          Check($$renderer3, { size: 14, weight: "bold" });
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`${escape_html(s)}`);
        }
        $$renderer3.push(`<!--]--></div> `);
        if (s < totalSteps()) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div${attr_class(`h-0.5 w-12 transition-all duration-300 ${stringify(s < displayStep ? "bg-[var(--brand)]" : "bg-[var(--border)]")}`)}></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]-->`);
      }
      $$renderer3.push(`<!--]--></div></div> <div class="flex flex-1 items-start justify-center px-4 py-6"><div class="w-full max-w-lg"><!---->`);
      {
        $$renderer3.push(`<div>`);
        Card($$renderer3, {
          class: "p-8",
          children: ($$renderer4) => {
            if (step === 1) {
              $$renderer4.push("<!--[0-->");
              $$renderer4.push(`<div class="mb-6"><div class="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-light)]">`);
              Buildings($$renderer4, { size: 24, color: "var(--brand)", weight: "fill" });
              $$renderer4.push(`<!----></div> <h1 class="mb-1 text-2xl font-bold text-[var(--foreground)]">${escape_html(onboarding_step1_title())}</h1> <p class="text-sm text-[var(--foreground-muted)]">${escape_html(onboarding_step1_subtitle())}</p></div> <div class="space-y-4">`);
              Input($$renderer4, {
                label: onboarding_company_name_label(),
                placeholder: onboarding_company_name_placeholder(),
                required: true,
                error: errorMsg && !companyName.trim() ? errorMsg : "",
                get value() {
                  return companyName;
                },
                set value($$value) {
                  companyName = $$value;
                  $$settled = false;
                }
              });
              $$renderer4.push(`<!----> `);
              Input($$renderer4, {
                label: onboarding_website_label(),
                placeholder: onboarding_website_placeholder(),
                type: "url",
                get value() {
                  return website;
                },
                set value($$value) {
                  website = $$value;
                  $$settled = false;
                }
              });
              $$renderer4.push(`<!----> <div class="flex flex-col gap-1"><label for="industry" class="text-sm font-medium text-[var(--foreground)]">${escape_html(onboarding_industry_label())}</label> `);
              $$renderer4.select(
                {
                  id: "industry",
                  value: industry,
                  class: "w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background-elevated)] px-3 py-2 text-sm text-[var(--foreground)] transition-colors focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
                },
                ($$renderer5) => {
                  $$renderer5.option({ value: "SaaS" }, ($$renderer6) => {
                    $$renderer6.push(`SaaS`);
                  });
                  $$renderer5.option({ value: "Fintech" }, ($$renderer6) => {
                    $$renderer6.push(`Fintech`);
                  });
                  $$renderer5.option({ value: "Healthcare" }, ($$renderer6) => {
                    $$renderer6.push(`Healthcare`);
                  });
                  $$renderer5.option({ value: "Other" }, ($$renderer6) => {
                    $$renderer6.push(`Other`);
                  });
                }
              );
              $$renderer4.push(`</div> `);
              if (domainBlocked) {
                $$renderer4.push("<!--[0-->");
                $$renderer4.push(`<div class="rounded-[var(--radius)] border border-[var(--danger)] bg-[var(--danger-light,#fef2f2)] px-4 py-3 text-sm text-[var(--danger)]">${escape_html(domainBlockMsg)}</div>`);
              } else {
                $$renderer4.push("<!--[-1-->");
              }
              $$renderer4.push(`<!--]--></div>`);
            } else if (step === 2) {
              $$renderer4.push("<!--[1-->");
              $$renderer4.push(`<div class="mb-6"><div class="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-light)]">`);
              Users($$renderer4, { size: 24, color: "var(--brand)", weight: "fill" });
              $$renderer4.push(`<!----></div> <h1 class="mb-1 text-2xl font-bold text-[var(--foreground)]">${escape_html(onboarding_step2_title())}</h1> <p class="text-sm text-[var(--foreground-muted)]">${escape_html(onboarding_step2_subtitle())}</p></div> <div class="grid grid-cols-2 gap-3"><!--[-->`);
              const each_array_1 = ensure_array_like(teamOptions);
              for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
                let option = each_array_1[$$index_1];
                $$renderer4.push(`<button type="button"${attr_class(`flex cursor-pointer flex-col items-start gap-1 rounded-[var(--radius-lg)] border-2 p-4 text-left transition-all duration-150 ${stringify(teamSize === option.value ? "border-[var(--brand)] bg-[var(--brand-light)]" : "border-[var(--border)] bg-[var(--background-elevated)] hover:border-[var(--foreground-subtle)]")}`)}><div${attr_class(`mb-1 flex h-8 w-8 items-center justify-center rounded-[var(--radius)] ${stringify(teamSize === option.value ? "bg-[var(--brand)] text-white" : "bg-[var(--background-alt)] text-[var(--foreground-muted)]")}`)}>`);
                if (option.icon) {
                  $$renderer4.push("<!--[-->");
                  option.icon($$renderer4, { size: 16, weight: "fill" });
                  $$renderer4.push("<!--]-->");
                } else {
                  $$renderer4.push("<!--[!-->");
                  $$renderer4.push("<!--]-->");
                }
                $$renderer4.push(`</div> <span${attr_class(`text-sm font-semibold ${stringify(teamSize === option.value ? "text-[var(--brand)]" : "text-[var(--foreground)]")}`)}>${escape_html(option.label)}</span> <span class="text-xs text-[var(--foreground-muted)]">${escape_html(option.sub)}</span></button>`);
              }
              $$renderer4.push(`<!--]--></div> `);
              if (errorMsg) {
                $$renderer4.push("<!--[0-->");
                $$renderer4.push(`<p class="mt-3 text-xs text-[var(--danger)]">${escape_html(errorMsg)}</p>`);
              } else {
                $$renderer4.push("<!--[-1-->");
              }
              $$renderer4.push(`<!--]-->`);
            } else if (step === 3) {
              $$renderer4.push("<!--[2-->");
              $$renderer4.push(`<div class="mb-6"><div class="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-light)]">`);
              Cloud($$renderer4, { size: 24, color: "var(--brand)", weight: "fill" });
              $$renderer4.push(`<!----></div> <h1 class="mb-1 text-2xl font-bold text-[var(--foreground)]">${escape_html(onboarding_step3_title())}</h1> <p class="text-sm text-[var(--foreground-muted)]">${escape_html(onboarding_step3_subtitle())}</p></div> <div class="flex flex-wrap gap-2"><!--[-->`);
              const each_array_2 = ensure_array_like(stackOptions);
              for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
                let item = each_array_2[$$index_2];
                $$renderer4.push(`<button type="button"${attr_class(`cursor-pointer rounded-[var(--radius-full)] border-2 px-4 py-2 text-sm font-medium transition-all duration-150 ${stringify(stack.includes(item) ? "border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand)]" : "border-[var(--border)] bg-[var(--background-elevated)] text-[var(--foreground-muted)] hover:border-[var(--foreground-subtle)]")}`)}>${escape_html(item)}</button>`);
              }
              $$renderer4.push(`<!--]--></div>`);
            } else if (step === 4) {
              $$renderer4.push("<!--[3-->");
              $$renderer4.push(`<div class="mb-6"><div class="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-light)]">`);
              Database($$renderer4, { size: 24, color: "var(--brand)", weight: "fill" });
              $$renderer4.push(`<!----></div> <h1 class="mb-1 text-2xl font-bold text-[var(--foreground)]">Data &amp; customers</h1> <p class="text-sm text-[var(--foreground-muted)]">This helps us tailor your policies to the right regulations and customer
									expectations.</p></div> <div class="space-y-5"><div><p class="mb-2 text-sm font-medium text-[var(--foreground)]">What data do you handle?</p> <div class="grid grid-cols-2 gap-2"><!--[-->`);
              const each_array_3 = ensure_array_like(dataTypeOptions);
              for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
                let opt = each_array_3[$$index_3];
                $$renderer4.push(`<button type="button"${attr_class(`flex cursor-pointer flex-col items-start rounded-[var(--radius)] border-2 p-3 text-left text-sm transition-all duration-150 ${stringify(dataTypes.includes(opt.value) ? "border-[var(--brand)] bg-[var(--brand-light)]" : "border-[var(--border)] bg-[var(--background-elevated)] hover:border-[var(--foreground-subtle)]")}`)}><span${attr_class(`font-medium ${stringify(dataTypes.includes(opt.value) ? "text-[var(--brand)]" : "text-[var(--foreground)]")}`)}>${escape_html(opt.label)}</span> <span class="text-xs text-[var(--foreground-muted)]">${escape_html(opt.sub)}</span></button>`);
              }
              $$renderer4.push(`<!--]--></div></div> <div><p class="mb-2 text-sm font-medium text-[var(--foreground)]">Who are your customers?</p> <div class="grid grid-cols-2 gap-2"><!--[-->`);
              const each_array_4 = ensure_array_like(customerTypeOptions);
              for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
                let opt = each_array_4[$$index_4];
                $$renderer4.push(`<button type="button"${attr_class(`flex cursor-pointer flex-col items-start rounded-[var(--radius)] border-2 p-3 text-left text-sm transition-all duration-150 ${stringify(customerType === opt.value ? "border-[var(--brand)] bg-[var(--brand-light)]" : "border-[var(--border)] bg-[var(--background-elevated)] hover:border-[var(--foreground-subtle)]")}`)}><span${attr_class(`font-medium ${stringify(customerType === opt.value ? "text-[var(--brand)]" : "text-[var(--foreground)]")}`)}>${escape_html(opt.label)}</span> <span class="text-xs text-[var(--foreground-muted)]">${escape_html(opt.sub)}</span></button>`);
              }
              $$renderer4.push(`<!--]--></div></div> <div><p class="mb-2 text-sm font-medium text-[var(--foreground)]">Where do you operate?</p> <div class="grid grid-cols-3 gap-2"><!--[-->`);
              const each_array_5 = ensure_array_like(geoReachOptions);
              for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
                let opt = each_array_5[$$index_5];
                $$renderer4.push(`<button type="button"${attr_class(`flex cursor-pointer flex-col items-start rounded-[var(--radius)] border-2 p-3 text-left text-sm transition-all duration-150 ${stringify(geoReach === opt.value ? "border-[var(--brand)] bg-[var(--brand-light)]" : "border-[var(--border)] bg-[var(--background-elevated)] hover:border-[var(--foreground-subtle)]")}`)}><span${attr_class(`font-medium ${stringify(geoReach === opt.value ? "text-[var(--brand)]" : "text-[var(--foreground)]")}`)}>${escape_html(opt.label)}</span> <span class="text-xs text-[var(--foreground-muted)]">${escape_html(opt.sub)}</span></button>`);
              }
              $$renderer4.push(`<!--]--></div></div> <div><p class="mb-2 text-sm font-medium text-[var(--foreground)]">What do you ship?</p> <div class="grid grid-cols-2 gap-2"><!--[-->`);
              const each_array_6 = ensure_array_like(productTypeOptions);
              for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
                let opt = each_array_6[$$index_6];
                $$renderer4.push(`<button type="button"${attr_class(`flex cursor-pointer flex-col items-start rounded-[var(--radius)] border-2 p-3 text-left text-sm transition-all duration-150 ${stringify(productType === opt.value ? "border-[var(--brand)] bg-[var(--brand-light)]" : "border-[var(--border)] bg-[var(--background-elevated)] hover:border-[var(--foreground-subtle)]")}`)}><span${attr_class(`font-medium ${stringify(productType === opt.value ? "text-[var(--brand)]" : "text-[var(--foreground)]")}`)}>${escape_html(opt.label)}</span> <span class="text-xs text-[var(--foreground-muted)]">${escape_html(opt.sub)}</span></button>`);
              }
              $$renderer4.push(`<!--]--></div></div> `);
              if (errorMsg) {
                $$renderer4.push("<!--[0-->");
                $$renderer4.push(`<p class="text-xs text-[var(--danger)]">${escape_html(errorMsg)}</p>`);
              } else {
                $$renderer4.push("<!--[-1-->");
              }
              $$renderer4.push(`<!--]--></div>`);
            } else if (step === 5) {
              $$renderer4.push("<!--[4-->");
              $$renderer4.push(`<div class="mb-6"><div class="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-light)]">`);
              Shield($$renderer4, { size: 24, color: "var(--brand)", weight: "fill" });
              $$renderer4.push(`<!----></div> <h1 class="mb-1 text-2xl font-bold text-[var(--foreground)]">Security posture</h1> <p class="text-sm text-[var(--foreground-muted)]">What do you already have in place? We'll use this to make your policies reference
									your real tools instead of generic placeholders.</p></div> <div class="space-y-2"><!--[-->`);
              const each_array_7 = ensure_array_like(securityToolOptions);
              for (let $$index_7 = 0, $$length = each_array_7.length; $$index_7 < $$length; $$index_7++) {
                let opt = each_array_7[$$index_7];
                $$renderer4.push(`<button type="button"${attr_class(`flex w-full cursor-pointer items-center gap-4 rounded-[var(--radius)] border-2 p-4 text-left transition-all duration-150 ${stringify(securityTools.includes(opt.value) ? "border-[var(--brand)] bg-[var(--brand-light)]" : "border-[var(--border)] bg-[var(--background-elevated)] hover:border-[var(--foreground-subtle)]")}`)}><div${attr_class(`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${stringify(securityTools.includes(opt.value) ? "border-[var(--brand)] bg-[var(--brand)]" : "border-[var(--border)]")}`)}>`);
                if (securityTools.includes(opt.value)) {
                  $$renderer4.push("<!--[0-->");
                  Check($$renderer4, { size: 11, weight: "bold", color: "white" });
                } else {
                  $$renderer4.push("<!--[-1-->");
                }
                $$renderer4.push(`<!--]--></div> <div><p${attr_class(`text-sm font-medium ${stringify(securityTools.includes(opt.value) ? "text-[var(--brand)]" : "text-[var(--foreground)]")}`)}>${escape_html(opt.label)}</p> <p class="text-xs text-[var(--foreground-muted)]">${escape_html(opt.sub)}</p></div></button>`);
              }
              $$renderer4.push(`<!--]--></div> <p class="mt-3 text-xs text-[var(--foreground-muted)]">Nothing selected yet? No problem — skip ahead and add this later.</p>`);
            } else if (step === 6) {
              $$renderer4.push("<!--[5-->");
              $$renderer4.push(`<div class="mb-6"><div class="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-light)]">`);
              ShieldCheck($$renderer4, { size: 24, color: "var(--brand)", weight: "fill" });
              $$renderer4.push(`<!----></div> <h1 class="mb-1 text-2xl font-bold text-[var(--foreground)]">${escape_html(onboarding_step4_title())}</h1> <p class="text-sm text-[var(--foreground-muted)]">${escape_html(onboarding_step4_subtitle())}</p></div> <div class="flex flex-col gap-4 sm:flex-row"><button type="button"${attr_class(`relative flex flex-1 cursor-pointer flex-col items-start gap-3 rounded-[var(--radius-lg)] border-2 p-5 text-left transition-all duration-150 ${stringify("border-[var(--border)] bg-[var(--background-elevated)] hover:border-[var(--foreground-subtle)]")}`)}><div${attr_class(`flex h-10 w-10 items-center justify-center rounded-[var(--radius)] ${stringify("bg-[var(--background-alt)] text-[var(--foreground-muted)]")}`)}>`);
              FileText($$renderer4, { size: 20, weight: "fill" });
              $$renderer4.push(`<!----></div> <div><p${attr_class(`mb-1 text-sm leading-snug font-semibold ${stringify("text-[var(--foreground)]")}`)}>${escape_html(onboarding_intent_questionnaire_title())}</p> <p class="text-xs leading-relaxed text-[var(--foreground-muted)]">${escape_html(onboarding_intent_questionnaire_description())}</p></div> `);
              {
                $$renderer4.push("<!--[-1-->");
              }
              $$renderer4.push(`<!--]--></button> <button type="button"${attr_class(`relative flex flex-1 cursor-pointer flex-col items-start gap-3 rounded-[var(--radius-lg)] border-2 p-5 text-left transition-all duration-150 ${stringify("border-[var(--border)] bg-[var(--background-elevated)] hover:border-[var(--foreground-subtle)]")}`)}><div${attr_class(`flex h-10 w-10 items-center justify-center rounded-[var(--radius)] ${stringify("bg-[var(--background-alt)] text-[var(--foreground-muted)]")}`)}>`);
              Shield($$renderer4, { size: 20, weight: "fill" });
              $$renderer4.push(`<!----></div> <div><p${attr_class(`mb-1 text-sm leading-snug font-semibold ${stringify("text-[var(--foreground)]")}`)}>${escape_html(onboarding_intent_compliance_title())}</p> <p class="text-xs leading-relaxed text-[var(--foreground-muted)]">${escape_html(onboarding_intent_compliance_description())}</p></div> `);
              {
                $$renderer4.push("<!--[-1-->");
              }
              $$renderer4.push(`<!--]--></button></div> `);
              if (errorMsg) {
                $$renderer4.push("<!--[0-->");
                $$renderer4.push(`<p class="mt-3 text-xs text-[var(--danger)]">${escape_html(errorMsg)}</p>`);
              } else {
                $$renderer4.push("<!--[-1-->");
              }
              $$renderer4.push(`<!--]-->`);
            } else if (isCompletionStep()) {
              $$renderer4.push("<!--[7-->");
              $$renderer4.push(`<div class="py-4 text-center"><div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--success-light)]">`);
              Check($$renderer4, { size: 32, color: "var(--success)", weight: "bold" });
              $$renderer4.push(`<!----></div> <h1 class="mb-2 text-2xl font-bold text-[var(--foreground)]">${escape_html(onboarding_done_title())}</h1> <p class="mb-6 text-sm text-[var(--foreground-muted)]">${escape_html(onboarding_done_subtitle_compliance())}</p> <div class="mb-6 flex justify-center">`);
              Badge($$renderer4, {
                variant: "success",
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->${escape_html(onboarding_done_trial_badge())}`);
                }
              });
              $$renderer4.push(`<!----></div> <div class="mb-6 space-y-3 rounded-[var(--radius-lg)] bg-[var(--background-alt)] p-4 text-left"><div class="flex items-center justify-between text-sm"><span class="text-[var(--foreground-muted)]">${escape_html(onboarding_done_summary_company())}</span> <span class="font-medium text-[var(--foreground)]">${escape_html(companyName)}</span></div> <div class="h-px bg-[var(--border)]"></div> <div class="flex items-center justify-between text-sm"><span class="text-[var(--foreground-muted)]">${escape_html(onboarding_done_summary_industry())}</span> <span class="font-medium text-[var(--foreground)]">${escape_html(industry)}</span></div> <div class="h-px bg-[var(--border)]"></div> <div class="flex items-center justify-between text-sm"><span class="text-[var(--foreground-muted)]">${escape_html(onboarding_done_summary_team_size())}</span> <span class="font-medium text-[var(--foreground)]">${escape_html(teamLabel())}</span></div> `);
              {
                $$renderer4.push("<!--[-1-->");
              }
              $$renderer4.push(`<!--]--> `);
              if (stack.length > 0) {
                $$renderer4.push("<!--[0-->");
                $$renderer4.push(`<div class="h-px bg-[var(--border)]"></div> <div class="flex items-start justify-between gap-4 text-sm"><span class="flex-shrink-0 text-[var(--foreground-muted)]">${escape_html(onboarding_done_summary_tech_stack())}</span> <span class="text-right font-medium text-[var(--foreground)]">${escape_html(stack.join(", "))}</span></div>`);
              } else {
                $$renderer4.push("<!--[-1-->");
              }
              $$renderer4.push(`<!--]--> <div class="h-px bg-[var(--border)]"></div> <div class="flex items-center justify-between text-sm"><span class="text-[var(--foreground-muted)]">${escape_html(onboarding_done_summary_path())}</span> <span class="font-medium text-[var(--foreground)]">${escape_html(intentLabel())}</span></div></div> `);
              Button($$renderer4, {
                onclick: next,
                size: "lg",
                class: "w-full",
                disabled: loading,
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->${escape_html(loading ? onboarding_nav_setting_up() : onboarding_done_cta_compliance())} `);
                  ArrowRight($$renderer5, { size: 18 });
                  $$renderer5.push(`<!---->`);
                }
              });
              $$renderer4.push(`<!----></div>`);
            } else {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]--> `);
            if (errorMsg && step !== 2 && step !== 4 && step !== 6) {
              $$renderer4.push("<!--[0-->");
              $$renderer4.push(`<p class="mt-4 text-xs text-[var(--danger)]">${escape_html(errorMsg)}</p>`);
            } else {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]--> `);
            if (!isCompletionStep()) {
              $$renderer4.push("<!--[0-->");
              $$renderer4.push(`<div class="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-6">`);
              if (step > 1) {
                $$renderer4.push("<!--[0-->");
                Button($$renderer4, {
                  variant: "ghost",
                  onclick: back,
                  disabled: loading,
                  children: ($$renderer5) => {
                    ArrowLeft($$renderer5, { size: 16 });
                    $$renderer5.push(`<!----> ${escape_html(onboarding_nav_back())}`);
                  }
                });
              } else {
                $$renderer4.push("<!--[-1-->");
                $$renderer4.push(`<div></div>`);
              }
              $$renderer4.push(`<!--]--> `);
              Button($$renderer4, {
                onclick: next,
                disabled: loading,
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->${escape_html(loading ? onboarding_nav_saving() : onboarding_nav_continue())} `);
                  ArrowRight($$renderer5, { size: 16 });
                  $$renderer5.push(`<!---->`);
                }
              });
              $$renderer4.push(`<!----></div>`);
            } else {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]-->`);
          }
        });
        $$renderer3.push(`<!----> <p class="mt-4 text-center text-xs text-[var(--foreground-subtle)]">`);
        if (isCompletionStep()) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`Step ${escape_html(totalSteps())} of ${escape_html(totalSteps())}`);
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`Step ${escape_html(step)} of ${escape_html(totalSteps())}`);
        }
        $$renderer3.push(`<!--]--></p></div>`);
      }
      $$renderer3.push(`<!----></div></div></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-VYrOb2Hz.js.map
