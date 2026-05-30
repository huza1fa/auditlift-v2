# Vendor Management Policy

**Company:** {{companyName}}
**Team Size:** {{teamSize}}
**Date:** {{date}}
**Framework:** {{framework}}
**Version:** 1.0
**Owner:** Security Team
**Status:** Approved

## 1. Purpose

This Vendor Management Policy establishes {{companyName}}'s requirements for assessing, engaging, monitoring, and offboarding third-party vendors and service providers. Third-party relationships introduce risk to {{companyName}}'s security posture, customer data, and regulatory compliance. This policy ensures that risks from the supply chain and sub-processor relationships are identified and managed.

## 2. Scope

This policy applies to all third-party vendors, service providers, contractors, and sub-processors who provide services to or on behalf of {{companyName}}, particularly those that:

- Have access to {{companyName}} systems, networks, or data
- Process personal data of {{companyName}} customers or employees
- Provide critical operational services (e.g., cloud infrastructure, payment processing)
- Integrate with {{companyName}}'s technology stack: {{stack}}

## 3. Vendor Risk Tiers

Vendors are classified into risk tiers based on the nature and extent of their access to {{companyName}} data and systems:

| Tier     | Description                                                                                                             | Examples                                                    |
| -------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Critical | Access to production systems, customer PII, or financial data; outage directly impacts {{companyName}} service delivery | Cloud provider, payment processor, authentication provider  |
| High     | Access to internal data or systems; outage causes significant operational disruption                                    | Source code repositories, CI/CD platforms, security tooling |
| Medium   | Limited access to non-sensitive data; no direct production access                                                       | Marketing platforms, analytics tools, CRM                   |
| Low      | No access to {{companyName}} data or systems; provides commodity services                                               | Office supplies, non-digital services                       |

Tier classification is documented in the Vendor Register and reviewed annually or when vendor scope changes.

## 4. Due Diligence and Assessment Process

Before onboarding a new vendor, the following due diligence must be completed:

### 4.1 Critical and High Tier Vendors

- Review of the vendor's current third-party security certification (SOC 2 Type II, ISO 27001, or equivalent) — must be less than 12 months old
- Completion of {{companyName}}'s security questionnaire (covering data handling, access controls, incident response, and sub-processor management)
- Review of the vendor's penetration testing summary or evidence of regular testing
- Confirmation of data residency and geographic processing locations
- Legal review and execution of a Data Processing Agreement (DPA) and appropriate security addendum

### 4.2 Medium Tier Vendors

- Completion of a streamlined security questionnaire
- Review of publicly available security documentation (privacy policy, security page)
- Execution of a DPA if personal data will be processed

### 4.3 Low Tier Vendors

- Standard due diligence per procurement process; no security review required

## 5. Contractual Security Requirements

All contracts with Critical and High tier vendors must include:

- **Data Processing Agreement (DPA)**: Defining roles (controller/processor), data categories, processing purposes, and data subject rights obligations
- **Security requirements**: Minimum security controls consistent with {{companyName}}'s standards (encryption, access controls, MFA, incident notification)
- **Breach notification**: Vendor must notify {{companyName}} within 48 hours of discovering a security incident that may affect {{companyName}} data
- **Service Level Agreements (SLAs)**: Uptime, response time, and support obligations
- **Audit rights**: {{companyName}} reserves the right to audit vendor security practices or request updated compliance evidence annually
- **Data return and deletion**: Upon contract termination, vendor must return or certify destruction of {{companyName}} data within 30 days

## 6. Ongoing Monitoring and Annual Reviews

Active vendor relationships are monitored on an ongoing basis:

- **Critical vendors**: Reviewed semi-annually; SOC 2 or equivalent reviewed upon each annual renewal
- **High vendors**: Reviewed annually; security questionnaire refreshed every 12 months
- **Medium vendors**: Reviewed annually; lightweight review for material changes

Monitoring activities include:

- Review of vendor security bulletins and breach announcements
- Tracking of vendor-reported incidents affecting {{companyName}} data
- Review of uptime and SLA performance
- Monitoring for adverse news (financial instability, regulatory action, significant breaches)

Vendors with a degraded security posture are flagged for expedited review and potential remediation or replacement.

## 7. Termination Procedures and Data Return

When a vendor relationship ends:

1. Revoke all vendor access to {{companyName}} systems and networks immediately upon contract end
2. Issue a formal data return/deletion request within 5 business days of termination
3. Obtain written confirmation of data deletion or a certificate of destruction from the vendor within 30 days
4. Archive the termination record in the Vendor Register
5. If the vendor held encryption keys or secrets on behalf of {{companyName}}, rotate affected keys immediately

Access revocation and data deletion confirmation are logged and retained as evidence.

## 8. Sub-Processor Management

When {{companyName}} engages a vendor that itself uses sub-processors to deliver services:

- The vendor must maintain and provide an up-to-date list of sub-processors
- {{companyName}} must be notified of any new sub-processor with at least 30 days notice (for Critical vendors), or 14 days notice (for High vendors), to allow assessment and objection if required
- Sub-processors engaged by Critical and High tier vendors must meet security standards equivalent to those required of the primary vendor

{{companyName}} publishes a list of its own sub-processors (vendors who process customer personal data on its behalf) and notifies customers of material changes.

## 9. Vendor Register

The Security Team maintains a Vendor Register that records:

- Vendor name, service description, and tier classification
- Contact information and contract details
- Data types processed and processing locations
- DPA and audit evidence dates
- Last review date and next scheduled review
- Any open risk items or exceptions

The Vendor Register is reviewed and updated quarterly.

## 10. Review

This policy is reviewed annually or following any vendor-related security incident, significant supply chain event, or material change in {{companyName}}'s vendor landscape.
