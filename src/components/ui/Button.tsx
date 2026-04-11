import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
}
from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
    label: string;
}

export function Button({label, style, ...rest}: ButtonProps){

    return(
        <TouchableOpacity style={[styles.button, style]} {...rest}>
            <Text style={styles.buttonText}>{label}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
})