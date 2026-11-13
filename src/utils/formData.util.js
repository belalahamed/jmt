export const createFormData = (fields) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }

  return formData;
};

export default createFormData;
