import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer screenOptions={{
          headerStyle: { backgroundColor: '#2563EB' }, // Um azul mais moderno (Tailwind blue-600)
          headerTintColor: '#fff',
          drawerActiveTintColor: '#2563EB',
      }}>
        <Drawer.Screen
          name="index" 
          options={{
            drawerLabel: 'Dashboard',
            title: 'Visão Geral',
          }}
        />
        <Drawer.Screen
          name="criar-form"  
          options={{
            drawerLabel: 'Criar Formulário',
            title: 'Novo Formulário',
          }}
        />
        <Drawer.Screen
          name="testar-form"
          options={{ drawerLabel: 'Testar Formulário', title: 'Preencher Auditoria', drawerItemStyle: {display: 'none'} }}  
        />
      </Drawer>

    </GestureHandlerRootView>
  );
}