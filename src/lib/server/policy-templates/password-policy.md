# Password Policy

**Company:** {{companyName}}
**Team Size:** {{teamSize}}
**Date:** {{date}}
**Framework:** {{framework}}
**Version:** 1.0
**Owner:** Security Team
**Status:** Approved

## 1. Purpose

This Password Policy establishes minimum requirements for the creation, protection, and management of passwords and authentication credentials used to access {{companyName}} systems, applications, and data. Strong passwords are the first line of defense against unauthorized access.

## 2. Scope

This policy applies to all employees, contractors, consultants, temporary staff, and any third parties who have access to {{companyName}} systems or networks. It covers all passwords used to access {{companyName}} resources, including but not limited to workstations, applications, databases, network devices, and cloud services.

## 3. Password Requirements

### 3.1 Minimum Complexity Standards

All user-created passwords must meet the following requirements:

- **Minimum length**: 14 characters for standard accounts; 20 characters for privileged accounts
- **Complexity**: Must include a combination of at least three of the following: uppercase letters, lowercase letters, numbers, special characters (e.g., `!@#$%^&*`)
- **Password history**: The system must enforce a history of at least the last 10 passwords; users may not reuse any password from their history
- **Maximum age**: Passwords must be changed at least every 90 days for standard accounts; immediately upon suspected compromise
- **Account lockout**: Accounts are locked after 10 consecutive failed login attempts; lockout duration is 15 minutes or until unlocked by an administrator

### 3.2 Prohibited Patterns

The following are explicitly prohibited in passwords:

- Dictionary words, even with simple character substitutions (e.g., `p@ssw0rd`)
- Username or variations thereof
- Company name (`{{companyName}}`) or product names
- Sequences of repeated or consecutive characters (e.g., `aaaa`, `1234`)
- Passwords shared across multiple systems or accounts

## 4. Multi-Factor Authentication (MFA)

### 4.1 MFA Mandate

MFA is **mandatory** for all user accounts accessing {{companyName}} systems. No exceptions are permitted without a documented and approved compensating control.

### 4.2 Approved Second Factors

The following second factors are approved for use at {{companyName}}:

- **Hardware security keys** (FIDO2/WebAuthn, e.g., YubiKey) — preferred for privileged accounts
- **Authenticator applications** (e.g., Google Authenticator, Microsoft Authenticator, Authy) — approved for standard accounts
- **Push notifications** via approved MDM-managed mobile devices

The following second factors are **not** approved:

- SMS one-time passwords (OTP) — susceptible to SIM-swapping attacks; prohibited except as a fallback of last resort with documented approval
- Email-based OTP for systems containing Confidential or Restricted data

### 4.3 MFA Recovery

MFA recovery codes must be stored securely in {{companyName}}'s approved password manager, not in email or unsecured notes. Loss of MFA device must be reported to the IT/Security team immediately.

## 5. Password Storage Standards

### 5.1 Technical Storage Requirements

Passwords must never be stored in plaintext in any system. All systems that store user credentials must use an approved hashing algorithm:

- **Approved algorithms**: Argon2id (preferred), bcrypt (cost factor ≥ 12), scrypt
- **Prohibited algorithms**: MD5, SHA-1, SHA-256 without salting, any reversible encryption for password storage

### 5.2 Transmission

Passwords must only be transmitted over encrypted channels (TLS 1.2 or higher). Passwords must never be transmitted via email, chat, or ticketing systems.

## 6. Service Account and API Key Management

### 6.1 Service Accounts

- Service accounts must use randomly generated, complex passwords of at least 32 characters
- Service account credentials must be stored in {{companyName}}'s approved secrets management solution (e.g., HashiCorp Vault, AWS Secrets Manager)
- Service account passwords must be rotated at least every 90 days and immediately upon any personnel change affecting access to the secret

### 6.2 API Keys and Tokens

- API keys and tokens are treated as passwords and subject to the same storage and transmission standards
- API keys must be scoped to minimum necessary permissions
- API keys must be rotated annually at a minimum, and immediately upon suspected compromise or team member offboarding
- API keys must never be committed to source code repositories; automated scanning (e.g., git-secrets, GitHub secret scanning) must be enabled

## 7. Password Manager Usage

{{companyName}} provides and requires the use of an approved enterprise password manager for storing and generating passwords. Employees must:

- Use the company-provided password manager to store all work-related credentials
- Use the password manager's built-in generator to create unique, high-entropy passwords for each account
- Not store work credentials in personal or unapproved password managers, browsers' built-in password storage, or plaintext files

## 8. Password Exceptions and Compensating Controls

Any exception to this policy requires:

1. A written risk acceptance request describing the exception and business justification
2. Approval from the CISO or Security Team lead
3. Documentation of compensating controls that reduce risk to an acceptable level
4. A defined review date, not to exceed 90 days

Approved exceptions are recorded in the Risk Register.

## 9. Compliance and Enforcement

Violations of this policy may result in disciplinary action up to and including termination of employment or contract. Technical controls (password strength validators, MFA enforcement, account lockout) are implemented to enforce this policy automatically where possible.

## 10. Review

This policy is reviewed annually or upon significant changes to {{companyName}}'s technology environment, workforce, or applicable regulatory requirements.
