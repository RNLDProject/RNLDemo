import { useEffect } from "react";
import AddUserFormModal from "./components/AddUserFormModal";
import UserList from "./components/UserList";
import { useModal } from "../../hooks/useModal";

const UserMainPage = () => {
  const { isOpen, openModal, closeModal } = useModal(false);

  useEffect(() => {
    document.title = "User Main Page";
  }, []);

  return (
    <>
      <AddUserFormModal isOpen={isOpen} onClose=
      {closeModal} />
      <UserList onAddUser={openModal} />
    </>
  );
};

export default UserMainPage;
