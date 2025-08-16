import { useQuery } from "@tanstack/react-query";
import { Camera, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RecentDiscoveries() {
  const { data: discoveries } = useQuery({
    queryKey: ['/api/discoveries'],
  }) as { data: any[] };

  const scrollToUpload = () => {
    const uploadSection = document.querySelector('[data-section="upload"]');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="glass-card rounded-3xl p-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Camera className="text-primary-600 text-2xl" />
          <h3 className="text-2xl font-bold text-gray-900">Recent Plant Discoveries</h3>
        </div>
        <div className="text-primary-600 text-sm">
          <a href="#" className="hover:underline">View All →</a>
        </div>
      </div>

      {discoveries && (discoveries as any[]).length > 0 ? (
        <div className="grid gap-4">
          {(discoveries as any[]).map((discovery: any) => (
            <div key={discovery.id} className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Camera className="text-primary-600" size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">New plant discovered</p>
                <p className="text-sm text-gray-600">
                  {new Date(discovery.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-primary-600">+{discovery.pointsAwarded} points</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Sprout className="text-gray-300 text-6xl mb-4 mx-auto" />
          <h4 className="text-xl font-semibold text-gray-700 mb-2">No plant discoveries yet</h4>
          <p className="text-gray-600 mb-6">Be the first to share a plant photo!</p>
          <Button 
            onClick={scrollToUpload}
            className="bg-primary-500 text-white hover:bg-primary-600"
          >
            Upload Your First Plant
          </Button>
        </div>
      )}
    </div>
  );
}
