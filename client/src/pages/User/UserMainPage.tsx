import { useEffect } from "react";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useModal } from "../../hooks/useModal";
import { useRefresh } from "../../hooks/useRefresh";
import { useToastMessage } from "../../hooks/useToastMessage";
import UserService from "../../services/UserService";
import AddUserFormModal from "./components/AddUserFormModal";
import EditUserFormModel from "./components/EditUserFormModel";
import UserList from "./components/UserList";
import type { UserColumns } from "../../interfaces/UserColumns";

const UserMainPage = () => {
  const {
    isOpen: isAddUserFormModalOpen,
    openModal: openAddUserFormModal,
    closeModal: closeAddUserFormModal,
  } = useModal(false);
  const {
    isOpen: isEditUserFormModalOpen,
    selectedUser,
    openModal: openEditUserFormModal,
    closeModal: closeEditUserFormModal,
  } = useModal(false);
  const { refresh, handleRefresh: triggerRefresh } = useRefresh(false);
  const {
    message: toastMessage,
    isVisible: toastMessageIsVisible,
    showToastMessage,
    closeToastMessage,
  } = useToastMessage("", false);

  const handleUserAction = (message: string) => {
    showToastMessage(message);
    triggerRefresh();
  };

  const handleDeleteUser = async (user: UserColumns) => {
    const shouldDelete = window.confirm(
      `Delete user "${user.username}"? This action cannot be undone.`
    );
    if (!shouldDelete) return;

    try {
      const res = await UserService.destroyUser(user.user_id);
      if (res.status >= 200 && res.status < 300) {
        handleUserAction(res.data.message ?? "User Successfully Deleted.");
      } else {
        showToastMessage("Failed to delete user.");
      }
    } catch (error) {
      console.error("Unexpected error occurred during deleting user:", error);
      showToastMessage("Unexpected error occurred while deleting user.");
    }
  };

  useEffect(() => {
    document.title = "User Main Page";
  }, []);

  return (
    <>
      <ToastMessage
        message={toastMessage}
        isVisible={toastMessageIsVisible}
        onClose={closeToastMessage}
      />
      <AddUserFormModal
        isOpen={isAddUserFormModalOpen}
        onClose={closeAddUserFormModal}
        onUserAdded={handleUserAction}
        refreshkey={triggerRefresh}
      />
      <EditUserFormModel
        user={selectedUser}
        onUserUpdated={handleUserAction}
        isOpen={isEditUserFormModalOpen}
        onClose={closeEditUserFormModal}
      />
      <UserList
        onAddUser={() => openAddUserFormModal(null)}
        onEditUser={(user: UserColumns | null) => openEditUserFormModal(user)}
        onDeleteUser={handleDeleteUser}
        refreshKey={refresh}
      />
    </>
  );
};

export default UserMainPage;