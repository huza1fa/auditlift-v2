import { e as getLocale } from './runtime-tB9eeHiM.js';

const en_questionnaires_title = (
  /** @type {(inputs: Questionnaires_TitleInputs) => LocalizedString} */
  () => {
    return (
      /** @type {LocalizedString} */
      `Questionnaires`
    );
  }
);
const questionnaires_title = (
  /** @type {((inputs?: Questionnaires_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Questionnaires_TitleInputs, { locale?: "en" }, {}>} */
  ((inputs = {}, options = {}) => {
    options.locale ?? getLocale();
    return en_questionnaires_title();
  })
);

export { questionnaires_title as q };
//# sourceMappingURL=questionnaires_title-CfcmBSpy.js.map
