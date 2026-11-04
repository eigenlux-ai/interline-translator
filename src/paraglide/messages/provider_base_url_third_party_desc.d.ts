/**
* | output |
* | --- |
* | "The example is a third-party service (Moonshot), not the official endpoint. Left blank, requests go to the official endpoint https://api.anthropic.com/v1." |
*
* @param {Provider_Base_Url_Third_Party_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_base_url_third_party_desc: ((inputs?: Provider_Base_Url_Third_Party_DescInputs, options?: {
    locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar";
}) => LocalizedString) & import("../runtime.js").MessageMetadata<Provider_Base_Url_Third_Party_DescInputs, {
    locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar";
}, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Provider_Base_Url_Third_Party_DescInputs = {};
