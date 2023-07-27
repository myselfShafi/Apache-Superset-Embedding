import { useEffect } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import "./App.css";

const BackendURL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_BACKEND_URL_PROD ////----URLs placed in .env files ----////
    : process.env.REACT_APP_BACKEND_URL_DEV; ////-----backend URL depending if project is running on localhost or server ----///

function App() {
  const getToken = async () => {
    const response = await fetch(`${BackendURL}/guest-token`); ///-----connect to your backend URL endpoint ----///
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
