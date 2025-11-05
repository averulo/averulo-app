import Constants from "expo-constants";

export const API_BASE =
  Constants.expoConfig?.extra?.apiUrl || "http://192.168.100.6:4000"; // ← change to your local IP

// Helper to handle JSON or error
async function j(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

/**
 * ✅ Send OTP
 */
export async function sendOtp(email) {
  const res = await fetch(`${API_BASE}/api/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return j(res);
}

/**
 * ✅ Verify OTP (login)
 */
export async function verifyOtp(email, otp) {
  const res = await fetch(`${API_BASE}/api/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  return j(res);
}

/**
 * ✅ Get current user
 */
export async function getMe(token) {
  const res = await fetch(`${API_BASE}/api/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return j(res);
}

/**
 * ✅ Upload KYC (front + back image)
 */
export async function uploadKyc(token, idType, frontImage, backImage) {
  const formData = new FormData();
  formData.append("idType", idType);
  formData.append("frontImage", {
    uri: frontImage,
    name: "front.jpg",
    type: "image/jpeg",
  });
  formData.append("backImage", {
    uri: backImage,
    name: "back.jpg",
    type: "image/jpeg",
  });

  const res = await fetch(`${API_BASE}/api/users/kyc/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return j(res);
}

export async function getAdminTrends(token) {
  const res = await fetch(`${API_BASE}/api/admin/analytics/trends`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Failed to fetch trends");
  return data.trends;
}