import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import theme from "../theme";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  CalendarDaysIcon,
} from "react-native-heroicons/outline";

const { width, height } = Dimensions.get("screen");

const HomeScreen = () => {
  // initialize state for search toggle / animation
  const [showSearch, setShowSearch] = useState(false);

  // intitialize a state for location search

  const [location, setLocation] = useState([1, 2, 3]);

  const handleLocationClick = () => {
    console.log("heeeeeey");
  };

  return (
    <View style={styles.homeScreenContainer}>
      <StatusBar style={styles.StatusBar} />
      <ImageBackground
        blurRadius={20}
        source={require("../assets/weatherAppBackgroundImage.png")}
        style={styles.backgroundImage}
      >
        {/* search section */}
        <SafeAreaView style={styles.search}>
          <View style={styles.searchContainer}>
            <View
              style={[
                styles.searchContainerHolder,
                {
                  backgroundColor: showSearch
                    ? theme.bgWhite(0.2)
                    : "transparent",
                },
              ]}
            >
              {showSearch ? (
                <TextInput
                  placeholder="  Search City"
                  placeholderTextColor={"lightgray"}
                  style={styles.searchPlaceholderText}
                />
              ) : null}

              <TouchableOpacity
                onPress={() => {
                  setShowSearch(!showSearch);
                }}
                style={styles.searchButton}
              >
                <MagnifyingGlassIcon size={25} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
        {location.length > 0 && showSearch ? (
          <View style={styles.citySearchResults}>
            {location.map((loc, index) => {
              // conditional to not show bottom border at the end of the list/array
              return (
                <TouchableOpacity
                  onPress={() => {
                    handleLocationClick;
                  }}
                  key={index}
                  style={[
                    styles.cityOptions,
                    index + 1 !== location.length
                      ? { borderBottomWidth: 1, borderBottomColor: "black" }
                      : {},
                  ]}
                >
                  <MapPinIcon size={20} />
                  <Text style={styles.cityOptionsText}>
                    London, United Kingdom
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}

        {/* forecast section */}
        {/* city name */}
        <View>
          <Text style={styles.citynameDisplay}>
            London,
            <Text style={styles.citynameDisplayTwo}> United Kingdom</Text>
          </Text>
        </View>
        {/* image */}
        <View style={styles.weatherImageContainer}>
          <Image
            source={require("../assets/partlycloudy.png")}
            style={styles.weatherImageIcon}
          />
        </View>
        <View>
          <Text style={styles.temperature}>23</Text>
          <Text style={styles.temperatureDescription}>Partly Cloudy</Text>
        </View>
        <View>
          <View style={styles.dailyForecastTitleContainer}>
            <CalendarDaysIcon size={30} color="white" />
            <Text style={styles.dailyForecastTitle}>Daily Forecast</Text>
          </View>
          <ScrollView>
            
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  homeScreenContainer: {
    flex: 1,
    backgroundColor: "pink",
  },
  backgroundImage: {
    width,
    height,
  },
  search: {
    display: "flex",
    position: "relative",
  },
  searchContainer: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
  },
  searchContainerHolder: {
    borderRadius: 10,
    paddingTop: 6,
    paddingBottom: 6,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 6,
  },
  searchPlaceholderText: {
    marginRight: 220,
  },
  searchButton: {
    backgroundColor: theme.bgWhite(0.3),
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 6,
  },
  citySearchResults: {
    backgroundColor: "white",
    marginTop: 10,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 10,
    position: "absolute",
    top: 130,
    left: 4,
    right: 4,
    zIndex: 1000,
  },
  cityOptions: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 18,
    paddingTop: 18,
    paddingLeft: 8,
  },
  cityOptionsText: {
    marginLeft: 8,
  },
  weatherImageContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },
  weatherImageIcon: {
    width: 200,
    height: 200,
  },
  citynameDisplay: {
    paddingTop: 10,
    fontSize: 24,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  citynameDisplayTwo: {
    fontSize: 22,
    fontWeight: "light",
  },
  temperature: {
    textAlign: "center",
    fontSize: 60,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
  temperatureDescription: {
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
  dailyForecastTitleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingLeft: 20,
  },
  dailyForecastTitle: {
    marginLeft: 5,
    color: "white",
    fontSize: "17",
  },
});

export default HomeScreen;
