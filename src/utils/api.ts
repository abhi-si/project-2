import { Country } from '../types';

const COUNTRIES_API_URL = 'https://restcountries.com/v3.1/all?fields=name,idd,flags,cca2';

export const fetchCountries = async (): Promise<Country[]> => {
  try {
    const response = await fetch(COUNTRIES_API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }
    const data = await response.json();
    
    return data
      .filter((country: any) => country.idd?.root && country.idd?.suffixes)
      .map((country: any) => ({
        name: country.name,
        idd: country.idd,
        flags: country.flags,
        cca2: country.cca2
      }))
      .sort((a: Country, b: Country) => a.name.common.localeCompare(b.name.common));
  } catch (error) {
    console.error('Error fetching countries:', error);
    // Return fallback countries if API fails
    return [
      {
        name: { common: 'United States' },
        idd: { root: '+1', suffixes: [''] },
        flags: { png: 'https://flagcdn.com/w320/us.png' },
        cca2: 'US'
      },
      {
        name: { common: 'United Kingdom' },
        idd: { root: '+44', suffixes: [''] },
        flags: { png: 'https://flagcdn.com/w320/gb.png' },
        cca2: 'GB'
      },
      {
        name: { common: 'India' },
        idd: { root: '+91', suffixes: [''] },
        flags: { png: 'https://flagcdn.com/w320/in.png' },
        cca2: 'IN'
      }
    ];
  }
};