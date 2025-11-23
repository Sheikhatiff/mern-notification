export const formatdate = (newDate) => {
  const date = newDate ? new Date(newDate) : new Date();
  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return date.toLocaleString("en-US", { ...defaultOptions });
};
