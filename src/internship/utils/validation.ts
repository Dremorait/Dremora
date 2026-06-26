export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input.trim().replace(/\s+/g, ' '); // Normalize spaces
};

export const isValidInternId = (id: string): boolean => {
  // Example format: DRM-INT-2026-001
  // We'll just check if it's not empty and reasonable length to prevent basic attacks
  return id.length >= 5 && id.length <= 50;
};

export const isValidName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 150;
};
