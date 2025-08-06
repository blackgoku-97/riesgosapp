export const convertirImagenDesdeURL = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string); // ← Mantiene el encabezado
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
  return base64; // ← ¡No hagas replace aquí!
};