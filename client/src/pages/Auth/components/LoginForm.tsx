import { useState, type FC, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/input/FloatingLabelInput";
import type { LoginCredentialsErrorFields } from "../../../interfaces/AuthInterface"; 
import { useAuth } from "../../../Context/AuthContext";

interface LoginFormProps {
  message: (message: string, isFailed: boolean) => void;
}

const LoginForm: FC<LoginFormProps> = ({ message }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginCredentialsErrorFields>({});

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault(); // Siguraduhing nauna ito
    setIsLoading(true);

    try {
      await login(username, password); //
      navigate("/genders");
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 401) {
        setErrors({});
        message(error.response.data.message, true);
      } else if (isAxiosError(error) && error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        message("Unable to sign in. Please try again.", true);
        console.error(
          "Unexpected server error occurred during logging user in: ",
          error
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="mb-4">
        <FloatingLabelInput
          label="Username"
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          errors={errors.username}
          autoFocus
        />
      </div>
      <div className="mb-4">
        <FloatingLabelInput
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          errors={errors.password}
        />
      </div>
      <SubmitButton
        className="w-full"
        label="Sign In"
        loading={isLoading}
        loadingLabel="Signing In..."
      />
    </form>
  );
};

export default LoginForm;