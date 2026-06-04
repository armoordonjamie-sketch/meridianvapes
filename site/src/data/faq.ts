/**
 * FAQ content. Used by /help and the FAQPage JSON-LD.
 * Answers are factual and informational only — no promotional language,
 * no health claims about vaping.
 */
export interface FaqItem {
  question: string
  answer: string
}

export const FAQS: FaqItem[] = [
  {
    question: 'Do I have to be 18 to order?',
    answer:
      'Yes. It is illegal to sell vaping products to anyone under 18 in the UK. You must be 18 or over to place an order, and age is verified before any order is dispatched.',
  },
  {
    question: 'How is my age verified?',
    answer:
      'Age is verified during checkout through an age-verification check. In addition, the driver carries out a doorstep ID check on delivery. The recipient must show valid photo ID showing they are 18 or over.',
  },
  {
    question: 'Which areas do you deliver to?',
    answer:
      'We deliver locally across Eltham and parts of South East London, including Mottingham, New Eltham and parts of Sidcup. Enter your postcode at checkout to confirm coverage and available delivery windows.',
  },
  {
    question: 'What are the delivery windows?',
    answer:
      'Deliveries are made within published local windows. The available windows for your address are shown at checkout once your postcode is confirmed.',
  },
  {
    question: 'What happens if no one is in to receive the order?',
    answer:
      'Because every order is age-restricted, deliveries cannot be left unattended or with a neighbour. A person aged 18 or over must be present to accept the order and show valid photo ID. If no one is available, the driver will attempt to rearrange delivery.',
  },
  {
    question: 'Do you sell disposable vapes?',
    answer:
      'No. We do not stock single-use disposable vapes. Our range is made up of refillable devices, e-liquids, replacement pods and coils, nicotine shots and accessories.',
  },
  {
    question: 'Are your products notified to the MHRA?',
    answer:
      'Nicotine-containing e-liquids and many devices are notified to the Medicines and Healthcare products Regulatory Agency (MHRA) under the Tobacco and Related Products Regulations. Notification status is shown on individual product pages.',
  },
  {
    question: 'Can I return a product?',
    answer:
      'For hygiene and safety reasons, some products cannot be returned once opened. Please read the returns information for full details of your rights and any exclusions.',
  },
  {
    question: 'How should I pay?',
    answer:
      'Payment is taken securely at checkout. The available payment methods are shown during the checkout process.',
  },
]
