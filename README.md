<div align="center">  
    <img src="https://github.com/2boom-ua/noru-ext/blob/main/icons/icon128.png?raw=true" alt="" width="128" height="128">
</div>


# Noru Extension

![Version](https://img.shields.io/badge/version-1.1-green.svg)

Browser extension that adds search filters to Google and Bing.

## What it does

When you open `google.com/search?...` or `bing.com/search?...` manually, the extension redirects the request to a filtered version:

- Google: adds `-site:ru -site:su -site:xn--p1ai` and `lr=lang_uk`
- Bing: adds `-site:ru -site:su -site:xn--p1ai` and `setlang=uk`

Works independently of the default search engine set in the browser. Requests that already contain the filters are not modified again.

### From Chrome Web Store or Edge Add-ons
[![Available in Microsoft Edge Add-ons](https://img.shields.io/badge/Microsoft%20Edge%20Add--ons-Install-0078D7?logo=microsoftedge&logoColor=white)](https://microsoftedge.microsoft.com/addons/detail/noru/nfjniggmgbjfnhnjbolembjpdpjgnhno)

## Install (unpacked)

1. Open `chrome://extensions` or `edge://extensions`.
2. Enable "Developer mode".
3. Click "Load unpacked" and select the `noru-extension` folder.

## Files

- `manifest.json` — extension manifest (MV3).
- `rules.json` — declarativeNetRequest rules.
- `icons/icon128.png` — icon.

## Limitations

- Only matches `www.google.com`, `google.com`, `www.google.com.ua`, `google.com.ua`, `www.bing.com`, `bing.com`.
- Does not affect the browser's default search engine or the address bar search.
- `lang:uk` is not used for Bing (it breaks the query); `setlang=uk` is used instead.

## License

Copyright © 2boom, 2026.
