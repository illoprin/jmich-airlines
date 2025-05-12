import { ref } from 'vue';

const DEFAULT_ERROR_MESSAGE = 'Invalid field';

function getError(message: string | undefined) {
  return message ? message : DEFAULT_ERROR_MESSAGE;
}

interface ValidationRule<T> {
  required: boolean;
  // Skips all validations after processing
  callback?: (value: T) => boolean;
  minLength?: number;
  maxLength?: number;
  match?: RegExp;
  message?: string;
}

type ValidationSchema<T> = {
  [F in keyof T]: ValidationRule<T[F]>;
};

function validateField<T>(value: T, rule: ValidationRule<T>) {
  // Check callback
  if (rule.callback) {
    if (!rule.callback(value)) {
      return getError(rule.message);
    }
  }

  if (typeof value !== 'string') {
    return null;
  }

  // Check minlength
  if (rule.minLength) {
    if ((value as string).length < rule.minLength) {
      console.log("min-length test failed")
      return getError(rule.message);
    }
  }

  // Check maxlength
  if (rule.maxLength) {
    if ((value as string).length > rule.maxLength) {
      console.log("max-length test failed")
      return getError(rule.message);
    }
  }

  // Check regexp
  if (rule.match) {
    if (!rule.match.test(value)) {
      console.log("regex test failed");
      return getError(rule.message);
    }
  }

  return null;
}

function useValidation<T extends Record<string, any>>(
  schema: ValidationSchema<T>,
) {
  const errors = ref<Record<keyof T, string | null>>({} as any);

  const validate = (formData: T) => {
    let isValid = true;
    for (const key in schema) {
      const rule = schema[key];
      let error: string | null = null;

      // Check required
      if (rule.required) {
        const value = formData[key];

        if (formData[key] === null || formData[key] === undefined || formData[key] === "") {
          error = getError(rule.message);
        } else {
          error = validateField(value, rule);
        }
        
        if (error) {
          isValid = false;
        }
      }
      errors.value[key] = error;
    }

    return isValid;
  };

  return { errors, validate }
}


export { type ValidationSchema, type ValidationRule, useValidation };
