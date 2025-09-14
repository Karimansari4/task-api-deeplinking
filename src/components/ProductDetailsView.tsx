import { StyleSheet, Text, View, Image, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Reviews from './Reviews';
import ImageCarousel from './ImageCarousel';


const ProductDetailsView = ({ item }: any) => {
    return (
        <ScrollView style={styles.container}>
            {/* Product Image */}
            {/* <Image source={{ uri: item?.thumbnail }} style={styles.thumbnail} /> */}
            <ImageCarousel
                images={item?.images}
            />

            {/* Title & Price */}
            <View style={styles.header}>
                <Text style={styles.title}>{item?.title}</Text>
                <Text style={styles.price}>₹{item?.price}</Text>
            </View>
            <Text style={styles.price}>Discount: %{item?.discountPercentage}</Text>

            {/* Rating Bar */}
            <View style={styles.ratingContainer}>
                {Array.from({ length: 5 }).map((_, index) => (
                    <Text key={index} style={index < Math.round(item?.rating) ? styles.starActive : styles.starInactive}>★</Text>
                ))}
                <Text style={{ marginLeft: 8, color: '#555' }}>{item?.rating?.toFixed(1)}</Text>
            </View>

            {/* Brand & Stock */}
            <Text style={styles.text}>Brand: {item?.brand}</Text>
            <Text style={styles.text}>Stock: {item?.stock} ({item?.availabilityStatus})</Text>
            <Text style={styles.text}>Min Order Quantity: {item?.minimumOrderQuantity}</Text>
            <Text style={styles.text}>Warranty: {item?.warrantyInformation}</Text>
            <Text style={styles.text}>Return Policy: {item?.returnPolicy}</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.text}>Highlights: </Text>
                    <Text style={styles.text}>{item?.dimensions?.height}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.text}>Width: </Text>
                    <Text style={styles.text}>{item?.dimensions?.width}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.text}>Depth: </Text>
                    <Text style={styles.text}>{item?.dimensions?.depth}</Text>
                </View>
            </View>

            {/* Description */}
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{item?.description}</Text>

            {item?.reviews?.length > 0 && (
                <Reviews reviews={item?.reviews} />
            )}
        </ScrollView>
    )
}

export default ProductDetailsView
const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    loader: { flex: 1, justifyContent: "center", alignItems: "center" },
    thumbnail: { width: "100%", height: 250, borderRadius: 10, marginBottom: 16 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    title: { fontSize: 20, fontWeight: "bold", flex: 1, flexWrap: "wrap" },
    price: { fontSize: 20, fontWeight: "bold", color: "green" },
    ratingContainer: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
    starActive: { color: "gold", fontSize: 18 },
    starInactive: { color: "#ccc", fontSize: 18 },
    text: { fontSize: 14, marginVertical: 2, color: "#555" },
    sectionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 12 },
    description: { fontSize: 14, lineHeight: 20, color: "#444" },
    images: {
        width: '25%'
    }
});