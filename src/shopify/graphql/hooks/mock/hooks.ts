/* eslint-disable @typescript-eslint/no-unused-vars */
import { DocumentNode, OperationVariables, QueryHookOptions, TypedDocumentNode } from '@apollo/client'

const MOCK_DATA = {
  data: {},
  error: undefined,
  loading: false,
}

export function useMockQuery<TData = any, TVariables extends OperationVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<TData, TVariables>,
): { data: any; error?: Error; loading: boolean } {
  return MOCK_DATA
}
