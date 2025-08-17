import { ScrollView, SafeAreaView, View, Image, TextInput } from 'react-native';
import { Text, Button, Snackbar } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { useFormularioPlanificacion } from '../hooks/useFormularioPlanificacion';
import { useSubirImagen } from '../hooks/useSubirImagen';
import { useEstilosPantalla } from '../hooks/useEstilosPantalla';

import { validarCamposPlanificacion } from '../utils/validadores';
import { guardarPlanificacion, obtenerNumeroPlanificacion } from '../services/planificacionService';
import { opcionesArea, opcionesAgenteMaterial, opcionesActividad, opcionesProceso, opcionesPeligro, opcionesRiesgo, opcionesMedidas, Area } from '../utils/opcionesPlanificaciones';

import { SelectorMultipleChips } from '../components/SelectorMultipleChips';
import { FormPicker } from '../components/FormPicker';

import * as ImagePicker from 'expo-image-picker';

export default function PlanificacionScreen() {

  const navigation = useNavigation<NavigationProp<any>>();

  const {
    planTrabajo, setPlanTrabajo,
    area, setArea,
    proceso, setProceso,
    actividad, setActividad,
    peligro, setPeligro,
    agenteMaterial, setAgenteMaterial,
    riesgo, setRiesgo,
    medidas, setMedidas,
    imagenLocal, setImagenLocal,
    imagenCloudinaryURL, setImagenCloudinaryURL,
    imagenPublicId, setImagenPublicId,
    imagenDeleteToken, setImagenDeleteToken,
    expandirPeligros, setExpandirPeligros,
    expandirMedidas, setExpandirMedidas,
    alertaVisible, setAlertaVisible,
    alertaMensaje, setAlertaMensaje,
  } = useFormularioPlanificacion();

  const { subirImagen } = useSubirImagen();

  const estilos = useEstilosPantalla();

  const tomarImagenYSubir = async () => {
    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      quality: 0.7,
    });

    if (!resultado.canceled && resultado.assets?.length > 0) {
      const uri = resultado.assets[0].uri;
      setImagenLocal(uri);

      const subida = await subirImagen(uri);
      if (subida) {
        setImagenCloudinaryURL(subida.url);
        setImagenPublicId(subida.publicId);
        setImagenDeleteToken(subida.deleteToken);
      }
    }
  };

  const manejarGuardar = async () => {
    const mensaje = validarCamposPlanificacion({
      planTrabajo,
      area,
      proceso,
      actividad,
      peligro,
      agenteMaterial,
      riesgo,
      medidas,
      imagen: imagenCloudinaryURL
    });
    if (mensaje) {
      setAlertaMensaje(mensaje);
      setAlertaVisible(true);
      return;
    }

    try {
      const numeroPlanificacion = await obtenerNumeroPlanificacion();

      await guardarPlanificacion({
        numeroPlanificacion,
        planTrabajo,
        area,
        proceso,
        actividad,
        peligro,
        agenteMaterial,
        riesgo,
        medidas,
        imagen: imagenCloudinaryURL || '',
        imagenPublicId: imagenPublicId || '',
        imagenDeleteToken: imagenDeleteToken || ''
      });

      setAlertaMensaje(`✅ ${numeroPlanificacion} guardada con éxito`);
      setAlertaVisible(true);
      setTimeout(() => {
        navigation.navigate('Acciones');
      }, 1500);
    } catch (error) {
      console.error('Error al guardar:', error);
      setAlertaMensaje('❌ Error al guardar la planificación');
      setAlertaVisible(true);
    }
  };

  return (
    <SafeAreaView style={estilos.comunes.container}>
      <ScrollView
        contentContainerStyle={estilos.comunes.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        <View style={estilos.planificacion.logoContainer}>
          <Image source={require('../../assets/logo.png')} style={estilos.planificacion.logo} />
        </View>

        <Text style={estilos.planificacion.title}>📋 Crear Planificación Diaria</Text>

        <View style={estilos.planificacion.espaciado}>
          <Text style={estilos.planificacion.label}>Plan de Trabajo:</Text>
          <TextInput
            style={estilos.planificacion.textArea}
            placeholder="Describe el plan de trabajo para esta jornada..."
            value={planTrabajo}
            onChangeText={setPlanTrabajo}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        <FormPicker
          label="Área de Trabajo:"
          selectedValue={area}
          onValueChange={(nuevoArea) => {
            setArea(nuevoArea as Area);
            setPeligro([]);
          }}
          options={opcionesArea}
        />
        <FormPicker label="Proceso:" selectedValue={proceso} onValueChange={setProceso} options={opcionesProceso} />
        <FormPicker label="Actividad:" selectedValue={actividad} onValueChange={setActividad} options={opcionesActividad} />

        <View style={estilos.planificacion.espaciado}>
          <Text style={estilos.planificacion.label}>Peligros:</Text>
          <SelectorMultipleChips
            titulo="Seleccionar peligros:"
            opciones={opcionesPeligro[area] ?? []}
            seleccionados={peligro}
            setSeleccionados={setPeligro}
            expandido={expandirPeligros}
            setExpandido={setExpandirPeligros}
          />
        </View>

        <FormPicker label="Agente Material:" selectedValue={agenteMaterial} onValueChange={setAgenteMaterial} options={opcionesAgenteMaterial} />

        <View style={estilos.planificacion.espaciado}>
          <Text style={estilos.planificacion.label}>Medidas de Control:</Text>
          <SelectorMultipleChips
            titulo="Seleccionar medidas:"
            opciones={opcionesMedidas}
            seleccionados={medidas}
            setSeleccionados={setMedidas}
            expandido={expandirMedidas}
            setExpandido={setExpandirMedidas}
          />
        </View>

        <FormPicker label="Nivel de Riesgo:" selectedValue={riesgo} onValueChange={setRiesgo} options={opcionesRiesgo} />

        <Button mode="outlined" onPress={tomarImagenYSubir} style={estilos.planificacion.captura}>
          📷 Capturar Imagen de la Actividad
        </Button>

        {imagenLocal && (
          <Image source={{ uri: imagenLocal }} style={estilos.planificacion.imagenPreview} />
        )}

        <Button mode="contained" onPress={manejarGuardar} style={estilos.planificacion.button} labelStyle={{ color: 'white' }}>
          💾 Guardar Planificación
        </Button>

        <Snackbar
          visible={alertaVisible}
          onDismiss={() => setAlertaVisible(false)}
          duration={3000}
          style={estilos.comunes.snackbarError}
        >
          {alertaMensaje}
        </Snackbar>

        <SafeAreaView style={estilos.comunes.footerSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}