export const OASDataTypes: string[] = [
    'string',
    'number',
    'integer',
    'boolean',
    'array',
    'object',
  ];
  
export const OASFormats: Record<string, string[]> = {
    number: [
      '-',
      'float',
      'double',
    ],
    integer: [
      '-',
      'int32',
      'int64',
    ],
    string: [
      '-',
      'date',
      'date-time',
      'password',
      'byte',
      'binary',
      'email',
      'uuid',
    ]
  }