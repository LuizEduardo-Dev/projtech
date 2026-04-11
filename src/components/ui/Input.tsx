import { TextInput, StyleSheet, TextInputProps } from "react-native";

export function Input({style, ...props}: TextInputProps){

    return(
        <TextInput 
        style={styles.input} 
        placeholder={props.placeholder} 
        {...props}
        />
    )
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#DCDCDC',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        height: 40,
        marginBottom: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        backgroundColor: 'white',
        paddingHorizontal: 10,
    },
})