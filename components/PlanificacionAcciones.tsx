import React from 'react';
import { StyleSheet } from 'react-native';
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
    <Card.Actions style={styles.actions}>
      <Button
        mode="contained"
        onPress={onExportarExcel}
        style={[styles.actionButton, { backgroundColor: '#08a339' }]}
      >
        Exportar Excel
      </Button>
      <Button
        mode="contained"
        onPress={onExportarPDF}
        style={[styles.actionButton, { backgroundColor: '#a11a1a' }]}
        labelStyle={styles.label}
      >
        Exportar PDF
      </Button>
      <Button
        mode="contained"
        onPress={() => onEditar(planificacion.id)}
        style={[styles.actionButton, { backgroundColor: '#000' }]}
      >
        Editar Planificacion
      </Button>
      <Button
        mode="contained"
        onPress={onEliminar}
        style={[styles.actionButton, { backgroundColor: '#D32F2F' }]}
      >
        Eliminar Planificacion
      </Button>
    </Card.Actions>
  );
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-start',
    paddingBottom: 8,
  },
  actionButton: {
    minWidth: 140,
    flexGrow: 1,
  },
  label: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});