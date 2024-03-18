import React, { useContext, useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { DataContext } from './utils/DataContext';
import moment from 'moment';
import { Checkbox } from 'react-native-paper';
const SearchResultsScreen = ({ route }) => {
    const { data } = route.params;
    const { filteredData } = useContext(DataContext);
    const [searchResults, setSearchResults] = useState(data)
    const [allData, setAllData] = useState(filteredData)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const selectedAirlines = ["IndiGo", "Air India"];
    const [checkedItems, setCheckedItems] = useState(selectedAirlines);
    const airlineNames = ["IndiGo", "Air India", "SpiceJet", "Vistara", "GoAir", "AirAsia"]

    const renderItem = ({ item }) => {
        const departureTime = moment(item.departureTime).format('hh:mm A');
        const arrivalTime = moment(item.arrivalTime).format('hh:mm A');
        return (
            <View style={styles.card}>
                <View style={styles.alignAirlines}>
                    <Text style={styles.airlineStyle}>{item.airline}</Text>
                    <Text style={styles.airlineStyle}>{item.flightNumber}</Text>
                </View>
                <View style={styles.alignAirlines}>
                    <View>
                        <Text style={styles.timeText}>{departureTime}</Text>
                        <Text style={styles.cityText}>{item.origin}</Text>
                    </View>
                    <View>
                        <Text style={styles.durationText}>{item.duration}</Text>
                        <LinearGradient colors={['#39ff14', '#196A0B']} style={styles.linearGradient} />
                        <Text style={styles.durationText}>Non stop</Text>
                    </View>
                    <View>
                        <Text style={styles.timeText}>{arrivalTime}</Text>
                        <Text style={styles.cityText}>{item.destination}</Text>
                    </View>
                    <View>
                        <Text style={styles.priceText}>{item.price}{"\u20B9"}</Text>
                        <Text style={styles.personText}>per adult</Text>
                    </View>
                </View>
                <View style={styles.borderLine} />
            </View>
        );
    }

    // Function to toggle modal visibility
    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    // Function to toggle sort order
    const toggleSortOrderAscending = () => {
        const sortedData = allData.slice().sort((a, b) => {
            return a.price - b.price; // Sort low to high
        });
        setSearchResults(sortedData);
        setIsModalVisible(false)
    };


    const handleCheckboxChange = (airline) => { 
        if (checkedItems.includes(airline)) {
            // Uncheck the airline if it's already checked
            setCheckedItems(checkedItems.filter(item => item !== airline));
        } else {
            // Check the airline if it's not already checked
            setCheckedItems([...checkedItems, airline]);
            checkedItems.push(airline)
        }
    };

    const CheckData =  useMemo(()=>{
        const filteredFlights = allData.filter(flight => checkedItems.includes(flight.airline));
        console.log("filteredFlights", checkedItems);
        setSearchResults(filteredFlights);
    }, [checkedItems])

    /* NOTE**** For Sort anc Filter i am using all data to show list and functionality is working fine  */

    const toggleSortOrderDesending = () => {
        const sortedData = allData.slice().sort((a, b) => {
            return b.price - a.price; // Sort low to high
        });
        setSearchResults(sortedData);
        setIsModalVisible(false)
    };

    // Modal content
    const ModalContent = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
                setIsModalVisible(!isModalVisible);
            }}
        >
            <View style={styles.modalContainer}>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.modalFilter}>Filter by:-</Text>
                        <TouchableOpacity onPress={toggleModal}>
                            <FontAwesome size={40} name='close' color='grey' />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.airlineText}>Airline</Text>
                    <>
                        {airlineNames.map((airline, index) => (
                            <Checkbox.Item
                                key={index}
                                label={airline}
                                status={checkedItems.includes(airline) ? 'checked' : 'unchecked'}
                                onPress={() => handleCheckboxChange(airline)}
                            />
                        ))}
                    </>
                    <Text style={styles.modalFilter}>Sort by:-</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.priceSortText}>Price {"\u20B9"}</Text>
                        <View>
                            <Text onPress={toggleSortOrderAscending} style={styles.priceSortText}>Cheapest First</Text>
                            <Text onPress={toggleSortOrderDesending} style={styles.priceSortText}>Highest First</Text>
                        </View>
                    </View>
                    <TouchableOpacity>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.maincontainer}>    
            <FlatList
                data={searchResults}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator= {false}
            />
            <TouchableOpacity style={styles.FilterContainer} onPress={toggleModal}>
                <FontAwesome size={40} name='sliders' color='#000' style={{ alignSelf: 'center' }} />
                <Text style={styles.filterText}>Sort & Filters</Text>
            </TouchableOpacity>
            <ModalContent />
        </View>

    );
};

const styles = StyleSheet.create({

    maincontainer: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#e1eef2'
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    airlineStyle: {
        fontSize: 15,
        marginBottom: 10,
        fontFamily: 'Poppins-Bold',
        color: '#000'
    },
    alignAirlines: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    borderLine: {
        borderWidth: 0.2,
        borderColor: '#D8DCD6',
        marginTop: 15
    },
    linearGradient: {
        width: '110%',
        height: 3,
        marginVertical: 1,
        alignSelf: 'center'
    },
    timeText: {
        fontSize: 12,
        fontFamily: 'Poppins-ExtraBold',
        color: '#000'
    },
    cityText: {
        fontSize: 12,
        fontFamily: 'Poppins-Medium',
        color: '#000'
    },
    durationText: {
        fontSize: 10,
        fontFamily: 'Poppins-SemiBold',
        color: '#000',
        alignSelf: 'center'
    },
    priceText: {
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
        color: '#000'
    },
    personText: {
        fontSize: 10,
        fontFamily: 'Poppins-SemiBold',
        color: '#000',
        alignSelf: 'center',
        bottom: 4
    },
    priceText: {
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
        color: '#000'
    },
    priceSortText: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: '#000'
    },
    personText: {
        fontSize: 10,
        fontFamily: 'Poppins-SemiBold',
        color: '#000',
        alignSelf: 'center',
        bottom: 4
    },
    FilterContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#1A43',
        padding: 10,
        borderRadius: 10,
    },
    filterText: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: '#000'
    },
    modalContainer: {
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
        backgroundColor: '#fff', // Semi-transparent background
        padding: 16
    },
    modalFilter: {
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
        color: '#000'
    },
    airlineText: {
        fontSize: 20,
        fontFamily: 'Poppins-Regular',
        color: '#000'
    },
    container: {
        height: '90%'
    }
});

export default SearchResultsScreen;
