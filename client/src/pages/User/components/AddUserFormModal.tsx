import { useEffect, useState, type FC, type FormEvent } from "react";
import FloatingLabelInput from "../../../components/input/FloatingLabelInput";
import Modal from "../../../components/Modal";
import FloatingLabelSelect from "../../../components/input/Select/FloatingLabelSelect";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import type { GenderColumns } from "../../../interfaces/GenderInterface";
import GenderService from "../../../services/GenderService"; 
import UserService from "../../../services/UserService"; 
import type { UserFieldErrors } from "../../../interfaces/UserInterface";
import UploadInput from "../../../components/input/UploadInput";

interface AddUserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: (message: string) => void;
  refreshkey: () => void;
}

const AddUserFormModal: FC<AddUserFormModalProps> = ({
  isOpen,
  onClose,
  onUserAdded,
  refreshkey,
}) => {
  const [loadingGenders, setLoadingGenders] = useState(false);
  const [genders, setGenders] = useState<GenderColumns[]>([]);
  const [loadingStore, setLoadingStore] = useState(false);
  
  
  const [addUserProfilePicture, setAddUserProfilePicture] = useState<File | null>(null);
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [suffixName, setSuffixName] = useState('');
  const [genderId, setGenderId] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<UserFieldErrors>({});

  // Function to reset all states
  const resetForm = () => {
    setAddUserProfilePicture(null);
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setSuffixName("");
    setGenderId("");
    setBirthDate("");
    setUsername("");
    setPassword("");
    setPasswordConfirmation("");
    setErrors({});
  };

  const handleLoadGenders = async () => {
    try {
      setLoadingGenders(true);
      const res = await GenderService.loadGenders();
      if (res.status === 200) {
        setGenders(res.data.genders);
      }
    } catch (error) {
      console.error("Error loading genders: ", error);
    } finally {
      setLoadingGenders(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleLoadGenders();
    } else {
      resetForm(); 
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingStore(true);
    setErrors({});

    const formData = new FormData();
    if (addUserProfilePicture) {
      formData.append("add_user_profile_picture", addUserProfilePicture);
    }
    formData.append("first_name", firstName);
    formData.append("middle_name", middleName);
    formData.append("last_name", lastName);
    formData.append("suffix_name", suffixName);
    formData.append("gender_id", genderId); 
    formData.append("birth_date", birthDate);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("password_confirmation", passwordConfirmation);

    try {
      const res = await UserService.storeUser(formData);

      if (res.status === 201 || res.status === 200) {
        onUserAdded(res.data.message || "User Successfully Added.");
        refreshkey();
        onClose(); // Ang resetForm() ay tatawagin sa useEffect (isOpen: false)
      }
    } catch (error: any) {
      console.error("Validation Error:", error.response?.data);
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoadingStore(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-4">
          Add User Form
        </h1>

        <div className="mb-4 px-4">
          <UploadInput
            label="Profile Picture" 
            name="add_user_profile_picture" 
            value={addUserProfilePicture} 
            onChange={setAddUserProfilePicture} 
            errors={errors.add_user_profile_picture} 
          />
        </div>
          
        <div className="grid grid-cols-2 gap-4 border-b border-gray-100 mb-4 p-4">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <FloatingLabelInput
              label="First Name"
              type="text"
              name="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              errors={errors.first_name}
              required
            />
            <FloatingLabelInput
              label="Middle Name"
              type="text"
              name="middle_name"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              errors={errors.middle_name}
            />
            <FloatingLabelInput
              label="Last Name"
              type="text"
              name="last_name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              errors={errors.last_name}
              required
            />
            <FloatingLabelInput
              label="Suffix Name"
              type="text"
              name="suffix_name"
              value={suffixName}
              onChange={(e) => setSuffixName(e.target.value)}
              errors={errors.suffix_name}
            />
            <FloatingLabelSelect
              label="Gender"
              name="gender_id"
              value={genderId}
              onChange={(e) => setGenderId(e.target.value)}
              errors={errors.gender_id}
              required
            >
              <option value="">{loadingGenders ? "Loading..." : "Select Gender"}</option>
              {!loadingGenders && genders.map((gender) => (
                <option value={gender.gender_id} key={gender.gender_id}>
                  {gender.gender}
                </option>
              ))}
            </FloatingLabelSelect>
          </div>

          <div className="col-span-2 md:col-span-1 space-y-4">
            <FloatingLabelInput
              label="Birth Date"
              type="date"
              name="birth_date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              errors={errors.birth_date}
              required
            />
            <FloatingLabelInput
              label="Username"
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              errors={errors.username}
              required
            />
            <FloatingLabelInput
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              errors={errors.password}
              required
            />
            <FloatingLabelInput
              label="Password Confirmation"
              type="password"
              name="password_confirmation"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              errors={errors.password_confirmation}
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4">
          <CloseButton label="Close" onClose={onClose} />
          <SubmitButton
            label="Save User"
            loading={loadingStore}
            loadingLabel="Saving..."
          />
        </div>
      </form>
    </Modal>
  );
};

export default AddUserFormModal;