import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useFormStore, FieldType } from '../store/useFormStore';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome5';
import { Checkbox } from '@/components/ui/Checkbox';
import { Picker } from '@react-native-picker/picker';

export default function CriarFormulario() {
    const [isModalVisible, setModalVisible] = useState(false);
    const [configFieldId, setConfigFieldId] = useState<string | null>(null);
    
    const router = useRouter();

    const {
        fields,
        title,
        setTitle,
        addField,
        removeField,
        updateField,
        publishForm,
        categories,
        selectedCategoryId,
        setSelectedCategory
    } = useFormStore();

    const opcoesCampo: { type: FieldType; label: string; icon: string }[] = [
        { type: 'text', label: 'Texto (Resposta Aberta)', icon: 'font' },
        { type: 'number', label: 'Número (Valor Exato)', icon: 'hashtag' },
        { type: 'boolean', label: 'Sim/Não (Confirmação)', icon: 'check-square' },
        { type: 'date', label: 'Data', icon: 'calendar-alt' }
    ];

 
    const labelLegivel: Record<FieldType, string> = {
        text: 'Resposta em texto',
        number: 'Valor numérico',
        boolean: 'Pergunta Sim/Não',
        date: 'Data'
    };

  
    const handleSelectType = (type: FieldType) => {
        addField(type);
        setModalVisible(false);
    };

    const handleSalvar = () => {
        if (!selectedCategoryId) {
            Alert.alert('Erro', 'Selecione uma categoria para o formulário.');
            return;
        }
        if (!title.trim()) {
            Alert.alert('Atenção', 'Dê um nome para o formulário.');
            return;
        }
        if (fields.length === 0) {
            Alert.alert('Atenção', 'Adicione pelo menos uma pergunta.');
            return;
        }

        publishForm();
        router.replace('/');
    };

    return (

        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: '#F3F4F6' }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 80} // Compensa a altura do header do Drawer
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >

                <View style={styles.infoBanner}>
                    <Text style={styles.infoBannerText}>
                        * Obs: Todos os formulários possuem funcionalidade de anexar arquivos por padrão.
                    </Text>
                </View>

                {/* Seleção de Categoria */}
                <View style={styles.header}>
                    <Text style={styles.sectionTitle}>Onde salvar este formulário?</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedCategoryId}
                            onValueChange={(itemValue) => setSelectedCategory(itemValue || "")}
                            dropdownIconColor="#2563EB"
                        >
                            <Picker.Item label="-- Selecione uma Categoria --" value={null} />
                            {categories.map((cat) => (
                                <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
                            ))}
                        </Picker>
                    </View>
                </View>

                {/* Configuração do Nome */}
                <View style={styles.header}>
                    <Text style={styles.sectionTitle}>Título do Formulário</Text>
                    <Input
                        placeholder="Ex: Checklist de Entrada de Veículos"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* Cabeçalho de Perguntas */}
                <View style={styles.fieldsHeaderContainer}>
                    <Text style={styles.sectionTitle}>Campos ({fields.length})</Text>
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addBtn}>
                        <Text style={styles.addBtnText}>+ Adicionar</Text>
                    </TouchableOpacity>
                </View>


                {fields.length === 0 ? (
                    <Text style={styles.emptyText}>Nenhum campo. Clique em "+ Adicionar" para começar.</Text>
                ) : (
                    fields.map((field) => (
                        <View key={field.id} style={styles.fieldCard}>
                            <View style={styles.fieldHeader}>
                                <Text style={styles.fieldTypeBadge}>{labelLegivel[field.type]}</Text>

                                <View style={styles.fieldActions}>
                                    <TouchableOpacity
                                        onPress={() => setConfigFieldId(configFieldId === field.id ? null : field.id)}
                                        style={styles.iconBtn}
                                    >
                                        <FontAwesome name="pencil-alt" size={16} color="#4B5563" />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => removeField(field.id)} style={styles.iconBtn}>
                                        <FontAwesome name="trash" size={16} color="#DC2626" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <Input
                                placeholder="Digite a pergunta..."
                                value={field.label}
                                onChangeText={(text) => updateField(field.id, { label: text })}
                                style={styles.fieldInput}
                            />

                            {/* Menu de Configuração da Pergunta (Abre com o lápis) */}
                            {configFieldId === field.id && (
                                <View style={styles.fieldConfigPanel}>
                                    <Checkbox
                                        label="Pergunta Obrigatória?"
                                        checked={field.required}
                                        onPress={() => updateField(field.id, { required: !field.required })}
                                    />
                                </View>
                            )}
                        </View>
                    ))
                )}


                <View style={styles.submitContainer}>
                    <Button label="Publicar Formulário" onPress={handleSalvar} style={styles.publishBtn} />
                </View>

            </ScrollView>

            {/* Modal de Seleção de Tipo (Inalterado) */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Tipo do campo</Text>
                        <Text style={styles.modalSubtitle}>O que o auditor deve responder?</Text>

                        {opcoesCampo.map((opcao) => (
                            <TouchableOpacity
                                key={opcao.type}
                                style={styles.modalOption}
                                onPress={() => handleSelectType(opcao.type)}
                            >
                                <FontAwesome name={opcao.icon} size={20} color="#4B5563" style={{ marginRight: 16 }} />
                                <Text style={styles.modalOptionText}>{opcao.label}</Text>
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCancelBtn}>
                            <Text style={styles.modalCancelText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );

}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    scrollContent: { padding: 24, paddingBottom: 100 }, // Espaço para o footer não tampar conteúdo
    infoBanner: {
        backgroundColor: '#EFF6FF', // Azul bem claro
        padding: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#3B82F6', // Borda azul lateral
        marginBottom: 24,
    },
    infoBannerText: { color: '#1E3A8A', fontSize: 13, lineHeight: 20 },
    header: { marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
    fieldsHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    addBtn: {
        backgroundColor: '#10B981', // Verde
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    addBtnText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
    fieldsContainer: { marginBottom: 24 },
    emptyText: { color: '#6B7280', fontStyle: 'italic', textAlign: 'center', marginTop: 24 },
    fieldCard: { backgroundColor: 'white', padding: 16, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
    fieldHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    fieldTypeBadge: { fontSize: 12, fontWeight: 'bold', color: '#4B5563', backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    deleteText: { color: '#DC2626', fontWeight: 'bold', fontSize: 14 },
    fieldInput: { marginBottom: 0 },

    submitContainer: {
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 10, // Dá um respiro legal pro fundo da tela
    },
    publishBtn: {
        backgroundColor: '#2563EB',
        width: '100%',
        maxWidth: 300, // Não deixa o botão ficar gigante em tablets
    },

    saveBtn: { backgroundColor: '#2563EB' },

    // Estilos do Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro transparente
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: 'white',
        width: '100%',
        borderRadius: 12,
        padding: 24,
        elevation: 5, // Sombra Android
        shadowColor: '#000', // Sombra iOS
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
    modalSubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 20 },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: '#F3F4F6',
    },
    modalOptionIcon: { fontSize: 24, marginRight: 16 },
    modalOptionText: { fontSize: 16, color: '#374151', fontWeight: '500' },
    modalCancelBtn: { marginTop: 24, alignItems: 'center', paddingVertical: 12 },
    modalCancelText: { color: '#DC2626', fontWeight: 'bold', fontSize: 16 },
    fieldActions: {
        flexDirection: 'row',
        gap: 16,
    },
    iconBtn: {
        padding: 4,
    },
    fieldConfigPanel: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderColor: '#E5E7EB',
    },

    pickerContainer: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        marginTop: 4,
        overflow: 'hidden', // Garante que o Picker respeite o border radius
    },

});