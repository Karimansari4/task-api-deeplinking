import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    TextInput,
    Animated, Easing,
    SectionList
} from "react-native";
import axios from "axios";
import Feather from "react-native-vector-icons/Feather";
import moment from "moment";
import FastImage from "react-native-fast-image";
import { useNavigation } from "@react-navigation/native";

const API_URL = "https://www.io.pixelsoftwares.com/task_api.php";
const API_HEADERS = { apikey: "pixel" };

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

const ProductCard = ({ item, isGrid, onPress }: { item: Product; isGrid: boolean, onPress: any }) => {
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
    );
};

const ProductsCard = () => {
    const navigation = useNavigation<any>();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [isGrid, setIsGrid] = useState(true);
    const [isSearch, setIsSearch] = useState<boolean>(false);

    const [filtered, setFiltered] = useState<any[]>([]);
    const [search, setSearch] = useState('');

    const [searchAnim] = useState(new Animated.Value(0)); // 0 = hidden, 1 = visible

    const getProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}?skip=0&limit=20`, {
                headers: API_HEADERS,
            });
            const newProducts = response?.data?.data?.products || [];
            setProducts(newProducts);
            setFiltered(newProducts); // for button pagination we replace
        } catch (error) {
            console.log("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSearch = () => {
        setIsSearch(!isSearch);

        Animated.timing(searchAnim, {
            toValue: isSearch ? 0 : 1,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: false, // height animation cannot use native driver
        }).start();
    };


    useEffect(() => {
        getProducts();
    }, []);

    const handleSearch = (text: string) => {
        setSearch(text);
        if (text.trim() === '') {
            setFiltered(products);
        } else {
            const filteredData = products.filter((item) =>
                item.title.toLowerCase().includes(text.toLowerCase())
            );
            setFiltered(filteredData);
        }
    };

    // ✅ Always return flat products
    const groupByDate = (items: Product[]) => {
        const grouped: Record<string, Product[]> = {};

        items.forEach((item) => {
            const date = moment(item?.meta?.createdAt).startOf("day");
            let label = date.calendar(null, {
                sameDay: "[Today]",
                lastDay: "[Yesterday]",
                lastWeek: "DD MMM, YYYY",
                sameElse: "DD MMM, YYYY",
            });

            if (!grouped[label]) grouped[label] = [];
            grouped[label].push(item);
        });

        return Object.keys(grouped).map((date) => ({
            title: date,
            data: grouped[date], // ✅ flat list always
        }));
    };

    // console.log("groupByDate(filtered): ", groupByDate(filtered));


    return (
        <SafeAreaView style={styles.container}>
            {/* 🔹 Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Feather name="menu" size={24} color="#000" />
                    <Text style={styles.headerTitle}>Women</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={toggleSearch}>
                        <Feather name="search" size={22} color="#000" style={{ marginRight: 12 }} />
                    </TouchableOpacity>
                    <Feather name="heart" size={22} color="#000" style={{ marginRight: 12 }} />
                    <Feather name="shopping-cart" size={22} color="#000" />
                </View>
            </View>
            {isSearch && (
                <Animated.View
                    style={{
                        height: searchAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 60], // slide height
                        }),
                        marginTop: 10,
                        overflow: "hidden",
                        width: "100%",
                        paddingHorizontal: "2%",
                    }}
                >
                    <TextInput
                        style={styles.searchBox}
                        placeholder="Search product..."
                        value={search}
                        onChangeText={handleSearch}
                    />
                </Animated.View>
            )}
            <View style={styles.gridViewSelection}>
                <View>
                    <Text style={styles.itemCount}>{products.length} Items</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity>
                        <Feather name={"list"} size={22} color="#000" style={{ marginRight: 12 }} onPress={() => setIsGrid(false)} />
                        {isGrid ? <View /> : <View style={{ width: "60%", height: 2, backgroundColor: "#000" }}></View>}
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Feather name={"grid"} size={22} color="#000" style={{ marginRight: 12 }} onPress={() => setIsGrid(true)} />
                        {isGrid ? <View style={{ width: "60%", height: 2, backgroundColor: "#000" }}></View> : <View />}
                    </TouchableOpacity>
                </View>
            </View >


            {/* 🔹 Product List */}
            {
                loading ? (
                    <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
                ) : (
                    <SectionList
                        sections={groupByDate(filtered)}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item, index, section }) => {
                            if (isGrid) {
                                // console.log("index: ", index);
                                // console.log("item: ", item);
                                
                                // ✅ Two items per row
                                if (index % 2 === 0) {
                                    const secondItem = section.data[index + 1];
                                    return (
                                        <View style={styles.row}>
                                            <View style={styles.col}>
                                                <ProductCard item={item} isGrid={true} onPress={() => navigation.navigate("ProductDetails", { id: item?.id })} />
                                            </View>
                                            {secondItem ? (
                                                <View style={styles.col}>
                                                    <ProductCard item={secondItem} isGrid={true} onPress={() => navigation.navigate("ProductDetails", { id: secondItem?.id })} />
                                                </View>
                                            ) : (
                                                <View style={[styles.col, { opacity: 0 }]} /> // empty filler
                                            )}
                                        </View>
                                    );
                                }
                                return null; // skip rendering for odd index (already handled as second item)
                            }

                            // ✅ Normal list item
                            return (
                                <View style={styles.col}>
                                    <ProductCard item={item} isGrid={false} onPress={() => navigation.navigate("ProductDetails", { id: item?.id })} />
                                </View>
                            );
                        }}
                        renderSectionHeader={({ section: { title } }) => (
                            <Text style={styles.sectionHeaderView}>{title}</Text>
                        )}
                        stickySectionHeadersEnabled={false}
                        contentContainerStyle={{ paddingBottom: 50 }}
                    />
                )
            }
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 12,
        backgroundColor: "#fff",
        alignItems: "center",
        elevation: 4,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
    },
    headerRight: {
        flexDirection: "row",
        alignItems: "center",
    },
    itemCount: {
        fontSize: 14,
        color: "#555",
        marginVertical: 6,
        marginLeft: 12,
    },
    card: {
        backgroundColor: "#fff",
        margin: 6,
        borderRadius: 8,
        overflow: "hidden",
        elevation: 2,
        flex: 1,
    },
    /* cardGrid: {
        maxWidth: "48%",
    }, */
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
    gridViewSelection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderTopWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fff'
    },
    searchBox: {
        borderWidth: 1,
        borderColor: '#646060ff',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        color: "black"
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 12,
        marginTop: 10,
        color: "#666",
    },
    /* row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 6,
    }, */
    /* col: {
        flex: 1,
        margin: 4,
    }, */
    sectionHeaderView: {
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 12,
        marginTop: 10,
        color: "#666",
    },
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

});

export default ProductsCard;
