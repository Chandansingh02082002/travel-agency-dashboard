import { registerLicense } from "@syncfusion/ej2-base";

export function activateSyncfusionLicense() {
  const key = import.meta.env.VITE_SYNCFUSION_LICENSE;

  if (typeof window !== "undefined") {
    if (key) {
      console.log("🔑 Syncfusion License Key Loaded");
      registerLicense(key);
    } else {
      console.error("❌ Syncfusion license key not found in .env");
    }
  }
}
