"use client";

import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

export function ShaderGradientScene({
  colors,
  pixelDensity,
}: {
  colors: [string, string, string];
  pixelDensity: number;
}) {
  return (
    <ShaderGradientCanvas
      className="absolute inset-0 size-full"
      style={{ position: "absolute", inset: 0 }}
      pixelDensity={pixelDensity}
      fov={45}
      pointerEvents="none"
      lazyLoad
      threshold={0.05}
      rootMargin="100px"
      powerPreference="high-performance"
    >
      <ShaderGradient
        control="props"
        type="plane"
        animate="on"
        cDistance={3.6}
        cPolarAngle={90}
        cAzimuthAngle={180}
        cameraZoom={1}
        uSpeed={0.2}
        uStrength={3}
        uFrequency={5.5}
        uDensity={1.2}
        color1={colors[0]}
        color2={colors[1]}
        color3={colors[2]}
        lightType="3d"
        brightness={1.1}
        grain="off"
      />
    </ShaderGradientCanvas>
  );
}
