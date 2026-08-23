/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Styles_Directives_HintInputs */

const zh_styles_directives_hint = /** @type {(inputs: Styles_Directives_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`用自然语言描述想要的语气与用词；建议用英文书写（模型执行最稳、耗费更少）。只管品味——输出格式由引擎守护。`)
};

const zh_tw2_styles_directives_hint = /** @type {(inputs: Styles_Directives_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`用自然語言描述想要的語氣與用詞；建議用英文書寫（模型執行最穩、耗費更少）。只管品味——輸出格式由引擎守護。`)
};

const en_styles_directives_hint = /** @type {(inputs: Styles_Directives_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Describe the tone and wording you want in natural language; English works best. Taste only — the engine guards the output format.`)
};

const ja_styles_directives_hint = /** @type {(inputs: Styles_Directives_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`望む語調や言い回しを自然言語で記述します（英語が最も安定）。指定するのは好みだけ——出力形式はエンジンが守ります。`)
};

const ko_styles_directives_hint = /** @type {(inputs: Styles_Directives_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`원하는 어조와 표현을 자연어로 적으세요(영어가 가장 안정적). 취향만 지정하세요 — 출력 형식은 엔진이 지킵니다.`)
};

const fr_styles_directives_hint = /** @type {(inputs: Styles_Directives_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Décrivez le ton et le vocabulaire souhaités en langage naturel (l'anglais est le plus fiable). Le goût seulement — le moteur garde le format de sortie.`)
};

const de_styles_directives_hint = /** @type {(inputs: Styles_Directives_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Beschreiben Sie Ton und Wortwahl in natürlicher Sprache (Englisch ist am zuverlässigsten). Nur Geschmack — das Ausgabeformat schützt die Engine.`)
};

const es_styles_directives_hint = /** @type {(inputs: Styles_Directives_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Describe el tono y el vocabulario deseados en lenguaje natural (el inglés es lo más fiable). Solo el gusto: el motor protege el formato de salida.`)
};

const ru_styles_directives_hint = /** @type {(inputs: Styles_Directives_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Опишите желаемый тон и лексику обычным языком (надёжнее всего — по-английски). Только вкус: формат вывода защищает движок.`)
};

const pt_styles_directives_hint = /** @type {(inputs: Styles_Directives_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Descreva o tom e o vocabulário desejados em linguagem natural (inglês é o mais fiável). Apenas o gosto — o motor protege o formato de saída.`)
};

const it_styles_directives_hint = /** @type {(inputs: Styles_Directives_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Descrivi il tono e il lessico desiderati in linguaggio naturale (l'inglese è il più affidabile). Solo il gusto: il formato di output lo difende il motore.`)
};

const ar_styles_directives_hint = /** @type {(inputs: Styles_Directives_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صف النبرة والمفردات المطلوبة بلغة طبيعية (الإنجليزية الأكثر موثوقية). الذوق فقط — المحرك يحمي تنسيق الإخراج.`)
};

/**
* | output |
* | --- |
* | "Describe the tone and wording you want in natural language; English works best. Taste only — the engine guards the output format." |
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