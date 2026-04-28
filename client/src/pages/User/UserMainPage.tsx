import { useEffect } from "react";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useModal } from "../../hooks/useModal";
import { useRefresh } from "../../hooks/useRefresh";
import { useToastMessage } from "../../hooks/useToastMessage";
import AddUserFormModal from "./components/AddUserFormModal";
import DeleteUserFormModal from "./components/DeleteUserFormModal";
import EditUserFormModel from "./components/EditUserFormModel";
import UserList from "./components/UserList";


const UserMainPage = () => {
  const {
    isOpen: isAddUserFormModalOpen,
    openModal: openAddUserFormModal,
    closeModal: closeAddUserFormModal,
  } = useModal(false);
  const {
    isOpen: isEditUserFormModalOpen,
    selectedUser: selectedUserForEdit,
    openModal: openEditUserFormModal,
    closeModal: closeEditUserFormModal,
  } = useModal(false);
  const {
    isOpen: isDeleteUserFormModalOpen,
    selectedUser: selectedUserForDelete,
    openModal: openDeleteUserFormModal,
    closeModal: closeDeleteUserFormModal,
  } = useModal(false);

  const { refresh, handleRefresh: triggerRefresh } = useRefresh(false);
  const {
    message: toastMessage,
    isFailed: toastMessageIsFailed,
    isVisible: toastMessageIsVisible,
    showToastMessage,
    closeToastMessage,
  } = useToastMessage("", false, false);

  const handleUserAction = (message: string) => {
    showToastMessage(message);
    triggerRefresh();
  };

  useEffect(() => {
    document.title = "User Main Page";
  }, []);

  return (
    <>
      <ToastMessage
        message={toastMessage}
        isFailed={toastMessageIsFailed}
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
        user={selectedUserForEdit}
        onUserUpdated={handleUserAction}
        isOpen={isEditUserFormModalOpen}
        onClose={closeEditUserFormModal}
      />
      <DeleteUserFormModal
        user={selectedUserForDelete}
        onUserDeleted={showToastMessage}
        refreshkey={triggerRefresh}
        isOpen={isDeleteUserFormModalOpen}
        onClose={closeDeleteUserFormModal}
      />

      <UserList
        onAddUser={() => openAddUserFormModal(null)}
        onEditUser={(user) => openEditUserFormModal(user)}
        onDeleteUser={(user) => openDeleteUserFormModal(user)}
        refreshKey={refresh}
      />
    </>
  );
};

export default UserMainPage;