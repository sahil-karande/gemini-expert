import React from 'react';
import { Toaster } from 'react-hot-toast';
import RegistrationForm from "./src/components/RegistrationForm";

function App() {
  return (
    <>
      {/* Required for the "Success" notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e1e1e',
            color: '#fff',
            border: '1px solid #3b82f6',
          },
        }}
      />
      
      <div className="min-h-screen bg-[#121212]">
        <RegistrationForm />
      </div>
    </>
  );
}

export default App;