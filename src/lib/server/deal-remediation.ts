export type RemediationActionType =
	| 'answer_now'
	| 'confirm_fact'
	| 'generate_policy'
	| 'upload_evidence';

export interface RemediationQuestion {
	id: string;
	order: number;
	questionText: string;
	domain: string | null;
	confidence: string | null;
	gapReason: string | null;
	gapRemediation: string | null;
	generatedAnswer: string | null;
	userEditedAnswer: string | null;
	mappedControlIds: string[] | null;
	mappedPolicyIds: string[] | null;
}

export interface RemediationControl {
	id: string;
	code: string;
	title: string;
	category: string;
}

export interface RemediationAction {
	id: string;
	type: RemediationActionType;
	priority: number;
	title: string;
	reason: string;
	questionIds: string[];
	questionCount: number;
	controlImpact: RemediationControl[];
	proposedPolicyType?: string;
}

export interface RemediationPlan {
	actions: RemediationAction[];
	counts: {
		totalActions: number;
		affectedQuestions: number;
		byType: Record<RemediationActionType, { actions: number; questions: number }>;
	};
	controlImpact: {
		controlsAffected: number;
		controlsWithExistingPolicy: number;
		controlsWithEvidence: number;
	};
}

interface BuildRemediationPlanInput {
	questions: RemediationQuestion[];
	controls: RemediationControl[];
	existingPolicyIds: Set<string>;
	controlIdsWithPolicy: Set<string>;
	controlIdsWithEvidence: Set<string>;
}

interface CandidateAction {
	type: RemediationActionType;
	key: string;
	question: RemediationQuestion;
	controls: RemediationControl[];
	policyType?: string;
}

const ACTION_ORDER: Record<RemediationActionType, number> = {
	generate_policy: 1,
	upload_evidence: 2,
	confirm_fact: 3,
	answer_now: 4
};

const DOMAIN_POLICY_TYPES: Record<string, string> = {
	access_control: 'access-control-policy',
	data_security: 'data-classification-policy',
	incident_response: 'incident-response-policy',
	vendor_management: 'vendor-management-policy',
	business_continuity: 'business-continuity-policy',
	cryptography: 'cryptography-policy',
	physical_security: 'physical-security-policy',
	vulnerability_management: 'vulnerability-management-policy',
	change_management: 'change-management-policy',
	privacy: 'privacy-policy',
	remote_work: 'remote-work-policy',
	ai_usage: 'ai-usage-policy',
	data_retention: 'data-retention-policy'
};

const POLICY_TITLES: Record<string, string> = {
	'security-policy': 'Security Policy',
	'access-control-policy': 'Access Control Policy',
	'incident-response-policy': 'Incident Response Policy',
	'change-management-policy': 'Change Management Policy',
	'vulnerability-management-policy': 'Vulnerability Management Policy',
	'data-classification-policy': 'Data Classification Policy',
	'business-continuity-policy': 'Business Continuity Policy',
	'vendor-management-policy': 'Vendor Management Policy',
	'cryptography-policy': 'Cryptography Policy',
	'physical-security-policy': 'Physical Security Policy',
	'privacy-policy': 'Privacy Policy',
	'remote-work-policy': 'Remote Work Policy',
	'ai-usage-policy': 'AI Usage Policy',
	'data-retention-policy': 'Data Retention Policy'
};

function isNonQuestion(question: RemediationQuestion): boolean {
	return question.gapReason?.toLowerCase().includes('not a question') ?? false;
}

/** A failed AI request is retryable product work, not a company-readiness gap. */
export function isProcessingFailure(question: RemediationQuestion): boolean {
	return question.gapReason?.toLowerCase().includes('processing failed') ?? false;
}

export function isFounderInterviewCandidate(question: RemediationQuestion): boolean {
	return (
		!isNonQuestion(question) &&
		!question.userEditedAnswer &&
		(question.confidence === 'gap' || question.confidence === 'low')
	);
}

function suggestedPolicyType(question: RemediationQuestion): string {
	const text = `${question.questionText} ${question.gapRemediation ?? ''}`.toLowerCase();
	if (text.includes('password')) return 'password-policy';
	if (text.includes('acceptable use')) return 'acceptable-use-policy';
	if (text.includes('retention')) return 'data-retention-policy';
	if (text.includes('classification')) return 'data-classification-policy';
	return DOMAIN_POLICY_TYPES[question.domain ?? ''] ?? 'security-policy';
}

function needsEvidence(question: RemediationQuestion): boolean {
	const text = `${question.questionText} ${question.gapRemediation ?? ''}`.toLowerCase();
	return /\bevidence\b|\bupload\b|\bscreenshot\b|\blog(?:s)?\b|\breport\b|\bcertificate\b|\battestation\b|\bdocumentation\b/.test(
		text
	);
}

function needsPolicy(question: RemediationQuestion): boolean {
	const text = `${question.questionText} ${question.gapRemediation ?? ''}`.toLowerCase();
	return /\bpolicy\b|\bprocedure\b|\bstandard\b|\bprocess\b/.test(text);
}

function groupKey(
	type: RemediationActionType,
	question: RemediationQuestion,
	policyType?: string
): string {
	if (type === 'generate_policy') return `${type}:${policyType}`;
	if (type === 'confirm_fact') return `${type}:${question.domain ?? 'general'}`;
	if (type === 'upload_evidence') {
		return `${type}:${[...(question.mappedControlIds ?? [])].sort().join(',') || question.id}`;
	}
	return `${type}:${question.id}`;
}

function buildCandidate(
	question: RemediationQuestion,
	controls: RemediationControl[],
	existingPolicyIds: Set<string>,
	controlIdsWithPolicy: Set<string>,
	controlIdsWithEvidence: Set<string>
): CandidateAction | null {
	if (
		isNonQuestion(question) ||
		isProcessingFailure(question) ||
		question.userEditedAnswer ||
		question.confidence === 'high'
	)
		return null;

	const mappedControlIds = question.mappedControlIds ?? [];
	const hasMappedPolicy = (question.mappedPolicyIds ?? []).some((id) => existingPolicyIds.has(id));
	const hasPolicyForEveryControl =
		mappedControlIds.length > 0 && mappedControlIds.every((id) => controlIdsWithPolicy.has(id));
	const hasEvidenceForEveryControl =
		mappedControlIds.length > 0 && mappedControlIds.every((id) => controlIdsWithEvidence.has(id));

	let type: RemediationActionType;
	let policyType: string | undefined;
	if (question.confidence === 'medium') {
		type = question.generatedAnswer ? 'answer_now' : 'confirm_fact';
	} else if (question.confidence === 'low') {
		type = 'confirm_fact';
	} else if (question.confidence === 'gap') {
		if (needsEvidence(question)) {
			type = hasEvidenceForEveryControl ? 'confirm_fact' : 'upload_evidence';
		} else if (
			(needsPolicy(question) || (mappedControlIds.length > 0 && !hasPolicyForEveryControl)) &&
			!hasMappedPolicy
		) {
			type = 'generate_policy';
			policyType = suggestedPolicyType(question);
		} else {
			type = 'confirm_fact';
		}
	} else {
		return null;
	}

	return {
		type,
		key: groupKey(type, question, policyType),
		question,
		controls,
		policyType
	};
}

function actionCopy(
	type: RemediationActionType,
	policyType?: string
): Pick<RemediationAction, 'title' | 'reason'> {
	switch (type) {
		case 'answer_now':
			return { title: 'Review draft answer', reason: 'A policy-backed draft is ready for review.' };
		case 'confirm_fact':
			return {
				title: 'Confirm organization facts',
				reason: 'This answer needs a founder-confirmed organization fact before it can be sent.'
			};
		case 'generate_policy':
			return {
				title: `Generate ${POLICY_TITLES[policyType ?? 'security-policy'] ?? 'Security Policy'}`,
				reason: 'A supporting policy is missing for this control area.'
			};
		case 'upload_evidence':
			return {
				title: 'Upload supporting evidence',
				reason: 'This question calls for documentation or other verifiable evidence.'
			};
	}
}

/** Builds a deterministic plan from tenant-scoped records; it performs no database or AI work. */
export function buildRemediationPlan(input: BuildRemediationPlanInput): RemediationPlan {
	const controlsById = new Map(input.controls.map((control) => [control.id, control]));
	const candidates = input.questions
		.map((question) => {
			const mappedControls = (question.mappedControlIds ?? [])
				.map((id) => controlsById.get(id))
				.filter((control): control is RemediationControl => Boolean(control));
			return buildCandidate(
				question,
				mappedControls,
				input.existingPolicyIds,
				input.controlIdsWithPolicy,
				input.controlIdsWithEvidence
			);
		})
		.filter((candidate): candidate is CandidateAction => Boolean(candidate));

	const groups = new Map<string, CandidateAction[]>();
	for (const candidate of candidates) {
		groups.set(candidate.key, [...(groups.get(candidate.key) ?? []), candidate]);
	}

	const actions = [...groups.values()]
		.map((group) => {
			const first = group[0];
			const controls = [
				...new Map(group.flatMap((candidate) => candidate.controls).map((c) => [c.id, c])).values()
			].sort((a, b) => a.code.localeCompare(b.code));
			const questionIds = group
				.map((candidate) => candidate.question)
				.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
				.map((question) => question.id);
			return {
				id: `${first.type}:${questionIds.join(',')}`,
				type: first.type,
				priority: 0,
				...actionCopy(first.type, first.policyType),
				questionIds,
				questionCount: questionIds.length,
				controlImpact: controls,
				...(first.policyType ? { proposedPolicyType: first.policyType } : {})
			};
		})
		.sort((a, b) => {
			const typeOrder = ACTION_ORDER[a.type] - ACTION_ORDER[b.type];
			if (typeOrder !== 0) return typeOrder;
			const impactOrder = b.controlImpact.length - a.controlImpact.length;
			if (impactOrder !== 0) return impactOrder;
			return a.id.localeCompare(b.id);
		})
		.map((action, index) => ({ ...action, priority: index + 1 }));

	const byType: RemediationPlan['counts']['byType'] = {
		answer_now: { actions: 0, questions: 0 },
		confirm_fact: { actions: 0, questions: 0 },
		generate_policy: { actions: 0, questions: 0 },
		upload_evidence: { actions: 0, questions: 0 }
	};
	for (const action of actions) {
		byType[action.type].actions++;
		byType[action.type].questions += action.questionCount;
	}

	const affectedControlIds = new Set(
		actions.flatMap((action) => action.controlImpact.map((c) => c.id))
	);
	return {
		actions,
		counts: {
			totalActions: actions.length,
			affectedQuestions: actions.reduce((count, action) => count + action.questionCount, 0),
			byType
		},
		controlImpact: {
			controlsAffected: affectedControlIds.size,
			controlsWithExistingPolicy: [...affectedControlIds].filter((id) =>
				input.controlIdsWithPolicy.has(id)
			).length,
			controlsWithEvidence: [...affectedControlIds].filter((id) =>
				input.controlIdsWithEvidence.has(id)
			).length
		}
	};
}
