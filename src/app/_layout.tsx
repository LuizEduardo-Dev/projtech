import React, { useState } from 'react';
import { View, Text } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome5';
import { useFormStore } from '../store/useFormStore'; 

function CustomDrawerContent(props: any) {
  const router = useRouter();
  const { categories, publishedForms } = useFormStore();
  
  // Estado para o menu de Administração
  const [expandedAdmin, setExpandedAdmin] = useState(false);
  
  // Estado dinâmico para as categorias (Guarda o ID das categorias que estão abertas)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [id]: !prev[id] // Inverte o estado apenas da categoria clicada
    }));
  };

  return (
    <DrawerContentScrollView {...props}>
      {/* Dashboard Oficial */}
      <DrawerItemList {...props} />

      <View style={{ height: 1, backgroundColor: '#E5E7EB', marginVertical: 8 }} />

      {/* --- MENU DE ADMINISTRAÇÃO --- */}
      <DrawerItem
        label={() => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <FontAwesome name="cogs" size={16} color="#374151" />
                <Text style={{ fontWeight: '600', color: '#374151' }}>Criação de Formulário</Text>
            </View>
            <FontAwesome name={expandedAdmin ? 'chevron-up' : 'chevron-down'} size={12} color="#6B7280" />
          </View>
        )}
        onPress={() => setExpandedAdmin(!expandedAdmin)}
      />

      {expandedAdmin && (
        <View style={{ backgroundColor: '#F3F4F6', paddingLeft: 16 }}>
          <DrawerItem
            label="Criar Categoria"
            icon={() => <FontAwesome name="folder-plus" size={14} color="#6B7280" />}
            onPress={() => router.push('/criar-categoria')}
          />
          <DrawerItem
            label="Criar Formulário"
            icon={() => <FontAwesome name="file-medical" size={14} color="#6B7280" />}
            onPress={() => router.push('/criar-form')}
          />
        </View>
      )}

      <View style={{ height: 1, backgroundColor: '#E5E7EB', marginVertical: 8 }} />
      <Text style={{ marginLeft: 16, marginTop: 8, marginBottom: 8, fontSize: 12, fontWeight: 'bold', color: '#9CA3AF', textTransform: 'uppercase' }}>
          Meus Modelos
      </Text>

      {/* --- RENDERIZAÇÃO DINÂMICA DAS CATEGORIAS --- */}
      {categories.map((cat) => {
        const isOpen = expandedCategories[cat.id];
        // Pega apenas os formulários desta categoria específica
        const forms = publishedForms.filter(f => f.categoryId === cat.id);

        return (
          <View key={cat.id}>
            {/* O "Pai" (A Categoria) */}
            <DrawerItem
              label={() => (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <FontAwesome name={isOpen ? "folder-open" : "folder"} size={16} color="#2563EB" />
                      <Text style={{ fontWeight: '600', color: '#111827' }}>{cat.name}</Text>
                  </View>
                  {forms.length > 0 && (
                    <FontAwesome name={isOpen ? 'chevron-up' : 'chevron-down'} size={12} color="#6B7280" />
                  )}
                </View>
              )}
              onPress={() => toggleCategory(cat.id)}
            />

            {/* Os "Filhos" (Os Formulários) */}
            {isOpen && forms.length > 0 && (
              <View style={{ paddingLeft: 32 }}>
                {forms.map((form) => (
                  <DrawerItem
                    key={form.id}
                    label={form.title}
                    icon={() => <FontAwesome name="file-alt" size={14} color="#4B5563" />}
                    onPress={() => router.push({ pathname: '/testar-form', params: { formId: form.id } })}
                  />
                ))}
              </View>
            )}

            {isOpen && forms.length === 0 && (
              <Text style={{ marginLeft: 48, marginTop: 4, marginBottom: 12, fontSize: 12, color: '#9CA3AF', fontStyle: 'italic' }}>
                  Vazio
              </Text>
            )}
          </View>
        );
      })}

    </DrawerContentScrollView>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Informamos ao Drawer que ele deve usar o nosso componente Customizado */}
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: '#2563EB' },
          headerTintColor: '#fff',
          drawerActiveTintColor: '#2563EB',
        }}
      >
        <Drawer.Screen
          name="index"
          options={{ drawerLabel: 'Dashboard', title: 'Visão Geral' }}
        />
        
        {/* Telas que existem no app, mas estão ESCONDIDAS do menu principal */}
        <Drawer.Screen
          name="criar-categoria"
          options={{ title: 'Categorias', drawerItemStyle: { display: 'none' } }}
        />
        <Drawer.Screen
          name="criar-form"
          options={{ title: 'Novo Formulário', drawerItemStyle: { display: 'none' } }}
        />
        <Drawer.Screen
          name="testar-form"
          options={{ title: 'Realizar Auditoria', drawerItemStyle: { display: 'none' } }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}