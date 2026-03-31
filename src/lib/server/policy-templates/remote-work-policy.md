# Remote Work Policy

**Company:** {{companyName}}
**Team Size:** {{teamSize}}
**Date:** {{date}}
**Framework:** {{framework}}
**Version:** 1.0
**Owner:** Security Team
**Status:** Approved

## 1. Purpose

This Remote Work Policy establishes the security and operational requirements for {{companyName}} employees and contractors who work outside of {{companyName}}'s physical offices. As a company of {{teamSize}} operating with a distributed team, remote work is a core part of {{companyName}}'s operating model. This policy ensures that the same security standards applied in the office extend to all remote work environments.

## 2. Scope

This policy applies to all {{companyName}} employees, contractors, and consultants who access {{companyName}} systems, applications, or data from a location other than a {{companyName}} office. It covers all remote work arrangements including full-time remote, hybrid, travel, and occasional work from home.

The systems covered include all components of {{companyName}}'s technology stack: {{stack}}.

## 3. Equipment Requirements

### 3.1 Company-Issued Devices

{{companyName}} provides company-managed devices to all full-time employees. Company-issued devices are configured with:

- Full-disk encryption (FileVault for macOS, BitLocker for Windows)
- Endpoint protection (EDR/antivirus) managed by IT
- Mobile Device Management (MDM) enrollment enabling remote wipe capability
- Automatic OS and security patch installation

### 3.2 BYOD (Bring Your Own Device)

Personal devices may be used to access {{companyName}} systems only under the following conditions:

- The device must be running a supported, fully patched operating system
- The device must have full-disk encryption enabled
- Approval from IT/Security is required before accessing systems containing Confidential or Restricted data from a personal device
- Personal devices must not be used to store {{companyName}} Confidential or Restricted data locally
- Contractors and part-time staff may use personal devices with Security Team approval and subject to the same requirements above

## 4. Network Security

### 4.1 VPN Requirements

Access to {{companyName}} internal systems and any systems processing Confidential or Restricted data from remote locations requires the use of {{companyName}}'s approved VPN solution. VPN must be connected before accessing:

- Internal administrative interfaces
- Production databases or data stores directly
- Systems not exposed via the public application layer

### 4.2 Home Network Security

When working from home, employees must:

- Use a secure, password-protected Wi-Fi network (WPA2 or WPA3)
- Change the default credentials on their home router
- Ensure their home router firmware is current
- Segregate work devices from IoT and untrusted home devices (guest network or separate VLAN) where possible

### 4.3 Public Wi-Fi Prohibition

The use of unsecured or public Wi-Fi networks (e.g., coffee shops, airports, hotels) for work is prohibited unless:

- The device is connected to {{companyName}}'s VPN for the entire session, AND
- No Restricted data is being accessed or transmitted

Mobile hotspots using cellular data are the preferred alternative to public Wi-Fi when out of the office and a secured network is unavailable.

## 5. Data Handling at Remote Sites

- Confidential and Restricted data must not be printed at home or in public locations
- Sensitive data must not be stored on personal devices, personal cloud storage accounts (e.g., personal Dropbox, iCloud), or unauthorized external storage
- All data created or processed in the course of work must be stored in {{companyName}}-approved systems
- When working in a public location, employees must use a privacy screen filter and position their screen to prevent shoulder surfing

## 6. Physical Security at Remote Locations

### 6.1 Clean Desk

When working remotely, employees must:

- Lock or put away devices and materials when stepping away, even briefly
- Store any printed confidential materials securely and shred them when no longer needed
- Ensure work devices are never left unattended in a vehicle, even in a locked compartment

### 6.2 Screen Lock

All devices must be configured to lock automatically after no more than 5 minutes of inactivity. Employees must manually lock their screen (`Command+Control+Q` on macOS, `Win+L` on Windows) whenever leaving their workstation.

### 6.3 Physical Security of Devices

- Laptops must never be left unattended in public spaces
- Devices must not be checked in luggage when traveling; carry them in hand luggage
- Report lost or stolen devices to the Security Team and IT immediately — do not delay to attempt recovery

## 7. Video Conferencing Security

When participating in video calls from remote locations:

- Use a virtual or blurred background where the physical environment may reveal sensitive information or be distracting in a professional context
- Ensure audio cannot be overheard by household members or members of the public when discussing confidential business matters
- Do not share meeting links or credentials in public forums; validate all meeting participants before beginning sensitive discussions
- Use waiting rooms / lobby features for external meetings to control who joins

## 8. Incident Reporting from Remote Locations

Remote workers must report security incidents with the same urgency as in-office workers. Reportable incidents include:

- Lost or stolen device
- Suspected malware infection
- Accidental disclosure of confidential data
- Phishing email clicked or credentials entered on a suspicious site
- Unauthorized access to a work device by a household member or third party

Reports must be made immediately to the Security Team via the designated incident reporting channel. Do not wait to attempt to self-remediate before reporting.

## 9. Compliance and Enforcement

{{companyName}} reserves the right to audit compliance with this policy via device management tooling, VPN usage logs, and periodic reviews. Failure to comply may result in revocation of remote work privileges and disciplinary action.

## 10. Review

This policy is reviewed annually or following any remote-work-related security incident.
