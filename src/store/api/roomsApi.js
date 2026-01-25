import { baseApi } from "./baseApi"

// Rooms API slice
export const roomsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all rooms created by the current user
    // Get all rooms created by the current user
    getRooms: builder.query({
      query: ({
        page = 1,
        pageSize = 10,
        roomType,
        languageType,
        requiredLevel,
      } = {}) => {
        const params = new URLSearchParams({
          page,
          pageSize,
        })
        if (roomType) params.append("roomType", roomType)
        if (languageType) params.append("languageType", languageType)
        if (requiredLevel) {
          if (Array.isArray(requiredLevel)) {
            // Join array with comma and space to match backend format
            params.append("requiredLevel", requiredLevel.join(", "))
          } else {
            params.append("requiredLevel", requiredLevel)
          }
        }

        return `/rooms?${params.toString()}`
      },
      providesTags: ["Rooms"],
    }),

    // Get a single room by ID
    getRoomById: builder.query({
      query: (id) => `/rooms/${id}`,
      providesTags: (result, error, id) => [{ type: "Rooms", id }],
    }),

    // Create a new room
    createRoom: builder.mutation({
      query: (roomData) => ({
        url: "/rooms",
        method: "POST",
        body: roomData,
      }),
      invalidatesTags: ["Rooms"],
    }),

    // Delete a room
    deleteRoom: builder.mutation({
      query: (id) => ({
        url: `/rooms/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Rooms"],
    }),
  }),
})

// Export hooks for usage in components
export const {
  useGetRoomsQuery,
  useGetRoomByIdQuery,
  useCreateRoomMutation,
  useDeleteRoomMutation,
} = roomsApi
