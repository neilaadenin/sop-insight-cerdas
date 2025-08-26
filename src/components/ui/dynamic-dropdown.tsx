import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface DropdownItem {
  id: number;
  name: string;
  [key: string]: any;
}

interface DynamicDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  items: DropdownItem[];
  loading?: boolean;
  error?: string | null;
  disabled?: boolean;
  className?: string;
  showAllOption?: boolean;
  allOptionLabel?: string;
  allOptionValue?: string;
  itemValueKey?: string;
  itemLabelKey?: string;
}

export function DynamicDropdown({
  value,
  onValueChange,
  placeholder,
  items,
  loading = false,
  error = null,
  disabled = false,
  className = '',
  showAllOption = false,
  allOptionLabel = 'Semua',
  allOptionValue = 'all',
  itemValueKey = 'name',
  itemLabelKey = 'name'
}: DynamicDropdownProps) {
  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-sm text-red-600 ${className}`}>
        Error: {error}
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {showAllOption && (
          <SelectItem value={allOptionValue}>
            {allOptionLabel}
          </SelectItem>
        )}
        {items.map((item) => (
          <SelectItem key={item.id} value={item[itemValueKey]}>
            {item[itemLabelKey]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Specialized dropdown components
interface CategoryDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  error?: string | null;
  disabled?: boolean;
  className?: string;
  showAllOption?: boolean;
}

export function CategoryDropdown({
  value,
  onValueChange,
  placeholder = "Pilih kategori",
  loading = false,
  error = null,
  disabled = false,
  className = '',
  showAllOption = false
}: CategoryDropdownProps) {
  return (
    <DynamicDropdown
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      items={[]} // Will be provided by parent component
      loading={loading}
      error={error}
      disabled={disabled}
      className={className}
      showAllOption={showAllOption}
      allOptionLabel="Semua Kategori"
    />
  );
}

interface DivisionDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  error?: string | null;
  disabled?: boolean;
  className?: string;
  showAllOption?: boolean;
}

export function DivisionDropdown({
  value,
  onValueChange,
  placeholder = "Pilih departemen",
  loading = false,
  error = null,
  disabled = false,
  className = '',
  showAllOption = false
}: DivisionDropdownProps) {
  return (
    <DynamicDropdown
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      items={[]} // Will be provided by parent component
      loading={loading}
      error={error}
      disabled={disabled}
      className={className}
      showAllOption={showAllOption}
      allOptionLabel="Semua Departemen"
    />
  );
}

