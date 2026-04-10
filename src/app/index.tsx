import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    KeyboardAvoidingView, 
    Platform 
  } from 'react-native';
import { Input } from './components/Input';
import { Button } from './components/Button';
  
  export default function Index() {
      return (
          
              <KeyboardAvoidingView 
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  style={{ flex: 1 }}
              >
                  <ScrollView contentContainerStyle={styles.scrollContent}>
                      <View style={styles.container}>
                          <Text style={styles.title}>Entrar</Text>
                          <Text style={styles.subtitle}>Acesse sua conta com E-mail e senha.</Text>
                      </View>
  
                      <View style={styles.form}>
                          <Input placeholder="E-mail" keyboardType='email-address' autoCapitalize="none" />
                          <Input placeholder="Senha" secureTextEntry />
                          <Button label="Entrar" onPress={() => console.log('Login solicitado')} />
                      </View>
                  </ScrollView>
              </KeyboardAvoidingView>
          
      )
  }

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,  
        padding: 24,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        
    },
    form: {
    marginTop: 24,
    gap: 12,    
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
    },
    subtitle: {
        fontSize: 16,
    },
})