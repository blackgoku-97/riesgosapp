import { cssInterop } from 'nativewind';
import { Button, Text, TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

cssInterop(Text, { className: 'style', style: 'style' });
cssInterop(TextInput, { className: 'style', style: 'style' });
cssInterop(Picker, { className: 'style', style: 'style' });
cssInterop(Button, { className: 'style', style: 'style' });