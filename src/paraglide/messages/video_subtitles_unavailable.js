/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_UnavailableInputs */

const zh_video_subtitles_unavailable = /** @type {(inputs: Video_Subtitles_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`所选服务不可用，请在设置中选择已启用的服务。`)
};

const zh_tw2_video_subtitles_unavailable = /** @type {(inputs: Video_Subtitles_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`所選服務無法使用，請在設定中選擇已啟用的服務。`)
};

const en_video_subtitles_unavailable = /** @type {(inputs: Video_Subtitles_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Selected service is unavailable. Choose an enabled service in settings.`)
};

const ja_video_subtitles_unavailable = /** @type {(inputs: Video_Subtitles_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`選択したサービスは利用できません。設定で有効なサービスを選んでください。`)
};

const ko_video_subtitles_unavailable = /** @type {(inputs: Video_Subtitles_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`선택한 서비스를 사용할 수 없습니다. 설정에서 활성화된 서비스를 선택하세요.`)
};

const fr_video_subtitles_unavailable = /** @type {(inputs: Video_Subtitles_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le service sélectionné est indisponible. Choisissez un service activé dans les réglages.`)
};

const de_video_subtitles_unavailable = /** @type {(inputs: Video_Subtitles_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Der gewählte Dienst ist nicht verfügbar. Wählen Sie einen aktivierten Dienst in den Einstellungen.`)
};

const es_video_subtitles_unavailable = /** @type {(inputs: Video_Subtitles_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`El servicio elegido no está disponible. Selecciona un servicio activo en los ajustes.`)
};

const ru_video_subtitles_unavailable = /** @type {(inputs: Video_Subtitles_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Выбранный сервис недоступен. Выберите включённый сервис в настройках.`)
};

const pt_video_subtitles_unavailable = /** @type {(inputs: Video_Subtitles_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`O serviço selecionado não está disponível. Escolha um serviço ativo nas definições.`)
};

const it_video_subtitles_unavailable = /** @type {(inputs: Video_Subtitles_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Il servizio selezionato non è disponibile. Scegli un servizio attivo nelle impostazioni.`)
};

const ar_video_subtitles_unavailable = /** @type {(inputs: Video_Subtitles_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الخدمة المحددة غير متاحة. اختر خدمة مفعلة في الإعدادات.`)
};

/**
* | output |
* | --- |
* | "Selected service is unavailable. Choose an enabled service in settings." |
*
* @param {Video_Subtitles_UnavailableInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_unavailable = /** @type {((inputs?: Video_Subtitles_UnavailableInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_UnavailableInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_unavailable(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_unavailable(inputs)
	if (locale === "en") return en_video_subtitles_unavailable(inputs)
	if (locale === "ja") return ja_video_subtitles_unavailable(inputs)
	if (locale === "ko") return ko_video_subtitles_unavailable(inputs)
	if (locale === "fr") return fr_video_subtitles_unavailable(inputs)
	if (locale === "de") return de_video_subtitles_unavailable(inputs)
	if (locale === "es") return es_video_subtitles_unavailable(inputs)
	if (locale === "ru") return ru_video_subtitles_unavailable(inputs)
	if (locale === "pt") return pt_video_subtitles_unavailable(inputs)
	if (locale === "it") return it_video_subtitles_unavailable(inputs)
	return ar_video_subtitles_unavailable(inputs)
});