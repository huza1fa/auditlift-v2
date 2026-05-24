import { z } from "zod";
const InviteTeamMemberSchema = z.object({
  email: z.string().email().max(254),
  role: z.enum(["admin", "member", "viewer"]).default("member")
});
const GeneratePolicySchema = z.object({
  policyType: z.string().min(1).max(100),
  controlId: z.string().uuid().optional(),
  customTitle: z.string().min(1).max(200).optional(),
  customPrompt: z.string().min(1).max(2e3).optional()
});
const PatchPolicySchema = z.object({
  content: z.string().min(1).max(5e5).optional(),
  title: z.string().min(1).max(200).optional()
}).refine((data) => data.content !== void 0 || data.title !== void 0, {
  message: "At least one field required"
});
const PresignEvidenceSchema = z.object({
  controlId: z.string().uuid(),
  filename: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(100),
  sizeBytes: z.number().int().positive().max(10 * 1024 * 1024)
});
const OrganizationSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  website: z.string().max(500).optional().nullable().transform((v) => {
    if (!v || v.trim() === "") return null;
    const trimmed = v.trim();
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  }),
  industry: z.string().max(100).optional().nullable()
});
const ExportSchema = z.object({
  policyIds: z.array(z.string().uuid()).optional(),
  evidenceIds: z.array(z.string().uuid()).optional()
});
const ImproveAnswerSchema = z.object({
  refinementPrompt: z.string().min(1).max(500)
});
const SystemDescriptionSchema = z.object({
  productDescription: z.string().max(500).optional().default(""),
  dataFlowType: z.enum(["cloud-saas", "on-prem", "hybrid", "api-only", ""]).optional().default(""),
  dataStorageProviders: z.array(z.string().max(100)).max(20).optional().default([]),
  dataStorageRegion: z.string().max(100).optional().default(""),
  endpointManagement: z.enum(["mdm", "compliance-tool", "manual", "none", ""]).optional().default(""),
  endpointManagementTool: z.string().max(100).optional().default(""),
  identityProvider: z.string().max(100).optional().default(""),
  keyTools: z.string().max(500).optional().default(""),
  additionalContext: z.string().max(1e3).optional().default("")
});
export {
  ExportSchema as E,
  GeneratePolicySchema as G,
  ImproveAnswerSchema as I,
  OrganizationSchema as O,
  PresignEvidenceSchema as P,
  SystemDescriptionSchema as S,
  PatchPolicySchema as a,
  InviteTeamMemberSchema as b
};
