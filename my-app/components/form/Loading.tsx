import { ActivityIndicator, View } from 'react-native';
import React, { FC } from 'react';
import { useAppSelector } from '@/core/redux/hooks';


const Loading: FC = () => {
    const { isShowLoading } = useAppSelector((state) => state.reducer.config);

    if (!isShowLoading) return null;

    return (
        <View
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <ActivityIndicator size="large" />
        </View>
    );
};

export default Loading;
