import { TextInput, StyleSheet, TextInputProps } from "react-native";

export function Input({style, ...props}: TextInputProps){

    return(
        <TextInput 
        style={styles.input} 
        placeholder={props.placeholder} 
        textAlignVertical="center"
        multiline={false}
        numberOfLines={1}
        scrollEnabled={false}
        {...props}
        />
    )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 5,
    width: '100%',
    paddingVertical: 8, // Ajuste conforme necessário
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    backgroundColor: 'white',
    includeFontPadding: false, // Evita espaçamento extra interno da fonte
  },
});   