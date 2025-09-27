import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import depanneuse1 from '../../assets/depanneuse 1.svg';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submit:', formData);
    navigate('/depanage');
  };

  const goToSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="bg-white rounded-2xl shadow-lg p-6" style={{ width: '400px', minWidth: '400px' }}>
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src={depanneuse1} alt="DepanVite logo" className="w-8 h-8 mr-3 object-contain" />
            <h1 className="text-2xl font-bold">
              <span className="font-bold" style={{ color: '#000000' }}>D</span>
              <span className="font-bold" style={{ color: '#FFC120' }}>e</span>
              <span className="font-bold" style={{ color: '#FFC120' }}>p</span>
              <span className="font-bold" style={{ color: '#FFC120' }}>a</span>
              <span className="font-bold" style={{ color: '#FFC120' }}>n</span>
              <span className="font-bold" style={{ color: '#000000' }}>V</span>
              <span className="font-bold" style={{ color: '#FFC120' }}>i</span>
              <span className="font-bold" style={{ color: '#FFC120' }}>t</span>
              <span className="font-bold" style={{ color: '#FFC120' }}>e</span>
            </h1>
          </div>

          <h2 className="text-xl font-semibold mb-2" style={{ color: '#000000' }}>
            Connectez-vous
          </h2>
          <p className="text-gray-600 text-sm">
            Accédez à votre espace partenaire
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>
              Email professionnel <span style={{ color: '#D53235' }}>*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="contact@votre-assurance.dz"
                className="w-full px-4 py-3 rounded-lg border-0 text-sm placeholder-gray-400"
                style={{ 
                  backgroundColor: '#FFF4D2',
                  color: '#000000'
                }}
                required
              />
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#FFC120' }} />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>
              Mot de passe <span style={{ color: '#D53235' }}>*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border-0 text-sm placeholder-gray-400"
                style={{ 
                  backgroundColor: '#FFF4D2',
                  color: '#000000'
                }}
                required
              />
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#FFC120' }} />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]"
            style={{ 
              backgroundColor: '#FFC120',
              color: '#000000'
            }}
          >
            SE CONNECTER
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">ou</span>
            </div>
          </div>

          {/* Switch to Signup */}
          <button
            type="button"
            onClick={goToSignup}
            className="w-full py-3 rounded-lg font-semibold text-sm border-2 transition-all duration-200 hover:shadow-md"
            style={{ 
              borderColor: '#FFC120',
              color: '#000000',
              backgroundColor: 'transparent'
            }}
          >
            CRÉER MON COMPTE
          </button>

          {/* Help Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Besoin d'aide ? {' '}
              <button 
                type="button"
                className="font-medium hover:underline"
                style={{ color: '#D53235' }}
              >
                Contactez notre équipe
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}


