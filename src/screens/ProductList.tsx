import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, RefreshControl, TextInput, SectionList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import ProductGrid from '../components/ProductGrid';
import moment from 'moment';

const API_URL = 'https://www.io.pixelsoftwares.com/task_api.php';
const API_HEADERS = { apikey: 'pixel' };

const ProductList = () => {
    const navigation = useNavigation<any>();

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    // const [hasMore, setHasMore] = useState(true);

    const [page, setPage] = useState(1); // Start with page 1
    const limit = 30; // Set the limit of items per page

    // const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [search, setSearch] = useState('');

    const sortByDateDesc = (items: any[]) => {
        return items.sort((a, b) => {
            const dateA = new Date(a.meta.createdAt).getTime();
            const dateB = new Date(b.meta.createdAt).getTime();
            return dateB - dateA; // 🔥 descending order
        });
    };

    const getProductLists = async (pageNum: number, isRefresh = false) => {
        if (loading) return;
        setLoading(true);

        try {
            const skip = (pageNum - 1) * limit; // calculate skip
            // console.log("skip: ", skip);
            // console.log("limit: ", limit);

            const response = await axios.get(
                `${API_URL}?skip=${skip}&limit=${limit}`,
                { headers: API_HEADERS }
            );
            // console.log("response: ", response?.data?.data);

            const totalItems = response?.data?.data?.total || 0;
            setTotal(totalItems);

            const newProducts = response?.data?.data?.products || [];

            if (isRefresh) {
                setProducts(sortByDateDesc(newProducts)); // replace
                setFiltered(sortByDateDesc(newProducts)); // for button pagination we replace
            } else {
                setProducts(sortByDateDesc(newProducts)); // for button pagination we replace
                setFiltered(sortByDateDesc(newProducts)); // for button pagination we replace
            }

            setPage(pageNum);
        } catch (error) {
            console.log("error on getProductList: ", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };


    useEffect(() => {
        getProductLists(1);
    }, []);

    const handleNextPage = () => {
        setPage((prevPage) => prevPage + 1);
        getProductLists(page + 1, true);
    };

    const handlePreviousPage = () => {
        if (page > 1) setPage((prevPage) => prevPage - 1);
        getProductLists(page - 1, true);
    };

    // Pull to refresh
    const onRefresh = () => {
        setRefreshing(true);
        getProductLists(1, true);
    };

    // Load more on scroll
    // const loadMore = () => {
    //     if (hasMore && !loading) {
    //         getProductLists(page + 1);
    //     }
    // };

    // 📌 Handle search
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

    return (
        <View style={{ flex: 1 }}>
            <View style={{ width: '100%', paddingHorizontal: '2%', marginTop: 20 }}>
                <TextInput style={styles.searchBox} placeholderTextColor={'#504d4dff'} placeholder="Search product..." value={search} onChangeText={handleSearch} />
            </View>
            <View style={styles.listView}>
                <Text style={styles.title}>Product List</Text>
            </View>
            <FlatList
                data={filtered}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                renderItem={({ item }) => (
                    <ProductGrid
                        key={item.id}
                        item={item}
                        onPress={() => navigation.navigate("ProductDetails", { id: item?.id })}
                    />
                )}
                numColumns={2} // 👈 show 2 per row
                columnWrapperStyle={{ justifyContent: "space-between" }} // spacing between items
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                // onEndReached={loadMore}
                // onEndReachedThreshold={0.5}
                ListFooterComponent={
                    loading ? <View style={{ flex: 1 }}><ActivityIndicator size="small" color="blue" /></View> : null
                }
            />

            {/* Pagination Buttons */}
            <View style={styles.pagination}>
                {/* Previous button */}
                <TouchableOpacity
                    disabled={page === 1}
                    style={[styles.pageBtn, page === 1 && styles.disabled]}
                    onPress={handlePreviousPage}
                >
                    <Text style={styles.pageText}>Previous</Text>
                </TouchableOpacity>

                {/* Page number */}
                <Text style={styles.pageNumber}>Page {page} / {Math.ceil(total / limit)}</Text>

                {/* Next button */}
                <TouchableOpacity
                    disabled={page >= Math.ceil(total / limit)}
                    style={[styles.pageBtn, page >= Math.ceil(total / limit) && styles.disabled]}
                    onPress={handleNextPage}
                // onPress={() => getProductLists(page + 1, true)}
                >
                    <Text style={styles.pageText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ProductList;

const styles = StyleSheet.create({
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        borderTopWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fff'
    },
    pageBtn: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: '#007bff',
        borderRadius: 6,
    },
    disabled: {
        backgroundColor: '#ccc',
    },
    pageText: {
        color: '#fff',
        fontWeight: '600',
    },
    pageNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        alignSelf: 'center',
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
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 5,
        backgroundColor: '#f2f2f2',
        padding: 5,
    },
    card: {
        backgroundColor: '#fff',
        padding: 12,
        marginVertical: 6,
        borderRadius: 8,
        elevation: 2,
    },
    title: { fontSize: 16, fontWeight: '600' },
    price: { color: 'green', fontWeight: 'bold' },
    listView: {
        borderWidth: 1,
        width: "100%",
        paddingHorizontal: "2%"
    }
});
