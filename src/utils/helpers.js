export const getStatusColor = (status) => {
  switch (status) {
    case "green":
      return "bg-green-500";
    case "yellow":
      return "bg-yellow-500";
    case "red":
      return "bg-red-400";
    default:
      return "bg-gray-400";
  }
};
