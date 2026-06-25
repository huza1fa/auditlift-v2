export interface BlogPost {
	slug: string;
	title: string;
	excerpt: string;
	date: string;
	readTime: string;
	content: string;
	ctaText: string;
	ctaHref: string;
}

export const blogPosts: BlogPost[] = [
	{
		slug: 'why-enterprise-buyers-reject-saas-without-soc2',
		title: 'Why enterprise buyers reject SaaS vendors without SOC 2',
		excerpt:
			'Enterprise procurement teams use security questionnaires as a first filter. No SOC 2 policy, no second meeting. Here is what is really happening behind the scenes.',
		date: '2026-06-18',
		readTime: '4 min read',
		content: `
## The invisible gatekeeper

Enterprise buyers do not reject your product because it is bad. They reject it because their procurement team has a checkbox that says "Vendor must have SOC 2 Type II or equivalent." No checkbox, no contract.

That checkbox exists for a reason. When a large company buys software, they are also buying liability. If your startup has a data breach, their customers blame them. SOC 2 is the minimum evidence that you have thought about security seriously.

## What "we are working on it" really sounds like

Founders love saying "we are SOC 2 ready, just not certified yet." To a security reviewer, that sentence means one of two things:

1. You have policies but no evidence.
2. You have nothing and are hoping the question goes away.

Neither is good. The buyer's job is to reduce risk, not to give you the benefit of the doubt.

## The cost of delay

Every week you spend waiting to start compliance is a week where enterprise deals stall. The average SOC 2 audit cycle is 3-6 months. If you start when the deal is on the table, you are already too late.

## What to do instead

Start mapping your controls now, even if you are not planning to audit this quarter. Generate the policies buyers actually ask for. Collect evidence as you build. When the questionnaire lands, you answer in hours, not weeks.

That is exactly what AuditLift was built for.
		`.trim(),
		ctaText: 'Start your free trial and map your first framework',
		ctaHref: '/login'
	},
	{
		slug: 'hidden-cost-of-compliance-consultants',
		title: 'The hidden cost of compliance consultants',
		excerpt:
			'Consultants charge $300-$500 per hour to write policies you could generate in minutes. Here is where that money actually goes, and how to keep it in your runway.',
		date: '2026-06-15',
		readTime: '5 min read',
		content: `
## The billable hour trap

A typical SOC 2 readiness project with a consultant runs $15,000-$40,000. That usually includes:

- A few discovery calls
- A gap assessment spreadsheet
- Policy templates with your company name find-and-replaced in
- A weekly check-in that could have been an email

The work is not worthless. But most of it is templated, and you are paying premium rates for it.

## Where the time actually goes

Consultants will tell you the work is highly customized. In reality, 80% of SOC 2 policies are the same across SaaS startups. Access control, incident response, vendor management, risk assessment. The content barely changes.

What does change is the context: your stack, your team size, your data types. That context is something you know better than any external advisor.

## The real hidden cost: momentum

The biggest expense is not the invoice. It is the three-month delay while you schedule calls, review drafts, and wait for feedback. Every day you are "in compliance prep" is a day you are not closing enterprise deals.

## A smarter path

Use templates and automation for the 80% that is standard. Bring in a human only for the 20% that is genuinely unique to your business. AuditLift generates the standard policies in minutes, tailored to your stack, so you can focus on the parts that actually need judgment.

Your runway will thank you.
		`.trim(),
		ctaText: 'Generate your first policy free',
		ctaHref: '/login'
	},
	{
		slug: 'answered-80-security-questions-in-48-hours',
		title: 'How I answered 80 security questionnaire questions in 48 hours',
		excerpt:
			'A founder shares the exact workflow that turned a two-week fire drill into a single weekend of work, and won a $120K ACV deal.',
		date: '2026-06-10',
		readTime: '6 min read',
		content: `
## The Friday afternoon email

"We love the product. Before we can move to contract, could you fill out our vendor security assessment?" Eighty questions. Due Monday.

If you have been there, you know the feeling. This is the story of how one founder turned that weekend into a competitive advantage.

## Step 1: Map before you answer

The founder did not start typing. He read through all 80 questions and grouped them by theme:

- Access control and authentication (12 questions)
- Data handling and encryption (18 questions)
- Incident response and business continuity (10 questions)
- Vendor and supply chain security (8 questions)
- Policies and audits (14 questions)
- Org structure and training (18 questions)

This mapping took 30 minutes and revealed that most questions were asking the same thing in different words.

## Step 2: Use existing policies as source material

The startup already had rough versions of an information security policy, an access control policy, and an incident response plan. They were not audit-grade, but they contained the right concepts.

He extracted the relevant paragraphs and reformatted them as answers. For yes/no questions, he added a one-sentence explanation with a link to the policy document.

## Step 3: Fill gaps with AI-generated drafts

For questions where no policy existed, he used AuditLift's policy generator to create a first draft in minutes. The drafts were not perfect, but they were 80% there. He edited them for accuracy and added company-specific details.

## Step 4: Review for consistency

The biggest risk in a rushed questionnaire is contradicting yourself. He did a final pass to make sure answers about encryption, retention periods, and access controls all said the same thing.

## The result

The questionnaire was submitted Monday morning. The buyer's security team had no follow-up questions. The deal closed three weeks later at $120K ACV.

The founder's takeaway: "The difference between panic and confidence is having your policies ready before the email arrives."
		`.trim(),
		ctaText: 'Upload your first questionnaire',
		ctaHref: '/login'
	}
];

export function getPostBySlug(slug: string): BlogPost | undefined {
	return blogPosts.find((p) => p.slug === slug);
}
