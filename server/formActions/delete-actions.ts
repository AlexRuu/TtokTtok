import toast from "react-hot-toast";

const toastError = (path: string) => {
  return toast.error(`There was an error deleting ${path}.`, {
    style: {
      background: "#ffeef0",
      color: "#943c5e",
      borderRadius: "10px",
      padding: "12px 18px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.08)",
      fontSize: "16px",
    },
    className: "transition-all transform duration-300 ease-in-out font-medium",
  });
};

const deleteItem = async (path: string, id: string) => {
  const URL = `/api/${path}/${id}`;
  const res = await fetch(URL, { method: "DELETE" });
  if (!res.ok) {
    toastError(path);
    return;
  }
};

export { deleteItem };
