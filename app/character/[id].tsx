import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { Image } from "expo-image";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import { Transformation } from "../../src/domain/models/Transformation.model";
import { useCharacterDetail } from "../../src/presentation/hooks/useCharacterDetail";
import { globalStyles } from "../../src/presentation/styles/globalStyles";

/**
 * Pantalla de detalle de personaje
 */
export default function CharacterDetailScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const characterId = id ? parseInt(id, 10) : NaN;

  const { character, transformations, loading, error } =
    useCharacterDetail(characterId);

  // ✅ Actualizar el título del header dinámicamente
  useEffect(() => {
    if (character) {
      navigation.setOptions({
        title: character.name,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#0f1c3f",
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerBackTitleVisible: false,
      });
    }
  }, [character]);

  // Validación del ID después de llamar a TODOS los hooks
  if (isNaN(characterId)) return <ErrorState message="ID de personaje inválido" />;

  if (loading) return <LoadingState message="Cargando detalles..." />;

  if (error || !character)
    return <ErrorState message={error || "Personaje no encontrado"} />;

  // Renderizar tarjeta de transformación
  const renderTransformation = ({ item }: { item: Transformation }) => (
    <View style={globalStyles.transformationCard}>
      <Image
        source={{ uri: item.image }}
        style={globalStyles.transformationImage}
        contentFit="contain"
      />
      <View style={globalStyles.transformationInfo}>
        <Text style={globalStyles.transformationName}>{item.name}</Text>
        <Text style={globalStyles.transformationKi}>Ki: {item.ki}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={globalStyles.detailContainer}>
      {/* Header con imagen y nombre */}
      <View style={globalStyles.detailHeader}>
        <Image
          source={{ uri: character.image }}
          style={globalStyles.detailImage}
          contentFit="contain"
          transition={300}
        />
        <Text style={globalStyles.detailName}>{character.name}</Text>
        <Text style={globalStyles.detailRace}>{character.race}</Text>
      </View>

      {/* Contenido principal */}
      <View style={globalStyles.detailContent}>
        {/* Información */}
        <Text style={globalStyles.sectionTitle}>Información</Text>

        <View style={globalStyles.infoRow}>
          <Text style={globalStyles.infoLabel}>Género:</Text>
          <Text style={globalStyles.infoValue}>{character.gender}</Text>
        </View>

        <View style={globalStyles.infoRow}>
          <Text style={globalStyles.infoLabel}>Ki Base:</Text>
          <Text style={globalStyles.infoValue}>{character.ki}</Text>
        </View>

        <View style={globalStyles.infoRow}>
          <Text style={globalStyles.infoLabel}>Ki Máximo:</Text>
          <Text style={globalStyles.infoValue}>{character.maxKi}</Text>
        </View>

        <View style={globalStyles.infoRow}>
          <Text style={globalStyles.infoLabel}>Afiliación:</Text>
          <Text style={globalStyles.infoValue}>{character.affiliation}</Text>
        </View>

        {/* Descripción */}
        <Text style={globalStyles.sectionTitle}>Descripción</Text>
        <Text style={globalStyles.description}>{character.description}</Text>

        {/* Transformaciones */}
        {transformations.length > 0 && (
          <>
            <Text style={globalStyles.sectionTitle}>
              Transformaciones ({transformations.length})
            </Text>
            <FlatList
              data={transformations}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderTransformation}
              scrollEnabled={false}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
}
