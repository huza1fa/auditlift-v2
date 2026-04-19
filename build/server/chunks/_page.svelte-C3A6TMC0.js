import { ae as escape_html, ac as ensure_array_like, ad as attr, ai as stringify, X as derived, ah as attr_style, ag as attr_class, aj as attributes } from './index3-A6PWQL_h.js';
import { A as ArrowRight } from './ArrowRight-DIl4ZNuw.js';
import { g as getIconContext } from './context-CZy4Dq81.js';
import { D as DownloadSimple } from './DownloadSimple-QtLQt_GW.js';
import { F as FileText } from './FileText-I3BE0SWy.js';
import { U as Upload } from './Upload-BnH8FZdT.js';
import { W as Warning } from './Warning-BL7LMjXi.js';
import { B as Badge } from './Badge-Cer8O6lG.js';
import { C as Card } from './Card-B7pxgW8R.js';
import { B as Button } from './Button-CIQKvzrf.js';
import { e as getLocale } from './runtime-tB9eeHiM.js';
import { p as policies_title } from './policies_title-mPwbAnqz.js';
import { q as questionnaires_title } from './questionnaires_title-CfcmBSpy.js';

function ChatText($$renderer, $$props) {
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
      $$renderer2.push(`<path d="M216,44H40A20,20,0,0,0,20,64V224A19.82,19.82,0,0,0,31.56,242.1a20.14,20.14,0,0,0,8.49,1.9,19.91,19.91,0,0,0,12.82-4.72l.12-.11L84.47,212H216a20,20,0,0,0,20-20V64A20,20,0,0,0,216,44Zm-4,144H80a11.93,11.93,0,0,0-7.84,2.92L44,215.23V68H212ZM84,108A12,12,0,0,1,96,96h64a12,12,0,1,1,0,24H96A12,12,0,0,1,84,108Zm0,40a12,12,0,0,1,12-12h64a12,12,0,0,1,0,24H96A12,12,0,0,1,84,148Z"></path>`);
    } else if (weight() === "duotone") {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<path d="M224,64V192a8,8,0,0,1-8,8H80L45.15,230.11A8,8,0,0,1,32,224V64a8,8,0,0,1,8-8H216A8,8,0,0,1,224,64Z" opacity="0.2"></path><path d="M216,48H40A16,16,0,0,0,24,64V224a15.85,15.85,0,0,0,9.24,14.5A16.13,16.13,0,0,0,40,240a15.89,15.89,0,0,0,10.25-3.78l.09-.07L83,208H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48ZM40,224h0ZM216,192H80a8,8,0,0,0-5.23,1.95L40,224V64H216ZM88,112a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,112Zm0,32a8,8,0,0,1,8-8h64a8,8,0,1,1,0,16H96A8,8,0,0,1,88,144Z"></path>`);
    } else if (weight() === "fill") {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<path d="M216,48H40A16,16,0,0,0,24,64V224a15.84,15.84,0,0,0,9.25,14.5A16.05,16.05,0,0,0,40,240a15.89,15.89,0,0,0,10.25-3.78l.09-.07L83,208H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48ZM160,152H96a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Zm0-32H96a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Z"></path>`);
    } else if (weight() === "light") {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`<path d="M216,50H40A14,14,0,0,0,26,64V224a13.88,13.88,0,0,0,8.09,12.69A14.11,14.11,0,0,0,40,238a13.87,13.87,0,0,0,9-3.31l.06-.05L82.23,206H216a14,14,0,0,0,14-14V64A14,14,0,0,0,216,50Zm2,142a2,2,0,0,1-2,2H80a6,6,0,0,0-3.92,1.46L41.26,225.53A2,2,0,0,1,38,224V64a2,2,0,0,1,2-2H216a2,2,0,0,1,2,2Zm-52-80a6,6,0,0,1-6,6H96a6,6,0,0,1,0-12h64A6,6,0,0,1,166,112Zm0,32a6,6,0,0,1-6,6H96a6,6,0,0,1,0-12h64A6,6,0,0,1,166,144Z"></path>`);
    } else if (weight() === "regular") {
      $$renderer2.push("<!--[4-->");
      $$renderer2.push(`<path d="M216,48H40A16,16,0,0,0,24,64V224a15.85,15.85,0,0,0,9.24,14.5A16.13,16.13,0,0,0,40,240a15.89,15.89,0,0,0,10.25-3.78l.09-.07L83,208H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48ZM40,224h0ZM216,192H80a8,8,0,0,0-5.23,1.95L40,224V64H216ZM88,112a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,112Zm0,32a8,8,0,0,1,8-8h64a8,8,0,1,1,0,16H96A8,8,0,0,1,88,144Z"></path>`);
    } else if (weight() === "thin") {
      $$renderer2.push("<!--[5-->");
      $$renderer2.push(`<path d="M216,52H40A12,12,0,0,0,28,64V224a11.89,11.89,0,0,0,6.93,10.88A12.17,12.17,0,0,0,40,236a11.89,11.89,0,0,0,7.69-2.83l0,0L81.49,204H216a12,12,0,0,0,12-12V64A12,12,0,0,0,216,52Zm4,140a4,4,0,0,1-4,4H80a4,4,0,0,0-2.62,1L42.56,227.06A4,4,0,0,1,36,224V64a4,4,0,0,1,4-4H216a4,4,0,0,1,4,4Zm-56-80a4,4,0,0,1-4,4H96a4,4,0,0,1,0-8h64A4,4,0,0,1,164,112Zm0,32a4,4,0,0,1-4,4H96a4,4,0,0,1,0-8h64A4,4,0,0,1,164,144Z"></path>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html((console.error('Unsupported icon weight. Choose from "thin", "light", "regular", "bold", "fill", or "duotone".'), ""))}`);
    }
    $$renderer2.push(`<!--]--></svg>`);
  });
}
const en_questionnaires_status_processing = (
  /** @type {(inputs: Questionnaires_Status_ProcessingInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Processing`
    );
  }
);
const questionnaires_status_processing = (
  /** @type {((inputs?: Questionnaires_Status_ProcessingInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Questionnaires_Status_ProcessingInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_questionnaires_status_processing();
  })
);
const en_questionnaires_status_ready = (
  /** @type {(inputs: Questionnaires_Status_ReadyInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Ready`
    );
  }
);
const questionnaires_status_ready = (
  /** @type {((inputs?: Questionnaires_Status_ReadyInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Questionnaires_Status_ReadyInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_questionnaires_status_ready();
  })
);
const en_questionnaires_status_error = (
  /** @type {(inputs: Questionnaires_Status_ErrorInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Error`
    );
  }
);
const questionnaires_status_error = (
  /** @type {((inputs?: Questionnaires_Status_ErrorInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Questionnaires_Status_ErrorInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_questionnaires_status_error();
  })
);
const en_dashboard_welcome = (
  /** @type {(inputs: Dashboard_WelcomeInputs) => LocalizedString} */
  (i) => {
    return (
      /** @type {LocalizedString} */
      `Welcome back, ${i?.name}`
    );
  }
);
const dashboard_welcome = (
  /** @type {((inputs: Dashboard_WelcomeInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_WelcomeInputs, { locale?: "en" }, {}>} */
  ((inputs, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_welcome(inputs);
  })
);
const en_dashboard_trial_status_title = (
  /** @type {(inputs: Dashboard_Trial_Status_TitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Trial`
    );
  }
);
const dashboard_trial_status_title = (
  /** @type {((inputs?: Dashboard_Trial_Status_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Trial_Status_TitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_trial_status_title();
  })
);
const en_dashboard_trial_active = (
  /** @type {(inputs: Dashboard_Trial_ActiveInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Active`
    );
  }
);
const dashboard_trial_active = (
  /** @type {((inputs?: Dashboard_Trial_ActiveInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Trial_ActiveInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_trial_active();
  })
);
const en_dashboard_plan_status_title = (
  /** @type {(inputs: Dashboard_Plan_Status_TitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Your Plan`
    );
  }
);
const dashboard_plan_status_title = (
  /** @type {((inputs?: Dashboard_Plan_Status_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Plan_Status_TitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_plan_status_title();
  })
);
const en_dashboard_plan_active = (
  /** @type {(inputs: Dashboard_Plan_ActiveInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Active`
    );
  }
);
const dashboard_plan_active = (
  /** @type {((inputs?: Dashboard_Plan_ActiveInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Plan_ActiveInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_plan_active();
  })
);
const en_dashboard_plan_readiness_insight = (
  /** @type {(inputs: Dashboard_Plan_Readiness_InsightInputs) => LocalizedString} */
  (i) => {
    return (
      /** @type {LocalizedString} */
      `You've completed ${i?.completed} of ${i?.total} controls — ${i?.remaining} to go for full ${i?.framework} readiness.`
    );
  }
);
const dashboard_plan_readiness_insight = (
  /** @type {((inputs: Dashboard_Plan_Readiness_InsightInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Plan_Readiness_InsightInputs, { locale?: "en" }, {}>} */
  ((inputs, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_plan_readiness_insight(inputs);
  })
);
const en_dashboard_plan_no_framework_insight = (
  /** @type {(inputs: Dashboard_Plan_No_Framework_InsightInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Select a framework to start tracking your compliance journey.`
    );
  }
);
const dashboard_plan_no_framework_insight = (
  /** @type {((inputs?: Dashboard_Plan_No_Framework_InsightInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Plan_No_Framework_InsightInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_plan_no_framework_insight();
  })
);
const en_dashboard_trial_days_remaining = (
  /** @type {(inputs: Dashboard_Trial_Days_RemainingInputs) => LocalizedString} */
  (i) => {
    return (
      /** @type {LocalizedString} */
      `${i?.days} days remaining`
    );
  }
);
const dashboard_trial_days_remaining = (
  /** @type {((inputs: Dashboard_Trial_Days_RemainingInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Trial_Days_RemainingInputs, { locale?: "en" }, {}>} */
  ((inputs, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_trial_days_remaining(inputs);
  })
);
const en_dashboard_trial_days_left = (
  /** @type {(inputs: Dashboard_Trial_Days_LeftInputs) => LocalizedString} */
  (i) => {
    return (
      /** @type {LocalizedString} */
      `${i?.days} days left`
    );
  }
);
const dashboard_trial_days_left = (
  /** @type {((inputs: Dashboard_Trial_Days_LeftInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Trial_Days_LeftInputs, { locale?: "en" }, {}>} */
  ((inputs, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_trial_days_left(inputs);
  })
);
const en_dashboard_trial_expires_today = (
  /** @type {(inputs: Dashboard_Trial_Expires_TodayInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Expires today`
    );
  }
);
const dashboard_trial_expires_today = (
  /** @type {((inputs?: Dashboard_Trial_Expires_TodayInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Trial_Expires_TodayInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_trial_expires_today();
  })
);
const en_dashboard_trial_upgrade_body = (
  /** @type {(inputs: Dashboard_Trial_Upgrade_BodyInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Upgrade for unlimited questionnaires, exports, and team members.`
    );
  }
);
const dashboard_trial_upgrade_body = (
  /** @type {((inputs?: Dashboard_Trial_Upgrade_BodyInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Trial_Upgrade_BodyInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_trial_upgrade_body();
  })
);
const en_dashboard_upgrade_now = (
  /** @type {(inputs: Dashboard_Upgrade_NowInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Upgrade now`
    );
  }
);
const dashboard_upgrade_now = (
  /** @type {((inputs?: Dashboard_Upgrade_NowInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Upgrade_NowInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_upgrade_now();
  })
);
const en_dashboard_manage_billing = (
  /** @type {(inputs: Dashboard_Manage_BillingInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Manage billing`
    );
  }
);
const dashboard_manage_billing = (
  /** @type {((inputs?: Dashboard_Manage_BillingInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Manage_BillingInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_manage_billing();
  })
);
const en_dashboard_stats_questionnaires_title = (
  /** @type {(inputs: Dashboard_Stats_Questionnaires_TitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Questionnaires`
    );
  }
);
const dashboard_stats_questionnaires_title = (
  /** @type {((inputs?: Dashboard_Stats_Questionnaires_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Stats_Questionnaires_TitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_stats_questionnaires_title();
  })
);
const en_dashboard_stats_avg_deal_readiness_title = (
  /** @type {(inputs: Dashboard_Stats_Avg_Deal_Readiness_TitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Avg deal readiness`
    );
  }
);
const dashboard_stats_avg_deal_readiness_title = (
  /** @type {((inputs?: Dashboard_Stats_Avg_Deal_Readiness_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Stats_Avg_Deal_Readiness_TitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_stats_avg_deal_readiness_title();
  })
);
const en_dashboard_stats_policies_title = (
  /** @type {(inputs: Dashboard_Stats_Policies_TitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Policies generated`
    );
  }
);
const dashboard_stats_policies_title = (
  /** @type {((inputs?: Dashboard_Stats_Policies_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Stats_Policies_TitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_stats_policies_title();
  })
);
const en_dashboard_deal_readiness_label = (
  /** @type {(inputs: Dashboard_Deal_Readiness_LabelInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Deal Readiness`
    );
  }
);
const dashboard_deal_readiness_label = (
  /** @type {((inputs?: Dashboard_Deal_Readiness_LabelInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Deal_Readiness_LabelInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_deal_readiness_label();
  })
);
const en_dashboard_answers_gaps_label = (
  /** @type {(inputs: Dashboard_Answers_Gaps_LabelInputs) => LocalizedString} */
  (i) => {
    return (
      /** @type {LocalizedString} */
      `${i?.answered} answered · ${i?.gaps} gaps`
    );
  }
);
const dashboard_answers_gaps_label = (
  /** @type {((inputs: Dashboard_Answers_Gaps_LabelInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Answers_Gaps_LabelInputs, { locale?: "en" }, {}>} */
  ((inputs, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_answers_gaps_label(inputs);
  })
);
const en_dashboard_recent_questionnaires_title = (
  /** @type {(inputs: Dashboard_Recent_Questionnaires_TitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Recent Questionnaires`
    );
  }
);
const dashboard_recent_questionnaires_title = (
  /** @type {((inputs?: Dashboard_Recent_Questionnaires_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Recent_Questionnaires_TitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_recent_questionnaires_title();
  })
);
const en_dashboard_empty_state_title = (
  /** @type {(inputs: Dashboard_Empty_State_TitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Close your first enterprise deal`
    );
  }
);
const dashboard_empty_state_title = (
  /** @type {((inputs?: Dashboard_Empty_State_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Empty_State_TitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_empty_state_title();
  })
);
const en_dashboard_empty_state_subtitle = (
  /** @type {(inputs: Dashboard_Empty_State_SubtitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Upload a security questionnaire and we'll auto-draft answers from your policies in minutes.`
    );
  }
);
const dashboard_empty_state_subtitle = (
  /** @type {((inputs?: Dashboard_Empty_State_SubtitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Empty_State_SubtitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_empty_state_subtitle();
  })
);
const en_dashboard_empty_upload_btn = (
  /** @type {(inputs: Dashboard_Empty_Upload_BtnInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Upload questionnaire`
    );
  }
);
const dashboard_empty_upload_btn = (
  /** @type {((inputs?: Dashboard_Empty_Upload_BtnInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Empty_Upload_BtnInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_empty_upload_btn();
  })
);
const en_dashboard_empty_policies_btn = (
  /** @type {(inputs: Dashboard_Empty_Policies_BtnInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Generate policies instead`
    );
  }
);
const dashboard_empty_policies_btn = (
  /** @type {((inputs?: Dashboard_Empty_Policies_BtnInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Empty_Policies_BtnInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_empty_policies_btn();
  })
);
const en_dashboard_compliance_coverage_title = (
  /** @type {(inputs: Dashboard_Compliance_Coverage_TitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Compliance Coverage`
    );
  }
);
const dashboard_compliance_coverage_title = (
  /** @type {((inputs?: Dashboard_Compliance_Coverage_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Compliance_Coverage_TitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_compliance_coverage_title();
  })
);
const en_dashboard_compliance_coverage_subtitle = (
  /** @type {(inputs: Dashboard_Compliance_Coverage_SubtitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Controls covered across all your work`
    );
  }
);
const dashboard_compliance_coverage_subtitle = (
  /** @type {((inputs?: Dashboard_Compliance_Coverage_SubtitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Compliance_Coverage_SubtitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_compliance_coverage_subtitle();
  })
);
const en_dashboard_coverage_total = (
  /** @type {(inputs: Dashboard_Coverage_TotalInputs) => LocalizedString} */
  (i) => {
    return (
      /** @type {LocalizedString} */
      `${i?.covered} of ${i?.total} controls covered`
    );
  }
);
const dashboard_coverage_total = (
  /** @type {((inputs: Dashboard_Coverage_TotalInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Coverage_TotalInputs, { locale?: "en" }, {}>} */
  ((inputs, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_coverage_total(inputs);
  })
);
const en_dashboard_coverage_from_questionnaires = (
  /** @type {(inputs: Dashboard_Coverage_From_QuestionnairesInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `From questionnaires`
    );
  }
);
const dashboard_coverage_from_questionnaires = (
  /** @type {((inputs?: Dashboard_Coverage_From_QuestionnairesInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Coverage_From_QuestionnairesInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_coverage_from_questionnaires();
  })
);
const en_dashboard_coverage_from_evidence = (
  /** @type {(inputs: Dashboard_Coverage_From_EvidenceInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `From evidence & policies`
    );
  }
);
const dashboard_coverage_from_evidence = (
  /** @type {((inputs?: Dashboard_Coverage_From_EvidenceInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Coverage_From_EvidenceInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_coverage_from_evidence();
  })
);
const en_dashboard_controls_completed = (
  /** @type {(inputs: Dashboard_Controls_CompletedInputs) => LocalizedString} */
  (i) => {
    return (
      /** @type {LocalizedString} */
      `${i?.completed} of ${i?.total} controls completed`
    );
  }
);
const dashboard_controls_completed = (
  /** @type {((inputs: Dashboard_Controls_CompletedInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Controls_CompletedInputs, { locale?: "en" }, {}>} */
  ((inputs, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_controls_completed(inputs);
  })
);
const en_dashboard_blockers_title = (
  /** @type {(inputs: Dashboard_Blockers_TitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Blockers`
    );
  }
);
const dashboard_blockers_title = (
  /** @type {((inputs?: Dashboard_Blockers_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Blockers_TitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_blockers_title();
  })
);
const en_dashboard_blockers_count = (
  /** @type {(inputs: Dashboard_Blockers_CountInputs) => LocalizedString} */
  (i) => {
    return (
      /** @type {LocalizedString} */
      `${i?.count} controls still need attention`
    );
  }
);
const dashboard_blockers_count = (
  /** @type {((inputs: Dashboard_Blockers_CountInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Blockers_CountInputs, { locale?: "en" }, {}>} */
  ((inputs, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_blockers_count(inputs);
  })
);
const en_dashboard_score_ready = (
  /** @type {(inputs: Dashboard_Score_ReadyInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Readiness score`
    );
  }
);
const dashboard_score_ready = (
  /** @type {((inputs?: Dashboard_Score_ReadyInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Score_ReadyInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_score_ready();
  })
);
const en_dashboard_score_trend = (
  /** @type {(inputs: Dashboard_Score_TrendInputs) => LocalizedString} */
  (i) => {
    return (
      /** @type {LocalizedString} */
      `+${i?.count} this month`
    );
  }
);
const dashboard_score_trend = (
  /** @type {((inputs: Dashboard_Score_TrendInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Score_TrendInputs, { locale?: "en" }, {}>} */
  ((inputs, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_score_trend(inputs);
  })
);
const en_dashboard_quick_actions_title = (
  /** @type {(inputs: Dashboard_Quick_Actions_TitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Quick actions`
    );
  }
);
const dashboard_quick_actions_title = (
  /** @type {((inputs?: Dashboard_Quick_Actions_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Quick_Actions_TitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_quick_actions_title();
  })
);
const en_dashboard_quick_upload_evidence = (
  /** @type {(inputs: Dashboard_Quick_Upload_EvidenceInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Upload evidence`
    );
  }
);
const dashboard_quick_upload_evidence = (
  /** @type {((inputs?: Dashboard_Quick_Upload_EvidenceInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Quick_Upload_EvidenceInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_quick_upload_evidence();
  })
);
const en_dashboard_quick_upload_evidence_sub = (
  /** @type {(inputs: Dashboard_Quick_Upload_Evidence_SubInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Attach files to controls`
    );
  }
);
const dashboard_quick_upload_evidence_sub = (
  /** @type {((inputs?: Dashboard_Quick_Upload_Evidence_SubInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Quick_Upload_Evidence_SubInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_quick_upload_evidence_sub();
  })
);
const en_dashboard_quick_generate_policy = (
  /** @type {(inputs: Dashboard_Quick_Generate_PolicyInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Generate policy`
    );
  }
);
const dashboard_quick_generate_policy = (
  /** @type {((inputs?: Dashboard_Quick_Generate_PolicyInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Quick_Generate_PolicyInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_quick_generate_policy();
  })
);
const en_dashboard_quick_generate_policy_sub = (
  /** @type {(inputs: Dashboard_Quick_Generate_Policy_SubInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `AI-drafted in seconds`
    );
  }
);
const dashboard_quick_generate_policy_sub = (
  /** @type {((inputs?: Dashboard_Quick_Generate_Policy_SubInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Quick_Generate_Policy_SubInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_quick_generate_policy_sub();
  })
);
const en_dashboard_quick_export = (
  /** @type {(inputs: Dashboard_Quick_ExportInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Export for auditor`
    );
  }
);
const dashboard_quick_export = (
  /** @type {((inputs?: Dashboard_Quick_ExportInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Quick_ExportInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_quick_export();
  })
);
const en_dashboard_quick_export_sub = (
  /** @type {(inputs: Dashboard_Quick_Export_SubInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `ZIP with all evidence & policies`
    );
  }
);
const dashboard_quick_export_sub = (
  /** @type {((inputs?: Dashboard_Quick_Export_SubInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Quick_Export_SubInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_quick_export_sub();
  })
);
const en_dashboard_start_here_title = (
  /** @type {(inputs: Dashboard_Start_Here_TitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Get started`
    );
  }
);
const dashboard_start_here_title = (
  /** @type {((inputs?: Dashboard_Start_Here_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Start_Here_TitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_start_here_title();
  })
);
const en_dashboard_start_here_step1 = (
  /** @type {(inputs: Dashboard_Start_Here_Step1Inputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Upload a questionnaire`
    );
  }
);
const dashboard_start_here_step1 = (
  /** @type {((inputs?: Dashboard_Start_Here_Step1Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Start_Here_Step1Inputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_start_here_step1();
  })
);
const en_dashboard_start_here_step1_btn = (
  /** @type {(inputs: Dashboard_Start_Here_Step1_BtnInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Upload`
    );
  }
);
const dashboard_start_here_step1_btn = (
  /** @type {((inputs?: Dashboard_Start_Here_Step1_BtnInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Start_Here_Step1_BtnInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_start_here_step1_btn();
  })
);
const en_dashboard_start_here_step2 = (
  /** @type {(inputs: Dashboard_Start_Here_Step2Inputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Generate your first policy`
    );
  }
);
const dashboard_start_here_step2 = (
  /** @type {((inputs?: Dashboard_Start_Here_Step2Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Start_Here_Step2Inputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_start_here_step2();
  })
);
const en_dashboard_start_here_step2_body = (
  /** @type {(inputs: Dashboard_Start_Here_Step2_BodyInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `AI-drafted, editable, and linked to your controls`
    );
  }
);
const dashboard_start_here_step2_body = (
  /** @type {((inputs?: Dashboard_Start_Here_Step2_BodyInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Start_Here_Step2_BodyInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_start_here_step2_body();
  })
);
const en_dashboard_start_here_step3 = (
  /** @type {(inputs: Dashboard_Start_Here_Step3Inputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Add evidence to controls`
    );
  }
);
const dashboard_start_here_step3 = (
  /** @type {((inputs?: Dashboard_Start_Here_Step3Inputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Start_Here_Step3Inputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_start_here_step3();
  })
);
const en_dashboard_start_here_step3_body = (
  /** @type {(inputs: Dashboard_Start_Here_Step3_BodyInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Screenshots, docs, or links that prove you're compliant`
    );
  }
);
const dashboard_start_here_step3_body = (
  /** @type {((inputs?: Dashboard_Start_Here_Step3_BodyInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Start_Here_Step3_BodyInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_start_here_step3_body();
  })
);
const en_dashboard_stale_evidence_singular = (
  /** @type {(inputs: Dashboard_Stale_Evidence_SingularInputs) => LocalizedString} */
  (i) => {
    return (
      /** @type {LocalizedString} */
      `${i?.count} evidence file uploaded more than`
    );
  }
);
const dashboard_stale_evidence_singular = (
  /** @type {((inputs: Dashboard_Stale_Evidence_SingularInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Stale_Evidence_SingularInputs, { locale?: "en" }, {}>} */
  ((inputs, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_stale_evidence_singular(inputs);
  })
);
const en_dashboard_stale_evidence_plural = (
  /** @type {(inputs: Dashboard_Stale_Evidence_PluralInputs) => LocalizedString} */
  (i) => {
    return (
      /** @type {LocalizedString} */
      `${i?.count} evidence files uploaded more than`
    );
  }
);
const dashboard_stale_evidence_plural = (
  /** @type {((inputs: Dashboard_Stale_Evidence_PluralInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Stale_Evidence_PluralInputs, { locale?: "en" }, {}>} */
  ((inputs, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_stale_evidence_plural(inputs);
  })
);
const en_dashboard_last_activity = (
  /** @type {(inputs: Dashboard_Last_ActivityInputs) => LocalizedString} */
  (i) => {
    return (
      /** @type {LocalizedString} */
      `Last activity: ${i?.description} ${i?.timeAgo}`
    );
  }
);
const dashboard_last_activity = (
  /** @type {((inputs: Dashboard_Last_ActivityInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_Last_ActivityInputs, { locale?: "en" }, {}>} */
  ((inputs, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_last_activity(inputs);
  })
);
const en_dashboard_no_activity_yet = (
  /** @type {(inputs: Dashboard_No_Activity_YetInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `No activity yet — start by uploading a questionnaire`
    );
  }
);
const dashboard_no_activity_yet = (
  /** @type {((inputs?: Dashboard_No_Activity_YetInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dashboard_No_Activity_YetInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_dashboard_no_activity_yet();
  })
);
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const isTrialUrgent = derived(() => data.trialDaysRemaining !== null && data.trialDaysRemaining <= 3);
    const today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    const size = 160;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = derived(() => circumference - data.readiness.score / 100 * circumference);
    const sparkW = 200;
    const sparkH = 40;
    const sparkPoints = derived(() => {
      const history = data.scoreHistory ?? [];
      if (history.length < 2) return "";
      const scores = history.map((s) => s.score);
      const min = Math.min(...scores);
      const max = Math.max(...scores);
      const range = max - min || 1;
      return scores.map((s, i) => `${i / (scores.length - 1) * sparkW},${sparkH - (s - min) / range * (sparkH - 4) - 2}`).join(" ");
    });
    const sparkScores = derived(() => (data.scoreHistory ?? []).map((s) => s.score));
    const sparkMin = derived(() => sparkScores().length ? Math.min(...sparkScores()) : 0);
    const sparkRange = derived(() => Math.max(...sparkScores()) - sparkMin() || 1);
    const firstName = derived(() => data.user?.name?.split(" ")[0] ?? "there");
    const recentQuestionnaires = derived(() => data.recentQuestionnaires ?? []);
    const hasQuestionnaires = derived(() => recentQuestionnaires().length > 0);
    const hasFramework = derived(() => data.framework !== null);
    const questionnaireCoverageCount = derived(() => data.questionnaireCoverage?.[0]?.controlsCoveredByQuestionnaires ?? 0);
    const showStartHere = derived(() => data.readiness.completedControls === 0 && data.readiness.blockers.length > 0 && !data.isReadOnly);
    function formatRelativeTime(date) {
      const d = new Date(date);
      const diffMs = Date.now() - d.getTime();
      const diffMins = Math.floor(diffMs / 6e4);
      const diffHours = Math.floor(diffMs / 36e5);
      const diffDays = Math.floor(diffMs / 864e5);
      if (diffMins < 1) return "just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return "1 day ago";
      if (diffDays < 30) return `${diffDays} days ago`;
      return d.toLocaleDateString();
    }
    function formatActivityAction(action) {
      const map = {
        "evidence.upload": "uploaded evidence",
        "evidence.delete": "removed evidence",
        "policy.generate": "generated a policy",
        "policy.edit": "edited a policy"
      };
      return map[action] ?? action;
    }
    function dealReadinessColor(score) {
      if (score === null) return "var(--foreground-muted)";
      if (score >= 70) return "var(--success)";
      if (score >= 40) return "var(--warning)";
      return "var(--danger)";
    }
    $$renderer2.push(`<div class="space-y-8">`);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (isTrialUrgent() && true) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--warning)] bg-[var(--warning-light)] p-4"><div class="flex items-center gap-3">`);
      Warning($$renderer2, { size: 20, color: "var(--warning)", weight: "fill" });
      $$renderer2.push(`<!----> <div><p class="font-semibold text-[var(--warning)]">${escape_html(data.trialDaysRemaining === 0 ? dashboard_trial_expires_today() : dashboard_trial_days_left({ days: data.trialDaysRemaining }))}</p> <p class="text-sm text-[var(--foreground-muted)]">${escape_html(dashboard_trial_upgrade_body())}</p></div></div> <a href="/settings/billing">`);
      Button($$renderer2, {
        size: "sm",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->${escape_html(dashboard_upgrade_now())}`);
        }
      });
      $$renderer2.push(`<!----></a></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if ((data.staleEvidenceCount ?? 0) > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[var(--warning)] bg-[var(--warning-light)] p-4"><div class="flex items-center gap-3">`);
      Warning($$renderer2, { size: 16, color: "var(--warning)", weight: "fill" });
      $$renderer2.push(`<!----> <p class="text-sm text-[var(--warning)]">${escape_html((data.staleEvidenceCount ?? 0) === 1 ? dashboard_stale_evidence_singular({ count: data.staleEvidenceCount }) : dashboard_stale_evidence_plural({ count: data.staleEvidenceCount }))} uploaded more than
					90 days ago — auditors may question outdated evidence.</p></div> <a href="/evidence" class="shrink-0 text-sm font-medium text-[var(--warning)] underline hover:opacity-70">Review evidence →</a></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (data.nextAction) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="flex items-start justify-between gap-4 rounded-[var(--radius-lg)] border border-[var(--brand)] bg-[var(--brand-light)] p-4"><div class="flex items-start gap-3"><div class="mt-0.5 shrink-0 rounded-full bg-[var(--brand)] p-1.5">`);
      ArrowRight($$renderer2, { size: 14, color: "white", weight: "bold" });
      $$renderer2.push(`<!----></div> <div><p class="mb-0.5 text-xs font-semibold tracking-wide text-[var(--brand)] uppercase">Recommended next action</p> `);
      if (data.nextAction.type === "fix-gaps") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="text-sm text-[var(--foreground)]">You have <span class="font-semibold">${escape_html(data.nextAction.gapCount)}</span> unanswered
							${escape_html(data.nextAction.gapCount === 1 ? "gap" : "gaps")} from recent questionnaires — generate
							the missing policies to close them.</p> <a href="/policies" class="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand)] hover:underline">Generate policies `);
        ArrowRight($$renderer2, { size: 12 });
        $$renderer2.push(`<!----></a>`);
      } else if (data.nextAction.type === "upload-questionnaire") {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<p class="text-sm text-[var(--foreground)]">Upload your first security questionnaire to get AI-generated answers in minutes.</p> <a href="/questionnaires" class="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand)] hover:underline">Upload questionnaire `);
        ArrowRight($$renderer2, { size: 12 });
        $$renderer2.push(`<!----></a>`);
      } else if (data.nextAction.type === "generate-policy") {
        $$renderer2.push("<!--[2-->");
        $$renderer2.push(`<p class="text-sm text-[var(--foreground)]">No policies yet — generate your first to improve your readiness score.</p> <a href="/policies" class="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand)] hover:underline">Generate a policy `);
        ArrowRight($$renderer2, { size: 12 });
        $$renderer2.push(`<!----></a>`);
      } else if (data.nextAction.type === "stale-evidence") {
        $$renderer2.push("<!--[3-->");
        $$renderer2.push(`<p class="text-sm text-[var(--foreground)]"><span class="font-semibold">${escape_html(data.staleEvidenceCount)}</span> ${escape_html((data.staleEvidenceCount ?? 0) === 1 ? "evidence file is" : "evidence files are")} over
							90 days old — review and refresh them.</p> <a href="/evidence" class="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand)] hover:underline">Review evidence `);
        ArrowRight($$renderer2, { size: 12 });
        $$renderer2.push(`<!----></a>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->  <div><p class="text-sm text-[var(--foreground-muted)]">${escape_html(today)}</p> <h1 class="text-2xl font-bold text-[var(--foreground)]">${escape_html(dashboard_welcome({ name: firstName() }))}</h1> `);
    if (data.lastActivity) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="mt-1 text-xs text-[var(--foreground-subtle)]">${escape_html(dashboard_last_activity({
        description: formatActivityAction(data.lastActivity.action) + (data.lastActivity.entityName ? ` "${data.lastActivity.entityName}"` : ""),
        timeAgo: formatRelativeTime(data.lastActivity.createdAt)
      }))}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<p class="mt-1 text-xs text-[var(--foreground-subtle)]">${escape_html(dashboard_no_activity_yet())}</p>`);
    }
    $$renderer2.push(`<!--]--></div>  <div class="grid grid-cols-1 gap-4 sm:grid-cols-3"><a href="/questionnaires" class="group">`);
    Card($$renderer2, {
      class: "p-5 transition-shadow hover:shadow-[var(--shadow-md)]",
      children: ($$renderer3) => {
        $$renderer3.push(`<p class="mb-1 text-xs font-medium text-[var(--foreground-muted)]">${escape_html(dashboard_stats_questionnaires_title())}</p> <p class="text-3xl font-bold text-[var(--foreground)]">${escape_html(data.questionnaireTotal ?? 0)}</p> <p class="mt-1 flex items-center gap-1 text-xs text-[var(--brand)]">${escape_html(questionnaires_title())} `);
        ArrowRight($$renderer3, { size: 12 });
        $$renderer3.push(`<!----></p>`);
      }
    });
    $$renderer2.push(`<!----></a> `);
    Card($$renderer2, {
      class: "p-5",
      children: ($$renderer3) => {
        $$renderer3.push(`<p class="mb-1 text-xs font-medium text-[var(--foreground-muted)]">${escape_html(dashboard_stats_avg_deal_readiness_title())}</p> `);
        if (data.avgDealReadiness != null) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<p class="text-3xl font-bold"${attr_style(`color: ${stringify(dealReadinessColor(data.avgDealReadiness))}`)}>${escape_html(data.avgDealReadiness)}%</p>`);
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`<p class="text-3xl font-bold text-[var(--foreground-muted)]">—</p>`);
        }
        $$renderer3.push(`<!--]--> <p class="mt-1 text-xs text-[var(--foreground-muted)]">${escape_html(dashboard_deal_readiness_label())}</p>`);
      }
    });
    $$renderer2.push(`<!----> <a href="/policies" class="group">`);
    Card($$renderer2, {
      class: "p-5 transition-shadow hover:shadow-[var(--shadow-md)]",
      children: ($$renderer3) => {
        $$renderer3.push(`<p class="mb-1 text-xs font-medium text-[var(--foreground-muted)]">${escape_html(dashboard_stats_policies_title())}</p> <p class="text-3xl font-bold text-[var(--foreground)]">${escape_html(data.policiesTotal ?? 0)}</p> <p class="mt-1 flex items-center gap-1 text-xs text-[var(--brand)]">${escape_html(policies_title())} `);
        ArrowRight($$renderer3, { size: 12 });
        $$renderer3.push(`<!----></p>`);
      }
    });
    $$renderer2.push(`<!----></a></div>  <div><h2 class="mb-3 text-base font-semibold text-[var(--foreground)]">${escape_html(dashboard_recent_questionnaires_title())}</h2> `);
    if (hasQuestionnaires()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="space-y-3"><!--[-->`);
      const each_array = ensure_array_like(recentQuestionnaires().slice(0, 3));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let q = each_array[$$index];
        $$renderer2.push(`<a${attr("href", `/questionnaires/${stringify(q.id)}`)} class="block">`);
        Card($$renderer2, {
          class: "cursor-pointer p-4 transition-shadow hover:shadow-[var(--shadow-md)]",
          children: ($$renderer3) => {
            $$renderer3.push(`<div class="flex items-start justify-between gap-4"><div class="min-w-0 flex-1"><div class="flex flex-wrap items-center gap-2"><p class="truncate text-sm font-medium text-[var(--foreground)]">${escape_html(q.filename)}</p> `);
            if (q.status === "processing") {
              $$renderer3.push("<!--[0-->");
              Badge($$renderer3, {
                variant: "warning",
                children: ($$renderer4) => {
                  $$renderer4.push(`<!---->${escape_html(questionnaires_status_processing())}`);
                }
              });
            } else if (q.status === "error") {
              $$renderer3.push("<!--[1-->");
              Badge($$renderer3, {
                variant: "danger",
                children: ($$renderer4) => {
                  $$renderer4.push(`<!---->${escape_html(questionnaires_status_error())}`);
                }
              });
            } else {
              $$renderer3.push("<!--[-1-->");
              Badge($$renderer3, {
                variant: "success",
                children: ($$renderer4) => {
                  $$renderer4.push(`<!---->${escape_html(questionnaires_status_ready())}`);
                }
              });
            }
            $$renderer3.push(`<!--]--></div> <p class="mt-1 text-xs text-[var(--foreground-muted)]">${escape_html(dashboard_answers_gaps_label({
              answered: q.answeredCount,
              total: q.totalCount,
              gaps: q.gapCount
            }))}</p></div> <div class="flex shrink-0 flex-col items-end gap-1"><p class="text-xs text-[var(--foreground-muted)]">${escape_html(dashboard_deal_readiness_label())}</p> `);
            if (q.dealReadiness !== null) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<p class="text-lg font-bold"${attr_style(`color: ${stringify(dealReadinessColor(q.dealReadiness))}`)}>${escape_html(q.dealReadiness)}%</p>`);
            } else {
              $$renderer3.push("<!--[-1-->");
              $$renderer3.push(`<p class="text-lg font-bold text-[var(--foreground-muted)]">—</p>`);
            }
            $$renderer3.push(`<!--]--></div></div>`);
          }
        });
        $$renderer2.push(`<!----></a>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      Card($$renderer2, {
        class: "p-8 text-center",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background-alt)]">`);
          ChatText($$renderer3, { size: 24, color: "var(--foreground-muted)" });
          $$renderer3.push(`<!----></div> <p class="mb-1 font-semibold text-[var(--foreground)]">${escape_html(dashboard_empty_state_title())}</p> <p class="mb-6 text-sm text-[var(--foreground-muted)]">${escape_html(dashboard_empty_state_subtitle())}</p> <div class="flex flex-wrap justify-center gap-3"><a href="/questionnaires">`);
          Button($$renderer3, {
            variant: "primary",
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->${escape_html(dashboard_empty_upload_btn())}`);
            }
          });
          $$renderer3.push(`<!----></a> <a href="/policies">`);
          Button($$renderer3, {
            variant: "secondary",
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->${escape_html(dashboard_empty_policies_btn())}`);
            }
          });
          $$renderer3.push(`<!----></a></div>`);
        }
      });
    }
    $$renderer2.push(`<!--]--></div>  `);
    if (hasFramework()) {
      $$renderer2.push("<!--[0-->");
      Card($$renderer2, {
        class: "p-6",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="mb-1 flex items-start justify-between"><div><h2 class="text-base font-semibold text-[var(--foreground)]">${escape_html(dashboard_compliance_coverage_title())}</h2> <p class="mt-0.5 text-sm text-[var(--foreground-muted)]">${escape_html(dashboard_compliance_coverage_subtitle())}</p></div> `);
          if (data.framework) {
            $$renderer3.push("<!--[0-->");
            Badge($$renderer3, {
              variant: "info",
              children: ($$renderer4) => {
                $$renderer4.push(`<!---->${escape_html(data.framework.name)}`);
              }
            });
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--></div> <div class="mt-6 flex flex-col gap-8 sm:flex-row sm:items-center"><div class="relative shrink-0"><svg${attr("width", size)}${attr("height", size)} class="-rotate-90"><circle${attr("cx", size / 2)}${attr("cy", size / 2)}${attr("r", radius)} fill="none" stroke="var(--border)"${attr("stroke-width", strokeWidth)}></circle><circle${attr("cx", size / 2)}${attr("cy", size / 2)}${attr("r", radius)} fill="none" stroke="var(--brand)"${attr("stroke-width", strokeWidth)} stroke-linecap="round"${attr("stroke-dasharray", circumference)}${attr("stroke-dashoffset", dashOffset())} class="transition-all duration-700"></circle></svg> <div class="absolute inset-0 flex flex-col items-center justify-center"><span class="text-3xl font-bold text-[var(--foreground)]">${escape_html(data.readiness.score)}%</span> <span class="text-xs text-[var(--foreground-muted)]">${escape_html(dashboard_score_ready())}</span></div></div> <div class="flex-1 space-y-3"><p class="text-sm text-[var(--foreground-muted)]">${escape_html(dashboard_controls_completed({
            completed: data.readiness.completedControls,
            total: data.readiness.totalControls
          }))}</p> <div class="space-y-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background-alt)] p-3 text-sm"><p class="text-[var(--foreground-muted)]">${escape_html(dashboard_coverage_from_evidence({ count: data.readiness.completedControls }))}</p> <p class="text-[var(--foreground-muted)]">${escape_html(dashboard_coverage_from_questionnaires({ count: questionnaireCoverageCount() }))}</p> <p class="border-t border-[var(--border)] pt-2 font-medium text-[var(--foreground)]">${escape_html(dashboard_coverage_total({
            covered: data.readiness.completedControls + questionnaireCoverageCount(),
            total: data.readiness.totalControls
          }))}</p></div> `);
          if (data.readiness.blockers.length > 0) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<p class="text-sm text-[var(--warning)]">${escape_html(dashboard_blockers_count({ count: data.readiness.blockers.length }))}</p>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--></div></div> `);
          if (data.scoreHistory && data.scoreHistory.length > 1) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<div class="mt-4 border-t border-[var(--border)] pt-4"><p class="mb-2 text-xs text-[var(--foreground-muted)]">${escape_html(dashboard_score_trend({ count: data.scoreHistory.length }))}</p> <svg${attr("width", sparkW)}${attr("height", sparkH)} class="overflow-visible"><polyline${attr("points", sparkPoints())} fill="none" stroke="var(--brand)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></polyline><!--[-->`);
            const each_array_1 = ensure_array_like(sparkScores());
            for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
              let score = each_array_1[i];
              $$renderer3.push(`<circle${attr("cx", i / (sparkScores().length - 1) * sparkW)}${attr("cy", sparkH - (score - sparkMin()) / sparkRange() * (sparkH - 4) - 2)} r="3" fill="var(--brand)"></circle>`);
            }
            $$renderer3.push(`<!--]--></svg></div>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]-->`);
        }
      });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (data.isActiveSubscription) {
      $$renderer2.push("<!--[0-->");
      Card($$renderer2, {
        class: "flex flex-col justify-between p-6 sm:flex-row sm:items-center",
        children: ($$renderer3) => {
          $$renderer3.push(`<div><h2 class="mb-1 text-sm font-medium text-[var(--foreground-muted)]">${escape_html(dashboard_plan_status_title())}</h2> <div class="flex items-center gap-2">`);
          Badge($$renderer3, {
            variant: "success",
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->${escape_html(dashboard_plan_active())}`);
            }
          });
          $$renderer3.push(`<!----></div> `);
          if (data.framework) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<p class="mt-2 text-sm text-[var(--foreground-muted)]">${escape_html(dashboard_plan_readiness_insight({
              completed: data.readiness.completedControls,
              total: data.readiness.totalControls,
              remaining: data.readiness.totalControls - data.readiness.completedControls,
              framework: data.framework.name
            }))}</p>`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<p class="mt-2 text-sm text-[var(--foreground-muted)]">${escape_html(dashboard_plan_no_framework_insight())}</p>`);
          }
          $$renderer3.push(`<!--]--></div> <div class="mt-4 sm:mt-0">`);
          Button($$renderer3, {
            variant: "secondary",
            size: "sm",
            children: ($$renderer4) => {
              $$renderer4.push(`<a href="/settings/billing">${escape_html(dashboard_manage_billing())}</a>`);
            }
          });
          $$renderer3.push(`<!----></div>`);
        }
      });
    } else {
      $$renderer2.push("<!--[-1-->");
      Card($$renderer2, {
        class: "flex flex-col justify-between p-6 sm:flex-row sm:items-center",
        children: ($$renderer3) => {
          $$renderer3.push(`<div><h2 class="mb-1 text-sm font-medium text-[var(--foreground-muted)]">${escape_html(dashboard_trial_status_title())}</h2> `);
          if (data.trialDaysRemaining !== null) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<p${attr_class(`text-3xl font-bold ${stringify(isTrialUrgent() ? "text-[var(--warning)]" : "text-[var(--foreground)]")}`)}>${escape_html(data.trialDaysRemaining)}</p> <p class="text-sm text-[var(--foreground-muted)]">${escape_html(dashboard_trial_days_remaining())}</p>`);
          } else {
            $$renderer3.push("<!--[-1-->");
            Badge($$renderer3, {
              variant: "success",
              children: ($$renderer4) => {
                $$renderer4.push(`<!---->${escape_html(dashboard_trial_active())}`);
              }
            });
          }
          $$renderer3.push(`<!--]--></div> <div class="mt-4 sm:mt-0">`);
          Button($$renderer3, {
            variant: "secondary",
            size: "sm",
            children: ($$renderer4) => {
              $$renderer4.push(`<a href="/settings/billing">${escape_html(dashboard_manage_billing())}</a>`);
            }
          });
          $$renderer3.push(`<!----></div>`);
        }
      });
    }
    $$renderer2.push(`<!--]-->  `);
    if (data.readiness.blockers.length > 0) {
      $$renderer2.push("<!--[0-->");
      Card($$renderer2, {
        class: "p-6",
        children: ($$renderer3) => {
          $$renderer3.push(`<h2 class="mb-4 text-base font-semibold text-[var(--foreground)]">${escape_html(dashboard_blockers_title())}</h2> `);
          if (data.isReadOnly) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<div class="relative"><div class="space-y-2 blur-sm select-none"><!--[-->`);
            const each_array_2 = ensure_array_like([1, 2, 3]);
            for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
              each_array_2[$$index_2];
              $$renderer3.push(`<div class="flex items-center justify-between border-b border-[var(--border)] py-2"><div class="flex items-center gap-3"><span class="rounded bg-[var(--background-alt)] px-2 py-1 font-mono text-xs text-[var(--foreground-muted)]">CC0.0</span> <span class="text-sm text-[var(--foreground)]">Control details hidden</span></div></div>`);
            }
            $$renderer3.push(`<!--]--></div> <div class="absolute inset-0 flex flex-col items-center justify-center rounded-[var(--radius)] bg-[var(--background)]/80 backdrop-blur-sm"><p class="mb-3 text-sm font-semibold text-[var(--foreground)]">Your trial has ended</p> <p class="mb-4 max-w-xs text-center text-xs text-[var(--foreground-muted)]">Upgrade to see which ${escape_html(data.readiness.blockers.length)} controls are blocking your readiness
							score.</p> <a href="/settings/billing" class="rounded-[var(--radius)] bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white no-underline hover:bg-[var(--brand-hover)]">${escape_html(dashboard_upgrade_now())}</a></div></div>`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<div class="space-y-2"><!--[-->`);
            const each_array_3 = ensure_array_like(data.readiness.blockers.slice(0, 5));
            for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
              let blocker = each_array_3[$$index_3];
              $$renderer3.push(`<div class="flex items-center justify-between border-b border-[var(--border)] py-2 last:border-0"><div class="flex items-center gap-3"><span class="rounded bg-[var(--background-alt)] px-2 py-1 font-mono text-xs text-[var(--foreground-muted)]">${escape_html(blocker.code)}</span> <span class="text-sm text-[var(--foreground)]">${escape_html(blocker.title)}</span></div> <a${attr("href", `/controls/${stringify(blocker.id)}`)} class="flex items-center gap-1 text-xs text-[var(--brand)] hover:underline">Fix it `);
              ArrowRight($$renderer3, { size: 12 });
              $$renderer3.push(`<!----></a></div>`);
            }
            $$renderer3.push(`<!--]--></div>`);
          }
          $$renderer3.push(`<!--]-->`);
        }
      });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->  `);
    if (showStartHere()) {
      $$renderer2.push("<!--[0-->");
      Card($$renderer2, {
        class: "p-6",
        children: ($$renderer3) => {
          $$renderer3.push(`<h2 class="mb-5 text-base font-semibold text-[var(--foreground)]">${escape_html(dashboard_start_here_title())}</h2> <div class="space-y-5"><div class="flex gap-4"><div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-xs font-bold text-white">1</div> <div><p class="mb-1.5 text-sm font-semibold text-[var(--foreground)]">${escape_html(dashboard_start_here_step1())}</p> <a${attr("href", `/controls/${stringify(data.readiness.blockers[0].id)}`)} class="inline-flex items-center gap-1.5 rounded-[var(--radius)] bg-[var(--brand)] px-3 py-1.5 text-sm font-medium text-white no-underline hover:bg-[var(--brand-hover)]">${escape_html(dashboard_start_here_step1_btn({ code: data.readiness.blockers[0].code }))} `);
          ArrowRight($$renderer3, { size: 14 });
          $$renderer3.push(`<!----></a></div></div> <div class="flex gap-4"><div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-xs font-bold text-white">2</div> <div><p class="mb-1 text-sm font-semibold text-[var(--foreground)]">${escape_html(dashboard_start_here_step2())}</p> <p class="text-sm text-[var(--foreground-muted)]">${escape_html(dashboard_start_here_step2_body())}</p></div></div> <div class="flex gap-4"><div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-xs font-bold text-white">3</div> <div><p class="mb-1 text-sm font-semibold text-[var(--foreground)]">${escape_html(dashboard_start_here_step3())}</p> <p class="text-sm text-[var(--foreground-muted)]">${escape_html(dashboard_start_here_step3_body())}</p></div></div></div>`);
        }
      });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->  <div><h2 class="mb-3 text-base font-semibold text-[var(--foreground)]">${escape_html(dashboard_quick_actions_title())}</h2> <div class="grid grid-cols-1 gap-4 md:grid-cols-3"><a href="/evidence" class="group">`);
    Card($$renderer2, {
      class: "cursor-pointer p-4 transition-shadow hover:shadow-[var(--shadow-md)]",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="flex items-center gap-3"><div class="rounded-[var(--radius)] bg-[var(--brand-light)] p-2">`);
        Upload($$renderer3, { size: 20, color: "var(--brand)" });
        $$renderer3.push(`<!----></div> <div><p class="text-sm font-medium text-[var(--foreground)]">${escape_html(dashboard_quick_upload_evidence())}</p> <p class="text-xs text-[var(--foreground-muted)]">${escape_html(dashboard_quick_upload_evidence_sub())}</p></div></div>`);
      }
    });
    $$renderer2.push(`<!----></a> <a href="/policies" class="group">`);
    Card($$renderer2, {
      class: "cursor-pointer p-4 transition-shadow hover:shadow-[var(--shadow-md)]",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="flex items-center gap-3"><div class="rounded-[var(--radius)] bg-[var(--success-light)] p-2">`);
        FileText($$renderer3, { size: 20, color: "var(--success)" });
        $$renderer3.push(`<!----></div> <div><p class="text-sm font-medium text-[var(--foreground)]">${escape_html(dashboard_quick_generate_policy())}</p> <p class="text-xs text-[var(--foreground-muted)]">${escape_html(dashboard_quick_generate_policy_sub())}</p></div></div>`);
      }
    });
    $$renderer2.push(`<!----></a> <a href="/export" class="group">`);
    Card($$renderer2, {
      class: "cursor-pointer p-4 transition-shadow hover:shadow-[var(--shadow-md)]",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="flex items-center gap-3"><div class="rounded-[var(--radius)] bg-[var(--warning-light)] p-2">`);
        DownloadSimple($$renderer3, { size: 20, color: "var(--warning)" });
        $$renderer3.push(`<!----></div> <div><p class="text-sm font-medium text-[var(--foreground)]">${escape_html(dashboard_quick_export())}</p> <p class="text-xs text-[var(--foreground-muted)]">${escape_html(dashboard_quick_export_sub())}</p></div></div>`);
      }
    });
    $$renderer2.push(`<!----></a></div></div></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-C3A6TMC0.js.map
