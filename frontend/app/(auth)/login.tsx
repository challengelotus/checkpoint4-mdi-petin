import { useState } from 'react';

import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';

import { router } from 'expo-router';

import { colors } from '@/theme';

import { PawIcon } from '@/components/PawIcon/PawIcon';
import { Typography } from '@/components/Typography/Typography';
import { FormInput } from '@/components/FormInput/FormInput';
import { Button } from '@/components/Button/Button';

import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        if (!email.trim()) {
            Alert.alert(
                'Atenção',
                'Digite seu e-mail.'
            );

            return;
        }

        if (!password) {
            Alert.alert(
                'Atenção',
                'Digite sua senha.'
            );

            return;
        }

        try {
            setLoading(true);

            await login(
                email.trim(),
                password
            );

            router.replace('/(tabs)/home');
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Não foi possível realizar o login.';

            Alert.alert(
                'Erro ao entrar',
                message
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <PawIcon
                    size={38}
                    color={colors.backgroundLight}
                />

                <Typography
                    variant="h2"
                    color={colors.backgroundLight}
                    style={styles.title}
                >
                    Olá!
                </Typography>

                <Typography
                    variant="body"
                    color={colors.backgroundLight}
                >
                    Entre para cuidar do seu pet
                </Typography>
            </View>

            <KeyboardAvoidingView
                style={styles.contentWrapper}
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : undefined
                }
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <FormInput
                        label="E-mail"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <FormInput
                        label="Senha"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <Button
                        title="Entrar"
                        onPress={handleLogin}
                        loading={loading}
                    />

                    <View
                        style={styles.registerContainer}
                    >
                        <Typography
                            variant="caption"
                            color={colors.brown}
                        >
                            Ainda não tem conta?
                        </Typography>

                        <Pressable
                            disabled={loading}
                            onPress={() =>
                                router.push(
                                    '/(auth)/cadastro'
                                )
                            }
                        >
                            <Typography
                                variant="captionMedium"
                                color={colors.primary}
                            >
                                {' '}
                                Cadastre-se
                            </Typography>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },

    header: {
        paddingTop: 36,
        paddingHorizontal: 16,
    },

    title: {
        marginTop: 8,
        marginBottom: 8,
    },

    contentWrapper: {
        flex: 1,

        marginTop: 20,

        backgroundColor: colors.background,

        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
    },

    content: {
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 30,

        gap: 20,
    },

    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',

        marginTop: -10,
    },
});