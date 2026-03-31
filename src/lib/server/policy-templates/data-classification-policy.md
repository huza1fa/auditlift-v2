# Data Classification Policy

**Company:** {{companyName}}
**Team Size:** {{teamSize}}
**Date:** {{date}}
**Framework:** {{framework}}
**Version:** 1.0
**Owner:** Security Team
**Status:** Approved

## 1. Purpose

This Data Classification Policy establishes a framework for categorizing {{companyName}}'s information assets based on their sensitivity and the potential impact of unauthorized disclosure, modification, or loss. Consistent classification enables appropriate handling, protection, and retention of data throughout its lifecycle.

## 2. Scope

This policy applies to all data created, processed, stored, or transmitted by {{companyName}}, including data held by third-party processors on {{companyName}}'s behalf. It applies to all employees, contractors, and vendors who handle {{companyName}} data. The technology stack — {{stack}} — and all data stores within it are within scope.

## 3. Classification Tiers

{{companyName}} uses four data classification tiers:

### 3.1 Public

**Definition**: Information approved for unrestricted public release. Disclosure would cause no harm to {{companyName}}, its customers, or employees.

**Examples**: Published marketing materials, press releases, public product documentation, open-source code, public pricing pages.

### 3.2 Internal

**Definition**: Information intended for use within {{companyName}} only. Unauthorized disclosure could cause minor inconvenience or reputational embarrassment but is unlikely to cause significant harm.

**Examples**: Internal process documentation, meeting notes, non-sensitive company communications, general operational data, aggregated and anonymized metrics.

### 3.3 Confidential

**Definition**: Sensitive business or personal information whose unauthorized disclosure could cause material harm to {{companyName}}, its customers, employees, or business relationships.

**Examples**: Customer personal data (PII), employee records, financial statements and forecasts, source code, security architecture diagrams, business strategies, vendor contracts, non-public product roadmaps.

### 3.4 Restricted

**Definition**: The most sensitive category of information. Unauthorized disclosure could cause severe harm including regulatory penalties, significant financial loss, or irreparable reputational damage. Access is limited to a defined, named set of individuals on a strict need-to-know basis.

**Examples**: Authentication credentials and cryptographic keys, payment card data (PCI DSS in scope), health information (HIPAA in scope), government-issued ID numbers, acquisition or merger details, active incident response data, penetration test findings.

## 4. Handling Requirements per Classification Tier

| Requirement | Public | Internal | Confidential | Restricted |
|------------|--------|----------|-------------|------------|
| Encryption at rest | No | Recommended | Required | Required |
| Encryption in transit | No | Required | Required | Required |
| Access control | Open | Role-based | Need-to-know | Named individuals only |
| MFA required | No | Yes (company systems) | Yes | Yes |
| Logging and monitoring | No | Yes | Yes | Yes, with alerting |
| Third-party sharing | Permitted | Manager approval | DPA required | CISO approval + DPA required |
| Transmission via email | Permitted | Permitted (internal) | Encrypted only | Prohibited; use secure transfer |

## 5. Labeling and Marking Standards

Data owners are responsible for ensuring data is appropriately labeled:

- **Documents**: Classification must appear in the document header or footer (e.g., "CONFIDENTIAL — {{companyName}}")
- **Emails**: Emails containing Confidential or Restricted information must include the classification in the subject line or body
- **Systems and repositories**: README files and system documentation must indicate the classification of data stored
- **Physical media**: Labels must be affixed to physical media indicating classification

Automated data loss prevention (DLP) tools are used where feasible to assist with classification detection.

## 6. Retention and Disposal Requirements

| Classification | Minimum Retention | Disposal Method |
|---------------|-------------------|----------------|
| Public | As needed | Standard deletion |
| Internal | 1 year | Standard deletion |
| Confidential | 3 years (or as required by law) | Secure deletion (NIST 800-88) |
| Restricted | Per regulatory requirement | Cryptographic erasure or physical destruction; certificate of destruction required |

Retention schedules are defined in detail in the Data Retention Policy.

## 7. Third-Party Sharing Rules

Before sharing Confidential or Restricted data with a third party:

1. A Data Processing Agreement (DPA) or equivalent contractual protection must be in place
2. The third party must demonstrate adequate security controls (e.g., SOC 2 report, security questionnaire)
3. Data must be shared via secure, encrypted channels
4. Sharing of Restricted data requires CISO approval and is logged in the third-party data sharing register

Data must not be shared beyond what is necessary for the stated purpose (data minimization principle).

## 8. Data Owner Responsibilities

Each dataset or system must have a designated Data Owner who is responsible for:

- Assigning and maintaining the correct classification
- Authorizing access to the data under their ownership
- Ensuring handling requirements are communicated to users
- Initiating data disposal at end of retention period

## 9. Review

This policy is reviewed annually or upon significant changes to {{companyName}}'s data landscape, regulatory obligations, or classification needs.
