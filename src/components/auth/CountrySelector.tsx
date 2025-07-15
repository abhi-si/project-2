import React, { useState, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Country } from '../../types';
import { fetchCountries } from '../../utils/api';
import { LoadingSkeleton } from '../LoadingSkeleton';

interface CountrySelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({ 
  value, 
  onChange, 
  error 
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      const data = await fetchCountries();
      setCountries(data);
    } catch (error) {
      console.error('Error loading countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedCountry = countries.find(
    country => `${country.idd.root}${country.idd.suffixes[0]}` === value
  );

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${country.idd.root}${country.idd.suffixes[0]}`.includes(searchQuery)
  );

  const handleSelect = (country: Country) => {
    onChange(`${country.idd.root}${country.idd.suffixes[0]}`);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-left flex items-center justify-between transition-colors ${
          error 
            ? 'border-red-500 focus:border-red-500' 
            : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
        }`}
      >
        <div className="flex items-center space-x-2">
          {selectedCountry ? (
            <>
              <img 
                src={selectedCountry.flags.png} 
                alt={selectedCountry.name.common}
                className="w-6 h-4 object-cover rounded"
              />
              <span className="text-gray-900 dark:text-white">
                {selectedCountry.name.common} ({value})
              </span>
            </>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">Select country</span>
          )}
        </div>
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </button>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-60 overflow-hidden">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <LoadingSkeleton type="country" count={5} />
            ) : filteredCountries.length > 0 ? (
              filteredCountries.map(country => (
                <button
                  key={country.cca2}
                  onClick={() => handleSelect(country)}
                  className="w-full p-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                >
                  <img 
                    src={country.flags.png} 
                    alt={country.name.common}
                    className="w-6 h-4 object-cover rounded"
                  />
                  <span className="text-gray-900 dark:text-white">
                    {country.name.common}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-auto">
                    {country.idd.root}{country.idd.suffixes[0]}
                  </span>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};