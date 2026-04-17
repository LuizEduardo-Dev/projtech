import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useFormStore, FieldType } from '../store/useFormStore';
import { useRouter, useLocalSearchParams } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome5';
import { Swipeable } from 'react-native-gesture-handler';


import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Checkbox } from '@/components/ui/Checkbox';

// Schema do Formulário
const formSchema = z.object({
    title: z.string().min(1, 'O título é obrigatório.'),
});
type FormData = z.infer<typeof formSchema>;

export default function CriarFormulario() {
    // 1. Lendo os Parâmetros da URL
    const { categoryId: paramCategoryId } = useLocalSearchParams<{ categoryId?: string }>();
    
    // 2. Estados de Controle
    const [isFieldModalVisible, setFieldModalVisible] = useState(false);
    // Modal de categoria só abre se NÃO recebemos o parâmetro na URL
    const [isCategoryModalVisible, setCategoryModalVisible] = useState(!paramCategoryId);
    const [chosenCategoryId, setChosenCategoryId] = useState<string | null>(paramCategoryId || null);
    
    const [configFieldId, setConfigFieldId] = useState<string | null>(null);

    const router = useRouter();
    const { fields, addField, publishForm, categories } = useFormStore();

    // 3. React Hook Form
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: { title: '' }
    });

    // 4. Ações
    const handleSelectCategory = (id: string) => {
        setChosenCategoryId(id);
        setCategoryModalVisible(false);
    };

      const handleSelectType = (type: FieldType) => {
        addField(type);
        setFieldModalVisible(false);
    };

    const renderRightActions = (id: string) => {
    const { removeField } = useFormStore.getState();
    return (
        <TouchableOpacity 
            style={styles.deleteAction} 
            onPress={() => removeField(id)}
            activeOpacity={0.6}
        >
            <FontAwesome name="trash" size={20} color="white" />
            <Text style={styles.deleteActionText}>Apagar</Text>
        </TouchableOpacity>
    );
};

    const onSubmit = (data: FormData) => {
        if (!chosenCategoryId) {
            Alert.alert('Atenção', 'Uma categoria é obrigatória.');
            return setCategoryModalVisible(true);
        }
        if (fields.length === 0) {
            return Alert.alert('Atenção', 'Adicione pelo menos uma pergunta.');
        }

        // Atualizamos o Zustand com os dados validados antes de publicar
        useFormStore.setState({ title: data.title, selectedCategoryId: chosenCategoryId });
        publishForm();
        router.replace('/');
    };

    const labelLegivel: Record<FieldType, string> = {
        text: 'Resposta em texto', number: 'Valor numérico', boolean: 'Pergunta Sim/Não', date: 'Data'
    };

    const opcoesCampo: { type: FieldType; label: string; icon: string }[] = [
        { type: 'text', label: 'Texto (Aberta)', icon: 'font' },
        { type: 'number', label: 'Número', icon: 'hashtag' },
        { type: 'boolean', label: 'Sim/Não', icon: 'check-square' },
        { type: 'date', label: 'Data', icon: 'calendar-alt' }
    ];

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.screen} keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 80}>
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                

                <View style={styles.flatSection}>
                    <Text style={styles.flatLabel}>Título da Auditoria</Text>
                    <Controller
                        control={control}
                        name="title"
                        render={({ field: { onChange, value } }) => (
                            <View>
                                <Input
                                    placeholder="Ex: Checklist de Frota"
                                    value={value}
                                    onChangeText={onChange}
                                    style={[styles.flatInput, errors.title && styles.inputError]}
                                />
                                {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}
                            </View>
                        )}
                    />
                </View>

                {/* Linha separadora discreta */}
                <View style={styles.separator} />

                {/* Sessão de Perguntas (Em breve com Drag and Drop!) */}
               <View style={styles.fieldsHeader}>
                    <Text style={styles.flatLabel}>Perguntas ({fields.length})</Text>
                    {/* O botão em forma de texto sumiu daqui! */}
                </View>

                {fields.length === 0 ? (
    <View style={styles.emptyState}>
        <FontAwesome name="clipboard-list" size={32} color="#CBD5E1" />
        <Text style={styles.emptyText}>Comece a construir seu formulário</Text>
    </View>
) : (
    fields.map((field) => (

        <Swipeable
            key={field.id}
            renderRightActions={() => renderRightActions(field.id)}
            friction={2} // Resistência ao deslizar
            rightThreshold={40} // Distância para ativar
            containerStyle={styles.swipeableContainer}
            
        >
            <View style={styles.flatFieldItem}>
                <View style={styles.fieldHeader}>
                    <View style={styles.badgeRow}>
                        <Text style={styles.fieldTypeBadge}>{labelLegivel[field.type]}</Text>
                        {field.required && (
                            <View style={styles.requiredBadge}>
                                <Text style={styles.requiredBadgeText}>Obrigatório</Text>
                            </View>
                        )}
                    </View>
                    
                    {/* Botão de lápis simplificado na direita */}
                    <TouchableOpacity 
                        onPress={() => setConfigFieldId(configFieldId === field.id ? null : field.id)}
                    >
                        <FontAwesome 
                            name="cog" 
                            size={16} 
                            color={configFieldId === field.id ? "#2563EB" : "#94A3B8"} 
                        />
                    </TouchableOpacity>
                </View>

                <Input
                    placeholder="Digite a pergunta..."
                    value={field.label}
                    onChangeText={(text) => useFormStore.getState().updateField(field.id, { label: text })}
                    style={styles.flatInputSecondary}
                />

                {/* Configurações Avançadas */}
                {configFieldId === field.id && (
                    <View style={styles.fieldConfigPanel}>
                        <Checkbox 
                            label="Campo Obrigatório?" 
                            checked={field.required} 
                            onPress={() => useFormStore.getState().updateField(field.id, { required: !field.required })}
                        />
                    </View>
                )}
            </View>
        </Swipeable>
                    ))
                )}


                <View style={styles.fabContainer}>
                    <TouchableOpacity style={styles.fabBtn} onPress={() => setFieldModalVisible(true)}>
                        <FontAwesome name="plus" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                <View style={styles.submitContainer}>
                    <Button label="Publicar" onPress={handleSubmit(onSubmit)} style={styles.publishBtn} />
                </View>

            </ScrollView>

            {/* MODAL 1: ESCOLHER CATEGORIA (Aparece 1x se vier do botão global) */}
            <Modal visible={isCategoryModalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Onde deseja salvar?</Text>
                        <Text style={styles.modalSubtitle}>Selecione a pasta para este formulário.</Text>
                        
                        <ScrollView style={{maxHeight: 300}}>
                            {categories.map((cat) => (
                                <TouchableOpacity key={cat.id} style={styles.catOption} onPress={() => handleSelectCategory(cat.id)}>
                                    <FontAwesome name="folder" size={16} color="#475569" style={{marginRight: 12}} />
                                    <Text style={styles.catOptionText}>{cat.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

               
                        <TouchableOpacity onPress={() => router.replace('/')} style={{marginTop: 16, alignItems: 'center'}}>
                            <Text style={{color: '#64748B'}}>Cancelar e voltar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* MODAL 2: TIPO DE CAMPO (Inalterado, apenas cores atualizadas no CSS) */}
             {/* Modal de Seleção de Tipo (Inalterado) */}
            <Modal
                visible={isFieldModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setFieldModalVisible(false)}
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

                        <TouchableOpacity onPress={() => setFieldModalVisible(false)} style={styles.modalCancelBtn}>
                            <Text style={styles.modalCancelText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#F8FAFC' }, // Slate 50 (Bem limpo)
    scrollContent: { padding: 24 },
    flatSection: { marginBottom: 16 },
    flatLabel: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
    flatInput: { backgroundColor: 'transparent', borderWidth: 0, borderBottomWidth: 2, borderColor: '#E2E8F0', fontSize: 20, paddingHorizontal: 0, fontWeight: '500', color: '#334155' },
    flatInputSecondary: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, fontSize: 16 },
    inputError: { borderColor: '#EF4444' },
    errorText: { color: '#EF4444', fontSize: 12, marginTop: 4, fontWeight: '500' },
    separator: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 24 },
    fieldsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    linkBtn: { color: '#2563EB', fontWeight: '600', fontSize: 14 },
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, backgroundColor: '#F1F5F9', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed' },
    emptyText: { color: '#94A3B8', marginTop: 12, fontWeight: '500' },
    flatFieldItem: {
        marginBottom: 0
     },
    fieldHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    fieldTypeBadge: { fontSize: 12, fontWeight: '700', color: '#64748B', backgroundColor: '#E2E8F0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, textTransform: 'uppercase' },
    submitContainer: { marginTop: 40, marginBottom: 40, alignItems: 'center' },
    publishBtn: { backgroundColor: '#0F172A',paddingHorizontal: 40, borderRadius: 8 }, // Botão escuro corporativo
    
    // Modals
    modalOverlay: { 
        flex: 1, 
        backgroundColor: 'rgba(15, 23, 42, 0.6)', 
        justifyContent: 'center', 
        padding: 24 
    },
    modalContent: { 
        backgroundColor: 'white', 
        borderRadius: 16, 
        padding: 24 
    },
    modalTitle: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        color: '#0F172A', 
        marginBottom: 4 
    },
    modalSubtitle: { 
        fontSize: 14, 
        color: '#64748B', 
        marginBottom: 20 
    },
    catOption: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: 16, 
        borderBottomWidth: 1, 
        borderColor:'#F1F5F9' 
    },
    catOptionText: { 
        fontSize: 16, 
        color: '#334155', 
        fontWeight: '500' 
    },
    fabContainer: { 
        alignItems: 'center', 
        marginTop: 16,
        marginBottom: 8,
    },
    fabBtn: {
        backgroundColor: '#10B981', // Verde
        width: 56,
        height: 56,
        borderRadius: 28, // Metade do tamanho para ficar um círculo perfeito
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4, // Sombra Android
        shadowColor: '#000', // Sombra iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },

    modalOption: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: 16, 
        borderBottomWidth: 1, 
        borderColor: '#F1F5F9' 
    },
    modalOptionText: { 
        fontSize: 16, 
        color: '#334155', 
        fontWeight: '500' 
    },
    modalCancelBtn: { 
        marginTop: 24, 
        alignItems: 'center', 
        paddingVertical: 12 
    },
    modalCancelText: { 
        color: '#EF4444', // Vermelho (Slate)
        fontWeight: 'bold', 
        fontSize: 16 
    },
    badgeRow: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center'
    },
    requiredBadge: {
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    requiredBadgeText: {
        fontSize: 10,
        color: '#DC2626',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    deleteAction: {
        backgroundColor: '#EF4444', // Vermelho vivo
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%', // Ocupa a altura total do item
    },
    deleteActionText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 4,
    },
    fieldConfigPanel: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
    },
    swipeableContainer: {
        marginBottom: 20, // Dá o espaçamento vertical entre os campos
        borderRadius: 8, // Mantém o visual arredondado do conjunto
        overflow: 'hidden', // Importante para o swipe não "vazar" nos cantos
    },
});