import { useEffect, useState, type FC, type FormEvent } from "react";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/input/FloatingLabelInput";
import FloatingLabelSelect from "../../../components/input/Select/FloatingLabelSelect";
import Modal from "../../../components/Modal";
import GenderService from "../../../services/GenderService";
import UserService from "../../../services/UserService";
import type { UserColumns, UserFieldErrors } from "../../../interfaces/UserInterface";
import type { GenderColumns } from "../../../interfaces/GenderInterface";
import UploadInput from "../../../components/input/UploadInput";

interface EditUserFormModelProps {
  user: UserColumns | null;
  onUserUpdated: (message: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const EditUserFormModel: FC<EditUserFormModelProps> = ({
  user,
  onUserUpdated,
  isOpen,
  onClose,
}) => {
  const [loadingGenders, setLoadingGenders] = useState(false);
  const [genders, setGenders] = useState<GenderColumns[]>([]);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  
  // States
  const [existingProfilePicture, setExistingProfilePicture] = useState<string | null>(null);
  const [editUserProfilePicture, setEditUserProfilePicture] = useState<File | null>(null);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffixName, setSuffixName] = useState("");
  const [genderId, setGenderId] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState<UserFieldErrors>({});

  const handleLoadGenders = async () => {
    try {
      setLoadingGenders(true);
      const res = await GenderService.loadGenders();
      if (res.status === 200) {
        setGenders(res.data.genders);
      }
    } catch (error) {
      console.error("Error loading genders:", error);
    } finally {
      setLoadingGenders(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleLoadGenders();
    }
  }, [isOpen]);

  useEffect(() => {
    if (user && isOpen) {
      setFirstName(user.first_name || "");
      setMiddleName(user.middle_name || "");
      setLastName(user.last_name || "");
      setSuffixName(user.suffix_name || "");
      setGenderId(String(user.gender_id || ""));
      setBirthDate(user.birth_date || "");
      setUsername(user.username || "");
      setExistingProfilePicture(user.profile_picture || null);
      setEditUserProfilePicture(null);
      setErrors({});
    }
  }, [user, isOpen]);

  const handleUpdateUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoadingUpdate(true);
    setErrors({});

    try {
        const formData = new FormData();
        
        // ETO ANG PINAKA-IMPORTANTE:
        // Sasabihin natin sa Laravel na "PUT" talaga ang request na ito
        formData.append('_method', 'PUT'); 

        // I-append ang image kung may bago
        if (editUserProfilePicture) {
            formData.append("edit_user_profile_picture", editUserProfilePicture);
        } else if (!existingProfilePicture) {
            formData.append("remove_profile_picture", "1");
        }

        // I-append ang iba pang fields
        formData.append("first_name", firstName);
        formData.append("middle_name", middleName || '');
        formData.append("last_name", lastName);
        formData.append("suffix_name", suffixName || '');
        formData.append("gender_id", genderId); 
        formData.append("birth_date", birthDate);
        formData.append("username", username);

        // Tawagin ang service
        const res = await UserService.updateUser(user.user_id, formData);
        
        if (res.status === 200) {
            onUserUpdated(res.data.message);
            onClose();
        }
    } catch (error: any) {
        // ... handling errors
    } finally {
        setLoadingUpdate(false);
    }
};

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
      <form onSubmit={handleUpdateUser}>
        <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-4">
          Edit User Form
        </h1>
        
        <div className="mb-4 px-4">
          <UploadInput 
            label='Profile Picture' 
            name='edit_user_profile_picture' 
            value={editUserProfilePicture} 
            onChange={setEditUserProfilePicture} 
            onRemoveExistingImageUrl={() => setExistingProfilePicture(null)}
            existingImageUrl={existingProfilePicture}   
            errors={errors.edit_user_profile_picture} 
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
              errors={errors.gender_id || errors.gender}
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
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4">
          <CloseButton label="Close" onClose={onClose} />
          <SubmitButton
            label="Update User"
            loading={loadingUpdate}
            loadingLabel="Updating User..."
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditUserFormModel;