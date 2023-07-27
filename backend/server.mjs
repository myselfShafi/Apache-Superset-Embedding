import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const PORT = 3001;
const app = express();

app.use(cors());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

async function fetchAccessToken() {
  try {
    const body = {
      username: "dummyuser",
      password: "password",
      provider: "db",
      refresh: true,
    };

    const response = await fetch(
      "http://your_superset_domain/api/v1/security/login",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const jsonResponse = await response.json();
    return jsonResponse?.access_token;
  } catch (e) {
    console.error(e);
  }
}

async function fetchGuestToken() {
  const accessToken = await fetchAccessToken();

  console.log("access token: ", accessToken);

  try {
    const body = {
      resources: [
        {
          type: "dashboard",
          id: "your_superset_generated_id",
        },
      ],
      rls: [],
      user: {
        username: "guest",
        first_name: "Guest",
        last_name: "User",
      },
    };
    const response = await fetch(
      "http://your_superset_domain/api/v1/security/guest_token",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        redirect: "follow",
      }
    );
    console.log({ response });
    const jsonResponse = await response.json();
    console.log("token", jsonResponse.token);
    return jsonResponse?.token;
  } catch (error) {
    console.error(error);
  }
}

app.get("/guest-token", async (req, res) => {
  const token = await fetchGuestToken();
  console.log("token received :", token);
  res.json({ token });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});
