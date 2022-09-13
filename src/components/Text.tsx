import React, { ReactNode } from 'react';
import { Text } from 'react-native';

export const TextWrapper = React.memo((props) => {
	return <Text {...props} />;
});
