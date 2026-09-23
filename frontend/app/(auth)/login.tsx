import { useState } from 'react';

import {
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

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleLogin() {
        router.replace('/(tabs)/home');
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
                    />

                    <View style={styles.registerContainer}>
                        <Typography
                            variant="caption"
                            color={colors.brown}
                        >
                            Ainda não tem conta?
                        </Typography>

                        <Pressable
                            onPress={() =>
                                router.push('/(auth)/cadastro')
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