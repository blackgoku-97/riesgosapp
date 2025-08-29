import { Button, Card } from 'react-native-paper';

interface Props {
  planificacion: any;
  onExportarPDF: () => void;
  onExportarExcel: () => void;
  onEditar: (id: any) => void;
  onEliminar: () => void;
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
        className="min-w-[140px] flex-grow bg-[#08a339]"
        labelStyle={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}
      >
        Exportar Excel
      </Button>

      <Button
        mode="contained"
        onPress={onExportarPDF}
        className="min-w-[140px] flex-grow bg-[#a11a1a]"
        labelStyle={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}
      >
        Exportar PDF
      </Button>

      <Button
        mode="contained"
        onPress={() => onEditar(planificacion.id)}
        className="min-w-[140px] flex-grow bg-black"
        labelStyle={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}
      >
        Editar Planificación
      </Button>

      <Button
        mode="contained"
        onPress={onEliminar}
        className="min-w-[140px] flex-grow bg-institucional-rojo"
        labelStyle={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}
      >
        Eliminar Planificación
      </Button>
    </Card.Actions>
  );
};