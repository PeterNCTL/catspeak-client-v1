import React from "react"
import { Outlet } from "react-router-dom"
import { CatSpeakSidebar } from "@/features/cat-speak"

const CatSpeakLayout = () => {
  return (
    <div className="min-h-screen w-full py-8">
      <div className="mx-auto flex max-w-screen-xl gap-8 px-4 lg:px-8">
        {/* LEFT COLUMN: SIDEBAR */}
        <CatSpeakSidebar />

        {/* CONTAINER FOR PAGE CONTENT */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default CatSpeakLayout
