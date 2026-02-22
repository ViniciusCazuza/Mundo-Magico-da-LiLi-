import React from 'react';
import { X, Menu, MessageSquare, Palette, Book, Calendar, ShieldCheck, User } from 'lucide-react';
import { AppSection } from '../../core/types';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: AppSection) => void;
  isAdmin: boolean;
  activeSection: AppSection;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, onNavigate, isAdmin, activeSection }) => {
  const navItems = [
    { id: 'chat', label: 'Conversar', icon: MessageSquare, adminOnly: false },
    { id: 'studio', label: 'Ateliê', icon: Palette, adminOnly: false },
    { id: 'library', label: 'Baú de Artes', icon: Book, adminOnly: false },
    { id: 'calendar', label: 'Agenda', icon: Calendar, adminOnly: false },
    { id: 'parent-zone', label: 'Monitor', icon: ShieldCheck, adminOnly: true },
    { id: 'profile', label: 'Eu', icon: User, adminOnly: false },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] lg:hidden animate-fade-in"
          onClick={onClose}
        ></div>
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-[var(--surface-elevated)] backdrop-blur-xl z-[101] p-6 lg:hidden shadow-lg transform transition-transform ease-in-out duration-300
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-end mb-8">
          <button onClick={onClose} className="p-2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
            <X size={28} />
          </button>
        </div>

        <nav className="flex flex-col gap-4">
          {navItems.map(item => (
            (isAdmin || !item.adminOnly) && (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id as AppSection);
                  onClose();
                }}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all
                  ${activeSection === item.id
                    ? 'bg-[var(--primary)] text-[var(--text-on-primary)] shadow-md'
                    : 'text-[var(--text-primary)] hover:bg-[var(--surface)]'
                  }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            )
          ))}
        </nav>
      </div>
    </>
  );
};

export default MobileNav;
