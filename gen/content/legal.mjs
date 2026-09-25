// The full legal text from the design document, Section 8. Placeholders stay exactly as written.
export const TERMS = {
  title: 'Terms of Service',
  entity: '[Legal Entity Name]',
  intro: 'Welcome to Cash Pass. These Terms of Service ("Terms") govern your access to and use of the yourcashpass.com website and the resources and services made available through it (collectively, the "Services"), operated by [Legal Entity Name] ("Cash Pass," "we," "us," or "our"). By accessing or using the Services, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree, please discontinue use of the Services.',
  sections: [
    { h: '1. Company Information', blocks: [{ lines: ['Company: [Legal Entity Name]', 'Mailing Address: [EIN Address]', 'Phone: [INSERT PHONE HERE]', 'Email: support@yourcashpass.com'] }] },
    { h: '2. Nature of Services', blocks: [
      'Cash Pass is a card picker app for the phone you already carry. It takes the cards you own and the rules you set, then names which of your own cards to tap at the till, using your spending history, your caps and fees, and the bonus categories you would otherwise forget to activate.',
      'Plans are sold on this website as annual subscriptions paid online (Pass at $59 a year and Pass Family at $99 a year), alongside a Free plan that costs nothing and never bills. Cash Pass is software only: it issues no card, holds no balance, moves no money, does not lend and does not offer or recommend new cards, so every protection on your cards stays with the issuer that provided them. Card connections on paid plans are read only, made through a third party aggregator using a token rather than your password, and can be disconnected at any time. The Services include this website, the Cash Pass app, customer support, and an optional SMS program.'
    ] },
    { h: '3. Rewards and Software Disclaimer', blocks: [
      'Cash Pass compares the published reward terms of payment cards you already hold and applies rules you set. It is not financial, tax, legal or credit advice, and it does not recommend opening, closing or applying for any card. Rewards are set, tracked and paid by your card issuer, can change without notice, and are not guaranteed by Cash Pass. Figures shown on this website are illustrative examples.',
      'Cash Pass is software. It issues no card, holds no balance, moves no money and does not lend. Card connections on paid plans are read only, made through a third party aggregator using a token rather than your password, and can be disconnected at any time. Every protection attached to your cards stays with the issuer that provided them.',
      'Paid plans renew annually at the price shown at checkout until cancelled. You can cancel at any time from the app or by emailing support@yourcashpass.com, and your plan then runs to the end of the paid year.'
    ] },
    { h: '4. Eligibility and Acceptable Use', blocks: [
      'You must be at least 18 years of age, or the age of majority in your jurisdiction, to use the Services. By using the Services, you represent that you meet this requirement and that any information you provide is accurate and current.',
      'You agree to use the Services only for lawful purposes and in a manner that does not infringe the rights of, or restrict or inhibit the use of, the Services by any third party. You agree not to attempt to gain unauthorized access to any portion of the Services, disrupt their operation, or use them to transmit harmful or unlawful content.'
    ] },
    { h: '5. Intellectual Property', blocks: ['All content on the Services, including text, graphics, logos, icons, images, and the compilation thereof, is the property of [Legal Entity Name] or its content suppliers and is protected by applicable intellectual property laws. The Cash Pass name and logo are marks of the Company. You may not reproduce, distribute, modify, or create derivative works from any content without our prior written permission.'] },
    { h: '6. Third-Party Content and Links', blocks: ['The Services may reference, summarize, or link to third-party content, products, and websites for convenience and informational purposes. Such references do not constitute endorsement, and we are not responsible for the accuracy, availability, or content of third-party materials. Your interactions with any third party are solely between you and that party.'] },
    { h: '7. SMS Messaging: Promotional Marketing Only', id: 'sms', blocks: [
      '[Legal Entity Name] operates an SMS messaging program strictly for promotional marketing purposes. By enrolling in this program, you acknowledge and agree to the following terms:',
      { list: [
        'Program Description: By opting in, you consent to receive recurring automated promotional marketing text messages from Cash Pass at the mobile number you provide. Consent to receive marketing text messages is not a condition of any purchase.',
        'Message Frequency: Message frequency varies.',
        'Message and Data Rates: Message and data rates may apply.',
        'Opting Out and Help: You may opt out of the SMS program at any time by texting the keyword STOP to [INSERT SHORT CODE]. After you send STOP, we will send a one-time message confirming that you have been unsubscribed, and no further messages will be sent. For assistance, text the keyword HELP to [INSERT SHORT CODE], or contact us at support@yourcashpass.com or [INSERT PHONE HERE].',
        'Supported Carriers: Supported carriers include AT&T, T-Mobile, Metro PCS, Verizon Wireless, US Cellular, Google Voice, Cellular One, Cellcom, Cellular South, Interop, and Clearsky. Carriers are not liable for delayed or undelivered messages.',
        'Privacy: No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Information sharing with subcontractors in support services, such as customer service, is permitted. All other use case categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.'
      ] },
      { privacyLink: true }
    ] },
    { h: '8. Disclaimer of Warranties', blocks: ['The Services are provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Services will be uninterrupted, error-free, or free of harmful components, or that any information provided is complete, accurate, or current.'] },
    { h: '9. Limitation of Liability', blocks: ['To the fullest extent permitted by law, [Legal Entity Name] and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss arising from your access to, use of, or inability to use the Services, or reliance on any information provided through them, even if advised of the possibility of such damages.'] },
    { h: '10. Indemnification', blocks: ['You agree to indemnify and hold harmless [Legal Entity Name] and its affiliates from and against any claims, liabilities, damages, losses, and expenses, including reasonable legal fees, arising out of or in any way connected with your use of the Services or your violation of these Terms.'] },
    { h: '11. Governing Law', blocks: ['These Terms are governed by and construed in accordance with the laws of the State of Colorado, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Colorado.'] },
    { h: '12. Changes to These Terms', blocks: ['We may update these Terms from time to time to reflect changes in our Services or applicable law. The current version will always be posted on this page, and your continued use of the Services after any update constitutes acceptance of the revised Terms.'] },
    { h: '13. Contact Information', blocks: ['If you have questions about these Terms, please contact us:', { lines: ['Company: [Legal Entity Name]', 'Phone: [INSERT PHONE HERE]', 'Email: support@yourcashpass.com', 'Address: [EIN Address]'] }] }
  ]
};

export const PRIVACY = {
  title: 'Privacy Policy',
  entity: '[Legal Entity Name]',
  intro: '[Legal Entity Name] ("Cash Pass," "we," "us," or "our") respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains what information we collect through yourcashpass.com (the "Services"), how we use and protect it, and the choices available to you.',
  sections: [
    { h: 'Company Information', blocks: [{ lines: ['Company: [Legal Entity Name]', 'Address: [EIN Address]', 'Phone: [INSERT PHONE HERE]', 'Email: support@yourcashpass.com'] }] },
    { h: '1. Information We Collect', blocks: ['We collect information you provide directly to us, such as your name, email address, and mobile phone number when you contact us, submit a form, or opt in to our SMS program. We also automatically collect limited technical information, such as device type, browser, and usage data, when you interact with the Services.'] },
    { h: '2. How We Use Your Information', blocks: ['We use the information we collect to operate and improve the Services, respond to your inquiries, deliver the updates and SMS messages you request, maintain the security and integrity of the Services, and comply with legal obligations.'] },
    { h: '3. How We Share Your Information', blocks: ['We do not sell your personal information. We may share information with trusted service providers who perform functions on our behalf (such as hosting, analytics, and customer support), and only to the extent necessary for them to provide those services. We may also disclose information when required by law or to protect our rights and the safety of others.'] },
    { h: '4. SMS Messaging and Mobile Data', blocks: [
      'When you opt in to our SMS program, we collect your mobile phone number and your consent records in order to deliver the text messages you have requested. The categories of information collected through the SMS program are used solely to operate the program and send the messages you signed up to receive.',
      'No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Information sharing with subcontractors in support services, such as customer service, is permitted. All other use case categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.',
      'You may cancel SMS messages at any time by replying STOP, and you may request help by replying HELP. Message frequency varies, and message and data rates may apply.'
    ] },
    { h: '5. Cookies and Tracking Technologies', blocks: ['The Services may use cookies and similar technologies to remember your preferences, understand how the Services are used, and improve your experience. You can control cookies through your browser settings, although disabling them may affect certain features.'] },
    { h: '6. Data Security', blocks: ['We implement reasonable administrative, technical, and physical safeguards designed to protect your information. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.'] },
    { h: '7. Data Retention', blocks: ['We retain personal information only for as long as necessary to fulfill the purposes described in this Policy, to comply with our legal obligations, resolve disputes, and enforce our agreements.'] },
    { h: '8. Your Privacy Rights and Choices', blocks: ['Depending on your jurisdiction, you may have the right to access, correct, or delete your personal information, or to object to or restrict certain processing. To exercise these rights, contact us using the details below. You may also opt out of SMS messages at any time by replying STOP.'] },
    { h: '9. Children\'s Privacy', blocks: ['The Services are intended for individuals who are at least 18 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us so we can take appropriate action.'] },
    { h: '10. Third-Party Links', blocks: ['The Services may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites, and we encourage you to review their privacy policies.'] },
    { h: '11. Changes to This Privacy Policy', blocks: ['We may update this Privacy Policy from time to time. The most current version will always be available on this page, and your continued use of the Services indicates your acceptance of any changes.'] },
    { h: '12. Contact Us', blocks: ['If you have questions or requests regarding this Privacy Policy or your personal information, please contact us:', { lines: ['Company: [Legal Entity Name]', 'Phone: [INSERT PHONE HERE]', 'Email: support@yourcashpass.com', 'Address: [EIN Address]'] }] }
  ]
};
