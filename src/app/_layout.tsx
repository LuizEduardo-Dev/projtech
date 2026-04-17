import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
    <View style={{ flex: 1 }}>

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
          const forms = publishedForms.filter(f => f.categoryId === cat.id);

          return (
            <View key={cat.id}>
              {/* O "Pai" (A Categoria) Customizado */}
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, justifyContent: 'space-between' }}>

                {/* Área de Clique 1: Abre/Fecha a Gaveta */}
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                  onPress={() => toggleCategory(cat.id)}
                >
                  <FontAwesome name={isOpen ? "folder-open" : "folder"} size={16} color="#475569" />
                  <Text style={{ fontWeight: '600', color: '#1E293B', marginLeft: 12 }}>{cat.name}</Text>
                </TouchableOpacity>

                {/* Área de Clique 2: Ações da Direita */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>

                  <TouchableOpacity
                    onPress={() => {
                      router.push({ pathname: '/criar-form', params: { categoryId: cat.id } });
                    }}
                    style={{ padding: 4 }}
                  >
                    <FontAwesome name="plus" size={14} color="#10B981" />
                  </TouchableOpacity>

                  {forms.length > 0 && (
                    <TouchableOpacity onPress={() => toggleCategory(cat.id)} style={{ padding: 4 }}>
                      <FontAwesome name={isOpen ? 'chevron-up' : 'chevron-down'} size={12} color="#94A3B8" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Os "Filhos" (Os Formulários) continuam iguais */}
              {isOpen && forms.length > 0 && (
                <View style={{ paddingLeft: 32 }}>
                  {forms.map((form) => (
                    <DrawerItem
                      key={form.id}
                      label={form.title}
                      icon={() => <FontAwesome name="file-alt" size={14} color="#64748B" />}
                      onPress={() => router.push({ pathname: '/testar-form', params: { formId: form.id } })}
                    />
                  ))}
                </View>
              )}

              {isOpen && forms.length === 0 && (
                <Text style={{ marginLeft: 48, marginTop: 4, marginBottom: 12, fontSize: 12, color: '#94A3B8', fontStyle: 'italic' }}>
                  Nenhum formulário
                </Text>
              )}
            </View>
          );
        })}

      </DrawerContentScrollView>

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          backgroundColor: '#10B981', // Verde
          width: 56,
          height: 56,
          borderRadius: 28,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
        onPress={() => router.push('/criar-categoria')}
      >
        <FontAwesome name="folder-plus" size={20} color="white" />
      </TouchableOpacity>

    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Informamos ao Drawer que ele deve usar o nosso componente Customizado */}
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: '#515660' },
          headerTintColor: '#fff',
          drawerActiveTintColor: '#515660',
        }}
      >
        <Drawer.Screen
          name="index"
          options={{ drawerLabel: 'Dashboard', title: 'Visão Geral' }}
        />


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