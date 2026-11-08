# Noru Extension

Browser extension that adds search filters to Google and Bing.

## What it does

When you open `google.com/search?...` or `bing.com/search?...` manually, the extension redirects the request to a filtered version:

- Google: adds `-site:ru -site:su -site:xn--p1ai` and `lr=lang_uk`
- Bing: adds `-site:ru -site:su -site:xn--p1ai` and `setlang=uk`

Works independently of the default search engine set in the browser. Requests that already contain the filters are not modified again.

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