import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'; 
import { useFormStore } from '../store/useFormStore';
import { FormRenderer } from '../components/form-renderer/FormRenderer';

export default function TestarFormulario() {
    const router = useRouter();
     const { formId } = useLocalSearchParams<{ formId: string }>(); 
    
     const { publishedForms } = useFormStore();

     const formAtual = publishedForms.find((form) => form.id === formId);

    const handleEnviarAuditoria = (respostas: Record<string, any>) => {
         console.log("=== JSON DA AUDITORIA ===", respostas);
        
        Alert.alert(
            "Auditoria Finalizada!", 
            "Os dados foram salvos com sucesso.",
            [
                { text: "OK", onPress: () => router.replace('/') } // Volta pra home ao terminar!
            ]
        );
    };

     if (!formAtual) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>Formulário não encontrado</Text>
                <Text style={styles.emptySubtitle}>
                    Selecione um formulário válido na Visão Geral.
                </Text>
                <Text 
                    style={{ color: 'blue', marginTop: 20 }} 
                    onPress={() => router.replace('/')}
                >
                    Voltar para Dashboard
                </Text>
            </View>
        );
    }

     return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.headerText}>Preenchendo: {formAtual.title}</Text>
            
            <FormRenderer 
                title={formAtual.title} 
                fields={formAtual.fields} 
                onSubmit={handleEnviarAuditoria} 
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 24,
        backgroundColor: '#F3F4F6',
    },
    headerText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#6B7280',
        textTransform: 'uppercase',
        marginBottom: 16,
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#F3F4F6',
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
    }
});