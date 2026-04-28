import type { FC, ReactNode } from "react";
import companylogo from "../../assets/img/companylogo.png";

interface AuthPageLayoutProps {
  children: ReactNode;
}

const AuthPageLayout: FC<AuthPageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-row bg-white">
      <div className="flex w-full flex-col items-center justify-center bg-white lg:w-1/2">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-6 flex flex-col items-center">
            <img className="mb-2 h-16" src={companylogo} alt="Company Logo" />
            <h2 className="text-2xl font-bold text-gray-800">
              Sign in to your account
            </h2>
          </div>
          {children}
        </div>
      </div>

      <div className="hidden h-screen w-1/2 items-center justify-center bg-white lg:flex">
        <img
          className="h-full w-full object-contain"
          src={companylogo}
          alt="Company Logo"
        />
      </div>
    </div>
  );
};

export default AuthPageLayout;