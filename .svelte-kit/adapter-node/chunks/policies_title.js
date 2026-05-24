import { g as getLocale } from "./runtime.js";
const en_policies_title = (
  /** @type {(inputs: Policies_TitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Policies`
    );
  }
);
const policies_title = (
  /** @type {((inputs?: Policies_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Policies_TitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_policies_title();
  })
);
export {
  policies_title as p
};
