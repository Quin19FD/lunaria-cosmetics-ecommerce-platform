"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

import { getWishlistIds } from "@/modules/wishlist/actions";
import { useWishlistStore } from "@/store/use-wishlist-store";

/**
 * Bridges the client wishlist store with the per-user DB wishlist:
 * - on authentication: loads the saved ids once (server is source of truth)
 * - on logout: resets the local ids so they don't leak to the next visitor
 */
export function WishlistSync() {
  const { status } = useSession();
  const setIds = useWishlistStore((s) => s.setIds);

  const synced = useRef(false);
  const prevStatus = useRef(status);

  useEffect(() => {
    if (status === "authenticated" && !synced.current) {
      synced.current = true;
      getWishlistIds().then((ids) => setIds(ids));
    }
    if (
      prevStatus.current === "authenticated" &&
      status === "unauthenticated"
    ) {
      synced.current = false;
      setIds([]);
    }
    prevStatus.current = status;
  }, [status, setIds]);

  return null;
}
