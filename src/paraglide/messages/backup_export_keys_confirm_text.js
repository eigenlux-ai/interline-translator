/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Backup_Export_Keys_Confirm_TextInputs */

const zh_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`导出的 JSON 文件将以明文包含 API 密钥。仅用于在自己信任的设备之间迁移，请勿分享或上传该文件。`)
};

const zh_tw2_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`匯出的 JSON 檔案將以明文包含 API 金鑰。僅用於在自己信任的裝置之間遷移，請勿分享或上傳該檔案。`)
};

const en_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The exported JSON file will contain your API keys in plain text. Use this only to move between your own trusted devices — never share or upload the file.`)
};

const ja_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`書き出した JSON ファイルには API キーが平文で含まれます。自分の信頼できる端末間の移行にのみ使用し、ファイルを共有・アップロードしないでください。`)
};

const ko_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`내보낸 JSON 파일에 API 키가 평문으로 포함됩니다. 본인이 신뢰하는 기기 간 이전에만 사용하고, 파일을 공유하거나 업로드하지 마세요.`)
};

const fr_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le fichier JSON exporté contiendra vos clés API en clair. Utilisez-le uniquement pour passer d’un de vos appareils de confiance à un autre — ne partagez jamais ce fichier et ne le mettez jamais en ligne.`)
};

const de_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Die exportierte JSON-Datei enthält Ihre API-Schlüssel im Klartext. Verwenden Sie sie nur, um Einstellungen zwischen Ihren eigenen vertrauenswürdigen Geräten zu übertragen — teilen Sie die Datei niemals und laden Sie sie nirgendwo hoch.`)
};

const es_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`El archivo JSON exportado contendrá tus claves API en texto plano. Úsalo solo para migrar entre tus propios dispositivos de confianza; nunca compartas ni subas el archivo.`)
};

const ru_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Экспортированный файл JSON будет содержать ваши API-ключи в открытом виде. Используйте его только для переноса настроек между своими доверенными устройствами — никому не передавайте файл и не выкладывайте его в сеть.`)
};

const pt_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`O arquivo JSON exportado conterá suas chaves de API em texto simples. Use-o apenas para migrar entre seus próprios dispositivos confiáveis; nunca compartilhe o arquivo nem faça upload dele.`)
};

const it_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Il file JSON esportato conterrà le chiavi API in chiaro. Usalo solo per migrare tra i tuoi dispositivi fidati: non condividere né caricare mai il file.`)
};

const ar_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سيحتوي ملف JSON المُصدَّر على مفاتيح API بنص غير مشفّر. استخدمه فقط لنقل الإعدادات بين أجهزتك الموثوقة، ولا تشارك الملف أو ترفعه إلى أي مكان أبدًا.`)
};

/**
* | output |
* | --- |
* | "The exported JSON file will contain your API keys in plain text. Use this only to move between your own trusted devices — never share or upload the file." |
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