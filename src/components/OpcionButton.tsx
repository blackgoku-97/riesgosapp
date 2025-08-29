import { Button } from 'react-native-paper';

export const OpcionButton = ({
  item,
  selected,
  onToggle,
}: {
  item: string;
  selected: boolean;
  onToggle: () => void;
}) => {
  return (
    <Button
      mode={selected ? 'contained' : 'outlined'}
      onPress={onToggle}
      className="my-1"
    >
      {item}
    </Button>
  );
};