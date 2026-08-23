/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Styles_Rules_DescInputs */

const zh_styles_rules_desc = /** @type {(inputs: Styles_Rules_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`让某些站点固定使用某个风格；最长匹配的规则优先，未命中回落全局默认。`)
};

const zh_tw2_styles_rules_desc = /** @type {(inputs: Styles_Rules_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`讓某些站點固定使用某個風格；最長匹配的規則優先，未命中回落全域預設。`)
};

const en_styles_rules_desc = /** @type {(inputs: Styles_Rules_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pin a style to matching sites; the longest matching pattern wins, otherwise the global default applies.`)
};

const ja_styles_rules_desc = /** @type {(inputs: Styles_Rules_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`特定のサイトにスタイルを固定します。最長一致のパターンが優先され、未一致は全体既定に従います。`)
};

const ko_styles_rules_desc = /** @type {(inputs: Styles_Rules_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`특정 사이트에 스타일을 고정합니다. 가장 긴 패턴이 우선하며, 매칭이 없으면 전역 기본값이 적용됩니다.`)
};

const fr_styles_rules_desc = /** @type {(inputs: Styles_Rules_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fixez un style à certains sites ; le motif le plus long l'emporte, sinon le style global s'applique.`)
};

const de_styles_rules_desc = /** @type {(inputs: Styles_Rules_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bestimmten Websites einen Stil zuweisen; das längste passende Muster gewinnt, sonst gilt der globale Standard.`)
};

const es_styles_rules_desc = /** @type {(inputs: Styles_Rules_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fija un estilo a ciertos sitios; gana el patrón coincidente más largo; si no, se aplica el global.`)
};

const ru_styles_rules_desc = /** @type {(inputs: Styles_Rules_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Закрепите стиль за сайтами; побеждает самый длинный совпавший шаблон, иначе действует глобальный.`)
};

const pt_styles_rules_desc = /** @type {(inputs: Styles_Rules_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fixe um estilo em certos sites; vence o padrão mais longo; caso contrário, aplica-se o global.`)
};

const it_styles_rules_desc = /** @type {(inputs: Styles_Rules_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fissa uno stile a determinati siti; vince il pattern più lungo, altrimenti vale il globale.`)
};

const ar_styles_rules_desc = /** @type {(inputs: Styles_Rules_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ثبّت نمطاً لمواقع معيّنة؛ يفوز النمط الأطول تطابقاً، وإلا يُطبَّق الافتراضي العام.`)
};

/**
* | output |
* | --- |
* | "Pin a style to matching sites; the longest matching pattern wins, otherwise the global default applies." |
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