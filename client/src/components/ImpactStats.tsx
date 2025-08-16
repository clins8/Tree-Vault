import { useQuery } from "@tanstack/react-query";
import { TreePine, Users, Camera, Globe } from "lucide-react";

export default function ImpactStats() {
  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
  }) as { data: any };

  const statsData = [
    {
      icon: TreePine,
      value: (stats as any)?.totalTrees || 0,
      label: "Trees Planted",
      color: "primary",
    },
    {
      icon: Users,
      value: (stats as any)?.totalUsers || 0,
      label: "Active Users",
      color: "blue",
    },
    {
      icon: Camera,
      value: (stats as any)?.totalPhotos || 0,
      label: "Photos Verified",
      color: "green",
    },
    {
      icon: Globe,
      value: (stats as any)?.countries || 0,
      label: "Countries",
      color: "yellow",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-primary-100 text-primary-600';
      case 'blue':
        return 'bg-blue-100 text-blue-600';
      case 'green':
        return 'bg-green-100 text-green-600';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="glass-card rounded-3xl p-8 shadow-xl">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Global Impact</h3>
        <p className="text-gray-600">Together, we're making a difference</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.label}
              className="text-center animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${getColorClasses(stat.color)}`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value.toLocaleString()}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
