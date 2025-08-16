import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, Upload, Images, MapPin, Check, AlertTriangle, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Confetti from "./Confetti";
import { apiRequest } from "@/lib/queryClient";

type VerificationStatus = 'idle' | 'verifying' | 'success' | 'not_plant' | 'duplicate' | 'error';

export default function UploadSection() {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('idle');
  const [showConfetti, setShowConfetti] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      // Add location if available
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          formData.append('location', JSON.stringify({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }));
        } catch (error) {
          console.log('Location access denied');
        }
      }

      const response = await apiRequest('POST', '/api/upload', formData);
      return response.json();
    },
    onMutate: () => {
      setVerificationStatus('verifying');
    },
    onSuccess: (data) => {
      setVerificationStatus(data.status);
      
      if (data.status === 'success') {
        setShowConfetti(true);
        toast({
          title: "Success!",
          description: `${data.message} You earned ${data.points} points!`,
        });
        
        // Hide confetti after 3 seconds
        setTimeout(() => setShowConfetti(false), 3000);
        
        // Invalidate user and stats queries
        queryClient.invalidateQueries({ queryKey: ['/api/user'] });
        queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      } else if (data.status === 'not_plant') {
        toast({
          title: "Try Again",
          description: data.message,
          variant: "destructive",
        });
      } else if (data.status === 'duplicate') {
        toast({
          title: "Duplicate Image",
          description: data.message,
          variant: "destructive",
        });
      }

      // Reset to idle after 3 seconds
      setTimeout(() => setVerificationStatus('idle'), 3000);
    },
    onError: (error) => {
      setVerificationStatus('error');
      toast({
        title: "Upload Failed",
        description: "Please try again with a different image.",
        variant: "destructive",
      });
      setTimeout(() => setVerificationStatus('idle'), 3000);
    },
  });

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const openFileDialog = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    };
    input.click();
  };

  const openCamera = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    };
    input.click();
  };

  const renderVerificationContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <div className="text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary-500" />
            <p className="text-lg font-medium text-gray-700">AI is verifying your plant...</p>
          </div>
        );
      
      case 'success':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
              <Check className="text-white text-2xl" />
            </div>
            <h4 className="text-xl font-bold text-success mb-2">🌱 Plant Verified!</h4>
            <p className="text-gray-600">Great job! You've earned <span className="font-bold text-primary-600">50 points</span></p>
          </div>
        );
      
      case 'not_plant':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-warning rounded-full flex items-center justify-center mx-auto mb-4 animate-shake">
              <AlertTriangle className="text-white text-2xl" />
            </div>
            <h4 className="text-xl font-bold text-warning mb-2">Plant not recognised</h4>
            <p className="text-gray-600">Try again with a clearer photo of a plant</p>
          </div>
        );
      
      case 'duplicate':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-error rounded-full flex items-center justify-center mx-auto mb-4 animate-shake">
              <X className="text-white text-2xl" />
            </div>
            <h4 className="text-xl font-bold text-error mb-2">Duplicate not allowed</h4>
            <p className="text-gray-600">This image has already been uploaded</p>
          </div>
        );
      
      default:
        return (
          <div className="text-center">
            <Upload className="text-primary-500 text-4xl mb-4 mx-auto hover:animate-bounce-gentle" />
            <p className="text-lg font-medium text-gray-700 mb-2">Drop your plant photo here</p>
            <p className="text-gray-500 text-sm">or click to browse files</p>
          </div>
        );
    }
  };

  return (
    <div className="glass-card rounded-3xl p-8 shadow-xl">
      {showConfetti && <Confetti />}
      
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="text-primary-600 text-2xl" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Plant Photo</h3>
        <p className="text-gray-600">Drag & drop or click to select your plant image</p>
      </div>

      {/* Upload Zone */}
      <div 
        className={`relative border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer group transition-all duration-200 ${
          dragOver 
            ? 'border-primary-500 bg-primary-50' 
            : verificationStatus === 'idle'
            ? 'border-primary-300 hover:border-primary-500'
            : 'border-gray-300'
        }`}
        onClick={verificationStatus === 'idle' ? openFileDialog : undefined}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {renderVerificationContent()}
      </div>

      {verificationStatus === 'idle' && (
        <>
          <div className="flex justify-center space-x-4 mt-6">
            <Button onClick={openCamera} className="bg-primary-500 text-white hover:bg-primary-600">
              <Camera className="mr-2" size={16} />
              Camera
            </Button>
            <Button 
              variant="outline" 
              onClick={openFileDialog}
              className="border-primary-500 text-primary-600 hover:bg-primary-50"
            >
              <Images className="mr-2" size={16} />
              Gallery
            </Button>
          </div>

          <div className="flex items-center justify-center mt-4 text-sm text-yellow-600">
            <MapPin className="mr-2" size={16} />
            <span>Enable location access for accurate plant mapping</span>
          </div>
        </>
      )}
    </div>
  );
}
