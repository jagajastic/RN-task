import { ActivityIndicator, View } from 'react-native';
export const RenderFooter = ({ loading }: { loading: boolean }) => {
	if (!loading) return null;
	return (
		<View
			style={{
				paddingVertical: 20,
				borderTopWidth: 1,
				borderColor: '#CED0CE',
			}}
		>
			<ActivityIndicator animating size="large" />
		</View>
	);
};
