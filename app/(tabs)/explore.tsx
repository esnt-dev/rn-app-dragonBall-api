import React, { useState } from "react";
import {
  FlatList,
  RefreshControl,
  View,
  TextInput,
  StyleSheet,
} from "react-native";
import { ErrorState } from "../../components/ErrorState";
import { LoadingState } from "../../components/LoadingState";
import { PlanetCard } from "../../components/PlanetCard";
import { Planet } from "../../src/domain/models/Planet.model";
import { usePlanets } from "../../src/presentation/hooks/usePlanets";
import { globalStyles } from "../../src/presentation/styles/globalStyles";

/**
 * Pantalla de planetas
 */
export default function PlanetsScreen() {
  const { planets, loading, error, loadMore, refresh } = usePlanets();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlanets = planets.filter((planet) =>
    planet.name.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  if (loading && planets.length === 0) {
    return <LoadingState message="Cargando planetas..." />;
  }

  if (error && planets.length === 0) {
    return <ErrorState message={error} />;
  }

  const renderPlanet = ({ item }: { item: Planet }) => (
    <PlanetCard planet={item} />
  );

  return (
    <View style={globalStyles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar planeta..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredPlanets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPlanet}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        contentContainerStyle={globalStyles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});
