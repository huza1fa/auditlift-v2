type ThemePreference = 'light' | 'dark' | 'system';

function createTheme() {
	let preference = $state<ThemePreference>('system');
	let resolved = $state<'light' | 'dark'>('light');
	let initialized = false;

	function apply(theme: 'light' | 'dark') {
		resolved = theme;
		document.documentElement.setAttribute('data-theme', theme);
	}

	function set(pref: ThemePreference) {
		preference = pref;
		if (pref === 'system') {
			localStorage.removeItem('auditlift-theme');
			const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			document.documentElement.removeAttribute('data-theme');
			resolved = dark ? 'dark' : 'light';
		} else {
			localStorage.setItem('auditlift-theme', pref);
			apply(pref);
		}
	}

	function toggle() {
		set(resolved === 'dark' ? 'light' : 'dark');
	}

	function init() {
		if (initialized) return;
		initialized = true;

		const stored = localStorage.getItem('auditlift-theme') as ThemePreference | null;
		if (stored === 'light' || stored === 'dark') {
			preference = stored;
			apply(stored);
		} else {
			preference = 'system';
			const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			document.documentElement.removeAttribute('data-theme');
			resolved = dark ? 'dark' : 'light';
		}

		// Watch system preference changes
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
			if (preference === 'system') {
				resolved = e.matches ? 'dark' : 'light';
			}
		});
	}

	return {
		get preference() {
			return preference;
		},
		get resolved() {
			return resolved;
		},
		get isDark() {
			return resolved === 'dark';
		},
		set,
		toggle,
		init
	};
}

export const theme = createTheme();
