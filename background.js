const RULESET_ID = 'ruleset_1';
const STORAGE_KEY = 'enabled';

const ICONS_ON = {
	16: 'icons/icon16.png',
	32: 'icons/icon32.png',
	48: 'icons/icon48.png',
	128: 'icons/icon128.png'
};

const ICONS_OFF = {
	16: 'icons/icon16-off.png',
	32: 'icons/icon32-off.png',
	48: 'icons/icon48-off.png',
	128: 'icons/icon128-off.png'
};

async function applyState(enabled) {
	await chrome.action.setIcon({ path: enabled ? ICONS_ON : ICONS_OFF });
	await chrome.action.setTitle({ title: enabled ? 'Noru: enabled' : 'Noru: disabled' });

	if (enabled) {
		await chrome.declarativeNetRequest.updateEnabledRulesets({
			enableRulesetIds: [RULESET_ID]
		});
	} else {
		await chrome.declarativeNetRequest.updateEnabledRulesets({
			disableRulesetIds: [RULESET_ID]
		});
	}
}

async function getEnabled() {
	const data = await chrome.storage.local.get(STORAGE_KEY);
	return data[STORAGE_KEY] !== false;
}

chrome.runtime.onInstalled.addListener(async () => {
	const enabled = await getEnabled();
	await applyState(enabled);
});

chrome.runtime.onStartup.addListener(async () => {
	const enabled = await getEnabled();
	await applyState(enabled);
});

chrome.action.onClicked.addListener(async () => {
	const current = await getEnabled();
	const next = !current;
	await chrome.storage.local.set({ [STORAGE_KEY]: next });
	await applyState(next);
});