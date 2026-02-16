import React from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Typography, Breadcrumbs, Button } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { newsData } from "../data/newsData"
import { useLanguage } from "@/shared/context/LanguageContext"

const NewsDetailPage = () => {
  const { id, lang } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()

  // Find the news item
  const newsItem = newsData.find((item) => item.id === parseInt(id))

  if (!newsItem) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <Typography variant="h5" className="mb-4">
          News not found
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/${lang}/cat-speak/news`)}
        >
          Back to News
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Breadcrumbs / Back Navigation */}
      <div className="mb-6">
        <Breadcrumbs aria-label="breadcrumb" className="text-sm">
          <Link
            to={`/${lang}/cat-speak/news`}
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            News
          </Link>
          <Typography
            color="text.primary"
            className="font-medium line-clamp-1 max-w-[200px] sm:max-w-none"
          >
            {newsItem.title}
          </Typography>
        </Breadcrumbs>
      </div>

      {/* Main Content */}
      <article className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
        {/* Hero Image */}
        <div className="relative h-[300px] w-full md:h-[400px]">
          <img
            src={newsItem.image}
            alt={newsItem.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

          <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white">
            <Typography
              variant="overline"
              className="mb-2 block text-gray-200 tracking-wider"
            >
              {newsItem.date}
            </Typography>
            <Typography
              variant="h3"
              className="font-bold leading-tight md:text-4xl lg:text-5xl"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
            >
              {newsItem.title}
            </Typography>
          </div>
        </div>

        {/* Article Body */}
        <div className="p-6 md:p-10">
          <Typography
            variant="body1"
            className="text-lg leading-relaxed text-gray-700 whitespace-pre-line"
          >
            {newsItem.description}
          </Typography>

          {/* Placeholder for more content since current data only has short description */}
          <div className="mt-8 space-y-4">
            <Typography paragraph className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Typography>
            <Typography paragraph className="text-gray-600">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </Typography>
          </div>
        </div>
      </article>
    </div>
  )
}

export default NewsDetailPage
