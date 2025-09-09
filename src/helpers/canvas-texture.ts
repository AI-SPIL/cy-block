import * as THREE from "three";

// 🔹 helper bikin CanvasTexture dari teks
export const createTextTexture = (text: string) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  // atur resolusi tinggi biar tidak pecah
  canvas.width = 512;
  canvas.height = 128;

  ctx.fillStyle = "black"; // background
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "bold 72px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  return new THREE.CanvasTexture(canvas);
};
