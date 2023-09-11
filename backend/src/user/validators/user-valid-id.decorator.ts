import {registerDecorator, ValidationArguments, ValidationOptions,} from 'class-validator';

export function IsValidUserId(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'IsValidUserId',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: `${propertyName} cannot be NaN or lower than 2`,
      },
      validator: {
        validate(value: any, _args: ValidationArguments) {
          return !isNaN(value) && value > 1;
        },
      },
    });
  };
}
