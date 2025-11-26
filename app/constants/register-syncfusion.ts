export function registerSyncfusion() {
  if (typeof window !== "undefined") {
    import("@syncfusion/ej2-base").then((pkg: any) => {
      pkg.registerLicense(import.meta.env.VITE_SYNCFUSION_LICENSE_KEY);
    });
  }
}
