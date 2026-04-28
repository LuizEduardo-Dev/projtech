import React, { useCallback } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert, InteractionManager } from 'react-native';
import { useFormStore } from '../store/useFormStore';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import FontAwesome from '@expo/vector-icons/FontAwesome5';
import { Swipeable } from 'react-native-gesture-handler';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFocusEffect, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

const categorySchema = z.object({
    name: z.string().min(1, 'O nome da categoria não pode ser vazio.'),
});
type CategoryFormData = z.infer<typeof categorySchema>;

export default function CriarCategoria() {
    const { categories, addCategory, removeCategory } = useFormStore();
    const navigation = useNavigation();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: { name: '' }
    });


    useFocusEffect(
        useCallback(() => {
            reset({ name: '' });
        }, [reset])
    );

    const onSubmit = (data: CategoryFormData) => {
        addCategory(data.name.trim());

        reset({ name: '' });

        InteractionManager.runAfterInteractions(() => {
            Alert.alert(
                "Sucesso!",
                `Categoria "${data.name}" criada.`,
                [
                    {
                        text: "Ver nos Menus",
                        onPress: () => navigation.dispatch(DrawerActions.openDrawer())
                    },
                    { text: "OK", style: "cancel" }
                ]
            );
        });
    };

    const renderRightActions = (id: string) => (
        <TouchableOpacity
            style={styles.deleteAction}
            onPress={() => removeCategory(id)}
            activeOpacity={0.6}
        >
            <FontAwesome name="trash" size={20} color="white" />
            <Text style={styles.deleteActionText}>Apagar</Text>
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.screen} keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 80}>
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

                <View style={styles.flatSection}>
                    <Text style={styles.flatLabel}>Nova Categoria</Text>
                    <Text style={styles.subtitle}>Crie pastas para organizar seus formulários</Text>

                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, value } }) => (
                            <View>
                                <Input
                                    placeholder="Ex: Checklist de Frota"
                                    value={value}
                                    onChangeText={onChange}
                                    style={[styles.flatInput, errors.name && styles.inputError]}
                                />
                                {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
                            </View>
                        )}
                    />
                </View>

                <View style={styles.submitContainer}>
                    <Button label="Salvar Categoria" onPress={handleSubmit(onSubmit)} style={styles.saveBtn} />
                </View>

                <View style={styles.separator} />

                <Text style={styles.listTitle}>Categorias Existentes ({categories.length})</Text>

                <View style={styles.listContainer}>
                    {categories.length === 0 ? (
                        <Text style={styles.emptyText}>Nenhuma categoria criada ainda.</Text>
                    ) : (
                        categories.map((cat) => (
                            <Swipeable
                                key={cat.id}
                                renderRightActions={() => renderRightActions(cat.id)}
                                friction={2}
                                rightThreshold={40}
                            >
                                <View style={styles.flatCatItem}>
                                    <FontAwesome name="folder" size={16} color="#475569" />
                                    <Text style={styles.catName}>{cat.name}</Text>
                                </View>
                            </Swipeable>
                        ))
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#F8FAFC' }, // Fundo limpo corporativo
    scrollContent: { justifyContent: 'center', padding: 24 },
    flatSection: { marginBottom: 16 },
    flatLabel: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
    subtitle: { fontSize: 14, color: '#64748B', marginBottom: 16 },

    // Inputs
    flatInput: { backgroundColor: 'transparent', borderWidth: 0, borderBottomWidth: 2, borderColor: '#E2E8F0', fontSize: 20, paddingHorizontal: 0, fontWeight: '500', color: '#334155' },
    inputError: { borderColor: '#EF4444' },
    errorText: { color: '#EF4444', fontSize: 12, marginTop: 4, fontWeight: '500' },

    // Botão Centralizado e Menor
    submitContainer: { alignItems: 'center', marginTop: 16 },
    saveBtn: { backgroundColor: '#0F172A', paddingHorizontal: 32, borderRadius: 8 },

    separator: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 32 },

    listTitle: { fontSize: 16, fontWeight: 'bold', color: '#475569', marginBottom: 16 },
    listContainer: { backgroundColor: 'transparent' }, // Para o swipe não bugar
    emptyText: { color: '#94A3B8', fontStyle: 'italic', textAlign: 'center' },

    // Estilo Flat da Categoria
    flatCatItem: {
        backgroundColor: '#F8FAFC', // Cor do fundo da tela!
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderColor: '#E2E8F0',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    catName: { fontSize: 16, fontWeight: '600', color: '#334155' },

    // Estilos do Swipe
    deleteAction: {
        backgroundColor: '#EF4444',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
    },
    deleteActionText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 4,
    },
});