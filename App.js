import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TravelRequestScreen from './src/TravelRequestScreen';
import SearchResultsScreen from './src/SearchResultsScreen'
import { DataProvider } from './src/utils/DataContext';
const Stack = createStackNavigator();

export default function App() {
    return (

        <NavigationContainer>
            <DataProvider>
                <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="TravelRequestScreen">
                    <Stack.Screen name="TravelRequestScreen" component={TravelRequestScreen} />
                    <Stack.Screen name="SearchResultsScreen" component={SearchResultsScreen} />
                </Stack.Navigator>
            </DataProvider>
        </NavigationContainer>
    );
}
