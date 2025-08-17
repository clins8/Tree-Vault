import { useQuery } from "@tanstack/react-query";
import { Camera, ArrowLeft, Calendar } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";

export default function Gallery() {
  const { data: uploads } = useQuery({
    queryKey: ['/api/user/uploads'],
  }) as { data: any[] };

  const allUploads = (uploads as any[]) || [];

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
              <h1 className="text-xl font-bold text-gray-900">My Gallery</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {allUploads.length > 0 ? (
          <div className="grid gap-4">
            {allUploads.map((upload: any, index: number) => (
              <div key={upload.id || index} className="glass-card rounded-2xl p-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    upload.verificationStatus === 'success' 
                      ? 'bg-green-100 text-green-600'
                      : upload.verificationStatus === 'not_plant'
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    <Camera size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{upload.fileName}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar size={14} />
                      <span>{new Date(upload.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      upload.verificationStatus === 'success'
                        ? 'bg-green-100 text-green-700'
                        : upload.verificationStatus === 'not_plant'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {upload.verificationStatus === 'success' 
                        ? '✓ Verified' 
                        : upload.verificationStatus === 'not_plant'
                        ? '⚠ Not Plant'
                        : '✗ Duplicate'
                      }
                    </div>
                    <p className="text-xs text-gray-500 mt-1">+{upload.pointsAwarded} pts</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Camera className="text-gray-300 text-6xl mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No photos yet</h3>
            <p className="text-gray-600 mb-6">Start uploading plant photos to build your gallery</p>
            <Link href="/">
              <Button className="bg-primary-500 text-white hover:bg-primary-600">
                Upload Your First Plant
              </Button>
            </Link>
          </div>
        )}
      </main>

      <BottomNavigation currentPage="gallery" />
    </div>
  );
}