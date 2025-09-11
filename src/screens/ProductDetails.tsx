/* import { StyleSheet, Text, View, Image, ScrollView, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductDetailsView from '../components/ProductDetailsView';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'https://www.io.pixelsoftwares.com/task_api.php';
const API_HEADERS = { apikey: 'pixel' };

const ProductDetails = ({ route }: any) => {
    const { id } = route.params;
    const navigation = useNavigation<any>();

    const [productData, setProductData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const getSingleProduct = async () => {
        try {
            const response = await axios.post(`${API_URL}?product_id=${id}`, {}, { headers: API_HEADERS });
            console.log("respnse: ", response?.data?.data);

            setProductData(response.data.data?.products); // 👈 your backend sends { data: { product details } }
        } catch (error) {
            console.log("Error fetching product details: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getSingleProduct();
    }, []);


    // Pull to refresh
    const onRefresh = () => {
        setRefreshing(true);
        getSingleProduct();
    };

    if (!productData) {
        return (
            <View style={styles.loader}>
                <Text>No product details found.</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={productData}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                renderItem={({ item }) => (
                    <ProductDetailsView
                        key={item.id}
                        item={item}
                        onPress={() => navigation.navigate("ProductDetails", { id: item?.id })}
                    />
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </View>
    );
};

export default ProductDetails;

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
});
 */

import { StyleSheet, Text, View, Image, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import ProductDetailsView from '../components/ProductDetailsView';

const API_URL = 'https://www.io.pixelsoftwares.com/task_api.php';
const API_HEADERS = { apikey: 'pixel' };

const ProductDetails = ({ route }: any) => {
    const { id } = route.params;
    console.log("route.params: ", id);
    console.log("route.params: ", typeof id);

    const navigation = useNavigation<any>();

    const [productData, setProductData] = useState<any>(null);
    const [refreshing, setRefreshing] = useState(false);

    const getSingleProduct = async () => {
        try {
            const response = await axios.post(`${API_URL}?product_id=${Number(id)}`, {}, { headers: API_HEADERS });
            let result = response?.data?.data?.products

            // If API returns an array, find the one with matching id
            if (Array.isArray(result)) {
                const matched = result.find((item: any) => item.id === Number(id));
                setProductData(matched || null);
            } else {
                // If API returns a single product object
                setProductData(result);
            }
            // setProductData(response.data.data?.products?.[0]); // 👈 Take single product
        } catch (error) {
            console.log("Error fetching product details: ", error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        getSingleProduct();
    }, []);

    // Pull to refresh
    const onRefresh = () => {
        setRefreshing(true);
        getSingleProduct();
    };

    // Custom rating bar (without 3rd party library)
    const renderRating = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Text key={i} style={i <= rating ? styles.starActive : styles.starInactive}>
                    ★
                </Text>
            );
        }
        return <View style={styles.ratingContainer}>{stars}</View>;
    };

    return (
        <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            {productData ? (
                <ProductDetailsView item={productData} />
            ) : (
                <Text style={{ textAlign: "center", marginTop: 40 }}>No product details found</Text>
            )}
            {/* {productData ? (
                <>
                    <Image source={{ uri: productData.image }} style={styles.thumbnail} />

                    <View style={styles.header}>
                        <Text style={styles.title}>{productData.title}</Text>
                        <Text style={styles.price}>₹ {productData.price}</Text>
                    </View>

                    {renderRating(productData.rating || 4)}

                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{productData.description}</Text>

                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.backText}>← Back</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <Text style={{ textAlign: "center", marginTop: 40 }}>No product details found</Text>
            )} */}
        </ScrollView>
    );
};

export default ProductDetails;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    thumbnail: { width: "100%", height: 250, borderRadius: 10, marginBottom: 16 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    title: { fontSize: 20, fontWeight: "bold", flex: 1, flexWrap: "wrap" },
    price: { fontSize: 20, fontWeight: "bold", color: "green" },
    ratingContainer: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
    starActive: { color: "gold", fontSize: 22 },
    starInactive: { color: "#ccc", fontSize: 22 },
    sectionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 12 },
    description: { fontSize: 14, lineHeight: 20, color: "#444" },
    backButton: { marginTop: 20, padding: 10, backgroundColor: "#eee", borderRadius: 8, alignSelf: "flex-start" },
    backText: { fontSize: 16, color: "#333" },
});
