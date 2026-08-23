/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Backup_Reset_Confirm_TextInputs */

const zh_backup_reset_confirm_text = /** @type {(inputs: Backup_Reset_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`将清除全部引擎、API key 与站点规则。建议先导出配置。`)
};

const zh_tw2_backup_reset_confirm_text = /** @type {(inputs: Backup_Reset_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`將清除所有引擎、API key 與網站規則。建議先匯出設定。`)
};

const en_backup_reset_confirm_text = /** @type {(inputs: Backup_Reset_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This wipes every engine, API key and site rule. Consider exporting first.`)
};

const ja_backup_reset_confirm_text = /** @type {(inputs: Backup_Reset_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`すべてのエンジン、API key、サイトルールを消去します。先に書き出しておくことをおすすめします。`)
};

const ko_backup_reset_confirm_text = /** @type {(inputs: Backup_Reset_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`모든 엔진, API key, 사이트 규칙을 지웁니다. 먼저 내보내 두는 것을 권합니다.`)
};

const fr_backup_reset_confirm_text = /** @type {(inputs: Backup_Reset_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cela efface tous les moteurs, clés API et règles de site. Pensez à exporter d'abord.`)
};

const de_backup_reset_confirm_text = /** @type {(inputs: Backup_Reset_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Damit werden alle Engines, API keys und Website-Regeln gelöscht. Exportieren Sie am besten zuerst.`)
};

const es_backup_reset_confirm_text = /** @type {(inputs: Backup_Reset_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Se borrarán todos los motores, claves API y reglas de sitio. Conviene exportar primero.`)
};

const ru_backup_reset_confirm_text = /** @type {(inputs: Backup_Reset_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Будут удалены все движки, API keys и правила сайтов. Лучше сначала сделать экспорт.`)
};

const pt_backup_reset_confirm_text = /** @type {(inputs: Backup_Reset_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Isto apaga todos os motores, API keys e regras de site. É melhor exportar primeiro.`)
};

const it_backup_reset_confirm_text = /** @type {(inputs: Backup_Reset_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Verranno cancellati tutti i motori, le API key e le regole dei siti. Meglio esportare prima.`)
};

const ar_backup_reset_confirm_text = /** @type {(inputs: Backup_Reset_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سيمحو هذا كل المحرّكات ومفاتيح API وقواعد المواقع. يُستحسَن التصدير أولًا.`)
};

/**
* | output |
* | --- |
* | "This wipes every engine, API key and site rule. Consider exporting first." |
*
* @param {Backup_Reset_Confirm_TextInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const backup_reset_confirm_text = /** @type {((inputs?: Backup_Reset_Confirm_TextInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Backup_Reset_Confirm_TextInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_backup_reset_confirm_text(inputs)
	if (locale === "zh-TW") return zh_tw2_backup_reset_confirm_text(inputs)
	if (locale === "en") return en_backup_reset_confirm_text(inputs)
	if (locale === "ja") return ja_backup_reset_confirm_text(inputs)
	if (locale === "ko") return ko_backup_reset_confirm_text(inputs)
	if (locale === "fr") return fr_backup_reset_confirm_text(inputs)
	if (locale === "de") return de_backup_reset_confirm_text(inputs)
	if (locale === "es") return es_backup_reset_confirm_text(inputs)
	if (locale === "ru") return ru_backup_reset_confirm_text(inputs)
	if (locale === "pt") return pt_backup_reset_confirm_text(inputs)
	if (locale === "it") return it_backup_reset_confirm_text(inputs)
	return ar_backup_reset_confirm_text(inputs)
});