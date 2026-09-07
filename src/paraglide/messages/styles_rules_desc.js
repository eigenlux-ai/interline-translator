/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Styles_Rules_DescInputs */

const zh_styles_rules_desc = /** @type {(inputs: Styles_Rules_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`为特定网站指定翻译风格。多个规则匹配时，网站匹配表达式最长的规则优先；没有匹配时使用默认风格。`)
};

const zh_tw2_styles_rules_desc = /** @type {(inputs: Styles_Rules_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`為特定網站指定翻譯風格。多項規則符合時，網站比對模式最長的規則優先；沒有符合的規則時使用預設風格。`)
};

const en_styles_rules_desc = /** @type {(inputs: Styles_Rules_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Assign styles to specific sites. The longest matching site pattern takes priority; otherwise, your default style applies.`)
};

const ja_styles_rules_desc = /** @type {(inputs: Styles_Rules_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`サイトごとにスタイルを指定できます。一致するサイトパターンが最も長いルールを優先し、一致がなければ既定のスタイルを使います。`)
};

const ko_styles_rules_desc = /** @type {(inputs: Styles_Rules_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`사이트별 문체를 지정합니다. 일치하는 사이트 패턴이 가장 긴 규칙을 우선하며, 일치하는 규칙이 없으면 기본 문체를 사용합니다.`)
};

const fr_styles_rules_desc = /** @type {(inputs: Styles_Rules_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Attribuez un style à certains sites. Le motif de site correspondant le plus long est prioritaire ; sinon, le style par défaut s’applique.`)
};

const de_styles_rules_desc = /** @type {(inputs: Styles_Rules_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Weisen Sie einzelnen Websites einen Stil zu. Das längste passende Website-Muster hat Vorrang. Ohne Treffer gilt der Standardstil.`)
};

const es_styles_rules_desc = /** @type {(inputs: Styles_Rules_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Asigna estilos a sitios concretos. Tiene prioridad el patrón de sitio coincidente más largo; si no hay coincidencias, se usa el estilo predeterminado.`)
};

const ru_styles_rules_desc = /** @type {(inputs: Styles_Rules_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Назначьте стили отдельным сайтам. Приоритет у самого длинного совпавшего шаблона сайта. Если совпадений нет, используется стиль по умолчанию.`)
};

const pt_styles_rules_desc = /** @type {(inputs: Styles_Rules_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Atribua estilos a sites específicos. O padrão de site correspondente mais longo tem prioridade; se nenhum corresponder, será usado o estilo padrão.`)
};

const it_styles_rules_desc = /** @type {(inputs: Styles_Rules_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Assegna uno stile a determinati siti. Ha la precedenza il pattern di sito corrispondente più lungo; in assenza di corrispondenze si usa lo stile predefinito.`)
};

const ar_styles_rules_desc = /** @type {(inputs: Styles_Rules_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خصّص أسلوبًا لمواقع محددة. تكون الأولوية لأطول نمط موقع مطابق، ويُستخدم الأسلوب الافتراضي عند عدم وجود تطابق.`)
};

/**
* | output |
* | --- |
* | "Assign styles to specific sites. The longest matching site pattern takes priority; otherwise, your default style applies." |
*
* @param {Styles_Rules_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const styles_rules_desc = /** @type {((inputs?: Styles_Rules_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Styles_Rules_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_styles_rules_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_styles_rules_desc(inputs)
	if (locale === "en") return en_styles_rules_desc(inputs)
	if (locale === "ja") return ja_styles_rules_desc(inputs)
	if (locale === "ko") return ko_styles_rules_desc(inputs)
	if (locale === "fr") return fr_styles_rules_desc(inputs)
	if (locale === "de") return de_styles_rules_desc(inputs)
	if (locale === "es") return es_styles_rules_desc(inputs)
	if (locale === "ru") return ru_styles_rules_desc(inputs)
	if (locale === "pt") return pt_styles_rules_desc(inputs)
	if (locale === "it") return it_styles_rules_desc(inputs)
	return ar_styles_rules_desc(inputs)
});