import { Leaf, Network, TreePine, Sprout } from "lucide-react";

export default function Globe() {
  return (
    <div className="relative w-80 h-80 mx-auto mb-12">
      {/* Central Globe */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 animate-rotate-slow shadow-2xl overflow-hidden">
        {/* Earth texture overlay */}
        <div 
          className="w-full h-full rounded-full opacity-90 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800')`
          }}
        />
      </div>

      {/* Orbital Rings */}
      <div className="orbit-ring w-96 h-96 -top-8 -left-8" />
      <div className="orbit-ring w-[26rem] h-[26rem] -top-10 -left-10 opacity-50" />

      {/* Floating Plant Elements */}
      <div className="floating-plant text-primary-500">
        <Leaf size={24} />
      </div>
      <div className="floating-plant text-green-600">
        <Network size={20} />
      </div>
      <div className="floating-plant text-primary-600">
        <TreePine size={24} />
      </div>
      <div className="floating-plant text-green-500">
        <Sprout size={20} />
      </div>
      <div className="floating-plant text-green-500">
        <Leaf size={24} />
      </div>
      <div className="floating-plant text-primary-700">
        <Network size={20} />
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse" />
    </div>
  );
}
