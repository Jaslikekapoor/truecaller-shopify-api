import React from 'react';

export default function TruecallerLogin() {
  const startLogin = () => {
    // Check if SDK is loaded
    if (!window.TruecallerSDK || typeof window.TruecallerSDK.init !== 'function') {
      alert("Truecaller SDK not loaded. Please check domain access or internet.");
      return;
    }

    // Initialize SDK
    window.TruecallerSDK.init({
      consentMode: "popup",
      buttonType: "continue",
      redirectUrl: window.location.href,
      onSuccess: async function (response) {
        const user = response.data.payload;
        const name = user.name;
        const email = user.email || `${user.phoneNumber}@truecaller.com`;

        try {
          const res = await fetch("http://localhost:3000/truecallerLogin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email }),
          });

          const data = await res.json();
          const token = data.data?.customerAccessTokenCreate?.customerAccessToken?.accessToken;

          if (token) {
            localStorage.setItem("shopify_token", token);
            alert("✅ Login successful!");
          } else {
            alert("⚠️ Shopify login failed:\n" + JSON.stringify(data));
          }
        } catch (err) {
          alert("❌ Server/API error: " + err.message);
        }
      },
      onFailure: function () {
        alert("❌ Truecaller login failed.");
      },
    });

    window.TruecallerSDK.launch();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <button onClick={startLogin} style={{ padding: "12px 24px", fontSize: "16px" }}>
        Login with Truecaller
      </button>
    </div>
  );
}
