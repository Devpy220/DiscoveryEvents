import { Stack } from 'expo-router';

export default function SellerLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Seller Login',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#6366f1',
          },
          headerTintColor: '#fff',
        }} 
      />
      <Stack.Screen 
        name="dashboard" 
        options={{ 
          title: 'Seller Dashboard',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#6366f1',
          },
          headerTintColor: '#fff',
        }} 
      />
    </Stack>
  );
}