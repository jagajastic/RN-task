import React, { Dispatch, ReactNode, SetStateAction } from 'react';
import { View, StyleSheet, Modal, Pressable } from 'react-native';
import { TextWrapper } from './Text';

function BottomSheet({
	children,
	visible,
	close,
}: {
	children: ReactNode;
	visible: boolean;
	close: Dispatch<SetStateAction<{} | undefined>>;
}) {
	return (
		<Modal
			animated
			animationType="slide"
			visible={visible}
			transparent
			onRequestClose={() => close(undefined)}
		>
			<View style={styles.bottomSheetContainer}>
				<View style={styles.bottomSheetContentWrapper}>
					<View>{children}</View>
					<Pressable
						onPress={() => close(undefined)}
						style={{
							position: 'absolute',
							right: 20,
							top: 20,
							bottom: 20,
						}}
					>
						<TextWrapper style={styles.close}>Close</TextWrapper>
					</Pressable>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	bottomSheetContainer: {
		backgroundColor: 'rgba(0,0,0,0.2)',
		flex: 1,
		justifyContent: 'flex-end',
	},
	bottomSheetContentWrapper: {
		height: '40%',
		width: '100%',
		backgroundColor: 'white',
		position: 'absolute',
		borderRadius: 25,
		padding: 25,
	},
	close: {
		fontSize: 18,
	},
});

export default BottomSheet;
