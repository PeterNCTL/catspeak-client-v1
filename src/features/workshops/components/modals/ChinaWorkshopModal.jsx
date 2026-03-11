import LogoDefault from "@/shared/assets/images/LogoDefault.png"
import Modal from "@/shared/components/ui/Modal"
import PillButton from "@/shared/components/ui/PillButton"

const ChinaWorkshopModal = ({ open, onClose, t }) => {
  const workshop = t.workshops.chinaWorkshop

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={workshop.title}
      className="max-w-xl sm:max-w-2xl md:max-w-3xl"
    >
      <div className="flex flex-col gap-6 py-2 max-h-[75vh] overflow-y-auto px-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#990011] [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar]:w-1.5">
        {/* Cover Image */}
        <div className="relative h-48 flex-shrink-0 overflow-hidden rounded-xl sm:h-64">
          <img
            src={LogoDefault}
            alt="Cat Speak Logo"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="space-y-6 px-2 text-[15px] sm:text-base leading-relaxed text-gray-800">
          {/* Expert Sharing Label */}
          {workshop.expertSharing && (
            <p className="font-bold text-center sm:text-left">
              {workshop.expertSharing}
            </p>
          )}

          {/* Intro Section */}
          <div className="space-y-4">
            <p>
              10 năm không chỉ là thời gian mà còn là những trải nghiệm, góc
              nhìn và bài học mà ít ai có cơ hội nghe trực tiếp. Bạn có tò mò về{" "}
              <span className="text-[#b91c1c] font-bold">
                cuộc sống, môi trường làm việc và cơ hội tại Trung Quốc
              </span>{" "}
              không?
            </p>
            <ul className="list-inside list-disc space-y-1 pl-4">
              {workshop.bulletPoints.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>

          {/* Workshop Title */}
          <div className="py-2">
            <div className="m-0">
              Tất cả sẽ được chia sẻ trong workshop:{" "}
              <span className="text-[#b91c1c] font-bold">
                {workshop.workshopTitle}
              </span>
            </div>
          </div>

          <p>
            Một buổi trò chuyện thẳng thắn về{" "}
            <span className="text-[#b91c1c] font-bold">
              cuộc sống, công việc và những bài học thực tế sau hơn 10 năm sống
              và làm việc tại Trung Quốc đến từ khách mời đặc biệt của Cat Speak
            </span>
            .
          </p>

          {/* Info Section */}
          <div className="space-y-3 font-medium">
            <div className="flex items-start gap-2">
              <span className="text-lg">⏰</span>
              <p>
                <span className="font-bold text-[#b91c1c]">Thời gian:</span>{" "}
                {workshop.time}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">📍</span>
              <p>
                <span className="font-bold text-[#b91c1c]">Địa điểm:</span>{" "}
                {workshop.location}
              </p>
            </div>
          </div>

          {/* Registration Links */}
          <div className="space-y-2 border-t border-gray-100 pt-4">
            <p className="font-bold italic text-[#b91c1c]">
              {workshop.joinLinkNote}
            </p>
            <p className="font-bold">
              <span className="text-[#b91c1c]">Link đăng ký:</span>{" "}
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSflanRsWpM4EbY8ICXXHZ5Qms0X1lF2g4MR4ox_eY-W9eUHig/viewform?usp=header"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                {workshop.registerLinkText}
              </a>
            </p>
          </div>

          <div className="my-4 h-[1px] w-full bg-gray-200" />

          {/* Social Section */}
          <div className="space-y-4">
            <p>{workshop.followPrompt}</p>

            <div className="space-y-2">
              <p className="font-bold text-[#b91c1c]">
                <span className="mr-2 text-gray-800">👉</span>
                {workshop.zaloGroupName}
              </p>
              <a
                href={workshop.zaloLink}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all pl-7 text-blue-600 underline hover:text-blue-800"
              >
                {workshop.zaloLink}
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1">📩</span>
              <span className="font-bold text-[#b91c1c]">
                {workshop.inboxPrompt}
              </span>
              <a
                href={`mailto:${workshop.email}`}
                className="text-gray-900 underline transition-colors hover:text-blue-600"
              >
                {workshop.email}
              </a>
            </div>
          </div>

          <p className="text-gray-700 italic">{workshop.closing}</p>

          {/* Hashtags */}
          <p className="text-sm font-medium leading-loose text-blue-600 sm:text-[15px]">
            {workshop.hashtags}
          </p>

          <PillButton
            onClick={onClose}
            bgColor="#f5c518"
            textColor="#990011"
            className="mt-4 w-full font-bold shadow-md"
          >
            Đóng
          </PillButton>
        </div>
      </div>
    </Modal>
  )
}

export default ChinaWorkshopModal
