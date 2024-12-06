export const calculateSpeed = (level: number): number => {
  return Math.max(1000 - level * 100, 200); // Minimum speed is 200ms
};
