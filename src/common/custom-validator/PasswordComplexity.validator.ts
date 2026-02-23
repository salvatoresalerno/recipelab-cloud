import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function PasswordComplexity(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'PasswordComplexity',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }
          //const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[.!#$%-=])(?=\S+$).{8,}$/;
          const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[.!#$%\-\=\[\]\(\)])(?=\S+$).{8,}$/;
;
          return passwordRegex.test(value);
        },
      },
    });
  };
}
