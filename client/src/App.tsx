import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./Context/AuthContext";
import AppRoutes from "./routes/approutes";
const App = () => {
  return (
    <>
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
    </>
    
  );
};

export default App;