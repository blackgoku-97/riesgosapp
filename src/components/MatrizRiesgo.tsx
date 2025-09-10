import { View, Text } from 'react-native';

export function MatrizRiesgo() {
  return (
    <View className="mt-3 p-3 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
      <Text className="font-semibold text-institucional-negro mb-2">
        Matriz 5×5 (Referencia)
      </Text>
      <Text className="text-neutral-700 dark:text-neutral-300 mb-1">
        Riesgo = Frecuencia × Severidad
      </Text>
      <Text className="text-neutral-700 dark:text-neutral-300">
        Si el producto es mayor a 6: <Text className="font-bold">Aceptable</Text>
      </Text>
      <Text className="text-neutral-700 dark:text-neutral-300">
        Si es 6 o menor: <Text className="font-bold">No Aceptable</Text>
      </Text>
    </View>
  );
}