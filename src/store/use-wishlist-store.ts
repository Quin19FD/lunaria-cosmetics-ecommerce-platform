import { create } from "zustand";

interface WishlistStore {
  ids: string[];
  setIds: (ids: string[]) => void;
  add: (id: string) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  ids: [],
  setIds: (ids) => set({ ids }),
  add: (id) =>
    set((state) =>
      state.ids.includes(id) ? state : { ids: [...state.ids, id] },
    ),
  remove: (id) =>
    set((state) => ({ ids: state.ids.filter((i) => i !== id) })),
  has: (id) => get().ids.includes(id),
}));
