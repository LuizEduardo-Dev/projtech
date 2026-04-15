import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useFormStore } from '../store/useFormStore';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import FontAwesome from '@expo/vector-icons/FontAwesome5'; // Adicionamos os ícones!

export default function CriarCategoria() {
    const { categories, addCategory, removeCategory, updateCategory } = useFormStore();
    const [newCategory, setNewCategory] = useState('');
    
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleSave = () => {
        if (newCategory.trim()) {
            if (editingId) {
                // Se tem um ID em edição, a gente atualiza
                updateCategory(editingId, { name: newCategory.trim() });
                setEditingId(null); // Sai do modo de edição
            } else {
                // Se não tem, cria uma nova
                addCategory(newCategory.trim());
            }
            setNewCategory(''); 
        }
    };

    const handleEdit = (id: string, currentName: string) => {
        setEditingId(id);
        setNewCategory(currentName); // Joga o nome atual pro Input
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setNewCategory('');
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                
                <Text style={styles.title}>{editingId ? 'Editar Categoria' : 'Nova Categoria'}</Text>
                <Text style={styles.subtitle}>Crie pastas para organizar seus formulários</Text>
                
                <Input
                    placeholder="Nome (Ex: Tarja Preta)"
                    value={newCategory}
                    onChangeText={setNewCategory}
                />
                
                <View style={styles.btnWrapper}>
                   <Button 
                        label={editingId ? "Atualizar Categoria" : "Salvar Categoria"} 
                        onPress={handleSave} 
                        style={styles.saveBtn} 
                    />
                   {/* Botão de cancelar só aparece se estiver editando */}
                   {editingId && (
                       <TouchableOpacity onPress={handleCancelEdit} style={{ marginTop: 12 }}>
                           <Text style={{ color: '#6B7280', fontWeight: 'bold' }}>Cancelar Edição</Text>
                       </TouchableOpacity>
                   )}
                </View>

                <View style={styles.separator} />

                <Text style={styles.listTitle}>Categorias Existentes ({categories.length})</Text>
                
                <View style={styles.listContainer}>
                    {categories.map((cat) => (
                        <View key={cat.id} style={styles.catCard}>
                            <View style={styles.catInfo}>
                                <FontAwesome name="folder" size={16} color="#2563EB" />
                                <Text style={styles.catName}>{cat.name}</Text>
                            </View>
                            

                            <View style={styles.actionsRow}>
                                <TouchableOpacity onPress={() => handleEdit(cat.id, cat.name)} style={styles.actionBtn}>
                                    <FontAwesome name="pencil-alt" size={16} color="#4B5563" />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => removeCategory(cat.id)} style={styles.actionBtn}>
                                    <FontAwesome name="trash" size={16} color="#DC2626" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flexGrow: 1, 
        padding: 24, 
        backgroundColor: '#F3F4F6' 
    },
   
    title: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#111827', 
        marginBottom: 4 
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
    },
    btn: { 
        backgroundColor: '#10B981', 
        marginTop: 8 
    },
  
    separator: { 
        height: 1, 
        backgroundColor: '#D1D5DB',
        marginVertical: 24, // Dá um respiro em cima e embaixo
    },
    listTitle: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#4B5563', 
        marginBottom: 12 
    },
    listContainer: { 
        gap: 12 
    },
    catCard: { 
        backgroundColor: 'white', 
        padding: 16, 
        borderRadius: 8, 
        borderWidth: 1, 
        borderColor: '#D1D5DB',
        flexDirection: 'row', // Alinha os itens na horizontal
        justifyContent: 'space-between', // Joga a lixeira pro canto direito
        alignItems: 'center',
    },
    catInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12, // Espaço entre o ícone de pasta e o nome
    },
    catName: { 
        fontSize: 16, 
        fontWeight: '600', 
        color: '#374151' 
    },
    deleteBtn: {
        padding: 8, // Área de toque maior para não errar o dedo
    },
    btnWrapper: { 
        alignItems: 'center', marginTop: 15 
    },
    saveBtn: { 
        backgroundColor: '#10B981', width: '100%', maxWidth: 250 
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    actionBtn: {
        padding: 8,
    }
});