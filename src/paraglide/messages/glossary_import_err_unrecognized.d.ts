/**
* | output |
* | --- |
* | "Could not parse the file — supported: an exported JSON set, or CSV/TSV rows of source,target[,note]." |
*
* @param {Glossary_Import_Err_UnrecognizedInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_import_err_unrecognized: ((inputs?: Glossary_Import_Err_UnrecognizedInputs, options?: {
    locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Glossary_Import_Err_UnrecognizedInputs, {
    locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Glossary_Import_Err_UnrecognizedInputs = {};
