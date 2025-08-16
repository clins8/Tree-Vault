import { Home, Images, Plus, Trophy, User } from "lucide-react";

export default function BottomNavigation() {
  const navItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Images, label: "Gallery", active: false },
    { icon: Plus, label: "", special: true },
    { icon: Trophy, label: "Ranks", active: false },
    { icon: User, label: "Profile", active: false },
  ];

  const scrollToUpload = () => {
    const uploadSection = document.querySelector('[data-section="upload"]');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden z-40">
      <div className="flex justify-around items-center">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          
          if (item.special) {
            return (
              <button
                key={index}
                onClick={scrollToUpload}
                className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary-600 transition-colors"
              >
                <Icon size={20} />
              </button>
            );
          }

          return (
            <button
              key={index}
              className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
                item.active ? 'text-primary-600' : 'text-gray-400'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
