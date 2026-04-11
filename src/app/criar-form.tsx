import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useFormStore, FieldType } from '../store/useFormStore';
import { useRouter } from 'expo-router';

export default function CriarFormulario() {

    const labelLegivel: Record<FieldType, string> = {
        text: 'Resposta em texto',
        number: 'Valor númerico',
        boolean: 'Pergunta Sim/Não',
        image: 'Anexo de Imagem',
        date: 'Data'
    }
    
    const { fields, title, setTitle, addField, removeField, updateField, publishForm } = useFormStore();
    const router = useRouter();

    const handleAddField = (type: FieldType) => {
        addField(type);
    };

    const handleSalvar = () => {
        // 1. Validação Visual: Avisamos o usuário se faltar algo
        if (!title.trim()) {
            Alert.alert('Atenção', 'Você precisa dar um nome para o formulário antes de salvar.');
            return;
        }

        if (fields.length === 0) {
            Alert.alert('Atenção', 'Adicione pelo menos uma pergunta ao formulário.');
            return;
        }

        // 2. Salva no estado global e limpa o rascunho
        publishForm();
        
        // 3. Volta para a raiz (A Dashboard)
        router.replace('/'); 
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Cabeçalho do Formulário */}
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>Configuração Geral</Text>
                <Input
                    placeholder="Nome do Formulário (Ex: Estoque Farmácia)"
                    value={title}
                    onChangeText={setTitle}
                />
            </View>

            {/* Painel de Adicionar Perguntas */}
            <View style={styles.actionsContainer}>
                <Text style={styles.sectionTitle}>Adicionar Campo</Text>
                <View style={styles.buttonRow}>
                    <Button label="+ Texto" onPress={() => handleAddField('text')} style={styles.actionBtn} />
                    <Button label="+ Número" onPress={() => handleAddField('number')} style={styles.actionBtn} />
                    <Button label="+ Sim/Não" onPress={() => handleAddField('boolean')} style={styles.actionBtn} />
                    <Button label="+ Foto" onPress={() => handleAddField('image')} style={styles.actionBtn} />
                </View>
            </View>

            {/* Lista de Perguntas Adicionadas */}
            <View style={styles.fieldsContainer}>
                <Text style={styles.sectionTitle}>Perguntas ({fields.length})</Text>

                {fields.length === 0 ? (
                    <Text style={styles.emptyText}>Nenhuma pergunta adicionada ainda.</Text>
                ) : (
                    fields.map((field, index) => (
                        <View key={field.id} style={styles.fieldCard}>
                            <View style={styles.fieldHeader}>
                                <Text>{labelLegivel[field.type]}</Text>
                                <TouchableOpacity onPress={() => removeField(field.id)}>
                                    <Text style={styles.deleteText}>Remover</Text>
                                </TouchableOpacity>
                            </View>

                            <Input
                                placeholder="Digite a pergunta..."
                                value={field.label}
                                onChangeText={(text) => updateField(field.id, { label: text })}
                                style={styles.fieldInput}
                            />
                        </View>
                    ))
                )}
            </View>

           
            <Button
                label="Publicar Formulário"
                onPress={handleSalvar}
                style={styles.saveBtn}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        flexGrow: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 12,
    },
    actionsContainer: {
        marginBottom: 24,
    },
    buttonRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    actionBtn: {
        flex: 1,
        minWidth: '45%', // Para ficarem 2 botões por linha
        backgroundColor: '#4B5563', // Cinza escuro para diferenciar do botão principal
    },
    fieldsContainer: {
        marginBottom: 24,
    },
    emptyText: {
        color: '#6B7280',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 12,
    },
    fieldCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    fieldHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    fieldTypeBadge: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#2563EB',
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    deleteText: {
        color: '#DC2626',
        fontWeight: 'bold',
        fontSize: 14,
    },
    fieldInput: {
        marginBottom: 0, // Removendo a margem padrão do Input para caber melhor no card
    },
    saveBtn: {
        marginTop: 'auto', // Joga o botão para o final da tela
        backgroundColor: '#10B981', // Verde para indicar sucesso/salvar
    }
});