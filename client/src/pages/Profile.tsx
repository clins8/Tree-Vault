import { useQuery } from "@tanstack/react-query";
import { User, TreePine, Trophy, Calendar, ArrowLeft, Settings } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";

export default function Profile() {
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  }) as { data: any };

  const { data: uploads } = useQuery({
    queryKey: ['/api/user/uploads'],
  }) as { data: any[] };

  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
  }) as { data: any };

  const successfulUploads = (uploads as any[])?.filter((upload: any) => upload.verificationStatus === 'success') || [];
  
  const profileStats = [
    {
      icon: TreePine,
      value: successfulUploads.length,
      label: "Plants Verified",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Trophy,
      value: (user as any)?.points || 0,
      label: "Total Points",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      icon: Calendar,
      value: uploads?.length || 0,
      label: "Total Uploads",
      color: "bg-blue-100 text-blue-600"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-primary-50 to-white min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft size={20} />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Profile</h1>
            </div>
            <Button variant="ghost" size="sm">
              <Settings size={20} />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {/* Profile Header */}
        <div className="glass-card rounded-3xl p-8 mb-8 text-center">
          <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-white text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{(user as any)?.username || 'User'}</h2>
          <p className="text-gray-600 mb-4">Plant Enthusiast</p>
          
          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">{(user as any)?.points || 0}</p>
              <p className="text-sm text-gray-600">Points</p>
            </div>
            <div className="w-px bg-gray-300"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{successfulUploads.length}</p>
              <p className="text-sm text-gray-600">Plants</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="glass-card rounded-3xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
          <div className="grid grid-cols-3 gap-4">
            {profileStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${stat.color}`}>
                    <Icon size={20} />
                  </div>
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          {successfulUploads.length > 0 ? (
            <div className="space-y-3">
              {successfulUploads.slice(0, 5).map((upload: any, index: number) => (
                <div key={upload.id || index} className="flex items-center space-x-3 p-3 bg-white rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <TreePine className="text-green-600" size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Plant verified</p>
                    <p className="text-xs text-gray-600">
                      {new Date(upload.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-green-600">+{upload.pointsAwarded}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TreePine className="text-gray-300 text-4xl mb-2 mx-auto" />
              <p className="text-gray-600">No activity yet</p>
            </div>
          )}
        </div>
      </main>

      <BottomNavigation currentPage="profile" />
    </div>
  );
}