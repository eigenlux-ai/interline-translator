/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Backup_Reset_Confirm_TextInputs */

const zh_backup_reset_confirm_text = /** @type {(inputs: Backup_Reset_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`将重置所有设置，并清除已添加的引擎、API 密钥、网站规则、自定义风格和术语表。如需保留，请先导出备份。`)
};

const zh_tw2_backup_reset_confirm_text = /** @type {(inputs: Backup_Reset_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`將重設所有設定，並清除已新增的引擎、API 金鑰、網站規則、自訂風格和術語表。如需保留，請先匯出備份。`)
};

const en_backup_reset_confirm_text = /** @type {(inputs: Backup_Reset_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This resets all settings and removes your added engines, API keys, site rules, custom styles, and glossaries. Export a backup first if you want to keep them.`)
};

const ja_backup_reset_confirm_text = /** @type {(inputs: Backup_Reset_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`すべての設定を初期化し、追加したエンジン、API キー、サイトルール、カスタムスタイル、用語集を削除します。残したい場合は先にバックアップを書き出してください。`)
};

const ko_backup_reset_confirm_text = /** @type {(inputs: Backup_Reset_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`모든 설정을 초기화하고 추가한 엔진, API 키, 사이트 규칙, 사용자 스타일, 용어집을 삭제합니다. 보관하려면 먼저 백업을 내보내세요.`)
};

const fr_backup_reset_confirm_text = /** @type {(inputs: Backup_Reset_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tous les réglages seront réinitialisés. Les moteurs ajoutés, clés API, règles de site, styles personnalisés et glossaires seront supprimés. Exportez une sauvegarde pour les conserver.`)
};

const de_backup_reset_confirm_text = /** @type {(inputs: Backup_Reset_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Alle Einstellungen werden zurückgesetzt. Hinzugefügte Engines, API-Schlüssel, Website-Regeln, eigene Stile und Glossare werden gelöscht. Exportieren Sie vorher eine Sicherung, wenn Sie diese behalten möchten.`)
};

const es_backup_reset_confirm_text = /** @type {(inputs: Backup_Reset_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Se restablecerán todos los ajustes y se eliminarán los motores añadidos, las claves API, las reglas de sitios, los estilos personalizados y los glosarios. Exporta una copia de seguridad si quieres conservarlos.`)
};

const ru_backup_reset_confirm_text = /** @type {(inputs: Backup_Reset_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Все настройки будут сброшены. Добавленные движки, API-ключи, правила сайтов, собственные стили и глоссарии будут удалены. Если хотите их сохранить, сначала экспортируйте резервную копию.`)
};

const pt_backup_reset_confirm_text = /** @type {(inputs: Backup_Reset_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Todas as configurações serão redefinidas. Motores adicionados, chaves de API, regras de sites, estilos personalizados e glossários serão excluídos. Exporte um backup se quiser mantê-los.`)
};

const it_backup_reset_confirm_text = /** @type {(inputs: Backup_Reset_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tutte le impostazioni verranno ripristinate. Saranno eliminati motori aggiunti, chiavi API, regole dei siti, stili personalizzati e glossari. Esporta un backup se vuoi conservarli.`)
};

const ar_backup_reset_confirm_text = /** @type {(inputs: Backup_Reset_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ستُعاد جميع الإعدادات إلى قيمها الافتراضية، وتُحذف المحرّكات المضافة ومفاتيح API وقواعد المواقع والأنماط المخصصة والمسارد. صدّر نسخة احتياطية أولًا إذا أردت الاحتفاظ بها.`)
};

/**
* | output |
* | --- |
* | "This resets all settings and removes your added engines, API keys, site rules, custom styles, and glossaries. Export a backup first if you want to keep them." |
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