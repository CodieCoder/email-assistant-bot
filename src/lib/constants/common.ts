import { CrudOptions } from '@dataui/crud';
import { DomainEntity } from 'src/modules/domain/domain.entity';

export const PROTECTED_PROPERTIES = [
  'authToken',
  'imapPassword',
  'apiKey',
  'refreshToken',
  'password',
  'deletedAt',
];

export const COMMON_CRUD_OPTIONS: Partial<CrudOptions> = {
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  query: {
    maxLimit: 100,
    cache: 2000,
    alwaysPaginate: true,
    exclude: PROTECTED_PROPERTIES,
    sort: [
      {
        field: 'createdAt',
        order: 'DESC',
      },
    ],
  },
};

export const COMMON_DOMAIN_DETAILS: Partial<DomainEntity>[] = [
  {
    name: 'Google',
    emailDomain: 'gmail.com',
    description: 'Google LLC',
    website: 'https://www.google.com/',
    summary:
      'Google is a multinational technology company specializing in Internet-related services and products, including online advertising technologies, a search engine, cloud computing, software, and hardware. Gmail is its free email service.',
  },
  {
    name: 'Microsoft',
    emailDomain: 'outlook.com', // Primary modern domain
    description: 'Microsoft Corporation',
    website: 'https://outlook.live.com/',
    summary:
      'Microsoft provides the Outlook email service, part of the Microsoft 365 suite. It offers personal and business email, calendaring, and task management. Also associated with hotmail.com and live.com domains.',
  },
  {
    name: 'Microsoft', // Separate entry for Hotmail if distinct handling is needed, otherwise handled by logic
    emailDomain: 'hotmail.com',
    description: 'Microsoft Corporation (Hotmail)',
    website: 'https://outlook.live.com/',
    summary:
      'Hotmail was one of the first webmail services, acquired by Microsoft and now integrated into Outlook.com.',
  },
  {
    name: 'Microsoft', // Separate entry for Live if distinct handling is needed
    emailDomain: 'live.com',
    description: 'Microsoft Corporation (Live Mail)',
    website: 'https://outlook.live.com/',
    summary:
      "Windows Live Mail was part of Microsoft's Windows Live suite, now integrated into Outlook.com.",
  },
  {
    name: 'Yahoo',
    emailDomain: 'yahoo.com',
    description: 'Yahoo Inc.',
    website: 'https://mail.yahoo.com/',
    summary:
      'Yahoo Mail is a free email service provided by Yahoo. It was one of the original major webmail providers.',
  },
  {
    name: 'Apple',
    emailDomain: 'icloud.com', // Primary domain for iCloud Mail
    description: 'Apple Inc.',
    website: 'https://www.icloud.com/mail',
    summary:
      "Apple's iCloud Mail is a free email service integrated with its iCloud cloud services, available for users of Apple devices and via the web. Also associated with me.com and mac.com domains.",
  },
  {
    name: 'AOL',
    emailDomain: 'aol.com',
    description: 'AOL (America Online)',
    website: 'https://mail.aol.com/',
    summary:
      'AOL Mail is a free web-based email service provided by AOL, a division of Yahoo Inc. It was a prominent internet service provider and web portal in the past.',
  },
  {
    name: 'Zoho',
    emailDomain: 'zohomail.com', // Domain for their service, businesses often use custom domains
    description: 'Zoho Corporation',
    website: 'https://www.zoho.com/mail/',
    summary:
      'Zoho Mail is a secure email hosting service primarily aimed at businesses, offering integrated collaboration and productivity tools. Known for privacy features and custom domain support.',
  },
  {
    name: 'Proton',
    emailDomain: 'proton.me', // Newer primary domain
    description: 'Proton AG',
    website: 'https://proton.me/mail',
    summary:
      'Proton Mail is an end-to-end encrypted email service focused on privacy and security, based in Switzerland. Also associated with the protonmail.com domain.',
  },
  {
    name: 'Proton',
    emailDomain: 'protonmail.com', // Older domain
    description: 'Proton AG',
    website: 'https://proton.me/mail',
    summary:
      'Proton Mail is an end-to-end encrypted email service focused on privacy and security, based in Switzerland. The primary domain is now proton.me.',
  },
  {
    name: 'GMX',
    emailDomain: 'gmx.com', // Common domain, others exist (gmx.co.uk, gmx.us)
    description: 'GMX (Global Mail eXchange)',
    website: 'https://www.gmx.com/',
    summary:
      'GMX is a free advertising-supported email service owned by United Internet, a German company. Offers webmail and POP3/IMAP access.',
  },
  {
    name: 'Mail.com',
    emailDomain: 'mail.com', // Provider domain, offers many vanity domains
    description: 'Mail.com',
    website: 'https://www.mail.com/',
    summary:
      'Mail.com is a web portal and email service owned by United Internet. Known for offering a wide variety of free, selectable domain names for email addresses (e.g., @usa.com, @email.com).',
  },
  {
    name: 'Yandex',
    emailDomain: 'yandex.com', // International domain
    description: 'Yandex',
    website: 'https://mail.yandex.com/',
    summary:
      'Yandex Mail is a free email service from the Russian technology company Yandex. Popular in Russia and CIS countries. Also associated with yandex.ru.',
  },
  {
    name: 'Yandex',
    emailDomain: 'yandex.ru', // Russian domain
    description: 'Yandex',
    website: 'https://mail.yandex.ru/',
    summary:
      'Yandex Mail is a free email service from the Russian technology company Yandex. Very popular in Russia and CIS countries.',
  },
  // Add more providers as needed
];
