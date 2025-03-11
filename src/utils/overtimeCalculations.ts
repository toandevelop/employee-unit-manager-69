
/**
 * Calculate the number of hours between start and end time
 * @param startTime - Format: "HH:MM"
 * @param endTime - Format: "HH:MM"
 * @returns Number of hours
 */
export const calculateHoursFromTimes = (startTime: string, endTime: string): number => {
  const startParts = startTime.split(':');
  const endParts = endTime.split(':');
  const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
  const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
  const diffMinutes = endMinutes - startMinutes;
  return diffMinutes / 60;
};
