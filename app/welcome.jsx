import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Button from "../components/Button";
import { useRouter } from "expo-router";





const Welcome = () => {
    const router = useRouter(); 
    return (
        <ScreenWrapper bg='white'>
            <StatusBar style="dark"/>
                <View style={styles.container}>
                    {/*imagen*/}
                    <Image style={styles.welcomeImage} resizeMode='contain' source={require("../imagenes/welcome.png")} />

                    <View style={{gap:20}}>
                        <Text style={styles.title}>NASHEE!</Text>
                        <Text style={styles.puchline}>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odio natus quam eaque, facere sunt
                        </Text>
                    </View>

                    {/* footer */}
                    <View style={styles.footer}>
                        <Button
                        title = "Comenzar"
                        buttonStyle={{marginHorizontal: wp(3)}}
                        onPress={() => router.push('signUp') }

                        />
                        <View style={styles.bottoTextContainer}>
                            <Text style={styles.loginText}>
                                Si ya tiene una cuenta entonces
                            </Text>
                            <Pressable onPress={()=>router.push('login')}>
                                <Text style={[styles.loginText, {color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold}]}>
                                    Iniciar Sesion
                                </Text>
                            </Pressable>
                        </View>

                    </View>

                </View>

                

        </ScreenWrapper>
    );
}
export default Welcome;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: 'white',
        paddingHorizontal: wp(4)
    },

    welcomeImage: {
        width: wp(90),
        height: wp(60),
        alignContent: "center",

    },

    title: {
        color: theme.colors.text,
        fontSize: hp(4),
        textAlign: "center",
        fontWeight: theme.fonts.extraBold,
    },

    punch: {
        textAlign: "center",
        paddingHorizontal: wp(10),
        fontSize: hp(1.7),
        color: theme.colors.text,
    },

    footer: {
        gap: 30,
        width: '100%',
    },

    bottoTextContainer: {
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
        gap: 5,
    },

    loginText:{
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(1.6),
    }

})