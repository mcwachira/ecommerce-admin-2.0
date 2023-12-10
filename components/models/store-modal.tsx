import React from "react";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";

const StoreModal = () => {
  const storeModal = useStoreModal();
  return (
    <Modal
      title="create store"
      description="Add as new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      Future Create Store form
    </Modal>
  );
};

export default StoreModal;
