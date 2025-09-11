import { Button } from 'react-native-paper';
import { View } from 'react-native';

interface Props {
  reporte: any;
  onExportarPDF: () => void;
  onExportarExcel: () => void;
  onEditar?: (id: any) => void;   // 👈 opcionales
  onEliminar?: () => void;        // 👈 opcionales
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
        style={{ backgroundColor: '#08a339', minWidth: 310 }}
        labelStyle={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}
      >
        Exportar Excel
      </Button>

      <Button
        mode="contained"
        onPress={onExportarPDF}
        style={{ backgroundColor: '#a11a1a', minWidth: 310 }}
        labelStyle={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}
      >
        Exportar PDF
      </Button>

      {onEditar && (
        <Button
          mode="contained"
          onPress={() => onEditar(reporte.id)}
          style={{ backgroundColor: '#000', minWidth: 310 }}
          labelStyle={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}
        >
          Editar Reporte
        </Button>
      )}

      {onEliminar && (
        <Button
          mode="contained"
          onPress={onEliminar}
          style={{ backgroundColor: '#a11a1a', minWidth: 310 }}
          labelStyle={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}
        >
          Eliminar Reporte
        </Button>
      )}
    </View>
  );
};