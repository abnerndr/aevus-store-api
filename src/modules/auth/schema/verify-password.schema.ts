import type {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const VerifyEmailSchema: SchemaObject | ReferenceObject = {
  type: 'object',
  properties: {
    token: { type: 'string' },
  },
  required: ['token'],
};
