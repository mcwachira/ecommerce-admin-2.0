"use client";

import StoreModal from "@/components/modals/store-modal";
import { useEffect, useState } from "react";
export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  //prevent hydration error when opening and closing the modal
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return false;
  }

  return (
    <>
      <StoreModal />
    </>
  );
};
