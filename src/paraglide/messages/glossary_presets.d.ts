/**
* | output |
* | --- |
* | "Preset glossaries (English → Simplified Chinese)" |
*
* @param {Glossary_PresetsInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_presets: ((inputs?: Glossary_PresetsInputs, options?: {
    locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Glossary_PresetsInputs, {
    locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Glossary_PresetsInputs = {};
