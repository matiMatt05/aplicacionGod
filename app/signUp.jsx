import { StyleSheet, Text, View, Pressable, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { theme } from '../constants/theme'
import Icon from '../assets/icons'
import { StatusBar } from 'expo-status-bar'
import BackButton from '../components/BackButton'
import { useRouter } from 'expo-router'
import { hp, wp } from "../helpers/common";
//import { Button, TextInput } from 'react-native-web'
//import Input from '../components/Input'
import Button from '../components/Button'
import Input from '../components/Input'
import { supabase } from '../lib/supabase'


const signUp = () => {
    const router = useRouter();
    const emailRef = useRef("");
    const nameRef = useRef("");
    const passwordRef = useRef("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        if(!emailRef.current || !passwordRef.current){
            Alert.alert('Registrarse', 'Porfavor complete todos los campos');
            return;
        }

        let name = nameRef.current.trim();
        let email = emailRef.current.trim();
        let password = passwordRef.current.trim();

        setLoading(true);
        const {data: {session}, error} = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name
                }
            }
        })
        setLoading(false);

        console.log('session: ', session);
        console.log('error: ', error);
        if (error){
            Alert.alert('Error al registrarse', error.message);
            setLoading(false);
            return;
        }
        

    }

    return (
        <ScreenWrapper bg="white">
            <StatusBar style="dark" /> 
            <View style={styles.conteiner}>
                <BackButton router={router}  />

                {/* welcome */}
                <View>
                    <Text style={styles.welcomeText}>Perfecto,</Text>
                    <Text style={styles.welcomeText}>Iniciemos de una vez...</Text>
                </View>

                {/* form */}
                <View style={styles.form}>
                    <Text style={{fontSize: hp(1.5), color: theme.colors.text}}>
                        Complete los siguiente campos con sus datos...
                    </Text>

                    <Input
                        icon={<Icon name="user" size={26} strokeWidth={1.6} />}
                        placeholder="Ingrese su nombre"
                        onChangeText={value=> emailRef.current = value}
                    />


                    <Input
                        icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
                        placeholder="Correo electronico"
                        onChangeText={value=> emailRef.current = value}
                    />

                    <Input
                        icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
                        placeholder="Contraseña"
                        secureTextEntry
                        onChangeText={value=> passwordRef.current = value}
                    />
                    

                    {/* button */}
                    <Button title={'Registrarse'} loading={loading} onPress={onSubmit} />

                </View>

                {/* footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Si ya tiene una cuenta
                    </Text>
                    <Pressable onPress={()=> router.push('login')}>
                        <Text style={[styles.footerText, {color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold}]} >Iniciar sesion</Text>
                    </Pressable>
                </View>

            </View>
        </ScreenWrapper>
    )
}

export default signUp

const styles = StyleSheet.create({
    conteiner: {
        flex: 1,
        gap: 45,
        paddingHorizontal: wp(5),
    },

    welcomeText: {
        fontSize: hp(4),
        fontWeight: theme.fonts.bold,
        color: theme.colors.text,
    },

    form: {
        gap: 25,
    },

    forgotPassword: {
        textAlign: "right",
        fontWeight: theme.fonts.semibold,
        color: theme.colors.text,
    },

    footer:{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
    },

    footerText: {
        textAlign: "center",
        color: theme.colors.text,
        fontSize: hp(1.6),
    },

})