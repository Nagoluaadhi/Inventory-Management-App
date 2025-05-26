import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';

export default function BarcodeScanner({ onScan }) {
  const webcamRef = useRef(null);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!scanning || !webcamRef.current) return;

      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          onScan(code.data);
          setScanning(false);
        }
      };
    }, 1000);

    return () => clearInterval(interval);
  }, [scanning, onScan]);

  return (
    <div className="my-4">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/png"
        width={400}
        videoConstraints={{
          facingMode: 'environment'
        }}
      />
      <div className="text-xs text-gray-500 mt-1">Point your camera at a barcode</div>
    </div>
  );
}