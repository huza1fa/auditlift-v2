import { e as getLocale } from './runtime-tB9eeHiM.js';

const en_tagline = (
  /** @type {(inputs: TaglineInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Get audit-ready in 30 days`
    );
  }
);
const tagline = (
  /** @type {((inputs?: TaglineInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<TaglineInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_tagline();
  })
);
const en_forgot_password_back_to_signin = (
  /** @type {(inputs: Forgot_Password_Back_To_SigninInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Back to sign in`
    );
  }
);
const forgot_password_back_to_signin = (
  /** @type {((inputs?: Forgot_Password_Back_To_SigninInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Forgot_Password_Back_To_SigninInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_forgot_password_back_to_signin();
  })
);

export { forgot_password_back_to_signin as f, tagline as t };
//# sourceMappingURL=forgot_password_back_to_signin-Xnb-JfPn.js.map
