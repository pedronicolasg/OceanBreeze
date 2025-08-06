import React, { useState } from 'react';
import { User, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ImageUpload from '../components/UI/ImageUpload';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    dateOfBirth: user?.dateOfBirth || '',
    profilePhoto: user?.profilePhoto || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const success = await updateProfile(formData);
      if (success) {
        setMessage('Perfil atualizado com sucesso!');
        setMessageType('success');
      } else {
        setMessage('Erro ao atualizar perfil');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Erro ao atualizar perfil');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (value: string) => {
    setFormData({
      ...formData,
      profilePhoto: value,
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Acesso negado
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Você precisa estar logado para acessar esta página
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Meu Perfil
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie suas informações pessoais
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <div className={`p-4 rounded-lg ${
                messageType === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}>
                <p className={`text-sm ${
                  messageType === 'success' 
                    ? 'text-green-800 dark:text-green-200' 
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  {message}
                </p>
              </div>
            )}

            <div className="text-center">
              <div className="mb-4">
                {formData.profilePhoto ? (
                  <img
                    src={formData.profilePhoto}
                    alt="Foto de perfil"
                    className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white dark:border-gray-700 shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto">
                    <User className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>
              <ImageUpload
                label="Alterar foto de perfil"
                value={formData.profilePhoto}
                onChange={handleImageChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome de usuário
                </label>
                <input
                  type="text"
                  value={user.username}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  O nome de usuário não pode ser alterado
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de conta
                </label>
                <input
                  type="text"
                  value={user.role === 'admin' ? 'Administrador' : 'Usuário'}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome completo
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data de nascimento
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" className="text-white" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Salvar alterações</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;