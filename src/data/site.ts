// Launch configuration lives here so placeholders never leak across components.
import { withBase } from '../lib/paths.mjs';
// Replace these values before public release; `.invalid` is intentionally non-routable.
const placeholderOrigin = 'https://replace-before-launch.invalid';
const appOrigin =
  import.meta.env.PUBLIC_APP_URL?.trim().replace(/\/+$/, '') ||
  'https://app.rodyne.xyz';
const appReady = appOrigin !== placeholderOrigin;
const appLoginUrl = `${appOrigin}/login`;

export const site = {
  name: 'Rodyne',
  appReady,
  eyebrow: 'BUILT FOR ROBLOX COMMUNITIES',
  title: 'Rodyne — Your Roblox community, working together',
  description:
    'Manage ranks, run training sessions, and resolve reports across Roblox and Discord with Rodyne. One shared workspace for your staff, from $8 per month.',
  placeholderOrigin,
  links: {
    home: withBase('/'),
    product: withBase('/#product'),
    scout: withBase('/scout/'),
    connect: withBase('/connect/'),
    integrations: withBase('/#integrations'),
    pricing: withBase('/#pricing'),
    security: withBase('/#security'),
    demo: withBase('/#demo'),
    setup: withBase('/#setup'),
    signIn: appLoginUrl,
    documentation: `${placeholderOrigin}/docs`,
    status: `${placeholderOrigin}/status`,
    terms: withBase('/legal/terms/'),
    privacy: withBase('/legal/privacy/'),
    childrenPrivacy: withBase('/legal/children/'),
    cookies: withBase('/legal/cookies/'),
    acceptableUse: withBase('/legal/acceptable-use/'),
    dpa: withBase('/legal/dpa/'),
    subprocessors: withBase('/legal/subprocessors/'),
    legal: withBase('/legal/'),
    blog: withBase('/blog/'),
    discord: `${placeholderOrigin}/discord`,
  },
  checkout: {
    starter: appReady ? appLoginUrl : withBase('/#launch-checkout'),
    community: appReady ? appLoginUrl : withBase('/#launch-checkout'),
    network: appReady ? appLoginUrl : withBase('/#launch-checkout'),
  },
} as const;

export const navigation = [
  { label: 'Product', href: site.links.product },
  { label: 'Scout', href: site.links.scout },
  { label: 'Cnect', href: site.links.connect },
  { label: 'Integrations', href: site.links.integrations },
  { label: 'Pricing', href: site.links.pricing },
  { label: 'Security', href: site.links.security },
  { label: 'Blog', href: site.links.blog },
] as const;

export const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 8,
    description: 'For a small team running one connected experience.',
    recommended: false,
    features: [
      '1 Discord server',
      '1 Roblox community',
      '1 connected experience',
      '5 active staff seats',
      '25,000 accepted activity records per month',
      '30 days of searchable activity history',
      '250 MB evidence storage',
      'Every core module',
      'Every supported adapter',
    ],
    cta: 'Choose Starter',
    href: site.checkout.starter,
  },
  {
    id: 'community',
    name: 'Community',
    price: 18,
    description: 'For growing communities with regular sessions and staff.',
    recommended: true,
    features: [
      '1 Discord server',
      '1 Roblox community',
      '3 connected experiences',
      '20 active staff seats',
      '150,000 accepted activity records per month',
      '90 days of searchable activity history',
      '1 GB evidence storage',
      'Every core module',
      'Every supported adapter',
    ],
    cta: 'Choose Community',
    href: site.checkout.community,
  },
  {
    id: 'network',
    name: 'Network',
    price: 38,
    description: 'For one team coordinating several Roblox communities.',
    recommended: false,
    features: [
      '1 Discord server',
      '3 Roblox communities',
      '10 connected experiences',
      '60 active staff seats',
      '600,000 accepted activity records per month',
      '365 days of searchable activity history',
      '5 GB evidence storage',
      'Every core module',
      'Every supported adapter',
    ],
    cta: 'Choose Network',
    href: site.checkout.network,
  },
] as const;

export const faqs = [
  {
    question: 'Is there a free plan?',
    answer:
      'No. The connected hosted service starts at $8 per workspace each month. An animated product preview can be viewed without connecting a production community.',
  },
  {
    question: 'Do community members need subscriptions?',
    answer:
      'No. The community owner pays for the workspace. Members can verify, attend events, submit reports and use configured support features without buying individual accounts.',
  },
  {
    question: 'Does the product need my Roblox cookie?',
    answer:
      'No. We do not collect .ROBLOSECURITY cookies. Supported OAuth or scoped owner-created credentials are used where applicable.',
  },
  {
    question: 'Will Discord role changes automatically grant Roblox authority?',
    answer:
      'No. Roblox roles, Discord roles, in-game permissions and dashboard permissions remain separate. Owners configure explicit mappings and approval rules.',
  },
  {
    question: 'Are Cmdr, Adonis and HD Admin supported?',
    answer:
      'Yes, through versioned adapters with published capability coverage. Supported actions can vary by framework and release.',
  },
  {
    question: 'Can it automatically ban someone everywhere?',
    answer:
      'No. Staff explicitly choose the relevant platform and scope. Reports remain allegations until reviewed, and partial execution states remain visible.',
  },
  {
    question: 'What happens if one integration fails?',
    answer:
      'The successful step remains recorded. The failed step is marked for retry or review without repeating work that already completed.',
  },
  {
    question: 'Can old Discord forum moderation records be imported?',
    answer:
      'Yes, from owner-selected and accessible forum channels using Discord’s official API. Ambiguous identities remain unresolved until reviewed, and inaccessible or deleted history cannot be recovered.',
  },
] as const;

export const integrations = [
  {
    name: 'Roblox Open Cloud',
    description:
      'Connect your community and experiences without sharing Roblox cookies.',
    icon: 'roblox',
  },
  {
    name: 'Discord',
    description:
      'Keep roles, reminders, tickets and staff case records connected.',
    icon: 'messages',
  },
  {
    name: 'Cmdr',
    description:
      'Bring supported in-game commands and action history into your workspace.',
    icon: 'cmdr',
  },
  {
    name: 'Adonis',
    description: 'Connect supported moderation tools and attendance events.',
    icon: 'adonis',
  },
  {
    name: 'HD Admin',
    description:
      'Keep supported admin actions attached to your member records.',
    icon: 'hd-admin',
  },
  {
    name: 'Stripe',
    description:
      'Secure subscription checkout, invoices and cancellation through hosted billing flows.',
    icon: 'card',
  },
] as const;
