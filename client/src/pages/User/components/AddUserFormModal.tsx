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

  
  const [first_name, setFirstName] = useState('');
  const [middle_name, setMiddleName] = useState('');
  const [last_name, setLastName] = useState('');
  const [suffix_name, setSuffixName] = useState('');
  const [gender_id, setGenderId] = useState('');
  const [birth_date, setBirthDate] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<UserFieldErrors>({});

  const handleLoadGenders = async () => {
    try {
      setLoadingGenders(true);
      const res = await GenderService.loadGenders();
      if (res.status === 200) {
        setGenders(res.data.genders);
      }
    } catch (error) {
      console.error("Unexpected server error occurred during loading genders: ", error);
    } finally {
      setLoadingGenders(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleLoadGenders();
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingStore(true);
    setErrors({});

    const parsedGenderId = gender_id ? Number(gender_id) : null;
    const payload = {
      first_name,
      middle_name,
      last_name,
      suffix_name,
      gender_id: Number.isFinite(parsedGenderId) ? parsedGenderId : null,
      birth_date,
      username,
      password,
      password_confirmation,
    };

    try {
      const res = await UserService.storeUser(payload);

      if (res.status >= 200 && res.status < 300) {
        setFirstName('');
        setMiddleName('');
        setLastName('');
        setSuffixName('');
        setGenderId('');
        setBirthDate('');
        setUsername('');
        setPassword('');
        setPasswordConfirmation('');
        setErrors({});
        onUserAdded(res.data.message ?? "User Successfully Added.");
        refreshkey();
        onClose();
      } else {
        console.error(
          "Unexpected status error occurred during storing user: ",
          res.status
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.log("Unexpected server error occurred during adding user:", error);
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

        <div className="grid grid-cols-2 gap-4 border-b border-gray-100 mb-4 p-4">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <FloatingLabelInput
                label="First Name"
                type="text"
                name="first_name"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                errors={errors.first_name}
                required
                autoFocus
              />
            </div>
            <div className="mb-4">
              <FloatingLabelInput
                label="Middle Name"
                type="text"
                name="middle_name"
                value={middle_name}
                onChange={(e) => setMiddleName(e.target.value)}
                errors={errors.middle_name}
              />
            </div>
            <div className="mb-4">
              <FloatingLabelInput
                label="Last Name"
                type="text"
                name="last_name"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                errors={errors.last_name}
                required
              />
            </div>
            <div className="mb-4">
              <FloatingLabelInput
                label="Suffix Name"
                type="text"
                name="suffix_name"
                value={suffix_name}
                onChange={(e) => setSuffixName(e.target.value)}
                errors={errors.suffix_name}
              />
            </div>
            <div className="mb-4">
              <FloatingLabelSelect
                label="Gender"
                name="gender_id"
                value={gender_id}
                onChange={(e) => setGenderId(e.target.value)}
                errors={errors.gender_id ?? errors.gender}
                required
              >
                {loadingGenders ? (
                  <option value="">Loading...</option>
                ) : (
                  <>
                    <option value="">Select Gender</option>
                    {genders.map((gender) => (
                      <option value={gender.gender_id} key={gender.gender_id}>
                        {gender.gender}
                      </option>
                    ))}
                  </>
                )}
              </FloatingLabelSelect>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <FloatingLabelInput
                label="Birth Date"
                type="date"
                name="birth_date"
                value={birth_date}
                onChange={(e) => setBirthDate(e.target.value)}
                errors={errors.birth_date}
                required
              />
            </div>
            <div className="mb-4">
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
            <div className="mb-4">
              <FloatingLabelInput
                label="Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                errors={errors.password}
                required
              />
            </div>
            <div className="mb-4">
              <FloatingLabelInput
                label="Password Confirmation"
                type="password"
                name="password_confirmation"
                value={password_confirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                errors={errors.password_confirmation}
                required
              />
            </div>
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