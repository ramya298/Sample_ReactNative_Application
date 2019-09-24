import React, { Component } from 'react';
import {Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

const Address = '121, Clear Water Bay Road \n \nClear Water Bay, Kowloon\n\nHONG KONG \n\nTel: +852 1234 5678 \n\nFax: +852 8765 4321 \n\nEmail:confusion@food.net'


function ContactInfo() {

    return (
        <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>  
        <Card
            title='Contact Information'
            dividerStyle={{ borderTopWidth: 0.5, borderColor: '#000000', opacity: 0.4 }}
            >
            <Text>{Address}</Text>
        </Card>
        </Animatable.View>
    );
}


class Contact extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ContactInfo />
        );

    }
}

export default Contact;



