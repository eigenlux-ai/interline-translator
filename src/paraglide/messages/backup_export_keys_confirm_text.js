/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Backup_Export_Keys_Confirm_TextInputs */

const zh_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`导出的 JSON 文件将包含 API Key 明文。仅用于在自己可信的设备之间迁移，请勿分享或上传该文件。`)
};

const zh_tw2_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`匯出的 JSON 檔案將包含 API 金鑰明文。僅用於在自己信任的裝置間遷移，請勿分享或上傳該檔案。`)
};

const en_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The exported JSON file will contain your API keys in plain text. Use this only to move between your own trusted devices — never share or upload the file.`)
};

const ja_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`書き出した JSON ファイルには API キーが平文で含まれます。自分の信頼できる端末間の移行にのみ使用し、ファイルを共有・アップロードしないでください。`)
};

const ko_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`내보낸 JSON 파일에 API 키가 평문으로 포함됩니다. 신뢰할 수 있는 내 기기 간 이동에만 사용하고 파일을 공유하거나 업로드하지 마세요.`)
};

const fr_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le fichier JSON exporté contiendra vos clés API en clair. Utilisez-le uniquement pour migrer entre vos propres appareils de confiance — ne partagez ni ne téléversez jamais ce fichier.`)
};

const de_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Die exportierte JSON-Datei enthält Ihre API-Schlüssel im Klartext. Verwenden Sie sie nur für den Umstieg zwischen Ihren eigenen vertrauenswürdigen Geräten — teilen oder laden Sie die Datei niemals hoch.`)
};

const es_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`El archivo JSON exportado contendrá tus claves API en texto plano. Úsalo solo para migrar entre tus propios dispositivos de confianza; nunca compartas ni subas el archivo.`)
};

const ru_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Экспортированный файл JSON будет содержать ваши API-ключи в открытом виде. Используйте его только для переноса между своими доверенными устройствами — не передавайте и не загружайте файл.`)
};

const pt_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`O arquivo JSON exportado conterá suas chaves de API em texto simples. Use-o apenas para migrar entre seus próprios dispositivos confiáveis; nunca compartilhe nem envie o arquivo.`)
};

const it_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Il file JSON esportato conterrà le chiavi API in chiaro. Usalo solo per migrare tra i tuoi dispositivi fidati: non condividere né caricare mai il file.`)
};

const ar_backup_export_keys_confirm_text = /** @type {(inputs: Backup_Export_Keys_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سيحتوي ملف JSON المصدَّر على مفاتيح API نصًا صريحًا. استخدمه فقط للانتقال بين أجهزتك الموثوقة، ولا تشارك الملف أو ترفعه أبدًا.`)
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