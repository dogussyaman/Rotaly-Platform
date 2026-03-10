'use client';

import { useSearchStore } from '@/lib/store/search-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useLocale } from '@/lib/i18n/locale-context';

const PROPERTY_TYPES = [
  'Apartment',
  'Villa',
  'Cabin',
  'Bungalow',
  'Cottage',
  'Hotel',
  'Boat',
  'Castle',
] as const;

const AMENITIES = [
  'WiFi',
  'Air Conditioning',
  'Pool',
  'Gym',
  'Kitchen',
  'Parking',
  'Washer/Dryer',
  'TV',
  'Hot Tub',
  'Garden',
] as const;

export function FilterSidebar() {
  const {
    filters,
    setPriceRange,
    setPropertyType,
    setAmenities,
  } = useSearchStore();
  const { t } = useLocale();

  const [expandedSections, setExpandedSections] = useState({
    price: true,
    propertyType: true,
    amenities: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePropertyTypeChange = (type: string) => {
    const newTypes = filters.propertyType.includes(type)
      ? filters.propertyType.filter((t) => t !== type)
      : [...filters.propertyType, type];
    setPropertyType(newTypes);
  };

  const handleAmenityChange = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    setAmenities(newAmenities);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Price Range */}
      <div className="border border-border rounded-xl p-4 space-y-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full font-semibold text-foreground hover:text-primary transition"
        >
          <span>{t.filterPriceRange as string}</span>
          <motion.div
            animate={{ rotate: expandedSections.price ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </button>

        {expandedSections.price && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                {t.filterMinPrice as string}
              </Label>
              <Input
                type="number"
                value={filters.priceMin}
                onChange={(e) =>
                  setPriceRange(Number(e.target.value), filters.priceMax)
                }
                placeholder="0"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                {t.filterMaxPrice as string}
              </Label>
              <Input
                type="number"
                value={filters.priceMax}
                onChange={(e) =>
                  setPriceRange(filters.priceMin, Number(e.target.value))
                }
                placeholder="10000"
                className="bg-background border-border"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              ${filters.priceMin} - ${filters.priceMax}{' '}
              {t.filterPerNightSuffix as string}
            </div>
          </motion.div>
        )}
      </div>

      {/* Property Type */}
      <div className="border border-border rounded-xl p-4 space-y-4">
        <button
          onClick={() => toggleSection('propertyType')}
          className="flex items-center justify-between w-full font-semibold text-foreground hover:text-primary transition"
        >
          <span>{t.filterPropertyType as string}</span>
          <motion.div
            animate={{ rotate: expandedSections.propertyType ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </button>

        {expandedSections.propertyType && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {PROPERTY_TYPES.map((type) => (
              <motion.div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={filters.propertyType.includes(type)}
                  onCheckedChange={() => handlePropertyTypeChange(type)}
                  className="border-border"
                />
                <Label
                  htmlFor={`type-${type}`}
                  className="text-sm font-normal cursor-pointer text-foreground hover:text-primary transition"
                >
                  {t[`filterType${type}` as keyof typeof t] as string || type}
                </Label>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Amenities */}
      <div className="border border-border rounded-xl p-4 space-y-4">
        <button
          onClick={() => toggleSection('amenities')}
          className="flex items-center justify-between w-full font-semibold text-foreground hover:text-primary transition"
        >
          <span>{t.filterAmenities as string}</span>
          <motion.div
            animate={{ rotate: expandedSections.amenities ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </button>

        {expandedSections.amenities && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {AMENITIES.map((amenity) => (
              <motion.div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={filters.amenities.includes(amenity)}
                  onCheckedChange={() => handleAmenityChange(amenity)}
                  className="border-border"
                />
                <Label
                  htmlFor={`amenity-${amenity}`}
                  className="text-sm font-normal cursor-pointer text-foreground hover:text-primary transition"
                >
                  {t[`amenity${amenity.replace('/', '')}` as keyof typeof t] as string ||
                    amenity}
                </Label>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full border-border"
        onClick={() => {
          setPriceRange(0, 10000);
          setPropertyType([]);
          setAmenities([]);
        }}
      >
        {t.filterClearAll as string}
      </Button>
    </motion.div>
  );
}
