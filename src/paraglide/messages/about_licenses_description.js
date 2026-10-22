/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} About_Licenses_DescriptionInputs */

const zh_about_licenses_description = /** @type {(inputs: About_Licenses_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`项目基础框架与运行时依赖（含间接依赖，部分可能在打包时被移除）。展开条目可查看随包提供的许可证与声明。`)
};

const zh_tw2_about_licenses_description = /** @type {(inputs: About_Licenses_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`專案基礎框架與執行階段相依套件（含間接相依，部分可能在打包時被移除）。展開項目可查看隨附的授權與聲明。`)
};

const en_about_licenses_description = /** @type {(inputs: About_Licenses_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Project framework and runtime dependencies (including transitive dependencies); some may be removed by bundling. Expand an entry to read its bundled license and notices.`)
};

const ja_about_licenses_description = /** @type {(inputs: About_Licenses_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`プロジェクトの基盤フレームワークと実行時の依存パッケージ（間接依存を含む。一部はビルド時に除外される場合があります）。各項目を展開すると、同梱のライセンスと通知を確認できます。`)
};

const ko_about_licenses_description = /** @type {(inputs: About_Licenses_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`프로젝트 기반 프레임워크 및 런타임 의존성 목록입니다(간접 의존성 포함, 일부는 빌드 시 제외될 수 있음). 항목을 펼치면 포함된 라이선스와 고지를 볼 수 있습니다.`)
};

const fr_about_licenses_description = /** @type {(inputs: About_Licenses_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Framework du projet et dépendances d’exécution, y compris les dépendances indirectes ; certaines peuvent être exclues lors de la compilation. Développez une entrée pour lire sa licence et ses mentions incluses.`)
};

const de_about_licenses_description = /** @type {(inputs: About_Licenses_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Projekt-Framework und Laufzeitabhängigkeiten einschließlich indirekter Abhängigkeiten; einige können beim Erstellen entfernt werden. Klappen Sie einen Eintrag auf, um die mitgelieferte Lizenz und Hinweise zu lesen.`)
};

const es_about_licenses_description = /** @type {(inputs: About_Licenses_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Framework del proyecto y dependencias de ejecución, incluidas las indirectas; algunas pueden eliminarse durante la compilación. Despliegue una entrada para leer su licencia y los avisos incluidos.`)
};

const ru_about_licenses_description = /** @type {(inputs: About_Licenses_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Фреймворк проекта и зависимости приложения, включая косвенные; некоторые могут быть исключены при сборке. Разверните запись, чтобы прочитать прилагаемую лицензию и уведомления.`)
};

const pt_about_licenses_description = /** @type {(inputs: About_Licenses_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Framework do projeto e dependências de execução, incluindo dependências indiretas; algumas podem ser removidas durante a compilação. Expanda uma entrada para ler a licença e os avisos incluídos.`)
};

const it_about_licenses_description = /** @type {(inputs: About_Licenses_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Framework del progetto e dipendenze di esecuzione, incluse quelle indirette; alcune possono essere eliminate durante la compilazione. Espandi una voce per leggere la licenza e gli avvisi inclusi.`)
};

const ar_about_licenses_description = /** @type {(inputs: About_Licenses_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إطار عمل المشروع واعتماديات التشغيل، بما فيها الاعتماديات غير المباشرة؛ قد يُستبعد بعضها أثناء البناء. وسّع أي عنصر لقراءة الترخيص والإشعارات المرفقة به.`)
};

/**
* | output |
* | --- |
* | "Project framework and runtime dependencies (including transitive dependencies); some may be removed by bundling. Expand an entry to read its bundled license ..." |
*
* @param {About_Licenses_DescriptionInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const about_licenses_description = /** @type {((inputs?: About_Licenses_DescriptionInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<About_Licenses_DescriptionInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_about_licenses_description(inputs)
	if (locale === "zh-TW") return zh_tw2_about_licenses_description(inputs)
	if (locale === "en") return en_about_licenses_description(inputs)
	if (locale === "ja") return ja_about_licenses_description(inputs)
	if (locale === "ko") return ko_about_licenses_description(inputs)
	if (locale === "fr") return fr_about_licenses_description(inputs)
	if (locale === "de") return de_about_licenses_description(inputs)
	if (locale === "es") return es_about_licenses_description(inputs)
	if (locale === "ru") return ru_about_licenses_description(inputs)
	if (locale === "pt") return pt_about_licenses_description(inputs)
	if (locale === "it") return it_about_licenses_description(inputs)
	return ar_about_licenses_description(inputs)
});