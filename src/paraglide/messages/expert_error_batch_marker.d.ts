/**
* | output |
* | --- |
* | "The batch template must keep the literal fragment [[{salt}# — whole-page translation depends on this marker instruction; removing it breaks it outright." |
*
* @param {Expert_Error_Batch_MarkerInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const expert_error_batch_marker: ((inputs: Expert_Error_Batch_MarkerInputs, options?: {
    locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Expert_Error_Batch_MarkerInputs, {
    locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Expert_Error_Batch_MarkerInputs = {
    salt: NonNullable<unknown>;
};
