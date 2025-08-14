export const ordenarReportesPorFecha = (reportes: any[]) => {
  return [...reportes]
    .filter((r) => r.fechaReporte)
    .sort((a, b) => {
      const fechaA = rFecha(a.fechaReporte);
      const fechaB = rFecha(b.fechaReporte);
      return fechaA.getTime() - fechaB.getTime(); // ← cambio aquí
    });
};

const rFecha = (f: any): Date => {
  if (f?.toDate) return f.toDate(); // Firestore Timestamp
  if (typeof f === 'string') return new Date(f); // ISO string
  return new Date(f); // fallback
};