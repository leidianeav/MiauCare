import React, { useState } from "react";
import { UserProfileData, UserRoleOption } from "../types/miaucare";

interface ProfileViewProps {
  profile: UserProfileData;
  onSaveProfile: (updated: UserProfileData) => void;
  onDeleteAccount: () => void;
  onReturn: () => void;
}

const ROLE_OPTIONS: UserRoleOption[] = [
  "Pet Sitter",
  "Tutor",
  "Pet Sitter e Tutor",
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onSaveProfile,
  onDeleteAccount,
  onReturn,
}) => {
  const [formData, setFormData] = useState<UserProfileData>(profile);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSaveProfile(formData);
    setSavedNotice(true);
  };

  const handleConfirmDeleteAccount = () => {
    const confirmed = window.confirm(
      "Tem certeza de que deseja excluir sua conta e apagar seus dados locais no MiauCare? Esta ação não pode ser desfeita."
    );
    if (confirmed) {
      onDeleteAccount();
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Perfil</h1>
            <p className="mt-1 text-sm text-slate-600">
              Gerencie suas informações de conta e defina como você atua na
              plataforma.
            </p>
          </div>
          <button
            type="button"
            onClick={onReturn}
            className="rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-200"
          >
            Retornar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="profile-name"
                className="mb-1 block text-sm font-semibold text-slate-800"
              >
                Nome completo
              </label>
              <input
                id="profile-name"
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setSavedNotice(false);
                }}
                required
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-700 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="profile-role"
                className="mb-1 block text-sm font-semibold text-slate-800"
              >
                Atuação na plataforma
              </label>
              <select
                id="profile-role"
                value={formData.role}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    role: e.target.value as UserRoleOption,
                  });
                  setSavedNotice(false);
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-purple-700 focus:outline-none"
              >
                {ROLE_OPTIONS.map((roleOpt) => (
                  <option key={roleOpt} value={roleOpt}>
                    {roleOpt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="profile-email"
                className="mb-1 block text-sm font-semibold text-slate-800"
              >
                E-mail
              </label>
              <input
                id="profile-email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setSavedNotice(false);
                }}
                required
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-700 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="profile-phone"
                className="mb-1 block text-sm font-semibold text-slate-800"
              >
                Telefone / WhatsApp
              </label>
              <input
                id="profile-phone"
                type="text"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  setSavedNotice(false);
                }}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-700 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="profile-age"
                className="mb-1 block text-sm font-semibold text-slate-800"
              >
                Idade
              </label>
              <input
                id="profile-age"
                type="text"
                value={formData.age}
                onChange={(e) => {
                  setFormData({ ...formData, age: e.target.value });
                  setSavedNotice(false);
                }}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-700 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="profile-city"
                className="mb-1 block text-sm font-semibold text-slate-800"
              >
                Cidade / Estado
              </label>
              <input
                id="profile-city"
                type="text"
                value={formData.city}
                onChange={(e) => {
                  setFormData({ ...formData, city: e.target.value });
                  setSavedNotice(false);
                }}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="profile-bio"
              className="mb-1 block text-sm font-semibold text-slate-800"
            >
              Apresentação e experiência
            </label>
            <textarea
              id="profile-bio"
              rows={3}
              value={formData.bio}
              onChange={(e) => {
                setFormData({ ...formData, bio: e.target.value });
                setSavedNotice(false);
              }}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-700 focus:outline-none"
            />
          </div>

          {savedNotice && (
            <div
              role="status"
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-900"
            >
              Alterações do perfil salvas com sucesso.
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={handleConfirmDeleteAccount}
              className="rounded-lg border border-red-700 bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
            >
              Deletar Conta
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onReturn}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
              >
                Retornar
              </button>
              <button
                type="submit"
                className="rounded-lg border border-purple-900 bg-purple-800 px-5 py-2 text-sm font-bold text-white hover:bg-purple-900"
              >
                Confirmar Alterações
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};