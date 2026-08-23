/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Glossary_Section_DescInputs */

const zh_glossary_section_desc = /** @type {(inputs: Glossary_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`为特定术语固定译法。按需注入：只有译文里真出现该术语时才进入提示词，术语表再大也不多花一个 token。可选站点范围，与站点规则同一套匹配。`)
};

const zh_tw2_glossary_section_desc = /** @type {(inputs: Glossary_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`為特定術語固定譯法。按需注入：只有譯文裡真出現該術語時才進入提示詞，術語表再大也不多花一個 token。可選站點範圍，與站點規則同一套匹配。`)
};

const en_glossary_section_desc = /** @type {(inputs: Glossary_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pin exact translations for terms. Injected on demand: an entry only enters the prompt when its term occurs in the text — a large glossary costs nothing extra. Optional site scope, same matching as site rules.`)
};

const ja_glossary_section_desc = /** @type {(inputs: Glossary_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`用語の訳語を固定します。オンデマンド注入：その用語が本文に現れたときだけプロンプトに入るため、用語集が大きくても余分なコストはかかりません。サイト範囲の指定も可能です。`)
};

const ko_glossary_section_desc = /** @type {(inputs: Glossary_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`용어의 번역어를 고정합니다. 온디맨드 주입: 해당 용어가 본문에 나타날 때만 프롬프트에 포함되어, 용어집이 커져도 추가 비용이 없습니다. 사이트 범위 지정 가능.`)
};

const fr_glossary_section_desc = /** @type {(inputs: Glossary_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fixez la traduction exacte de certains termes. Injection à la demande : une entrée n'entre dans le prompt que si son terme apparaît dans le texte — un grand glossaire ne coûte rien de plus. Portée par site en option.`)
};

const de_glossary_section_desc = /** @type {(inputs: Glossary_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Feste Übersetzungen für Begriffe. Bedarfsgesteuerte Injektion: Ein Eintrag gelangt nur in den Prompt, wenn sein Begriff im Text vorkommt — ein großes Glossar kostet nichts extra. Optionaler Site-Bereich.`)
};

const es_glossary_section_desc = /** @type {(inputs: Glossary_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fija traducciones exactas para términos. Inyección bajo demanda: una entrada solo entra en el prompt cuando su término aparece en el texto; un glosario grande no cuesta nada extra. Ámbito por sitio opcional.`)
};

const ru_glossary_section_desc = /** @type {(inputs: Glossary_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Закрепите точный перевод терминов. Внедрение по требованию: запись попадает в промпт, только если термин встречается в тексте — большой глоссарий ничего не стоит. Необязательная привязка к сайтам.`)
};

const pt_glossary_section_desc = /** @type {(inputs: Glossary_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fixe traduções exatas para termos. Injeção sob demanda: uma entrada só entra no prompt quando o termo ocorre no texto — um glossário grande não custa nada extra. Âmbito por site opcional.`)
};

const it_glossary_section_desc = /** @type {(inputs: Glossary_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fissa traduzioni esatte per i termini. Iniezione on demand: una voce entra nel prompt solo quando il termine compare nel testo — un glossario grande non costa nulla in più. Ambito per sito opzionale.`)
};

const ar_glossary_section_desc = /** @type {(inputs: Glossary_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ثبّت ترجمات دقيقة للمصطلحات. حقن عند الطلب: لا يدخل المدخل إلى الموجّه إلا إذا ظهر مصطلحه في النص — المسرد الكبير لا يكلف شيئاً إضافياً. نطاق الموقع اختياري.`)
};

/**
* | output |
* | --- |
* | "Pin exact translations for terms. Injected on demand: an entry only enters the prompt when its term occurs in the text — a large glossary costs nothing extra..." |
*
* @param {Glossary_Section_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_section_desc = /** @type {((inputs?: Glossary_Section_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_Section_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_section_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_section_desc(inputs)
	if (locale === "en") return en_glossary_section_desc(inputs)
	if (locale === "ja") return ja_glossary_section_desc(inputs)
	if (locale === "ko") return ko_glossary_section_desc(inputs)
	if (locale === "fr") return fr_glossary_section_desc(inputs)
	if (locale === "de") return de_glossary_section_desc(inputs)
	if (locale === "es") return es_glossary_section_desc(inputs)
	if (locale === "ru") return ru_glossary_section_desc(inputs)
	if (locale === "pt") return pt_glossary_section_desc(inputs)
	if (locale === "it") return it_glossary_section_desc(inputs)
	return ar_glossary_section_desc(inputs)
});