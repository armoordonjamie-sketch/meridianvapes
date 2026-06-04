/**
 * Legal / policy page content.
 *
 * IMPORTANT: this is placeholder template copy to make the pages render. It is
 * NOT legal advice — have a qualified professional review and adapt all policy
 * text before going live. NAP and company details come from the site config.
 */

export type Block =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }

export interface LegalSection {
  heading: string
  blocks: Block[]
}

export interface LegalDoc {
  slug: string
  title: string
  description: string
  /** Last updated date (ISO). Shown to users; keep current on edits. */
  updated: string
  intro: string
  sections: LegalSection[]
}

const PLACEHOLDER_NOTE =
  'This is placeholder policy text provided with the site scaffold. Review and adapt it with qualified legal advice before publishing.'

export const LEGAL_DOCS: Record<string, LegalDoc> = {
  terms: {
    slug: 'terms',
    title: 'Terms & Conditions',
    description:
      'The terms and conditions governing the use of the Meridian Vapes website and the purchase of products.',
    updated: '2026-01-01',
    intro: PLACEHOLDER_NOTE,
    sections: [
      {
        heading: '1. About these terms',
        blocks: [
          {
            type: 'p',
            text: 'These terms govern your use of this website and any orders you place. By using the site or placing an order you agree to them.',
          },
        ],
      },
      {
        heading: '2. Eligibility and age',
        blocks: [
          {
            type: 'p',
            text: 'You must be 18 or over to use this site and to buy any product. It is an offence to buy or attempt to buy age-restricted products on behalf of someone under 18 (proxy purchasing).',
          },
        ],
      },
      {
        heading: '3. Orders and acceptance',
        blocks: [
          {
            type: 'p',
            text: 'An order is an offer to buy. We accept it when age verification has passed and we confirm dispatch. We may decline or cancel an order, for example where verification fails or an item is unavailable.',
          },
        ],
      },
      {
        heading: '4. Pricing and payment',
        blocks: [
          {
            type: 'p',
            text: 'Prices are shown in pounds sterling and include VAT where applicable. Payment is taken via our payment provider at checkout.',
          },
        ],
      },
      {
        heading: '5. Delivery',
        blocks: [
          {
            type: 'p',
            text: 'We deliver locally within our published coverage area and windows. Delivery is subject to a doorstep ID check. See our Delivery Policy for details.',
          },
        ],
      },
      {
        heading: '6. Liability',
        blocks: [
          {
            type: 'p',
            text: 'Nothing in these terms excludes liability that cannot be excluded by law. Otherwise our liability is limited to the value of the order.',
          },
        ],
      },
    ],
  },

  privacy: {
    slug: 'privacy',
    title: 'Privacy Policy',
    description:
      'How Meridian Vapes collects, uses and protects your personal data, including age-verification data.',
    updated: '2026-01-01',
    intro: PLACEHOLDER_NOTE,
    sections: [
      {
        heading: 'Who we are',
        blocks: [
          {
            type: 'p',
            text: 'We are the data controller for personal data processed through this site. Contact details are in the footer and on the contact page.',
          },
        ],
      },
      {
        heading: 'What we collect',
        blocks: [
          {
            type: 'ul',
            items: [
              'Order details: items, delivery address and contact details.',
              'Age-verification data, used solely to confirm you are 18 or over.',
              'Functional cookies, such as your age-gate acknowledgement and basket.',
            ],
          },
        ],
      },
      {
        heading: 'How we use it',
        blocks: [
          {
            type: 'p',
            text: 'We use your data to process and deliver orders, to verify age, to provide support and to meet legal obligations. We do not use your details for marketing email.',
          },
        ],
      },
      {
        heading: 'Your rights',
        blocks: [
          {
            type: 'p',
            text: 'You have rights under UK GDPR including access, rectification and erasure. Contact us to exercise them. You can also complain to the Information Commissioner’s Office (ICO).',
          },
        ],
      },
    ],
  },

  returns: {
    slug: 'returns',
    title: 'Returns',
    description:
      'Your return and refund rights at Meridian Vapes, including hygiene and safety exclusions for certain products.',
    updated: '2026-01-01',
    intro: PLACEHOLDER_NOTE,
    sections: [
      {
        heading: 'Your right to cancel',
        blocks: [
          {
            type: 'p',
            text: 'For most online orders you have a statutory right to cancel within 14 days of delivery. Some products are excluded for hygiene and safety reasons once opened.',
          },
        ],
      },
      {
        heading: 'Hygiene exclusions',
        blocks: [
          {
            type: 'ul',
            items: [
              'E-liquids and nic shots cannot be returned once the seal is broken.',
              'Pods, coils and items in contact with e-liquid cannot be returned once opened.',
              'Faulty or incorrectly supplied items can always be returned.',
            ],
          },
        ],
      },
      {
        heading: 'Faulty items',
        blocks: [
          {
            type: 'p',
            text: 'If an item is faulty, contact us with your order reference and a description. We will arrange a replacement or refund in line with your legal rights.',
          },
        ],
      },
    ],
  },

  'delivery-policy': {
    slug: 'delivery-policy',
    title: 'Delivery Policy',
    description:
      'Meridian Vapes delivery coverage, windows, the doorstep ID check and what happens if no one is available.',
    updated: '2026-01-01',
    intro: PLACEHOLDER_NOTE,
    sections: [
      {
        heading: 'Coverage and windows',
        blocks: [
          {
            type: 'p',
            text: 'We deliver locally across Eltham and parts of South East London. Coverage and available windows are confirmed at checkout against your postcode.',
          },
        ],
      },
      {
        heading: 'Doorstep ID check',
        blocks: [
          {
            type: 'p',
            text: 'Every delivery is age-restricted. The recipient must be 18 or over and show valid photo ID. We operate a Challenge 25 approach.',
          },
          {
            type: 'ul',
            items: [
              'Orders are never left unattended or with a neighbour.',
              'If ID cannot be shown, the order will not be handed over.',
              'Repeated failed deliveries may be cancelled and refunded less any costs.',
            ],
          },
        ],
      },
    ],
  },

  'age-verification': {
    slug: 'age-verification',
    title: 'Age Verification Policy',
    description:
      'How Meridian Vapes verifies that customers are 18 or over, at checkout and on delivery.',
    updated: '2026-01-01',
    intro: PLACEHOLDER_NOTE,
    sections: [
      {
        heading: 'Our commitment',
        blocks: [
          {
            type: 'p',
            text: 'It is illegal to sell vaping products to anyone under 18. We take reasonable steps to verify age at two points: at checkout and on delivery.',
          },
        ],
      },
      {
        heading: 'At checkout',
        blocks: [
          {
            type: 'p',
            text: 'Orders are subject to an age-verification check before dispatch. An order is not dispatchable until verification passes. Where a check cannot be completed automatically, we may request further information.',
          },
        ],
      },
      {
        heading: 'On delivery',
        blocks: [
          {
            type: 'p',
            text: 'Our drivers carry out a doorstep ID check using a Challenge 25 approach. Acceptable ID includes a passport, a UK or EU photocard driving licence, or a PASS-accredited proof-of-age card.',
          },
        ],
      },
    ],
  },

  cookies: {
    slug: 'cookies',
    title: 'Cookie Policy',
    description:
      'The cookies used by Meridian Vapes. We use functional cookies only — no advertising or social pixels.',
    updated: '2026-01-01',
    intro: PLACEHOLDER_NOTE,
    sections: [
      {
        heading: 'Cookies we use',
        blocks: [
          {
            type: 'ul',
            items: [
              'Age-gate acknowledgement: remembers that you confirmed you are 18 or over.',
              'Basket: keeps the items in your basket between pages.',
              'Optional analytics (GA4): only if enabled, to understand site usage.',
            ],
          },
        ],
      },
      {
        heading: 'What we do not use',
        blocks: [
          {
            type: 'p',
            text: 'We do not use advertising pixels such as Google Ads or Meta, and we do not embed social media tracking.',
          },
        ],
      },
    ],
  },

  'responsible-retailing': {
    slug: 'responsible-retailing',
    title: 'Responsible Retailing',
    description:
      'Meridian Vapes’ commitments to responsible retailing of age-restricted vaping products.',
    updated: '2026-01-01',
    intro: PLACEHOLDER_NOTE,
    sections: [
      {
        heading: 'Our principles',
        blocks: [
          {
            type: 'ul',
            items: [
              'We sell only to adults aged 18 or over and verify age at checkout and on delivery.',
              'We do not stock single-use disposable vapes.',
              'We keep product information factual and make no health claims about vaping.',
              'We do not run promotions, discounts or time-limited offers on age-restricted products.',
              'We do not target or market to under-18s, and we use no advertising pixels.',
            ],
          },
        ],
      },
      {
        heading: 'Nicotine and addiction',
        blocks: [
          {
            type: 'p',
            text: 'Many of our products contain nicotine, which is an addictive substance. Products are intended for existing adult smokers and vapers.',
          },
        ],
      },
      {
        heading: 'Reporting concerns',
        blocks: [
          {
            type: 'p',
            text: 'If you have a concern about a sale or a delivery, contact us using the details on the contact page.',
          },
        ],
      },
    ],
  },
}

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return LEGAL_DOCS[slug]
}
