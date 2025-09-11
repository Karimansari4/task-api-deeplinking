// src/ui/ProductCard.js
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

export default function ProductCard({ product, viewMode = 'grid', onPress }: any) {
    const containerStyle = viewMode === 'grid' ? { flex: 1 / 2, padding: 6 } : { padding: 6 };
    const innerStyle = { borderWidth: 1, padding: 8, borderRadius: 8 };

    return (
        <TouchableOpacity style={containerStyle} onPress={onPress}>
            <View style={innerStyle}>
                <Image source={{ uri: product.image || product.image_url }} style={{ width: '100%', height: 120, borderRadius: 6 }} />
                <Text numberOfLines={2} style={{ fontWeight: '600', marginTop: 8 }}>{product.name || product.title}</Text>
                <Text numberOfLines={2} style={{ color: '#555' }}>{product.short_description || product.description}</Text>
                <Text style={{ marginTop: 6, fontWeight: '700' }}>₹ {product.price ?? product.amount ?? '—'}</Text>
            </View>
        </TouchableOpacity>
    );
}
