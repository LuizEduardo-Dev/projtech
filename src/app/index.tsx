import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFormStore } from '../store/useFormStore';
import { useRouter } from 'expo-router';

export default function Dashboard() {
    const { publishedForms } = useFormStore();
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Auditorias Disponíveis</Text>
            
            {publishedForms.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>Nenhum formulário criado.</Text>
                    <TouchableOpacity onPress={() => router.push('/criar-form')}>
                        <Text style={styles.link}>Criar meu primeiro formulário</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList 
                    data={publishedForms}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={styles.card}
                            onPress={() => router.push({ pathname: '/testar-form', params: { formId: item.id } })}
                        >
                            <View>
                                <Text style={styles.cardTitle}>{item.title}</Text>
                                <Text style={styles.cardDate}>Criado em: {item.createdAt}</Text>
                            </View>
                            <Text style={styles.cardArrow}>→</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6', padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#1F2937' },
    list: { gap: 12 },
    card: { 
        backgroundColor: 'white', 
        padding: 16, 
        borderRadius: 12, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        elevation: 2, // Sombra no Android
        shadowColor: '#000', // Sombra no iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
    },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
    cardDate: { fontSize: 12, color: '#6B7280', marginTop: 4 },
    cardArrow: { fontSize: 20, color: '#2563EB' },
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { color: '#6B7280', fontSize: 16 },
    link: { color: '#2563EB', fontWeight: 'bold', marginTop: 10 }
});