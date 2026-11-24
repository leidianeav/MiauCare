import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import type { UserProfile } from "../types/miaucare";
import { moderateImageFile } from "../utils/moderation";
import { isSafeMediaUrl, isValidEmail, sanitizeText } from "../utils/security";

interface ProfileViewProps {
  currentUser: UserProfile;
  onSave: (upd: Partial<UserProfile>) => void;
  onBack: () => void;
  onToast: (msg: string) => void;
}

export function ProfileView({ currentUser, onSave, onBack, onToast }: ProfileViewProps) {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone ?? "");
  const [age, setAge] = useState(currentUser.age ? String(currentUser.age) : "32");
  const [hideContactUntilBooking, setHideContactUntilBooking] = useState(
    currentUser.hideContactUntilBooking ?? true
  );
  const [profileImg, setProfileImg] = useState(currentUser.profileImg);
  const photoRef = useRef<HTMLInputElement | null>(null);

  const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const mod = moderateImageFile(file);
    if (!mod.ok) {
      onToast(mod.reason || "Arquivo bloqueado.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const val = String(reader.result || "");
      if (isSafeMediaUrl(val)) {
        setProfileImg(val);
        onToast("Foto atualizada.");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const save = (e: FormEvent) => {
    e.preventDefault();
    const cleanName = sanitizeText(name, 80);
    const cleanEmail = sanitizeText(email, 100).toLowerCase();
    if (cleanName.split(/\s+/).length < 2) {
      onToast("Informe nome e sobrenome.");
      return;
    }
    if (!isValidEmail(cleanEmail)) {
      onToast("Informe um e-mail válido.");
      return;
    }
    const parsedAge = Math.min(100, Math.max(18, parseInt(age, 10) || 32));
    onSave({
      name: cleanName,
      email: cleanEmail,
      phone: sanitizeText(phone, 30),
      age: parsedAge,
      hideContactUntilBooking,
      profileImg: isSafeMediaUrl(profileImg) ? profileImg : "",
    });
    onToast("Perfil e preferências de privacidade salvos.");
  };

  return (
    <form onSubmit={save} className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 space-y-5">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} className="text-xs font-bold text-purple-700">
          ← Voltar
        </button>
        <h2 className="text-xl font-extrabold">Configurações do Perfil e Privacidade</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-extrabold text-xl overflow-hidden">
          {profileImg && isSafeMediaUrl(profileImg) ? (
            <img src={profileImg} alt={name} className="w-full h-full object-cover" />
          ) : (
            sanitizeText(name, 2).toUpperCase()
          )}
        </div>
        <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        <button
          type="button"
          onClick={() => photoRef.current?.click()}
          className="bg-purple-50 text-purple-700 font-bold text-xs px-4 py-2.5 rounded-xl"
        >
          Trocar foto
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Nome completo</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Telefone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(34) 99999-9999"
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Idade</label>
          <input
            type="number"
            min={18}
            max={100}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
          />
        </div>
      </div>

      <label className="flex items-start gap-2.5 bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-700 cursor-pointer">
        <input
          type="checkbox"
          checked={hideContactUntilBooking}
          onChange={(e) => setHideContactUntilBooking(e.target.checked)}
          className="mt-0.5 accent-purple-700"
        />
        <span>
          <strong>Proteção de dados (LGPD):</strong> manter contato direto mascarado até confirmação do atendimento.
        </span>
      </label>

      <button type="submit" className="bg-purple-700 text-white font-bold px-6 py-3 rounded-xl text-xs">
        Salvar Alterações
      </button>
    </form>
  );
}
