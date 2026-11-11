/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_SourceInputs */

const zh_video_subtitles_source = /** @type {(inputs: Video_Subtitles_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`跟随播放器选中的字幕轨道，未选择时使用默认轨道。当前字幕降级模式只翻译正在显示的字幕。`)
};

const zh_tw2_video_subtitles_source = /** @type {(inputs: Video_Subtitles_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`跟隨播放器選取的字幕軌道，未選取時使用預設軌道。目前字幕備援模式只翻譯正在顯示的字幕。`)
};

const en_video_subtitles_source = /** @type {(inputs: Video_Subtitles_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Follows the selected player subtitle track, or its default track. Current-caption fallback translates only the visible caption.`)
};

const ja_video_subtitles_source = /** @type {(inputs: Video_Subtitles_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`プレーヤーで選択した字幕トラック、または既定のトラックに従います。代替モードでは表示中の字幕のみ翻訳します。`)
};

const ko_video_subtitles_source = /** @type {(inputs: Video_Subtitles_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`플레이어에서 선택한 자막 트랙 또는 기본 트랙을 따릅니다. 대체 모드에서는 현재 표시된 자막만 번역합니다.`)
};

const fr_video_subtitles_source = /** @type {(inputs: Video_Subtitles_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suit la piste sélectionnée dans le lecteur ou sa piste par défaut. Le mode de secours traduit uniquement le sous-titre visible.`)
};

const de_video_subtitles_source = /** @type {(inputs: Video_Subtitles_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Folgt der ausgewählten Untertitelspur oder der Standardspur des Players. Im Ersatzmodus wird nur der sichtbare Untertitel übersetzt.`)
};

const es_video_subtitles_source = /** @type {(inputs: Video_Subtitles_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sigue la pista seleccionada en el reproductor o la predeterminada. El modo alternativo solo traduce el subtítulo visible.`)
};

const ru_video_subtitles_source = /** @type {(inputs: Video_Subtitles_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Используется выбранная в плеере дорожка или дорожка по умолчанию. Запасной режим переводит только видимые субтитры.`)
};

const pt_video_subtitles_source = /** @type {(inputs: Video_Subtitles_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Segue a faixa selecionada no leitor ou a predefinida. O modo alternativo traduz apenas a legenda visível.`)
};

const it_video_subtitles_source = /** @type {(inputs: Video_Subtitles_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Segue la traccia selezionata nel lettore o quella predefinita. La modalità alternativa traduce solo il sottotitolo visibile.`)
};

const ar_video_subtitles_source = /** @type {(inputs: Video_Subtitles_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يتبع مسار الترجمة المحدد في المشغل أو المسار الافتراضي. يترجم الوضع البديل النص الظاهر فقط.`)
};

/**
* | output |
* | --- |
* | "Follows the selected player subtitle track, or its default track. Current-caption fallback translates only the visible caption." |
*
* @param {Video_Subtitles_SourceInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_source = /** @type {((inputs?: Video_Subtitles_SourceInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_SourceInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_source(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_source(inputs)
	if (locale === "en") return en_video_subtitles_source(inputs)
	if (locale === "ja") return ja_video_subtitles_source(inputs)
	if (locale === "ko") return ko_video_subtitles_source(inputs)
	if (locale === "fr") return fr_video_subtitles_source(inputs)
	if (locale === "de") return de_video_subtitles_source(inputs)
	if (locale === "es") return es_video_subtitles_source(inputs)
	if (locale === "ru") return ru_video_subtitles_source(inputs)
	if (locale === "pt") return pt_video_subtitles_source(inputs)
	if (locale === "it") return it_video_subtitles_source(inputs)
	return ar_video_subtitles_source(inputs)
});