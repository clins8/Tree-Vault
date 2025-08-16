import { useQuery } from "@tanstack/react-query";
import { Trophy, Star } from "lucide-react";

export default function Leaderboard() {
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  }) as { data: any };

  const { data: topUsers } = useQuery({
    queryKey: ['/api/leaderboard'],
  }) as { data: any[] };

  const currentUser = user;
  const userRank = currentUser && topUsers ? 
    topUsers.findIndex(u => u.id === currentUser.id) + 1 : 1;

  return (
    <div className="glass-card rounded-3xl p-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Trophy className="text-yellow-500 text-2xl" />
          <h3 className="text-2xl font-bold text-gray-900">Leaderboard</h3>
        </div>
        <div className="text-sm text-gray-500">This Week</div>
      </div>

      {/* Current User Rank */}
      {currentUser && (
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-4 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="font-bold text-lg">{userRank}</span>
              </div>
              <div>
                <p className="font-semibold">{currentUser.username} (You)</p>
                <div className="flex items-center space-x-2">
                  <Star className="text-yellow-300" size={16} />
                  <span className="text-sm opacity-90">Rising Star</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{currentUser.points}</p>
              <p className="text-sm opacity-90">points</p>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-primary-600 text-sm mb-4">
        <a href="#" className="hover:underline">View Full Leaderboard →</a>
      </div>

      {/* Top Performers */}
      <div className="space-y-3">
        {(topUsers as any[])?.slice(0, 5).map((user: any, index: number) => (
          <div 
            key={user.id} 
            className="flex items-center space-x-4 p-3 rounded-xl hover:bg-primary-50 transition-colors"
          >
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">{index + 1}</span>
            </div>
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{user.username}</p>
              <p className="text-sm text-gray-500">{user.treesPlanted} plants uploaded</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">{user.points}</p>
              <p className="text-xs text-gray-500">points</p>
            </div>
          </div>
        ))}
        
        {(!topUsers || (topUsers as any[]).length === 0) && (
          <div className="text-center py-8">
            <Trophy className="text-gray-300 text-4xl mb-4 mx-auto" />
            <p className="text-gray-600">No rankings yet. Be the first to upload a plant!</p>
          </div>
        )}
      </div>
    </div>
  );
}
