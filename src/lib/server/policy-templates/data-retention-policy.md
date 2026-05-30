# Data Retention Policy

**Company:** {{companyName}}
**Team Size:** {{teamSize}}
**Date:** {{date}}
**Framework:** {{framework}}
**Version:** 1.0
**Owner:** Security Team
**Status:** Approved

## 1. Purpose

This Data Retention Policy establishes rules governing how long {{companyName}} retains different categories of data and how that data is securely disposed of when the retention period expires. Retaining data longer than necessary increases risk exposure; disposing of data too early can violate legal obligations. This policy strikes the appropriate balance.

## 2. Scope

This policy applies to all data in all forms (electronic and physical) created, collected, processed, or stored by {{companyName}}, including data stored in cloud platforms, databases, backups, email systems, file shares, and physical records. It applies to all employees, contractors, and third-party processors.

## 3. Retention Schedule by Data Type

| Data Category                          | Retention Period                                    | Notes                                                    |
| -------------------------------------- | --------------------------------------------------- | -------------------------------------------------------- |
| Customer account data                  | Duration of relationship + 3 years                  | Retain for contract dispute resolution                   |
| Customer personal data (PII)           | Duration of relationship + 1 year                   | Subject to erasure requests under applicable privacy law |
| Financial records (invoices, payments) | 7 years                                             | Tax and accounting compliance (varies by jurisdiction)   |
| Contracts and agreements               | 7 years after expiry                                |                                                          |
| Employee records (HR)                  | Duration of employment + 7 years                    | Varies by jurisdiction; consult legal counsel            |
| Payroll records                        | 7 years                                             |                                                          |
| Security logs (authentication, access) | 12 months online; 24 months archived                | Required for forensic investigation                      |
| Application logs                       | 90 days online; 12 months archived                  |                                                          |
| Audit logs (privileged actions)        | 24 months                                           | Regulatory and audit requirements                        |
| Incident response records              | 3 years from closure                                |                                                          |
| Background check records               | Duration of employment                              |                                                          |
| Marketing contact data                 | 2 years from last interaction                       | Subject to opt-out and erasure requests                  |
| Support tickets and communications     | 3 years from closure                                |                                                          |
| Change management records              | 3 years                                             | Audit trail requirements                                 |
| Backup data                            | 90 days (daily backups); 1 year (monthly snapshots) | Encrypted at rest                                        |
| Penetration test reports               | 3 years                                             |                                                          |

Retention periods listed are minimums unless otherwise noted. Data must not be retained beyond the specified period unless a legal hold is in place (see Section 5).

## 4. Legal and Regulatory Minimums

{{companyName}} operates in jurisdictions with specific data retention mandates. The legal minimum retention periods below take precedence over the schedule above where they are longer:

- **General Data Protection Regulation (GDPR)**: Data must not be retained longer than necessary for its original purpose; erasure requests must be honored within 30 days unless a legal basis for continued retention exists
- **SOC 2**: Audit evidence and control-related records must be retained for a minimum of 12 months
- **PCI DSS**: Cardholder data must not be retained beyond business necessity; audit logs must be retained for 12 months with 3 months immediately available
- **ISO 27001**: Evidence of information security controls must be retained as defined in the Statement of Applicability

Where retention obligations conflict, the longer period applies unless legal counsel advises otherwise.

## 5. Legal Hold Process

A legal hold suspends the normal disposal of data when litigation, regulatory investigation, or audit is reasonably anticipated or underway.

1. The Legal or CISO function issues a written Legal Hold Notice identifying the scope of data to be preserved
2. The IT/Security Team places a hold flag on affected systems to prevent automated deletion
3. Affected employees are notified of the legal hold and their obligation to preserve relevant data
4. The legal hold remains in effect until the CISO or Legal formally releases it in writing
5. Upon release, data is disposed of per the normal retention schedule

Legal hold records are maintained for the duration of the associated matter plus 3 years.

## 6. Secure Disposal Methods

When data reaches the end of its retention period and is not subject to a legal hold, it must be disposed of securely:

### 6.1 Electronic Data

- **Clear**: Overwrite with random data (acceptable for Internal data on media being reused internally)
- **Purge**: Cryptographic erasure (preferred for SSDs, cloud storage, and Confidential data) — destroy the encryption key rendering data unrecoverable
- **Destroy**: Physical destruction of storage media (required for Restricted data; degaussing for magnetic media, shredding for solid-state media)

All electronic disposal of Confidential and Restricted data must be documented with a certificate of destruction or disposal record.

### 6.2 Physical Records

Physical documents containing Confidential or Restricted information must be shredded using a cross-cut shredder rated DIN 66399 Level P-4 or higher, or disposed of via a certified document destruction service.

### 6.3 Cloud and SaaS Data

When terminating a cloud or SaaS service, {{companyName}} must request written confirmation of data deletion from the vendor within 30 days of contract termination, per the contractual data return and deletion requirements.

## 7. Archival Procedures

Data that must be retained beyond its active use period should be archived to reduce storage costs and access complexity:

- Archived data must maintain the same encryption and access control standards as active data
- Archives must be indexed to support retrieval for legal hold or audit purposes
- Archive integrity must be verified annually (e.g., checksum validation)
- The archive inventory is maintained by the IT Team and reviewed annually

## 8. Roles and Responsibilities

| Role               | Responsibility                                                                  |
| ------------------ | ------------------------------------------------------------------------------- |
| Data Owners        | Ensure data under their ownership is classified and disposed of per this policy |
| IT / Engineering   | Implement and maintain technical controls for automated retention and deletion  |
| Security Team      | Define, enforce, and audit this policy; manage legal holds                      |
| All Employees      | Comply with retention and disposal procedures; not retain data beyond policy    |
| Legal / Compliance | Advise on legal minimums and manage legal hold process                          |

## 9. Review

This policy is reviewed annually or upon significant changes to {{companyName}}'s data processing activities, applicable laws, or audit requirements.
