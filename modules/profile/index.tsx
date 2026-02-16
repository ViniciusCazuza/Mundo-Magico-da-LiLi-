import React from "react";
import { User, Lock, ChevronRight } from "lucide-react";
import { UserProfile } from "../../core/types";

interface ProfileModuleProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onOpenParentZone: () => void;
}

export const ProfileModule: React.FC<ProfileModuleProps> = ({ profile, onUpdateProfile, onOpenParentZone }) => {
  return (
    <div className="flex-1 p-8 overflow-y-auto bg-slate-50 flex flex-col items-center animate-fade-in">
      <div className="w-full max-w-md space-y-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
          <h2 className="font-hand text-3xl text-magical-500 mb-6 flex items-center gap-3">
            <User size={24} /> Perfil
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Apelido Mágico</label>
              <input 
                value={profile.nickname} 
                onChange={e => onUpdateProfile({...profile, nickname: e.target.value})} 
                className="w-full p-4 bg-slate-50 rounded-xl font-bold border-2 border-transparent focus:border-magical-200 transition-all outline-none" 
              />
            </div>
          </div>
        </div>
        
        <button 
          onClick={onOpenParentZone} 
          className="w-full p-6 bg-slate-900 text-white rounded-[2rem] flex items-center justify-between hover:bg-black transition-all shadow-lg active:scale-95"
        >
          <div className="flex items-center gap-3">
            <Lock size={20} /> 
            <span className="font-bold">Área dos Pais</span>
          </div>
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};