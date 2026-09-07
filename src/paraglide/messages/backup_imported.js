/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Backup_ImportedInputs */

const zh_backup_imported = /** @type {(inputs: Backup_ImportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`设置已导入。导入的 AI 引擎须验证连接后才能启用；内置免费引擎无需验证。`)
};

const zh_tw2_backup_imported = /** @type {(inputs: Backup_ImportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`設定已匯入。匯入的 AI 引擎須驗證連線後才能啟用；內建免費引擎不需驗證。`)
};

const en_backup_imported = /** @type {(inputs: Backup_ImportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Settings imported. Validate the imported AI engines before enabling them. The built-in free engine does not require validation.`)
};

const ja_backup_imported = /** @type {(inputs: Backup_ImportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`設定を読み込みました。読み込んだ AI エンジンは接続を検証してから有効にしてください。内蔵の無料エンジンは検証不要です。`)
};

const ko_backup_imported = /** @type {(inputs: Backup_ImportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`설정을 가져왔습니다. 가져온 AI 엔진은 연결을 검증한 뒤 활성화할 수 있습니다. 기본 무료 엔진은 검증이 필요 없습니다.`)
};

const fr_backup_imported = /** @type {(inputs: Backup_ImportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réglages importés. Validez la connexion des moteurs d’IA importés avant de les activer. Le moteur gratuit intégré ne nécessite aucune validation.`)
};

const de_backup_imported = /** @type {(inputs: Backup_ImportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Einstellungen importiert. Prüfen Sie die importierten KI-Engines, bevor Sie sie aktivieren. Die integrierte kostenlose Engine benötigt keine Prüfung.`)
};

const es_backup_imported = /** @type {(inputs: Backup_ImportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajustes importados. Valida los motores de IA importados antes de activarlos. El motor gratuito integrado no necesita validación.`)
};

const ru_backup_imported = /** @type {(inputs: Backup_ImportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Настройки импортированы. Проверьте соединение импортированных ИИ-движков перед включением. Встроенный бесплатный движок не требует проверки.`)
};

const pt_backup_imported = /** @type {(inputs: Backup_ImportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Configurações importadas. Valide os motores de IA importados antes de ativá-los. O motor gratuito integrado não precisa de validação.`)
};

const it_backup_imported = /** @type {(inputs: Backup_ImportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impostazioni importate. Verifica i motori di IA importati prima di attivarli. Il motore gratuito integrato non richiede verifica.`)
};

const ar_backup_imported = /** @type {(inputs: Backup_ImportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم استيراد الإعدادات. تحقّق من اتصال محرّكات الذكاء الاصطناعي المستوردة قبل تفعيلها. لا يحتاج المحرّك المجاني المدمج إلى تحقق.`)
};

/**
* | output |
* | --- |
* | "Settings imported. Validate the imported AI engines before enabling them. The built-in free engine does not require validation." |
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