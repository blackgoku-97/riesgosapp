import { View } from 'react-native';
import { List, Chip, useTheme } from 'react-native-paper';

interface SelectorMultipleChipsProps {
  titulo: string;
  opciones: string[];
  seleccionados: string[];
  setSeleccionados: (items: string[]) => void;
  expandido: boolean;
  setExpandido: (value: boolean) => void;
}

export const SelectorMultipleChips = ({
  titulo,
  opciones,
  seleccionados,
  setSeleccionados,
  expandido,
  setExpandido,
}: SelectorMultipleChipsProps) => {
  const theme = useTheme();

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
      <View className="flex-row flex-wrap gap-2 px-2 py-2">
        {opciones.map((item) => {
          const seleccionado = seleccionados.includes(item);
          return (
            <Chip
              key={item}
              selected={seleccionado}
              onPress={() => toggleSeleccion(item)}
              className={`mx-1 ${
                seleccionado
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-variant text-on-surface'
              }`}
            >
              {item}
            </Chip>
          );
        })}
      </View>
    </List.Accordion>
  );
};