/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expert_DescInputs */

const zh_expert_desc = /** @type {(inputs: Expert_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`整体接管提示词模板（如需塞入 few-shot 示例）。设置后对应管线不再注入翻译风格。`)
};

const zh_tw2_expert_desc = /** @type {(inputs: Expert_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`整體接管提示詞模板（如需塞入 few-shot 範例）。設定後對應管線不再注入翻譯風格。`)
};

const en_expert_desc = /** @type {(inputs: Expert_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Take over the whole prompt template (e.g. to add few-shot examples). When set, that pipeline no longer injects the translation style.`)
};

const ja_expert_desc = /** @type {(inputs: Expert_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`プロンプトテンプレート全体を差し替えます（few-shot 例の追加など）。設定したパイプラインにはスタイルが注入されません。`)
};

const ko_expert_desc = /** @type {(inputs: Expert_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`프롬프트 템플릿 전체를 교체합니다(few-shot 예시 등). 설정한 파이프라인에는 스타일이 주입되지 않습니다.`)
};

const fr_expert_desc = /** @type {(inputs: Expert_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remplacez tout le modèle de prompt (p. ex. pour des exemples few-shot). Le style n'est alors plus injecté dans ce pipeline.`)
};

const de_expert_desc = /** @type {(inputs: Expert_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Übernehmen Sie die gesamte Prompt-Vorlage (z. B. für Few-Shot-Beispiele). Der Stil wird in dieser Pipeline dann nicht mehr injiziert.`)
};

const es_expert_desc = /** @type {(inputs: Expert_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sustituye toda la plantilla del prompt (p. ej., para ejemplos few-shot). Con ello, ese pipeline deja de inyectar el estilo.`)
};

const ru_expert_desc = /** @type {(inputs: Expert_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Полная замена шаблона промпта (например, для few-shot примеров). Стиль в этот конвейер больше не внедряется.`)
};

const pt_expert_desc = /** @type {(inputs: Expert_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Substitua todo o modelo de prompt (p. ex., exemplos few-shot). Esse pipeline deixa de injetar o estilo.`)
};

const it_expert_desc = /** @type {(inputs: Expert_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sostituisci l'intero template del prompt (es. per esempi few-shot). Quel pipeline non inietta più lo stile.`)
};

const ar_expert_desc = /** @type {(inputs: Expert_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استبدل قالب الموجّه بالكامل (مثلاً لإضافة أمثلة few-shot). عندها لا يُحقن النمط في ذلك المسار.`)
};

/**
* | output |
* | --- |
* | "Take over the whole prompt template (e.g. to add few-shot examples). When set, that pipeline no longer injects the translation style." |
*
* @param {Expert_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const expert_desc = /** @type {((inputs?: Expert_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expert_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_expert_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_expert_desc(inputs)
	if (locale === "en") return en_expert_desc(inputs)
	if (locale === "ja") return ja_expert_desc(inputs)
	if (locale === "ko") return ko_expert_desc(inputs)
	if (locale === "fr") return fr_expert_desc(inputs)
	if (locale === "de") return de_expert_desc(inputs)
	if (locale === "es") return es_expert_desc(inputs)
	if (locale === "ru") return ru_expert_desc(inputs)
	if (locale === "pt") return pt_expert_desc(inputs)
	if (locale === "it") return it_expert_desc(inputs)
	return ar_expert_desc(inputs)
});