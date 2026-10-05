import { useCallback, useState } from 'react';

import {
    ActivityIndicator,
    Alert,
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';

import { router, useFocusEffect } from 'expo-router';

import { colors } from '@/theme';

import { ContactCard } from '@/components/ContactCard/ContactCard';
import { Header } from '@/components/Header/Header';
import { Typography } from '@/components/Typography/Typography';

import { useAuth } from '@/contexts/AuthContext';
import { contatoService } from '@/services/supabase/contatoService';
import { Contato } from '@/types/contato';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function EmergenciaScreen() {
    const { usuario } = useAuth();

    const [contatos, setContatos] = useState<Contato[]>([]);
    const [loading, setLoading] = useState(true);

    const carregar = useCallback(async () => {
        if (!usuario?.id) {
            setLoading(false);
            return;
        }

        try {
            setContatos(
                await contatoService.listarPorUsuario(usuario.id)
            );
        } finally {
            setLoading(false);
        }
    }, [usuario?.id]);

    // Recarrega ao voltar da tela "Novo contato"
    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [carregar])
    );

    function ligar(contato: Contato) {
        if (!contato.telefone) {
            Alert.alert(
                'Sem telefone',
                `${contato.nome} não possui telefone cadastrado.`
            );
            return;
        }

        const numero = contato.telefone.replace(/[^\d+]/g, '');

        Linking.openURL(`tel:${numero}`).catch(() =>
            Alert.alert('Erro', 'Não foi possível iniciar a ligação.')
        );
    }

    function confirmarRemocao(contato: Contato) {
        Alert.alert(
            'Remover contato',
            `Deseja remover ${contato.nome}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await contatoService.remover(contato.id);
                            setContatos((atual) =>
                                atual.filter((c) => c.id !== contato.id)
                            );
                        } catch (error) {
                            Alert.alert(
                                'Erro',
                                'Não foi possível remover o contato.'
                            );
                        }
                    },
                },
            ]
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Header
                        title="Emergência"
                        onBack={() => router.back()}
                        titleColor={colors.backgroundLight}
                        fontSize="h2"
                    />

                    <Pressable style={styles.plusButton} onPress={() => router.push('/novo-contato')}>
                        <MaterialCommunityIcons
                            name="plus"
                            size={24}
                            color={colors.backgroundLight}
                        />
                    </Pressable>
                </View>

                <Typography
                    variant="body"
                    color={colors.backgroundLight}
                    style={styles.subtitle}
                >
                    Contatos rápidos
                </Typography>

                <View style={styles.contacts}>
                    {loading ? (
                        <ActivityIndicator color={colors.backgroundLight} />
                    ) : contatos.length === 0 ? (
                        <Typography
                            variant="caption"
                            color={colors.backgroundLight}
                        >
                            Nenhum contato cadastrado. Toque em + para adicionar.
                        </Typography>
                    ) : (
                        contatos.map((contato) => (
                            <ContactCard
                                key={contato.id}
                                name={contato.nome}
                                description={
                                    contato.especialidade ||
                                    contato.telefone ||
                                    'Contato de emergência'
                                }
                                onPress={() => ligar(contato)}
                                onLongPress={() =>
                                    confirmarRemocao(contato)
                                }
                            />
                        ))
                    )}
                </View>

                {contatos.length > 0 && (
                    <Typography
                        variant="caption"
                        color={colors.backgroundLight}
                        style={styles.hint}
                    >
                        Toque para ligar · segure para remover
                    </Typography>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: colors.primary,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        gap: 8,
    },

    plusButton: {
        width: 44,
        height: 44,
        borderRadius: 12,

        backgroundColor: colors.orange,
        alignItems: 'center',
        justifyContent: 'center',
    },

    content: {
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 30,
    },

    subtitle: {
        marginTop: 6,
    },

    contacts: {
        marginTop: 18,

        gap: 14,
    },

    hint: {
        marginTop: 18,
        opacity: 0.8,
    },
});
