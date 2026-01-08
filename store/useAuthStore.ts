import axiosInstanse from "@/lib/axios";
import { AxiosError } from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthStore {
  user: string | null;
  authHeader: string | null;
  isAuthenticate: boolean;
  login: (username: string, pass: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      authHeader: null,
      isAuthenticate: false,
      login: async (username, password) => {
        const credentials = btoa(`${username}:${password}`);
        const headerValue = `Basic ${credentials}`;

        try {
          await axiosInstanse.post(
            "/bri-location/nearest-channel",
            {
              limit: 1,
              longitude: "106.8",
              latitude: "-6.2",
              uker_type: 1,
            },
            {
              headers: { Authorization: headerValue },
            }
          );

          set({
            user: username,
            authHeader: headerValue,
            isAuthenticate: true,
          });
        } catch (err) {
          const error = err as AxiosError<{ message: string }>;
          console.log("Login gagal ", err);
          throw new Error(error.response?.data?.message || "Login failed");
        }
      },
      logout: () => {
        set({
          user: null,
          authHeader: null,
          isAuthenticate: false,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
