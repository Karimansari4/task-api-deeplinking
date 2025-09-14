import React, { useState } from "react";
import { View, FlatList, Image, Dimensions, StyleSheet, Text } from "react-native";
import FastImage from "react-native-fast-image";

const { width } = Dimensions.get("window");

const ImageCarousel = ({ images }: { images: string[] }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = (event: any) => {
        const slide = Math.ceil(event.nativeEvent.contentOffset.x / width);
        if (slide !== activeIndex) {
            setActiveIndex(slide);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <FastImage source={{ uri: item }} style={styles.image} />
                )}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            />

            {/* Dots */}
            <View style={styles.dotContainer}>
                {images.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            { opacity: index === activeIndex ? 1 : 0.3 },
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
        alignItems: "center",
    },
    image: {
        width: width,
        height: 250,
        resizeMode: "cover",
    },
    dotContainer: {
        flexDirection: "row",
        position: "absolute",
        bottom: 10,
    },
    dot: {
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: "#fff",
        margin: 4,
    },
});

export default ImageCarousel;
