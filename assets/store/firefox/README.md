# Firefox store overrides

Reuse the [Chrome baseline](../chrome/README.md) for images and listing copy. Keep only Firefox-specific files here, following the [override rules](../README.md).

- [REVIEW.md](./REVIEW.md): AMO submission archives, reproducible source builds, permissions and data handling. Included in the Firefox source archive.
- Add-on ID: `interline@eigenlux.com`. Submit it as a new AMO listing.
- No image or listing-copy overrides exist yet. Shared screenshots show the Chrome build running in Ego Lite; see [capture-manifest.json](../chrome/capture-manifest.json) for provenance.

Organize future overrides under `global/`, `zh_CN/`, `ja/` and `ko/`, keeping baseline filenames. For example, `global/listing.txt` overrides only Firefox's English description.
