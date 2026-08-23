/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Backup_ImportedInputs */

const zh_backup_imported = /** @type {(inputs: Backup_ImportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`配置已导入。所有引擎都回到草稿状态，验证连接后才能重新启用。`)
};

const zh_tw2_backup_imported = /** @type {(inputs: Backup_ImportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`設定已匯入。所有引擎都回到草稿狀態，驗證連線後才能重新啟用。`)
};

const en_backup_imported = /** @type {(inputs: Backup_ImportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Config imported. Every engine came in as a draft — validate the connection to switch it back on.`)
};

const ja_backup_imported = /** @type {(inputs: Backup_ImportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`設定を読み込みました。エンジンはすべて下書きです。接続を検証すると再び有効にできます。`)
};

const ko_backup_imported = /** @type {(inputs: Backup_ImportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`설정을 가져왔습니다. 엔진은 모두 초안 상태이며, 연결을 검증해야 다시 켤 수 있습니다.`)
};

const fr_backup_imported = /** @type {(inputs: Backup_ImportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Configuration importée. Chaque moteur est revenu en brouillon : validez la connexion pour le réactiver.`)
};

const de_backup_imported = /** @type {(inputs: Backup_ImportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Konfiguration importiert. Jede Engine ist wieder ein Entwurf — Verbindung prüfen, um sie zu aktivieren.`)
};

const es_backup_imported = /** @type {(inputs: Backup_ImportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Configuración importada. Cada motor vuelve a ser un borrador: valida la conexión para activarlo.`)
};

const ru_backup_imported = /** @type {(inputs: Backup_ImportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Настройки импортированы. Каждый движок снова черновик — проверьте соединение, чтобы включить его.`)
};

const pt_backup_imported = /** @type {(inputs: Backup_ImportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Configuração importada. Cada motor voltou a rascunho: valide a ligação para o ativar.`)
};

const it_backup_imported = /** @type {(inputs: Backup_ImportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Configurazione importata. Ogni motore è tornato una bozza: verifica la connessione per riattivarlo.`)
};

const ar_backup_imported = /** @type {(inputs: Backup_ImportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم استيراد الإعدادات. عاد كل محرّك إلى مسوّدة — تحقّق من الاتصال لإعادة تفعيله.`)
};

/**
* | output |
* | --- |
* | "Config imported. Every engine came in as a draft — validate the connection to switch it back on." |
*
* @param {Backup_ImportedInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const backup_imported = /** @type {((inputs?: Backup_ImportedInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Backup_ImportedInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_backup_imported(inputs)
	if (locale === "zh-TW") return zh_tw2_backup_imported(inputs)
	if (locale === "en") return en_backup_imported(inputs)
	if (locale === "ja") return ja_backup_imported(inputs)
	if (locale === "ko") return ko_backup_imported(inputs)
	if (locale === "fr") return fr_backup_imported(inputs)
	if (locale === "de") return de_backup_imported(inputs)
	if (locale === "es") return es_backup_imported(inputs)
	if (locale === "ru") return ru_backup_imported(inputs)
	if (locale === "pt") return pt_backup_imported(inputs)
	if (locale === "it") return it_backup_imported(inputs)
	return ar_backup_imported(inputs)
});