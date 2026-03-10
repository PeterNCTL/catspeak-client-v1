import React, { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import {
  ArrowLeft,
  ChevronRight,
  Eye,
  MessageCircle,
  ThumbsUp,
  Heart,
  Smile,
} from "lucide-react"
import {
  useGetPostByIdQuery,
  useReactToPostMutation,
} from "@/store/api/postsApi"
import { useLanguage } from "@/shared/context/LanguageContext"
import PostContent from "../components/PostContent"
import placeholderImg from "@/shared/assets/images/news/placeholder.jpg"
import LoadingSpinner from "@/shared/components/ui/LoadingSpinner"

const NewsDetailPage = () => {
  const { id, lang } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()

  const { data, isLoading, error } = useGetPostByIdQuery(id)
  const [reactToPost] = useReactToPostMutation()
  const newsItem = data?.data

  const handleReact = (type) => {
    if (!newsItem?.postId) return
    reactToPost({ postId: newsItem.postId, type })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !newsItem || newsItem.privacy !== "Public") {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <h5 className="mb-4 text-2xl font-bold">{t.news?.error?.notFound}</h5>
        <button
          className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm"
          onClick={() => navigate(`/${lang}/cat-speak/news`)}
        >
          <ArrowLeft className="h-4 w-4" />
          {t.news?.error?.backToNews}
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <Link
          to={`/${lang}/cat-speak/news`}
          className="flex items-center gap-2 h-12 px-3  rounded-xl w-fit text-gray-500 hover:text-gray-900 hover:bg-[#E5E5E5] transition-colors font-medium"
        >
          <ArrowLeft className="h-6 w-6" />
          {t.news?.newsDetail?.back}
        </Link>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-bold m-0">
            {newsItem.title}
          </h1>
          <div className="flex items-center gap-3">
            {newsItem.avatarUrl ? (
              <img
                src={newsItem.avatarUrl}
                alt={newsItem.authorName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                {newsItem.authorName?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900">
                {newsItem.authorName}
              </span>
              <span className="text-xs uppercase text-[#7A7574] font-semibold">
                {new Date(newsItem.createDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Article */}
      <article className="overflow-hidden bg-white">
        {/* Hero */}
        <div className="relative h-[350px] w-full">
          <img
            src={newsItem.media?.[0]?.mediaUrl || placeholderImg}
            alt={newsItem.title}
            className="h-full w-full object-cover rounded-3xl"
          />
        </div>

        {/* Stats & Actions */}
        <div className="flex flex-col items-start gap-2 py-4 border-b border-[#C6C6C6]">
          <div className="text-base">
            {newsItem.totalReactions} {t.news?.newsDetail?.reactions}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleReact("Like")}
              className={`flex items-center gap-2 h-12 px-3 rounded-xl text-base hover:bg-[#E5E5E5] transition-colors ${newsItem.currentUserReaction === "Like" ? "text-blue-600 font-medium" : ""}`}
            >
              <ThumbsUp
                className={`${newsItem.currentUserReaction === "Like" ? "fill-blue-600" : ""}`}
              />
              {t.news?.newsDetail?.like}
            </button>
            <button
              onClick={() => handleReact("Love")}
              className={`flex items-center gap-2 h-12 px-3 rounded-xl text-base hover:bg-[#E5E5E5] transition-colors ${newsItem.currentUserReaction === "Love" ? "text-red-500 font-medium" : ""}`}
            >
              <Heart
                className={`${newsItem.currentUserReaction === "Love" ? "fill-red-500" : ""}`}
              />
              {t.news?.newsDetail?.love}
            </button>
            <button
              onClick={() => handleReact("Haha")}
              className={`flex items-center gap-2 h-12 px-3 rounded-xl text-base hover:bg-[#E5E5E5] transition-colors ${newsItem.currentUserReaction === "Haha" ? "text-yellow-500 font-medium" : ""}`}
            >
              <Smile
                className={`${newsItem.currentUserReaction === "Haha" ? "text-yellow-500" : ""}`}
              />
              {t.news?.newsDetail?.haha}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-6 text-gray-700 leading-relaxed p-4 text-base">
          <PostContent html={newsItem.content} />

          {newsItem.media && newsItem.media.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {newsItem.media.slice(1).map((mediaItem) => (
                <img
                  key={mediaItem.postMediaId}
                  src={mediaItem.mediaUrl}
                  className="rounded-2xl object-cover h-60 w-full"
                />
              ))}
            </div>
          )}
        </div>
      </article>
    </div>
  )
}

export default NewsDetailPage
