import { ReindexButton } from '@payloadcms/plugin-search/client'
import type { RelationshipField, ServerProps } from 'payload'
import React from 'react'

const SEARCH_COLLECTION_SLUG = 'search'

export const GlobalReindexButton: React.FC<ServerProps> = (props) => {
  const { i18n, payload } = props

  const searchCollection = payload.config.collections.find(
    (collection) => collection.slug === SEARCH_COLLECTION_SLUG,
  )

  if (!searchCollection) {
    return null
  }

  const docField = searchCollection.fields.find(
    (field) => 'name' in field && field.name === 'doc',
  ) as RelationshipField | undefined

  const relationTo = docField?.relationTo
  const searchCollections = Array.isArray(relationTo)
    ? relationTo
    : relationTo
      ? [relationTo]
      : []

  if (searchCollections.length === 0) {
    return null
  }

  const collectionLabels = Object.fromEntries(
    searchCollections.map((slug) => {
      const collection = payload.config.collections.find((item) => item.slug === slug)
      return [slug, collection?.labels]
    }),
  )

  return (
    <ReindexButton
      {...props}
      collectionLabels={collectionLabels}
      i18n={i18n}
      searchCollections={searchCollections}
      searchSlug={SEARCH_COLLECTION_SLUG}
    />
  )
}
