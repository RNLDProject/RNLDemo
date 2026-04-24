import { useEffect, useState, type FC, type FormEvent } from "react";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/input/FloatingLabelInput";
import FloatingLabelSelect from "../../../components/input/Select/FloatingLabelSelect";
import Modal from "../../../components/Modal";
import type { UserColumns } from "../../../interfaces/UserColumns";
import type { UserFieldErrors } from "../../../interfaces/UserFieldErrors";
import type { GenderColumns } from "../../../interfaces/GendersColumns";
import GenderService from "../../../services/GenderService";
import UserService from "../../../services/UserService";

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
  const [first_name, setFirstName] = useState("");
  const [middle_name, setMiddleName] = useState("");
  const [last_name, setLastName] = useState("");
  const [suffix_name, setSuffixName] = useState("");
  const [gender_id, setGenderId] = useState("");
  const [birth_date, setBirthDate] = useState("");
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
      console.error("Unexpected server error occurred during loading genders:", error);
    } finally {
      setLoadingGenders(false);
    }
  };

  const handleUpdateUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoadingUpdate(true);
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
    };

    try {
      const res = await UserService.updateUser(user.user_id, payload);
      if (res.status >= 200 && res.status < 300) {
        onUserUpdated(res.data.message ?? "User Successfully Updated.");
        onClose();
      }
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Unexpected error occurred during updating user:", error);
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleLoadGenders();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!user) return;

    const derivedGenderId =
      typeof user.gender === "object" && user.gender !== null
        ? user.gender.gender_id
        : Number(user.gender);

    setFirstName(user.first_name ?? "");
    setMiddleName(user.middle_name ?? "");
    setLastName(user.last_name ?? "");
    setSuffixName(user.suffix_name ?? "");
    setGenderId(
      Number.isFinite(derivedGenderId)
        ? String(derivedGenderId)
        : String(user.gender_id ?? "")
    );
    setBirthDate(user.birth_date ?? "");
    setUsername(user.username ?? "");
  }, [user, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
      <form onSubmit={handleUpdateUser}>
        <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-4">
          Edit User Form
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