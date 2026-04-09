import { a6 as attributes, a4 as escape_html, _ as derived, a2 as ensure_array_like, a3 as attr } from "../../../../chunks/index3.js";
import { D as DownloadSimple } from "../../../../chunks/DownloadSimple.js";
import { g as getIconContext } from "../../../../chunks/context.js";
import { F as FileText } from "../../../../chunks/FileText.js";
import { B as Button } from "../../../../chunks/Button.js";
import { C as Card } from "../../../../chunks/Card.js";
import { a as toastError } from "../../../../chunks/toasts.svelte.js";
function FileCsv($$renderer, $$props) {
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
      $$renderer2.push(`<path d="M48,180c0,8.67,5.49,16,12,16a10.27,10.27,0,0,0,7.33-3.43,12,12,0,1,1,17.34,16.6A34,34,0,0,1,60,220C40.15,220,24,202,24,180s16.15-40,36-40a34,34,0,0,1,24.67,10.83,12,12,0,1,1-17.34,16.6A10.27,10.27,0,0,0,60,164C53.49,164,48,171.31,48,180Zm97.51-5.71c-5.13-3.45-11.33-5.24-16.8-6.82a79.5,79.5,0,0,1-7.91-2.59c2.45-1.18,9.71-1.3,16.07.33A12,12,0,0,0,143,142a69.24,69.24,0,0,0-12-1.86c-9.93-.66-18,1.08-24.1,5.17a24.45,24.45,0,0,0-10.69,17.76c-1.1,8.74,2.48,16.27,10.11,21.19,4.78,3.09,10.36,4.7,15.75,6.26,3,.89,7.94,2.3,9.88,3.53a2,2,0,0,1-.22.71c-1.36,1.55-9.57,1.79-16.39-.06a12,12,0,0,0-6.45,23.11A63.73,63.73,0,0,0,125.09,220c6.47,0,13.74-1.17,19.74-5.15a24.73,24.73,0,0,0,10.95-18C157,187.53,153.32,179.53,145.51,174.27ZM216,140.68A12,12,0,0,0,200.7,148L192,172.3,183.3,148A12,12,0,1,0,160.7,156l20,56a12,12,0,0,0,22.6,0l20-56A12,12,0,0,0,216,140.68ZM36,108V40A20,20,0,0,1,56,20h96a12,12,0,0,1,8.49,3.51l56,56A12,12,0,0,1,220,88v20a12,12,0,1,1-24,0v-4H148a12,12,0,0,1-12-12V44H60v64a12,12,0,1,1-24,0ZM160,80h23L160,57Z"></path>`);
    } else if (weight() === "duotone") {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<path d="M208,88H152V32Z" opacity="0.2"></path><path d="M48,180c0,11,7.18,20,16,20a14.24,14.24,0,0,0,10.22-4.66A8,8,0,0,1,85.78,206.4,30.06,30.06,0,0,1,64,216c-17.65,0-32-16.15-32-36s14.35-36,32-36a30.06,30.06,0,0,1,21.78,9.6,8,8,0,0,1-11.56,11.06A14.24,14.24,0,0,0,64,160C55.18,160,48,169,48,180Zm79.6-8.69c-4-1.16-8.14-2.35-10.45-3.84-1.25-.81-1.23-1-1.12-1.9a4.57,4.57,0,0,1,2-3.67c4.6-3.12,15.34-1.73,19.83-.56A8,8,0,0,0,142,145.86c-2.12-.55-21-5.22-32.84,2.76a20.58,20.58,0,0,0-9,14.95c-2,15.88,13.65,20.41,23,23.11,12.06,3.49,13.12,4.92,12.78,7.59-.31,2.41-1.26,3.34-2.14,3.93-4.6,3.06-15.17,1.56-19.55.36A8,8,0,0,0,109.94,214a61.34,61.34,0,0,0,15.19,2c5.82,0,12.3-1,17.49-4.46a20.82,20.82,0,0,0,9.19-15.23C154,179,137.49,174.17,127.6,171.31Zm83.09-26.84a8,8,0,0,0-10.23,4.84L188,184.21l-12.47-34.9a8,8,0,0,0-15.07,5.38l20,56a8,8,0,0,0,15.07,0l20-56A8,8,0,0,0,210.69,144.47ZM216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88Zm-27.31-8L160,51.31V80Z"></path>`);
    } else if (weight() === "fill") {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40v76a4,4,0,0,0,4,4H212a4,4,0,0,0,4-4V88A8,8,0,0,0,213.66,82.34ZM152,88V44l44,44ZM48,180c0,11,7.18,20,16,20a14.18,14.18,0,0,0,10.06-4.5,8.21,8.21,0,0,1,10.9-.91,8,8,0,0,1,.82,11.81A30.06,30.06,0,0,1,64,216c-17.64,0-32-16.15-32-36s14.36-36,32-36a30,30,0,0,1,21.39,9.19,8.26,8.26,0,0,1,.73,11.09,8,8,0,0,1-11.9.38A14.17,14.17,0,0,0,64,160C55.18,160,48,169,48,180Zm103.81,16.31a20.82,20.82,0,0,1-9.19,15.23C137.43,215,131,216,125.13,216A61.14,61.14,0,0,1,110,214a8,8,0,1,1,4.3-15.41c4.38,1.2,14.95,2.7,19.55-.36.88-.59,1.83-1.52,2.14-3.93.35-2.67-.71-4.1-12.78-7.59-9.35-2.7-25-7.23-23-23.11a20.56,20.56,0,0,1,9-14.95c11.84-8,30.71-3.31,32.83-2.76a8,8,0,0,1-4.07,15.48c-4.49-1.17-15.23-2.56-19.83.56a4.54,4.54,0,0,0-2,3.67c-.12.9-.14,1.09,1.11,1.9,2.31,1.49,6.45,2.68,10.45,3.84C137.49,174.17,154.05,179,151.81,196.31ZM215.42,155l-19.89,55.68a8,8,0,0,1-15.06,0L160.58,155a8.21,8.21,0,0,1,4.5-10.45,8,8,0,0,1,10.45,4.76L188,184.21l12.47-34.9a8,8,0,0,1,10.45-4.76A8.23,8.23,0,0,1,215.42,155Z"></path>`);
    } else if (weight() === "light") {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`<path d="M46,180c0,12.13,8.07,22,18,22a16.24,16.24,0,0,0,11.67-5.28,6,6,0,0,1,8.66,8.3A28.06,28.06,0,0,1,64,214c-16.54,0-30-15.25-30-34s13.46-34,30-34a28.06,28.06,0,0,1,20.33,9,6,6,0,0,1-8.66,8.3A16.23,16.23,0,0,0,64,158C54.07,158,46,167.86,46,180Zm81.05-6.77c-10.86-3.13-13.41-4.69-13-7.91a6.59,6.59,0,0,1,2.88-5.08c5.6-3.79,17.66-1.82,21.45-.84a6,6,0,0,0,3.06-11.6c-2-.53-20.1-5-31.21,2.48a18.61,18.61,0,0,0-8.08,13.54c-1.8,14.19,12.26,18.25,21.57,20.94,12.12,3.5,14.78,5.33,14.2,9.76a6.85,6.85,0,0,1-3,5.34c-5.61,3.73-17.48,1.64-21.19.62A6,6,0,0,0,110.48,212a59.41,59.41,0,0,0,14.68,2c5.49,0,11.54-.95,16.36-4.14a18.89,18.89,0,0,0,8.31-13.81C151.84,180.39,136.92,176.08,127.05,173.22Zm83-26.88a6,6,0,0,0-7.67,3.63L188,190.15,173.65,150a6,6,0,1,0-11.3,4l20,56a6,6,0,0,0,11.3,0l20-56A6,6,0,0,0,210,146.34ZM214,88v24a6,6,0,1,1-12,0V94H152a6,6,0,0,1-6-6V38H56a2,2,0,0,0-2,2v72a6,6,0,1,1-12,0V40A14,14,0,0,1,56,26h96a6,6,0,0,1,4.24,1.76l56,56A6,6,0,0,1,214,88Zm-20.49-6L158,46.48V82Z"></path>`);
    } else if (weight() === "regular") {
      $$renderer2.push("<!--[4-->");
      $$renderer2.push(`<path d="M48,180c0,11,7.18,20,16,20a14.24,14.24,0,0,0,10.22-4.66A8,8,0,0,1,85.78,206.4,30.06,30.06,0,0,1,64,216c-17.65,0-32-16.15-32-36s14.35-36,32-36a30.06,30.06,0,0,1,21.78,9.6,8,8,0,0,1-11.56,11.06A14.24,14.24,0,0,0,64,160C55.18,160,48,169,48,180Zm79.6-8.69c-4-1.16-8.14-2.35-10.45-3.84-1.25-.81-1.23-1-1.12-1.9a4.57,4.57,0,0,1,2-3.67c4.6-3.12,15.34-1.73,19.82-.56A8,8,0,0,0,142,145.86c-2.12-.55-21-5.22-32.84,2.76a20.58,20.58,0,0,0-9,14.95c-2,15.88,13.65,20.41,23,23.11,12.06,3.49,13.12,4.92,12.78,7.59-.31,2.41-1.26,3.34-2.14,3.93-4.6,3.06-15.17,1.56-19.55.36A8,8,0,0,0,109.94,214a61.34,61.34,0,0,0,15.19,2c5.82,0,12.3-1,17.49-4.46a20.82,20.82,0,0,0,9.19-15.23C154,179,137.49,174.17,127.6,171.31Zm83.09-26.84a8,8,0,0,0-10.23,4.84L188,184.21l-12.47-34.9a8,8,0,0,0-15.07,5.38l20,56a8,8,0,0,0,15.07,0l20-56A8,8,0,0,0,210.69,144.47ZM216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88Zm-27.31-8L160,51.31V80Z"></path>`);
    } else if (weight() === "thin") {
      $$renderer2.push("<!--[5-->");
      $$renderer2.push(`<path d="M44,180c0,13.23,9,24,20,24a18.15,18.15,0,0,0,13.11-5.9,4,4,0,1,1,5.78,5.54A26.11,26.11,0,0,1,64,212c-15.44,0-28-14.36-28-32s12.56-32,28-32a26.11,26.11,0,0,1,18.89,8.36,4,4,0,1,1-5.78,5.54A18.15,18.15,0,0,0,64,156C53,156,44,166.77,44,180Zm82.49-4.85c-10.53-3-15.08-4.91-14.42-10.08a8.51,8.51,0,0,1,3.75-6.49c6.25-4.23,18.77-2.24,23.06-1.11a4,4,0,0,0,2-7.74,61.11,61.11,0,0,0-10.47-1.61c-8.12-.54-14.54.75-19.1,3.82a16.66,16.66,0,0,0-7.22,12.13c-1.58,12.49,10.46,16,20.14,18.77,11.26,3.25,16.47,5.49,15.64,11.94a8.94,8.94,0,0,1-3.91,6.75c-6.27,4.17-18.61,2.05-22.83.88a4,4,0,1,0-2.15,7.7A57.89,57.89,0,0,0,125.19,212c5.18,0,10.83-.86,15.22-3.77a17,17,0,0,0,7.43-12.41C149.64,181.84,136.26,178,126.49,175.15Zm82.85-26.92a4,4,0,0,0-5.11,2.42L188,196.11l-16.23-45.46a4,4,0,1,0-7.54,2.7l20,56a4,4,0,0,0,7.54,0l20-56A4,4,0,0,0,209.34,148.23ZM212,88v24a4,4,0,0,1-8,0V92H152a4,4,0,0,1-4-4V36H56a4,4,0,0,0-4,4v72a4,4,0,0,1-8,0V40A12,12,0,0,1,56,28h96a4,4,0,0,1,2.83,1.17l56,56A4,4,0,0,1,212,88Zm-13.66-4L156,41.65V84Z"></path>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html((console.error('Unsupported icon weight. Choose from "thin", "light", "regular", "bold", "fill", or "duotone".'), ""))}`);
    }
    $$renderer2.push(`<!--]--></svg>`);
  });
}
function FileZip($$renderer, $$props) {
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
      $$renderer2.push(`<path d="M188,140H172a12,12,0,0,0-12,12v56a12,12,0,0,0,24,0v-4h4a32,32,0,0,0,0-64Zm0,40h-4V164h4a8,8,0,0,1,0,16Zm-48-28v56a12,12,0,0,1-24,0V152a12,12,0,0,1,24,0ZM96,208a12,12,0,0,1-12,12H52a12,12,0,0,1-10.42-17.95L63.32,164H52a12,12,0,0,1,0-24H84A12,12,0,0,1,94.42,158L72.68,196H84A12,12,0,0,1,96,208ZM216.49,79.52l-56-56A12,12,0,0,0,152,20H56A20,20,0,0,0,36,40v68a12,12,0,0,0,24,0V44h76V92a12,12,0,0,0,12,12h48v4a12,12,0,0,0,24,0V88A12,12,0,0,0,216.49,79.52ZM160,80V57l23,23Z"></path>`);
    } else if (weight() === "duotone") {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<path d="M208,88H152V32Z" opacity="0.2"></path><path d="M184,144H168a8,8,0,0,0-8,8v56a8,8,0,0,0,16,0v-8h8a28,28,0,0,0,0-56Zm0,40h-8V160h8a12,12,0,0,1,0,24Zm-48-32v56a8,8,0,0,1-16,0V152a8,8,0,0,1,16,0ZM96,208a8,8,0,0,1-8,8H56a8,8,0,0,1-7-12l25.16-44H56a8,8,0,0,1,0-16H88a8,8,0,0,1,7,12L69.79,200H88A8,8,0,0,1,96,208ZM213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40v72a8,8,0,0,0,16,0V40h88V88a8,8,0,0,0,8,8h48v16a8,8,0,0,0,16,0V88A8,8,0,0,0,213.66,82.34ZM160,80V51.31L188.69,80Z"></path>`);
    } else if (weight() === "fill") {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<path d="M184,144H168a8,8,0,0,0-8,8v55.73a8.17,8.17,0,0,0,7.47,8.25,8,8,0,0,0,8.53-8v-8h7.4c15.24,0,28.14-11.92,28.59-27.15A28,28,0,0,0,184,144Zm-.35,40H176V160h8A12,12,0,0,1,196,173.16,12.25,12.25,0,0,1,183.65,184ZM136,152v55.73a8.17,8.17,0,0,1-7.47,8.25,8,8,0,0,1-8.53-8V152.27a8.17,8.17,0,0,1,7.47-8.25A8,8,0,0,1,136,152ZM96,208.53A8.17,8.17,0,0,1,87.73,216H56.23a8.27,8.27,0,0,1-6-2.5A8,8,0,0,1,49.05,204l25.16-44H56.27A8.17,8.17,0,0,1,48,152.53,8,8,0,0,1,56,144H87.77a8.27,8.27,0,0,1,6,2.5A8,8,0,0,1,95,156L69.79,200H88A8,8,0,0,1,96,208.53ZM213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40v76a4,4,0,0,0,4,4H212a4,4,0,0,0,4-4V88A8,8,0,0,0,213.66,82.34ZM152,88V44l44,44Z"></path>`);
    } else if (weight() === "light") {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`<path d="M184,146H168a6,6,0,0,0-6,6v56a6,6,0,0,0,12,0V198h10a26,26,0,0,0,0-52Zm0,40H174V158h10a14,14,0,0,1,0,28Zm-50-34v56a6,6,0,0,1-12,0V152a6,6,0,0,1,12,0ZM94,208a6,6,0,0,1-6,6H56a6,6,0,0,1-5.21-9l26.87-47H56a6,6,0,0,1,0-12H88a6,6,0,0,1,5.21,9L66.34,202H88A6,6,0,0,1,94,208ZM212.24,83.76l-56-56A6,6,0,0,0,152,26H56A14,14,0,0,0,42,40v72a6,6,0,0,0,12,0V40a2,2,0,0,1,2-2h90V88a6,6,0,0,0,6,6h50v18a6,6,0,0,0,12,0V88A6,6,0,0,0,212.24,83.76ZM158,82V46.48L193.52,82Z"></path>`);
    } else if (weight() === "regular") {
      $$renderer2.push("<!--[4-->");
      $$renderer2.push(`<path d="M184,144H168a8,8,0,0,0-8,8v56a8,8,0,0,0,16,0v-8h8a28,28,0,0,0,0-56Zm0,40h-8V160h8a12,12,0,0,1,0,24Zm-48-32v56a8,8,0,0,1-16,0V152a8,8,0,0,1,16,0ZM96,208a8,8,0,0,1-8,8H56a8,8,0,0,1-7-12l25.16-44H56a8,8,0,0,1,0-16H88a8,8,0,0,1,7,12L69.79,200H88A8,8,0,0,1,96,208ZM213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40v72a8,8,0,0,0,16,0V40h88V88a8,8,0,0,0,8,8h48v16a8,8,0,0,0,16,0V88A8,8,0,0,0,213.66,82.34ZM160,80V51.31L188.69,80Z"></path>`);
    } else if (weight() === "thin") {
      $$renderer2.push("<!--[5-->");
      $$renderer2.push(`<path d="M184,148H168a4,4,0,0,0-4,4v56a4,4,0,0,0,8,0V196h12a24,24,0,0,0,0-48Zm0,40H172V156h12a16,16,0,0,1,0,32Zm-52-36v56a4,4,0,0,1-8,0V152a4,4,0,0,1,8,0Zm-40.53,2L62.89,204H88a4,4,0,0,1,0,8H56a4,4,0,0,1-3.47-6l28.58-50H56a4,4,0,0,1,0-8H88a4,4,0,0,1,3.47,6ZM210.83,85.17l-56-56A4,4,0,0,0,152,28H56A12,12,0,0,0,44,40v72a4,4,0,0,0,8,0V40a4,4,0,0,1,4-4h92V88a4,4,0,0,0,4,4h52v20a4,4,0,0,0,8,0V88A4,4,0,0,0,210.83,85.17ZM156,84V41.65L198.34,84Z"></path>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html((console.error('Unsupported icon weight. Choose from "thin", "light", "regular", "bold", "fill", or "duotone".'), ""))}`);
    }
    $$renderer2.push(`<!--]--></svg>`);
  });
}
function Lock($$renderer, $$props) {
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
      $$renderer2.push(`<path d="M208,76H180V56A52,52,0,0,0,76,56V76H48A20,20,0,0,0,28,96V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V96A20,20,0,0,0,208,76ZM100,56a28,28,0,0,1,56,0V76H100ZM204,204H52V100H204Zm-60-52a16,16,0,1,1-16-16A16,16,0,0,1,144,152Z"></path>`);
    } else if (weight() === "duotone") {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<path d="M216,96V208a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V96a8,8,0,0,1,8-8H208A8,8,0,0,1,216,96Z" opacity="0.2"></path><path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Zm-68-56a12,12,0,1,1-12-12A12,12,0,0,1,140,152Z"></path>`);
    } else if (weight() === "fill") {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80Zm-80,84a12,12,0,1,1,12-12A12,12,0,0,1,128,164Zm32-84H96V56a32,32,0,0,1,64,0Z"></path>`);
    } else if (weight() === "light") {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`<path d="M208,82H174V56a46,46,0,0,0-92,0V82H48A14,14,0,0,0,34,96V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V96A14,14,0,0,0,208,82ZM94,56a34,34,0,0,1,68,0V82H94ZM210,208a2,2,0,0,1-2,2H48a2,2,0,0,1-2-2V96a2,2,0,0,1,2-2H208a2,2,0,0,1,2,2Zm-72-56a10,10,0,1,1-10-10A10,10,0,0,1,138,152Z"></path>`);
    } else if (weight() === "regular") {
      $$renderer2.push("<!--[4-->");
      $$renderer2.push(`<path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Zm-68-56a12,12,0,1,1-12-12A12,12,0,0,1,140,152Z"></path>`);
    } else if (weight() === "thin") {
      $$renderer2.push("<!--[5-->");
      $$renderer2.push(`<path d="M208,84H172V56a44,44,0,0,0-88,0V84H48A12,12,0,0,0,36,96V208a12,12,0,0,0,12,12H208a12,12,0,0,0,12-12V96A12,12,0,0,0,208,84ZM92,56a36,36,0,0,1,72,0V84H92ZM212,208a4,4,0,0,1-4,4H48a4,4,0,0,1-4-4V96a4,4,0,0,1,4-4H208a4,4,0,0,1,4,4Zm-76-56a8,8,0,1,1-8-8A8,8,0,0,1,136,152Z"></path>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html((console.error('Unsupported icon weight. Choose from "thin", "light", "regular", "bold", "fill", or "duotone".'), ""))}`);
    }
    $$renderer2.push(`<!--]--></svg>`);
  });
}
const SvelteSet = globalThis.Set;
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let deselectedPolicyIds = new SvelteSet();
    let deselectedEvidenceIds = new SvelteSet();
    let selectedPolicyIds = derived(() => data.policyList.map((p) => p.id).filter((id) => !deselectedPolicyIds.has(id)));
    let selectedEvidenceIds = derived(() => data.evidenceList.map((e) => e.id).filter((id) => !deselectedEvidenceIds.has(id)));
    let downloading = false;
    let exportError = "";
    function formatSize(bytes) {
      if (bytes < 1024) return `${bytes}B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
    }
    async function download() {
      downloading = true;
      exportError = "";
      try {
        const res = await fetch("/api/export", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            policyIds: selectedPolicyIds(),
            evidenceIds: selectedEvidenceIds()
          })
        });
        if (!res.ok) throw new Error("Export failed");
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `AuditLift-Export-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.zip`;
        a.click();
        URL.revokeObjectURL(url);
      } catch {
        exportError = "Export failed. Please try again.";
        toastError("Export failed");
      } finally {
        downloading = false;
      }
    }
    $$renderer2.push(`<div class="space-y-6"><h1 class="text-2xl font-bold text-[var(--foreground)]">Auditor Export</h1> `);
    Card($$renderer2, {
      class: "p-6",
      children: ($$renderer3) => {
        $$renderer3.push(`<h2 class="mb-2 font-semibold text-[var(--foreground)]">What's included</h2> <p class="mb-4 text-sm text-[var(--foreground-muted)]">Download a complete audit package ready for your auditor.</p> <div class="mb-6 space-y-3"><div class="flex items-center gap-3">`);
        FileCsv($$renderer3, { size: 20, color: "var(--brand)" });
        $$renderer3.push(`<!----> <div><p class="text-sm font-medium text-[var(--foreground)]">control-mapping.csv</p> <p class="text-xs text-[var(--foreground-muted)]">All controls with status and links</p></div></div> <div class="flex items-center gap-3">`);
        FileText($$renderer3, { size: 20, color: "var(--brand)" });
        $$renderer3.push(`<!----> <div><p class="text-sm font-medium text-[var(--foreground)]">Policies/ (${escape_html(data.policyList.length)} docs)</p> <p class="text-xs text-[var(--foreground-muted)]">Generated policy documents as Markdown</p></div></div> <div class="flex items-center gap-3">`);
        FileZip($$renderer3, { size: 20, color: "var(--brand)" });
        $$renderer3.push(`<!----> <div><p class="text-sm font-medium text-[var(--foreground)]">Evidence/ (${escape_html(data.evidenceList.length)} files)</p> <p class="text-xs text-[var(--foreground-muted)]">Uploaded evidence organized by control</p></div></div></div> `);
        if (!data.canExport) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="flex items-start gap-3 rounded-[var(--radius)] bg-[var(--warning-light)] p-4">`);
          Lock($$renderer3, {
            size: 18,
            color: "var(--warning)",
            class: "mt-0.5 flex-shrink-0"
          });
          $$renderer3.push(`<!----> <div><p class="text-sm font-semibold text-[var(--warning)]">Subscription required</p> <p class="text-sm text-[var(--foreground-muted)]">Export is available on paid plans only.</p> <a href="/settings/billing" class="mt-1 inline-block text-sm text-[var(--brand)] hover:underline">Upgrade to export →</a></div></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]-->`);
      }
    });
    $$renderer2.push(`<!----> `);
    if (data.canExport) {
      $$renderer2.push("<!--[0-->");
      Card($$renderer2, {
        class: "p-6",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="mb-4 flex items-center justify-between"><h2 class="font-semibold text-[var(--foreground)]">Policies <span class="ml-1 text-sm font-normal text-[var(--foreground-muted)]">(${escape_html(selectedPolicyIds().length)} / ${escape_html(data.policyList.length)} selected)</span></h2> <div class="flex gap-2"><button class="text-xs text-[var(--brand)] hover:underline">Select all</button> <span class="text-xs text-[var(--foreground-subtle)]">/</span> <button class="text-xs text-[var(--brand)] hover:underline">Deselect all</button></div></div> `);
          if (data.policyList.length === 0) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<p class="text-sm text-[var(--foreground-muted)]">No policies yet — generate some first.</p>`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<div class="space-y-2"><!--[-->`);
            const each_array = ensure_array_like(data.policyList);
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let policy = each_array[$$index];
              $$renderer3.push(`<label class="flex cursor-pointer items-center gap-3 rounded-[var(--radius)] px-3 py-2 hover:bg-[var(--background-alt)]"><input type="checkbox"${attr("checked", selectedPolicyIds().includes(policy.id), true)} class="h-4 w-4 accent-[var(--brand)]"/> `);
              FileText($$renderer3, {
                size: 16,
                color: "var(--foreground-muted)",
                class: "shrink-0"
              });
              $$renderer3.push(`<!----> <span class="flex-1 text-sm text-[var(--foreground)]">${escape_html(policy.title)}</span> `);
              if (policy.isCustom) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<span class="rounded-full bg-[var(--info-light)] px-2 py-0.5 text-xs font-medium text-[var(--info)]">Custom</span>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--></label>`);
            }
            $$renderer3.push(`<!--]--></div>`);
          }
          $$renderer3.push(`<!--]-->`);
        }
      });
      $$renderer2.push(`<!----> `);
      Card($$renderer2, {
        class: "p-6",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="mb-4 flex items-center justify-between"><h2 class="font-semibold text-[var(--foreground)]">Evidence <span class="ml-1 text-sm font-normal text-[var(--foreground-muted)]">(${escape_html(selectedEvidenceIds().length)} / ${escape_html(data.evidenceList.length)} selected)</span></h2> <div class="flex gap-2"><button class="text-xs text-[var(--brand)] hover:underline">Select all</button> <span class="text-xs text-[var(--foreground-subtle)]">/</span> <button class="text-xs text-[var(--brand)] hover:underline">Deselect all</button></div></div> `);
          if (data.evidenceList.length === 0) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<p class="text-sm text-[var(--foreground-muted)]">No evidence yet — upload files from a control's detail page.</p>`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<div class="space-y-2"><!--[-->`);
            const each_array_1 = ensure_array_like(data.evidenceList);
            for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
              let ev = each_array_1[$$index_1];
              $$renderer3.push(`<label class="flex cursor-pointer items-center gap-3 rounded-[var(--radius)] px-3 py-2 hover:bg-[var(--background-alt)]"><input type="checkbox"${attr("checked", selectedEvidenceIds().includes(ev.id), true)} class="h-4 w-4 accent-[var(--brand)]"/> `);
              FileZip($$renderer3, {
                size: 16,
                color: "var(--foreground-muted)",
                class: "shrink-0"
              });
              $$renderer3.push(`<!----> <span class="flex-1 truncate text-sm text-[var(--foreground)]">${escape_html(ev.filename)}</span> <span class="text-xs text-[var(--foreground-muted)]">${escape_html(formatSize(ev.sizeBytes))}</span> `);
              if (ev.controlCode) {
                $$renderer3.push("<!--[0-->");
                $$renderer3.push(`<span class="rounded-full bg-[var(--background-alt)] px-2 py-0.5 font-mono text-xs text-[var(--foreground-muted)]">${escape_html(ev.controlCode)}</span>`);
              } else {
                $$renderer3.push("<!--[-1-->");
              }
              $$renderer3.push(`<!--]--></label>`);
            }
            $$renderer3.push(`<!--]--></div>`);
          }
          $$renderer3.push(`<!--]-->`);
        }
      });
      $$renderer2.push(`<!----> `);
      if (exportError) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="rounded-[var(--radius)] bg-[var(--danger-light)] px-4 py-3"><p class="text-sm text-[var(--danger)]">${escape_html(exportError)}</p></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="flex justify-end">`);
      Button($$renderer2, {
        onclick: download,
        disabled: downloading || selectedPolicyIds().length === 0 && selectedEvidenceIds().length === 0,
        children: ($$renderer3) => {
          DownloadSimple($$renderer3, { size: 16 });
          $$renderer3.push(`<!----> `);
          if (downloading) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`Preparing download...`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`Download (${escape_html(selectedPolicyIds().length)}
					${escape_html(selectedPolicyIds().length === 1 ? "policy" : "policies")}, ${escape_html(selectedEvidenceIds().length)}
					${escape_html(selectedEvidenceIds().length === 1 ? "file" : "files")})`);
          }
          $$renderer3.push(`<!--]-->`);
        }
      });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
