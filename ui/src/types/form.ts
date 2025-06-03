export type FormFieldType = 'text' | 'number' | 'select' | 'textarea' | 'date';

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormField {
  key: string;
  name: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  options?: FormFieldOption[];
  showIf?: (data: Record<string, any>) => boolean;
  step?: string;
  min?: number;
  max?: number;
}
