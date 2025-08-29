import { cssInterop } from 'nativewind';
import { Button, Card, Chip, Text, TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

cssInterop(Text, { className: 'style', style: 'style' });
cssInterop(TextInput, { className: 'style', style: 'style' });
cssInterop(Picker, { className: 'style', style: 'style' });
cssInterop(Button, { className: 'style', style: 'style' });
cssInterop(Card, { className: 'style', style: 'style' });
cssInterop(Chip, { className: 'style', style: 'style', textStyle: 'textStyle' });