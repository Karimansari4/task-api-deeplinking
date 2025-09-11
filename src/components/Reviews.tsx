import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'

const Reviews = ({ reviews }: any) => {
    // Render custom stars
    const renderRating = (rating: number) => {
        const stars = []
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Text key={i} style={i <= rating ? styles.starActive : styles.starInactive}>
                    ★
                </Text>
            )
        }
        return <View style={styles.starContainer}>{stars}</View>
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Customer Reviews</Text>

            <FlatList
                data={reviews}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.header}>
                            <Text style={styles.name}>{item.reviewerName}</Text>
                            <Text style={styles.date}>
                                {new Date(item.date).toLocaleDateString()}
                            </Text>
                        </View>

                        {renderRating(item.rating)}

                        <Text style={styles.comment}>{item.comment}</Text>
                    </View>
                )}
            />
        </View>
    )
}

export default Reviews

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
        paddingHorizontal: 12,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#222',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        elevation: 2, // shadow for Android
        shadowColor: '#000', // shadow for iOS
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    name: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    date: {
        fontSize: 12,
        color: '#666',
    },
    starContainer: {
        flexDirection: 'row',
        marginVertical: 4,
    },
    starActive: {
        color: 'gold',
        fontSize: 18,
    },
    starInactive: {
        color: '#ccc',
        fontSize: 18,
    },
    comment: {
        fontSize: 14,
        color: '#444',
        marginTop: 4,
    },
})
