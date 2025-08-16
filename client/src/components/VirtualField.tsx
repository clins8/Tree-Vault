import { useQuery } from "@tanstack/react-query";
import { TreePine, Plus, Sprout, Trophy } from "lucide-react";

export default function VirtualField() {
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  });

  const { data: uploads } = useQuery({
    queryKey: ['/api/user/uploads'],
  });

  const successfulUploads = (uploads as any[])?.filter((upload: any) => upload.verificationStatus === 'success') || [];
  const treeCount = successfulUploads.length;

  // Create grid slots (16 slots in 4x4 grid)
  const gridSlots = Array.from({ length: 16 }, (_, index) => {
    const hasTree = index < treeCount;
    return {
      id: index,
      hasTree,
      plantData: hasTree ? successfulUploads[index] : null,
    };
  });

  return (
    <div className="glass-card rounded-3xl p-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <TreePine className="text-primary-600 text-2xl" />
          <h3 className="text-2xl font-bold text-gray-900">Your Virtual Field</h3>
        </div>
        <div className="bg-primary-100 px-4 py-2 rounded-full">
          <span className="text-primary-700 font-semibold">{treeCount} trees</span>
        </div>
      </div>

      {/* Grid of planted trees */}
      <div className="bg-gradient-to-br from-blue-100 to-primary-50 rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-4 gap-4 min-h-48">
          {gridSlots.map((slot) => (
            <div 
              key={slot.id}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                slot.hasTree
                  ? 'bg-primary-500 border-primary-600 animate-bounce-gentle'
                  : 'border-dashed border-gray-300 hover:border-primary-500'
              }`}
              style={{ animationDelay: `${slot.id * 0.1}s` }}
            >
              {slot.hasTree ? (
                <TreePine className="text-white" size={20} />
              ) : (
                <Plus className="text-gray-400" size={16} />
              )}
            </div>
          ))}
          
          {/* Central message when no trees */}
          {treeCount === 0 && (
            <div className="col-span-4 flex flex-col items-center justify-center py-8">
              <Sprout className="text-gray-400 text-4xl mb-4 animate-bounce-gentle" />
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Start your garden!</h4>
              <p className="text-gray-600 text-center">Upload your first plant photo to grow a tree</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-3 bg-primary-50 p-4 rounded-xl">
          <Sprout className="text-primary-600 text-xl" />
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="font-semibold text-gray-900">
              {treeCount === 0 ? 'Ready to start growing' : `Growing strong with ${treeCount} trees`}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 bg-yellow-50 p-4 rounded-xl">
          <Trophy className="text-yellow-600 text-xl" />
          <div>
            <p className="text-sm text-gray-600">Next milestone</p>
            <p className="font-semibold text-gray-900">
              {treeCount < 5 ? '5 trees' : treeCount < 10 ? '10 trees' : '25 trees'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
