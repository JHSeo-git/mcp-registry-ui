import * as z from "zod";

/**
 * Input type for key-value based arguments with optional variables
 */
export const inputSchema = z.object({
  choices: z.array(z.string()).nullish(),
  default: z.string().optional(),
  description: z.string().optional(),
  format: z.string().optional(),
  is_required: z.boolean().optional(),
  is_secret: z.boolean().optional(),
  value: z.string().optional(),
});
export type Input = z.infer<typeof inputSchema>;

/**
 * Key-value input with name requirement
 */
export const keyValueInputSchema = z.object({
  choices: z.array(z.string()).nullish(),
  default: z.string().optional(),
  description: z.string().optional(),
  format: z.string().optional(),
  is_required: z.boolean().optional(),
  is_secret: z.boolean().optional(),
  name: z.string(),
  value: z.string().optional(),
  variables: z.record(z.string(), inputSchema).optional(),
});
export type KeyValueInput = z.infer<typeof keyValueInputSchema>;

/**
 * Argument schema with variables support
 */
export const argumentSchema = z.object({
  choices: z.array(z.string()).nullish(),
  default: z.string().optional(),
  description: z.string().optional(),
  format: z.string().optional(),
  is_repeated: z.boolean().optional(),
  is_required: z.boolean().optional(),
  is_secret: z.boolean().optional(),
  name: z.string().optional(),
  type: z.string(),
  value: z.string().optional(),
  value_hint: z.string().optional(),
  variables: z.record(z.string(), inputSchema).optional(),
});
export type Argument = z.infer<typeof argumentSchema>;

/**
 * Transport configuration for server connections
 */
export const transportSchema = z.object({
  headers: z.array(keyValueInputSchema).nullish(),
  type: z.string(),
  url: z.string().optional(),
});
export type Transport = z.infer<typeof transportSchema>;

/**
 * Repository information
 */
export const repositorySchema = z.object({
  id: z.string().optional(),
  source: z.string(),
  subfolder: z.string().optional(),
  url: z.string(),
});
export type Repository = z.infer<typeof repositorySchema>;

/**
 * Registry extensions for metadata
 */
export const registryExtensionsSchema = z.object({
  id: z.string(),
  is_latest: z.boolean(),
  published_at: z.iso.datetime(),
  updated_at: z.iso.datetime().optional(),
});
export type RegistryExtensions = z.infer<typeof registryExtensionsSchema>;

/**
 * Server metadata
 */
export const serverMetaSchema = z.object({
  "io.modelcontextprotocol.registry/official":
    registryExtensionsSchema.optional(),
  "io.modelcontextprotocol.registry/publisher-provided": z
    .record(z.string(), z.any())
    .optional(),
});
export type ServerMeta = z.infer<typeof serverMetaSchema>;

/**
 * Package configuration
 */
export const packageSchema = z.object({
  environment_variables: z.array(keyValueInputSchema).nullish(),
  file_sha256: z.string().optional(),
  identifier: z.string().min(1),
  package_arguments: z.array(argumentSchema).nullish(),
  registry_base_url: z.string().optional(),
  registry_type: z.string().min(1),
  runtime_arguments: z.array(argumentSchema).nullish(),
  runtime_hint: z.string().optional(),
  transport: transportSchema.optional(),
  version: z.string(),
});
export type Package = z.infer<typeof packageSchema>;

/**
 * Server JSON schema - main server configuration
 */
export const serverJsonSchema = z.object({
  $schema: z.string().optional(),
  _meta: serverMetaSchema.optional(),
  description: z.string(),
  name: z.string().min(1).max(200),
  packages: z.array(packageSchema).nullish(),
  remotes: z.array(transportSchema).nullish(),
  repository: repositorySchema.optional(),
  status: z.string().min(1).optional(),
  version: z.string().optional(),
  website_url: z.string().optional(),
});
export type ServerJson = z.infer<typeof serverJsonSchema>;

/**
 * Server list request parameters
 */
export const serverListRequestSchema = z.object({
  cursor: z.string().uuid().optional(),
  limit: z.number().int().min(1).max(100).default(30).optional(),
  updated_since: z.string().optional(),
  search: z.string().optional(),
  version: z.string().optional(),
});
export type ServerListRequest = z.infer<typeof serverListRequestSchema>;

/**
 * Pagination metadata
 */
export const metadataSchema = z.object({
  count: z.number().int(),
  next_cursor: z.string().optional(),
});
export type Metadata = z.infer<typeof metadataSchema>;

/**
 * Server list response
 */
export const serverListResponseSchema = z.object({
  metadata: metadataSchema.optional(),
  servers: z.array(serverJsonSchema).nullable(),
});
export type ServerListResponse = z.infer<typeof serverListResponseSchema>;

/**
 * Server detail request parameters
 */
export const serverDetailRequestSchema = z.object({
  id: z.uuid(),
});
export type ServerDetailRequest = z.infer<typeof serverDetailRequestSchema>;

/**
 * Server publish request parameters
 */
export const serverPublishRequestSchema = z.object({
  authorization: z.string(),
});
export type ServerPublishRequest = z.infer<typeof serverPublishRequestSchema>;

/**
 * Server update request parameters
 */
export const serverUpdateRequestSchema = z.object({
  id: z.string().uuid(),
  authorization: z.string(),
});
export type ServerUpdateRequest = z.infer<typeof serverUpdateRequestSchema>;

/**
 * Error detail for validation errors
 * Where the error occurred, e.g. 'body.items[3].tags' or 'path.thing-id'
 */
export const errorDetailSchema = z.object({
  location: z.string().optional(),
  message: z.string().optional(),
  value: z.any().optional(),
});
export type ErrorDetail = z.infer<typeof errorDetailSchema>;

/**
 * Error model following RFC 7807 Problem Details
 * A human-readable explanation specific to this occurrence of the problem.
 */
export const errorModelSchema = z.object({
  detail: z.string().optional(),
  errors: z.array(errorDetailSchema).nullish(),
  instance: z.url().optional(),
  status: z.number().int().optional(),
  title: z.string().optional(),
  type: z.url().optional(),
});
export type ErrorModel = z.infer<typeof errorModelSchema>;

/**
 * Health check response
 * GitHub OAuth App Client ID
 */
export const healthBodySchema = z.object({
  github_client_id: z.string().optional(),
  status: z.string(),
});
export type HealthBody = z.infer<typeof healthBodySchema>;

/**
 * Ping response
 */
export const pingBodySchema = z.object({
  pong: z.boolean(),
});
export type PingBody = z.infer<typeof pingBodySchema>;

/**
 * Token response for authentication
 */
export const tokenResponseSchema = z.object({
  expires_at: z.number().int(),
  registry_token: z.string(),
});
export type TokenResponse = z.infer<typeof tokenResponseSchema>;

/**
 * GitHub OAuth access token exchange input
 */
export const githubTokenExchangeInputBodySchema = z.object({
  github_token: z.string(),
});
export type GithubTokenExchangeInputBody = z.infer<
  typeof githubTokenExchangeInputBodySchema
>;

/**
 * GitHub Actions OIDC token exchange input
 */
export const githubOidcTokenExchangeInputBodySchema = z.object({
  oidc_token: z.string(),
});
export type GithubOidcTokenExchangeInputBody = z.infer<
  typeof githubOidcTokenExchangeInputBodySchema
>;

/**
 * OIDC ID token from any provider exchange input
 */
export const oidcTokenExchangeInputBodySchema = z.object({
  oidc_token: z.string(),
});
export type OidcTokenExchangeInputBody = z.infer<
  typeof oidcTokenExchangeInputBodySchema
>;

/**
 * DNS token exchange input for domain verification
 * Domain name: example.com
 * RFC3339 timestamp: 2023-01-01T00:00:00Z
 * Hex-encoded Ed25519 signature of timestamp: abcdef1234567890
 */
export const dnsTokenExchangeInputBodySchema = z.object({
  domain: z.string(),
  timestamp: z.string(),
  signed_timestamp: z.string(),
});
export type DnsTokenExchangeInputBody = z.infer<
  typeof dnsTokenExchangeInputBodySchema
>;

/**
 * HTTP token exchange input for HTTP-hosted verification
 * Domain name: example.com
 * RFC3339 timestamp: 2023-01-01T00:00:00Z
 * Hex-encoded Ed25519 signature of timestamp: abcdef1234567890
 */
export const httpTokenExchangeInputBodySchema = z.object({
  domain: z.string(),
  timestamp: z.string(),
  signed_timestamp: z.string(),
});
export type HttpTokenExchangeInputBody = z.infer<
  typeof httpTokenExchangeInputBodySchema
>;
