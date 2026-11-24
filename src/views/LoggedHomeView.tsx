import React from "react";
import { ActiveView, UserProfileData } from "../types/miaucare";

interface LoggedHomeViewProps {
  profile: UserProfileData;
  petsCount: number;
  completedModulesCount: number;
  onNavigate: (view: ActiveView) => void;
  onLogout: () => void;
}

export const LoggedHomeView: React.FC<LoggedHomeViewProps> = ({
  profile,
  petsCount,
  completedModulesCount,
  onNavigate,
  onLogout,
}) => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
          <div>
            <span className="inline-block rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-900">
              Perfil: {profile.role}
            </span>
            <h1 className="mt-3 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Olá, {profile.name}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Gerencie seus anúncios, rotinas de pets, mensagens e formação no
              MiauCare.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate("workspace")}
              className="rounded-lg border border-purple-900 bg-purple-800 px-4 py-2 text-sm font-bold text-white hover:bg-purple-900"
            >
              Anunciar
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-200"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Anunciar e Atendimentos
              </h2>
              <p className="mt-1.5 text-sm text-slate-600">
                Cadastre novos anúncios de cuidado domiciliar, confira
                checklists por espécie e registre observações.
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => onNavigate("workspace")}
                className="rounded-lg border border-purple-900 bg-purple-800 px-3.5 py-2 text-sm font-semibold text-white hover:bg-purple-900"
              >
                Abrir Área de Anúncios
              </button>
            </div>
          </article>

          <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Meus Pets ({petsCount})
              </h2>
              <p className="mt-1.5 text-sm text-slate-600">
                Cadastre animais de estimação, defina rotinas de alimentação e
                higiene e grave observações do dia a dia.
              </p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => onNavigate("my-pets")}
                className="rounded-lg border border-purple-900 bg-purple-800 px-3.5 py-2 text-sm font-semibold text-white hover:bg-purple-900"
              >
                Gerenciar Pets
              </button>
            </div>
          </article>

          <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Chat Moderado
              </h2>
              <p className="mt-1.5 text-sm text-slate-600">
                Converse com tutores ou cuidadores com filtro preventivo e
                organização de combinados.
              </p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => onNavigate("chat")}
                className="rounded-lg border border-purple-900 bg-purple-800 px-3.5 py-2 text-sm font-semibold text-white hover:bg-purple-900"
              >
                Abrir Chat
              </button>
            </div>
          </article>

          <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Curso MiauCare ({completedModulesCount}/7)
              </h2>
              <p className="mt-1.5 text-sm text-slate-600">
                Estude o conteúdo programático completo por espécie, segurança,
                primeiros socorros e ética.
              </p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => onNavigate("course")}
                className="rounded-lg border border-purple-900 bg-purple-800 px-3.5 py-2 text-sm font-semibold text-white hover:bg-purple-900"
              >
                Acessar Curso
              </button>
            </div>
          </article>

          <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Perfil</h2>
              <p className="mt-1.5 text-sm text-slate-600">
                Atualize seus dados cadastrais, escolha seu papel (Pet Sitter,
                Tutor ou ambos) ou gerencie sua conta.
              </p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => onNavigate("profile")}
                className="rounded-lg border border-purple-900 bg-purple-800 px-3.5 py-2 text-sm font-semibold text-white hover:bg-purple-900"
              >
                Editar Perfil
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};