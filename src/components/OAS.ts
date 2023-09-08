import { OpenAPIV3 } from "openapi-types";
import Ajv from "ajv"
import type { JSONSchemaType } from "ajv"

const ajv = new Ajv();


const infoSchema: JSONSchemaType<OpenAPIV3.InfoObject> = {
  type: "object",
  properties: {
    title: {type: "string"},
    version: {type: "string"},
    description: {type: "string", nullable: true},
    termsOfService: {type: "string", nullable: true},
    contact: {type: "object", required: [], nullable: true},
    license: {type: "object", required: [], nullable: true},
  },
  required: ["title", "version"],
  additionalProperties: false
}

const tagSchema: JSONSchemaType<OpenAPIV3.TagObject> = {
  type: "object",
  properties: {
    name: {type: "string"},
    description: {type: "string", nullable: true},
    externalDocs: {
      type: "object",
      properties: {
        description: {type: "string", nullable: true},
        url: {type: "string"},
      },
      required: ["url"], 
      nullable: true
    },
  },
  required: ["name"],
  additionalProperties: false
}


// validate is a type guard for MyData - type is inferred from schema type
export const validateAPIInfo = ajv.compile(infoSchema);
export const validateAPITag = ajv.compile(tagSchema);


export const OASDataTypes: string[] = [
    'string',
    'number',
    'integer',
    'boolean',
    'array',
    'object',
];


export const OASArrayDataTypes: string[] = [
  ...OASDataTypes,
  'mixed',
  'arbitrary'
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
  };

  export type IVersionBranches = Record<string, OpenAPIV3.Document>;

  OpenAPIV3