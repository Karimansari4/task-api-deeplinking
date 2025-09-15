import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import moment from 'moment';
import FastImage from 'react-native-fast-image';

// const { width } = Dimensions.get("window");
// const cardWidth = (width / 2) - 20; // 2 columns with margin

type Product = {
    id: number;
    title: string;
    brand: string;
    price: number;
    discountPercentage: number;
    rating: number;
    images: string[];
    thumbnail: string;
    meta: any
};


const ProductsView = ({ item, isGrid, onPress }: { item: Product; isGrid: boolean, onPress: any }) => {
    return (
        <TouchableOpacity style={[styles.card, isGrid ? styles.cardGrid : styles.cardList]} onPress={onPress}>
            <FastImage
                style={isGrid ? styles.imageGrid : styles.imageList}
                source={{ uri: item.thumbnail, priority: FastImage.priority.normal }}
                resizeMode={FastImage.resizeMode.cover}
            />
            <View style={styles.info}>
                <Text style={styles.brand}>{item?.brand}</Text>
                <Text style={styles.title} numberOfLines={1}>
                    {item.title}
                </Text>

                <View style={styles.priceRow}>
                    <Text style={styles.price}>₹{item?.price}</Text>
                    <Text style={styles.oldPrice}>
                        ₹{(item?.price + (item?.price * item?.discountPercentage) / 100)?.toFixed(0)}
                    </Text>
                </View>

                <Text style={styles.discount}>Save {item?.discountPercentage?.toFixed(0)}%</Text>
                <Text style={styles.rating}>⭐ {item?.rating?.toFixed(1)}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default ProductsView

const styles = StyleSheet.create({
    cardGrid: {
        flex: 1,          // ✅ takes half screen when inside row
        margin: 6,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 6,
    },
    col: {
        flex: 1,           // ✅ equal share
        margin: 4,
    },
    card: {
        backgroundColor: "#fff",
        margin: 6,
        borderRadius: 8,
        overflow: "hidden",
        elevation: 2,
        flex: 1,
    },
    cardList: {
        flexDirection: "row",
        alignItems: "center",
    },
    imageGrid: {
        width: "100%",
        height: 160,
        resizeMode: "cover",
    },
    imageList: {
        width: 100,
        height: 100,
        resizeMode: "cover",
    },
    info: {
        padding: 8,
        flex: 1,
    },
    brand: {
        fontWeight: "bold",
        fontSize: 14,
        color: "#222",
    },
    title: {
        fontSize: 12,
        color: "#555",
        marginVertical: 2,
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    price: {
        fontSize: 14,
        fontWeight: "600",
        color: "#000",
    },
    oldPrice: {
        fontSize: 12,
        color: "#888",
        marginLeft: 6,
        textDecorationLine: "line-through",
    },
    discount: {
        fontSize: 12,
        color: "green",
        marginTop: 2,
    },
    rating: {
        fontSize: 12,
        color: "#f39c12",
        marginTop: 2,
    },
});