import { StyleSheet, Text, View, Image, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { useNavigation } from '@react-navigation/native';
import ProductDetailsView from '../components/ProductDetailsView';

const API_URL = 'https://www.io.pixelsoftwares.com/task_api.php';
const API_HEADERS = { apikey: 'pixel' };

const ProductDetails = ({ route }: any) => {
    const { id } = route.params;
    // console.log("route.params: ", id);
    // console.log("route.params: ", typeof id);

    // const navigation = useNavigation<any>();

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

    return (
        <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            {productData ? (
                <ProductDetailsView item={productData} />
            ) : (
                <Text style={{ textAlign: "center", marginTop: 40 }}>No product details found</Text>
            )}
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
