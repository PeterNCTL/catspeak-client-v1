import React, { useEffect, useState } from "react"
import { useAuth } from "@/features/auth"
import { Plus, Check, X } from "lucide-react"
import { useLanguage } from "@/shared/context/LanguageContext"
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/features/user/api/userApi"

const PersonalInformationPage = () => {
  const { user } = useAuth()
  const { t } = useLanguage()
  const { data: profileData, isLoading } = useGetUserProfileQuery()
  console.log(profileData)

  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation()

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    accountType: "Student",
    level: "HSK3",
    address: "",
    avatarImageUrl: "",
  })

  const [editingField, setEditingField] = useState(null)

  useEffect(() => {
    if (profileData?.data) {
      setFormData({
        username: profileData.data.username || "",
        email: profileData.data.email || "",
        accountType: profileData.data.roleName || "Student",
        level: profileData.data.level || "HSK3",
        address: profileData.data.address || "",
        avatarImageUrl: profileData.data.avatarImageUrl || "",
      })
    }
  }, [profileData])

  const handleEdit = (field) => {
    setEditingField(field)
  }

  const handleCancel = () => {
    setEditingField(null)
    if (profileData?.data) {
      setFormData((prev) => ({
        ...prev,
        username: profileData.data.username || "",
        address: profileData.data.address || "",
      }))
    }
  }

  const handleSave = async () => {
    try {
      await updateProfile({
        username: formData.username,
        avatarImageUrl: formData.avatarImageUrl,
        address: formData.address,
        dateOfBirth: profileData?.data?.dateOfBirth, // Preserve existing
        level: formData.level,
        preferredLanguage: profileData?.data?.preferredLanguage, // Preserve existing
        country: profileData?.data?.country, // Preserve existing
      }).unwrap()
      setEditingField(null)
    } catch (error) {
      console.error("Failed to update profile", error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  if (isLoading) return <div>Loading...</div>

  const renderField = (field, label, value, key) => {
    const isEditing = editingField === key
    return (
      <div className="flex items-center justify-between border-b border-gray-100 py-3">
        <span className="w-32 font-bold text-gray-900">{label}</span>
        {isEditing ? (
          <input
            type="text"
            name={key}
            value={value}
            onChange={handleChange}
            className="flex-1 rounded border border-gray-300 px-2 py-1 mr-4 focus:border-red-900 focus:outline-none"
          />
        ) : (
          <span className="flex-1 text-gray-600">{value}</span>
        )}
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="font-bold text-green-600 hover:text-green-700"
              >
                <Check size={18} />
              </button>
              <button
                onClick={handleCancel}
                disabled={isUpdating}
                className="font-bold text-red-600 hover:text-red-700"
              >
                <X size={18} />
              </button>
            </>
          ) : (
            <button
              onClick={() => handleEdit(key)}
              className="font-bold text-red-800 hover:text-red-900"
            >
              {t.profile?.personalInfo?.edit}
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-bold text-red-900">
        {t.profile?.personalInfo?.title}
      </h1>

      {/* Cover & Avatar Section */}
      <div className="relative mb-10">
        {/* Cover Image */}
        <div className="h-48 w-full overflow-hidden rounded-xl bg-gray-200">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" // Placeholder for tropical/travel cover
            alt="Cover"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Avatar Section */}
        <div className="absolute -bottom-12 left-8 flex items-end gap-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-bold text-gray-900">
              {t.profile?.personalInfo?.avatar}
            </span>
            <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
              {formData.avatarImageUrl ? (
                <img
                  src={formData.avatarImageUrl}
                  className="w-full h-full object-cover"
                />
              ) : (
                "Q"
              )}
            </div>
          </div>

          {/* Avatar Selection List (Mock) */}
          <div className="mb-2 flex flex-wrap gap-2">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-10 rounded-full bg-gray-200 border-2 border-white overflow-hidden cursor-pointer hover:scale-110 transition-transform"
              >
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                  alt="avatar option"
                />
              </div>
            ))}
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50">
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="flex flex-col gap-6 pt-4">
        {renderField(
          "username",
          t.profile?.personalInfo?.username,
          formData.username,
          "username",
        )}

        {/* Email (Read only) */}
        <div className="flex items-center justify-between border-b border-gray-100 py-3">
          <span className="w-32 font-bold text-gray-900">
            {t.profile?.personalInfo?.email}
          </span>
          <span className="flex-1 text-gray-600">{formData.email}</span>
          <button className="font-bold text-gray-400 cursor-not-allowed">
            {t.profile?.personalInfo?.edit}
          </button>
        </div>

        {/* Account Type */}
        <div className="flex items-center justify-between border-b border-gray-100 py-3">
          <span className="w-32 font-bold text-gray-900">
            {t.profile?.personalInfo?.accountType}
          </span>
          <span className="flex-1 text-gray-600">{formData.accountType}</span>
        </div>

        {/* Level */}
        <div className="flex items-center justify-between border-b border-gray-100 py-3">
          <span className="w-32 font-bold text-gray-900">
            {t.profile?.personalInfo?.level}
          </span>
          <div className="flex-1"></div>
          <div className="relative">
            <button className="flex items-center gap-2 rounded border border-gray-200 px-3 py-1 text-sm font-bold text-red-900 hover:bg-gray-50">
              {formData.level}
              <span className="text-gray-400">▼</span>
            </button>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-red-900 mt-4">
        {t.profile?.personalInfo?.accountAndPrivacy}
      </h2>

      <div className="flex flex-col gap-6">
        {/* Password */}
        <div className="flex items-center justify-between border-b border-gray-100 py-3">
          <span className="w-32 font-bold text-gray-900">
            {t.profile?.personalInfo?.password}
          </span>
          <span className="flex-1 text-gray-600 tracking-widest text-lg">
            ***********
          </span>
          <button className="font-bold text-red-800 hover:text-red-900">
            {t.profile?.personalInfo?.reset}
          </button>
        </div>

        {renderField(
          "address",
          t.profile?.personalInfo?.address,
          formData.address,
          "address",
        )}
      </div>
    </div>
  )
}

export default PersonalInformationPage
