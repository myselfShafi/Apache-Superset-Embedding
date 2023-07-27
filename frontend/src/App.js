import { useEffect } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import "./App.css";

function App() {
  const getToken = async () => {
    const response = await fetch("http://localhost:3001/guest-token"); ///-----connect to your backend URL endpoint ----///
    const data = await response.json();
    const token = data.token;
    console.log("Received guest token:", token);
    return token;
  };

  useEffect(() => {
    const embed = async () => {
      await embedDashboard({
        id: "39d80141-4399-4c44-b55f-d08e0f0dbd39",
        supersetDomain: "http://localhost:8088", ///-------your superset acc domain ----////
        mountPoint: document.getElementById("dashboard"),
        fetchGuestToken: () => getToken(),
        dashboardUiConfig: {
          hideTitle: true,
          hideChartControls: true,
          hideTab: true,
        },
      });
    };

    if (document.getElementById("dashboard")) {
      embed();
    }
  }, []);

  return (
    <div className="App">
      <div className="header">
        <h1>Application_Title</h1>
      </div>
      <div id="dashboard"></div>
    </div>
  );
}

export default App;
