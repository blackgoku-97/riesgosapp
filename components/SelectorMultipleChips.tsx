import { View, StyleSheet } from 'react-native';
import { List, Chip } from 'react-native-paper';

interface SelectorMultipleChipsProps {
  titulo: string;
  opciones: string[];
  seleccionados: string[];
  setSeleccionados: (items: string[]) => void;
  expandido: boolean;
  setExpandido: (value: boolean) => void;
}

export default function SelectorMultipleChips({
  titulo,
  opciones,
  seleccionados,
  setSeleccionados,
  expandido,
  setExpandido,
}: SelectorMultipleChipsProps) {
  const toggleSeleccion = (item: string) => {
    if (seleccionados.includes(item)) {
      setSeleccionados(seleccionados.filter((m) => m !== item));
    } else {
      setSeleccionados([...seleccionados, item]);
    }
  };

  return (
    <List.Accordion
      title={titulo}
      expanded={expandido}
      onPress={() => setExpandido(!expandido)}
    >
      <View style={estilos.chipsContenedor}>
        {opciones.map((item) => (
          <Chip
            key={item}
            selected={seleccionados.includes(item)}
            onPress={() => toggleSeleccion(item)}
            style={estilos.chip}
          >
            {item}
          </Chip>
        ))}
      </View>
    </List.Accordion>
  );
}

const estilos = StyleSheet.create({
  chipsContenedor: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    padding: 8,
  },
  chip: {
    margin: 4,
  },
});