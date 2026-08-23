/**
* | output |
* | --- |
* | "Placeholders: {target} target language · {source} source language · {title} page title · {text} the text (user template only) · {salt} batch marker salt (bat..." |
*
* @param {Expert_Placeholders_HintInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const expert_placeholders_hint: ((inputs: Expert_Placeholders_HintInputs, options?: {
    locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Expert_Placeholders_HintInputs, {
    locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Expert_Placeholders_HintInputs = {
    target: NonNullable<unknown>;
    source: NonNullable<unknown>;
    title: NonNullable<unknown>;
    text: NonNullable<unknown>;
    salt: NonNullable<unknown>;
};
