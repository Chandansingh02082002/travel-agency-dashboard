import { useEffect } from "react";
import { registerSyncfusion } from "~/constants/register-syncfusion";

export default function Dashboard() {
  useEffect(() => {
    registerSyncfusion();
  }, []);

  return <h1>Dashboard Works 🚀</h1>;
}
