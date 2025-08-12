import { Button, Card } from 'react-native-paper';
import { useEstilosPantalla } from '../hooks/useEstilosPantalla';

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
  const estilos = useEstilosPantalla();

  return (
    <Card.Actions style={estilos.historialReportes.actions}>
      <Button
        mode="contained"
        onPress={onExportarExcel}
        style={estilos.botones.excel.container}
        labelStyle={estilos.botones.excel.label}
      >
        Exportar Excel
      </Button>
      <Button
        mode="contained"
        onPress={onExportarPDF}
        style={estilos.botones.pdf.container}
        labelStyle={estilos.botones.pdf.label}
      >
        Exportar PDF
      </Button>
      <Button
        mode="contained"
        onPress={() => onEditar(reporte.id)}
        style={estilos.botones.editar.container}
        labelStyle={estilos.botones.editar.label}
      >
        Editar Reporte
      </Button>
      <Button
        mode="contained"
        onPress={onEliminar}
        style={estilos.botones.eliminar.container}
        labelStyle={estilos.botones.eliminar.label}
      >
        Eliminar Reporte
      </Button>
    </Card.Actions>
  );
};