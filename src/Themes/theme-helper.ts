
// Add this to your theme-config.ts file

import { themeDefinitions } from "./theme-config";

// Updated method - outputs as single copyable string
export const generateTailwindColorsConfig = () => {
  const colorKeys = Object.keys(themeDefinitions.light);
  
  const tailwindColors: Record<string, string> = {};
  
  colorKeys.forEach((key) => {
    const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    tailwindColors[key] = `var(--color-${kebabKey})`;
  });
  
  // Build as single string
  let output = 'colors: {\n';
  Object.entries(tailwindColors).forEach(([key, value]) => {
    output += `  ${key}: "${value}",\n`;
  });
  output += '},';
  
  // Console as single string - now copyable!
  console.log(output);
  
  return tailwindColors;
};

