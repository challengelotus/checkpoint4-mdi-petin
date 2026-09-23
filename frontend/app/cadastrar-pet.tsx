import { useState } from 'react';

import {
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';

import { router } from 'expo-router';

import { colors } from '@/theme';

import { Header } from '@/components/Header/Header';
import { FormInput } from '@/components/FormInput/FormInput';
import { SpeciesSelector } from '@/components/SpeciesSelector/SpeciesSelector';
import { Button } from '@/components/Button/Button';

import type {
    Species,
} from '@/components/SpeciesSelector/SpeciesSelector';

export default function CadastrarPetScreen() {
    const [name, setName] = useState('');
    const [species, setSpecies] =
        useState<Species>('cachorro');
    const [otherSpecies, setOtherSpecies] =
        useState('');
    const [breed, setBreed] = useState('');

    function handleCadastro() {
        router.replace('/(tabs)/home');
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Header
                    title="Novo pet"
                    onBack={() => router.back()}
                />

                <View style={styles.form}>
                    <FormInput
                        label="Nome"
                        value={name}
                        onChangeText={setName}
                    />

                    <View style={styles.field}>
                        <FormInput
                            label="Espécie"
                            value=""
                            editable={false}
                        />

                        <SpeciesSelector
                            value={species}
                            onChange={setSpecies}
                        />
                    </View>

                    <FormInput
                        label="Outro"
                        value={otherSpecies}
                        onChangeText={setOtherSpecies}
                    />

                    <FormInput
                        label="Raça"
                        value={breed}
                        onChangeText={setBreed}
                    />

                    <Button
                        title="Cadastrar pet"
                        onPress={handleCadastro}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: colors.background,
    },

    content: {
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 32,
    },

    form: {
        marginTop: 20,

        gap: 18,
    },

    field: {
        gap: 8,
    },
});