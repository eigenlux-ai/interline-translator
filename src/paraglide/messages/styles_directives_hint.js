/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Styles_Directives_HintInputs */

const zh_styles_directives_hint = /** @type {(inputs: Styles_Directives_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`描述你希望使用的语气、文风与措辞即可，输出格式要求会自动添加。`)
};

const zh_tw2_styles_directives_hint = /** @type {(inputs: Styles_Directives_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`描述你希望使用的語氣、文風與措辭即可，輸出格式要求會自動加入。`)
};

const en_styles_directives_hint = /** @type {(inputs: Styles_Directives_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Describe the tone and wording you want. Focus on style; output-format instructions are added automatically.`)
};

const ja_styles_directives_hint = /** @type {(inputs: Styles_Directives_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`希望する語調や言い回しを普段の言葉で記述してください。出力形式の指示は自動で追加されます。`)
};

const ko_styles_directives_hint = /** @type {(inputs: Styles_Directives_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`원하는 어조와 표현을 일상적인 말로 설명하세요. 출력 형식에 관한 지시는 자동으로 추가됩니다.`)
};

const fr_styles_directives_hint = /** @type {(inputs: Styles_Directives_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Décrivez simplement le ton et les formulations souhaités. Les consignes de format sont ajoutées automatiquement.`)
};

const de_styles_directives_hint = /** @type {(inputs: Styles_Directives_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Beschreiben Sie den gewünschten Ton und die Wortwahl in eigenen Worten. Vorgaben zum Ausgabeformat werden automatisch ergänzt.`)
};

const es_styles_directives_hint = /** @type {(inputs: Styles_Directives_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Describe con tus propias palabras el tono y las expresiones que buscas. Las instrucciones de formato se añaden automáticamente.`)
};

const ru_styles_directives_hint = /** @type {(inputs: Styles_Directives_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Опишите своими словами желаемый тон и формулировки. Инструкции по формату ответа добавляются автоматически.`)
};

const pt_styles_directives_hint = /** @type {(inputs: Styles_Directives_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Descreva com suas próprias palavras o tom e as expressões que deseja. As instruções de formato são adicionadas automaticamente.`)
};

const it_styles_directives_hint = /** @type {(inputs: Styles_Directives_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Descrivi con parole tue il tono e le espressioni che desideri. Le istruzioni sul formato vengono aggiunte automaticamente.`)
};

const ar_styles_directives_hint = /** @type {(inputs: Styles_Directives_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صف بكلماتك النبرة والصياغة التي تريدها. تُضاف تعليمات تنسيق المخرجات تلقائيًا.`)
};

/**
* | output |
* | --- |
* | "Describe the tone and wording you want. Focus on style; output-format instructions are added automatically." |
*
* @param {Styles_Directives_HintInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const styles_directives_hint = /** @type {((inputs?: Styles_Directives_HintInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Styles_Directives_HintInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_styles_directives_hint(inputs)
	if (locale === "zh-TW") return zh_tw2_styles_directives_hint(inputs)
	if (locale === "en") return en_styles_directives_hint(inputs)
	if (locale === "ja") return ja_styles_directives_hint(inputs)
	if (locale === "ko") return ko_styles_directives_hint(inputs)
	if (locale === "fr") return fr_styles_directives_hint(inputs)
	if (locale === "de") return de_styles_directives_hint(inputs)
	if (locale === "es") return es_styles_directives_hint(inputs)
	if (locale === "ru") return ru_styles_directives_hint(inputs)
	if (locale === "pt") return pt_styles_directives_hint(inputs)
	if (locale === "it") return it_styles_directives_hint(inputs)
	return ar_styles_directives_hint(inputs)
});