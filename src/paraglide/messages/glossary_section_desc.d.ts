/**
* | output |
* | --- |
* | "Specify preferred translations for terms. Only entries matching the source text are added to AI prompts; unused entries add no tokens. You can limit each set..." |
*
* @param {Glossary_Section_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_section_desc: ((inputs?: Glossary_Section_DescInputs, options?: {
    locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Glossary_Section_DescInputs, {
    locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Glossary_Section_DescInputs = {};
