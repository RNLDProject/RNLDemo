import { useState, type FC, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; 
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
  
  // 1. State para sa pag-show/hide ng password
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault(); 
    setIsLoading(true);

    try {
      await login(username, password); 
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

      {/* 2. Password Field na may Mata Icon */}
      <div className="mb-4 relative"> 
        <FloatingLabelInput
          label="Password"
          // 3. Palitan ang type base sa state
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          errors={errors.password}
        />
        
        {/* 4. Button para sa Mata */}
        <button
          type="button" // Siguraduhin na type="button" para hindi mag-submit ang form
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
          style={{ zIndex: 10 }} // Para sigurado na clickable sa ibabaw ng input
        >
          {showPassword ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>
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