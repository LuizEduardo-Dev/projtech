import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFormStore } from '../store/useFormStore';
import { useRouter } from 'expo-router';
import { Accordion } from '../components/ui/Accordion';
import FontAwesome from '@expo/vector-icons/FontAwesome5';

export default function Dashboard() {
    const { categories, publishedForms } = useFormStore();
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Auditorias Disponíveis</Text>
            
            <FlatList 
                data={categories}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item: category }) => {
                    const formsDaCategoria = publishedForms.filter(f => f.categoryId === category.id);
                    
                    return (
                        <Accordion title={category.name} badgeCount={formsDaCategoria.length}>
                            {formsDaCategoria.length === 0 ? (
                                <Text style={styles.emptyText}>Nenhum formulário nesta categoria.</Text>
                            ) : (
                                formsDaCategoria.map((form) => (
                                    <TouchableOpacity 
                                        key={form.id}
                                        style={styles.card}
                                        onPress={() => router.push({ pathname: '/testar-form', params: { formId: form.id } })}
                                    >
                                        <View>
                                            <Text style={styles.cardTitle}>{form.title}</Text>
                                            <Text style={styles.cardDate}>Criado em: {form.createdAt}</Text>
                                        </View>
                                        
                                        <FontAwesome name="chevron-right" size={14} color="#475569" />
                                    </TouchableOpacity>
                                ))
                            )}
                        </Accordion>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6', padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginBottom: 20 },
    list: { paddingBottom: 40 },
    emptyText: { color: '#6B7280', fontStyle: 'italic', paddingVertical: 8 },
    card: { 
        backgroundColor: '#F9FAFB', 
        padding: 12, 
        borderRadius: 8, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB'
    },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
    cardDate: { fontSize: 12, color: '#6B7280', marginTop: 4 },
    cardArrow: { fontSize: 20, color: '#475569' },
});