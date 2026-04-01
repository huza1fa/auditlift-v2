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

	// ─── ISO 27001:2022 Controls ───────────────────────────────────────────────

	console.log('Seeding ISO 27001:2022 controls...');

	await db
		.insert(controls)
		.values([
			// Theme: Organizational Controls
			{
				frameworkId: isoFramework.id,
				code: '5.1',
				title: 'Policies for information security',
				description:
					'The organization defines, approves, publishes, and communicates information security policies appropriate to its purpose. Policies are reviewed at planned intervals or when significant changes occur to ensure their continuing suitability and effectiveness. Management endorses the policies and ensures they are accessible to all relevant personnel.',
				whyItMatters:
					'Without approved policies, there is no authoritative baseline for security behavior, making it impossible to hold staff accountable or demonstrate a governed program to auditors or customers.',
				whatAuditorExpects:
					'Auditors will request the information security policy suite and evidence of management approval signatures and version history. They will check that policies have been communicated to staff and reviewed within the last 12 months.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.2',
				title: 'Information security roles and responsibilities',
				description:
					'The organization assigns and communicates information security responsibilities to all relevant roles. Accountability for protecting specific assets and performing specific security activities is clearly defined. Responsibilities are documented and aligned with the information security policy.',
				whyItMatters:
					'Ambiguous ownership of security tasks leads to gaps where nobody acts. Defined roles ensure that controls are operated by named individuals who can be audited.',
				whatAuditorExpects:
					'Auditors will look for an RACI matrix or role-description documents that specify security duties. They will interview sampled staff to confirm awareness of their security responsibilities.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.3',
				title: 'Segregation of duties',
				description:
					'Conflicting duties and areas of responsibility are separated to reduce opportunities for unauthorized or unintentional modification or misuse of organizational assets. Where segregation is not feasible due to organizational size, compensating controls such as monitoring and audit trails are implemented. The risk of colluding individuals circumventing controls is assessed and mitigated.',
				whyItMatters:
					'Failure to segregate duties is a leading enabler of fraud and insider threat. Auditors and customers expect demonstrable checks and balances across sensitive processes.',
				whatAuditorExpects:
					'Auditors will review the process design for critical workflows (e.g., code deploy, financial approval) and verify that no single individual can complete a sensitive action end-to-end without a second party.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.4',
				title: 'Management responsibilities',
				description:
					"Management requires all personnel to apply information security in accordance with established policies, procedures, and the organization's information security rules. Managers actively model and enforce security expectations within their teams. Management oversight ensures that non-compliance is identified and addressed.",
				whyItMatters:
					'Without active management enforcement, policies become paper exercises. Management accountability signals to auditors that security is embedded in culture, not just documented.',
				whatAuditorExpects:
					'Auditors will look for evidence of management-level security briefings, inclusion of security objectives in performance reviews, and documented disciplinary follow-through when policy violations occurred.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.5',
				title: 'Contact with authorities',
				description:
					'The organization establishes and maintains contacts with relevant legal, regulatory, and law enforcement authorities. Contact details and escalation procedures are documented and kept current. Relationships are activated promptly during security incidents that may require external reporting or assistance.',
				whyItMatters:
					'Regulatory reporting obligations (breach notification laws, GDPR, etc.) require rapid contact with authorities. Failing to notify in time can multiply fines and reputational damage.',
				whatAuditorExpects:
					'Auditors will ask to see a contacts register listing relevant authorities (regulators, CERT, law enforcement) and evidence that contact details are reviewed annually.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.6',
				title: 'Contact with special interest groups',
				description:
					"The organization maintains appropriate contacts with security forums, professional associations, and special interest groups. Participation in these groups ensures the organization stays current on emerging threats, vulnerabilities, and best practices. Information gained is incorporated into the organization's risk assessment and security improvement processes.",
				whyItMatters:
					'Threat landscapes evolve rapidly; isolation from the security community leaves organizations blind to emerging attack patterns and newly disclosed vulnerabilities.',
				whatAuditorExpects:
					'Auditors will ask for evidence of membership in industry security groups (e.g., ISACs, ISACA, OWASP) or subscriptions to threat intelligence feeds, and examples of how intelligence was used to update controls.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.7',
				title: 'Threat intelligence',
				description:
					'The organization collects and analyzes information relating to information security threats to produce threat intelligence that is relevant and actionable. Intelligence is shared internally with appropriate stakeholders to inform risk assessments and control decisions. Sources include open-source intelligence, vendor advisories, and industry sharing communities.',
				whyItMatters:
					'Reactive security leaves organizations perpetually behind attackers. Structured threat intelligence enables proactive hardening before adversaries can exploit newly discovered attack vectors.',
				whatAuditorExpects:
					'Auditors will look for a defined threat intelligence process, evidence of regular threat briefings or reports, and examples where intelligence findings led to a change in controls or risk posture.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.8',
				title: 'Information security in project management',
				description:
					"Information security is integrated into the organization's project management methodology so that security requirements are identified and addressed throughout the project lifecycle. Security reviews are conducted at key project milestones, and security risks are tracked in the project risk register. Projects do not go live without a security sign-off.",
				whyItMatters:
					'Security bolted on after deployment is far more expensive to fix than security designed in from the start. Embedding security into project gates prevents new products from becoming new liabilities.',
				whatAuditorExpects:
					'Auditors will review project governance documentation for evidence of security checkpoints, request security sign-off records for recent launches, and confirm that security risks appear in project risk registers.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.9',
				title: 'Inventory of information and other associated assets',
				description:
					'The organization identifies and maintains an inventory of information assets and the assets associated with information processing, including hardware, software, data, and services. Each asset has an identified owner who is responsible for its appropriate management and protection. The inventory is kept accurate and reviewed at regular intervals.',
				whyItMatters:
					'You cannot protect what you do not know you have. An accurate asset inventory is the prerequisite for almost every other information security control.',
				whatAuditorExpects:
					'Auditors will request the asset register and test a sample of assets to verify they are correctly catalogued with ownership, classification, and location. They will check the date of the last review.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.10',
				title: 'Acceptable use of information and other associated assets',
				description:
					'The organization defines and implements rules for the acceptable use and handling of information and associated assets. Rules cover how assets may be used, stored, transmitted, and disposed of, and apply to all users including employees, contractors, and third parties. Users acknowledge these rules as part of onboarding.',
				whyItMatters:
					'Unclear acceptable-use boundaries lead to inadvertent data exposure and policy violations. Documented rules give the organization the basis to enforce and remediate misuse.',
				whatAuditorExpects:
					'Auditors will review the acceptable use policy and check for signed acknowledgment records from all users. They may test whether tooling (e.g., DLP, endpoint controls) enforces the policy technically.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.11',
				title: 'Return of assets',
				description:
					'All personnel and external party users are required to return all organizational assets upon change or termination of employment or contract. Procedures ensure that assets — including physical devices, access credentials, and copies of data — are collected or revoked in a timely and documented manner. Non-return is escalated and recorded.',
				whyItMatters:
					'Unreturned devices or credentials can give former employees or contractors persistent unauthorized access to organizational systems and data long after departure.',
				whatAuditorExpects:
					'Auditors will sample offboarding checklists to confirm that asset return was documented and completed within the defined timeframe, including revocation of access credentials and return of hardware.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.12',
				title: 'Classification of information',
				description:
					'The organization classifies information according to legal requirements and its own business and security needs, based on confidentiality, integrity, and availability requirements. A classification scheme with defined levels (e.g., Public, Internal, Confidential, Restricted) is documented and communicated. Classification is applied at the point of creation or receipt.',
				whyItMatters:
					'Without classification, sensitive data receives the same (often inadequate) handling as non-sensitive data, dramatically increasing the risk of exposure or breach.',
				whatAuditorExpects:
					'Auditors will review the classification policy and scheme and test a sample of documents and data stores to verify that classification labels have been correctly applied and handling rules followed.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.13',
				title: 'Labelling of information',
				description:
					'Procedures are developed and implemented for information labelling in accordance with the classification scheme adopted by the organization. Labels are applied to all information assets — electronic and physical — at the time of creation. Labelling procedures account for scenarios where information cannot easily carry a label (e.g., verbal communications).',
				whyItMatters:
					'Labels make classification visible and actionable, reducing the chance that recipients unknowingly mishandle sensitive information. They are essential for enforcing data handling rules in practice.',
				whatAuditorExpects:
					'Auditors will check that classified documents, emails, and storage media bear appropriate labels, and that staff understand what the labels mean and the corresponding handling obligations.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.14',
				title: 'Information transfer',
				description:
					'The organization applies transfer rules, procedures, and formal agreements for all types of information transfer — electronic, physical, and verbal — for internal transfers and transfers to external parties. Encryption is required for confidential data in transit. Transfer agreements with third parties address security obligations and liability.',
				whyItMatters:
					'Data in transit is highly vulnerable to interception. Inadequate transfer controls are a common vector for data leakage, whether through unencrypted email or insecure physical media.',
				whatAuditorExpects:
					'Auditors will review information transfer policies and sample data transfer agreements with third parties. They will test that technical controls (e.g., TLS enforcement, encrypted media) are in place for confidential transfers.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.15',
				title: 'Access control',
				description:
					'Rules governing access to information and information processing facilities are established, documented, and reviewed based on the principle of least privilege and business need. Access control policies address both logical and physical access across all system types. The policy is reviewed when organizational roles, systems, or business requirements change.',
				whyItMatters:
					'A governing access control policy is the foundation for all specific access controls. Without it, individual access decisions are made ad hoc, creating inconsistency and unmanaged risk.',
				whatAuditorExpects:
					'Auditors will request the access control policy and check that it covers all major system categories. They will trace how access decisions for sampled users are connected back to the documented rules.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.16',
				title: 'Identity management',
				description:
					'The full lifecycle of identities — creation, maintenance, and removal — is managed according to defined procedures. Each identity is assigned to a specific person or non-person entity, and shared accounts are prohibited or strictly controlled. Identity records are kept accurate and are reviewed periodically.',
				whyItMatters:
					'Unmanaged identities — such as shared accounts or orphaned service accounts — cannot be attributed to a specific user, eliminating accountability and creating undetectable attack vectors.',
				whatAuditorExpects:
					'Auditors will review identity management procedures and test that each account in sampled systems maps to a current, approved identity. They will check for periodic review records confirming identities remain valid and appropriately permissioned.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.17',
				title: 'Authentication information',
				description:
					'The allocation and management of authentication information — including passwords, tokens, and cryptographic keys — is controlled by a formal management process. Password policies enforce minimum length, complexity, and rotation. Authentication secrets are never shared and are stored in protected credential management systems.',
				whyItMatters:
					'Weak or improperly managed authentication information is the most common attack vector for account compromise. Enforcing strong credential hygiene dramatically reduces breach risk.',
				whatAuditorExpects:
					'Auditors will review the authentication policy and verify technical enforcement via configuration screenshots or password policy exports. They will check that privileged accounts use MFA and that shared passwords are prohibited.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.18',
				title: 'Access rights',
				description:
					'Access rights are provisioned, reviewed, modified, and removed in accordance with the access control policy and identity management procedures. Formal processes govern access requests and approvals. Periodic access reviews verify that rights remain appropriate and remove any that are excessive or no longer needed.',
				whyItMatters:
					'Access rights that accumulate over time without review ("access creep") silently erode the principle of least privilege and expand the blast radius of any account compromise.',
				whatAuditorExpects:
					'Auditors will request evidence of periodic user access reviews, typically performed quarterly or semi-annually. They will sample access requests and terminations to confirm the approval and revocation process was followed.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.19',
				title: 'Information security in supplier relationships',
				description:
					'Processes are defined and implemented to manage information security risks associated with suppliers, including the use of products and services provided by suppliers. Supplier risk assessments are conducted before onboarding and reviewed periodically. Security requirements are formally communicated to all suppliers who access organizational information or systems.',
				whyItMatters:
					'Third-party vendors are a major source of supply-chain risk. Failing to assess and govern supplier security has led to some of the most damaging breaches in recent years.',
				whatAuditorExpects:
					'Auditors will request the supplier management policy and a register of critical suppliers with associated risk assessments. They will review a sample of supplier security questionnaires and check that high-risk suppliers have contractual security obligations.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.20',
				title: 'Addressing information security within supplier agreements',
				description:
					'Relevant information security requirements are established with each supplier based on the type of supplier, the nature of the information shared, and the associated risk. Security requirements are documented in contracts or service level agreements. Agreements address data handling, breach notification, audit rights, and compliance obligations.',
				whyItMatters:
					'Uncontracted security expectations are unenforceable. Clear contractual security clauses are essential for holding suppliers accountable and for meeting regulatory data-sharing requirements.',
				whatAuditorExpects:
					'Auditors will review sample supplier contracts to confirm they contain information security clauses, including data protection obligations, incident notification timelines, and the right to audit.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.21',
				title: 'Managing information security in the ICT supply chain',
				description:
					'The organization manages information security risks associated with the ICT product and service supply chain, including hardware, software, and cloud components sourced from third parties. Supply chain security requirements are communicated to suppliers and verified where possible. Procedures address the risk of tampered or counterfeit components entering production.',
				whyItMatters:
					'Compromised components in the supply chain can undermine even well-designed internal controls. Supply chain attacks have emerged as a top-tier threat, particularly for software dependencies.',
				whatAuditorExpects:
					'Auditors will ask for supply chain security policies and evidence of software bill of materials (SBOM) processes, dependency scanning, or hardware provenance checks for critical ICT components.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.22',
				title: 'Monitoring, review and change management of supplier services',
				description:
					'Supplier information security practices and service delivery are regularly monitored, reviewed, and evaluated against agreed security requirements. Significant changes to supplier services, including changes to their sub-processors, are formally assessed for security impact. Poor performance or non-compliance is escalated and remediated.',
				whyItMatters:
					'Onboarding a supplier without ongoing oversight means that any deterioration in their security posture goes undetected until it causes an incident affecting your organization.',
				whatAuditorExpects:
					'Auditors will look for supplier review records, such as annual security questionnaire responses or third-party audit reports (e.g., SOC 2 reports), and evidence that supplier changes triggered a formal re-assessment.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.23',
				title: 'Information security for use of cloud services',
				description:
					'The organization establishes and implements processes for the acquisition, use, management, and exit planning of cloud services, addressing information security throughout the cloud service lifecycle. Security roles and responsibilities shared between the organization and cloud providers are clearly defined. Exit procedures ensure data recovery and secure deletion when services are terminated.',
				whyItMatters:
					'Cloud misconfiguration and unclear shared-responsibility boundaries are leading causes of cloud-related data breaches. A governed cloud security process reduces exposure from both issues.',
				whatAuditorExpects:
					'Auditors will request a cloud services inventory, the shared responsibility matrices for each provider, and evidence of security configuration reviews and cloud-specific risk assessments.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.24',
				title: 'Information security incident management planning and preparation',
				description:
					'The organization plans and prepares for information security incident management by defining roles, responsibilities, and procedures for detecting, reporting, assessing, and responding to incidents. An incident response plan is documented, approved, and tested at regular intervals. Contact lists and communication templates are maintained and kept current.',
				whyItMatters:
					'An underprepared organization facing a real incident will respond slowly and make costly mistakes. A tested incident response plan dramatically reduces the time to contain and recover from breaches.',
				whatAuditorExpects:
					'Auditors will review the incident response plan, check that roles are assigned to named individuals, and request evidence of tabletop exercises or simulation tests conducted within the past year.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.25',
				title: 'Assessment and decision on information security events',
				description:
					'Information security events are assessed and a decision is made as to whether they should be classified as information security incidents. A consistent triage process uses defined criteria to distinguish genuine incidents from false positives. Decisions and their rationale are documented to support learning and audit.',
				whyItMatters:
					'Inconsistent event triage leads to under-reporting of real incidents and wasted effort on non-issues. Structured assessment ensures regulatory notification obligations are met on time.',
				whatAuditorExpects:
					'Auditors will review event triage records and confirm that classification criteria are documented. They will sample events to verify that the assessment process was followed and that decisions are traceable.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.26',
				title: 'Response to information security incidents',
				description:
					'Information security incidents are responded to in accordance with documented response procedures. The response covers containment, eradication, recovery, and communication. All response actions are documented in real time to support post-incident review and evidence preservation.',
				whyItMatters:
					'A poorly coordinated incident response prolongs business disruption and increases the scope of data exposure. Documented procedures ensure response is systematic rather than improvised.',
				whatAuditorExpects:
					'Auditors will review incident response procedures and request closed incident records for any incidents that occurred during the audit period, verifying that the documented process was followed and recovery objectives were met.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.27',
				title: 'Learning from information security incidents',
				description:
					'Knowledge gained from analyzing information security incidents is used to strengthen existing controls and prevent recurrence. Post-incident reviews are conducted for all significant incidents and findings are tracked through to implementation. Lessons learned are shared with relevant stakeholders and incorporated into training.',
				whyItMatters:
					'Organizations that do not learn from incidents repeat them. Systematic post-incident learning is a key differentiator between immature and mature security programs.',
				whatAuditorExpects:
					'Auditors will request post-incident review reports and check that identified improvements were logged and tracked. They will verify that recurring incident patterns have resulted in control changes.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.28',
				title: 'Collection of evidence',
				description:
					'The organization establishes and implements procedures for the identification, collection, acquisition, and preservation of evidence related to information security events. Evidence is collected in a forensically sound manner that preserves its integrity and admissibility. Chain of custody is maintained throughout evidence handling.',
				whyItMatters:
					"Improperly collected evidence may be inadmissible in legal or disciplinary proceedings. A sound evidence collection process protects the organization's ability to pursue legal remedies after a serious incident.",
				whatAuditorExpects:
					'Auditors will review evidence handling procedures and check for records of evidence collection in past incidents. They will assess whether chain-of-custody documentation was maintained and whether forensic integrity was preserved.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.29',
				title: 'Information security during disruption',
				description:
					'The organization plans and implements measures to maintain information security at an appropriate level during disruption, including during activation of business continuity plans. Security controls that cannot be maintained at normal levels during disruption are identified and compensating controls are pre-defined. Recovery from disruption includes verification that security controls are restored.',
				whyItMatters:
					'Crises are precisely when attackers exploit reduced vigilance. An organization that lowers its security posture during disruption may recover operationally only to discover it was compromised during the incident.',
				whatAuditorExpects:
					'Auditors will review business continuity plans for embedded security requirements and check that continuity tests validated security controls alongside operational recovery.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.30',
				title: 'ICT readiness for business continuity',
				description:
					'ICT readiness is planned, implemented, maintained, and tested based on business continuity objectives and ICT continuity requirements. Recovery time objectives (RTO) and recovery point objectives (RPO) are defined for critical systems and validated through regular testing. ICT continuity plans are reviewed after tests and after significant changes.',
				whyItMatters:
					'Systems that have never been tested for recovery frequently fail to meet their RTOs when a real disruption occurs. Demonstrated ICT continuity is a key customer trust and contract requirement.',
				whatAuditorExpects:
					'Auditors will request ICT continuity plans and evidence of recovery tests conducted within the past 12 months, including test results showing whether RTO and RPO targets were met and any gaps remediated.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.31',
				title: 'Legal, statutory, regulatory and contractual requirements',
				description:
					'All relevant legal, regulatory, statutory, and contractual requirements applicable to information security are identified, documented, and kept up to date. Compliance obligations are assigned to responsible owners. Changes in legal or regulatory requirements are monitored and their impact on controls is assessed and addressed.',
				whyItMatters:
					'Ignorance of applicable law is not a defence in regulatory proceedings. Failing to track compliance obligations exposes the organization to fines, litigation, and reputational damage.',
				whatAuditorExpects:
					'Auditors will review a compliance obligations register and check that it is current and owned. They will verify that each identified obligation is mapped to a control or process that addresses it.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.32',
				title: 'Intellectual property rights',
				description:
					'Procedures are implemented to protect intellectual property rights, including compliance with legal requirements for the use of proprietary software, content, and other third-party intellectual property. Software license inventories are maintained and reviewed. Unauthorized copying or distribution of protected material is prohibited and enforced.',
				whyItMatters:
					'Using unlicensed software or violating IP rights exposes the organization to significant legal liability and is frequently discovered during due diligence that precedes enterprise deals or acquisitions.',
				whatAuditorExpects:
					'Auditors will request the software license register and compare it against installed software. They will check for policies on IP rights and evidence that employees have been trained on acceptable use of third-party content.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.33',
				title: 'Protection of records',
				description:
					'Records are protected from loss, destruction, falsification, unauthorized access, and unauthorized release in accordance with legal, regulatory, contractual, and business requirements. Retention schedules define how long records must be kept and the appropriate disposal method when retention periods expire. Record integrity is protected through access controls and audit trails.',
				whyItMatters:
					'Inability to produce records during an audit or legal proceeding can result in adverse findings. Equally, retaining records beyond their required period unnecessarily increases data breach exposure.',
				whatAuditorExpects:
					'Auditors will review records management policies and retention schedules, and test that key records (contracts, audit logs, security records) are accessible and have not been tampered with.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.34',
				title: 'Privacy and protection of personal information (PII)',
				description:
					'The organization identifies and meets applicable requirements for the privacy and protection of personally identifiable information (PII) in accordance with relevant legislation and regulations. A privacy framework or policy defines how PII is collected, processed, stored, and deleted. Data subject rights are addressed and privacy by design principles are applied.',
				whyItMatters:
					'Privacy regulations such as GDPR and CCPA carry significant financial penalties. Beyond compliance, privacy failures erode customer trust in ways that are difficult and expensive to rebuild.',
				whatAuditorExpects:
					'Auditors will review the privacy policy, data processing records, and evidence of privacy impact assessments for new data-heavy features. They will check that mechanisms exist for data subjects to exercise their rights.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.35',
				title: 'Independent review of information security',
				description:
					"The organization's approach to managing information security is reviewed independently at planned intervals or when significant changes occur. Reviews may be conducted by internal audit, external auditors, or qualified third parties. Findings are reported to management and drive improvements to the information security management system.",
				whyItMatters:
					'Internal assessments can develop blind spots. Independent review provides objective assurance that the ISMS is operating effectively and identifies improvements that insiders may have missed.',
				whatAuditorExpects:
					'Auditors will request independent review reports (e.g., internal audit reports or third-party assessment reports) and evidence that management reviewed findings and that action plans were tracked to completion.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.36',
				title: 'Compliance with policies, rules and standards for information security',
				description:
					'Managers regularly review the compliance of information processing and procedures within their area of responsibility with applicable security policies, standards, and other compliance requirements. Non-compliance is identified, documented, and remediated. Results of compliance reviews are reported to senior management.',
				whyItMatters:
					'Policies without compliance verification are just aspirational documents. Regular compliance checks close the gap between what the policy says and what actually happens in practice.',
				whatAuditorExpects:
					'Auditors will look for compliance review schedules and records, including any findings of non-compliance and the remediation actions taken. They will test a sample of areas to independently verify compliance status.',
				category: 'Organizational Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '5.37',
				title: 'Documented operating procedures',
				description:
					'Operating procedures for information processing facilities and activities are documented, maintained, and made available to all personnel who need them. Procedures cover routine operations, startup and shutdown, error handling, backup, and maintenance. Procedures are reviewed and updated when processes change.',
				whyItMatters:
					'Undocumented procedures create key-person dependency and lead to inconsistent execution. When a key employee leaves or is unavailable, undocumented processes break down and controls fail.',
				whatAuditorExpects:
					'Auditors will request operating procedure documentation for critical systems and compare documented steps against actual practice. They will verify that procedures are version-controlled and accessible to the relevant personnel.',
				category: 'Organizational Controls'
			},
			// Theme: People Controls
			{
				frameworkId: isoFramework.id,
				code: '6.1',
				title: 'Screening',
				description:
					'Background verification checks are conducted for all candidates for employment, contractors, and relevant third-party personnel in accordance with applicable laws and proportionate to the classification of information they will access. Checks are repeated periodically for roles with elevated access to sensitive information. The scope of screening is documented and consistently applied.',
				whyItMatters:
					'Hiring individuals without adequate screening creates insider threat risk and can violate contractual obligations with customers who require background checks for staff with access to their data.',
				whatAuditorExpects:
					'Auditors will review the screening policy and request records for sampled employees showing that checks were completed prior to start date. They will verify that the scope of checks is proportionate to the sensitivity of the role.',
				category: 'People Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '6.2',
				title: 'Terms and conditions of employment',
				description:
					'Employment contracts and agreements state the responsibilities of both employees and the organization with respect to information security. Employees acknowledge their obligations regarding confidentiality, acceptable use, and compliance with security policies as a condition of employment. Security obligations are reviewed and re-acknowledged when policies change significantly.',
				whyItMatters:
					"Without contractual security obligations, employees have no legally enforceable duty to protect information. This weakens the organization's recourse in the event of a security violation.",
				whatAuditorExpects:
					'Auditors will review employment contract templates for security clauses and check that signed contracts are on file for all employees, including remote or part-time staff.',
				category: 'People Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '6.3',
				title: 'Information security awareness, education and training',
				description:
					'All personnel receive appropriate information security awareness education and training, and regular updates on organizational policies and procedures relevant to their role. Specialized security training is provided for personnel in roles with heightened security responsibilities, such as developers or system administrators. Training completion is tracked and records are retained.',
				whyItMatters:
					'Humans remain the most exploited attack vector. Regular, role-appropriate security training measurably reduces successful phishing attacks, misconfigurations, and data handling errors.',
				whatAuditorExpects:
					'Auditors will request training completion records for all employees covering the audit period. They will check that training content is updated regularly and that staff in high-risk roles receive additional specialized training.',
				category: 'People Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '6.4',
				title: 'Disciplinary process',
				description:
					'A formal disciplinary process is established and communicated that addresses information security policy violations. The process is applied consistently and proportionately, ranging from informal counseling to termination depending on severity. Personnel are aware of the disciplinary process at the time of hire.',
				whyItMatters:
					'Without a credible and consistently applied disciplinary process, policy violations go unchallenged, signaling to staff that security rules are optional and undermining the entire compliance program.',
				whatAuditorExpects:
					'Auditors will review the disciplinary policy and verify it explicitly covers information security violations. They may request anonymized records demonstrating that the process has been applied.',
				category: 'People Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '6.5',
				title: 'Responsibilities after termination or change of employment',
				description:
					'Information security responsibilities and obligations that remain valid after termination or change of employment are defined, enforced, and communicated to the individual. This includes ongoing confidentiality obligations and restrictions on the use of organizational information. Exit procedures are documented and executed consistently.',
				whyItMatters:
					'Data theft by departing employees is a common and damaging event. Clear post-employment obligations and timely access revocation reduce the risk of data exfiltration at departure.',
				whatAuditorExpects:
					'Auditors will review exit procedures and check that offboarding checklists include confirmation that ongoing security obligations were communicated, signed off, and access revoked on the last day of employment.',
				category: 'People Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '6.6',
				title: 'Confidentiality or non-disclosure agreements',
				description:
					"Requirements for confidentiality or non-disclosure agreements (NDAs) are identified, documented, regularly reviewed, and signed by employees, contractors, and relevant third parties. NDAs reflect the organization's requirements for protecting information and are proportionate to the sensitivity of information accessed. Signed NDAs are retained and managed.",
				whyItMatters:
					'NDAs establish a legally enforceable duty of confidentiality and deter casual sharing of sensitive information. Many enterprise customer contracts require proof that your staff have signed NDAs covering access to their data.',
				whatAuditorExpects:
					'Auditors will review the NDA template and request signed NDA records for a sample of employees and contractors. They will check that NDAs are re-executed when roles change significantly or when agreements are updated.',
				category: 'People Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '6.7',
				title: 'Remote working',
				description:
					'Policies and supporting security measures are implemented to protect information accessed, processed, or stored at remote working locations. Controls address secure network connectivity, endpoint security, physical security of the remote environment, and handling of physical documents. Remote working arrangements are formally authorized and reviewed.',
				whyItMatters:
					'Remote working expands the attack surface significantly beyond the corporate perimeter. Without specific remote working controls, home networks and personal devices become ingress points for attackers.',
				whatAuditorExpects:
					'Auditors will review the remote working policy and check for technical controls such as VPN or zero-trust network access requirements, MDM enrollment for remote devices, and screen lock policies enforced on endpoints.',
				category: 'People Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '6.8',
				title: 'Information security event reporting',
				description:
					'A mechanism is provided for all personnel to report observed or suspected information security events — including policy violations, weaknesses, and near misses — through appropriate channels as quickly as possible. The reporting channel is publicized and accessible. Personnel are encouraged to report without fear of reprisal.',
				whyItMatters:
					'Many significant incidents begin as small, observable anomalies. A culture and mechanism for easy reporting allows early detection that can prevent minor events from escalating into major breaches.',
				whatAuditorExpects:
					'Auditors will check for a documented reporting mechanism (e.g., a security mailbox, ticketing system, or hotline) and evidence that it has been communicated to all staff. They will review a sample of reports received and confirm they were triaged.',
				category: 'People Controls'
			},
			// Theme: Physical Controls
			{
				frameworkId: isoFramework.id,
				code: '7.1',
				title: 'Physical security perimeters',
				description:
					'Security perimeters are defined and used to protect areas containing information and associated assets. Perimeters are clearly defined with physical barriers, and the strength of each perimeter is commensurate with the sensitivity of the information within. Multiple perimeters (e.g., building perimeter, server room) are used to provide defense in depth.',
				whyItMatters:
					'Physical access to servers or workstations can bypass all logical controls entirely. Physical perimeters are the first line of defense against unauthorized physical access to critical infrastructure.',
				whatAuditorExpects:
					'Auditors will review physical security policies and inspect or request photographs/floor plans showing perimeter controls. They will check access logs for sensitive areas and evidence of periodic physical security reviews.',
				category: 'Physical Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '7.2',
				title: 'Physical entry',
				description:
					'Secure areas are protected by appropriate entry controls ensuring that only authorized personnel are allowed access. Entry controls include electronic access cards, PIN pads, biometrics, or security guards as appropriate to the sensitivity of the area. Access events are logged, and logs are retained and reviewed for anomalies.',
				whyItMatters:
					'Unauthorized physical entry to server rooms or offices can result in hardware theft, direct data access, or installation of malicious devices. Controlled entry is a prerequisite for effective physical security.',
				whatAuditorExpects:
					'Auditors will review the list of authorized personnel for secure areas and cross-reference it with current employment records. They will request physical access logs and evidence that anomalies or tailgating incidents were investigated.',
				category: 'Physical Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '7.3',
				title: 'Securing offices, rooms and facilities',
				description:
					'Physical security is designed and applied to offices, rooms, and facilities. Sensitive areas are located away from public access zones, visitor access is controlled and supervised, and physical security measures are proportionate to the risk. Facilities security is reviewed whenever the organization moves, expands, or changes its physical security posture.',
				whyItMatters:
					'Even non-data-center spaces contain sensitive information on screens, whiteboards, and printed documents. Unsecured offices are a significant vector for visual eavesdropping and document theft.',
				whatAuditorExpects:
					'Auditors will check for a physical security policy covering offices and may conduct or review a physical walkthrough inspection. They will look for evidence of visitor management logs and clean desk compliance checks.',
				category: 'Physical Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '7.4',
				title: 'Physical security monitoring',
				description:
					'Premises are continuously monitored for unauthorized physical access using CCTV, security patrols, alarm systems, or equivalent mechanisms appropriate to the risk level. Monitoring recordings are retained for a defined period and reviewed in response to security incidents. Monitoring systems are tested regularly to verify they are operational.',
				whyItMatters:
					'Monitoring deters unauthorized physical access and provides evidence for investigations when incidents occur. Without monitoring, physical intrusions may go undetected and unattributed.',
				whatAuditorExpects:
					'Auditors will request evidence that physical monitoring systems (CCTV, alarms) are operational and that recordings are retained for the defined period. They will check whether monitoring alerts are reviewed and acted upon.',
				category: 'Physical Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '7.5',
				title: 'Protecting against physical and environmental threats',
				description:
					'Physical protection is designed and applied against natural disasters (fire, flood, earthquake) and human-caused physical threats (vandalism, sabotage). Site risk assessments consider local environmental hazards. Protective measures include fire suppression, flood barriers, uninterruptible power supplies, and temperature control for equipment rooms.',
				whyItMatters:
					'Environmental failures can destroy entire data center environments in minutes. Adequate physical and environmental protection is essential for meeting availability commitments to customers.',
				whatAuditorExpects:
					'Auditors will review the physical and environmental threat assessment and check for evidence that protections such as fire suppression, UPS systems, and temperature monitoring are in place and tested.',
				category: 'Physical Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '7.6',
				title: 'Working in secure areas',
				description:
					'Security measures are designed and applied for working in secure areas to prevent unauthorized information disclosure or interference. Rules prohibit unnecessary equipment or personal devices in secure areas. Work performed in secure areas is supervised or controlled, and unsupervised visitors are not permitted.',
				whyItMatters:
					'Secure areas are designated precisely because of the sensitivity of the operations within them. Lax behaviour within secure areas can circumvent perimeter controls that are otherwise effective.',
				whatAuditorExpects:
					'Auditors will review the rules for working in secure areas and check for evidence that they are enforced, such as device-free zone policies, clean desk checks, or access restrictions on personal devices.',
				category: 'Physical Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '7.7',
				title: 'Clear desk and clear screen',
				description:
					'Clear desk and clear screen rules are defined, documented, and enforced to reduce the risk of unauthorized access to or loss of information. Physical documents and removable storage media are locked away when unattended. Screen locks engage automatically after a defined period of inactivity and require authentication to unlock.',
				whyItMatters:
					'Information left on screens or desks can be seen by unauthorized individuals, including visitors, contractors, and members of the public in open-plan offices. Clear desk policies are a low-cost, high-impact control.',
				whatAuditorExpects:
					'Auditors will review the clear desk and clear screen policy and check that screen lock timeouts are technically enforced. They may conduct or review records of physical compliance walkthroughs.',
				category: 'Physical Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '7.8',
				title: 'Equipment siting and protection',
				description:
					'Equipment is sited and protected to reduce risks from environmental threats, opportunities for unauthorized access, and physical damage. Sensitive equipment is placed to minimize visibility from public areas. Equipment is protected from power surges, electrostatic discharge, and physical damage from human activity.',
				whyItMatters:
					'Poorly sited equipment is vulnerable to both deliberate attack and accidental damage. Appropriate placement and protection extends equipment life and reduces unplanned outages.',
				whatAuditorExpects:
					'Auditors will review equipment placement guidelines and may inspect or request photos of equipment rooms. They will check that sensitive equipment is not visible from public-facing windows and that environmental monitoring is in place.',
				category: 'Physical Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '7.9',
				title: 'Security of assets off-premises',
				description:
					"Security measures are applied to assets used outside the organization's premises, such as laptops, mobile phones, and removable media. Off-premises assets are inventoried and tracked. Users are made aware of their responsibilities for securing assets when working remotely or travelling.",
				whyItMatters:
					'Mobile devices and laptops are among the most frequently lost or stolen organizational assets. Without specific off-premises controls, loss of a single device can expose significant quantities of sensitive data.',
				whatAuditorExpects:
					'Auditors will check that off-premises asset handling is covered in policy and that technical controls such as full-disk encryption and remote wipe are enabled on mobile devices. They will look for records of any off-premises asset losses and how they were handled.',
				category: 'Physical Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '7.10',
				title: 'Storage media',
				description:
					'Storage media are managed throughout their lifecycle — from acquisition and use through transportation and secure disposal or re-use. Procedures ensure that sensitive data is securely erased or media is physically destroyed before re-use or disposal. Media containing sensitive information is transported with appropriate protections.',
				whyItMatters:
					'Discarded storage media that has not been securely erased remains a significant source of data breaches. Many high-profile incidents have involved improperly disposed hard drives and USB drives.',
				whatAuditorExpects:
					'Auditors will review storage media management procedures and request evidence of secure disposal records — such as certificates of destruction — for a sample of decommissioned media.',
				category: 'Physical Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '7.11',
				title: 'Supporting utilities',
				description:
					'Information processing facilities are protected from power failures and other disruptions caused by failures of supporting utilities such as electricity, telecommunications, water, and cooling. Redundant utility feeds, UPS systems, and generator backup are provided for critical facilities in proportion to their availability requirements. Utilities are regularly inspected and tested.',
				whyItMatters:
					'A power failure without adequate backup will take down entire production environments, directly violating availability SLAs with customers and potentially causing data loss.',
				whatAuditorExpects:
					'Auditors will request records of utility redundancy testing (e.g., UPS failover tests, generator tests) and review contracts for utility services to confirm redundancy provisions. They will check maintenance records for critical utility equipment.',
				category: 'Physical Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '7.12',
				title: 'Cabling security',
				description:
					'Power and telecommunications cabling carrying data or supporting information services is protected from interception, interference, or damage. Network and power cabling is routed through controlled conduits, separated where necessary, and labelled to prevent accidental disconnection. Physical access to cable distribution frames and patch panels is restricted.',
				whyItMatters:
					'Exposed or poorly managed cabling provides an easy opportunity for physical eavesdropping or deliberate disruption. Secure cabling practices protect both data confidentiality and system availability.',
				whatAuditorExpects:
					'Auditors may request a physical inspection or photographs of cabling infrastructure. They will check that cable management plans exist, that sensitive cables are physically protected, and that network cabling is labelled.',
				category: 'Physical Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '7.13',
				title: 'Equipment maintenance',
				description:
					'Equipment is maintained correctly to ensure continued availability, integrity, and confidentiality. Maintenance schedules are followed, and only authorized personnel perform maintenance. Maintenance carried out on equipment containing sensitive information is performed under supervision, and all equipment leaving premises for maintenance is securely handled.',
				whyItMatters:
					'Poorly maintained equipment fails at inconvenient and unpredictable times, threatening availability. Unsupervised maintenance by external parties creates a risk of data theft or deliberate tampering.',
				whatAuditorExpects:
					'Auditors will review equipment maintenance schedules and records. They will check that maintenance procedures address data security during external servicing, including procedures for secure data handling when equipment is sent off-site.',
				category: 'Physical Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '7.14',
				title: 'Secure disposal or re-use of equipment',
				description:
					'All equipment containing storage media is verified to ensure that sensitive data and licensed software has been removed or securely overwritten prior to disposal or re-use. The method of disposal or data erasure is proportionate to the sensitivity of the information and is documented. Physical destruction is used for media that cannot be reliably erased.',
				whyItMatters:
					'Equipment disposal without proper data sanitization is a routine cause of data breaches. Regulatory bodies view improper disposal seriously and it can result in significant fines under data protection laws.',
				whatAuditorExpects:
					'Auditors will request disposal records for decommissioned equipment, including certificates of data destruction or evidence of secure erasure. They will check that disposal procedures are documented and consistently followed.',
				category: 'Physical Controls'
			},
			// Theme: Technological Controls
			{
				frameworkId: isoFramework.id,
				code: '8.1',
				title: 'User endpoint devices',
				description:
					'Information stored on, processed on, or accessible via user endpoint devices (laptops, desktops, mobiles, tablets) is protected through endpoint security controls. Controls include full-disk encryption, malware protection, screen lock, patch management, and mobile device management (MDM) enrollment. Unmanaged personal devices are prohibited from accessing organizational data unless controlled through approved BYOD policies.',
				whyItMatters:
					'Endpoints are the primary target for attackers attempting to steal credentials or install ransomware. Unprotected endpoints can compromise entire networks when a single device is lost or infected.',
				whatAuditorExpects:
					'Auditors will request MDM or endpoint management reports showing enrollment status, encryption compliance, and patch levels across the device fleet. They will verify that MDM policies are configured to enforce screen lock, remote wipe, and disk encryption.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.2',
				title: 'Privileged access rights',
				description:
					'Privileged access rights — such as administrator, root, or service account access — are restricted to the minimum necessary, formally allocated, and subject to enhanced controls including MFA and session recording. Privileged accounts are not used for routine daily work. Privileged access is reviewed more frequently than standard access.',
				whyItMatters:
					'Privileged accounts are the highest-value target for attackers. Compromise of a single privileged account can result in complete system takeover, making tight privileged access management a critical security control.',
				whatAuditorExpects:
					'Auditors will request a list of privileged accounts and verify that MFA is enforced. They will check that privileged access requests require elevated approval, that privileged accounts are not used for standard work tasks, and that access is reviewed at defined intervals.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.3',
				title: 'Information access restriction',
				description:
					'Access to information and application system functions is restricted in accordance with the access control policy, applying the principle of least privilege. Access controls are implemented at the system and application level and prevent users from accessing information beyond the scope of their role. Menu-driven interfaces restrict functionality for users without elevated permissions.',
				whyItMatters:
					'Unrestricted access at the application level means that any compromised user account can access all data in the system. Granular access restriction limits the damage from both external compromise and insider misuse.',
				whatAuditorExpects:
					'Auditors will test access controls by attempting to access resources outside defined role boundaries. They will review access control matrix documentation and verify that application-level permissions are consistently enforced.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.4',
				title: 'Access to source code',
				description:
					'Read and write access to source code, software libraries, and development tools is managed according to the access control policy. Source code repositories enforce authentication and authorization. Write access to production branches is restricted to authorized developers and protected by code review requirements. Access to source code is logged.',
				whyItMatters:
					'Unauthorized modification of source code — whether by insiders or through supply chain attacks — can introduce backdoors, vulnerabilities, or malicious logic directly into production systems.',
				whatAuditorExpects:
					'Auditors will review repository access controls and branch protection settings. They will check that direct commits to main or production branches are restricted, that code review is enforced, and that repository access is limited to current authorized developers.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.5',
				title: 'Secure authentication',
				description:
					'Secure authentication technologies and procedures are implemented across all systems based on the sensitivity of the information accessed. Multi-factor authentication (MFA) is required for all remote access, privileged accounts, and access to systems processing sensitive information. Password policies enforce minimum length, complexity, and reuse restrictions. Authentication attempts are limited and brute-force protection is in place.',
				whyItMatters:
					'Authentication vulnerabilities are exploited in the majority of breaches. Strong, consistently enforced authentication is one of the highest-return investments in security.',
				whatAuditorExpects:
					'Auditors will verify MFA enforcement through system configuration screenshots or policy exports. They will test password policy enforcement and check that failed authentication attempt alerts are configured and reviewed.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.6',
				title: 'Capacity management',
				description:
					'The use of resources is monitored and projections made of future capacity needs to ensure required system performance is maintained. Capacity planning considers storage, compute, network bandwidth, and database limits. Thresholds are set and alerts raised when resource utilization approaches limits, allowing proactive scaling before availability is impacted.',
				whyItMatters:
					'Capacity failures cause service outages that violate availability SLAs and erode customer trust. Proactive capacity management is far less costly than emergency scaling during an outage.',
				whatAuditorExpects:
					'Auditors will look for capacity monitoring dashboards or reports showing resource utilization trends. They will check that capacity thresholds and alerting are configured and that capacity planning occurs at defined intervals.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.7',
				title: 'Protection against malware',
				description:
					'Protection against malware is implemented across all applicable endpoints, servers, and email gateways. Anti-malware software is kept up to date with current definitions, and scans run at regular intervals or on access. User awareness of the malware threat is maintained through regular training, with specific emphasis on phishing and social engineering.',
				whyItMatters:
					'Malware — including ransomware — remains the most prevalent cause of serious incidents affecting small and mid-size businesses. A single unprotected device can be the entry point that compromises the entire organization.',
				whatAuditorExpects:
					'Auditors will request anti-malware deployment reports showing coverage across all in-scope endpoints and servers. They will verify that definitions are current and that scan logs or dashboards are reviewed regularly.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.8',
				title: 'Management of technical vulnerabilities',
				description:
					"Timely information about technical vulnerabilities is obtained, the organization's exposure to those vulnerabilities is evaluated, and appropriate actions are taken in accordance with a defined vulnerability management policy. Vulnerability scanning runs on a regular cadence, and critical and high vulnerabilities are remediated within defined SLAs. Patch management processes are documented and followed.",
				whyItMatters:
					'Unpatched vulnerabilities are one of the most reliably exploited attack vectors. A structured vulnerability management program dramatically reduces the window of exposure after vulnerabilities are publicly disclosed.',
				whatAuditorExpects:
					'Auditors will request vulnerability scan reports and patch management records. They will check that critical vulnerabilities were remediated within the defined SLA and that scan coverage extends across all in-scope systems.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.9',
				title: 'Configuration management',
				description:
					'Configurations, including security configurations, are established, documented, implemented, monitored, and reviewed for all hardware, software, services, and networks. Baseline security configurations are defined and enforced using configuration management tooling. Deviations from baseline are detected, reviewed, and remediated.',
				whyItMatters:
					'Configuration drift silently degrades the security posture of systems over time. Automated configuration management ensures that security settings remain consistent and compliant across the entire environment.',
				whatAuditorExpects:
					'Auditors will request baseline configuration documents and evidence of automated configuration compliance scanning. They will check that configuration drift alerts are reviewed and that deviations are remediated within defined timeframes.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.10',
				title: 'Information deletion',
				description:
					'Information stored in information systems, devices, or other storage media is deleted when no longer required using secure deletion methods appropriate to the sensitivity of the information. Deletion is performed according to retention schedules and in compliance with legal and contractual obligations. Records of secure deletion are maintained for sensitive or regulated data.',
				whyItMatters:
					'Retaining data beyond its required period unnecessarily increases the volume of data at risk. Secure deletion reduces breach impact and is increasingly required by privacy regulations.',
				whatAuditorExpects:
					'Auditors will review data retention and deletion policies and check for evidence that deletion procedures are executed and documented. They will verify that secure deletion methods (not just delete or format) are used for sensitive data.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.11',
				title: 'Data masking',
				description:
					'Data masking is used in accordance with the access control and business requirement policies to protect sensitive data from exposure in non-production environments, reporting, and external sharing scenarios. Masking techniques such as tokenization, pseudonymization, and redaction are applied based on the sensitivity of the data and the context of its use.',
				whyItMatters:
					'Developers and testers working with real production data expose sensitive information to a much wider group than necessary. Data masking ensures that sensitive data is protected even in low-security environments.',
				whatAuditorExpects:
					'Auditors will check that test and development environments do not contain live production data, or that data masking controls are in place. They will review data masking policies and test that sensitive fields are appropriately masked in non-production contexts.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.12',
				title: 'Data leakage prevention',
				description:
					'Data leakage prevention (DLP) measures are applied to systems, networks, and devices to detect and prevent the unauthorized transmission or exfiltration of sensitive information. DLP rules are defined based on data classification and enforced at endpoints, email gateways, and network egress points. DLP alerts are monitored and responded to promptly.',
				whyItMatters:
					'Sensitive data can leave the organization through many channels — email, USB, cloud storage, screenshots. DLP provides a technical backstop that reduces the risk of inadvertent or deliberate data exfiltration.',
				whatAuditorExpects:
					'Auditors will review DLP policy configuration and coverage. They will check that DLP alerts are reviewed and investigated, and that incidents involving potential data leakage are escalated through the incident management process.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.13',
				title: 'Information backup',
				description:
					'Backup copies of information, software, and systems are maintained and regularly tested in accordance with defined backup policies. Backup frequency, retention, and storage locations are aligned with recovery time and recovery point objectives. Backups are stored in a separate location from the primary data, and access to backups is restricted.',
				whyItMatters:
					'Without tested backups, ransomware or accidental data deletion can cause permanent data loss. Backups are the last line of defense against data loss incidents and are a non-negotiable requirement for most customer contracts.',
				whatAuditorExpects:
					'Auditors will review backup policies and request evidence of recent backup completion and restoration tests. They will check that backup retention aligns with defined RPOs and that test restoration records demonstrate successful recovery.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.14',
				title: 'Redundancy of information processing facilities',
				description:
					'Sufficient redundancy is implemented across information processing facilities to meet the availability requirements of critical systems and services. Redundancy is achieved through techniques such as load balancing, failover clustering, geographic distribution, and multi-AZ deployment. Redundancy mechanisms are tested regularly to verify they activate correctly under failure conditions.',
				whyItMatters:
					"A single point of failure in critical infrastructure can cause complete service outages. Demonstrated redundancy is required to support uptime SLAs and build customer confidence in the platform's reliability.",
				whatAuditorExpects:
					'Auditors will request architecture diagrams showing redundancy design and failover test records demonstrating that redundancy mechanisms have been tested and function as intended.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.15',
				title: 'Logging',
				description:
					'Logs recording user activities, exceptions, faults, and information security events are produced, stored, protected, and analyzed. Log retention periods are defined and meet legal and regulatory requirements. Logs are protected from tampering, unauthorized access, and premature deletion. Critical system and security logs are centralized in a log management or SIEM system.',
				whyItMatters:
					'Logs are the primary source of evidence for investigating security incidents. Without adequate logging and retention, incidents cannot be investigated, root cause cannot be determined, and regulatory reporting requirements may not be met.',
				whatAuditorExpects:
					'Auditors will verify that logging is enabled across all in-scope systems and that logs are centralized and retained for the defined period. They will test log integrity controls and review evidence that logs are regularly reviewed for security events.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.16',
				title: 'Monitoring activities',
				description:
					'Networks, systems, and applications are monitored for anomalous behavior, and actions are taken to evaluate and respond to potential information security incidents. Monitoring rules and thresholds are defined, documented, and tuned to reduce false positives while catching genuine threats. Monitoring outcomes are reviewed by qualified personnel on a regular basis.',
				whyItMatters:
					'Logs are only useful if they are actively monitored. Real-time monitoring with automated alerting is the difference between detecting a breach in minutes versus discovering it months later.',
				whatAuditorExpects:
					'Auditors will review monitoring configurations and alert rules. They will request a sample of monitoring alerts and incident tickets to confirm that alerts are being received, reviewed, and actioned within defined SLAs.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.17',
				title: 'Clock synchronization',
				description:
					'The clocks of all information processing systems within the organization are synchronized to approved time sources using NTP or equivalent protocols. Accurate timestamps are essential for correlating log events across systems during incident investigations. Clock synchronization is monitored and alerts are raised when systems drift beyond acceptable thresholds.',
				whyItMatters:
					'Unsynchronized clocks make it impossible to correlate security events across systems, severely hampering incident investigations and potentially rendering log evidence inadmissible.',
				whatAuditorExpects:
					'Auditors will verify NTP configuration across sampled systems and check that all systems reference the same approved time source. They will look for monitoring evidence confirming clock synchronization compliance.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.18',
				title: 'Use of privileged utility programs',
				description:
					'The use of utility programs capable of overriding system or application controls — such as diagnostic tools, OS utilities, and administrative scripts — is restricted to a minimum, tightly controlled, and logged. Use of such tools outside approved maintenance windows requires change control approval. Access to utilities is restricted to authorized system administrators.',
				whyItMatters:
					'Privileged utilities can be used to bypass security controls, extract data, or modify system behavior in ways that leave no obvious audit trail. Tight control over their use prevents both deliberate misuse and accidental damage.',
				whatAuditorExpects:
					'Auditors will check that privileged utility access is restricted and logged. They will review a sample of utility usage logs to confirm that use was authorized and occurred within approved windows.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.19',
				title: 'Installation of software on operational systems',
				description:
					'Procedures control the installation of software on operational systems, ensuring only authorized software is installed. Software installation on production systems requires change management approval, testing in non-production environments, and verification against an approved software list. Unauthorized software is detected through endpoint management tooling and remediated.',
				whyItMatters:
					'Unauthorized software on production systems can introduce vulnerabilities, consume system resources, or exfiltrate data. Shadow IT in production environments has been the cause of numerous serious security incidents.',
				whatAuditorExpects:
					'Auditors will review software installation policies and request evidence from endpoint management tools showing software inventory and compliance with the approved software list. They will check change records for recent software deployments to production.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.20',
				title: 'Networks security',
				description:
					'Networks are secured, managed, and controlled to protect information in systems and applications from unauthorized access and attack. Network security controls include firewalls, intrusion detection and prevention systems, network segmentation, and encrypted communications. Network security architecture is documented and reviewed when significant changes are made.',
				whyItMatters:
					'The network is the primary pathway through which attackers move laterally after gaining an initial foothold. Strong network security controls limit the reach of compromises and protect sensitive systems.',
				whatAuditorExpects:
					'Auditors will review network architecture diagrams and firewall rule sets. They will check that network security controls are configured according to documented policies and that rule sets are reviewed periodically to remove outdated rules.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.21',
				title: 'Security of network services',
				description:
					'Security mechanisms, service levels, and management requirements for all network services — including cloud-based and third-party network services — are identified, implemented, and monitored. Service agreements with network service providers include security requirements. Network service security performance is reviewed regularly against agreed requirements.',
				whyItMatters:
					'Organizations depend on network services for connectivity, DNS, and CDN. Security failures in these services can cause outages or enable man-in-the-middle attacks affecting customers.',
				whatAuditorExpects:
					'Auditors will review network service agreements for security requirements and check evidence of regular service performance and security review against those requirements.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.22',
				title: 'Segregation of networks',
				description:
					'Groups of information services, users, and information systems are segregated in networks using VLANs, firewalls, DMZs, and other segmentation techniques. Production environments are segregated from development and test environments. The cardholder data environment or other sensitive enclaves are isolated from general corporate networks.',
				whyItMatters:
					'Flat networks allow a breach in any one area to immediately spread across the entire environment. Network segmentation contains breaches and prevents lateral movement by limiting what a compromised system can reach.',
				whatAuditorExpects:
					'Auditors will review network segmentation architecture and test that segment boundaries are enforced. They will check that traffic between segments is controlled by firewall rules and that sensitive environments are appropriately isolated.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.23',
				title: 'Web filtering',
				description:
					'Access to external websites is managed to reduce exposure to malicious content, phishing sites, and drive-by malware downloads. Web filtering controls block known malicious URLs, enforce safe browsing policies, and provide alerts on potentially dangerous access attempts. Web filtering policies are reviewed and updated to address emerging threats.',
				whyItMatters:
					'Web browsing is a primary vector for malware delivery and phishing attacks. Web filtering provides an automated first layer of defense against web-based threats, reducing the likelihood of successful compromise.',
				whatAuditorExpects:
					'Auditors will review web filtering policies and verify that filtering is technically enforced across all endpoints. They will check that filtering covers both managed devices and remote workers and that the block list is regularly updated.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.24',
				title: 'Use of cryptography',
				description:
					'Rules are defined and implemented for the effective use of cryptography, including key management, to protect the confidentiality, authenticity, and integrity of information. Cryptographic algorithms and key lengths meet current standards (e.g., AES-256, RSA-2048 minimum). Cryptographic keys have defined lifetimes, and key rotation and revocation procedures are documented and followed.',
				whyItMatters:
					'Weak or mismanaged cryptography can render encrypted data effectively unprotected. Cryptographic failures expose sensitive data and are consistently listed among the top security risks by OWASP.',
				whatAuditorExpects:
					'Auditors will review cryptography and key management policies. They will check that encryption standards meet current requirements, that keys are stored in dedicated key management systems, and that rotation schedules are being followed.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.25',
				title: 'Secure development lifecycle',
				description:
					'Rules and procedures for the secure development of software and systems are established and applied throughout the software development lifecycle (SDLC). Security activities — including threat modelling, security requirements definition, secure design review, and security testing — are integrated at each SDLC phase. Developers receive secure coding training appropriate to their technology stack.',
				whyItMatters:
					'Most application vulnerabilities are introduced during development. Embedding security into the SDLC is far more effective and cost-efficient than attempting to fix vulnerabilities after release.',
				whatAuditorExpects:
					'Auditors will review the secure SDLC policy and check for evidence of security activities at SDLC gates, such as threat modelling outputs, security requirement sign-offs, and DAST/SAST results from the build pipeline.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.26',
				title: 'Application security requirements',
				description:
					'Information security requirements are identified, specified, and approved when developing or acquiring applications. Security requirements are treated as non-functional requirements alongside performance and reliability, and are documented in functional and technical specifications. Third-party or off-the-shelf applications are evaluated for security before procurement.',
				whyItMatters:
					'Applications built or procured without explicit security requirements will predictably lack critical security features, requiring expensive remediation or accepting unacceptable risk.',
				whatAuditorExpects:
					'Auditors will review application security requirement documents for recent projects and check that security requirements were reviewed and approved before development commenced. They will check that third-party application assessments are documented.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.27',
				title: 'Secure system architecture and engineering principles',
				description:
					'Security engineering principles are established, documented, maintained, and applied to any engineering activity for new systems or changes to existing systems. Principles include defense in depth, least privilege, secure defaults, fail-safe posture, and economy of mechanism. Architecture decisions are reviewed against security principles before implementation.',
				whyItMatters:
					'Poor architectural decisions create security weaknesses that are expensive and sometimes impossible to remediate post-deployment. Sound security architecture prevents entire classes of vulnerabilities from being introduced.',
				whatAuditorExpects:
					'Auditors will review security architecture principles documentation and check for evidence of architectural review processes. They will examine recent architecture decision records to verify that security engineering principles were applied.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.28',
				title: 'Secure coding',
				description:
					'Secure coding principles are applied to software development to prevent the introduction of vulnerabilities. Coding standards reference common vulnerability classes (OWASP Top 10, CWE) and mandate mitigations such as input validation, output encoding, parameterized queries, and proper error handling. Automated static analysis (SAST) tools are integrated into the development pipeline to detect common coding flaws.',
				whyItMatters:
					'Application vulnerabilities such as SQL injection and XSS remain pervasive and are directly attributable to failure to follow secure coding practices. These vulnerabilities are entirely preventable with proper coding discipline.',
				whatAuditorExpects:
					'Auditors will review secure coding standards and check for evidence of developer training on those standards. They will request SAST scan results from the CI pipeline and verify that identified high-severity findings are remediated before code is merged.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.29',
				title: 'Security testing in development and acceptance',
				description:
					'Security testing processes are defined and implemented in the development lifecycle, including both automated testing in CI/CD pipelines and manual security review. Acceptance criteria for new systems and major changes include security test pass requirements. Penetration testing is conducted on significant new releases and at regular intervals for production systems.',
				whyItMatters:
					'Security testing catches vulnerabilities before they reach production, where the cost of exploitation is orders of magnitude higher than the cost of fixing them during development.',
				whatAuditorExpects:
					'Auditors will review the security testing policy and request DAST, SAST, and penetration test results for systems in scope. They will check that acceptance criteria include security thresholds and that test findings are tracked to remediation.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.30',
				title: 'Outsourced development',
				description:
					'Activities related to outsourced system development are directed, monitored, and reviewed by the organization to ensure that security requirements are met. Contracts with outsourced developers include security requirements, the right to audit, and obligations around code ownership and secure coding practices. Code produced by external parties is reviewed for security before integration.',
				whyItMatters:
					'Outsourced code introduces supply-chain risk if not subject to the same security standards as internal development. Malicious or negligently insecure code from a contractor can compromise the entire product.',
				whatAuditorExpects:
					"Auditors will review contracts with outsourced developers for security clauses. They will check that code reviews are conducted on externally produced code and that outsourced developers are subject to the organization's security requirements.",
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.31',
				title: 'Separation of development, test and production environments',
				description:
					'Development, testing, and production environments are separated to prevent unauthorized access or changes to the operational environment. Access controls ensure that developers do not have uncontrolled access to production systems. Production data is not used in development or test environments unless appropriately masked.',
				whyItMatters:
					'Without environment separation, a mistake or malicious change in a development environment can directly impact production. It also prevents accidental exposure of production data to a wider audience than necessary.',
				whatAuditorExpects:
					'Auditors will verify that separate environments exist and that production access for developers is controlled, logged, and requires elevated approval. They will check that production data does not appear in non-production environments without masking.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.32',
				title: 'Change management',
				description:
					'Changes to information processing facilities and systems are subject to formal change management procedures, ensuring changes are planned, reviewed, tested, approved, and documented before implementation. Emergency changes follow an expedited but still documented process. Change records are retained and reviewed for post-implementation validation.',
				whyItMatters:
					'Uncontrolled changes are a leading cause of production outages and security vulnerabilities. Formal change management creates a defensible audit trail and reduces the likelihood that changes cause unexpected consequences.',
				whatAuditorExpects:
					'Auditors will review change management policies and sample change records from the audit period. They will check that changes were approved before implementation and that emergency change procedures were used appropriately and documented.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.33',
				title: 'Test information',
				description:
					'Test information — including data used in development and testing activities — is selected, protected, and managed appropriately. Production data is not used for testing unless it has been anonymized, pseudonymized, or masked to protect sensitive information. Test data is controlled and disposed of securely when testing is complete.',
				whyItMatters:
					'Using live customer data for testing exposes it to a much wider audience than necessary and may violate data protection regulations. A breach of a test environment containing real customer data is still a reportable data breach.',
				whatAuditorExpects:
					'Auditors will check whether production data is used in test environments and, if so, verify that effective masking or anonymization is applied. They will review test data management policies and controls.',
				category: 'Technological Controls'
			},
			{
				frameworkId: isoFramework.id,
				code: '8.34',
				title: 'Protection of information systems during audit testing',
				description:
					'Audit tests involving assessments of operational systems are planned and agreed in advance to minimize disruption to business processes. Audit tools and access are separated from development and operational systems. Results of audit tests are protected, and access to audit tools is restricted to prevent misuse.',
				whyItMatters:
					'Poorly scoped or uncoordinated audit testing can cause system instability or outages. Conversely, unrestricted access to powerful audit tools creates a risk of those tools being misused for unauthorized access.',
				whatAuditorExpects:
					'Auditors will review procedures for managing audit testing and check that audit scopes are formally agreed before testing commences. They will verify that audit tool access is restricted and logged, and that audit test results are handled with appropriate confidentiality.',
				category: 'Technological Controls'
			}
		])
		.onConflictDoNothing();

	console.log('ISO 27001:2022 controls seeded.');

	// ─── PCI DSS v4.0.1 Controls ──────────────────────────────────────────────

	console.log('Seeding PCI DSS v4.0.1 controls...');

	await db
		.insert(controls)
		.values([
			{
				frameworkId: pciFramework.id,
				code: 'REQ-1',
				title: 'Install and Maintain Network Security Controls',
				description:
					'Network security controls (NSCs) such as firewalls and routers are installed and configured to protect the cardholder data environment (CDE) from unauthorized access. All inbound and outbound traffic to and from the CDE is restricted to what is necessary for business purposes, and all other traffic is explicitly denied. NSC configurations are reviewed at least every six months and updated whenever the network changes.',
				whyItMatters:
					'An uncontrolled network perimeter is an open invitation for attackers to reach payment data. For a startup handling any payment flow, failure here will immediately fail a QSA assessment and may trigger liability under card brand rules.',
				whatAuditorExpects:
					'Auditors will request network diagrams, firewall rule sets, and evidence of semi-annual rule-set reviews. They will verify that default-deny rules are in place, that the CDE is segmented from other networks, and that all rules have documented business justifications.',
				category: 'Build and Maintain a Secure Network'
			},
			{
				frameworkId: pciFramework.id,
				code: 'REQ-2',
				title: 'Apply Secure Configurations to All System Components',
				description:
					'All system components within or connected to the CDE are protected from known weaknesses by applying secure configuration standards. Vendor-supplied defaults — including default passwords — are changed before components are deployed. Configuration standards covering all in-scope systems are documented, applied consistently, and reviewed when components are added or modified.',
				whyItMatters:
					'Default credentials and factory configurations are widely published and are among the first things automated scanners probe. A single system with default settings left in place can be the entry point for a full cardholder data breach.',
				whatAuditorExpects:
					'Auditors will request configuration standards documents and compare them against actual system configurations via screenshot or configuration export. They will check that vendor defaults have been changed and that hardening benchmarks (e.g., CIS) are referenced.',
				category: 'Build and Maintain a Secure Network'
			},
			{
				frameworkId: pciFramework.id,
				code: 'REQ-3',
				title: 'Protect Stored Account Data',
				description:
					'Account data that must be stored for legitimate business purposes is protected using strong cryptography, with primary account numbers (PAN) rendered unreadable anywhere they are stored. Sensitive authentication data (SAD) — including full track data, CVV/CVC codes, and PINs — is never stored after authorization, even if encrypted. A data retention and disposal policy defines what is stored, why, and for how long.',
				whyItMatters:
					'Stored unprotected card data is the primary target of payment card breaches. Even small startups that process payments can face catastrophic fines and card brand penalties if stored PANs are exposed unencrypted.',
				whatAuditorExpects:
					'Auditors will search for stored account data using data discovery tools and review encryption implementation documentation. They will verify that SAD is never retained post-authorization and that PAN is encrypted at rest with documented key management procedures.',
				category: 'Protect Account Data'
			},
			{
				frameworkId: pciFramework.id,
				code: 'REQ-4',
				title: 'Protect Cardholder Data with Strong Cryptography During Transmission',
				description:
					'Cardholder data is protected with strong cryptography during transmission over open, public networks. Only trusted keys and certificates are accepted, and TLS 1.2 or higher is required — TLS 1.0 and 1.1 are prohibited. All transmission paths carrying cardholder data are inventoried and each is verified to use approved cryptographic protocols.',
				whyItMatters:
					'Unencrypted transmission of cardholder data over public networks exposes it to interception. Many card-skimming attacks specifically target transit data on misconfigured or deprecated protocol endpoints.',
				whatAuditorExpects:
					'Auditors will request an inventory of all cardholder data transmission paths and test each for TLS version and cipher strength. They will verify that certificates are valid and issued by trusted authorities, and that no deprecated protocols are enabled.',
				category: 'Protect Account Data'
			},
			{
				frameworkId: pciFramework.id,
				code: 'REQ-5',
				title: 'Protect All Systems and Networks from Malicious Software',
				description:
					'Anti-malware solutions are deployed on all system components that are commonly affected by malicious software, particularly those in the CDE and connected to the internet. Anti-malware software is kept current, performs regular scans, generates audit logs, and cannot be disabled by users. Anti-phishing mechanisms protect users from phishing-based malware delivery.',
				whyItMatters:
					'Malware is a primary delivery mechanism for payment skimmers and credential stealers. Anti-malware coverage across all CDE-connected systems is a foundational defense against the most common attack methods targeting payment environments.',
				whatAuditorExpects:
					'Auditors will request anti-malware deployment evidence covering all in-scope systems, including scan logs and a report showing definitions are current. They will verify that users cannot disable anti-malware and that tamper-protection is enabled.',
				category: 'Maintain a Vulnerability Management Program'
			},
			{
				frameworkId: pciFramework.id,
				code: 'REQ-6',
				title: 'Develop and Maintain Secure Systems and Software',
				description:
					'All system components and software are protected from known vulnerabilities by installing applicable security patches and updates within defined timeframes. A vulnerability management process identifies new vulnerabilities, prioritizes them by risk, and tracks remediation. For software involved in payment processing — including eCommerce pages — a change and tamper detection mechanism is implemented to detect unauthorized modifications.',
				whyItMatters:
					'Unpatched software is the most exploited attack vector in payment card breaches. The requirement for eCommerce script integrity monitoring directly targets Magecart and web-skimming attacks that have affected thousands of merchants.',
				whatAuditorExpects:
					'Auditors will request patch management records and vulnerability scan results. They will check that critical patches are applied within one month of release and that eCommerce payment pages have a script monitoring or integrity verification mechanism in place.',
				category: 'Maintain a Vulnerability Management Program'
			},
			{
				frameworkId: pciFramework.id,
				code: 'REQ-7',
				title: 'Restrict Access to System Components and Cardholder Data by Business Need to Know',
				description:
					'Access to system components and cardholder data is limited to only those individuals whose job requires such access, using role-based access controls enforcing least privilege. All access to the CDE requires explicit authorization, and access rights are reviewed at least every six months. A documented access control system prevents unauthorized access by default.',
				whyItMatters:
					'Over-permissive access to payment systems dramatically increases the insider threat surface and the blast radius of any external account compromise. Least-privilege access to cardholder data is one of the most direct risk reduction measures available.',
				whatAuditorExpects:
					'Auditors will request access control policies and the list of users with access to CDE components. They will sample access requests for approved business justifications and review records of the most recent semi-annual access review confirming all access remains appropriate.',
				category: 'Implement Strong Access Control Measures'
			},
			{
				frameworkId: pciFramework.id,
				code: 'REQ-8',
				title: 'Identify Users and Authenticate Access to System Components',
				description:
					"Each individual with access to system components is assigned a unique user ID, and the user's identity is authenticated before access is granted. Passwords must be a minimum of 12 characters and meet complexity requirements, and must be changed at least every 90 days for non-MFA accounts. Multi-factor authentication is required for all access to the CDE and all remote access to the network.",
				whyItMatters:
					'Shared accounts and weak passwords eliminate accountability and make credential attacks trivially easy. The MFA requirement for CDE access reflects the reality that passwords alone are no longer sufficient to protect payment environments.',
				whatAuditorExpects:
					'Auditors will verify that all CDE accounts are unique and that MFA is enforced via configuration evidence. They will test password policy settings, check that shared or group accounts are absent from in-scope systems, and review inactive account management procedures.',
				category: 'Implement Strong Access Control Measures'
			},
			{
				frameworkId: pciFramework.id,
				code: 'REQ-9',
				title: 'Restrict Physical Access to Cardholder Data',
				description:
					'Physical access to systems that store, process, or transmit cardholder data is restricted to authorized personnel. Entry controls protect all areas housing CDE components, and entry is logged. Media containing cardholder data is classified, stored securely, and destroyed when no longer needed. Point-of-interaction (POI) devices are protected from tampering and substitution with documented inspection procedures.',
				whyItMatters:
					'Physical access to a server or point-of-sale terminal can bypass all logical security controls. For any merchant using physical payment terminals, undetected device tampering is a realistic and well-documented threat.',
				whatAuditorExpects:
					'Auditors will review physical access control procedures and logs for CDE areas. They will check media handling and destruction records, and for merchants using POI devices, they will request documented device inspection records and a list of authorized device personnel.',
				category: 'Implement Strong Access Control Measures'
			},
			{
				frameworkId: pciFramework.id,
				code: 'REQ-10',
				title: 'Log and Monitor All Access to System Components and Cardholder Data',
				description:
					'Audit logs capturing user activities, administrative actions, and system events are enabled on all CDE components and must be retained for at least 12 months, with a minimum of three months immediately available for analysis. Automated mechanisms review logs daily and alert on suspicious activity. Log integrity is protected from unauthorized modification or deletion.',
				whyItMatters:
					'Logs are the primary forensic tool available after a payment breach and are required by card brands for any post-incident investigation. Without adequate logging and retention, it is impossible to determine what data was accessed or exfiltrated during a breach.',
				whatAuditorExpects:
					'Auditors will verify that logging is enabled on all in-scope systems and review log configuration settings. They will check that logs are retained for 12 months, that automated daily review is operational, and that log integrity controls prevent tampering.',
				category: 'Regularly Monitor and Test Networks'
			},
			{
				frameworkId: pciFramework.id,
				code: 'REQ-11',
				title: 'Test Security of Systems and Networks Regularly',
				description:
					'Security vulnerabilities are proactively identified through regular testing including internal and external vulnerability scanning, penetration testing, and — for eCommerce environments — payment page tamper detection. External vulnerability scans are performed quarterly by a PCI SSC Approved Scanning Vendor (ASV). Internal and external penetration tests are conducted at least annually and after significant changes.',
				whyItMatters:
					'Attackers continuously probe for new weaknesses; regular testing ensures the organization finds vulnerabilities before attackers do. The ASV scan requirement provides an independent, standardized view of internet-facing vulnerabilities in the payment environment.',
				whatAuditorExpects:
					'Auditors will request quarterly ASV scan reports with passing results (or documented remediation of failures) and annual penetration test reports. They will check that pen testing scope covers CDE segmentation and that critical findings are remediated and retested.',
				category: 'Regularly Monitor and Test Networks'
			},
			{
				frameworkId: pciFramework.id,
				code: 'REQ-12',
				title: 'Support Information Security with Organizational Policies and Programs',
				description:
					'An overarching information security policy is established, published, and maintained that addresses all PCI DSS requirements. A formal risk assessment process identifies and prioritizes threats to the CDE at least annually. A security awareness program ensures all personnel understand their role in protecting cardholder data. Third-party service provider relationships are managed with documented responsibilities and annual acknowledgments of accountability. An incident response plan is in place and tested annually.',
				whyItMatters:
					'Policy and program infrastructure is the backbone that holds all technical controls together. Without it, individual controls operate in isolation, accountability is unclear, and the organization cannot demonstrate a governed, sustained compliance posture to assessors.',
				whatAuditorExpects:
					'Auditors will review the information security policy for PCI DSS coverage and the most recent risk assessment. They will request security awareness training completion records, a current list of third-party service providers with their acknowledgments of responsibility, and evidence of an incident response plan test conducted within the past 12 months.',
				category: 'Maintain an Information Security Policy'
			}
		])
		.onConflictDoNothing();

	console.log('PCI DSS v4.0.1 controls seeded.');
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
