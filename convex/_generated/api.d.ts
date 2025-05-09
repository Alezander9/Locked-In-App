/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as actions from "../actions.js";
import type * as http from "../http.js";
import type * as httpActions from "../httpActions.js";
import type * as llm from "../llm.js";
import type * as llmPrompts from "../llmPrompts.js";
import type * as mutations from "../mutations.js";
import type * as queries from "../queries.js";
import type * as types from "../types.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  actions: typeof actions;
  http: typeof http;
  httpActions: typeof httpActions;
  llm: typeof llm;
  llmPrompts: typeof llmPrompts;
  mutations: typeof mutations;
  queries: typeof queries;
  types: typeof types;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
