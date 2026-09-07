/**
* | output |
* | --- |
* | "Keep the exact fragment [[{salt}# in the batch template. It is required to match each translation to its source text." |
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
