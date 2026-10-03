import { product, type FAQ } from './data/marketing';

export function canonicalUrl(path: string): string {
	const url = new URL(path, `${product.url}/`);
	// Canonicals never inherit tracking parameters, fragments, or another origin.
	return `${product.url}${url.pathname === '/' ? '/' : url.pathname.replace(/\/+$/, '')}`;
}

export function serializeJsonLd(value: unknown): string {
	// JSON-LD is rendered in a script element; prevent content from closing that element.
	return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function faqSchema(faqs: FAQ[]) {
	return {
		'@type': 'FAQPage',
		mainEntity: faqs.map(({ question, answer }) => ({
			'@type': 'Question',
			name: question,
			acceptedAnswer: { '@type': 'Answer', text: answer }
		}))
	};
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
	return {
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: canonicalUrl(item.path)
		}))
	};
}

export const organizationSchema = {
	'@type': 'Organization',
	'@id': `${product.url}/#organization`,
	name: product.name,
	url: `${product.url}/`,
	logo: `${product.url}/favicon.svg`,
	email: 'hello@auditlift.app',
	description: product.description
};

export const softwareSchema = {
	'@type': 'SoftwareApplication',
	'@id': `${product.url}/#software`,
	name: product.name,
	url: `${product.url}/`,
	applicationCategory: 'BusinessApplication',
	applicationSubCategory: 'Security questionnaire automation',
	operatingSystem: 'Web',
	description: product.description,
	featureList: product.features,
	publisher: { '@id': `${product.url}/#organization` },
	offers: [
		{
			name: 'Starter',
			price: '149.00',
			yearlyPrice: '1431.00',
			description: 'SOC 2, up to 5 team members'
		},
		{
			name: 'Growth',
			price: '299.00',
			yearlyPrice: '2870.00',
			description: 'SOC 2, ISO 27001, PCI-DSS, unlimited team members'
		}
	].map(({ name, price, yearlyPrice, description }) => ({
		'@type': 'Offer',
		name,
		url: `${product.url}/pricing`,
		price,
		priceCurrency: 'USD',
		description: `${description}. $${price} USD billed monthly or $${yearlyPrice} USD billed annually. 10-day free trial.`,
		priceSpecification: {
			'@type': 'UnitPriceSpecification',
			price,
			priceCurrency: 'USD',
			unitText: 'month'
		}
	}))
};
