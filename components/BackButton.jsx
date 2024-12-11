import { View, Text, Pressable, StyleSheet} from 'react-native'
import React from 'react'
import Icon from '../assets/icons'
import { theme } from '../constants/theme'
import { ImageBackground } from 'react-native-web'


const BackButton = ({size=26, router}) => {
    return (
        <Pressable onPress={()=> router.back()} style={styles.button} >
            <Icon name="arrowLeft" strokeWidth={2.5} size={size} color={theme.colors.text} />
        </Pressable>
    )
}

export default BackButton

const styles = StyleSheet.create({
    button: {
        alignSelf:'flex-start',
        padding: 5,
        borderRadius:theme.radius.sm,
        ImageBackground: 'rgba(0,0,0,0.07)'

    },
})