import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"

import Home from "./pages/Home"
import Points from "./pages/Points"
import Detail from "./pages/Detail"

const Stack = createStackNavigator()

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerShown: false,
          cardStyle: {
            backgroundColor: "#f0f0f5"
          }
        }}
      >
        <Stack.Screen component={Home} name="Home" />
        <Stack.Screen component={Points} name="Points" />
        <Stack.Screen component={Detail} name="Detail" />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Routes
