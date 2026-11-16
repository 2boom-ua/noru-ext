const RULESET_ID = 'ruleset_1';
const STORAGE_KEY_ENABLED = 'enabled';
const STORAGE_KEY_RULES = 'dynamicRules';
const RULES_URL = 'https://raw.githubusercontent.com/2boom-ua/noru-ext/main/rules.json';

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

// Helper to check if extension is enabled (default true)
async function getEnabled() {
	const data = await chrome.storage.local.get(STORAGE_KEY_ENABLED);
	return data[STORAGE_KEY_ENABLED] !== false;
}

// Helper to set icon and title
async function applyUI(enabled) {
	await chrome.action.setIcon({ path: enabled ? ICONS_ON : ICONS_OFF });
	await chrome.action.setTitle({ title: enabled ? 'Noru: enabled' : 'Noru: disabled' });
}

// Helper to apply rules (static or dynamic)
async function applyRules(enabled) {
	if (!enabled) {
		await chrome.declarativeNetRequest.updateEnabledRulesets({ disableRulesetIds: [RULESET_ID] });
		await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: await getDynamicRuleIds() });
		return;
	}

	const data = await chrome.storage.local.get(STORAGE_KEY_RULES);
	const dynamicRules = data[STORAGE_KEY_RULES];

	if (dynamicRules && dynamicRules.length > 0) {
		// Apply dynamic rules
		const existingIds = await getDynamicRuleIds();
		await chrome.declarativeNetRequest.updateDynamicRules({
			removeRuleIds: existingIds,
			addRules: dynamicRules.map(r => ({ ...r, id: r.id + 10000 })) // Shift IDs to avoid conflicts
		});
		await chrome.declarativeNetRequest.updateEnabledRulesets({ disableRulesetIds: [RULESET_ID] });
	} else {
		// Fallback to static rules
		await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: await getDynamicRuleIds() });
		await chrome.declarativeNetRequest.updateEnabledRulesets({ enableRulesetIds: [RULESET_ID] });
	}
}

// Helper to get current dynamic rule IDs
async function getDynamicRuleIds() {
	const rules = await chrome.declarativeNetRequest.getDynamicRules();
	return rules.map(r => r.id);
}

// Fetch and update rules from GitHub
async function fetchRules() {
	try {
		const response = await fetch(RULES_URL);
		if (!response.ok) throw new Error('Network response was not ok');
		const rules = await response.json();
		if (!Array.isArray(rules) || rules.length === 0) throw new Error('Invalid rules format');
		
		await chrome.storage.local.set({ [STORAGE_KEY_RULES]: rules });
		console.log('Rules updated from GitHub');
	} catch (error) {
		console.warn('Failed to fetch rules, using cached or static rules:', error);
	}
}

// Main initialization
async function init() {
	// 1. Fetch rules from GitHub (always on startup)
	await fetchRules();
	
	// 2. Get current state
	const enabled = await getEnabled();
	
	// 3. Apply UI
	await applyUI(enabled);
	
	// 4. Apply rules
	await applyRules(enabled);
}

// Event listeners
chrome.runtime.onInstalled.addListener(init);
chrome.runtime.onStartup.addListener(init);

chrome.action.onClicked.addListener(async () => {
	const current = await getEnabled();
	const next = !current;
	await chrome.storage.local.set({ [STORAGE_KEY_ENABLED]: next });
	await applyUI(next);
	await applyRules(next);
});