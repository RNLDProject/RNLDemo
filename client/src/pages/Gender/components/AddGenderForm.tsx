import { useState, type FC, type FormEvent } from "react";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/input/FloatingLabelInput";
import GenderService from "../../../services/GenderService";
import type { GenderFieldErrors } from "../../../interfaces/GenderFieldErrors";

interface AddGenderFormProps {
  onGenderAdded: (message: string) => void;
}

const AddGenderForm: FC<AddGenderFormProps> = ({ onGenderAdded }) => {
  const [loadingStore, setLoadingStore] = useState(false);
  const [gender, setGender] = useState("");
  const [errors, setErrors] = useState<GenderFieldErrors>({});
  const showSpinnerBriefly = () => new Promise((resolve) => setTimeout(resolve, 350));

  const handleStoreGender = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingStore(true);
      setErrors({});

      const trimmedGender = gender.trim();

      if (!trimmedGender) {
        setErrors({ gender: ["The gender field is required."] });
        await showSpinnerBriefly();
        return;
      }

      if (trimmedGender.length < 3) {
        setErrors({ gender: ["The gender field must be at least 3 characters."] });
        await showSpinnerBriefly();
        return;
      }

      if (trimmedGender.length > 15) {
        setErrors({ gender: ["The gender field must not be greater than 15 characters."] });
        await showSpinnerBriefly();
        return;
      }

      const res = await GenderService.storeGender({ gender: trimmedGender });

      if (res.status === 200) {
        setGender("");
        onGenderAdded(res.data.message);
      } else {
        console.error(
          "Unexpected error occurred during store gender:",
          res.data
        );
      }
    } catch (error) {
      if (error && typeof error === "object" && "response" in error) {
        const err = error as {
          response?: {
            status?: number;
            data?: { errors?: GenderFieldErrors };
          };
        };

        if (err.response?.status === 422) {
          setErrors(err.response.data?.errors ?? {});
        } else {
          console.error("Unexpected error occurred during store gender:", err.response?.data);
        }
      }
    } finally {
      setLoadingStore(false);
    }
  };

  return (
    <>
      <form onSubmit={handleStoreGender}>
        <div className="mb-4">
          <FloatingLabelInput
            label="Gender"
            type="text"
            name="gender"
            value={gender}
            onChange={(e) => {
              setGender(e.target.value);
              if (errors.gender) {
                setErrors({});
              }
            }}
            required
            autoFocus
            errors={errors.gender}
          />
        </div>
        <div className="flex justify-end">
          <SubmitButton
            label="Save Gender"
            loading={loadingStore}
            loadingLabel="Saving Gender..."
          />
        </div>
      </form>
    </>
  );
};

export default AddGenderForm;