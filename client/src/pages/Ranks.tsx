import { useQuery } from "@tanstack/react-query";
import { Trophy, Star, ArrowLeft, Medal } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";

export default function Ranks() {
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  }) as { data: any };

  const { data: topUsers } = useQuery({
    queryKey: ['/api/leaderboard'],
  }) as { data: any[] };

  const currentUser = user;
  const userRank = currentUser && topUsers ? 
    topUsers.findIndex((u: any) => u.id === currentUser.id) + 1 : 1;

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Medal className="text-yellow-500" size={20} />;
    if (rank === 2) return <Medal className="text-gray-400" size={20} />;
    if (rank === 3) return <Medal className="text-amber-600" size={20} />;
    return <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">{rank}</div>;
  };

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
              <h1 className="text-xl font-bold text-gray-900">Leaderboard</h1>
            </div>
            <div className="text-sm text-gray-500">This Week</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {/* Your Rank */}
        {currentUser && (
          <div className="glass-card rounded-3xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Ranking</h2>
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="font-bold text-lg">#{userRank}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{currentUser.username}</p>
                    <div className="flex items-center space-x-2">
                      <Star className="text-yellow-300" size={16} />
                      <span className="text-sm opacity-90">Rising Star</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{(currentUser as any)?.points || 0}</p>
                  <p className="text-sm opacity-90">points</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="glass-card rounded-3xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Plant Hunters</h2>
          
          <div className="space-y-4">
            {(topUsers as any[])?.map((user: any, index: number) => (
              <div 
                key={user.id} 
                className={`flex items-center space-x-4 p-4 rounded-2xl transition-colors ${
                  currentUser?.id === user.id 
                    ? 'bg-primary-50 border-2 border-primary-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex-shrink-0">
                  {getRankIcon(index + 1)}
                </div>
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {user.username}
                    {currentUser?.id === user.id && <span className="text-primary-600 text-sm ml-2">(You)</span>}
                  </p>
                  <p className="text-sm text-gray-500">{user.treesPlanted} plants verified</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">{user.points}</p>
                  <p className="text-xs text-gray-500">points</p>
                </div>
              </div>
            )) || []}
            
            {(!topUsers || (topUsers as any[]).length === 0) && (
              <div className="text-center py-12">
                <Trophy className="text-gray-300 text-6xl mb-4 mx-auto" />
                <p className="text-gray-600">No rankings yet. Be the first to upload a plant!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNavigation currentPage="ranks" />
    </div>
  );
}