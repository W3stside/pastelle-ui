import { DocumentNode, OperationVariables, QueryHookOptions, TypedDocumentNode } from '@apollo/client'

const MOCK_DATA = {
  data: {},
  error: undefined,
  loading: false,
}

export function useMockQuery<TData = unknown, TVariables extends OperationVariables = OperationVariables>(
  _query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  _options?: QueryHookOptions<TData, TVariables>,
): { data: unknown; error?: Error; loading: boolean } {
  return MOCK_DATA
}
