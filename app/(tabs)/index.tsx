import React, { useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  View,
  TextInput,
  StyleSheet,
} from "react-native";
import { CharacterCard } from "../../components/CharacterCard";
import { ErrorState } from "../../components/ErrorState";
import { LoadingState } from "../../components/LoadingState";
import { Character } from "../../src/domain/models/Character.model";
import { useCharacters } from "../../src/presentation/hooks/useCharacters";
import { globalStyles } from "../../src/presentation/styles/globalStyles";

export default function CharactersScreen() {
  const { characters, loading, error, loadMore, refresh } = useCharacters();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCharacters = characters.filter((character) =>
    character.name.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  if (loading && characters.length === 0) {
    return <LoadingState message="Cargando personajes..." />;
  }

  if (error && characters.length === 0) {
    return <ErrorState message={error} />;
  }

  const renderCharacter = ({ item }: { item: Character }) => (
    <CharacterCard character={item} />
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={globalStyles.footerLoader}>
        <Text>Cargando más personajes...</Text>
      </View>
    );
  };

  return (
    <View style={globalStyles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar personaje..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredCharacters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCharacter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
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
