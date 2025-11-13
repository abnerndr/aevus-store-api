import type {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const RefreshTokenSchema: SchemaObject | ReferenceObject = {
  type: 'object',
  properties: {
    refreshToken: { type: 'string' },
  },
  required: ['refreshToken'],
};
