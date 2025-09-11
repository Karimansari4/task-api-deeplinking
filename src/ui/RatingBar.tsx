// src/ui/RatingBar.js
import React from 'react';
import { View, Text } from 'react-native';

export default function RatingBar({ rating = 0, max = 5, size = 24 }) {
    // rating may be decimal, we'll show full and half-stars by simple rounding to nearest 0.5
    const rounded = Math.round(rating * 2) / 2;
    const stars = [];
    for (let i = 1; i <= max; i++) {
        if (i <= Math.floor(rounded)) stars.push('full');
        else if (i === Math.ceil(rounded) && rounded % 1 !== 0) stars.push('half');
        else stars.push('empty');
    }

    const starStyle = { fontSize: size, marginRight: 4 };
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {stars.map((s, idx) => {
                if (s === 'full') return <Text key={idx} style={starStyle}>★</Text>;
                if (s === 'half') return <Text key={idx} style={starStyle}>⯨</Text>; // fallback half-ish glyph
                return <Text key={idx} style={starStyle}>☆</Text>;
            })}
            <Text style={{ marginLeft: 8 }}>{rating.toFixed(1)}/{max}</Text>
        </View>
    );
}
