export function fetchSettingsReceived(settings) {
	return {
		type: 'FETCH_SETTINGS_RECEIVED',
		payload: settings
	}
}