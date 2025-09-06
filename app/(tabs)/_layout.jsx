import React from 'react';
import { Tabs } from "expo-router";
import { HugeiconsIcon } from '@hugeicons/react-native';
import { AnalyticsUpIcon, Home03Icon, SpoonAndForkFreeIcons, UserSquareIcon } from '@hugeicons/core-free-icons';

export default function TabLayout(){
    return(
        <Tabs screenOptions={{
            tabBarActiveTintColor:"#8837ff",
            headerShown:false
        }}>
            <Tabs.Screen name='Home' options={{
                tabBarIcon:({color,size})=>    <HugeiconsIcon
                icon={Home03Icon}
                size={size}
                color={color}
                strokeWidth={1.5}
    />
            }}/>
            <Tabs.Screen name='Meals'options={{
                tabBarIcon:({color,size})=>    <HugeiconsIcon
                icon={SpoonAndForkFreeIcons}
                size={size}
                color={color}
                strokeWidth={1.5}
    />
            }}/> 
            <Tabs.Screen name='Progress'options={{
                tabBarIcon:({color,size})=>    <HugeiconsIcon
                icon={AnalyticsUpIcon}
                size={size}
                color={color}
                strokeWidth={1.5}
    />
            }}/>
            <Tabs.Screen name='Profile'options={{
                tabBarIcon:({color,size})=>    <HugeiconsIcon
                icon={UserSquareIcon}
                size={size}
                color={color}
                strokeWidth={1.5}
    />
            }}/>
        </Tabs>
    )
}