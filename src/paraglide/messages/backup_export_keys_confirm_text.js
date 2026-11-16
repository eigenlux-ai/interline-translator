/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Backup_Export_Keys_Confirm_TextInputs */

const zh_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`导出的 JSON 文件会包含明文 API 密钥和自定义请求头。仅用于在你自己的可信设备间迁移，请勿分享或上传此文件。`)
};

const zh_tw2_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`匯出的 JSON 檔案會包含明文 API 金鑰和自訂請求標頭。僅用於在你自己的可信任裝置間移轉，請勿分享或上傳此檔案。`)
};

const en_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The exported JSON file will contain your API keys and custom headers in plain text. Use this only to move between your own trusted devices — never share or upload the file.`)
};

const ja_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`エクスポートする JSON ファイルには、API キーとカスタムヘッダーが平文で含まれます。ご自身の信頼できる端末間での移行にのみ使用し、共有やアップロードはしないでください。`)
};

const ko_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`내보낸 JSON 파일에는 API 키와 사용자 지정 헤더가 일반 텍스트로 포함됩니다. 본인의 신뢰할 수 있는 기기 간 이전에만 사용하고 파일을 공유하거나 업로드하지 마세요.`)
};

const fr_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le fichier JSON exporté contiendra vos clés API et vos en-têtes personnalisés en clair. Utilisez-le uniquement pour un transfert entre vos propres appareils de confiance. Ne partagez ni ne téléversez jamais ce fichier.`)
};

const de_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Die exportierte JSON-Datei enthält Ihre API-Schlüssel und benutzerdefinierten Header im Klartext. Verwenden Sie sie nur zur Übertragung zwischen Ihren eigenen vertrauenswürdigen Geräten. Teilen Sie die Datei nicht und laden Sie sie nicht hoch.`)
};

const es_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`El archivo JSON exportado contendrá tus claves API y cabeceras personalizadas en texto sin cifrar. Úsalo solo para transferir ajustes entre tus propios dispositivos de confianza. Nunca compartas ni subas el archivo.`)
};

const ru_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Экспортируемый файл JSON будет содержать ключи API и пользовательские заголовки в открытом виде. Используйте его только для переноса между собственными доверенными устройствами. Не передавайте и не загружайте этот файл.`)
};

const pt_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`O arquivo JSON exportado conterá suas chaves de API e cabeçalhos personalizados em texto simples. Use-o apenas para transferir configurações entre seus próprios dispositivos confiáveis. Nunca compartilhe nem envie o arquivo.`)
};

const it_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Il file JSON esportato conterrà le chiavi API e le intestazioni personalizzate in chiaro. Usalo solo per trasferire le impostazioni tra i tuoi dispositivi attendibili. Non condividere né caricare il file.`)
};

const ar_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سيحتوي ملف JSON المُصدَّر على مفاتيح API والترويسات المخصصة كنص صريح. استخدمه فقط للنقل بين أجهزتك الموثوقة، ولا تشارك الملف أو ترفعه مطلقًا.`)
};

/**
* | output |
* | --- |
* | "The exported JSON file will contain your API keys and custom headers in plain text. Use this only to move between your own trusted devices — never share or u..." |
*
* @param {Backup_Export_Keys_Confirm_TextInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const backup_export_keys_confirm_text = /** @type {((inputs?: Backup_Export_Keys_Confirm_TextInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Backup_Export_Keys_Confirm_TextInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_backup_export_keys_confirm_text(inputs)
	if (locale === "zh-TW") return zh_tw2_backup_export_keys_confirm_text(inputs)
	if (locale === "en") return en_backup_export_keys_confirm_text(inputs)
	if (locale === "ja") return ja_backup_export_keys_confirm_text(inputs)
	if (locale === "ko") return ko_backup_export_keys_confirm_text(inputs)
	if (locale === "fr") return fr_backup_export_keys_confirm_text(inputs)
	if (locale === "de") return de_backup_export_keys_confirm_text(inputs)
	if (locale === "es") return es_backup_export_keys_confirm_text(inputs)
	if (locale === "ru") return ru_backup_export_keys_confirm_text(inputs)
	if (locale === "pt") return pt_backup_export_keys_confirm_text(inputs)
	if (locale === "it") return it_backup_export_keys_confirm_text(inputs)
	return ar_backup_export_keys_confirm_text(inputs)
});