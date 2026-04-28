import { useState, type FC, type FormEvent } from "react";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import Modal from "../../../components/Modal";
import UserService from "../../../services/UserService";
import type { UserColumns } from "../../../interfaces/UserInterface";

interface DeleteUserFormModalProps {
  user: UserColumns | null;
  onUserDeleted: (message: string) => void;
  refreshkey: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteUserFormModal: FC<DeleteUserFormModalProps> = ({
  user,
  onUserDeleted,
  refreshkey,
  isOpen,
  onClose,
}) => {
  const [loadingDestroy, setLoadingDestroy] = useState(false);
  const genderValue =
    typeof user?.gender === "object" && user?.gender !== null
      ? user.gender.gender
      : (user?.gender ?? "N/A");

  const handleDeleteUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoadingDestroy(true);
      const res = await UserService.destroyUser(user.user_id);
      if (res.status >= 200 && res.status < 300) {
        onUserDeleted(res.data.message ?? "User Successfully Deleted.");
        refreshkey();
        onClose();
      } else {
        onUserDeleted("Failed to delete user.");
      }
    } catch (error) {
      console.error("Unexpected error occurred during deleting user:", error);
      onUserDeleted("Unexpected error occurred while deleting user.");
    } finally {
      setLoadingDestroy(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
      <form onSubmit={handleDeleteUser}>
        <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-4">
          Delete User Form
        </h1>

        <div className="grid grid-cols-2 gap-4 border-b border-gray-100 mb-4 p-4">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div>
              <p className="font-semibold text-gray-800">First Name</p>
              <p className="text-gray-500">{user?.first_name ?? "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Middle Name</p>
              <p className="text-gray-500">{user?.middle_name || "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Last Name</p>
              <p className="text-gray-500">{user?.last_name ?? "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Suffix Name</p>
              <p className="text-gray-500">{user?.suffix_name || "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Gender</p>
              <p className="text-gray-500">{String(genderValue)}</p>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1 space-y-4">
            <div>
              <p className="font-semibold text-gray-800">Birth Date</p>
              <p className="text-gray-500">{user?.birth_date ?? "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Username</p>
              <p className="text-gray-500">{user?.username ?? "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4">
          <CloseButton label="Close" onClose={onClose} />
          <SubmitButton
            className="bg-red-600 hover:bg-red-700"
            label="Delete User"
            loading={loadingDestroy}
            loadingLabel="Deleting User..."
          />
        </div>
      </form>
    </Modal>
  );
};

export default DeleteUserFormModal;