
import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Crop, RotateCcw, RotateCw, ZoomIn, ZoomOut, Move, X, Check } from 'lucide-react';

interface IdPhotoCropperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  onCrop: (croppedImage: string) => void;
}

export const IdPhotoCropper = ({ open, onOpenChange, imageUrl, onCrop }: IdPhotoCropperProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Load the image when the component mounts or imageUrl changes
  useEffect(() => {
    if (!imageUrl || !open) return;

    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      resetCrop();
    };
    img.src = imageUrl;
  }, [imageUrl, open]);

  // Draw the image on the canvas
  const drawImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imageRef.current;

    if (!canvas || !ctx || !img) return;

    const aspectRatio = 3 / 4; // Target aspect ratio
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Clear the canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Save the context state
    ctx.save();
    
    // Translate to the center of the canvas
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    
    // Rotate the image
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Scale the image
    ctx.scale(scale, scale);
    
    // Draw the image centered with position offset
    ctx.drawImage(
      img,
      -img.width / 2 + position.x,
      -img.height / 2 + position.y,
      img.width,
      img.height
    );
    
    // Restore the context state
    ctx.restore();
  };

  // Update the canvas when any parameter changes
  useEffect(() => {
    if (open) {
      drawImage();
    }
  }, [scale, rotation, position, open]);

  // Reset the crop parameters
  const resetCrop = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    
    if (!canvas || !img) return;

    // Calculate the scale to fit the image in the canvas while maintaining the 3:4 aspect ratio
    const targetAspectRatio = 3 / 4;
    const imgAspectRatio = img.width / img.height;
    
    if (imgAspectRatio > targetAspectRatio) {
      // Image is wider than target ratio, scale based on height
      setScale(canvas.height / img.height * 0.8);
    } else {
      // Image is taller than target ratio, scale based on width
      setScale(canvas.width / img.width * 0.8);
    }
    
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  // Handle mouse up for dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle mouse leave for dragging
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Crop the image
  const handleCrop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a new canvas with 3:4 aspect ratio
    const cropCanvas = document.createElement('canvas');
    const cropCtx = cropCanvas.getContext('2d');
    
    if (!cropCtx) return;

    // Set the size for the cropped image (maintain 3:4 ratio)
    cropCanvas.width = 300;
    cropCanvas.height = 400;
    
    // Draw the entire canvas content to the crop canvas
    cropCtx.drawImage(
      canvas,
      0, 0, canvas.width, canvas.height,
      0, 0, cropCanvas.width, cropCanvas.height
    );
    
    // Get the cropped image as a data URL
    const croppedImage = cropCanvas.toDataURL('image/jpeg', 0.85);
    
    // Call the onCrop callback with the cropped image
    onCrop(croppedImage);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crop className="w-5 h-5" />
            Cắt ảnh đúng tỷ lệ 3x4
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4">
          <div 
            className="relative border rounded-md overflow-hidden" 
            style={{ width: '300px', height: '400px', background: '#f0f0f0' }}
          >
            <canvas 
              ref={canvasRef} 
              width={300} 
              height={400} 
              className="cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            />
            <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-primary/50 rounded-sm opacity-50" />
          </div>
          
          <div className="w-full max-w-md grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium flex items-center gap-2">
                <ZoomIn className="w-4 h-4" />
                Độ phóng đại
              </p>
              <div className="flex items-center gap-2">
                <ZoomOut className="w-4 h-4 text-muted-foreground" />
                <Slider
                  value={[scale]}
                  min={0.1}
                  max={3}
                  step={0.1}
                  onValueChange={(value) => setScale(value[0])}
                />
                <ZoomIn className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium flex items-center gap-2">
                <RotateCw className="w-4 h-4" />
                Xoay ảnh
              </p>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-muted-foreground" />
                <Slider
                  value={[rotation]}
                  min={-180}
                  max={180}
                  step={5}
                  onValueChange={(value) => setRotation(value[0])}
                />
                <RotateCw className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" type="button" onClick={resetCrop}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Đặt lại
            </Button>
            <p className="text-xs text-muted-foreground">
              <Move className="w-3 h-3 inline mr-1" />
              Kéo ảnh để điều chỉnh vị trí
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="w-4 h-4 mr-2" />
            Hủy
          </Button>
          <Button onClick={handleCrop}>
            <Check className="w-4 h-4 mr-2" />
            Cắt ảnh
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
