# Cryptography Policy

**Company:** {{companyName}}
**Team Size:** {{teamSize}}
**Date:** {{date}}
**Framework:** {{framework}}
**Version:** 1.0
**Owner:** Security Team
**Status:** Approved

## 1. Purpose

This Cryptography Policy defines {{companyName}}'s standards for the selection, implementation, and management of cryptographic controls. Cryptography protects the confidentiality and integrity of {{companyName}}'s data and communications, and correct implementation is essential to maintaining the trust of customers and passing compliance audits.

## 2. Scope

This policy applies to all cryptographic mechanisms used within or on behalf of {{companyName}}, including encryption of data at rest and in transit, digital signatures, certificate management, and key management. It applies to all systems, applications, and services in {{companyName}}'s technology stack ({{stack}}), and to all employees, contractors, and vendors who implement or manage cryptographic controls.

## 3. Approved Encryption Algorithms

### 3.1 Symmetric Encryption (Data at Rest)

- **AES-256-GCM**: Required for encryption of Confidential and Restricted data at rest (databases, file stores, backups)
- **AES-128-GCM**: Acceptable for Internal data where AES-256 is not supported; not acceptable for Confidential or Restricted data

### 3.2 Transport Layer Security (Data in Transit)

- **TLS 1.3**: Preferred for all new implementations
- **TLS 1.2**: Acceptable where TLS 1.3 is not supported; must use approved cipher suites (ECDHE key exchange, AES-GCM or ChaCha20-Poly1305 ciphers, SHA-256 or SHA-384 MAC)
- All external-facing endpoints must enforce HTTPS; HTTP must be redirected to HTTPS; HSTS must be enabled with a minimum max-age of 12 months

### 3.3 Asymmetric Encryption and Digital Signatures

- **RSA**: Minimum 2048-bit; 4096-bit preferred for new keys
- **ECDSA / ECDH**: P-256 (secp256r1) or P-384 minimum; X25519 (Curve25519) preferred for key agreement
- **RSA-OAEP with SHA-256**: Required for RSA encryption operations

### 3.4 Hashing

- **SHA-256**: Minimum for integrity checking and non-password hashing
- **SHA-384 / SHA-512**: Preferred for digital signatures and high-assurance integrity
- **Argon2id**: Required for password hashing (see Password Policy)
- **bcrypt (cost ≥ 12)**: Acceptable alternative for password hashing

## 4. Prohibited Algorithms

The following algorithms are explicitly prohibited due to known cryptographic weaknesses:

| Algorithm                                          | Reason for Prohibition                                        |
| -------------------------------------------------- | ------------------------------------------------------------- |
| MD5                                                | Collision attacks; not acceptable for any security purpose    |
| SHA-1                                              | Collision attacks; deprecated for signatures and certificates |
| DES / 3DES                                         | Insufficient key length; vulnerable to SWEET32 attack         |
| RC4                                                | Multiple practical attacks; prohibited in TLS (RFC 7465)      |
| SSL 2.0 / SSL 3.0                                  | POODLE and other attacks                                      |
| TLS 1.0 / TLS 1.1                                  | Deprecated; weak ciphers permitted                            |
| RSA < 2048-bit                                     | Insufficient key length                                       |
| ECB mode (any cipher)                              | Does not provide semantic security                            |
| Any algorithm with a known break or public exploit | As assessed by the Security Team                              |

Use of any prohibited algorithm requires a documented exception approved by the CISO with a defined remediation plan.

## 5. Key Management Lifecycle

### 5.1 Key Generation

- Cryptographic keys must be generated using a cryptographically secure random number generator (CSRNG)
- Keys must be generated with sufficient entropy; hardware security modules (HSMs) or cloud KMS services are preferred for Critical key material
- Keys must be generated with the minimum length specified in Section 3

### 5.2 Key Storage

- **Restricted keys** (e.g., root CA private keys, database encryption keys): Must be stored in an HSM or cloud KMS (e.g., AWS KMS, Google Cloud KMS, HashiCorp Vault)
- **Application keys and secrets**: Must be stored in {{companyName}}'s approved secrets management system; never in source code, environment files committed to version control, or logs
- Keys must not be stored in the same location as the data they protect

### 5.3 Key Rotation

| Key Type                            | Rotation Frequency                                       |
| ----------------------------------- | -------------------------------------------------------- |
| TLS certificates (public-facing)    | Before expiry; maximum 1 year validity                   |
| Database encryption keys            | Annually or upon suspected compromise                    |
| API keys and service account tokens | Annually minimum; immediately upon personnel offboarding |
| Customer-facing session tokens      | Per-session; maximum 24-hour lifetime                    |
| Internal signing keys               | Annually                                                 |

Automated key rotation is implemented where the platform supports it.

### 5.4 Key Revocation

Keys must be revoked immediately when:

- Compromise is suspected or confirmed
- A team member with access to the key departs
- The system or service using the key is decommissioned
- The key is superseded by a rotated replacement

Revoked keys must not be reused. Revocation events are logged in the key management system.

### 5.5 Key Destruction

At end of life, keys must be securely destroyed:

- Software keys: Overwrite key material with zeros/random data before deallocation; ensure all copies and backups are destroyed
- HSM-stored keys: Use the HSM's key deletion function; verify deletion is confirmed by the HSM
- Destruction events are logged with timestamp and authorizing party

## 6. Certificate Management

### 6.1 Certificate Authority

{{companyName}} uses certificates issued by a trusted public Certificate Authority (CA) for all external-facing services. Internal services may use certificates from an internal CA where appropriate.

### 6.2 Certificate Inventory

A certificate inventory is maintained, tracking for each certificate: the domain(s) covered, issuing CA, expiry date, owner, and renewal status. The inventory is reviewed monthly; certificates expiring within 60 days are flagged for renewal.

### 6.3 Renewal and Monitoring

- Automated certificate renewal (e.g., Let's Encrypt via ACME, or cloud-managed certificates) is used wherever possible
- Certificate expiry monitoring alerts must fire at 60, 30, and 7 days before expiry
- Wildcard certificates are used only where operationally necessary; individual certificates are preferred

### 6.4 Revocation

Certificates are revoked immediately upon suspected private key compromise. The Security Team ensures affected services are re-keyed and the compromised certificate is reported to the CA for CRL/OCSP revocation.

## 7. Encryption Requirements by Data Classification

| Classification | At Rest                         | In Transit                       |
| -------------- | ------------------------------- | -------------------------------- |
| Public         | Not required                    | HTTPS preferred                  |
| Internal       | AES-128+                        | TLS 1.2+ required                |
| Confidential   | AES-256 required                | TLS 1.2+ required                |
| Restricted     | AES-256 required; HSM preferred | TLS 1.3 required; mTLS preferred |

## 8. Exception Process

Any deviation from this policy requires:

1. A written exception request describing the deviation and business justification
2. A risk assessment documenting the increased risk and compensating controls
3. CISO approval
4. A defined remediation date (maximum 90 days for deviations from prohibited algorithm list)
5. Recording in the Risk Register

## 9. Review

This policy is reviewed annually or when significant cryptographic advances, new vulnerabilities, or changes to applicable standards (NIST, RFC, FIPS) warrant an update.
