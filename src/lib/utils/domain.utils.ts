import { COMMON_DOMAIN_DETAILS } from '../constants';
import { DomainEntity } from 'src/modules/domain/domain.entity';
/**
 * Finds a predefined domain detail object based on an email address or domain name.
 * It performs a case-insensitive exact match against the `emailDomain` property
 * in the `COMMON_DOMAIN_DETAILS` list.
 *
 * @param emailOrDomain The email address (e.g., "user@gmail.com") or domain name (e.g., "outlook.com").
 * @returns The matching domain detail object from COMMON_DOMAIN_DETAILS, or null if not found or input is invalid.
 */
export const getDomain = (
  emailOrDomain: string,
): Partial<DomainEntity> | null => {
  if (!emailOrDomain) {
    return null;
  }

  // 1. Extract the domain part
  let domain: string;
  const atIndex = emailOrDomain.lastIndexOf('@');

  if (atIndex !== -1) {
    // It's likely an email address, extract the part after '@'
    domain = emailOrDomain.substring(atIndex + 1);
  } else {
    // Assume it's already a domain name
    domain = emailOrDomain;
  }

  // 2. Basic validation and normalization
  if (!domain || !domain.includes('.')) {
    // Ensure the extracted part is not empty and looks like a domain (contains at least one dot)
    return null;
  }
  domain = domain.toLowerCase(); // Normalize to lowercase for case-insensitive comparison

  // 3. Find the domain by exact domain match (case-insensitive)
  const foundDomain = COMMON_DOMAIN_DETAILS.find(
    (domain) => domain.emailDomain?.toLowerCase() === domain,
  );

  // 4. Return the result... return the found domain object or null if no match
  return foundDomain || null;
};
