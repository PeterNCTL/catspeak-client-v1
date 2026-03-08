import React, { useState } from "react"
import { useLanguage } from "@/shared/context/LanguageContext"
import { useGetPostsQuery } from "@/store/api/postsApi"
import NewsCard from "../components/NewsCard"
import LoadingSpinner from "@/shared/components/ui/LoadingSpinner"
import ErrorMessage from "@/shared/components/ui/ErrorMessage"
import EmptyState from "@/shared/components/ui/EmptyState"

const NewsPage = () => {
  const { t } = useLanguage()
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data, isLoading, error } = useGetPostsQuery({ page, pageSize })

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    if (error?.status === 404) {
      return <EmptyState message="No posts found" />
    }

    return <ErrorMessage message="Error loading posts" />
  }

  const posts = data?.data || []

  return (
    <div className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6">
      {posts.map((post) => (
        <NewsCard key={post.postId} news={post} />
      ))}
      <p className="text-gray-600 mt-2">{t.news?.description}</p>
    </div>
  )
}

export default NewsPage
