import { Button, Card } from 'react-native-paper';

interface Props {
  planificacion: any;
  onExportarPDF: () => void;
  onExportarExcel: () => void;
  onEditar?: (id: any) => void;   // 👈 ahora opcionales
  onEliminar?: () => void;        // 👈 ahora opcionales
}

export const PlanificacionAcciones: React.FC<Props> = ({
  planificacion,
  onExportarPDF,
  onExportarExcel,
  onEditar,
  onEliminar,
}) => {
  return (
    <Card.Actions className="flex-row flex-wrap gap-2 justify-start pb-2">
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
          onPress={() => onEditar(planificacion.id)}
          style={{ backgroundColor: '#000', minWidth: 310 }}
          labelStyle={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}
        >
          Editar Planificación
        </Button>
      )}

      {onEliminar && (
        <Button
          mode="contained"
          onPress={onEliminar}
          style={{ backgroundColor: '#a11a1a', minWidth: 310 }}
          labelStyle={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}
        >
          Eliminar Planificación
        </Button>
      )}
    </Card.Actions>
  );
};