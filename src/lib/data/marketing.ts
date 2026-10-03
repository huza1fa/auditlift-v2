export interface FAQ {
	question: string;
	answer: string;
}

export const product = {
	name: 'AuditLift',
	url: 'https://auditlift.app',
	description:
		'AuditLift is AI-assisted security questionnaire software for early-stage B2B SaaS teams. Draft source-backed answers, review gaps, reuse approved responses, and organize policies and evidence for enterprise buyer reviews.',
	features: [
		'AI-assisted security questionnaire answers with source citations',
		'Reusable approved answer library',
		'Company facts, policies, and evidence as answer sources',
		'Deal workspaces and buyer-specific gap review',
		'AI-assisted security policy drafting',
		'SOC 2, ISO 27001, and PCI-DSS framework readiness tracking',
		'Questionnaire response and security package exports'
	]
};

export const productFAQs: FAQ[] = [
	{
		question: 'What is AuditLift?',
		answer: product.description
	},
	{
		question: 'Who is AuditLift built for?',
		answer:
			'AuditLift is built for founders, operations leads, and small security teams at early-stage B2B SaaS companies responding to enterprise buyer security reviews. It is especially useful when questionnaires arrive before you have a dedicated compliance team.'
	},
	{
		question: 'Which security questionnaire formats can I upload?',
		answer:
			'AuditLift accepts Excel (.xlsx), CSV, PDF, and Word (.docx) questionnaires. Review the extracted questions before preparing your response; extraction quality depends on the structure and readability of the source document.'
	},
	{
		question: 'How does AuditLift help answer security questionnaires?',
		answer:
			'AuditLift uses your company facts, policies, evidence, and approved answer library to draft answers with source citations. Your team reviews the drafts, confirms missing facts, resolves gaps, and approves responses before exporting them for the buyer. AI drafts are not a substitute for human review.'
	},
	{
		question: 'Does AuditLift provide SOC 2 reports or ISO 27001 certification?',
		answer:
			'No. AuditLift helps organize policies, evidence, and control coverage for SOC 2, ISO 27001, and PCI-DSS readiness. A readiness score is not an audit opinion or certification. SOC 2 reports require an independent CPA firm, and ISO 27001 certification requires an accredited certification body.'
	},
	{
		question: 'How much does AuditLift cost?',
		answer:
			'Starter costs $149 USD per month or $1,431 USD per year and includes SOC 2 and up to 5 team members. Growth costs $299 USD per month or $2,870 USD per year and includes all 3 frameworks and unlimited team members. Both offer a 10-day free trial with no credit card required. During the unpaid trial, you can export one completed questionnaire.'
	}
];

export interface Solution {
	slug: string;
	title: string;
	description: string;
	headline: string;
	summary: string;
	whenToUse: string;
	steps: { title: string; description: string }[];
	faqs: FAQ[];
}

export const solutions: Solution[] = [
	{
		slug: 'security-questionnaire-automation',
		title: 'Security Questionnaire Automation for Startups | AuditLift',
		description:
			'Answer enterprise security questionnaires with AI-assisted, source-backed drafts. Review gaps, reuse approved answers, and export buyer responses with AuditLift.',
		headline: 'Security questionnaire automation for B2B SaaS startups',
		summary:
			'AuditLift helps small teams respond to vendor security assessments without starting from a blank spreadsheet. Upload a buyer questionnaire, draft answers from your company knowledge, and review the claims and gaps before sending your response.',
		whenToUse:
			'Use AuditLift when an enterprise prospect sends a vendor security questionnaire, customer due diligence assessment, or supplier security review and your team needs a repeatable response workflow. Founders and operations leads can keep the buyer review connected to its deal and deadline.',
		steps: [
			{
				title: 'Upload the buyer questionnaire',
				description:
					'Import Excel (.xlsx), CSV, PDF, or Word (.docx) files. Check the extracted questions and organize the review in a deal workspace.'
			},
			{
				title: 'Draft from sources, not assumptions',
				description:
					'Use policies, evidence, confirmed company facts, and approved answers as source material. Inspect citations and identify missing information instead of treating every AI draft as ready to send.'
			},
			{
				title: 'Review, approve, and return the response',
				description:
					'Have a responsible team member verify each claim, address buyer-specific gaps, and export the questionnaire response. Save approved answers for the next review.'
			}
		],
		faqs: [
			{
				question: 'What is security questionnaire automation?',
				answer:
					'Security questionnaire automation helps teams import buyer questions, prepare draft responses from existing company knowledge, and reuse reviewed answers. AuditLift combines that workflow with citations and gap review; your team remains responsible for checking and approving what you send.'
			},
			productFAQs[2],
			productFAQs[3],
			{
				question: 'Can I use AuditLift before I have a SOC 2 report?',
				answer:
					'Yes. AuditLift is designed for teams dealing with buyer security reviews before a formal audit program is in place. It helps document your current practices, but it cannot replace a SOC 2 report when a buyer requires one. Be explicit about which controls are implemented and which are planned.'
			}
		]
	},
	{
		slug: 'security-answer-library',
		title: 'Security Questionnaire Answer Library | AuditLift',
		description:
			'Build a reusable library of approved security questionnaire answers. Ground buyer responses in company facts, policies, and evidence with AuditLift.',
		headline: 'An approved answer library for repeat security reviews',
		summary:
			'AuditLift gives B2B SaaS teams a reusable security questionnaire answer library. Keep reviewed company language alongside its source material so the next customer assessment starts from approved knowledge rather than scattered past spreadsheets.',
		whenToUse:
			'Use an answer library when buyers repeatedly ask about access control, encryption, incident response, data retention, or vendor management. It is useful for small teams that want consistent security responses across multiple enterprise deals.',
		steps: [
			{
				title: 'Start with verified company knowledge',
				description:
					'Collect current policies, supporting evidence, and confirmed company facts. These sources give reviewers a basis for deciding what your team can accurately claim.'
			},
			{
				title: 'Approve responses you can stand behind',
				description:
					'Review an answer for accuracy and supporting sources before adding it to the approved library. Keep gaps separate from claims about controls already in place.'
			},
			{
				title: 'Reuse and check buyer-specific details',
				description:
					'Use approved answers as source material for future questionnaires. Confirm the response still matches your current practices and the specific scope of the buyer’s question.'
			}
		],
		faqs: [
			{
				question: 'What is a security questionnaire answer library?',
				answer:
					'It is a collection of reviewed answers to recurring customer security questions. In AuditLift, approved responses can inform future AI-assisted drafts alongside policies, evidence, and company facts.'
			},
			{
				question: 'How is an approved answer library different from a generic AI chatbot?',
				answer:
					'A generic chatbot can draft plausible language without knowing your actual controls. AuditLift uses your organization’s source material and approved responses, provides citations, and includes a review workflow. Reviewers should still verify every claim before sharing it.'
			},
			{
				question: 'Can an approved answer be sent without further review?',
				answer:
					'An approved answer is a starting point, not a permanent guarantee. Check whether your controls, policies, or buyer requirements have changed before reusing it. A response that was accurate for one assessment may not fit another.'
			}
		]
	},
	{
		slug: 'soc-2-readiness',
		title: 'SOC 2 Readiness Software for Startups | AuditLift',
		description:
			'Build a SOC 2 readiness foundation while answering buyer security reviews. Organize policies, evidence, and framework control coverage with AuditLift.',
		headline: 'Build SOC 2 readiness while responding to buyers',
		summary:
			'AuditLift helps early-stage SaaS teams organize the policies, evidence, and controls behind their buyer security responses. Reuse that work to build a compliance foundation instead of treating every questionnaire and future audit as separate projects.',
		whenToUse:
			'Use AuditLift when you are preparing for enterprise sales and need to understand your security documentation gaps before committing to a formal SOC 2 audit. Starter includes SOC 2; Growth adds ISO 27001 and PCI-DSS framework readiness tracking.',
		steps: [
			{
				title: 'Connect buyer questions to your controls',
				description:
					'Use a security review to identify missing company facts, policies, and evidence. Track supporting work against framework controls instead of maintaining disconnected documents.'
			},
			{
				title: 'Draft policies and collect evidence',
				description:
					'Create AI-assisted policy drafts based on your company context and review them with the people responsible for implementation. Attach evidence of actual practices to relevant controls.'
			},
			{
				title: 'Track readiness and prepare a handoff',
				description:
					'Monitor framework coverage and export an organized policy and evidence package. Work with an independent auditor when you need a SOC 2 report; documentation coverage alone does not prove compliance.'
			}
		],
		faqs: [
			productFAQs[4],
			{
				question: 'Is a generated security policy enough to satisfy a SOC 2 control?',
				answer:
					'No. A policy describes intended practices. Your team must implement the relevant controls and retain evidence that they operate. AI-generated drafts need review for accuracy, ownership, scope, and applicability before adoption.'
			},
			{
				question: 'Is AuditLift a replacement for audit-focused compliance automation?',
				answer:
					'AuditLift starts with buyer security questionnaires, approved answers, and the supporting compliance foundation. If your primary need is a formal audit program or continuous infrastructure monitoring, evaluate those requirements separately with your auditor and prospective vendors.'
			}
		]
	}
];
