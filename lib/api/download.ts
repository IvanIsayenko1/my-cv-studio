export const downloadCV = async (cvId: string) => {
  const res = await fetch(`/api/cv/${cvId}/download`);

  if (!res.ok) {
    throw new Error("Failed to download PDF");
  }

  return res.blob();
};
