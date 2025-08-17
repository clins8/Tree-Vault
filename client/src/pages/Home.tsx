import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Globe from "@/components/Globe";
import UploadSection from "@/components/UploadSection";
import VirtualField from "@/components/VirtualField";
import Leaderboard from "@/components/Leaderboard";
import RecentDiscoveries from "@/components/RecentDiscoveries";
import ImpactStats from "@/components/ImpactStats";
import BottomNavigation from "@/components/BottomNavigation";
import { Sprout, Trophy, User } from "lucide-react";

export default function Home() {
  const [animationDelay, setAnimationDelay] = useState(0);

  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  }) as { data: any };

  useEffect(() => {
    // Stagger animation delays for sections
    const sections = document.querySelectorAll('.animate-slide-up');
    sections.forEach((section, index) => {
      (section as HTMLElement).style.animationDelay = `${index * 0.2}s`;
    });
  }, []);

  return (
    <div className="bg-gradient-to-br from-primary-50 to-white min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <Sprout className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Tree Vault</h1>
                <p className="text-xs text-primary-600 font-medium">Plant Now, Reap Later</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-primary-100 px-3 py-1 rounded-full">
                <Trophy className="text-primary-600" size={16} />
                <span className="text-primary-700 font-semibold text-sm">
                  {(user as any)?.points || 0}
                </span>
              </div>
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <User className="text-white" size={16} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Hero Section with Globe */}
        <section className="relative mb-12 animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Plant Now, <span className="text-primary-600">Reap Later</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Upload plant photos, earn points, and watch your virtual forest grow! Join the community of plant enthusiasts.
            </p>
          </div>
          
          <Globe />
        </section>

        {/* Upload Section */}
        <section className="mb-12 animate-slide-up" style={{animationDelay: '0.2s'}} data-section="upload">
          <UploadSection />
        </section>

        {/* Virtual Field */}
        <section className="mb-12 animate-slide-up" style={{animationDelay: '0.4s'}}>
          <VirtualField />
        </section>

        {/* Leaderboard */}
        <section className="mb-12 animate-slide-up" style={{animationDelay: '0.6s'}}>
          <Leaderboard />
        </section>

        {/* Recent Discoveries */}
        <section className="mb-12 animate-slide-up" style={{animationDelay: '0.8s'}}>
          <RecentDiscoveries />
        </section>

        {/* Impact Stats */}
        <section className="animate-slide-up" style={{animationDelay: '1s'}}>
          <ImpactStats />
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}
