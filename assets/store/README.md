# Browser store assets

Use `chrome/` as the shared baseline. Other browser directories contain only overrides; do not duplicate shared files. Keep the same locale directories and filenames when adding an override.

| Browser | Directory                       | Contents                                                                                              |
| ------- | ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Chrome  | [chrome/](./chrome/README.md)   | Shared screenshots, promotional images, listing copy, provenance and source artwork in four languages |
| Firefox | [firefox/](./firefox/README.md) | AMO review notes and Firefox overrides                                                                |
| Edge    | [edge/](./edge/README.md)       | Edge Add-ons overrides                                                                                |
| Safari  | [safari/](./safari/README.md)   | App Store overrides                                                                                   |

## Selecting files

1. Check the target browser's directory first. If the same relative path exists there, use that file.
2. Otherwise, use the file from `chrome/`. For example, prefer `firefox/global/listing.txt` for Firefox's English description; fall back to `chrome/global/listing.txt` when no override exists.
3. Select only files required by the target store. Chrome promotional image dimensions and upload fields do not automatically apply to other stores.
4. Shared images retain the provenance recorded in the Chrome directory. Record new browser-specific captures in their own directory without rewriting the original records.

Firefox, Edge and Safari currently have no image or listing-copy overrides. Their directories document browser-specific details; Firefox also contains review notes.

`pnpm store:check` validates the Chrome baseline. Existing asset generators write to `assets/store/chrome/`; the website and project READMEs reference those screenshots. The override rules above guide upload preparation; the generators do not automatically merge other browser directories.

Extension submission ZIPs are managed separately from store images. Build archives remain in the Git-ignored `.output/` directory.
