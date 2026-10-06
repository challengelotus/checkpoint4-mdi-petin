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

import { authService } from '@/services/supabase/authService';

const CampoObrigatorio = ({
    label, 
    value, 
    changeText,
    secureText = false,
    keyboardType = 'default',
    autoCap = 'none',
    erro,}) => (
        <View style={styles.inputContainer}>
            <FormInput
                label={label}
                value={value}
                onChangeText={changeText}
                secureTextEntry={secureText}
                keyboardType={keyboardType}
                autoCapitalize={autoCap}
                autoCorrect={false}
            />

            {erro && (
                <Typography
                    variant="caption"
                    color={colors.error}
                >
                    {erro}
                </Typography>
            )}
        </View>
    );

export default function CadastroScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] =
        useState('');

    const [loading, setLoading] = useState(false);
    const [erros, setErros] = useState({});

    const validarCampos = ({nome, email, password, confirmPassword}) => {
        const e = {};

        if (!nome) {
            e.nome = 'Digite seu nome completo.';
        } else if (nome.length < 3) {
            e.nome = 'Digite um nome válido.';
        }

        if (!email) {
            e.email = 'Digite seu e-mail.';
        } else if (!isEmailValido(email)) {
            e.email = 'Digite um e-mail válido.';
        }

        if (!password) {
            e.password = 'Digite uma senha.';
        } else if (password.length < 6) {
            e.password = 'A senha deve possuir pelo menos 6 caracteres.';
        }

        if (!confirmPassword) {
            e.confirmPassword = 'Confirme sua senha.';
        } else if (password !== confirmPassword) {
            e.confirmPassword = 'As senhas não coincidem.';
        }

        setErros(e);
        return Object.keys(e).length === 0;
    };

    async function handleCadastro() {
        // Remove espaços desnecessários
        const nome = name.trim();
        const emailNormalizado =
            email.trim().toLowerCase();

        if (!validarCampos({nome, email: emailNormalizado, password, confirmPassword})) {
            return;
        }

        try {
            setLoading(true);

            const resposta =
                await authService.cadastrar({
                    nome,
                    email: emailNormalizado,
                    senha: password,
                });

            /*
             * Quando a confirmação de e-mail do
             * Supabase está desativada, o cadastro
             * já cria uma sessão.
             */
            if (resposta.token) {
                Alert.alert(
                    'Conta criada!',
                    `Bem-vindo ao Petin, ${resposta.usuario.nome}!`,
                    [
                        {
                            text: 'Continuar',
                            onPress: () =>
                                router.replace(
                                    '/(tabs)/home'
                                ),
                        },
                    ]
                );

                return;
            }

            /*
             * Quando a confirmação de e-mail está
             * ativada, o Supabase cria o usuário,
             * mas não cria uma sessão imediatamente.
             */
            Alert.alert(
                'Conta criada!',
                'Enviamos um e-mail de confirmação. Confirme seu endereço de e-mail para entrar no Petin.',
                [
                    {
                        text: 'Ir para o login',
                        onPress: () =>
                            router.replace(
                                '/(auth)/login'
                            ),
                    },
                ]
            );
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Não foi possível criar sua conta.';

            Alert.alert(
                'Erro ao criar conta',
                traduzirErroCadastro(message)
            );
        } finally {
            setLoading(false);
        }
    }

    function isEmailValido(value: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            value
        );
    }

    function traduzirErroCadastro(message: string) {
        const mensagem = message.toLowerCase();

        if (
            mensagem.includes('already registered') ||
            mensagem.includes('user already registered')
        ) {
            setErros({ ...erros, email: 'E-mail já cadastrado.' });
            return 'Este e-mail já está cadastrado.';
        }

        if (mensagem.includes('password')) {
            return 'A senha informada não atende aos requisitos.';
        }

        if (mensagem.includes('email')) {
            return 'Verifique o e-mail informado.';
        }

        return message;
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
                    Vamos começar!
                </Typography>

                <Typography
                    variant="body"
                    color={colors.backgroundLight}
                >
                    Crie sua conta gratuita
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
                    <CampoObrigatorio
                        label="Nome completo"
                        value={name}
                        changeText={setName}
                        autoCap="words"
                        erro={erros.nome}
                    />

                    <CampoObrigatorio
                        label="E-mail"
                        value={email}
                        changeText={setEmail}
                        keyboardType="email-address"
                        erro={erros.email}
                    />

                    <CampoObrigatorio
                        label="Senha"
                        value={password}
                        changeText={setPassword}
                        secureText={true}
                        erro={erros.password}
                    />

                    <CampoObrigatorio
                        label="Confirmar senha"
                        value={confirmPassword}
                        changeText={setConfirmPassword}
                        secureText={true}
                        erro={erros.confirmPassword}
                    />

                    <Button
                        title="Criar conta"
                        onPress={handleCadastro}
                        loading={loading}
                    />

                    <View style={styles.loginContainer}>
                        <Typography
                            variant="caption"
                            color={colors.brown}
                        >
                            Já tem conta?
                        </Typography>

                        <Pressable
                            disabled={loading}
                            onPress={() =>
                                router.push(
                                    '/(auth)/login'
                                )
                            }
                        >
                            <Typography
                                variant="captionMedium"
                                color={colors.primary}
                            >
                                {' '}
                                Entrar
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

        gap: 18,
    },

    inputContainer: {
        gap: 10,
    },

    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',

        marginTop: -8,
    },
});