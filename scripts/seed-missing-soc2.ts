/**
 * One-time script to insert the 21 missing SOC 2 controls into production.
 * Safe to re-run — uses ON CONFLICT DO NOTHING on (framework_id, code).
 *
 * Usage: railway run bun run scripts/seed-missing-soc2.ts
 */
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { frameworks, controls } from '../src/lib/server/db/schema';
import { eq } from 'drizzle-orm';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

async function run() {
	const [soc2] = await db.select().from(frameworks).where(eq(frameworks.slug, 'soc2')).limit(1);

	if (!soc2) {
		console.error('SOC 2 framework not found');
		process.exit(1);
	}

	const fid = soc2.id;

	const newControls = [
		// ── CC1: Control Environment ──
		{
			frameworkId: fid,
			code: 'CC1.2',
			title: 'Board Oversight of Internal Controls',
			description:
				"The board of directors or equivalent oversight body demonstrates independence from management and exercises oversight of the development and performance of internal controls. The board reviews and approves the organization's risk appetite and monitors whether management has implemented effective controls to manage key risks. Board-level oversight provides an independent check on the effectiveness of the control environment.",
			whyItMatters:
				'Without independent board oversight, management has unchecked authority over the controls that are supposed to constrain it. Enterprise customers and auditors expect demonstrable governance above the executive layer.',
			whatAuditorExpects:
				'Auditors will review board meeting minutes, audit committee charters, and evidence that the board receives regular security and risk reporting from management. They will confirm that board composition includes independent members and that significant control failures are escalated to the board level.',
			category: 'Control Environment'
		},
		{
			frameworkId: fid,
			code: 'CC1.3',
			title: 'Management Structure, Authority, and Responsibility',
			description:
				'Management establishes, with board oversight, structures, reporting lines, and appropriate authorities and responsibilities in the pursuit of objectives. Organizational charts and role definitions clarify who is responsible for operating controls and who has authority to make decisions affecting the control environment. Accountability structures ensure that control gaps are owned and remediated.',
			whyItMatters:
				"Unclear authority creates gaps where controls are assumed to be someone else's responsibility. A documented management structure ensures every control has a named owner who can be held accountable.",
			whatAuditorExpects:
				'Auditors will examine organizational charts, job descriptions, and delegation-of-authority documents. They will verify that security and compliance responsibilities are formally assigned at the management level and that reporting lines support timely escalation of control issues.',
			category: 'Control Environment'
		},
		{
			frameworkId: fid,
			code: 'CC1.4',
			title: 'Commitment to Competence',
			description:
				'The organization demonstrates a commitment to attract, develop, and retain competent individuals in alignment with the objectives of the organization. Management defines the knowledge and skills required for roles involved in operating internal controls and ensures that hiring, training, and development programs meet those requirements. Performance evaluations assess whether individuals are meeting their control responsibilities.',
			whyItMatters:
				'Controls operated by undertrained personnel are controls that fail in practice. Demonstrating competence development gives auditors and enterprise customers confidence that your team can actually execute what your policies describe.',
			whatAuditorExpects:
				'Auditors will review job descriptions with defined competency requirements, training completion records for security-relevant roles, and performance review documentation. They will look for evidence of ongoing security awareness training and role-specific technical training programs.',
			category: 'Control Environment'
		},
		{
			frameworkId: fid,
			code: 'CC1.5',
			title: 'Accountability for Internal Control Responsibilities',
			description:
				'The organization holds individuals accountable for their internal control responsibilities in the pursuit of objectives. Performance targets include control-related expectations and deviations are addressed through corrective action. A culture of accountability reinforces that failing to operate controls has real consequences.',
			whyItMatters:
				'Accountability mechanisms are what turn written policies into consistently operating controls. When people know they are measured on control performance, compliance rates improve materially.',
			whatAuditorExpects:
				'Auditors will look for evidence that control responsibilities are reflected in performance objectives and that instances of non-compliance were followed up with documented corrective actions. They may review HR records or manager feedback to confirm accountability is enforced, not just stated.',
			category: 'Control Environment'
		},
		// ── CC2: Communication & Information ──
		{
			frameworkId: fid,
			code: 'CC2.2',
			title: 'External Communication of Control Information',
			description:
				"The organization communicates with external parties regarding matters affecting the functioning of internal controls. This includes communicating security and privacy commitments to customers, disclosing relevant control information to third parties who rely on the organization's system, and maintaining transparency with regulators. External communications are accurate, timely, and consistent with internal policies.",
			whyItMatters:
				'Enterprise customers need to understand what controls protect their data before they can trust you with it. Proactive external communication of your control posture is a competitive differentiator and a compliance requirement.',
			whatAuditorExpects:
				'Auditors will review customer-facing security documentation such as trust pages, security questionnaire responses, data processing agreements, and breach notification procedures. They will verify that the claims made externally are consistent with the controls actually operating internally.',
			category: 'Communication & Information'
		},
		{
			frameworkId: fid,
			code: 'CC2.3',
			title: 'Communication of Internal Control Deficiencies',
			description:
				'The organization communicates internal control deficiencies to those parties responsible for taking corrective action in a timely manner, including senior management and the board as appropriate. A defined process captures control failures, assesses their severity, and routes them to the right owner. Deficiencies are tracked to resolution and patterns are reported to leadership.',
			whyItMatters:
				'Controls that break silently are more dangerous than controls that were never implemented. A formal deficiency reporting process ensures that gaps are surfaced quickly and addressed before they lead to incidents.',
			whatAuditorExpects:
				'Auditors will look for a deficiency tracking log or issue register and evidence that identified control gaps were reported to management and the board. They will verify that deficiencies were assigned owners, given remediation timelines, and resolved or formally accepted as residual risk.',
			category: 'Communication & Information'
		},
		// ── CC3: Risk Assessment ──
		{
			frameworkId: fid,
			code: 'CC3.2',
			title: 'Identification of Fraud Risk',
			description:
				'The organization considers the potential for fraud in assessing risks to the achievement of objectives. This includes evaluating incentives and pressures that could motivate fraud, opportunities that could enable it, and rationalizations that could be used to justify it. Fraud risk assessments inform the design of preventive and detective controls.',
			whyItMatters:
				'Fraud risk is often underweighted in technical security assessments but is a primary concern for auditors and for enterprise customers evaluating vendor trustworthiness. Addressing it explicitly signals a mature risk program.',
			whatAuditorExpects:
				'Auditors will review the risk assessment to confirm fraud scenarios (e.g., insider data theft, financial misstatement, vendor collusion) are explicitly addressed. They will look for antifraud controls such as segregation of duties, anomaly monitoring, and whistleblower channels.',
			category: 'Risk Assessment'
		},
		{
			frameworkId: fid,
			code: 'CC3.3',
			title: 'Assessment of Changes That Could Impact Controls',
			description:
				'The organization identifies and assesses changes that could significantly impact the system of internal controls. Triggers include changes to business objectives, technology environments, personnel, regulatory requirements, and external threats. When significant changes are identified, the risk assessment is updated and affected controls are reviewed for continued effectiveness.',
			whyItMatters:
				'A risk assessment that is only done once at audit time quickly becomes stale. Rapidly growing startups face constant change — new cloud services, new hires, new product features — all of which can invalidate previously adequate controls.',
			whatAuditorExpects:
				'Auditors will check whether the risk assessment process includes a defined set of change triggers and whether recent significant changes (e.g., a new infrastructure migration or a key personnel departure) prompted a reassessment. They will look for documented evidence of change-triggered reviews.',
			category: 'Risk Assessment'
		},
		{
			frameworkId: fid,
			code: 'CC3.4',
			title: 'Risk Assessment of Third-Party Relationships',
			description:
				"The organization assesses risks arising from third-party relationships, including subservice organizations, vendors, and partners that have access to the organization's systems or data. Risk assessments consider the nature of the third party's access, the sensitivity of data shared, and the third party's own control environment. Findings drive contractual requirements and ongoing monitoring obligations.",
			whyItMatters:
				'Your vendors can be the source of your breach. Enterprise customers increasingly ask detailed questions about third-party risk management, and auditors expect evidence that vendor risk is formally evaluated rather than assumed.',
			whatAuditorExpects:
				'Auditors will request a vendor inventory listing critical third-party relationships, corresponding risk assessments or security questionnaires sent to vendors, and vendor contracts that include appropriate data protection and security requirements. They will sample vendor reviews to confirm they are performed on a regular schedule.',
			category: 'Risk Assessment'
		},
		// ── CC4: Monitoring Activities ──
		{
			frameworkId: fid,
			code: 'CC4.1',
			title: 'Selection and Development of Monitoring Activities',
			description:
				'The organization selects, develops, and performs ongoing and/or separate evaluations to ascertain whether the components of internal control are present and functioning. Monitoring activities are designed to provide reasonable assurance that controls continue to operate effectively over time. Both automated monitoring (e.g., dashboards, alerts) and manual reviews (e.g., periodic audits) are used as appropriate.',
			whyItMatters:
				'Controls can degrade silently as people, processes, and technology change. Continuous monitoring catches drift before it becomes a gap that an auditor — or an attacker — discovers.',
			whatAuditorExpects:
				'Auditors will review the monitoring strategy and evidence that monitoring activities are actually performed. They will look for dashboards, periodic control testing schedules, management review meeting minutes, and automated alerts that demonstrate controls are being actively watched.',
			category: 'Monitoring Activities'
		},
		{
			frameworkId: fid,
			code: 'CC4.2',
			title: 'Evaluation and Communication of Internal Control Deficiencies',
			description:
				'The organization evaluates and communicates internal control deficiencies in a timely manner to those parties responsible for taking corrective action, including senior management and the board of directors, as appropriate. Monitoring results are analyzed to identify patterns, root causes, and systemic issues. Remediation is tracked and verified before deficiencies are closed.',
			whyItMatters:
				'Monitoring without follow-through is theatre. The value of a monitoring program is realized only when deficiencies are actually routed to owners and fixed. Auditors specifically test that the loop is closed.',
			whatAuditorExpects:
				'Auditors will trace a sample of monitoring findings through to documented remediation. They expect to see deficiency reports with severity ratings, assigned owners, target resolution dates, and evidence of verification that the fix was effective.',
			category: 'Monitoring Activities'
		},
		// ── CC5: Control Activities ──
		{
			frameworkId: fid,
			code: 'CC5.1',
			title: 'Selection and Development of Control Activities',
			description:
				'The organization selects and develops control activities that contribute to the mitigation of risks to the achievement of objectives to acceptable levels. Controls are designed to address the specific risks identified in the risk assessment and may be preventive, detective, or corrective in nature. The selection considers the cost of the control relative to the risk it mitigates.',
			whyItMatters:
				'Not all risks require the same level of control investment. Thoughtful control selection ensures that limited resources are directed toward the risks that matter most — which is exactly the approach enterprise customers want to see in their vendors.',
			whatAuditorExpects:
				'Auditors will map controls to the risk register to confirm that identified risks have corresponding mitigating controls. They will evaluate whether the chosen controls are appropriate in type and strength for the risks they address and that controls are documented in a control matrix or similar artifact.',
			category: 'Control Activities'
		},
		{
			frameworkId: fid,
			code: 'CC5.2',
			title: 'Technology General Controls',
			description:
				'The organization selects and develops general control activities over technology to support the achievement of objectives. Technology general controls (ITGCs) include controls over the technology infrastructure, security management, and the acquisition, development, and maintenance of technology. These controls underpin the reliability of application-level controls and automated processes.',
			whyItMatters:
				'Application-level controls are only as reliable as the infrastructure they run on. Weak ITGCs — such as unpatched servers or uncontrolled admin access — undermine every other control in the organization.',
			whatAuditorExpects:
				'Auditors will review IT general controls including patch management processes, system hardening standards, backup and recovery procedures, and access controls over infrastructure components. They will test that automated controls (e.g., access provisioning workflows, automated alerts) are functioning as designed.',
			category: 'Control Activities'
		},
		{
			frameworkId: fid,
			code: 'CC5.3',
			title: 'Deployment of Control Activities Through Policies and Procedures',
			description:
				'The organization deploys control activities through policies that establish what is expected and procedures that put policies into action. Policies are approved by management, communicated to relevant personnel, and reviewed periodically for continued relevance. Procedures provide step-by-step operational guidance for executing the controls described in policies.',
			whyItMatters:
				'A policy without a procedure is a promise without a plan. Auditors specifically check that policies are translated into actionable, repeatable procedures that operators follow — not left as abstract documents.',
			whatAuditorExpects:
				'Auditors will review key policies (e.g., access control policy, change management policy) alongside the corresponding operational procedures. They will verify that procedures are detailed enough to be followed consistently, that they reference the policy they implement, and that evidence of procedure execution (e.g., checklists, logs) exists.',
			category: 'Control Activities'
		},
		// ── CC6: Logical & Physical Access (additions) ──
		{
			frameworkId: fid,
			code: 'CC6.7',
			title: 'Restriction of Data Movement and Output',
			description:
				"The organization restricts the transmission, movement, and removal of information to authorized internal and external users and processes, and protects it during transmission, movement, or removal to meet the entity's objectives. Controls include data loss prevention measures, encryption of data in transit, and restrictions on the use of removable media. Output controls ensure that sensitive data is delivered only to intended recipients.",
			whyItMatters:
				'Data exfiltration — whether malicious or accidental — is a primary risk vector. Controls over data movement prevent sensitive information from leaving the organization through unauthorized channels.',
			whatAuditorExpects:
				'Auditors will review data classification policies, DLP tool configurations or compensating controls, encryption standards for data in transit (e.g., TLS enforcement), and controls on removable media and external file sharing. They will test that sensitive data cannot be easily exported to unauthorized destinations.',
			category: 'Logical & Physical Access'
		},
		{
			frameworkId: fid,
			code: 'CC6.8',
			title: 'Prevention and Detection of Unauthorized or Malicious Software',
			description:
				"The organization implements controls to prevent or detect and act upon the introduction of unauthorized or malicious software to meet the entity's objectives. This includes deploying endpoint protection, maintaining an allowlist of approved software, and monitoring for indicators of compromise. Detection capabilities are paired with response procedures to contain and remediate threats.",
			whyItMatters:
				'Malware and unauthorized software are common attack vectors that can compromise data confidentiality, integrity, and availability. Preventive and detective controls work together to minimize the window of exposure.',
			whatAuditorExpects:
				'Auditors will verify that endpoint protection (antivirus/EDR) is deployed across all endpoints and servers, that signatures and detection rules are kept current, and that alerts are monitored and investigated. They will also check for software installation restrictions and an approved software policy.',
			category: 'Logical & Physical Access'
		},
		// ── CC7: System Operations (additions) ──
		{
			frameworkId: fid,
			code: 'CC7.4',
			title: 'Incident Response and Recovery',
			description:
				'The organization implements incident response procedures to identify, contain, eradicate, and recover from security incidents. A documented incident response plan defines roles, communication protocols, escalation paths, and recovery objectives. The plan is tested periodically through tabletop exercises or simulations to ensure readiness.',
			whyItMatters:
				'Every organization will face a security incident eventually. The difference between a minor event and a catastrophic breach often comes down to how quickly and effectively the team responds. Enterprise customers specifically evaluate incident response maturity during due diligence.',
			whatAuditorExpects:
				'Auditors will review the incident response plan, evidence of periodic testing (tabletop exercise reports), and logs of actual incident responses during the audit period. They will check that incidents were handled according to the plan, that root cause analysis was performed, and that lessons learned were incorporated back into the plan.',
			category: 'System Operations'
		},
		{
			frameworkId: fid,
			code: 'CC7.5',
			title: 'Communication of System Incidents',
			description:
				'The organization identifies, develops, and implements activities to recover from identified security incidents and communicates information about those incidents to affected parties as required. Communication plans address both internal stakeholders (management, legal, engineering) and external parties (customers, regulators, law enforcement) as appropriate. Breach notification obligations under applicable laws and contracts are met.',
			whyItMatters:
				'Transparent and timely incident communication is both a legal obligation in many jurisdictions and a trust-building practice. Customers and regulators judge organizations not just by whether incidents occur but by how honestly and quickly they communicate about them.',
			whatAuditorExpects:
				'Auditors will review breach notification procedures, customer communication templates, and evidence of actual incident notifications sent during the audit period. They will verify that notification timelines comply with contractual SLAs and regulatory requirements (e.g., GDPR 72-hour notification).',
			category: 'System Operations'
		},
		// ── CC9: Risk Mitigation (addition) ──
		{
			frameworkId: fid,
			code: 'CC9.2',
			title: 'Vendor and Third-Party Risk Management',
			description:
				'The organization assesses and manages risks associated with vendors and third-party business partners. A vendor management program includes due diligence before onboarding, contractual security requirements, and ongoing monitoring of vendor compliance. Vendors with access to sensitive data or critical systems are subject to enhanced scrutiny and periodic reassessment.',
			whyItMatters:
				'Supply chain and third-party breaches are among the most impactful security events. Enterprise customers expect their vendors to have formal programs for managing the vendors they in turn rely on — it is a chain of trust.',
			whatAuditorExpects:
				'Auditors will review the vendor management policy, a complete vendor inventory with risk ratings, evidence of due diligence performed before onboarding critical vendors, and records of periodic vendor reassessments. They will check that contracts include security, privacy, and breach notification requirements.',
			category: 'Risk Mitigation'
		}
	];

	const result = await db.insert(controls).values(newControls).onConflictDoNothing();
	console.log(`Inserted ${newControls.length} missing SOC 2 controls (conflicts skipped).`);

	await client.end();
	console.log('Done.');
}

run().catch((err) => {
	console.error(err);
	process.exit(1);
});
