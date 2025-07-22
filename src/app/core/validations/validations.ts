import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

export const TextValidation = [
  Validators.minLength(2),
  Validators.maxLength(50),
  Validators.required,
];
export const ShortTextValidation = [
  Validators.minLength(2),
  Validators.maxLength(25),
  Validators.required,
];
export const OneCharValidation = [
  Validators.minLength(1),
  Validators.maxLength(1),
];
export const EmailValidation = [Validators.required, Validators.email];
export const PasswordValidation = [
  Validators.minLength(8),
  Validators.maxLength(25),
];
export const ZipCodeValidation = [
  Validators.required,
  Validators.pattern(/^\d{5}$/),
];
export const NumberValidation = [Validators.required, Validators.min(1)];

export function MatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const confirmPassword = control.value;
    const password = control?.parent?.get('password')?.value;
    if (!password) return null;
    return confirmPassword === password ? null : { mismatch: true };
  };
}

export function MinimumAgeValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const birthDate = new Date(control.value);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    return age >= minAge ? null : { ageTooLow: { requiredAge: minAge } };
  };
}

export function EmailDomainsValidator(allowedDomains: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;
    if (email) {
      const domain = email.substring(email.lastIndexOf('@') + 1);
      const isDomainAllowed = allowedDomains.includes(domain);
      return isDomainAllowed
        ? null
        : {
            emailDomain: { allowedDomains, actualDomain: domain },
          };
    }

    return null;
  };
}
