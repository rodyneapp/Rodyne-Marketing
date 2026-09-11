import { site } from './site';

export const legalConfig = {
  // Required launch details. Keep `isDraft` true until every bracketed value is
  // replaced and the documents have been reviewed for the actual business.
  // PUBLIC_LEGAL_READY must only be enabled after that review is complete.
  isDraft: import.meta.env.PUBLIC_LEGAL_READY !== 'true',
  legalEntityName: '[LEGAL ENTITY NAME]',
  registeredAddress: '[REGISTERED ADDRESS]',
  registrationNumber: '[COMPANY REGISTRATION NUMBER, IF APPLICABLE]',
  countryOfEstablishment: '[COUNTRY OF ESTABLISHMENT]',
  governingLaw: '[GOVERNING LAW AND COURTS]',
  minimumOwnerAge: '[MINIMUM WORKSPACE-OWNER AGE]',
  legalEmail: 'legal@replace-before-launch.invalid',
  privacyEmail: 'privacy@replace-before-launch.invalid',
  supportEmail: 'support@replace-before-launch.invalid',
  effectiveDate: '11 September 2026',
  version: 'Draft 1.0',
} as const;

export type LegalBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'note'; title: string; text: string }
  | { type: 'table'; columns: string[]; rows: string[][] };

export interface LegalSection {
  id: string;
  title: string;
  blocks: LegalBlock[];
}

export interface LegalDocument {
  slug: string;
  shortTitle: string;
  title: string;
  summary: string;
  audience: string;
  sections: LegalSection[];
}

const entity = legalConfig.legalEntityName;
const product = site.name;

export const legalDocuments: LegalDocument[] = [
  {
    slug: 'terms',
    shortTitle: 'Terms',
    title: 'Terms of Service',
    summary:
      'The rules for buying, accessing and operating a community workspace.',
    audience: 'Workspace owners, staff and authorised users',
    sections: [
      {
        id: 'agreement',
        title: '1. Agreement and operator',
        blocks: [
          {
            type: 'paragraph',
            text: `These Terms govern access to ${product}, a hosted community-management service operated by ${entity}. By creating a workspace, buying a plan or using an account provided by a workspace owner, you agree to these Terms and the Acceptable Use Policy.`,
          },
          {
            type: 'note',
            title: 'Launch details required',
            text: `The operator name, registered address, registration number, country of establishment, minimum owner age and governing law are placeholders. These Terms must not be published as final until those fields and the checkout disclosures have been completed and legally reviewed.`,
          },
        ],
      },
      {
        id: 'eligibility',
        title: '2. Eligibility and authority',
        blocks: [
          {
            type: 'list',
            items: [
              `A workspace owner must be at least ${legalConfig.minimumOwnerAge} and able to enter a binding contract in their location.`,
              'If you act for a Roblox community, organisation or other group, you confirm that you are authorised to connect its Roblox community, experiences and Discord server.',
              'Workspace owners decide which staff may access the service and are responsible for removing access when it is no longer appropriate.',
              'Community members do not need individual paid subscriptions, but may only use configured member-facing features for their intended purpose.',
            ],
          },
        ],
      },
      {
        id: 'service',
        title: '3. The service',
        blocks: [
          {
            type: 'paragraph',
            text: `${product} connects supported Roblox, Discord and in-experience workflows. Depending on configuration, it can support ranking, role mappings, events, attendance, tickets, reports, moderation cases, appeals, announcements, member histories, activity analytics and supported Cmdr, Adonis and HD Admin adapters.`,
          },
          {
            type: 'list',
            items: [
              'Adapter capabilities vary by framework and release. Unsupported operations are not promised.',
              'Roblox roles, Discord roles, in-game permissions and dashboard permissions remain separate unless an owner creates an explicit mapping or rule.',
              'A queued or requested action is not a completed action. External operations can be queued, running, completed, partially completed, failed or expired.',
              'The service does not provide arbitrary remote Lua execution, automatic platform-wide bans, private Roblox report access or unrestricted Discord-to-Roblox chat bridging.',
            ],
          },
        ],
      },
      {
        id: 'accounts',
        title: '4. Accounts and credentials',
        blocks: [
          {
            type: 'paragraph',
            text: 'You must provide accurate account information, keep authentication methods secure and promptly report suspected unauthorised access. Actions taken through authorised staff accounts may be recorded in the workspace audit history.',
          },
          {
            type: 'list',
            items: [
              'Never submit a .ROBLOSECURITY cookie. The service is designed to use supported OAuth or scoped owner-created credentials where applicable.',
              'Grant each integration only the scopes and platform permissions it needs.',
              'Do not share connector secrets in Discord channels, support tickets, evidence uploads or public repositories.',
              'The workspace owner remains responsible for platform-side role ownership, server permissions and connector installation.',
            ],
          },
        ],
      },
      {
        id: 'subscriptions',
        title: '5. Plans, billing and cancellation',
        blocks: [
          {
            type: 'paragraph',
            text: 'The production service is paid and has no free production plan. A sample-data demo may be available without connecting a production community. Current monthly plan prices and capacity are shown on the Pricing page and again before checkout.',
          },
          {
            type: 'list',
            items: [
              'Subscriptions are for the Discord server and Roblox communities included in the selected plan. A separate Discord server requires a separate subscription.',
              'Community members do not count as active staff seats.',
              'There are no automatic paid overages. If included capacity is reached, affected ingestion or storage may be limited until capacity resets, content is removed or the plan is changed.',
              'Stripe-hosted billing flows are used for checkout, invoices and cancellation. The final price, currency, taxes, renewal interval and any statutory cancellation information must be shown before purchase.',
              'Cancellation stops future renewal at the end of the paid period unless checkout or mandatory law states otherwise. Statutory refund and cancellation rights are not limited by these Terms.',
            ],
          },
          {
            type: 'note',
            title: 'Checkout review required',
            text: 'Tax handling, refund timing, renewal notices and consumer cancellation disclosures depend on the operator and customer location. Confirm them against the live Stripe configuration before launch.',
          },
        ],
      },
      {
        id: 'customer-data',
        title: '6. Workspace data and decisions',
        blocks: [
          {
            type: 'paragraph',
            text: 'Workspace owners and their users retain their rights in content they submit. They permit the service to host, process, transmit and display that content only as needed to provide, secure and support the service.',
          },
          {
            type: 'list',
            items: [
              'Owners must have a lawful and fair basis for collecting member records, evidence, staff notes and moderation information.',
              'Reports are allegations until authorised staff record a finding. The service does not decide whether an allegation is true.',
              'Staff must choose the relevant platform, duration and scope of a moderation action. The service does not automatically ban a person everywhere.',
              'Private notes and evidence must only be accessible to people who need them for the configured workflow.',
              'Owners are responsible for responding to their community members and correcting inaccurate workspace records.',
            ],
          },
        ],
      },
      {
        id: 'acceptable-use',
        title: '7. Acceptable use',
        blocks: [
          {
            type: 'paragraph',
            text: 'You must follow the Acceptable Use Policy and the rules of each connected platform. You may not use the service to harm people, evade platform controls, collect credentials, fabricate evidence, spam users or access information you are not authorised to use.',
          },
          {
            type: 'paragraph',
            text: 'We may restrict or suspend access where reasonably necessary to investigate security issues, prevent harm, comply with law or address a material breach. Where appropriate, we will give notice and an opportunity to remedy the issue.',
          },
        ],
      },
      {
        id: 'third-parties',
        title: '8. Third-party platforms',
        blocks: [
          {
            type: 'paragraph',
            text: 'Roblox, Discord, Stripe and supported admin frameworks are separate third-party products. Their terms, APIs, permissions and availability can change. Connecting them does not create a partnership, endorsement or guarantee of continued compatibility.',
          },
          {
            type: 'paragraph',
            text: 'You authorise the service to send the specific operations your authorised users request through configured integrations. Provider delays, rate limits, permission changes or outages may cause partial or failed jobs, which remain visible for review or retry.',
          },
        ],
      },
      {
        id: 'availability',
        title: '9. Availability and changes',
        blocks: [
          {
            type: 'paragraph',
            text: 'We aim to operate the service carefully, but do not promise uninterrupted availability, guaranteed message delivery or identical coverage across integrations. We may change or discontinue features to maintain security, comply with platform rules or improve the service. Material changes affecting a paid plan should be communicated reasonably in advance where practicable.',
          },
        ],
      },
      {
        id: 'termination',
        title: '10. Suspension, termination and data',
        blocks: [
          {
            type: 'paragraph',
            text: 'A workspace owner may cancel through the hosted billing flow. We may suspend or terminate access for a material breach, non-payment, security threat, unlawful use or where a connected platform requires it. The production retention, export and deletion windows must be stated in the Privacy Policy and dashboard before these Terms are finalised.',
          },
          {
            type: 'paragraph',
            text: 'Sections that by their nature should continue—such as payment obligations already incurred, ownership, confidentiality, disclaimers, liability limits and dispute terms—survive termination.',
          },
        ],
      },
      {
        id: 'intellectual-property',
        title: '11. Intellectual property',
        blocks: [
          {
            type: 'paragraph',
            text: `${entity} and its licensors retain rights in the service, software, documentation and original branding. These Terms grant only a limited, non-exclusive, non-transferable right to use the service during an active subscription. Roblox, Discord, Stripe and other third-party names and marks belong to their respective owners.`,
          },
        ],
      },
      {
        id: 'warranties-liability',
        title: '12. Warranties and liability',
        blocks: [
          {
            type: 'paragraph',
            text: 'The service is provided with reasonable care and skill where required by law. Except for rights that cannot legally be excluded, the final warranty disclaimers, liability exclusions and financial cap must be selected for the operator, customer type and governing law before launch.',
          },
          {
            type: 'note',
            title: 'Legal review required',
            text: 'No liability cap has been invented. Add an appropriate cap and required consumer protections only after confirming the legal entity, insurance, customer locations and whether plans are sold to consumers, businesses or both.',
          },
        ],
      },
      {
        id: 'general',
        title: '13. General terms',
        blocks: [
          {
            type: 'list',
            items: [
              'Neither party is responsible for delay caused by events reasonably outside its control, but payment obligations already due are not excused.',
              'If one provision is unenforceable, the remaining provisions continue to apply.',
              'A failure to enforce a provision is not a waiver of it.',
              'You may not transfer a subscription without written approval. The operator may transfer these Terms as part of a genuine reorganisation or sale, subject to applicable law.',
              'These Terms, the Acceptable Use Policy, Privacy Policy and any signed order or data-processing terms form the agreement for the service.',
            ],
          },
        ],
      },
      {
        id: 'contact-law',
        title: '14. Contact and governing law',
        blocks: [
          {
            type: 'paragraph',
            text: `Legal notices may be sent to ${legalConfig.legalEmail} and ${legalConfig.registeredAddress}. These Terms are governed by ${legalConfig.governingLaw}. Mandatory rights in your place of residence continue to apply where they cannot be excluded.`,
          },
        ],
      },
    ],
  },
  {
    slug: 'privacy',
    shortTitle: 'Privacy',
    title: 'Privacy Policy',
    summary:
      'How account, integration and community-operation information is handled.',
    audience: 'Workspace owners, staff, community members and site visitors',
    sections: [
      {
        id: 'who-we-are',
        title: '1. Who is responsible for your information',
        blocks: [
          {
            type: 'paragraph',
            text: `${entity}, established in ${legalConfig.countryOfEstablishment}, operates ${product}. For account administration, billing, service security and direct support, the operator generally decides why and how information is used.`,
          },
          {
            type: 'paragraph',
            text: 'For community records that a workspace owner uploads, imports or creates—such as attendance, cases, staff notes and moderation history—the workspace owner generally decides the purpose and rules. The operator processes that information to provide the service on the owner’s instructions. Local law can assign these roles differently.',
          },
          {
            type: 'note',
            title: 'This is a configured draft',
            text: 'The operator identity, locations, production vendors, exact retention periods and lawful-basis assessment are not yet supplied. They must be completed and checked against the deployed product before publication.',
          },
        ],
      },
      {
        id: 'information',
        title: '2. Information the service may handle',
        blocks: [
          {
            type: 'table',
            columns: ['Category', 'Examples'],
            rows: [
              [
                'Account and workspace',
                'Account details you provide, workspace membership, staff permissions, community settings and support correspondence.',
              ],
              [
                'Roblox and Discord identity',
                'User IDs, usernames, verified identity links, current roles, configured mappings, server or community identifiers and authorised profile information.',
              ],
              [
                'Community operations',
                'RSVPs, attendance, confirmed results, rank requests, tickets, reports, allegations, evidence, findings, actions, appeals, announcements and member histories.',
              ],
              [
                'Audit and reliability',
                'Who requested or approved an action, timestamps, permission checks, job states, partial failures, retries, provider responses and integration-health warnings.',
              ],
              [
                'Billing',
                'Plan, subscription, invoice and payment-status metadata received from Stripe. Payment card entry occurs in Stripe-hosted flows.',
              ],
              [
                'Technical',
                'Security, access and diagnostic information required to run the deployed service. Exact fields, log providers and retention must be added before launch.',
              ],
            ],
          },
          {
            type: 'paragraph',
            text: 'The service does not require or intentionally collect .ROBLOSECURITY cookies. Workspace owners should not upload secrets, unnecessary sensitive information or evidence unrelated to a genuine community process.',
          },
        ],
      },
      {
        id: 'sources',
        title: '3. Where information comes from',
        blocks: [
          {
            type: 'list',
            items: [
              'You, when you create an account, contact support or submit a configured form.',
              'The workspace owner and authorised staff, when they create or import operational records.',
              'Roblox and Discord, through owner-selected scopes and official interfaces where available.',
              'Supported in-experience connectors, when the owner installs and configures them to submit permitted events.',
              'Stripe, for hosted checkout, invoices, cancellation and payment-status updates.',
              'Owner-selected Discord forum channels during an authorised history import. Deleted or inaccessible history cannot be recovered.',
            ],
          },
        ],
      },
      {
        id: 'purposes',
        title: '4. Why information is used',
        blocks: [
          {
            type: 'table',
            columns: ['Purpose', 'Typical legal basis to confirm'],
            rows: [
              [
                'Provide and administer a paid workspace',
                'Contract; legitimate interests for authorised staff and member-facing operations.',
              ],
              [
                'Execute requested Roblox, Discord and connector operations',
                'Contract and the workspace owner’s documented instructions.',
              ],
              [
                'Keep audit, case and reliability records',
                'Contract; legitimate interests in accountability, safety and dispute handling.',
              ],
              [
                'Secure accounts and investigate misuse',
                'Legitimate interests; legal obligation where applicable.',
              ],
              [
                'Process subscriptions and maintain financial records',
                'Contract; legal obligation.',
              ],
              [
                'Respond to support and rights requests',
                'Contract; legitimate interests; legal obligation.',
              ],
            ],
          },
          {
            type: 'paragraph',
            text: 'Where consent is the appropriate basis, it must be specific and may be withdrawn. The workspace owner is responsible for identifying its own lawful basis for community records. The service does not make solely automated moderation findings: authorised staff review allegations and choose explicit actions.',
          },
        ],
      },
      {
        id: 'sharing',
        title: '5. Who can receive information',
        blocks: [
          {
            type: 'list',
            items: [
              'Authorised workspace owners and staff, according to configured dashboard permissions.',
              'Community members, only where a configured feature is intended to show them their own request, event or case information.',
              'Roblox, Discord and installed connectors, when an authorised action requires data to be sent to that platform or experience.',
              'Service providers listed on the Subprocessors page, once that list is completed for the production deployment.',
              'Professional advisers, regulators, courts or law enforcement where disclosure is legally required or necessary to establish or defend legal claims.',
              'A genuine successor to the business, subject to confidentiality and applicable notice requirements.',
            ],
          },
        ],
      },
      {
        id: 'retention',
        title: '6. Retention and deletion',
        blocks: [
          {
            type: 'paragraph',
            text: 'Searchable high-volume activity history is limited by plan: 30 days on Starter, 90 days on Community and 365 days on Network. Evidence storage is capacity-limited. Essential case receipts, audit records, billing records, backups and records needed for disputes or legal obligations may follow different schedules.',
          },
          {
            type: 'note',
            title: 'Retention schedule required',
            text: 'Before launch, publish exact retention and post-cancellation deletion windows for case receipts, evidence, backups, account records, support records and security logs. Do not imply that plan history limits automatically delete every related record.',
          },
        ],
      },
      {
        id: 'international',
        title: '7. International processing',
        blocks: [
          {
            type: 'paragraph',
            text: 'Connected platforms and production service providers may process information in more than one country. Before launch, the operator must identify those locations and the transfer mechanism used where restricted-transfer rules apply, such as an adequacy regulation or approved contractual safeguard.',
          },
        ],
      },
      {
        id: 'rights',
        title: '8. Your privacy rights',
        blocks: [
          {
            type: 'paragraph',
            text: 'Depending on your location and the context, you may have rights to be informed, request access, correct inaccurate information, request deletion or restriction, object, obtain portable information, withdraw consent and complain to a regulator.',
          },
          {
            type: 'list',
            items: [
              `For account, billing or direct support information, contact ${legalConfig.privacyEmail}.`,
              'For a community case, report, attendance record or member history, contact the workspace owner first because it usually controls that record.',
              'If a request reaches the operator for customer-controlled information, we may refer it to the workspace owner and assist them as required.',
              'We may need to verify identity and may retain a minimal receipt showing that a request was handled.',
            ],
          },
        ],
      },
      {
        id: 'children',
        title: '9. Children and young people',
        blocks: [
          {
            type: 'paragraph',
            text: 'Roblox communities can include people under 18. Community owners must use age-appropriate notices, collect only information needed for the configured purpose and give younger users a clear way to ask for help or exercise their rights. The separate Children and Young People Privacy Notice explains the workflow in simpler language.',
          },
          {
            type: 'paragraph',
            text: 'The service should not be used to build public “worst member” lists, unexplained risk scores or automatic cross-community ban lists. Reports remain allegations until staff review them.',
          },
        ],
      },
      {
        id: 'security',
        title: '10. Security',
        blocks: [
          {
            type: 'paragraph',
            text: 'The product is designed around workspace isolation, scoped connector credentials, permission rechecks, append-only staff audit records, visible job states, bounded retries and provider reconciliation. No certification or absolute-security guarantee is claimed. Production incident contacts and operational procedures must be confirmed before launch.',
          },
        ],
      },
      {
        id: 'cookies',
        title: '11. Cookies and similar technology',
        blocks: [
          {
            type: 'paragraph',
            text: 'The current marketing build contains no analytics or advertising SDK and does not intentionally set non-essential cookies. An authenticated service normally needs strictly necessary session and security storage. Exact names, providers and durations must be listed in the Cookie Policy before the dashboard launches.',
          },
        ],
      },
      {
        id: 'changes-contact',
        title: '12. Changes, questions and complaints',
        blocks: [
          {
            type: 'paragraph',
            text: `Material privacy changes should be explained before they take effect where required. Questions may be sent to ${legalConfig.privacyEmail} or ${legalConfig.registeredAddress}. Before publication, add the correct supervisory authority and any required representative or data-protection contact.`,
          },
        ],
      },
    ],
  },
  {
    slug: 'children',
    shortTitle: 'Young people',
    title: 'Privacy for Children and Young People',
    summary: 'A shorter explanation for younger Roblox community members.',
    audience: 'Community members under 18, parents and guardians',
    sections: [
      {
        id: 'plain-language',
        title: 'The short version',
        blocks: [
          {
            type: 'paragraph',
            text: `${product} helps a Roblox community’s owner and staff organise roles, events, support and moderation. The community—not ${product}—decides whether to use these tools and which staff can see its records.`,
          },
          {
            type: 'note',
            title: 'You do not need to buy a subscription',
            text: 'The community owner pays for the workspace. Members can use configured verification, event, report and support features without buying an individual account.',
          },
        ],
      },
      {
        id: 'records',
        title: 'What might be recorded',
        blocks: [
          {
            type: 'list',
            items: [
              'Your Roblox and Discord user IDs, usernames and verified account link.',
              'Your current community roles and role changes.',
              'Events you RSVP to, attend or receive a confirmed result from.',
              'Support tickets, reports or appeals you submit.',
              'Evidence, staff findings and clearly scoped moderation actions connected to a case.',
              'A timeline showing where a record came from and what happened next.',
            ],
          },
        ],
      },
      {
        id: 'important-differences',
        title: 'Important differences',
        blocks: [
          {
            type: 'list',
            items: [
              'A report is an allegation. It does not mean the report is true.',
              'A finding is a staff decision made after review.',
              'A requested action has not happened yet.',
              'An executed action has been confirmed by the relevant platform or connector.',
              'A reversed action stays in the history so the correction is clear.',
              'The product does not use an unexplained risk score to decide whether you should be punished.',
            ],
          },
        ],
      },
      {
        id: 'who-sees',
        title: 'Who may see it',
        blocks: [
          {
            type: 'paragraph',
            text: 'The workspace owner decides which authorised staff can see community records. Some actions also send the information needed to Roblox, Discord or an installed game connector. Private notes and evidence should only be available to staff who need them.',
          },
        ],
      },
      {
        id: 'choices',
        title: 'Your choices and help',
        blocks: [
          {
            type: 'list',
            items: [
              'Ask the community owner what information their workspace keeps and why.',
              'Ask them to correct something that is wrong.',
              'Use the configured appeal process if you disagree with a moderation outcome.',
              'Do not upload passwords, Roblox cookies, home addresses or unrelated private information.',
              'Ask a parent, guardian or trusted adult for help if a privacy explanation is unclear or a record makes you uncomfortable.',
              `For help from the service operator, contact ${legalConfig.privacyEmail}.`,
            ],
          },
        ],
      },
      {
        id: 'owner-note',
        title: 'For community owners',
        blocks: [
          {
            type: 'paragraph',
            text: 'This notice does not replace the owner’s own age-appropriate privacy information. Before enabling member-facing features, owners must explain their purpose, lawful basis, staff access, retention and complaint route in language their members can understand.',
          },
        ],
      },
    ],
  },
  {
    slug: 'cookies',
    shortTitle: 'Cookies',
    title: 'Cookie Policy',
    summary:
      'What browser storage is used on the marketing site and hosted dashboard.',
    audience: 'Site visitors and dashboard users',
    sections: [
      {
        id: 'current-site',
        title: '1. Current marketing site',
        blocks: [
          {
            type: 'paragraph',
            text: 'The current marketing-site build contains no analytics, advertising pixels or behavioural-tracking SDK. It does not intentionally set non-essential cookies. As a result, this build does not show a consent banner that would serve no purpose.',
          },
          {
            type: 'paragraph',
            text: 'The site may still receive ordinary network information through its eventual hosting provider. The production hosting provider and its exact logging behaviour must be added to the Privacy Policy and Subprocessors page before launch.',
          },
        ],
      },
      {
        id: 'dashboard-storage',
        title: '2. Authenticated dashboard storage',
        blocks: [
          {
            type: 'paragraph',
            text: 'Strictly necessary browser storage may be required to keep a user signed in, protect requests, balance traffic and remember essential security state. The production application configuration has not been supplied, so the exact register below is intentionally incomplete.',
          },
          {
            type: 'table',
            columns: ['Name', 'Purpose', 'Provider', 'Duration', 'Category'],
            rows: [
              [
                '[SESSION COOKIE NAME]',
                'Maintain an authenticated dashboard session.',
                '[AUTH OR APP PROVIDER]',
                '[SESSION DURATION]',
                'Strictly necessary',
              ],
              [
                '[REQUEST-PROTECTION COOKIE NAME]',
                'Protect requests against unauthorised submission.',
                '[APP PROVIDER]',
                '[DURATION]',
                'Strictly necessary',
              ],
              [
                '[LOAD-BALANCING COOKIE, IF ANY]',
                'Route a request to the correct service instance.',
                '[HOSTING PROVIDER]',
                '[DURATION]',
                'Strictly necessary',
              ],
            ],
          },
        ],
      },
      {
        id: 'third-party',
        title: '3. Third-party pages',
        blocks: [
          {
            type: 'paragraph',
            text: 'Checkout, Discord authorisation or Roblox authorisation may open a page operated by Stripe, Discord or Roblox. Those providers control storage on their own domains and explain it in their policies. A link to a third-party page does not permit this marketing site to read that provider’s cookies.',
          },
        ],
      },
      {
        id: 'future-changes',
        title: '4. If non-essential technology is added',
        blocks: [
          {
            type: 'paragraph',
            text: 'Before adding non-essential analytics, advertising or similar storage, the operator must update this register and obtain prior, informed consent where required. Rejecting non-essential storage must be as easy as accepting it, and the service must continue to provide essential functionality where practicable.',
          },
        ],
      },
      {
        id: 'controls',
        title: '5. Browser controls and contact',
        blocks: [
          {
            type: 'paragraph',
            text: `Most browsers let you inspect or delete stored data. Blocking strictly necessary storage can stop sign-in or security features from working. Questions about this policy may be sent to ${legalConfig.privacyEmail}.`,
          },
        ],
      },
    ],
  },
  {
    slug: 'acceptable-use',
    shortTitle: 'Acceptable use',
    title: 'Acceptable Use Policy',
    summary: 'Clear boundaries for safe, authorised community operations.',
    audience: 'Workspace owners, staff, connectors and member-facing users',
    sections: [
      {
        id: 'purpose',
        title: '1. Purpose',
        blocks: [
          {
            type: 'paragraph',
            text: `This policy protects people, connected communities and the service. It applies to every use of ${product}, including the dashboard, Discord commands, forms, imports, APIs and installed connectors.`,
          },
        ],
      },
      {
        id: 'authorised-use',
        title: '2. Use only what you control',
        blocks: [
          {
            type: 'list',
            items: [
              'Connect only Roblox communities, experiences and Discord servers you are authorised to administer.',
              'Use owner-selected Discord channels and official APIs for imports. Do not attempt to recover deleted or inaccessible history.',
              'Use supported, versioned adapter operations. Do not turn a connector into arbitrary remote code execution.',
              'Respect platform rate limits, permission boundaries and developer terms.',
            ],
          },
        ],
      },
      {
        id: 'people',
        title: '3. Treat people and records fairly',
        blocks: [
          {
            type: 'list',
            items: [
              'Do not harass, threaten, discriminate against, dox or exploit another person.',
              'Do not present an allegation as a confirmed finding or hide a reversal from the member history.',
              'Do not fabricate, alter or selectively mislabel evidence, timestamps, source attribution or action outcomes.',
              'Do not build public “worst member” rankings, unexplained risk scores or unauthorised cross-community ban lists.',
              'Do not automate platform-wide punishment. Staff must choose an explicit platform, scope, duration and action.',
              'Collect the minimum information needed, particularly where community members may be under 18.',
            ],
          },
        ],
      },
      {
        id: 'security-abuse',
        title: '4. Security and platform abuse',
        blocks: [
          {
            type: 'list',
            items: [
              'Do not submit, request, store or share .ROBLOSECURITY cookies.',
              'Do not probe, scan, overload or bypass access controls without written permission for a defined security test.',
              'Do not use stolen credentials, impersonate staff or retain access after authorisation is removed.',
              'Do not send spam, deceptive announcements, uncontrolled mentions or arbitrary cross-platform chat relays.',
              'Do not upload malware, illegal content, credentials or content that infringes another person’s rights.',
              'Do not use the service to surveil private Roblox or Discord communications that the connected account cannot lawfully access.',
            ],
          },
        ],
      },
      {
        id: 'member-features',
        title: '5. Member-facing features',
        blocks: [
          {
            type: 'paragraph',
            text: 'Tickets, reports, appeals, event responses and verification flows must clearly identify the workspace collecting the information and the purpose of the form. Owners must provide a route to challenge inaccurate records and to appeal where the configured workflow offers an appeal.',
          },
        ],
      },
      {
        id: 'enforcement',
        title: '6. Enforcement and reporting',
        blocks: [
          {
            type: 'paragraph',
            text: `We may investigate suspected violations and restrict the smallest practical part of the service while doing so. Serious or repeated violations may lead to workspace suspension or termination. Where appropriate, we may preserve evidence or report conduct to a platform or lawful authority. Report security issues to ${legalConfig.supportEmail}; do not expose them publicly before there is a reasonable opportunity to respond.`,
          },
        ],
      },
    ],
  },
  {
    slug: 'dpa',
    shortTitle: 'DPA',
    title: 'Data Processing Addendum',
    summary: 'Processor terms for customer-controlled community information.',
    audience: 'Workspace owners acting as controllers',
    sections: [
      {
        id: 'status',
        title: 'Document status',
        blocks: [
          {
            type: 'note',
            title: 'Draft—not yet executable',
            text: 'This DPA contains the expected structure but cannot be accepted or signed until the operator, hosting locations, subprocessors, security contacts, deletion windows and transfer mechanisms are confirmed. It is not a substitute for an executed addendum.',
          },
          {
            type: 'paragraph',
            text: `Once completed, this DPA will form part of the agreement between a workspace customer (Customer) and ${entity} (Processor) for ${product}.`,
          },
        ],
      },
      {
        id: 'roles',
        title: '1. Roles and scope',
        blocks: [
          {
            type: 'paragraph',
            text: 'Customer determines the purposes and essential means of processing customer-controlled community information and acts as controller or processor for another controller. The Processor handles that information only to provide, secure and support the service under the agreement and Customer’s documented instructions.',
          },
          {
            type: 'paragraph',
            text: 'The Processor may act as an independent controller for its own account administration, billing, legal compliance and narrowly scoped service-security records, as explained in the Privacy Policy.',
          },
        ],
      },
      {
        id: 'details',
        title: '2. Processing details',
        blocks: [
          {
            type: 'table',
            columns: ['Item', 'Description'],
            rows: [
              [
                'Subject matter',
                'Hosting and connecting configured Roblox, Discord and community-operation workflows.',
              ],
              [
                'Duration',
                'For the subscription term plus the documented export, deletion, backup and legal-retention periods.',
              ],
              [
                'Nature and purpose',
                'Collection, storage, organisation, retrieval, display, transmission, logging, reconciliation, restriction, deletion and other processing needed for instructed operations.',
              ],
              [
                'People',
                'Community members, applicants, event attendees, reporters, reported users, appellants, staff, workspace owners and support contacts.',
              ],
              [
                'Data',
                'Platform identifiers, usernames, roles, identity links, attendance, event results, tickets, reports, evidence, findings, actions, appeals, announcements, staff notes and audit metadata.',
              ],
              [
                'Sensitive data',
                'Not intentionally required, but user-submitted evidence or notes may contain sensitive information. Customer must minimise and lawfully handle it.',
              ],
            ],
          },
        ],
      },
      {
        id: 'instructions',
        title: '3. Documented instructions',
        blocks: [
          {
            type: 'paragraph',
            text: 'The agreement, workspace settings, authorised user actions, supported imports and written support instructions form Customer’s documented instructions. The Processor must inform Customer if an instruction appears to violate applicable data-protection law, unless prohibited from doing so.',
          },
        ],
      },
      {
        id: 'processor-duties',
        title: '4. Processor duties',
        blocks: [
          {
            type: 'list',
            items: [
              'Process customer-controlled information only on documented instructions, including for international transfers.',
              'Ensure people authorised to process the information are bound by appropriate confidentiality duties.',
              'Maintain measures appropriate to the risk and assist Customer with security, rights requests, impact assessments and regulator consultations as required.',
              'Notify Customer without undue delay after confirming a personal-data breach affecting Customer data, with available information needed for Customer’s assessment.',
              'Keep records needed to demonstrate compliance and make appropriate information available for reasonable audits, subject to confidentiality and security controls.',
              'Delete or return Customer data at the end of the service as selected by Customer and required by law, according to the completed retention schedule.',
            ],
          },
        ],
      },
      {
        id: 'customer-duties',
        title: '5. Customer duties',
        blocks: [
          {
            type: 'list',
            items: [
              'Provide lawful, fair and documented instructions and give required privacy information to community members.',
              'Configure staff access, protected roles, approvals, platform scope and evidence access appropriately.',
              'Ensure submitted data is relevant, accurate enough for its purpose and not retained longer than necessary.',
              'Respond to member rights requests and appeals, with reasonable assistance from the Processor.',
              'Avoid uploading unnecessary sensitive data, secrets or .ROBLOSECURITY cookies.',
            ],
          },
        ],
      },
      {
        id: 'security-measures',
        title: '6. Security measures to confirm',
        blocks: [
          {
            type: 'list',
            items: [
              'Workspace isolation and scoped connector credentials.',
              'Permission rechecks when external actions execute.',
              'Idempotent writes, bounded retries and provider reconciliation.',
              'Visible integration-health and partial-failure states.',
              'Append-only staff audit records for configured actions.',
              'Access control, encryption, backup, vulnerability-management and incident-response details to be completed for the production architecture.',
            ],
          },
          {
            type: 'note',
            title: 'No unsupported certification claim',
            text: 'This draft does not claim ISO, SOC, PCI or other certification. Add only controls that have been implemented and verified.',
          },
        ],
      },
      {
        id: 'subprocessors',
        title: '7. Subprocessors',
        blocks: [
          {
            type: 'paragraph',
            text: 'Customer grants general authorisation for the completed Subprocessors list, subject to an agreed change-notice process and a reasonable opportunity to object on data-protection grounds. The Processor remains responsible for subprocessors to the extent required by applicable law and must impose materially equivalent data-protection obligations.',
          },
        ],
      },
      {
        id: 'transfers',
        title: '8. Restricted transfers',
        blocks: [
          {
            type: 'paragraph',
            text: 'The production processing locations and transfer mechanism are not yet supplied. Before execution, the parties must identify any restricted transfer and incorporate the applicable adequacy decision, approved standard clauses, UK addendum or international data transfer agreement, plus any required assessment and supplementary measures.',
          },
        ],
      },
      {
        id: 'rights-audits',
        title: '9. Rights requests and audits',
        blocks: [
          {
            type: 'paragraph',
            text: 'Taking account of the nature of processing, the Processor will provide reasonable technical and organisational assistance for rights requests. Customer should use available workspace tools first. Audit scope, frequency, confidentiality, cost and independent-report alternatives must be set in the executed DPA so an audit does not expose another customer’s data or service security.',
          },
        ],
      },
      {
        id: 'conflict',
        title: '10. Order of precedence and contact',
        blocks: [
          {
            type: 'paragraph',
            text: `If an executed DPA conflicts with the main agreement on processing Customer data, the executed DPA controls to the extent of the conflict. Privacy and DPA questions may be sent to ${legalConfig.privacyEmail}.`,
          },
        ],
      },
    ],
  },
  {
    slug: 'subprocessors',
    shortTitle: 'Subprocessors',
    title: 'Subprocessors and Connected Platforms',
    summary:
      'A transparent register of production service providers and platform roles.',
    audience: 'Workspace owners and privacy reviewers',
    sections: [
      {
        id: 'status',
        title: 'Current status',
        blocks: [
          {
            type: 'note',
            title: 'Production vendor list required',
            text: 'The infrastructure stack has not been supplied. Placeholder rows prevent unverified vendors, locations or transfer safeguards from being presented as fact. Complete this register before accepting production data.',
          },
        ],
      },
      {
        id: 'processors',
        title: 'Service providers to complete',
        blocks: [
          {
            type: 'table',
            columns: ['Provider', 'Purpose', 'Data', 'Location / safeguard'],
            rows: [
              [
                '[HOSTING PROVIDER]',
                'Application hosting and network delivery',
                'Encrypted application traffic and service data',
                '[REGIONS AND TRANSFER MECHANISM]',
              ],
              [
                '[DATABASE PROVIDER]',
                'Primary application data storage',
                'Account and workspace records',
                '[REGIONS AND TRANSFER MECHANISM]',
              ],
              [
                '[OBJECT STORAGE PROVIDER]',
                'Evidence and file storage',
                'Customer-selected evidence and metadata',
                '[REGIONS AND TRANSFER MECHANISM]',
              ],
              [
                '[AUTHENTICATION PROVIDER]',
                'Account authentication and session security',
                'Account identifiers and security metadata',
                '[REGIONS AND TRANSFER MECHANISM]',
              ],
              [
                '[EMAIL PROVIDER]',
                'Transactional service email',
                'Recipient, message and delivery metadata',
                '[REGIONS AND TRANSFER MECHANISM]',
              ],
              [
                '[MONITORING PROVIDER, IF USED]',
                'Error and reliability monitoring',
                'Minimised diagnostic data',
                '[REGIONS AND TRANSFER MECHANISM]',
              ],
            ],
          },
        ],
      },
      {
        id: 'billing',
        title: 'Billing provider',
        blocks: [
          {
            type: 'table',
            columns: ['Provider', 'Role', 'Purpose', 'Details to confirm'],
            rows: [
              [
                'Stripe',
                'Hosted billing provider; legal role can vary by activity',
                'Checkout, subscription status, invoices and cancellation',
                'Contracting Stripe entity, locations and applicable data terms',
              ],
            ],
          },
          {
            type: 'paragraph',
            text: 'Payment card entry occurs in Stripe-hosted flows. The final policy should describe the billing metadata returned to the service and link to the correct Stripe entity’s notice.',
          },
        ],
      },
      {
        id: 'platforms',
        title: 'Connected platforms are different',
        blocks: [
          {
            type: 'table',
            columns: ['Platform or adapter', 'How it is used', 'Relationship'],
            rows: [
              [
                'Roblox Open Cloud',
                'Owner-authorised community and experience operations',
                'A connected third-party platform, not automatically a subprocessor of the operator',
              ],
              [
                'Discord',
                'Commands, tickets, roles, announcements and staff-only records',
                'A connected third-party platform, not automatically a subprocessor of the operator',
              ],
              [
                'Cmdr, Adonis and HD Admin',
                'Versioned, allowlisted in-experience operations',
                'Customer-installed adapters; capability varies by supported release',
              ],
            ],
          },
          {
            type: 'paragraph',
            text: 'The customer directs information to connected platforms through its own accounts and configuration. Each platform has its own terms and privacy responsibilities. No partner or endorsement relationship is claimed.',
          },
        ],
      },
      {
        id: 'changes',
        title: 'Changes to this list',
        blocks: [
          {
            type: 'paragraph',
            text: `Before launch, specify the notice method and period for a new subprocessor and the process for a reasonable data-protection objection. Questions may be sent to ${legalConfig.privacyEmail}.`,
          },
        ],
      },
    ],
  },
];

export const legalNav = legalDocuments.map((document) => ({
  label: document.shortTitle,
  href: `/legal/${document.slug}/`,
}));

export function getLegalDocument(slug: string) {
  return legalDocuments.find((document) => document.slug === slug);
}
