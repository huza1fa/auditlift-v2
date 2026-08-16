import { describe, expect, it } from 'vitest';
import { OrganizationSchema, StackSchema } from '../src/lib/server/validation';

describe('onboarding validation', () => {
	it('normalizes an organization website and blank optional values', () => {
		expect(
			OrganizationSchema.parse({
				name: '  AuditLift  ',
				website: ' auditlift.app ',
				industry: null
			})
		).toEqual({ name: 'AuditLift', website: 'https://auditlift.app', industry: null });

		expect(OrganizationSchema.parse({ name: 'AuditLift', website: '   ' }).website).toBeNull();
	});

	it('rejects blank company names and unrecognized stack values', () => {
		expect(() => OrganizationSchema.parse({ name: '   ' })).toThrow();
		expect(() => StackSchema.parse({ stack: ['AWS', 'Heroku'] })).toThrow();
	});
});
