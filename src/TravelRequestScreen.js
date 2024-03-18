import React, { useState, useEffect, useContext } from 'react';
import { TextInput } from 'react-native-paper';
import { View, Text, TouchableOpacity, StyleSheet, Platform, FlatList, Image, ToastAndroid } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DataContext } from './utils/DataContext';


const TravelRequestScreen = ({ navigation }) => {
    const [departure, setDeparture] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState(new Date());
    const [returnDate, setReturnDate] = useState(new Date());
    const [showDeparturePicker, setShowDeparturePicker] = useState(false);
    const [showReturnPicker, setShowReturnPicker] = useState(false);
    const [passengers, setPassengers] = useState('1');
    const [Data, setData] = useState([])
    const [cities, setCities] = useState([]);
    const [showDestination, setshowDestination] = useState(false)
    const [departureCities, setDepartureCities] = useState([]);
    const [showDeparture, setshowDeparture] = useState(false)
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const { setFilteredData } = useContext(DataContext);



    const citiesList = ["Mumbai", "Bangalore", "Chennai", "Kolkata", "Delhi"];
    useEffect(() => {
        fetch('https://api.npoint.io/378e02e8e732bb1ac55b')
            .then(response => response.json())
            .then(res => {
                setData(res)
                setFilteredData(res)
            })
    }, [])

    const handleDepartureDateChange = (event, selectedDate) => {
        const currentDate = (selectedDate) || departureDate;
        setShowDeparturePicker(Platform.OS === 'ios'); // Show date picker only on iOS
        const dateFormat = formatDate(selectedDate)
        setDepartureDate(currentDate);
        setFromDate(dateFormat)
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };


    const handleReturnDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || returnDate;
        setShowReturnPicker(Platform.OS === 'ios'); // Show date picker only on iOS
        setReturnDate(currentDate);
        const dateFormat = formatDate(selectedDate)
        setToDate(dateFormat)
    };

    const handleSearchFlights = () => {
        if (departure && destination && passengers && fromDate) {
            const filterData = Data.filter((cities) => cities.origin === departure && cities.destination === destination)
            //Showing request data on the basis of Departure and destination cities, not doing any filter with date and time.Reason is we have less data to show in list.
            navigation.navigate('SearchResultsScreen', { data: filterData })
        } else {
            ToastAndroid.show("Please enter all required field", ToastAndroid.TOP)
        }
        //Data
    }

    const handleDepartureChange = (text) => {
        setDeparture(text)
        setshowDeparture(true)
        const filteredCities = citiesList.filter(city =>
            city.toLowerCase().includes(text.toLowerCase())
        );
        setDepartureCities(filteredCities);
    }

    const handleDepartureCitySelection = (city) => {
        setDeparture(city);
        setshowDeparture(false)
        setDepartureCities([]); // Clear the cities list after selection
    };
    const handleDestinationChange = (text) => {
        setDestination(text);
        setshowDestination(true)
        // Filter cities based on the input text
        const removedDepartureCity = citiesList.filter((city) => city !== departure)
        const filteredCities = removedDepartureCity.filter(city =>
            city.toLowerCase().includes(text.toLowerCase())
        );
        setCities(filteredCities);
    };

    const handleCitySelection = (city) => {
        setDestination(city);
        setshowDestination(false)
        setCities([]); // Clear the cities list after selection
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Travel Request</Text>
            <TextInput
                mode='outlined'
                label="Departure"
                placeholder="From"
                left={<TextInput.Icon icon="airplane" />}
                value={departure}
                onChangeText={handleDepartureChange}
                style={styles.marginTextInput}
            />
            {showDeparture && departureCities.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => handleDepartureCitySelection(item)}>
                    <Text style={styles.cityItem}>{item}</Text>
                </TouchableOpacity>
            ))}
            <TextInput
                mode='outlined'
                label="Destination"
                placeholder="To"
                left={<TextInput.Icon icon="airplane-landing" />}
                value={destination}
                onChangeText={handleDestinationChange}
                style={styles.marginTextInput}
            />
            {showDestination && cities.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => handleCitySelection(item)}>
                    <Text style={styles.cityItem}>{item}</Text>
                </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.input} onPress={() => setShowDeparturePicker(true)}>
                <Text style={styles.dateText}>{fromDate ? fromDate : "Depart"}</Text>
            </TouchableOpacity>
            {showDeparturePicker && (
                <DateTimePicker
                    value={departureDate}
                    mode="date"
                    display="default"
                    onChange={handleDepartureDateChange}
                    minimumDate={new Date()} // Set minimum date to current date
                />
            )}
            <TouchableOpacity style={styles.input} onPress={() => setShowReturnPicker(true)}>
                <Text style={styles.dateText}>{toDate ? toDate : "Return"}</Text>
            </TouchableOpacity>
            {showReturnPicker && (
                <DateTimePicker
                    value={returnDate}
                    mode="date"
                    display="default"
                    onChange={handleReturnDateChange}
                    minimumDate={departureDate} // Set minimum date to departure date
                />
            )}
            <TextInput
                mode='outlined'
                label="Passengers"
                placeholder="No of Travellers"
                value={passengers}
                onChangeText={setPassengers}
                style={styles.marginTextInput}
                keyboardType='numeric'
            />
            <TouchableOpacity style={styles.button} onPress={handleSearchFlights}>
                <Text style={styles.buttonText}>Search Flights</Text>
            </TouchableOpacity>
            <View style={styles.ImageContainer}>
                <Image
                    style={styles.flightImage}
                    source={require('./images/flight.jpg')}
                />
                <Text style={styles.logoText}>JETSETGO</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
        marginBottom: 20,
        color: '#000'
    },
    input: {
        marginBottom: 15,
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderWidth: 0.8,
        borderColor: '#000',
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
    },
    cityItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        color: '#000'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    marginTextInput: {
        marginBottom: 15
    },
    dateText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '800'
    },
    flightImage: {
        marginHorizontal: -20,
        height: '52%',
        width: '100%',
        borderRadius: 20
        //alignContent:'center'
    },
    ImageContainer: {
        alignItems: 'center',
        marginTop: 30
    },
    logoText: {
        fontSize: 22,
        fontFamily: 'Poppins-Bold',
        color: '#007bff'
    }
});

export default TravelRequestScreen;

