import Constants from 'expo-constants';

export const API_BASE = Constants.expoConfig.extra.apiUrl;

// Helper to parse JSON or throw
async function j(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// 1. Auth
export async function sendOtp(email) {
  const res = await fetch(`${API_BASE}/api/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return j(res); // returns { success, devOtp? }
}

export async function verifyOtp(email, otp) {
  const res = await fetch(`${API_BASE}/api/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  return j(res); // returns { success, token, user }
}

// 2. Properties
export async function listProperties() {
  const res = await fetch(`${API_BASE}/api/properties?page=1&limit=20`);
  const data = await j(res);
  return data.items;
}

export async function getProperty(id, token) {
  const res = await fetch(`${API_BASE}/api/properties/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return j(res);
}

export async function getPublicBlocks(propertyId) {
  const res = await fetch(`${API_BASE}/api/availability/public?propertyId=${encodeURIComponent(propertyId)}`);
  return j(res);
}

// 3. Booking + Payments
export async function quote(propertyId, checkIn, checkOut) {
  const res = await fetch(`${API_BASE}/api/bookings/quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ propertyId, checkIn, checkOut }),
  });
  return j(res);
}

export async function createBooking(token, propertyId, checkIn, checkOut) {
  const res = await fetch(`${API_BASE}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ propertyId, checkIn, checkOut }),
  });
  return j(res);
}

export async function initPayment(token, bookingId) {
  const res = await fetch(`${API_BASE}/api/payments/init`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ bookingId }),
  });
  return j(res);
}

// 4. Favorites
export async function toggleFavorite(propertyId, token, nextState) {
  const method = nextState ? "POST" : "DELETE";
  const res = await fetch(`${API_BASE}/api/favorites/${propertyId}`, {
    method,
    headers: { Authorization: `Bearer ${token}` },
  });
  return j(res);
}

// 5. User Profile
export async function getMe(token) {
  const res = await fetch(`${API_BASE}/api/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return j(res);
}

// 6. Reviews
export async function getPropertyReviews(propertyId) {
  const res = await fetch(`${API_BASE}/api/reviews/property/${propertyId}`);
  return j(res);
}

export async function createReview(token, bookingId, rating, comment) {
  const res = await fetch(`${API_BASE}/api/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ bookingId, rating, comment }),
  });
  return j(res);
}

export async function getMyReviews(token) {
  const res = await fetch(`${API_BASE}/api/reviews/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return j(res);
}

export async function getHostReviews(token) {
  const res = await fetch(`${API_BASE}/api/reviews/host`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return j(res);
}

export async function replyToReview(token, reviewId, reply) {
  const res = await fetch(`${API_BASE}/api/reviews/${reviewId}/reply`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reply }),
  });
  return j(res);
}

// 7. KYC Upload
export async function uploadKyc(token, idType, frontPhotoUri, backPhotoUri) {
  const formData = new FormData();

  // Add ID type
  formData.append('idType', idType);

  // Add front image
  if (frontPhotoUri) {
    const frontFilename = frontPhotoUri.split('/').pop();
    const frontMatch = /\.(\w+)$/.exec(frontFilename);
    const frontType = frontMatch ? `image/${frontMatch[1]}` : 'image/jpeg';

    formData.append('frontImage', {
      uri: frontPhotoUri,
      name: frontFilename,
      type: frontType,
    });
  }

  // Add back image
  if (backPhotoUri) {
    const backFilename = backPhotoUri.split('/').pop();
    const backMatch = /\.(\w+)$/.exec(backFilename);
    const backType = backMatch ? `image/${backMatch[1]}` : 'image/jpeg';

    formData.append('backImage', {
      uri: backPhotoUri,
      name: backFilename,
      type: backType,
    });
  }

  const res = await fetch(`${API_BASE}/api/users/kyc/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });
  return j(res);
}