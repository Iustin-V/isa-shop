import React from "react";

function passwordsMatch(password, confirmPassword) {
  return (
    typeof password === "string" &&
    typeof confirmPassword === "string" &&
    password.length > 0 &&
    password === confirmPassword
  );
}

export default function UpdatePasswordPage() {
  const [token, setToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    setToken(tokenFromUrl);
  }, []);

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!token) {
      setErrorMessage("Missing reset token.");
      return;
    }

    if (!passwordsMatch(password, confirmPassword)) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/customers/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrorMessage(json?.error?.message || "Failed to update password.");
        return;
      }

      setSuccessMessage("Password updated successfully. You can now log in.");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return <div>Invalid token</div>;
  }

  return (
    <div className="page-width py-12 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Reset your password</h1>

      {errorMessage ? (
        <div className="mb-4 p-3 rounded border border-red-300 bg-red-50 text-red-800">
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div className="mb-4 p-3 rounded border border-green-300 bg-green-50 text-green-800">
          {successMessage}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">New password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Confirm password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 1,
};
