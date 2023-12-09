import React,{createRef} from "react";
import { StatusBar } from 'expo-status-bar';
import styles from '../styles'
import { Text, View,Dimensions,Image,Pressable } from 'react-native';
import Carousel,{Pagination} from 'react-native-snap-carousel';
import { connect } from "react-redux";
import { updateCarousel } from "../redux/actions";
import Proptypes from "prop-types";
import LottieView from "lottie-react-native";
import Alerter from "../components/alerter";
// import ContentLoader, { Facebook } from 'react-content-loader/native'

// const MyLoader = () => <ContentLoader animate={true} />
// const MyFacebookLoader = () => <Facebook animate={true} />


export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 1);

const data = [
    {
      id: 1,
      name: 'Welcome to the scheduler',
      url: require('../assets/hometask.json'),
    },
    {
      id: 3,
      name: 'Where task management is very easy',
      url: require('../assets/pentask.json'),
    },
    {
      id: 5,
      name: 'With top notch features and coolness',
      url: require('../assets/calendar.json'),
    },
];
  
  const renderItem = ({item}) => {
    return (
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          justifyContent: 'flex-start',
          // borderColor:"green",
          // borderWidth:2,
          // borderStyle:"solid"
        }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold',textAlign:"center"}}>
          {item.name}
        </Text>
        <LottieView
          source={item.url}
          autoPlay
          loop
          style={styles.homeImg}
        />
      </View>
    );
  };

class CarouselScreen extends React.Component {
    static propTypes = {
      updateCarousel: Proptypes.func.isRequired,
      carouselCheck: Proptypes.bool,
      moveToLogin: Proptypes.func.isRequired,
    }

    state = {
        index: 0,
        isCarousel :createRef(null),
    }

    goLogin = () => {
      this.setState({
        routeName: "Login"
      })
      this.props.updateCarousel(true);
      // this.props.navigation.navigate('Login');
    }
    goSignUp = () => {
      this.setState({
        routeName: "Signup"
      })
      this.props.updateCarousel(true);
      // this.props.navigation.navigate('Signup');
    }

    static getDerivedStateFromProps(nextProps,state){
      try{
          if (nextProps.carouselCheck) {
              nextProps.moveToLogin(state.routeName);
          }
          return null;
      }
      catch(error){
          return null;
      }
      
    }
    
    render() {
      return (
        <Alerter>
          <View style={[styles.container,styles.greyBack]}>
              <View style={{flexDirection:"row",alignItems:"center",paddingTop:15}}>
                <Image source={require("../assets/logo.png")} resizeMode="contain" style={styles.headerImg} />
                <Text style={[styles.header3]}>Scheduler</Text>
              </View>
              <Carousel
              // layout={'tinder'}
              ref={this.state.isCarousel}
              data={data}
              renderItem={renderItem}
              sliderWidth={SLIDER_WIDTH}
              itemWidth={ITEM_WIDTH}
              onSnapToItem={index => this.setState({index})}
              activeSlideAlignment="start"
              />
              <Pagination
                  dotsLength={data.length}
                  activeDotIndex={this.state.index}
                  carouselRef={this.state.isCarousel}
                  dotStyle={{
                  width: 30,
                  height: 5,
                  borderRadius: 5,
                  marginHorizontal: 8,
                  backgroundColor: '#3E4ADE',
                  }}
                  tappableDots={true}
                  inactiveDotStyle={{
                  backgroundColor: 'black',
                  // Define styles for inactive dots here
                  }}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
              // style={{borderWidth:2,borderColor:"black",borderStyle:"solid"}}
              />
              <View style={[styles.homestyle]}>
                <Pressable style={[styles.primaryBtn]} onPress={this.goLogin}>
                  <Text style={[styles.whiteColor,styles.buttonSize]}>Get started</Text>
                </Pressable>
                {/* <Pressable style={[styles.secondaryBtn]} onPress={this.goSignUp}>
                  <Text style={styles.buttonSize}>Sign up</Text>
                </Pressable> */}
                <StatusBar style="auto" />
              </View>
          </View>
        </Alerter>
      );
    }
}

const mapStateToProps = (state,ownProps) => ({
  carouselCheck: state.user.carouselCheck || null,
  moveToLogin: ownProps.moveToLogin,
})

export default connect(mapStateToProps,{updateCarousel})(CarouselScreen)