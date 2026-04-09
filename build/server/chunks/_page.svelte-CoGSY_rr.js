import { ae as escape_html, ac as ensure_array_like, ag as attr_class, ai as stringify, ad as attr, aj as attributes, X as derived, ah as attr_style } from './index3-A6PWQL_h.js';
import { g as getIconContext } from './context-CZy4Dq81.js';
import { C as CaretUp, a as CaretDown } from './CaretUp-Di7LKBaT.js';
import { D as Download } from './Download-B0ZUKpyL.js';
import { F as FileText } from './FileText-I3BE0SWy.js';
import { F as FloppyDisk } from './FloppyDisk-08-KFhif.js';
import { P as PencilSimple } from './PencilSimple-Dnchefbv.js';
import { P as Plus } from './Plus-NPxov4Fr.js';
import { S as Spinner } from './Spinner-CXSMScEv.js';
import { T as Trash } from './Trash-xi62z_Lw.js';
import { X } from './X-B3Cf1Mcl.js';
import { B as Button } from './Button-CIQKvzrf.js';
import { C as Card } from './Card-B7pxgW8R.js';
import { B as Badge } from './Badge-Cer8O6lG.js';
import { b as toastSuccess, a as toastError } from './toasts.svelte-2mhpT3Uy.js';
import { e as getLocale } from './runtime-tB9eeHiM.js';
import { p as policies_title } from './policies_title-mPwbAnqz.js';
import './index-BIEJqs8E.js';

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
                $$renderer3.push(`<pre class="font-mono text-xs leading-relaxed whitespace-pre-wrap text-[var(--foreground)]">${escape_html(policy.content)}</pre>`);
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

export { _page as default };
//# sourceMappingURL=_page.svelte-CoGSY_rr.js.map
