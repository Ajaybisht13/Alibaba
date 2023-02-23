// import React from 'react';
// import { StyleSheet, View, Animated, Text, Platform, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
// import ArrowLeft from 'react-native-vector-icons/FontAwesome'
// import ArrowRightt from 'react-native-vector-icons/MaterialIcons'
// import ArrowRight from 'react-native-vector-icons/FontAwesome'
// import HeartPlus from 'react-native-vector-icons/MaterialCommunityIcons'
// import LinearGradient from 'react-native-linear-gradient';

// import useTinderCard from '../CarouselTest/useTinderCards';

// const datas = require('../../../../data2.json')

// function Product() {
//   const scrollRef = React.useRef();
//   const [data, _panResponder, animation, scale, opacity] = useTinderCard(datas);

//   const ScrollNext = (i, daaa) => {
//     scrollRef.current?.scrollTo({
//       x: 0,
//       animated: true,
//     });
//   };

//   return (
//     <SafeAreaView>
//       <LinearGradient colors={['#FFFFFF', '#F2FDFB']} style={{ height: "100%" }}>
//         <View style={styles.container}>
//           <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "68%" }}>
//             <ArrowLeft name='long-arrow-left' size={22} color="#A2A2A2" />
//             <Text style={{ color: "#A2A2A2", fontFamily: "Poppins-Regular", fontSize: 12 }}>Swipe left/right for more products</Text>
//             <ArrowRight name='long-arrow-right' size={22} color="#A2A2A2" />
//           </View>
//           {data
//             .slice(0, 3)
//             .reverse()
//             .map((item, index, items) => {
//               const isLastItem = index === items.length - 1;
//               const panHandlers = isLastItem ? { ..._panResponder.panHandlers } : {};
//               const isSecondToLast = index === items.length - 2;
//               const rotate = animation.x.interpolate({
//                 // inputRange: [-200, 0, 200],
//                 // outputRange: ['-30deg', '0deg', '30deg'],
//                 // extrapolate: 'clamp',
//                 inputRange: [0, 0],
//                 outputRange: ['0deg', '0deg'],
//                 extrapolate: 'clamp',
//               });

//               const animatedCardStyles = {
//                 transform: [{ rotate }, ...animation.getTranslateTransform()],
//                 opacity,
//               };

//               const cardStyle = isLastItem ? animatedCardStyles : undefined;
//               const nextStyle = isSecondToLast
//                 ? { transform: [{ scale: scale }], borderRadius: 10, width:"96%" }
//                 : undefined;

//               return (
//                 <Animated.View
//                   {...panHandlers}
//                   style={[styles.card, cardStyle, nextStyle]}
//                   key={item.id}>
//                   <View style={{ padding: "3%" }}>
//                     <View style={{ alignSelf: "flex-end", backgroundColor: "#FFFFFF" }}>
//                       <TouchableOpacity>
//                         <HeartPlus name='heart-plus-outline' size={25} color="#A2A2A2" />
//                       </TouchableOpacity>
//                     </View>
//                     <View>
//                       <View style={{}}>
//                         <Image
//                           source={{ uri: item.imgUrl }}
//                           style={styles.image}
//                           resizeMode="contain"
//                         />
//                         <Text style={styles.description}>{item.description}</Text>
//                       </View>
//                       <View style={{ marginTop: 5, backgroundColor: "#FFFFE0", width: "60%" }}>
//                         <Text style={styles.header}>{item.title}</Text>
//                       </View>
//                       <ScrollView horizontal = {true} contentContainerStyle={{ width: "100%" }}>
//                         {
//                           item.price.map((itemData, i) => {
//                             return (
//                               <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
//                                 <View>
//                                   <Text style={{ fontFamily: "HelveticaNeue Bold", fontSize: 18, color: "#000000" }}>{itemData.prices}</Text>
//                                   <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
//                                     <Text style={{ fontFamily: "HelveticaNeue Bold", fontSize: 16, color: "#000000" }}>{itemData.discount}</Text>
//                                     <Text style={{ fontFamily: "HelveticaNeue Bold", fontSize: 14, color: "#A2A2A2" }}>  {itemData.shipping}</Text>
//                                   </View>
//                                   <View style={{ display: "flex", flexDirection: "row" }}>
//                                     <Text style={{ fontFamily: "HelveticaNeue Medium", fontSize: 16, color: "#000000" }}>{itemData.pieces}</Text>
//                                     <Text style={{ fontFamily: "HelveticaNeue Medium", fontSize: 16, color: "#A2A2A2" }}> {itemData.piecesType}</Text>
//                                   </View>
//                                 </View>
//                                 <View>
//                                   <TouchableOpacity onPress={ScrollNext(i, itemData)}>
//                                     <ArrowRightt name='keyboard-arrow-right' size={25} color="#A2A2A2" />
//                                   </TouchableOpacity>
//                                 </View>
//                               </View>
//                             )
//                           })
//                         }
//                       </ScrollView>
//                       <View style={{}}>
//                         <Text style={{ fontFamily: "HelveticaNeue Bold", fontSize: 14, color: "#00B100", marginTop: 10 }}>{item.DeliveryTime}</Text>
//                       </View>
//                       <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
//                         <View style={{ display: "flex", flexDirection: "row", paddingTop: 15, alignItems: "center", justifyContent: "center" }}>
//                           <Text style={{ fontFamily: "HelveticaNeue Bold", fontSize: 11, color: "#000000" }}>{item.supplierTime}</Text>
//                           <Text style={{ fontFamily: "HelveticaNeue Bold", fontSize: 14, color: "#A2A2A2" }}> {item.supplierType}</Text>
//                         </View>
//                         <View style={{ height: 27, width: 35 }}>
//                           <Image source={require('../../Assets/Flag.png')} style={{ height: "100%", width: "100%" }} />
//                         </View>
//                       </View>
//                     </View>
//                   </View>
//                 </Animated.View>
//               );
//             })}
//         </View>
//         <View style={{ position: "absolute", bottom: -40, width: "100%", alignItems: "center", backgroundColor: "#F2FDFB" }}>
//           <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", height: 110, width: "80%" }}>
//             <TouchableOpacity style={{ height: 50, width: 133, borderColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
//               <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 20, color: "#284B46" }}>Discard</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={{ height: 50, width: 133, backgroundColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "2%" }}>
//               <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 20, color: "#FFFFFF" }}>Shortlist</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </LinearGradient>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // justifyContent: 'center',
//     alignItems: 'center',
//     padding: 10,
//     height: "100%"
//   },
//   card: {
//     width: '90%',
//     height: 552,
//     marginTop: "3%",
//     backgroundColor: '#FFFFFF',
//     position: 'absolute',
//     borderRadius: 10,
//     ...Platform.select({
//       android: {
//         elevation: 8,
//       },
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: {
//           width: 0,
//           height: 3,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 3,
//       },
//     }),
//     borderWidth: 1,
//     borderColor: '#FFF',
//   },
//   imageContainer: {
//     flex: 1
//   },
//   image: {
//     width: '100%',
//     height: 300
//   },
//   textContainer: {
//     padding: 10
//   },
//   nameText: {
//     fontSize: 16,
//   },
//   animalText: {
//     fontSize: 14,
//     color: '#757575',
//     paddingTop: 5
//   },
//   header: {
//     color: "#F8810A",
//     fontSize: 11,
//     fontWeight: "bold",
//     fontFamily: "HelveticaNeue Medium",
//   },
// });

// export default Product;
