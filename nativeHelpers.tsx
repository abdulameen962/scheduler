import React from 'react';
import NetInfo from '@react-native-community/netinfo';
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native"

/**
 * For checking network connection
 * @returns {boolean}
 */
export const checkConnection = () => {
    NetInfo.fetch().then(state => {
        return state.isConnected;
    })
};

interface LoaderProps {
    width: number;
    height: number;
}

/**
 * Content loader for showing loader while data is loading.
 * 
 * @see XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 * 
 * @example
 * <MyLoader width={400}
 * @param props 
 * @returns {React.ReactNode}
 */
export const MyLoader = (props:LoaderProps) => (
    <ContentLoader 
      speed={2}
      width={props.width}
      height={props.height}
      viewBox={`0 0 ${props.width} ${props.height}`}
      backgroundColor="#fafafa"
      foregroundColor="#dbd2d2"
      {...props}
    >
      <Rect x="349" y="12" rx="3" ry="3" width="51" height="7" /> 
      <Rect x="0" y="9" rx="12" ry="12" width="78" height="22" /> 
      <Rect x="0" y="45" rx="6" ry="6" width="276" height="10" /> 
      <Rect x="45" y="70" rx="3" ry="3" width="203" height="9" /> 
      <Rect x="1" y="115" rx="3" ry="3" width="210" height="9" /> 
      <Circle cx="15" cy="78" r="14" /> 
      <Rect x="230" y="13" rx="8" ry="8" width="92" height="13" />
    </ContentLoader>
) 