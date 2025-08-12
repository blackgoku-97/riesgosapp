import { View, StyleSheet } from 'react-native';
import { List, Chip, useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

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
      <View style={estilos(theme).chipsContenedor}>
        {opciones.map((item) => {
          const seleccionado = seleccionados.includes(item);
          return (
            <Chip
              key={item}
              selected={seleccionado}
              onPress={() => toggleSeleccion(item)}
              style={[
                estilos(theme).chip,
                seleccionado && estilos(theme).chipSeleccionado,
              ]}
              textStyle={seleccionado ? estilos(theme).chipTextoSeleccionado : undefined}
            >
              {item}
            </Chip>
          );
        })}
      </View>
    </List.Accordion>
  );
};

const estilos = (theme: MD3Theme) =>
  StyleSheet.create({
    chipsContenedor: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      padding: 8,
    },
    chip: {
      margin: 4,
      backgroundColor: theme.colors.surfaceVariant,
    },
    chipSeleccionado: {
      backgroundColor: theme.colors.primary,
    },
    chipTextoSeleccionado: {
      color: theme.colors.onPrimary,
    },
  });