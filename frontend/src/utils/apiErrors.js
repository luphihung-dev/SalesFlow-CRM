export function getApiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.response?.data;
  if (data?.validationErrors) {
    return Object.entries(data.validationErrors)
      .map(([field, message]) => `${field}: ${message}`)
      .join(' · ');
  }
  return data?.message || error?.message || fallback;
}
