import { Button } from 'react-native-paper';
import { View } from 'react-native';

interface Props {
  reporte: any;
  onExportarPDF: () => void;
  onExportarExcel: () => void;
  onEditar: (id: any) => void;
  onEliminar: () => void;
}

export const ReporteAcciones: React.FC<Props> = ({
  reporte,
  onExportarPDF,
  onExportarExcel,
  onEditar,
  onEliminar,
}) => {
  return (
    <View className="flex-row flex-wrap justify-between gap-2">
      <Button
        mode="contained"
        onPress={onExportarExcel}
        className="bg-green-700 rounded-md"
        labelStyle={{ color: 'white', fontWeight: 'bold' }}
      >
        Exportar Excel
      </Button>

      <Button
        mode="contained"
        onPress={onExportarPDF}
        className="bg-red-700 rounded-md"
        labelStyle={{ color: 'white', fontWeight: 'bold' }}
      >
        Exportar PDF
      </Button>

      <Button
        mode="contained"
        onPress={() => onEditar(reporte.id)}
        className="bg-blue-700 rounded-md"
        labelStyle={{ color: 'white', fontWeight: 'bold' }}
      >
        Editar Reporte
      </Button>

      <Button
        mode="contained"
        onPress={onEliminar}
        className="bg-neutral-800 rounded-md"
        labelStyle={{ color: 'white', fontWeight: 'bold' }}
      >
        Eliminar Reporte
      </Button>
    </View>
  );
};