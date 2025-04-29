export const generateInitials = (name: string): string => {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    const word = words[0];
    return word.length > 1 
      ? `${word[0].toUpperCase()}${word[word.length - 1].toUpperCase()}` 
      : word[0].toUpperCase();
  }
  return words.map(word => word[0].toUpperCase()).join('').slice(0, 2);
}; 