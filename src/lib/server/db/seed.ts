import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { frameworks, controls } from './schema';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

export async function seed() {
	console.log('Seeding frameworks...');

	// ─── Frameworks ───────────────────────────────────────────────────────────

	const [soc2] = await db
		.insert(frameworks)
		.values([
			{
				slug: 'soc2',
				name: 'SOC 2',
				description:
					'SOC 2 (System and Organization Controls 2) is an auditing procedure that ensures service providers securely manage data to protect the interests and privacy of their clients. It evaluates controls relevant to security, availability, processing integrity, confidentiality, and privacy.',
				recommended: true
			},
			{
				slug: 'pci',
				name: 'PCI-DSS',
				description:
					'The Payment Card Industry Data Security Standard (PCI-DSS) is a set of security standards designed to ensure that all companies that accept, process, store, or transmit credit card information maintain a secure environment. Compliance is required for any organization handling cardholder data.',
				recommended: false
			},
			{
				slug: 'iso27001',
				name: 'ISO 27001',
				description:
					'ISO/IEC 27001 is the international standard for information security management systems (ISMS). It provides a systematic approach to managing sensitive company information, encompassing people, processes, and IT systems, and requires organizations to identify risks and implement appropriate controls.',
				recommended: false
			}
		])
		.onConflictDoNothing()
		.returning();

	console.log('Frameworks seeded.');

	// If soc2 was not inserted (conflict), look it up separately
	// We use a workaround: fetch after insert regardless
	const allFrameworks = await db.select().from(frameworks);
	const soc2Framework = allFrameworks.find((f) => f.slug === 'soc2');
	const pciFramework = allFrameworks.find((f) => f.slug === 'pci');
	const isoFramework = allFrameworks.find((f) => f.slug === 'iso27001');

	if (!soc2Framework) {
		console.error('SOC2 framework not found after seeding. Aborting controls seed.');
		return;
	}

	if (!pciFramework || !isoFramework) {
		console.error('PCI or ISO27001 framework not found after seeding. Aborting controls seed.');
		return;
	}

	console.log('Seeding SOC2 controls...');

	// ─── SOC2 Controls ────────────────────────────────────────────────────────

	await db
		.insert(controls)
		.values([
			{
				frameworkId: soc2Framework.id,
				code: 'CC1.1',
				title: 'Commitment to Integrity and Ethical Values',
				description:
					'The organization demonstrates a commitment to integrity and ethical values through its culture, policies, and the behavior of its leadership. Management establishes the tone at the top, setting expectations for ethical conduct throughout the organization. Policies and procedures are documented and communicated to reinforce these values.',
				whyItMatters:
					'A strong ethical foundation reduces the risk of fraud, misconduct, and data misuse — all of which can lead to security incidents. Auditors use this as a baseline for assessing the overall control environment.',
				whatAuditorExpects:
					'Auditors will review a documented code of conduct or ethics policy that employees have acknowledged. They will look for evidence of regular ethics training, management communications reinforcing these values, and records of disciplinary actions taken when violations occurred.',
				category: 'Control Environment'
			},
			{
				frameworkId: soc2Framework.id,
				code: 'CC2.1',
				title: 'Internal Communication of Control Information',
				description:
					'The organization internally communicates information necessary to support the functioning of internal controls. This includes communicating roles and responsibilities, control objectives, and information about relevant risks to the right personnel. Communication channels are established to allow issues to flow upward to management.',
				whyItMatters:
					'Controls only work when the people responsible for them understand what they are supposed to do. Poor internal communication is a root cause of many compliance failures.',
				whatAuditorExpects:
					'Auditors will look for evidence of regular all-hands meetings, internal memos, or an intranet where security policies are published. They expect to see documented role assignments and acknowledgments that employees have read and understood relevant policies.',
				category: 'Communication & Information'
			},
			{
				frameworkId: soc2Framework.id,
				code: 'CC3.1',
				title: 'Identification and Analysis of Risk to Objectives',
				description:
					'The organization specifies its objectives with sufficient clarity to enable the identification and assessment of risks relating to those objectives. Management identifies internal and external risks that could prevent the organization from achieving its objectives and analyzes those risks to form a basis for determining how they should be managed.',
				whyItMatters:
					'Without a formal risk identification process, an organization cannot know which controls are most important. Proactively identifying risks leads to smarter, more targeted control investments.',
				whatAuditorExpects:
					'Auditors expect a documented risk register or risk assessment report that is reviewed and updated at least annually. They will check that risks are rated by likelihood and impact, and that control owners are assigned to each identified risk.',
				category: 'Risk Assessment'
			},
			{
				frameworkId: soc2Framework.id,
				code: 'CC6.1',
				title: 'Logical and Physical Access Controls',
				description:
					'The organization implements logical access security software, infrastructure, and architectures over protected information assets to protect them from security events. This includes enforcing authentication, authorization, and access restrictions to prevent unauthorized access to data and systems. Physical access to data centers and server rooms is also restricted and monitored.',
				whyItMatters:
					'Unauthorized access is one of the most common causes of data breaches. Strong access controls are foundational to protecting customer data and maintaining trust.',
				whatAuditorExpects:
					'Auditors will review access control policies, user access lists, and MFA enforcement records. They will test that only authorized personnel can access production systems and that physical access logs for server rooms are retained and reviewed.',
				category: 'Logical & Physical Access'
			},
			{
				frameworkId: soc2Framework.id,
				code: 'CC6.2',
				title: 'Provisioning and Management of System Credentials',
				description:
					"Prior to issuing system credentials and granting system access, the organization registers and authorizes new internal and external users. The process includes verifying the identity of new users, obtaining management approval, and provisioning only the access required for the user's role. Access is promptly revoked when no longer needed.",
				whyItMatters:
					'Improper credential management can leave orphaned accounts that act as open doors for attackers. Timely provisioning and deprovisioning reduces attack surface and demonstrates a mature identity lifecycle.',
				whatAuditorExpects:
					'Auditors will sample onboarding and offboarding tickets to verify that access was granted with manager approval and revoked within a defined SLA after termination. They will also check for automated provisioning workflows and periodic access reviews.',
				category: 'Logical & Physical Access'
			},
			{
				frameworkId: soc2Framework.id,
				code: 'CC6.3',
				title: 'Role-Based Access Controls and Least Privilege',
				description:
					'The organization uses role-based access controls to grant system access based on the principle of least privilege. Users are assigned to roles that provide only the permissions necessary to perform their job functions. Access privileges are reviewed periodically and adjusted as job responsibilities change.',
				whyItMatters:
					'Overly permissive access increases the blast radius of any compromise. Role-based access controls ensure that a single compromised account cannot access all sensitive data.',
				whatAuditorExpects:
					'Auditors expect to see a defined role matrix or RBAC policy. They will test a sample of user accounts to confirm that permissions align with documented roles and that privileged access (admin rights) is granted sparingly and subject to additional controls such as MFA.',
				category: 'Logical & Physical Access'
			},
			{
				frameworkId: soc2Framework.id,
				code: 'CC6.6',
				title: 'Logical Access Security Measures Against External Threats',
				description:
					'The organization implements controls to protect against threats from sources outside its system boundaries. This includes perimeter security measures such as firewalls, intrusion detection systems, and encryption in transit to prevent unauthorized external access. Vulnerability scanning and penetration testing are conducted regularly to identify and remediate weaknesses.',
				whyItMatters:
					'External threats — from malicious actors attempting to breach the perimeter — are constant. Layered perimeter controls are necessary to protect data from outside attackers.',
				whatAuditorExpects:
					'Auditors will review firewall rule sets, network diagrams, and IDS/IPS configurations. They will ask for penetration test reports and vulnerability scan results, along with remediation timelines that demonstrate identified issues were addressed promptly.',
				category: 'Logical & Physical Access'
			},
			{
				frameworkId: soc2Framework.id,
				code: 'CC7.1',
				title: 'Configuration Management',
				description:
					'The organization uses detection and monitoring procedures to identify changes to configurations that result in the introduction of new vulnerabilities, and susceptibilities to known vulnerabilities. Baseline configurations are established for all systems and deviations are detected and reviewed. Configuration changes go through a defined approval process.',
				whyItMatters:
					'Misconfigured systems are among the leading causes of security incidents. A strong configuration management program ensures systems remain hardened and that changes do not introduce unexpected risk.',
				whatAuditorExpects:
					'Auditors will look for documented baseline configurations (e.g., CIS benchmarks) and evidence that automated configuration monitoring tools are in place. They will request change records showing that configuration modifications were approved and tested before deployment to production.',
				category: 'System Operations'
			},
			{
				frameworkId: soc2Framework.id,
				code: 'CC7.2',
				title: 'System Monitoring and Anomaly Detection',
				description:
					"The organization designs and implements monitoring activities to detect anomalies that are indicative of malicious acts, natural disasters, and errors affecting the entity's ability to achieve its objectives. Monitoring tools continuously collect and analyze system and security logs to surface unusual behavior. Alerts are triaged and escalated according to defined procedures.",
				whyItMatters:
					'Early detection of anomalies limits the damage from security incidents and operational failures. Without active monitoring, breaches can go undetected for months.',
				whatAuditorExpects:
					'Auditors expect evidence of a deployed SIEM or log management solution with defined alert rules. They will review a sample of security alerts and incident tickets to confirm that anomalies were investigated and resolved within the documented SLA.',
				category: 'System Operations'
			},
			{
				frameworkId: soc2Framework.id,
				code: 'CC7.3',
				title: 'Evaluation of Security Events',
				description:
					'The organization evaluates security events to determine whether they could or have resulted in a failure of the entity to meet its objectives. A formal process exists to classify and investigate security events, determine root cause, and decide on remediation actions. Findings are documented and tracked to closure.',
				whyItMatters:
					'Not all security events are incidents, but all events must be evaluated to make that determination. A consistent evaluation process prevents real incidents from being dismissed and ensures learnings are captured.',
				whatAuditorExpects:
					'Auditors will review the incident management policy and a sample of event investigation records. They will check that events are classified by severity, that investigations are completed by qualified personnel, and that post-incident reviews are conducted for significant events.',
				category: 'System Operations'
			},
			{
				frameworkId: soc2Framework.id,
				code: 'CC8.1',
				title: 'Change Management Process',
				description:
					'The organization authorizes, designs, develops or acquires, configures, documents, tests, approves, and implements changes to infrastructure, data, software, and procedures to meet its objectives. A formal change management process ensures that all changes are reviewed and tested before being deployed to production environments.',
				whyItMatters:
					'Uncontrolled changes are a major source of outages and security vulnerabilities. A structured change process reduces the risk that changes introduce new problems.',
				whatAuditorExpects:
					'Auditors will examine change management policies and sample change tickets from the audit period. They expect to see evidence of peer code review, QA testing, manager or change advisory board approval, and rollback plans for significant changes before they were deployed.',
				category: 'Change Management'
			},
			{
				frameworkId: soc2Framework.id,
				code: 'CC9.1',
				title: 'Risk Assessment and Identification',
				description:
					'The organization identifies, selects, and develops risk mitigation activities for risks arising from potential business disruptions. Risks to the achievement of entity objectives are identified and assessed on a regular basis, and appropriate responses — including acceptance, avoidance, reduction, and sharing — are selected and implemented.',
				whyItMatters:
					'Risk mitigation ties directly to business resilience. Organizations that fail to proactively address identified risks face greater likelihood of significant disruptions to operations or data security.',
				whatAuditorExpects:
					'Auditors will review the risk management policy and the most recent risk assessment. They will expect a documented risk treatment plan that maps each identified risk to a chosen response, with ownership assigned and evidence that mitigating controls were implemented as planned.',
				category: 'Risk Mitigation'
			}
		])
		.onConflictDoNothing();

	console.log('SOC2 controls seeded.');
	console.log('Seed complete.');
}

// Run if executed directly: `bun run src/lib/server/db/seed.ts`
if (import.meta.url === new URL(process.argv[1], 'file://').href) {
	seed()
		.then(() => client.end())
		.then(() => process.exit(0))
		.catch((err) => {
			console.error('Seed failed:', err);
			client.end().then(() => process.exit(1));
		});
}
