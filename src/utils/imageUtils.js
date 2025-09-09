/**
 * Generate a data URI for a placeholder image with initials
 * @param {string} initials - The initials to display
 * @param {number} size - The size of the square image
 * @param {string} bgColor - Background color (hex without #)
 * @param {string} textColor - Text color (hex without #)
 * @returns {string} Data URI for the generated image
 */
export const generatePlaceholderImage = (initials, size = 64, bgColor = 'cccccc', textColor = '666666') => {
  // Create SVG for the placeholder
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#${bgColor}"/>
      <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" 
            fill="#${textColor}" font-family="Arial, sans-serif" 
            font-size="${Math.floor(size * 0.4)}" font-weight="bold">
        ${initials}
      </text>
    </svg>
  `;
  
  // Convert SVG to data URI
  const dataUri = `data:image/svg+xml;base64,${btoa(svg)}`;
  return dataUri;
};

/**
 * Get initials from a full name
 * @param {string} name - Full name
 * @returns {string} Initials (max 2 characters)
 */
export const getInitials = (name) => {
  if (!name || name.trim() === '') return '??';
  return name.split(' ')
    .map(n => n.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};