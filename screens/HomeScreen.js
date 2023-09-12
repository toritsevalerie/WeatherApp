import React, { useCallback, useState, useEffect } from "react";
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
import { fetchLocations, fetchWeatherForecast } from "../api/weather";
import { debounce } from "lodash";
import { weatherImages } from "../constants";
import * as Progress from "react-native-progress";

const { width, height } = Dimensions.get("screen");

const HomeScreen = () => {
  // initialize state for search toggle / animation
  const [showSearch, setShowSearch] = useState(false);

  // intitialize a state for location search
  const [locations, setLocations] = useState([]);

  //intializing state to store weather
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);

  const handleLocation = (loc) => {
    console.log("location: ", loc);
    setLocations([]);
    setShowSearch(false);
    fetchWeatherForecast({
      cityName: loc.name,
      days: "7",
    }).then((data) => {
      setWeather(data);
      console.log("got forecast: ", data);
    });
  };
  const handleSearch = (value) => {
    console.log("value:", value);
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then((data) => {
        console.log("got locations: ", data);
        setLocations(data);
      });
    }
  };

  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const fetchMyWeatherData = async () => {
    fetchWeatherForecast({
      cityName: "Toronto",
      days: "7",
    }).then((data) => {
      setWeather(data);
    });
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const { current, location } = weather;

  return (
    <View style={styles.homeScreenContainer}>
      <StatusBar style={styles.StatusBar} />
      <ImageBackground
        blurRadius={20}
        source={require("../assets/weatherAppBackgroundImage.png")}
        style={styles.backgroundImage}
      >
        {/* {loading ? (
          <View>
            <Text>Loading..</Text>
          </View>
        ) : ( {hi}
        )} */}
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
                  onChangeText={handleTextDebounce}
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
        {locations.length > 0 && showSearch ? (
          <View style={styles.citySearchResults}>
            {locations.map((loc, index) => {
              // conditional to not show bottom border at the end of the list/array
              return (
                <TouchableOpacity
                  onPress={() => {
                    handleLocation(loc);
                  }}
                  key={index}
                  style={[
                    styles.cityOptions,
                    index + 1 !== locations.length
                      ? { borderBottomWidth: 1, borderBottomColor: "black" }
                      : {},
                  ]}
                >
                  <MapPinIcon size={20} />
                  <Text style={styles.cityOptionsText}>
                    {loc?.name}, {loc?.country}
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
            {location?.name},
            <Text style={styles.citynameDisplayTwo}> {location?.country}</Text>
          </Text>
        </View>
        {/* image */}
        <View style={styles.weatherImageContainer}>
          <Image
            source={weatherImages[current?.condition?.text]}
            style={styles.weatherImageIcon}
          />
        </View>
        <View>
          <Text style={styles.temperature}>{current?.temp_c}°</Text>
          <Text style={styles.temperatureDescription}>
            {current?.condition?.text}
          </Text>
        </View>
        <View style={styles.dailyForecastContainer}>
          <View style={styles.dailyForecastTitleContainer}>
            <CalendarDaysIcon size={30} color="white" />
            <Text style={styles.dailyForecastTitle}>Daily Forecast</Text>
          </View>
          <ScrollView
            style={styles.dailyForecast}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {weather?.forecast?.forecastday?.map((item, index) => {
              console.log(weather.forecast.forecastday);
              let date = new Date(item.date);
              let options = { weekday: "long" };
              let dayName = date.toLocaleDateString("en-US", options);
              dayName = dayName.split(",")[0];
              return (
                <View
                  key={index}
                  style={styles.dailyForecastWeatherIconContainer}
                >
                  <Image
                    style={styles.dailyForecastWeatherIcons}
                    source={weatherImages[item?.day?.condition?.text]}
                  />
                  <Text style={styles.dailyForecastDay}>{dayName}</Text>
                  <Text style={styles.dailyForecastTemp}>
                    {item?.day?.avgtemp_c}°
                  </Text>
                </View>
              );
            })}
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
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
  temperatureDescription: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "medium",
    color: "white",
    marginTop: 10,
  },
  dailyForecastContainer: {
    marginTop: 20,
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
  dailyForecast: {
    marginTop: 20,
    marginLeft: 20,
  },
  dailyForecastWeatherIconContainer: {
    backgroundColor: theme.bgWhite(0.3),
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  dailyForecastWeatherIcons: {
    width: 70,
    height: 70,
  },
  dailyForecastDay: {
    color: "white",
    fontSize: 18,
    fontWeight: "medium",
    paddingTop: 6,
    textAlign: "center",
  },
  dailyForecastTemp: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    paddingTop: 6,
    paddingBottom: 6,
    textAlign: "center",
  },
});

export default HomeScreen;
