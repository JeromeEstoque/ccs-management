// Test logout functionality
import { useAuth } from './context/AuthContext';

const TestLogout = () => {
  const { logout, user, isAuthenticated } = useAuth();
  
  const handleTestLogout = async () => {
    console.log('Before logout:', { user, isAuthenticated });
    
    try {
      await logout();
      console.log('Logout successful');
      console.log('After logout:', { user, isAuthenticated });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return (
    <div>
      <h2>Logout Test</h2>
      <p>User: {user?.firstName || 'Not logged in'}</p>
      <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
      <button onClick={handleTestLogout}>Test Logout</button>
    </div>
  );
};

export default TestLogout;
