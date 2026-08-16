export interface ReadinessControl {
	id: string;
	code: string;
	title: string;
	category: string;
}

export function calculateReadiness(
	controls: ReadinessControl[],
	coveredControlIds: ReadonlySet<string>
) {
	const completedControls = controls.filter((control) => coveredControlIds.has(control.id));
	const blockers = controls.filter((control) => !coveredControlIds.has(control.id));

	return {
		score: controls.length ? Math.round((completedControls.length / controls.length) * 100) : 0,
		totalControls: controls.length,
		completedControls: completedControls.length,
		blockers
	};
}
