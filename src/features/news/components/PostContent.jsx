import DOMPurify from "dompurify"

const PostContent = ({ html, className = "" }) => {
  return (
    <div
      className={`text-gray-800 text-base
        [&_strong]:font-bold [&_b]:font-bold
        [&_em]:italic [&_i]:italic
        [&_u]:underline [&_s]:line-through
        [&_p]:mb-4
        [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:mb-4 [&_ul]:space-y-1
        [&_ol]:list-decimal [&_ol]:ml-5 [&_ol]:mb-4 [&_ol]:space-y-1
        [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4
        [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3
        [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-5 [&_h3]:mb-2
        [&_h4]:text-lg [&_h4]:font-bold [&_h4]:mt-4 [&_h4]:mb-2
        [&_a]:text-blue-600 [&_a]:underline
        [&_img]:inline [&_img]:max-w-full [&_img]:h-auto [&_img]:py-2 [&_img]:rounded-md
        [&_table]:w-full [&_table]:mb-4 [&_td]:align-top [&_td]:p-2 [&_th]:p-2 [&_th]:text-left [&_th]:font-bold
        [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_blockquote]:text-gray-600
        [&_figure]:my-4 [&_figure]:table [&_figure]:text-center [&_figure]:mx-auto [&_figure]:clear-both
        [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:text-gray-500 [&_figcaption]:mt-2
        ${className}`}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(html, {
          ADD_ATTR: [
            "style",
            "width",
            "height",
            "border",
            "cellpadding",
            "cellspacing",
          ],
        }),
      }}
    />
  )
}

export default PostContent
