import { Text } from 'react-native';
import FormPicker from './FormPicker';
import SelectorMultipleChips from './SelectorMultipleChips';
import {
  opcionesClasificacion,
  accionesInseguras,
  condicionesInseguras,
} from '../utils/opciones';

type Props = {
  clasificacion: string;
  setClasificacion: (value: string) => void;
  accionesSeleccionadas: string[];
  setAccionesSeleccionadas: (items: string[]) => void;
  condicionesSeleccionadas: string[];
  setCondicionesSeleccionadas: (items: string[]) => void;
  expandirAcciones: boolean;
  setExpandirAcciones: (value: boolean) => void;
  expandirCondiciones: boolean;
  setExpandirCondiciones: (value: boolean) => void;
};

export default function SeccionClasificacion({
  clasificacion,
  setClasificacion,
  accionesSeleccionadas,
  setAccionesSeleccionadas,
  condicionesSeleccionadas,
  setCondicionesSeleccionadas,
  expandirAcciones,
  setExpandirAcciones,
  expandirCondiciones,
  setExpandirCondiciones,
}: Props) {
  return (
    <>
      <FormPicker
        label="Clasificación del incidente:"
        selectedValue={clasificacion}
        onValueChange={setClasificacion}
        options={opcionesClasificacion}
      />

      {clasificacion === 'Acción Insegura' && (
        <>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginVertical: 8 }}>
            Acciones Inseguras
          </Text>
          <SelectorMultipleChips
            titulo="Acciones Inseguras del incidente:"
            opciones={accionesInseguras}
            seleccionados={accionesSeleccionadas}
            setSeleccionados={setAccionesSeleccionadas}
            expandido={expandirAcciones}
            setExpandido={setExpandirAcciones}
          />
        </>
      )}

      {clasificacion === 'Condición Insegura' && (
        <>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginVertical: 8 }}>
            Condiciones Inseguras
          </Text>
          <SelectorMultipleChips
            titulo="Condiciones Inseguras del incidente:"
            opciones={condicionesInseguras}
            seleccionados={condicionesSeleccionadas}
            setSeleccionados={setCondicionesSeleccionadas}
            expandido={expandirCondiciones}
            setExpandido={setExpandirCondiciones}
          />
        </>
      )}
    </>
  );
}