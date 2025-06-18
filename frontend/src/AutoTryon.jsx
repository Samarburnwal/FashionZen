import React, { useRef, useState } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import '@tensorflow/tfjs';

const AutoTryOn = () => {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const CANVAS_WIDTH = 400;

  const estimatePoseAndDraw = async (userImg) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Resize image proportionally
    const scale = CANVAS_WIDTH / userImg.width;
    const newHeight = userImg.height * scale;

    canvas.width = CANVAS_WIDTH;
    canvas.height = newHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(userImg, 0, 0, CANVAS_WIDTH, newHeight);

    const net = await posenet.load();
    const pose = await net.estimateSinglePose(canvas, {
      flipHorizontal: false,
    });

    const keypoints = pose.keypoints;

    const ls = keypoints.find(k => k.part === 'leftShoulder');
    const rs = keypoints.find(k => k.part === 'rightShoulder');
    const lh = keypoints.find(k => k.part === 'leftHip');
    const rh = keypoints.find(k => k.part === 'rightHip');

    if (!ls || !rs || !lh || !rh) {
      alert('Pose not detected properly. Try another image.');
      setLoading(false);
      return;
    }

    const jacketImg = new Image();
    jacketImg.src = '/jacket.png'; // place this in your public folder

    jacketImg.onload = () => {
      // Compute center and dimensions
      const shoulderCenterX = (ls.position.x + rs.position.x) / 2;
      const shoulderY = Math.min(ls.position.y, rs.position.y);
      const hipY = Math.max(lh.position.y, rh.position.y);

      const chestWidth = (rs.position.x - ls.position.x) * 1.5; // make jacket wider
      const jacketHeight = (hipY - shoulderY) * 1.3; // stretch length to hips

      const jacketX = shoulderCenterX - chestWidth / 2;
      const jacketY = shoulderY - jacketHeight * 0.15; // small upward shift for neck alignment

      ctx.drawImage(jacketImg, jacketX, jacketY, chestWidth, jacketHeight);
      setLoading(false);
    };
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => estimatePoseAndDraw(img);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <h2>🧥 2D Auto-Fitting Virtual Try-On</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {loading && <p>Analyzing image... please wait...</p>}
      <canvas ref={canvasRef} style={{ marginTop: '20px', border: '1px solid #aaa' }} />
    </div>
  );
};

export default AutoTryOn;
