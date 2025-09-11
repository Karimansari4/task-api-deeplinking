import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import moment from 'moment';

// const { width } = Dimensions.get("window");
// const cardWidth = (width / 2) - 20; // 2 columns with margin


const ProductsView = ({ item, onPress }: any) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
            {/* Thumbnail */}
            <View style={{ width: "50%" }}>
                <Image source={{ uri: item.thumbnail }} style={styles.image} />
            </View>

            {/* Product Info */}
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.brand}>{item.brand}</Text>
                <Text style={styles.price}>₹{item.price}</Text>
                <Text style={styles.brand}>{moment(item?.meta?.createdAt).format("DD MMM YYYY")}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default ProductsView

const styles = StyleSheet.create({
    card: {
        width: "95%",
        margin: 8,
        borderRadius: 12,
        backgroundColor: '#fff',
        overflow: 'hidden',
        elevation: 4, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        flexDirection: "row"
    },
    image: {
        width: "100%",
        height: 140,
        resizeMode: "cover",
    },
    info: {
        width: "48%",
        padding: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    brand: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E91E63',
        marginTop: 4,
    },
});