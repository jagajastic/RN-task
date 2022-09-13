import { StatusBar } from 'expo-status-bar';
import {
	Alert,
	FlatList,
	SafeAreaView,
	StyleSheet,
	TextInput,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { transformDataToList } from './src/util';
import { RenderFooter } from './src/components/RenderFooter';
import { RenderEmpItem } from './src/components/RenderEmpItem';
import { TextWrapper } from './src/components/Text';
import BottomSheet from './src/components/BottomSheet';

export default function App() {
	const [coinList, setCoinList] = useState<string[]>([]);
	const [currentItem, setCurrentItem] = useState<{} | undefined>(undefined);
	const [rates, setRates] = useState<{ [key: string]: {} }>();
	const [search, setSearch] = useState('');
	const [masterData, setMasterData] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const fetchCoin = async () => {
		setLoading(true);
		try {
			const response = await axios.get(
				'https://staging-biz.coinprofile.co/v3/currency/rate'
			);
			const coins = transformDataToList(response.data.data.rates);
			setCoinList(coins);
			setMasterData(coins);
			setRates(response.data.data.rates);
			setLoading(false);
		} catch (error) {
			console.log({ error });
			setError('Something went wront, please try again');
			setLoading(false);
		}
	};

	const searchFilter = (text: string) => {
		if (text) {
			const arrayToString = masterData.join(' ');
			const regex = new RegExp(`(\\w*${text}\\w*)`, 'ig');
			const newData =
				(arrayToString.match(regex) && arrayToString.match(regex)) || [];
			setSearch(text);
			setCoinList(newData);
		} else {
			setSearch(text);
			setCoinList(masterData);
		}
	};

	useEffect(() => {
		fetchCoin();
	}, []);

	function handleRender({ item, index }: { item: string; index: number }) {
		const handleCurrentItem = (item: string) => {
			const newIem = rates && { ...rates[item], name: item };
			setCurrentItem(newIem);
		};
		return (
			<TouchableWithoutFeedback
				key={`${item}${index}`}
				onPress={() => handleCurrentItem(item)}
			>
				<View style={styles.coinDetails}>
					<View style={styles.textPill}>
						<TextWrapper style={styles.pillText}>
							{item.substring(0, 1)}
						</TextWrapper>
					</View>
					<TextWrapper style={styles.coinName}>{item}</TextWrapper>
				</View>
			</TouchableWithoutFeedback>
		);
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.wrapper}>
				<TextWrapper style={styles.title}>Welcome to Coin listing</TextWrapper>
				<TextInput
					style={styles.textInputStyle}
					value={search}
					placeholder="Search here"
					underlineColorAndroid={'transparent'}
					onChangeText={(text) => searchFilter(text)}
					clearButtonMode="always"
				/>

				<View style={styles.flatListContainer}>
					<FlatList
						data={coinList}
						showsVerticalScrollIndicator={false}
						keyExtractor={(item, index) => `${item + index.toString()}`}
						renderItem={handleRender}
						ItemSeparatorComponent={() => (
							<View style={styles.flatListSeparator} />
						)}
						contentContainerStyle={{ flexGrow: 1 }}
						ListFooterComponent={() => <RenderFooter loading={loading} />}
						ListEmptyComponent={() => (!loading ? <RenderEmpItem /> : null)}
					/>
				</View>
				<StatusBar style="auto" />
			</View>
			<BottomSheet visible={Boolean(currentItem)} close={setCurrentItem}>
				<TextWrapper>Name:</TextWrapper>
				<TextWrapper
					style={{
						marginBottom: 10,
					}}
				>
					{currentItem?.name}
				</TextWrapper>
				<TextWrapper>Rate:</TextWrapper>
				<TextWrapper>{currentItem?.rate}</TextWrapper>
			</BottomSheet>
			{error ? Alert.alert(error) : null}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	buttonOpen: {
		backgroundColor: '#F194FF',
	},
	buttonClose: {
		backgroundColor: '#2196F3',
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
	},
	textInputStyle: {
		height: 50,
		borderWidth: 1,
		padding: 5,
		paddingLeft: 20,
		borderColor: '#009688',
		borderRadius: 50 / 2,
	},
	textPill: {
		height: 70,
		width: 70,
		borderRadius: 28,
		paddingVertical: 20,
		borderWidth: 1,
		borderColor: '#CED0CE',
		justifyContent: 'center',
		alignItems: 'center',
		flexGrow: 0,
	},
	pillText: {
		fontSize: 20,
	},
	coinName: {
		marginLeft: 20,
		fontWeight: '600',
	},
	safeArea: {
		flex: 1,
		marginTop: '10%',
		marginBottom: '20%',
	},
	title: {
		fontSize: 26,
		fontWeight: '800',
		marginBottom: 18,
	},
	flatListContainer: {
		margin: 15,
		marginBottom: 110,
	},
	flatListSeparator: {
		marginBottom: 10,
		marginTop: 10,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: '#CED0CE',
	},
	coinDetails: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	wrapper: {
		margin: 15,
	},
});
