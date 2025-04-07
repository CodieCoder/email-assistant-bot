import { IAITagReport } from 'src/app/llm/dtos/llm.dto';

export const AIReportPlaceholder: IAITagReport = {
  confidence: 0,
  reason: '',
  description: null,
};

export enum SenderTagDescriptionsEnum {
  customer = 'A sender who is an active customer of the company.',
  buyer = 'A sender who has made purchases but may not be an active customer.',
  hotLead = 'A sender who has shown strong interest in the company’s products or services.',
  coldLead = 'A sender who has shown minimal or no recent interest in the company’s offerings.',
  partner = 'A sender who is a business partner or collaborator.',
  investor = 'A sender who is an investor or potential investor in the company.',
  competitor = 'A sender who is identified as a competitor.',
  seller = 'A sender who is trying to sell products or services to the company.',
  influencer = 'A sender who has influence in the industry or community.',
  other = 'A sender who does not fit into any of the predefined categories.',
}

export enum EmailMessageTagDescriptionsEnum {
  purchase = 'Emails related to purchasing or orders.',
  payment = 'Emails related to payments or invoices.',
  inquiry = 'Emails containing questions or requests for information.',
  complaint = 'Emails expressing dissatisfaction or issues.',
  newsletter = 'Emails that are newsletters or promotional updates.',
  subscription = 'Emails related to subscriptions or recurring services.',
  advertisement = 'Emails that are advertisements or marketing materials.',
  supportRequest = 'Emails requesting technical or customer support.',
  feedback = 'Emails providing feedback or suggestions.',
  urgent = 'Emails marked as urgent or requiring immediate attention.',
  followUp = 'Emails that are follow-ups to previous conversations.',
  internal = 'Emails sent from within the organization.',
  external = 'Emails sent from outside the organization.',
  promotion = 'Emails promoting products or services.',
  event = 'Emails about events or webinars.',
  spam = 'Emails identified as spam or junk.',
  other = 'Emails that do not fit into any predefined category.',
}
