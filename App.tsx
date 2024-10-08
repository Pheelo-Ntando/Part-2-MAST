import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker'; // Ensure picker is installed

const Stack = createNativeStackNavigator();

type Meal = {
  id: number;
  name: string;
  price: number;
  type: string;
};

// Predefined meals
const initialMeals: Meal[] = [
  { id: 1, name: 'Pizza', price: 100, type: 'Main Course' },
  { id: 2, name: 'Burgers', price: 95, type: 'Main Course' },
  { id: 3, name: 'Wings', price: 50, type: 'Dessert' },
  { id: 4, name: 'Onion Rings', price: 50, type: 'Dessert' },
  { id: 5, name: 'Red Velvet', price: 75, type: 'Starters' },
  { id: 6, name: 'Cheesecake', price: 75, type: 'Starters' },
];

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={MainScreen} />
        <Stack.Screen name="SecondPage" component={SecondPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MainScreen({ navigation }: any) {
  const [meals, setMeals] = useState<Meal[]>(initialMeals); // Set initial meals
  const [mealName, setMealName] = useState<string>('');
  const [mealPrice, setMealPrice] = useState<string>('');
  const [mealType, setMealType] = useState<string>('Main Course');

  const addMeal = () => {
    if (mealName && mealPrice) {
      const newMeal: Meal = {
        id: meals.length + 1,
        name: mealName,
        price: parseFloat(mealPrice),
        type: mealType,
      };
      setMeals([...meals, newMeal]);
      setMealName('');
      setMealPrice('');
    }
  };

  const removeMeal = (id: number) => {
    setMeals(meals.filter((meal) => meal.id !== id));
  };

  // Render meals by type (Main Course, Dessert, Starters)
  const renderMealsByType = (type: string) => {
    return meals.filter((meal) => meal.type === type).map((meal) => (
      <View key={meal.id} style={styles.mealItem}>
        <Text>
          {meal.name} ({meal.type}): R{meal.price.toFixed(2)}
        </Text>
        <TouchableOpacity onPress={() => removeMeal(meal.id)}>
          <Text style={styles.removeButton}>Remove</Text>
        </TouchableOpacity>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Meal Name"
        onChangeText={setMealName}
        value={mealName}
        style={styles.input}
      />
      <TextInput
        placeholder="Meal Price"
        onChangeText={setMealPrice}
        value={mealPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <Picker
        selectedValue={mealType}
        style={styles.picker}
        onValueChange={(itemValue) => setMealType(itemValue)}
      >
        <Picker.Item label="Main Course" value="Main Course" />
        <Picker.Item label="Dessert" value="Dessert" />
        <Picker.Item label="Starters" value="Starters" />
      </Picker>

      <TouchableOpacity style={styles.button} onPress={addMeal}>
        <Text style={styles.buttonText}>Add Meal</Text>
      </TouchableOpacity>

      <Text>Total Meals: {meals.length}</Text>

      <Text style={styles.header}>Main Course</Text>
      {renderMealsByType('Main Course')}

      <Text style={styles.header}>Dessert</Text>
      {renderMealsByType('Dessert')}

      <Text style={styles.header}>Starters</Text>
      {renderMealsByType('Starters')}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SecondPage', { meals })}>
        <Text style={styles.buttonText}>Next Page</Text>
      </TouchableOpacity>
    </View>
  );
}

function SecondPage({ route }:any) {
  const { meals } = route.params;
  const [selectedMeals, setSelectedMeals] = useState<number[]>([]);

  const toggleMealSelection = (id: number) => {
    setSelectedMeals((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((mealId) => mealId !== id)
        : [...prevSelected, id]
    );
  };

  const totalCost = selectedMeals.reduce((total, mealId) => {
    const selectedMeal = meals.find((meal) => meal.id === mealId);
    return total + (selectedMeal ? selectedMeal.price : 0);
  }, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select your meals:</Text>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleMealSelection(item.id)}>
            <Text
              style={{
                ...styles.mealText,
                backgroundColor: selectedMeals.includes(item.id) ? 'lightgreen' : 'white',
              }}
            >
              {item.name}: R{item.price.toFixed(2)}
            </Text>
          </TouchableOpacity>
        )}
      />
      <Text style={styles.totalCost}>Total Cost: R{totalCost.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 12,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'red',
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'lightblue',
    marginBottom: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  removeButton: {
    color: 'red',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  container: {
    padding: 20,
    backgroundColor: 'white',
    flex: 1,
  },
  button: {
    backgroundColor: 'blue',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'blue',
  },
  mealText: {
    padding: 10,
    fontSize: 16,
  },
  totalCost: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'red',
  },
});
